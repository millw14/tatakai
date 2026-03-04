/**
 * Tatakai — Live UTC Clock & Conflict Day Timer
 * Displays real-time UTC clock and days since conflict start.
 */

const CONFLICT_START = new Date('2026-02-28T00:00:00Z');

let clockEl = null;

function pad(n) {
  return String(n).padStart(2, '0');
}

function getConflictDay() {
  const now = new Date();
  const diff = now - CONFLICT_START;
  return Math.max(1, Math.ceil(diff / 86400000));
}

function render() {
  if (!clockEl) return;
  const now = new Date();
  const time = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;
  const day = getConflictDay();

  clockEl.innerHTML =
    `<span class="live-clock-time">${time} UTC</span>` +
    `<span class="live-clock-day">DAY ${day}</span>`;
}

export function initLiveClock() {
  const container = document.getElementById('update-time');
  if (!container) return;

  container.className = 'live-clock';
  container.textContent = '';
  clockEl = container;

  render();
  setInterval(render, 1000);
}
