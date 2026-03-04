/**
 * Tatakai — Breaking News Banner
 * WM-inspired persistent alert banner for critical events
 */

const CRITICAL_DISMISS_MS = 60_000;
const HIGH_DISMISS_MS = 30_000;
const MAX_ALERTS = 3;

let activeAlerts = [];
let container = null;

export function initBreakingBanner() {
    container = document.getElementById('breaking-banner');
    if (!container) return;
}

/**
 * Show a breaking news alert
 * @param {{ title: string, severity: 'critical'|'high', source?: string, time?: Date }} alert
 */
export function showBreakingAlert(alert) {
    if (!container) return;

    const id = `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const dismissMs = alert.severity === 'critical' ? CRITICAL_DISMISS_MS : HIGH_DISMISS_MS;

    // Remove oldest if at max
    if (activeAlerts.length >= MAX_ALERTS) {
        const oldest = activeAlerts.shift();
        if (oldest && oldest.element) oldest.element.remove();
        if (oldest && oldest.timer) clearTimeout(oldest.timer);
    }

    const el = document.createElement('div');
    el.className = `breaking-alert severity-${alert.severity}`;
    el.dataset.id = id;
    el.innerHTML = `
    <div class="breaking-alert-inner">
      <span class="breaking-tag">${alert.severity === 'critical' ? '⚠ CRITICAL' : '▲ BREAKING'}</span>
      <span class="breaking-text"></span>
      ${alert.source ? `<span class="breaking-source">${escapeHtml(alert.source)}</span>` : ''}
      <button class="breaking-dismiss" aria-label="Dismiss">✕</button>
    </div>
    <div class="breaking-timer-bar" style="animation-duration:${dismissMs}ms;"></div>
  `;

    // Dismiss on click
    el.querySelector('.breaking-dismiss').addEventListener('click', (e) => {
        e.stopPropagation();
        dismissAlert(id);
    });

    container.appendChild(el);

    // Force reflow for animation
    el.offsetHeight;
    el.classList.add('visible');

    // Typewriter effect on the alert text
    typewriterText(el.querySelector('.breaking-text'), escapeHtml(alert.title));

    const timer = setTimeout(() => dismissAlert(id), dismissMs);

    activeAlerts.push({ id, element: el, timer });
}

function dismissAlert(id) {
    const idx = activeAlerts.findIndex(a => a.id === id);
    if (idx === -1) return;

    const active = activeAlerts[idx];
    if (active.timer) clearTimeout(active.timer);
    active.element.classList.remove('visible');
    active.element.classList.add('dismissing');

    setTimeout(() => {
        active.element.remove();
    }, 300);

    activeAlerts.splice(idx, 1);
}

function typewriterText(el, text) {
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.textContent = '';
    el.appendChild(cursor);

    const interval = setInterval(() => {
        if (i < text.length) {
            cursor.before(text[i]);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => cursor.remove(), 400);
        }
    }, 28);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Simulate a breaking news alert for demo purposes.
 * In production, these would come from the live RSS pipeline.
 */
export function simulateBreakingNews() {
    const demoAlerts = [
        { title: 'Multiple missile launches detected from southern Iran toward Gulf states', severity: 'critical', source: 'CENTCOM' },
        { title: 'UAE airspace temporarily closed — all commercial flights diverted', severity: 'critical', source: 'Reuters' },
        { title: 'Iron Dome intercepts drone swarm over northern Israel', severity: 'high', source: 'IDF Spokesperson' },
        { title: 'Strait of Hormuz shipping suspended — tankers redirected', severity: 'critical', source: 'AP' },
        { title: 'U.S. THAAD battery engages ballistic missile over Saudi Arabia', severity: 'high', source: 'CENTCOM' },
    ];

    // Show one random alert after 8 seconds
    setTimeout(() => {
        const alert = demoAlerts[Math.floor(Math.random() * demoAlerts.length)];
        showBreakingAlert(alert);
    }, 8000);

    // Show another after 25 seconds
    setTimeout(() => {
        const alert = demoAlerts[Math.floor(Math.random() * demoAlerts.length)];
        showBreakingAlert(alert);
    }, 25000);
}
