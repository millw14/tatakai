/**
 * Tatakai — Event Details & List Modal
 */
import { EVENTS } from '../data/events.js';

let currentGroq = null;
const allEvents = [...EVENTS]; // we will append live events here from main

export function addLiveEventToHistory(event) {
    allEvents.push(event);
}

export function initEventModals(groqInstance) {
    currentGroq = groqInstance;

    const modal = document.getElementById('events-modal');
    const closeBtn = document.getElementById('events-modal-close');
    const title = document.getElementById('events-modal-title');
    const listView = document.getElementById('events-modal-list');
    const detailView = document.getElementById('event-detail-view');
    const backBtn = document.getElementById('back-to-list');
    const detailContent = document.getElementById('event-detail-content');
    const aiExplanationContent = document.getElementById('ai-explanation-content');

    // Make stat cards clickable
    document.querySelectorAll('.stat-card').forEach(card => {
        card.classList.add('clickable');
        card.addEventListener('click', () => {
            openCategoryList(card.id);
        });
    });

    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    backBtn.addEventListener('click', () => {
        detailView.classList.add('hidden');
        listView.classList.remove('hidden');
    });

    function openCategoryList(cardId) {
        let filterType = 'all';
        let label = 'Events';

        switch (cardId) {
            case 'stat-launches': filterType = 'launch'; label = 'Launches'; break;
            case 'stat-intercepted': filterType = 'intercept'; label = 'Intercepts'; break;
            case 'stat-impacts': filterType = 'impact'; label = 'Impacts'; break;
            case 'stat-airports': filterType = 'info'; label = 'Information & Alerts'; break;
        }

        title.textContent = `All ${label}`;

        // Sort newest first
        const filtered = allEvents
            .filter(e => filterType === 'all' || e.type === filterType)
            .sort((a, b) => new Date(b.time) - new Date(a.time));

        renderList(filtered);

        listView.classList.remove('hidden');
        detailView.classList.add('hidden');
        modal.classList.remove('hidden');
    }

    function renderList(events) {
        listView.innerHTML = '';

        if (events.length === 0) {
            listView.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px;">No events recorded in this category yet.</p>';
            return;
        }

        events.forEach(event => {
            const item = document.createElement('div');
            item.className = 'event-list-item';
            item.style.borderLeftColor = `var(--color-${event.type})`;

            const time = new Date(event.time).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
            }) + ' UTC';

            item.innerHTML = `
        <div class="event-list-time">${time}</div>
        <div class="event-list-text">${event.text}</div>
      `;

            item.addEventListener('click', () => openEventDetail(event));
            listView.appendChild(item);
        });
    }

    function openEventDetail(event) {
        listView.classList.add('hidden');
        detailView.classList.remove('hidden');

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

        document.getElementById('generate-explanation-btn').addEventListener('click', () => {
            generateExplanation(event);
        });

        // Refresh icons inside dynamically added HTML
        if (window.lucide) window.lucide.createIcons();
    }

    async function generateExplanation(event) {
        if (!currentGroq) {
            aiExplanationContent.innerHTML = '<p style="color:var(--color-danger)">AI Analyzer is currently disabled (No API Key).</p>';
            return;
        }

        aiExplanationContent.innerHTML = '<p class="pulse-dot" style="display:inline-block; margin-right:8px;"></p> Analyzing military and geopolitical context...';

        const prompt = `
      You are the Tatakai AI Analyzer. Facts only. Objective. Neutral.
      Provide a 3-4 sentence explanation of the following conflict event for a general audience.
      Explain the strategic significance, the weapon systems mentioned (if any), or the geographic importance of the locations.
      
      EVENT DETAIL: ${event.text} - ${event.detail}
      FROM: ${(event.from && event.from.name) || 'Unknown'}
      TO: ${(event.to && event.to.name) || 'Unknown'}
    `;

        try {
            const stream = await currentGroq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.1,
                stream: true,
            });

            aiExplanationContent.innerHTML = '';
            let fullText = '';

            for await (const chunk of stream) {
                fullText += chunk.choices[0]?.delta?.content || '';
                aiExplanationContent.innerHTML = `<p>${fullText}</p>`;
            }
        } catch (err) {
            console.error(err);
            aiExplanationContent.innerHTML = '<p style="color:var(--color-danger)">Failed to generate explanation. Please try again.</p>';
        }
    }
}
