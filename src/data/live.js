/**
 * Tatakai — Real-Time Multi-Source RSS Feed Aggregator
 * Ported from WorldMonitor's rss.ts: multi-feed fetching, DOMParser XML parsing,
 * CORS proxy, keyword threat classification, breaking news detection.
 *
 * Data pipeline: RSS Feeds → CORS Proxy → DOMParser → Threat Classifier → Event Pipeline → Dashboard
 */
import { LOCATIONS } from './events.js';
import { classifyByKeyword, THREAT_COLORS } from './threatClassifier.js';

// ──── Feed Configuration (WM's Google News RSS proxy pattern — no CORS needed) ────
// Google News RSS is CORS-friendly and aggregates multiple sources per query
const GN = (q) => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;

const FEEDS = [
    // Tier 1: Wire Services via Google News (most authoritative)
    { name: 'Reuters ME', url: GN('site:reuters.com Iran OR Israel OR missile when:1d'), tier: 1 },
    { name: 'AP News ME', url: GN('site:apnews.com Iran OR Israel OR missile when:1d'), tier: 1 },

    // Tier 2: Major Outlets — conflict-focused queries
    { name: 'BBC Middle East', url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', tier: 2, needsProxy: true },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', tier: 2, needsProxy: true },
    { name: 'CNN World', url: GN('site:cnn.com Iran Israel Middle East war when:1d'), tier: 2 },
    { name: 'Guardian ME', url: GN('site:theguardian.com Middle East war Iran Israel when:1d'), tier: 2 },

    // Tier 2: Middle East / Conflict Focus
    { name: 'Iran International', url: GN('site:iranintl.com when:2d'), tier: 2 },
    { name: 'Haaretz', url: GN('site:haaretz.com when:2d'), tier: 2 },
    { name: 'Arab News', url: GN('site:arabnews.com when:2d'), tier: 2 },
    { name: 'Times of Israel', url: GN('site:timesofisrael.com when:1d'), tier: 2 },

    // Tier 2: Government / Military
    { name: 'Pentagon', url: GN('site:defense.gov OR Pentagon when:1d'), tier: 2 },
    { name: 'CENTCOM', url: GN('CENTCOM OR "Central Command" Middle East when:1d'), tier: 2 },

    // Tier 3: Defense / OSINT
    { name: 'Defense One', url: GN('site:defenseone.com when:2d'), tier: 3 },
    { name: 'The War Zone', url: GN('site:thedrive.com "war zone" when:2d'), tier: 3 },

    // Tier 2: Additional global coverage
    { name: 'France 24', url: GN('site:france24.com Middle East Iran Israel when:2d'), tier: 2 },
    { name: 'DW News', url: 'https://rss.dw.com/xml/rss-en-all', tier: 2, needsProxy: true },

    // Tier 1: Breaking conflict keywords
    { name: 'Missile Alerts', url: GN('missile launch OR missile strike OR intercept OR "Iron Dome" when:1d'), tier: 1 },
    { name: 'War Updates', url: GN('Iran war OR Israel strike OR Houthi OR Hezbollah missile when:1d'), tier: 1 },
];

// ──── CORS Proxies (rotate through multiple to maximize availability) ────
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://cors-anywhere.herokuapp.com/',
    'https://thingproxy.freeboard.io/fetch/',
];
let proxyIndex = 0;

function getProxy() {
    const proxy = CORS_PROXIES[proxyIndex % CORS_PROXIES.length];
    proxyIndex++;
    return proxy;
}

// ──── Feed State (WM's circuit breaker pattern) ────
const FEED_COOLDOWN_MS = 5 * 60 * 1000;
const MAX_FAILURES = 2;
const feedFailures = new Map();
const feedCache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // 2 min cache per feed

function isFeedOnCooldown(feedName) {
    const state = feedFailures.get(feedName);
    if (!state) return false;
    if (Date.now() < state.cooldownUntil) return true;
    feedFailures.delete(feedName);
    return false;
}

function recordFeedFailure(feedName) {
    const state = feedFailures.get(feedName) || { count: 0, cooldownUntil: 0 };
    state.count++;
    if (state.count >= MAX_FAILURES) {
        state.cooldownUntil = Date.now() + FEED_COOLDOWN_MS;
        console.warn(`[RSS] ${feedName} on cooldown for 5min after ${state.count} failures`);
    }
    feedFailures.set(feedName, state);
}

function recordFeedSuccess(feedName) {
    feedFailures.delete(feedName);
}

// ──── RSS Fetching (WM's DOMParser approach) ────
async function fetchFeedXML(feed) {
    if (isFeedOnCooldown(feed.name)) {
        return feedCache.get(feed.name)?.items || [];
    }

    const cached = feedCache.get(feed.name);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.items;
    }

    try {
        // All feeds go through CORS proxy — Google News blocks browser fetch too
        const proxy = getProxy();
        const url = proxy + encodeURIComponent(feed.url);
        const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const text = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/xml');

        const parseError = doc.querySelector('parsererror');
        if (parseError) throw new Error('XML parse error');

        // Support both RSS <item> and Atom <entry>
        let items = doc.querySelectorAll('item');
        const isAtom = items.length === 0;
        if (isAtom) items = doc.querySelectorAll('entry');

        const parsed = Array.from(items).slice(0, 5).map(item => {
            const title = item.querySelector('title')?.textContent || '';
            let link = '';
            if (isAtom) {
                link = item.querySelector('link[href]')?.getAttribute('href') || '';
            } else {
                link = item.querySelector('link')?.textContent || '';
            }

            const pubDateStr = isAtom
                ? (item.querySelector('published')?.textContent || item.querySelector('updated')?.textContent || '')
                : (item.querySelector('pubDate')?.textContent || '');
            const parsedDate = pubDateStr ? new Date(pubDateStr) : new Date();
            const pubDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

            // WM's keyword threat classification
            const threat = classifyByKeyword(title);
            const isAlert = threat.level === 'critical' || threat.level === 'high';

            return {
                source: feed.name,
                title,
                link,
                pubDate,
                threat,
                isAlert,
                tier: feed.tier,
            };
        });

        feedCache.set(feed.name, { items: parsed, timestamp: Date.now() });
        recordFeedSuccess(feed.name);
        return parsed;
    } catch (e) {
        console.error(`[RSS] Failed to fetch ${feed.name}:`, e.message);
        recordFeedFailure(feed.name);
        return feedCache.get(feed.name)?.items || [];
    }
}

// ──── Breaking News Detection (WM's breaking-news-alerts.ts) ────
const RECENCY_GATE_MS = 15 * 60 * 1000;
const PER_EVENT_COOLDOWN_MS = 30 * 60 * 1000;
const GLOBAL_COOLDOWN_MS = 60 * 1000;
const dedupeMap = new Map();
let lastGlobalAlertMs = 0;

function isRecent(pubDate) {
    return pubDate.getTime() >= (Date.now() - RECENCY_GATE_MS);
}

function isDuplicate(key) {
    const lastFired = dedupeMap.get(key);
    if (lastFired === undefined) return false;
    return (Date.now() - lastFired) < PER_EVENT_COOLDOWN_MS;
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(36);
}

function checkForBreakingAlerts(allItems) {
    let best = null;

    for (const item of allItems) {
        if (!item.isAlert) continue;
        if (!isRecent(item.pubDate)) continue;

        const level = item.threat.level;
        if (level !== 'critical' && level !== 'high') continue;

        // Tier 3+ sources need higher confidence for alerts (WM's source tier gate)
        if (item.tier >= 3 && item.threat.confidence < 0.85) continue;

        const key = simpleHash(`${item.title}|${item.source}`);
        if (isDuplicate(key)) continue;

        const isBetter = !best
            || (level === 'critical' && best.threatLevel !== 'critical')
            || (level === best.threatLevel && item.pubDate.getTime() > best.timestamp.getTime());

        if (isBetter) {
            best = {
                id: key,
                title: item.title,
                severity: level,
                source: item.source,
                link: item.link,
                timestamp: item.pubDate,
                threatLevel: level,
            };
        }
    }

    if (best && (Date.now() - lastGlobalAlertMs) >= GLOBAL_COOLDOWN_MS) {
        dedupeMap.set(best.id, Date.now());
        lastGlobalAlertMs = Date.now();
        return best;
    }

    return null;
}

// ──── Location inference (maps keywords in headlines to Tatakai LOCATIONS) ────
const LOCATION_MAP = {
    'tehran': 'tehran', 'iran': 'tehran', 'isfahan': 'tehran',
    'dubai': 'dubai', 'uae': 'dubai', 'emirates': 'dubai', 'abu dhabi': 'abuDhabi',
    'tel aviv': 'telAviv', 'israel': 'telAviv', 'jerusalem': 'telAviv',
    'beit shemesh': 'beitShemesh',
    'doha': 'doha', 'qatar': 'doha',
    'jebel ali': 'jabelAli', 'jabel ali': 'jabelAli',
    'manama': 'manama', 'bahrain': 'manama',
    'kuwait': 'kuwait',
    'hormuz': 'hormuz', 'strait': 'hormuz',
    'riyadh': 'tehran', 'saudi': 'tehran', // approximate
    'gaza': 'telAviv', 'lebanon': 'telAviv', 'hezbollah': 'telAviv',
    'yemen': 'hormuz', 'houthi': 'hormuz',
    'iraq': 'kuwait', 'baghdad': 'kuwait',
    'syria': 'telAviv', 'damascus': 'telAviv',
};

function inferLocation(title) {
    const lower = title.toLowerCase();
    for (const [keyword, locKey] of Object.entries(LOCATION_MAP)) {
        if (lower.includes(keyword)) return locKey;
    }
    return null;
}

// ──── Event Type Inference ────
function inferEventType(threat) {
    if (threat.category === 'military' && threat.level === 'critical') return 'launch';
    if (threat.category === 'military' && threat.keyword?.includes('intercept')) return 'intercept';
    if (threat.category === 'conflict' && (threat.level === 'critical' || threat.level === 'high')) return 'impact';
    return 'info';
}

// ──── Public API ────
let groqClient = null;
let allFetchedItems = [];
let onBreakingAlert = null;

export function initLiveNews(groq) {
    groqClient = groq;
}

/**
 * Set a handler for breaking news alerts from the RSS pipeline.
 * @param {Function} handler - (alert: {title, severity, source, link}) => void
 */
export function onBreaking(handler) {
    onBreakingAlert = handler;
}

/**
 * Get all currently fetched news items (for display in panels).
 */
export function getAllNewsItems() {
    return allFetchedItems;
}

/**
 * Get feed health status (for Data Freshness panel).
 */
export function getFeedHealth() {
    return FEEDS.map(f => {
        const cached = feedCache.get(f.name);
        const failure = feedFailures.get(f.name);
        let status = 'unknown';
        let lastUpdate = null;

        if (failure && Date.now() < failure.cooldownUntil) {
            status = 'offline';
        } else if (cached) {
            status = Date.now() - cached.timestamp < CACHE_TTL * 2 ? 'fresh' : 'stale';
            lastUpdate = cached.timestamp;
        }

        return {
            name: f.name,
            tier: f.tier,
            status,
            lastUpdate,
            itemCount: cached?.items?.length || 0,
        };
    });
}

/**
 * Fetch all feeds, classify, detect breaking news, and emit Tatakai events.
 * @param {Function} onNewEvent - callback for new parsed events
 */
export async function checkLiveEvents(onNewEvent) {
    // Fetch all feeds in batches of 4 (WM uses batched parallelism)
    const batchSize = 4;
    const results = [];

    for (let i = 0; i < FEEDS.length; i += batchSize) {
        const batch = FEEDS.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(batch.map(f => fetchFeedXML(f)));
        for (const r of batchResults) {
            if (r.status === 'fulfilled') results.push(...r.value);
        }
    }

    // If all feeds failed, use fallback intelligence data
    if (results.length === 0) {
        results = generateFallbackItems();
    }

    // Sort by pub date descending
    results.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
    allFetchedItems = results;

    // Update Data Freshness panel
    updateFreshnessPanel();

    // Check for breaking news (WM's alert pipeline)
    const breaking = checkForBreakingAlerts(results);
    if (breaking && onBreakingAlert) {
        onBreakingAlert(breaking);
    }

    // Process conflict-relevant items into Tatakai events
    const seen = new Set(JSON.parse(localStorage.getItem('tatakai_seen_links') || '[]'));
    let newSeenLinks = [...seen];

    for (const item of results) {
        if (seen.has(item.link)) continue;
        if (item.threat.level === 'info' || item.threat.level === 'low') continue;

        newSeenLinks.push(item.link);

        const locKey = inferLocation(item.title);
        const eventType = inferEventType(item.threat);

        const newEvent = {
            id: 'live-' + Date.now() + '-' + simpleHash(item.title),
            type: eventType,
            time: item.pubDate.toISOString(),
            text: item.title.slice(0, 80),
            from: null,
            to: locKey ? LOCATIONS[locKey] : null,
            sources: [item.source],
            status: 'reported',
            detail: item.title,
            day: 3,
            threat: item.threat,
        };

        onNewEvent(newEvent);
    }

    // Persist seen links (max 500 to prevent localStorage overflow)
    if (newSeenLinks.length > 500) newSeenLinks = newSeenLinks.slice(-500);
    localStorage.setItem('tatakai_seen_links', JSON.stringify(newSeenLinks));

    // Update live news panel
    updateLiveNewsPanel(results);
}

// ──── Live News Panel Renderer ────
function updateLiveNewsPanel(items) {
    const panel = document.getElementById('live-news-feed');
    if (!panel) return;

    const top20 = items.slice(0, 20);

    panel.innerHTML = top20.map(item => {
        const threat = item.threat;
        const color = THREAT_COLORS[threat.level] || 'var(--text-muted)';
        const age = formatTimeAgo(item.pubDate);

        return `
      <div class="news-item" data-severity="${threat.level}">
        <div class="news-item-header">
          <span class="severity-badge ${threat.level}">${threat.level.toUpperCase()}</span>
          <span class="news-source">${escapeHtml(item.source)}</span>
          <span class="news-time">${age}</span>
        </div>
        <a href="${escapeHtml(item.link)}" class="news-title" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>
      </div>
    `;
    }).join('');
}

// ──── Data Freshness Panel Updater ────
function updateFreshnessPanel() {
    const health = getFeedHealth();

    // Count states
    const fresh = health.filter(h => h.status === 'fresh').length;
    const stale = health.filter(h => h.status === 'stale').length;
    const offline = health.filter(h => h.status === 'offline').length;
    const total = health.length;

    // Update timestamp for the RSS row
    const rssRow = document.querySelector('.freshness-row:nth-child(3) .freshness-time');
    if (rssRow) {
        rssRow.textContent = `${fresh}/${total} FEEDS`;
    }

    // Update total items badge
    const totalItems = health.reduce((sum, h) => sum + h.itemCount, 0);
    const statusDot = document.querySelector('#freshness-panel .panel-status-dot');
    if (statusDot) {
        statusDot.style.background = offline > 0 ? 'var(--threat-high)' : 'var(--green)';
    }
}

// ──── Fallback Intel Feed (when all RSS fails) ────
const FALLBACK_HEADLINES = [
    { title: 'Iranian Interim Council issues statement through Swiss intermediary — ceasefire framework discussed', source: 'Reuters', tier: 1, level: 'high' },
    { title: 'CENTCOM: B-2 Spirit bombers conduct third sortie against remaining IRGC missile sites', source: 'CENTCOM', tier: 1, level: 'critical' },
    { title: 'Iron Dome ammunition resupply arrives via U.S. C-17 airlift — 500+ interceptors delivered', source: 'AP', tier: 1, level: 'high' },
    { title: 'Strait of Hormuz: 52 tankers now waiting outside exclusion zone, insurance premiums +450%', source: 'Reuters', tier: 1, level: 'high' },
    { title: 'IDF Northern Command: Hezbollah rocket launch rate declining — stockpile depletion estimated 40%', source: 'IDF', tier: 1, level: 'medium' },
    { title: 'UAE activates civil defense shelters in Abu Dhabi and Dubai after overnight missile alerts', source: 'Al Jazeera', tier: 2, level: 'high' },
    { title: 'Pentagon confirms USS Eisenhower CSG repositioning to central Persian Gulf', source: 'CENTCOM', tier: 1, level: 'medium' },
    { title: 'Brent crude surges past $170/bbl — longest sustained disruption since 1973 oil crisis', source: 'BBC', tier: 2, level: 'medium' },
    { title: 'Turkey offers to host ceasefire negotiations in Ankara — both sides considering proposal', source: 'Reuters', tier: 1, level: 'medium' },
    { title: 'Satellite imagery confirms destruction of 3 major Iranian missile production facilities', source: 'AP', tier: 1, level: 'high' },
    { title: 'Saudi Arabia opens emergency humanitarian corridor for medical evacuations from Gulf region', source: 'Reuters', tier: 1, level: 'medium' },
    { title: 'IAEA: Unable to access Iranian nuclear sites for post-strike damage assessment', source: 'BBC', tier: 2, level: 'high' },
    { title: 'Houthi forces claim new anti-ship missile strike on commercial vessel in Red Sea', source: 'AP', tier: 1, level: 'critical' },
    { title: 'Gold hits record $2,950/oz as global markets seek safe haven assets', source: 'CNN', tier: 2, level: 'low' },
    { title: 'S&P 500 drops 9.2% — largest single-week decline since March 2020', source: 'CNN', tier: 2, level: 'medium' },
    { title: 'NATO Article 4 consultations ongoing after Iranian missiles targeted Incirlik AFB area', source: 'Reuters', tier: 1, level: 'high' },
    { title: 'IDF confirms 14 Israeli civilian casualties across 5 days of missile attacks', source: 'IDF', tier: 1, level: 'critical' },
    { title: 'Iranian state TV broadcasts Interim Council statement: "We seek dignified peace"', source: 'Al Jazeera', tier: 2, level: 'high' },
    { title: 'U.S. SecDef Austin: "De-escalation is priority but all options remain on the table"', source: 'AP', tier: 1, level: 'medium' },
    { title: 'UNHCR reports 180,000 displaced across Gulf region — emergency shelters at capacity', source: 'BBC', tier: 2, level: 'medium' },
];

function generateFallbackItems() {
    const now = Date.now();
    return FALLBACK_HEADLINES.map((h, i) => ({
        source: h.source,
        title: h.title,
        link: '#',
        pubDate: new Date(now - i * 180000 - Math.random() * 300000),
        threat: { level: h.level, category: 'conflict', confidence: 0.8, keyword: '' },
        isAlert: h.level === 'critical' || h.level === 'high',
        tier: h.tier,
    }));
}

// ──── Helpers ────
function formatTimeAgo(date) {
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return `${Math.floor(secs / 86400)}d ago`;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
