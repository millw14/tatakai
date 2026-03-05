/**
 * Tatakai — Interactive Map Component
 * Leaflet.js with CartoDB tiles, custom markers, curved arcs
 * Supports 160+ events with animated live event markers
 */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EVENTS, getCurvePoints } from '../data/events.js';

let map;
let markersLayer;
let arcsLayer;
let liveMarkersLayer;
let currentFilter = 'all';
let liveEventCount = 0;

// Color scheme
const COLORS = {
    launch: { fill: '#ff6b35', stroke: '#cc5528', glow: 'rgba(255,107,53,0.5)' },
    intercept: { fill: '#4dabf7', stroke: '#339af0', glow: 'rgba(77,171,247,0.4)' },
    impact: { fill: '#ff3333', stroke: '#cc2929', glow: 'rgba(255,51,51,0.5)' },
    info: { fill: '#44ff88', stroke: '#33cc66', glow: 'rgba(68,255,136,0.3)' },
};

function createMarker(event, isLive = false) {
    const coord = event.to || event.from;
    if (!coord) return null;

    const c = COLORS[event.type] || COLORS.info;
    const radius = isLive ? 9 : (event.type === 'impact' ? 6 : event.type === 'launch' ? 5 : 4);

    const marker = L.circleMarker([coord.lat, coord.lng], {
        radius,
        fillColor: c.fill,
        fillOpacity: isLive ? 0.95 : 0.7,
        color: c.stroke,
        weight: isLive ? 3 : 1.5,
        className: isLive ? `marker-live marker-${event.type}` : `marker-${event.type}`,
    });

    const time = new Date(event.time).toLocaleString('en-US', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
        timeZone: 'UTC', timeZoneName: 'short',
    });

    const statusBadge = `<span class="status-badge ${event.status}">${event.status}</span>`;
    const targetName = event.to?.name || '';
    const fromName = event.from?.name || '';

    let direction = '';
    if (fromName && targetName) {
        direction = `<div class="popup-detail">From ${fromName} → ${targetName}</div>`;
    } else if (targetName) {
        direction = `<div class="popup-detail">Location: ${targetName}</div>`;
    }

    const threatBadge = event.threat
        ? `<span class="severity-badge ${event.threat.level}">${event.threat.level.toUpperCase()}</span>`
        : '';

    marker.bindPopup(`
    <div class="tatakai-popup">
      <div class="popup-header">
        <span class="popup-type ${event.type}"></span>
        ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        ${statusBadge} ${threatBadge}
      </div>
      <div class="popup-detail">${time}</div>
      ${direction}
      <div class="popup-detail" style="color:var(--text-primary);font-weight:500;">${event.text}</div>
      <div class="popup-source">Sources: ${event.sources.join(', ')}</div>
    </div>
  `, { maxWidth: 300, className: 'tatakai-popup-wrapper' });

    marker.eventData = event;
    return marker;
}

function createArc(event) {
    if (!event.from || !event.to) return null;

    const color = COLORS[event.type]?.fill || '#9ca3b4';
    const curvePoints = getCurvePoints(event.from, event.to);

    return L.polyline(curvePoints, {
        color,
        weight: 1,
        opacity: 0.25,
        dashArray: '4 3',
        className: `arc-${event.type}`,
    });
}

function filterEvents(filter) {
    currentFilter = filter;
    markersLayer.clearLayers();
    arcsLayer.clearLayers();

    let filtered = EVENTS;
    if (filter === 'today') {
        filtered = EVENTS.filter(e => e.day === 5);
    } else if (filter === 'civilian') {
        filtered = EVENTS.filter(e => e.type === 'impact' || e.type === 'info');
    }

    // For large datasets, only draw arcs for launch events to reduce clutter
    const maxArcs = 80;
    let arcCount = 0;

    filtered.forEach(event => {
        const marker = createMarker(event);
        if (marker) markersLayer.addLayer(marker);

        if (arcCount < maxArcs && (event.type === 'launch' || event.type === 'impact')) {
            const arc = createArc(event);
            if (arc) {
                arcsLayer.addLayer(arc);
                arcCount++;
            }
        }
    });

    updateLiveBadge();
}

function updateLiveBadge() {
    const badge = document.querySelector('.map-live-badge');
    if (!badge) return;
    const total = EVENTS.length + liveEventCount;
    badge.innerHTML = `<span class="pulse-dot"></span> ${total} EVENTS TRACKED · ${liveEventCount} LIVE`;
}

export function initMap() {
    map = L.map('map', {
        center: [28.5, 48.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 10,
        zoomControl: true,
        attributionControl: true,
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTileLayer(isDark);

    markersLayer = L.layerGroup().addTo(map);
    arcsLayer = L.layerGroup().addTo(map);
    liveMarkersLayer = L.layerGroup().addTo(map);

    filterEvents('all');

    // Add map live badge
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
        const badge = document.createElement('div');
        badge.className = 'map-live-badge';
        badge.innerHTML = `<span class="pulse-dot"></span> ${EVENTS.length} EVENTS TRACKED · 0 LIVE`;
        mapSection.appendChild(badge);
    }

    // Filter controls
    document.querySelectorAll('.map-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.map-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterEvents(btn.dataset.filter);
        });
    });

    addPulseAnimation();
    return map;
}

function setTileLayer(isDark) {
    map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) map.removeLayer(layer);
    });

    const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
    }).addTo(map);
}

export function updateMapTheme(isDark) {
    if (map) setTileLayer(isDark);
}

function addPulseAnimation() {
    // Static markers — no animations
}

// Add a new live event to the map with animated marker
export function addEventToMap(event) {
    liveEventCount++;

    const marker = createMarker(event, true);
    if (marker && (currentFilter === 'all' ||
        (currentFilter === 'today' && event.day === 5) ||
        (currentFilter === 'civilian' && (event.type === 'impact' || event.type === 'info')))) {
        liveMarkersLayer.addLayer(marker);
    }

    const arc = createArc(event);
    if (arc && (currentFilter === 'all' ||
        (currentFilter === 'today' && event.day === 5) ||
        (currentFilter === 'civilian' && (event.type === 'impact' || event.type === 'info')))) {
        arcsLayer.addLayer(arc);
    }

    updateLiveBadge();
}
