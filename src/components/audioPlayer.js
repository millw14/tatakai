/**
 * Tatakai — Background Audio Player
 * Plays "My War" on loop at low volume. Aggressively tries to start
 * on the very first user interaction (click, key, touch, scroll).
 */

const STORAGE_KEY = 'tatakai-audio-muted';
const VOLUME = 0.08;

let audio = null;
let muted = false;
let started = false;
let btn = null;

function createToggleButton() {
  btn = document.createElement('button');
  btn.id = 'audio-toggle';
  btn.className = 'icon-btn';
  btn.setAttribute('aria-label', 'Toggle music');
  updateButtonIcon();

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    muted = !muted;
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
    audio.muted = muted;
    updateButtonIcon();
    if (!started) forcePlay();
  });

  const headerRight = document.querySelector('.header-right');
  if (headerRight) {
    const shareBtn = document.getElementById('share-btn');
    headerRight.insertBefore(btn, shareBtn);
  }
}

function updateButtonIcon() {
  if (!btn) return;
  const icon = muted ? 'volume-x' : 'volume-1';
  btn.innerHTML = `<i data-lucide="${icon}" style="width: 14px; height: 14px;"></i>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function forcePlay() {
  if (started) return;
  audio.play().then(() => {
    started = true;
    removeListeners();
  }).catch(() => {});
}

function onInteraction() {
  forcePlay();
}

const interactionEvents = ['click', 'keydown', 'touchstart', 'pointerdown', 'scroll', 'mousedown'];

function removeListeners() {
  for (const evt of interactionEvents) {
    document.removeEventListener(evt, onInteraction, { capture: true });
  }
}

export function initAudioPlayer() {
  audio = new Audio('/audio/my-war.mp3');
  audio.preload = 'auto';
  audio.loop = true;
  audio.volume = VOLUME;

  muted = localStorage.getItem(STORAGE_KEY) === '1';
  audio.muted = muted;

  createToggleButton();

  // Try immediately (works if user already interacted with the origin)
  forcePlay();

  // Listen on every possible interaction event with capture to fire first
  for (const evt of interactionEvents) {
    document.addEventListener(evt, onInteraction, { capture: true, passive: true });
  }
}
