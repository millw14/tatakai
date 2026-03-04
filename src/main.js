/**
 * Tatakai — Main Application Entry Point
 * WorldMonitor-Inspired Intelligence Dashboard
 */
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/features.css';

import { EVENTS } from './data/events.js';
import { initMap, addEventToMap, updateMapTheme } from './components/map.js';
import { initStats, updateStat } from './components/stats.js';
import { initTimeline, addTimelineEvent } from './components/timeline.js';
import { initShare } from './components/share.js';
import { initAnalyzer } from './components/analyzer.js';
import { initLiveNews, checkLiveEvents, onBreaking } from './data/live.js';
import { initEventModals, addLiveEventToHistory } from './components/eventListModal.js';
import { initBreakingBanner, showBreakingAlert } from './components/breakingBanner.js';
import { initRiskGauge } from './components/riskGauge.js';
import { initCommandPalette } from './components/commandPalette.js';
import { initAudioPlayer } from './components/audioPlayer.js';
import { initCrtEffect } from './components/crtEffect.js';

import { initLiveClock } from './components/liveClock.js';
import { startSimulation } from './data/simulation.js';

document.addEventListener('DOMContentLoaded', () => {
  // Remove no-transition class after first paint
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-transition');
  });

  // Initialize Lucide Icons
  lucide.createIcons();

  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle');

  // Use stored theme or default to dark
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
    updateMapTheme(dark);
  }

  applyTheme(isDark);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      applyTheme(isDark);
    });
  }

  // Initialize Core Components
  const mapInstance = initMap();
  initStats();
  initTimeline();
  initShare();
  const groqClient = initAnalyzer();
  initEventModals(groqClient);
  initLiveNews(groqClient);

  // Initialize WM-Inspired Features (dashboard-only)
  initBreakingBanner();
  initRiskGauge();
  initCommandPalette();

  // Initialize new live features
  initAudioPlayer();
  initCrtEffect();

  initLiveClock();

  // Wire real RSS breaking news alerts → banner (from WM pipeline)
  onBreaking((alert) => {
    showBreakingAlert({
      title: alert.title,
      severity: alert.severity,
      source: alert.source,
    });
  });

  // Start Real-Time Multi-Feed RSS Pipeline (every 90 sec)
  checkLiveEvents(onLiveEventReceived);
  setInterval(() => {
    checkLiveEvents(onLiveEventReceived);
  }, 90000);

  // Simulation engine — keeps the dashboard alive with synthetic events
  startSimulation(onLiveEventReceived);
});

// Handle real-time parsed events
let alertCount = 0;

function onLiveEventReceived(event) {
  addEventToMap(event);
  addTimelineEvent(event);
  addLiveEventToHistory(event);

  // Add to Live Alerts Ticker
  addToAlertsTicker(event);

  // Re-initialize any new icons
  lucide.createIcons();

  // Update total counts
  const launchesEl = document.querySelector('#stat-launches .stat-value');
  if (launchesEl && event.type === 'launch') {
    updateStat('stat-launches', parseInt(launchesEl.dataset.target) + 1);
    launchesEl.dataset.target = parseInt(launchesEl.dataset.target) + 1;
  }

  const impactsEl = document.querySelector('#stat-impacts .stat-value');
  if (impactsEl && event.type === 'impact') {
    updateStat('stat-impacts', parseInt(impactsEl.dataset.target) + 1);
    impactsEl.dataset.target = parseInt(impactsEl.dataset.target) + 1;
  }
}

function addToAlertsTicker(event) {
  const ticker = document.getElementById('alerts-ticker-body');
  if (!ticker) return;

  // Remove placeholder on first alert
  const placeholder = ticker.querySelector('.alerts-placeholder');
  if (placeholder) placeholder.remove();

  // Determine severity from event threat classification
  const severity = event.threat?.level || (event.type === 'impact' ? 'critical' : event.type === 'launch' ? 'high' : 'medium');

  const timeStr = new Date(event.time).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  });

  const item = document.createElement('div');
  item.className = 'alert-item';
  item.innerHTML = `
    <span class="alert-dot ${severity}"></span>
    <div class="alert-content">
      <div class="alert-title">${event.text}</div>
      <div class="alert-meta">
        <span class="alert-source">${event.sources?.[0] || 'RSS'}</span>
        <span>${timeStr} UTC</span>
        <span>${event.type.toUpperCase()}</span>
      </div>
    </div>
  `;

  // Prepend (newest first)
  ticker.insertBefore(item, ticker.firstChild);

  // Keep max 30 alerts
  while (ticker.children.length > 30) {
    ticker.removeChild(ticker.lastChild);
  }

  // Update counter
  alertCount++;
  const counter = document.getElementById('alerts-count');
  if (counter) counter.textContent = alertCount;
}
