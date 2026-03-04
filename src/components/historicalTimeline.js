/**
 * Tatakai — Visual Historical Timeline
 */
import { EVENTS } from '../data/events.js';

let fullHistoryData = [...EVENTS];

export function addLiveEventToHistorical(event) {
    fullHistoryData.push(event);
    const modal = document.getElementById('history-modal');
    if (!modal.classList.contains('hidden')) {
        renderVisualTimeline(); // Re-render if open
    }
}

export function initHistoricalTimeline() {
    const openHistoryBtn = document.getElementById('open-history-btn');
    const closeHistoryBtn = document.getElementById('history-modal-close');
    const modal = document.getElementById('history-modal');

    openHistoryBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        renderVisualTimeline();
    });

    closeHistoryBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
}

function renderVisualTimeline() {
    const container = document.getElementById('history-feed');
    container.innerHTML = '';
    container.className = 'visual-timeline-container'; // update class for new styles

    // Sort oldest to newest for the horizontal timeline progression
    let sorted = [...fullHistoryData].sort((a, b) => new Date(a.time) - new Date(b.time));

    if (sorted.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px;">No historical events recorded.</p>';
        return;
    }

    const track = document.createElement('div');
    track.className = 'visual-track';

    // Create track line
    const line = document.createElement('div');
    line.className = 'visual-track-line';
    track.appendChild(line);

    // We want to space them out. If there are many, flex layout with gap is easiest.
    sorted.forEach((event, index) => {
        const nodeWrapper = document.createElement('div');
        nodeWrapper.className = 'visual-node-wrapper';

        // Alternate top/bottom placement
        const isTop = index % 2 === 0;
        nodeWrapper.classList.add(isTop ? 'node-top' : 'node-bottom');

        const dot = document.createElement('div');
        dot.className = 'visual-dot';
        dot.setAttribute('data-type', event.type);

        // Scale dot size slightly based on type (impacts are bigger)
        if (event.type === 'impact') dot.classList.add('dot-lg');
        if (event.type === 'launch') dot.classList.add('dot-md');

        // Tooltip for purely visual context on hover without clicking
        const d = new Date(event.time);
        const dateStr = d.toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

        const tooltip = document.createElement('div');
        tooltip.className = 'visual-tooltip';
        tooltip.innerHTML = `<strong>${dateStr}</strong><br/>${event.type.toUpperCase()}`;

        dot.appendChild(tooltip);

        // Clicking opens the existing event details modal logic!
        dot.addEventListener('click', () => {
            // We will re-use the events-modal logic
            document.getElementById('history-modal').classList.add('hidden'); // hide visual timeline
            openEventDetailFromGlobal(event); // custom global function we will expose
        });

        // The connecting stem to the main line
        const stem = document.createElement('div');
        stem.className = 'visual-stem';

        // The label text (minimal)
        const label = document.createElement('div');
        label.className = 'visual-label';
        label.textContent = dateStr;

        if (isTop) {
            nodeWrapper.appendChild(label);
            nodeWrapper.appendChild(dot);
            nodeWrapper.appendChild(stem);
        } else {
            nodeWrapper.appendChild(stem);
            nodeWrapper.appendChild(dot);
            nodeWrapper.appendChild(label);
        }

        track.appendChild(nodeWrapper);
    });

    container.appendChild(track);
}

// Helper to bridge the gap between Visual Timeline and the AI Event Details modal
function openEventDetailFromGlobal(event) {
    // We need to trigger the event list modal's detail view
    const title = document.getElementById('events-modal-title');
    const listView = document.getElementById('events-modal-list');
    const detailView = document.getElementById('event-detail-view');
    const detailContent = document.getElementById('event-detail-content');
    const aiExplanationContent = document.getElementById('ai-explanation-content');
    const modal = document.getElementById('events-modal');

    // Hide list, show detail
    listView.classList.add('hidden');
    detailView.classList.remove('hidden');

    title.textContent = 'Event Details';

    const time = new Date(event.time).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
    }) + ' UTC';

    const origin = (event.from && event.from.name) || 'Unknown';
    const target = (event.to && event.to.name) || 'Unknown';
    const locationStr = (event.from && event.to) ? `${origin} → ${target}` : target;

    detailContent.innerHTML = `
    <h4>${event.text}</h4>
    <div class="detail-meta">
      <span><i data-lucide="clock" style="width:12px;height:12px;"></i> ${time}</span>
      <span><i data-lucide="map-pin" style="width:12px;height:12px;"></i> ${locationStr}</span>
      <span><i data-lucide="check-circle" style="width:12px;height:12px;color:var(--color-success)"></i> ${event.status.toUpperCase()}</span>
    </div>
    <p><strong>Verified Detail:</strong> ${event.detail}</p>
    <p style="margin-top:8px; font-size:0.8rem;"><strong>Sources:</strong> ${event.sources.join(', ')}</p>
  `;

    aiExplanationContent.innerHTML = `<button id="generate-explanation-btn" class="generate-btn">Generate AI Context for this Event</button>`;

    // the click listener needs access to groq, we'll dispatch a custom event to let eventListModal handle the actual Groq call
    document.getElementById('generate-explanation-btn').addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('request-ai-explanation', { detail: event }));
    });

    if (window.lucide) window.lucide.createIcons();

    modal.classList.remove('hidden');
}
