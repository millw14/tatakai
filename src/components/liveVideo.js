/**
 * Tatakai — Live Video Panel
 * Direct HLS news streams embedded in the dashboard
 */

const LIVE_CHANNELS = [
    { id: 'aljazeera', name: 'Al Jazeera', hlsUrl: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8' },
    { id: 'sky', name: 'Sky News', hlsUrl: 'https://linear901-oo-hls0-prd-gtm.delivery.skycdp.com/17501/sde-fast-skynews/master.m3u8' },
    { id: 'france24', name: 'France 24', hlsUrl: 'https://live.france24.com/hls/live/2037444/F24_EN_HI_HLS/master.m3u8' },
    { id: 'euronews', name: 'Euronews', hlsUrl: 'https://dash4.antik.sk/live/test_euronews/playlist.m3u8' },
];

let panel = null;
let hlsInstances = [];
let isVisible = true;

export function initLiveVideo() {
    panel = document.getElementById('live-video-body');
    if (!panel) return;

    renderVideoGrid();

    // Idle-aware: pause when tab hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseAll();
            isVisible = false;
        } else {
            if (!isVisible) {
                resumeAll();
                isVisible = true;
            }
        }
    });
}

function renderVideoGrid() {
    if (!panel) return;

    panel.innerHTML = `
    <div class="video-grid">
      ${LIVE_CHANNELS.map(ch => `
        <div class="video-cell" data-channel="${ch.id}">
          <video 
            id="video-${ch.id}" 
            muted 
            autoplay 
            playsinline
            poster=""
          ></video>
          <div class="video-overlay">
            <span class="video-live-dot"></span>
            <span class="video-label">${ch.name}</span>
          </div>
          <div class="video-error hidden" id="video-error-${ch.id}">
            <span>Stream unavailable</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

    // Load HLS.js and start streams
    loadHlsAndPlay();
}

async function loadHlsAndPlay() {
    // Check if HLS.js is already loaded
    if (typeof Hls === 'undefined') {
        // Dynamically load hls.js
        await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    LIVE_CHANNELS.forEach(ch => {
        const video = document.getElementById(`video-${ch.id}`);
        const errorEl = document.getElementById(`video-error-${ch.id}`);
        if (!video) return;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            video.src = ch.hlsUrl;
            video.addEventListener('error', () => showVideoError(ch.id));
        } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                maxBufferLength: 10,
                maxMaxBufferLength: 20,
            });
            hls.loadSource(ch.hlsUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    showVideoError(ch.id);
                }
            });
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => { }); // autoplay may be blocked
            });
            hlsInstances.push(hls);
        } else {
            showVideoError(ch.id);
        }
    });
}

function showVideoError(channelId) {
    const errorEl = document.getElementById(`video-error-${channelId}`);
    if (errorEl) errorEl.classList.remove('hidden');
}

function pauseAll() {
    LIVE_CHANNELS.forEach(ch => {
        const video = document.getElementById(`video-${ch.id}`);
        if (video) video.pause();
    });
}

function resumeAll() {
    LIVE_CHANNELS.forEach(ch => {
        const video = document.getElementById(`video-${ch.id}`);
        if (video) video.play().catch(() => { });
    });
}
