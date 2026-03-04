/**
 * Tatakai — CRT Scanline & Glitch Effect
 * Military-aesthetic overlay with intermittent digital glitches.
 */

let overlay = null;
let glitchTimer = null;
let enabled = true;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'crt-overlay';
  document.body.appendChild(overlay);
}

function triggerGlitch() {
  if (!overlay || !enabled) return;

  overlay.classList.add('crt-glitch');

  const duration = 80 + Math.random() * 150;
  setTimeout(() => {
    overlay.classList.remove('crt-glitch');
  }, duration);

  scheduleNextGlitch();
}

function scheduleNextGlitch() {
  const delay = 5000 + Math.random() * 12000;
  glitchTimer = setTimeout(triggerGlitch, delay);
}

export function initCrtEffect() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  createOverlay();
  scheduleNextGlitch();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'F2') {
      enabled = !enabled;
      overlay.classList.toggle('crt-hidden', !enabled);
      if (!enabled && glitchTimer) {
        clearTimeout(glitchTimer);
      } else if (enabled) {
        scheduleNextGlitch();
      }
    }
  });
}
