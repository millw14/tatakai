/**
 * Tatakai — Background Audio Player
 * Plays "My War" on loop at low volume after first user interaction.
 * Respects browser autoplay policies.
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

function tryPlay() {
  if (started) return;
  started = true;

  audio.play().catch(() => {
    started = false;
  });

  document.removeEventListener('click', tryPlay);
  document.removeEventListener('keydown', tryPlay);
  document.removeEventListener('touchstart', tryPlay);
}

export function initAudioPlayer() {
  audio = new Audio('/audio/my-war.mp3');
  audio.loop = true;
  audio.volume = VOLUME;

  muted = localStorage.getItem(STORAGE_KEY) === '1';
  audio.muted = muted;

  createToggleButton();

  document.addEventListener('click', tryPlay, { once: false });
  document.addEventListener('keydown', tryPlay, { once: false });
  document.addEventListener('touchstart', tryPlay, { once: false });
}
