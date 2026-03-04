/**
 * Tatakai — Threat Classifier
 * Ported from WorldMonitor's keyword-based threat classification system.
 * 120+ keywords across 5 severity tiers with compound escalation detection.
 */

// Severity tiers
const CRITICAL_KEYWORDS = {
    'nuclear strike': 'military', 'nuclear attack': 'military', 'nuclear war': 'military',
    'invasion': 'conflict', 'declaration of war': 'conflict', 'declares war': 'conflict',
    'all-out war': 'conflict', 'full-scale war': 'conflict', 'martial law': 'military',
    'coup': 'military', 'coup attempt': 'military', 'genocide': 'conflict',
    'ethnic cleansing': 'conflict', 'chemical attack': 'terrorism',
    'biological attack': 'terrorism', 'dirty bomb': 'terrorism', 'mass casualty': 'conflict',
    'massive strikes': 'military', 'military strikes': 'military',
    'retaliatory strikes': 'military', 'launches strikes': 'military',
    'launch attacks on iran': 'military', 'attacks on iran': 'military',
    'strikes on iran': 'military', 'strikes iran': 'military', 'bombs iran': 'military',
    'attacks iran': 'military', 'attack on iran': 'military', 'attack iran': 'military',
    'war with iran': 'conflict', 'war on iran': 'conflict',
    'iran retaliates': 'military', 'iran strikes': 'military', 'iran launches': 'military',
    'iran attacks': 'military', 'pandemic declared': 'health', 'nato article 5': 'military',
    'evacuation order': 'disaster', 'meltdown': 'disaster', 'declared war': 'conflict',
};

const HIGH_KEYWORDS = {
    'war': 'conflict', 'armed conflict': 'conflict', 'airstrike': 'conflict',
    'airstrikes': 'conflict', 'air strike': 'conflict', 'air strikes': 'conflict',
    'drone strike': 'conflict', 'drone strikes': 'conflict', 'strikes': 'conflict',
    'missile': 'military', 'missile launch': 'military', 'missiles fired': 'military',
    'troops deployed': 'military', 'military escalation': 'military',
    'military operation': 'military', 'ground offensive': 'military',
    'bombing': 'conflict', 'bombardment': 'conflict', 'shelling': 'conflict',
    'casualties': 'conflict', 'killed in': 'conflict', 'hostage': 'terrorism',
    'terrorist': 'terrorism', 'terror attack': 'terrorism', 'assassination': 'crime',
    'cyber attack': 'cyber', 'ransomware': 'cyber', 'sanctions': 'economic',
    'embargo': 'economic', 'earthquake': 'disaster', 'tsunami': 'disaster',
    'hurricane': 'disaster', 'strike on': 'conflict', 'strikes on': 'conflict',
    'attack on': 'conflict', 'attacks on': 'conflict', 'explosions': 'conflict',
    'military operations': 'military', 'combat operations': 'military',
    'retaliatory strike': 'military', 'retaliatory attack': 'military',
    'preemptive strike': 'military', 'ballistic missile': 'military',
    'cruise missile': 'military', 'intercept': 'military', 'intercepted': 'military',
    'iron dome': 'military', 'thaad': 'military', 'patriot': 'military',
};

const MEDIUM_KEYWORDS = {
    'protest': 'protest', 'protests': 'protest', 'riot': 'protest', 'riots': 'protest',
    'unrest': 'protest', 'demonstration': 'protest', 'military exercise': 'military',
    'naval exercise': 'military', 'arms deal': 'military', 'weapons sale': 'military',
    'diplomatic crisis': 'diplomatic', 'ambassador recalled': 'diplomatic',
    'trade war': 'economic', 'tariff': 'economic', 'recession': 'economic',
    'market crash': 'economic', 'flood': 'disaster', 'wildfire': 'disaster',
    'volcano': 'disaster', 'outbreak': 'health', 'epidemic': 'health',
    'pipeline explosion': 'infrastructure', 'blackout': 'infrastructure',
    'internet outage': 'infrastructure',
};

const LOW_KEYWORDS = {
    'election': 'diplomatic', 'vote': 'diplomatic', 'referendum': 'diplomatic',
    'summit': 'diplomatic', 'treaty': 'diplomatic', 'negotiation': 'diplomatic',
    'talks': 'diplomatic', 'ceasefire': 'diplomatic', 'humanitarian aid': 'diplomatic',
    'climate change': 'environmental', 'drought': 'environmental',
    'vaccine': 'health', 'interest rate': 'economic',
};

// Noise exclusion
const EXCLUSIONS = [
    'protein', 'couples', 'relationship', 'dating', 'diet', 'fitness',
    'recipe', 'cooking', 'shopping', 'fashion', 'celebrity', 'movie',
    'tv show', 'sports', 'game', 'concert', 'festival', 'wedding',
    'vacation', 'travel tips', 'life hack', 'self-care', 'wellness',
    'strikes deal', 'strikes agreement', 'strikes partnership',
];

// Short keywords need word-boundary matching (prevents "war" matching "award")
const SHORT_KEYWORDS = new Set([
    'war', 'coup', 'ban', 'vote', 'riot', 'riots', 'hack', 'talks', 'strikes',
]);

const regexCache = new Map();

function getKeywordRegex(kw) {
    let re = regexCache.get(kw);
    if (!re) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        re = SHORT_KEYWORDS.has(kw) ? new RegExp(`\\b${escaped}\\b`) : new RegExp(escaped);
        regexCache.set(kw, re);
    }
    return re;
}

function matchKeywords(titleLower, keywords) {
    for (const [kw, cat] of Object.entries(keywords)) {
        if (getKeywordRegex(kw).test(titleLower)) {
            return { keyword: kw, category: cat };
        }
    }
    return null;
}

// Compound escalation: military action + critical target → CRITICAL
const ESCALATION_ACTIONS = /\b(attack|attacks|attacked|strike|strikes|struck|bomb|bombs|bombed|bombing|shell|shelled|missile|missiles|intercept|intercepted|retaliates|killed|casualties|offensive|invaded)\b/;
const ESCALATION_TARGETS = /\b(iran|tehran|isfahan|russia|moscow|china|beijing|taiwan|north korea|nato|us base|us forces|american forces)\b/;

function shouldEscalateToCritical(lower, matchCat) {
    if (matchCat !== 'conflict' && matchCat !== 'military') return false;
    return ESCALATION_ACTIONS.test(lower) && ESCALATION_TARGETS.test(lower);
}

/**
 * Classify a headline by keyword matching.
 * Returns { level, category, confidence, source: 'keyword' }
 */
export function classifyByKeyword(title) {
    const lower = title.toLowerCase();

    // Exclude noise
    if (EXCLUSIONS.some(ex => lower.includes(ex))) {
        return { level: 'info', category: 'general', confidence: 0.3, source: 'keyword' };
    }

    // Priority cascade: critical → high → medium → low → info
    let match = matchKeywords(lower, CRITICAL_KEYWORDS);
    if (match) return { level: 'critical', category: match.category, confidence: 0.9, source: 'keyword' };

    match = matchKeywords(lower, HIGH_KEYWORDS);
    if (match) {
        if (shouldEscalateToCritical(lower, match.category)) {
            return { level: 'critical', category: match.category, confidence: 0.85, source: 'keyword' };
        }
        return { level: 'high', category: match.category, confidence: 0.8, source: 'keyword' };
    }

    match = matchKeywords(lower, MEDIUM_KEYWORDS);
    if (match) return { level: 'medium', category: match.category, confidence: 0.7, source: 'keyword' };

    match = matchKeywords(lower, LOW_KEYWORDS);
    if (match) return { level: 'low', category: match.category, confidence: 0.6, source: 'keyword' };

    return { level: 'info', category: 'general', confidence: 0.3, source: 'keyword' };
}

// Threat color map
export const THREAT_COLORS = {
    critical: 'var(--threat-critical)',
    high: 'var(--threat-high)',
    medium: 'var(--threat-medium)',
    low: 'var(--threat-low)',
    info: 'var(--text-muted)',
};
