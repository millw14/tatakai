/**
 * Tatakai — Live Timeline Component
 */
import { EVENTS } from '../data/events.js';

let autoScroll = true;
let expandedId = null;

export function initTimeline() {
    const feed = document.getElementById('timeline-feed');
    const toggle = document.getElementById('auto-scroll-toggle');

    // Sort events by time (newest first)
    const sorted = [...EVENTS].sort((a, b) => new Date(b.time) - new Date(a.time));

    // Render events with staggered animation
    sorted.forEach((event, index) => {
        const item = createTimelineItem(event, index);
        feed.appendChild(item);
    });

    // Auto-scroll toggle
    toggle.addEventListener('click', () => {
        autoScroll = !autoScroll;
        toggle.textContent = autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF';
        toggle.classList.toggle('off', !autoScroll);
    });
}

function createTimelineItem(event, index) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.style.animationDelay = `${0.3 + index * 0.05}s`;
    item.dataset.eventId = event.id;

    const time = new Date(event.time).toLocaleString('en-US', {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'UTC',
    }) + ' UTC';

    const sourceCount = event.sources.length;

    item.innerHTML = `
    <div class="timeline-item-header">
      <span class="timeline-type-dot ${event.type}"></span>
      <span class="timeline-item-text">${event.text}</span>
      <span class="timeline-time">${time}</span>
    </div>
    <div class="timeline-meta">
      <span class="source-count">${sourceCount} source${sourceCount > 1 ? 's' : ''}</span>
      <span class="status-badge ${event.status}">${event.status}</span>
    </div>
    <div class="timeline-expanded">
      <div class="timeline-detail">
        <p><strong>What this means:</strong> ${event.detail}</p>
        <div class="sources-list">
          ${event.sources.map(s => `<span class="source-tag">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

    item.addEventListener('click', () => {
        if (expandedId === event.id) {
            item.classList.remove('expanded');
            expandedId = null;
        } else {
            // Collapse previously expanded
            const prev = document.querySelector('.timeline-item.expanded');
            if (prev) prev.classList.remove('expanded');

            item.classList.add('expanded');
            expandedId = event.id;
        }
    });

    return item;
}

// Add new event to timeline (for live updates)
export function addTimelineEvent(event) {
    const feed = document.getElementById('timeline-feed');
    const item = createTimelineItem(event, 0);
    item.style.animationDelay = '0s';
    feed.insertBefore(item, feed.firstChild);

    // Highlight new item briefly
    item.style.borderColor = 'var(--color-intercept)';
    setTimeout(() => {
        item.style.borderColor = '';
    }, 3000);

    // Auto-scroll to top
    if (autoScroll) {
        feed.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
