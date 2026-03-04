/**
 * Tatakai — Map Particle Effects
 * Canvas overlay for missile trail arcs and impact explosions.
 */

let canvas = null;
let ctx = null;
let leafletMap = null;
let particles = [];
let animating = false;

const TRAIL_COLOR = { r: 255, g: 107, b: 53 };
const EXPLOSION_COLORS = [
  { r: 255, g: 51, b: 51 },
  { r: 255, g: 107, b: 53 },
  { r: 255, g: 200, b: 60 },
  { r: 255, g: 150, b: 40 },
];

function resizeCanvas() {
  if (!canvas || !canvas.parentElement) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function latLngToPixel(latlng) {
  if (!leafletMap) return { x: 0, y: 0 };
  const point = leafletMap.latLngToContainerPoint([latlng.lat, latlng.lng]);
  return { x: point.x, y: point.y };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function quadBezier(p0, p1, p2, t) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function startLoop() {
  if (animating) return;
  animating = true;
  requestAnimationFrame(tick);
}

function tick() {
  if (!ctx || particles.length === 0) {
    animating = false;
    ctx?.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    return;
  }

  ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

  const now = performance.now();

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    const age = now - p.born;

    if (age > p.lifetime) {
      particles.splice(i, 1);
      continue;
    }

    const progress = age / p.lifetime;

    if (p.type === 'trail') {
      const pos = quadBezier(p.start, p.control, p.end, Math.min(progress * 1.2, 1));
      const alpha = progress < 0.8 ? 0.9 : (1 - progress) * 4.5;
      const size = lerp(2.5, 0.5, progress);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size + 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha * 0.2})`;
      ctx.fill();

    } else if (p.type === 'explosion') {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;

      const alpha = 1 - progress;
      const size = lerp(p.size, 0, progress * progress);

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(size, 0.3), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${alpha})`;
      ctx.fill();
    }
  }

  requestAnimationFrame(tick);
}

export function spawnMissileTrail(event) {
  if (!leafletMap || !event.from || !event.to) return;

  const start = latLngToPixel(event.from);
  const end = latLngToPixel(event.to);

  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 40 - Math.random() * 60;
  const control = { x: midX, y: midY };

  const count = 12 + Math.floor(Math.random() * 8);
  for (let i = 0; i < count; i++) {
    particles.push({
      type: 'trail',
      start,
      control,
      end,
      color: TRAIL_COLOR,
      born: performance.now() + i * 80,
      lifetime: 1200 + Math.random() * 400,
    });
  }

  startLoop();
}

export function spawnExplosion(event) {
  if (!leafletMap) return;

  const coord = event.to || event.from;
  if (!coord) return;

  const center = latLngToPixel(coord);
  const count = 30 + Math.floor(Math.random() * 20);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 4;
    const color = EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)];

    particles.push({
      type: 'explosion',
      x: center.x,
      y: center.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: 1.5 + Math.random() * 3,
      born: performance.now(),
      lifetime: 600 + Math.random() * 600,
    });
  }

  startLoop();
}

export function initMapParticles(map) {
  leafletMap = map;

  const mapSection = document.getElementById('map-section');
  if (!mapSection) return;

  canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  mapSection.appendChild(canvas);

  ctx = canvas.getContext('2d');
  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);
  leafletMap.on('move zoom resize', resizeCanvas);
}
