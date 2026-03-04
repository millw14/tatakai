/**
 * Tatakai — Intelligence Page Entry Point
 * RSS Feed aggregator, live video, source health
 */
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/features.css';

import { initLiveNews, checkLiveEvents, onBreaking } from './data/live.js';
import { initBreakingBanner, showBreakingAlert } from './components/breakingBanner.js';
import { initLiveVideo } from './components/liveVideo.js';
import { initCommandPalette } from './components/commandPalette.js';
import { initAudioPlayer } from './components/audioPlayer.js';
import { initCrtEffect } from './components/crtEffect.js';
import { initLiveClock } from './components/liveClock.js';
import { startSimulation } from './data/simulation.js';
import { classifyByKeyword, THREAT_COLORS } from './data/threatClassifier.js';

document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition');
    });

    lucide.createIcons();

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const stored = localStorage.getItem('tatakai-theme');
    let isDark = stored ? stored === 'dark' : true;

    function applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('tatakai-theme', dark ? 'dark' : 'light');
        if (themeBtn) {
            themeBtn.innerHTML = dark
                ? '<i data-lucide="sun" style="width:14px;height:14px;"></i>'
                : '<i data-lucide="moon" style="width:14px;height:14px;"></i>';
            lucide.createIcons();
        }
    }

    applyTheme(isDark);
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            isDark = !isDark;
            applyTheme(isDark);
        });
    }

    // Initialize components available on this page
    initBreakingBanner();
    initLiveVideo();
    initCommandPalette();
    initLiveNews(null);

    // Live features (cross-page)
    initAudioPlayer();
    initCrtEffect();
    initLiveClock();

    // Wire breaking alerts
    onBreaking((alert) => {
        showBreakingAlert({
            title: alert.title,
            severity: alert.severity,
            source: alert.source,
        });
    });

    // Start RSS feed
    checkLiveEvents(() => { });
    setInterval(() => {
        checkLiveEvents(() => { });
    }, 90000);

    // Simulation also feeds into the intelligence panel as live intel items
    startSimulation((event) => {
        const panel = document.getElementById('live-news-feed');
        if (!panel) return;

        // Remove placeholder if present
        const hint = panel.querySelector('.cmd-hint');
        if (hint) hint.remove();

        const threat = event.threat || classifyByKeyword(event.text);
        const el = document.createElement('div');
        el.className = 'news-item';
        el.dataset.severity = threat.level;
        el.innerHTML = `
            <div class="news-item-header">
                <span class="severity-badge ${threat.level}">${threat.level.toUpperCase()}</span>
                <span class="news-source">${event.sources?.[0] || 'OSINT'}</span>
                <span class="news-time">JUST NOW</span>
            </div>
            <span class="news-title">${escapeHtml(event.text)}</span>
        `;
        panel.insertBefore(el, panel.firstChild);

        while (panel.children.length > 40) {
            panel.removeChild(panel.lastChild);
        }
    });
});

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
