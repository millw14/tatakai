/**
 * Tatakai — Cmd+K Command Palette
 * Fuzzy search overlay for quick navigation
 */

import { EVENTS } from '../data/events.js';

let overlay = null;
let input = null;
let resultsList = null;
let selectedIdx = -1;
let isOpen = false;

const MAX_RECENT = 8;
const MAX_RESULTS = 12;

export function initCommandPalette() {
    overlay = document.getElementById('cmd-palette-overlay');
    input = document.getElementById('cmd-palette-input');
    resultsList = document.getElementById('cmd-palette-results');

    if (!overlay || !input || !resultsList) return;

    // Keyboard shortcut: Cmd+K / Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            togglePalette();
        }
        if (e.key === 'Escape' && isOpen) {
            closePalette();
        }
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePalette();
    });

    // Search input
    input.addEventListener('input', () => {
        const query = input.value.trim();
        if (query.length === 0) {
            showRecentSearches();
        } else {
            performSearch(query);
        }
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        const items = resultsList.querySelectorAll('.cmd-result');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIdx = Math.max(selectedIdx - 1, 0);
            updateSelection(items);
        } else if (e.key === 'Enter' && selectedIdx >= 0 && items[selectedIdx]) {
            e.preventDefault();
            items[selectedIdx].click();
        }
    });
}

function togglePalette() {
    if (isOpen) {
        closePalette();
    } else {
        openPalette();
    }
}

function openPalette() {
    overlay.classList.remove('hidden');
    isOpen = true;
    selectedIdx = -1;
    input.value = '';
    input.focus();
    showRecentSearches();

    // Animate in
    requestAnimationFrame(() => {
        overlay.classList.add('visible');
    });
}

function closePalette() {
    overlay.classList.remove('visible');
    isOpen = false;
    setTimeout(() => overlay.classList.add('hidden'), 200);
}

function showRecentSearches() {
    const recent = getRecentSearches();
    if (recent.length === 0) {
        resultsList.innerHTML = `
      <div class="cmd-hint">
        <span>Type to search events, locations, operations...</span>
        <div class="cmd-shortcuts">
          <span class="cmd-key">↑↓</span> Navigate
          <span class="cmd-key">↵</span> Select
          <span class="cmd-key">Esc</span> Close
        </div>
      </div>
    `;
        return;
    }

    resultsList.innerHTML = `
    <div class="cmd-section-title">RECENT</div>
    ${recent.map((q, i) => `
      <div class="cmd-result" data-action="search" data-query="${escapeAttr(q)}">
        <span class="cmd-result-icon">🔍</span>
        <span class="cmd-result-text">${escapeHtml(q)}</span>
      </div>
    `).join('')}
  `;

    attachResultListeners();
}

function performSearch(query) {
    const results = [];
    const q = query.toLowerCase();

    // Search events
    EVENTS.forEach(event => {
        const text = event.text.toLowerCase();
        const score = fuzzyScore(text, q);
        if (score > 0) {
            results.push({
                type: 'event',
                icon: getTypeIcon(event.type),
                text: event.text,
                meta: event.time,
                score,
                action: () => scrollToEvent(event),
            });
        }
    });

    // Search actions
    const actions = [
        { text: 'Open War Timeline', icon: '🕐', action: () => window.location.href = '/timeline.html' },
        { text: 'Toggle Dark/Light Theme', icon: '🌙', action: () => document.getElementById('theme-toggle')?.click() },
        { text: 'Share Dashboard', icon: '📤', action: () => document.getElementById('share-btn')?.click() },
        { text: 'Open AI Analyzer', icon: '✨', action: () => document.getElementById('analyzer-toggle')?.click() },
    ];

    actions.forEach(a => {
        const score = fuzzyScore(a.text.toLowerCase(), q);
        if (score > 0) {
            results.push({ type: 'action', icon: a.icon, text: a.text, meta: 'Action', score, action: a.action });
        }
    });

    // Sort by score
    results.sort((a, b) => b.score - a.score);
    const top = results.slice(0, MAX_RESULTS);

    if (top.length === 0) {
        resultsList.innerHTML = `<div class="cmd-hint"><span>No results for "${escapeHtml(query)}"</span></div>`;
        return;
    }

    selectedIdx = 0;

    resultsList.innerHTML = top.map((r, i) => `
    <div class="cmd-result ${i === 0 ? 'selected' : ''}" data-idx="${i}">
      <span class="cmd-result-icon">${r.icon}</span>
      <span class="cmd-result-text">${highlightMatch(r.text, query)}</span>
      ${r.meta ? `<span class="cmd-result-meta">${escapeHtml(r.meta)}</span>` : ''}
    </div>
  `).join('');

    // Attach click handlers
    top.forEach((r, i) => {
        const el = resultsList.querySelector(`[data-idx="${i}"]`);
        if (el) {
            el.addEventListener('click', () => {
                saveRecentSearch(query);
                closePalette();
                r.action();
            });
        }
    });
}

function fuzzyScore(text, query) {
    if (text.includes(query)) {
        // Exact substring match
        if (text.startsWith(query)) return 3;
        return 2;
    }
    // Check if all words in query appear in text
    const words = query.split(/\s+/);
    const allMatch = words.every(w => text.includes(w));
    if (allMatch) return 1;
    return 0;
}

function highlightMatch(text, query) {
    const escaped = escapeHtml(text);
    const idx = escaped.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return escaped;
    return escaped.slice(0, idx) +
        `<mark>${escaped.slice(idx, idx + query.length)}</mark>` +
        escaped.slice(idx + query.length);
}

function getTypeIcon(type) {
    switch (type) {
        case 'launch': return '🚀';
        case 'intercept': return '🛡️';
        case 'impact': return '📍';
        default: return 'ℹ️';
    }
}

function scrollToEvent(event) {
    // Try to find the event in the timeline
    const items = document.querySelectorAll('.timeline-item');
    for (const item of items) {
        if (item.textContent.includes(event.text.slice(0, 40))) {
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            item.classList.add('flash-highlight');
            setTimeout(() => item.classList.remove('flash-highlight'), 1500);
            return;
        }
    }
}

function updateSelection(items) {
    items.forEach((item, i) => {
        item.classList.toggle('selected', i === selectedIdx);
    });
    if (items[selectedIdx]) {
        items[selectedIdx].scrollIntoView({ block: 'nearest' });
    }
}

function getRecentSearches() {
    try {
        return JSON.parse(localStorage.getItem('tatakai-recent-searches') || '[]');
    } catch { return []; }
}

function saveRecentSearch(query) {
    const recent = getRecentSearches().filter(q => q !== query);
    recent.unshift(query);
    localStorage.setItem('tatakai-recent-searches', JSON.stringify(recent.slice(0, MAX_RECENT)));
}

function attachResultListeners() {
    resultsList.querySelectorAll('[data-action="search"]').forEach(el => {
        el.addEventListener('click', () => {
            const q = el.dataset.query;
            input.value = q;
            performSearch(q);
        });
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
