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
    checkLiveEvents(() => { }); // events go to the feed panel
    setInterval(() => {
        checkLiveEvents(() => { });
    }, 90000);
});
