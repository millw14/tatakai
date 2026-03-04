import { EVENTS } from './data/events.js';
import { Groq } from 'groq-sdk';
import { initAudioPlayer } from './components/audioPlayer.js';
import { initCrtEffect } from './components/crtEffect.js';
import { initLiveClock } from './components/liveClock.js';

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();

    // Basic Setup
    initThemeToggle();
    initTimeline();

    // Live features (cross-page)
    initAudioPlayer();
    initCrtEffect();
    initLiveClock();
});

function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const currentTheme = localStorage.getItem('tatakai-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('tatakai-theme', next);
        updateThemeIcon(next);
    });
}

function updateThemeIcon(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    if (theme === 'dark') {
        toggleBtn.innerHTML = '<i data-lucide="sun"></i>';
    } else {
        toggleBtn.innerHTML = '<i data-lucide="moon"></i>';
    }
    if (window.lucide) window.lucide.createIcons();
}

function initTimeline() {
    const vizContainer = document.getElementById('timeline-viz');
    if (!vizContainer) return;

    // Sort earliest to latest
    const sortedEvents = [...EVENTS].sort((a, b) => new Date(a.time) - new Date(b.time));

    // Build nodes
    sortedEvents.forEach((event, index) => {
        // Determine alternating sides
        const isLeft = index % 2 === 0;

        const nodeItem = document.createElement('div');
        nodeItem.className = `timeline-node-item ${isLeft ? 'left' : 'right'}`;

        // Timeline Dot / Pulsing Core
        const dotWrapper = document.createElement('div');
        dotWrapper.className = 'timeline-dot-wrapper';

        const dot = document.createElement('div');
        dot.className = `timeline-dot type-${event.type}`;
        // impact biggest, launch medium, intercept normal
        if (event.type === 'impact') dot.classList.add('lg');
        else if (event.type === 'launch') dot.classList.add('md');

        dotWrapper.appendChild(dot);

        // Timeline Content Card
        const card = document.createElement('div');
        card.className = 'timeline-card';
        card.innerHTML = `
      <div class="card-date">${new Date(event.time).toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</div>
      <div class="card-type type-${event.type}">${event.type.toUpperCase()}</div>
      <h3>${event.text}</h3>
    `;

        // Interaction
        card.addEventListener('click', () => openTimelineDetail(event));
        dot.addEventListener('click', () => openTimelineDetail(event));

        nodeItem.appendChild(dotWrapper);
        nodeItem.appendChild(card);
        vizContainer.appendChild(nodeItem);
    });
}

function openTimelineDetail(event) {
    const modal = document.getElementById('timeline-event-modal');
    const detailContent = document.getElementById('timeline-detail-content');
    const aiBox = document.getElementById('ai-explanation-content');

    const time = new Date(event.time).toLocaleString('en-US', {
        month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
    }) + ' UTC';

    const origin = (event.from && event.from.name) || 'Unknown';
    const target = (event.to && event.to.name) || 'Unknown';
    const locationStr = (event.from && event.to) ? `${origin} → ${target}` : target;

    detailContent.innerHTML = `
    <h4 style="font-size: 1.2rem; margin-bottom: 15px; color: var(--text-primary); line-height: 1.4;">${event.text}</h4>
    <div class="detail-meta">
      <span><i data-lucide="clock" style="width:14px;height:14px;"></i> ${time}</span>
      <span><i data-lucide="map-pin" style="width:14px;height:14px;"></i> ${locationStr}</span>
      <span><i data-lucide="check-circle" style="width:14px;height:14px;color:var(--color-success)"></i> ${event.status.toUpperCase()}</span>
    </div>
    <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-secondary);"><strong>Verified Detail:</strong> ${event.detail}</p>
    <p style="margin-top:10px; font-size:0.8rem; color: var(--text-muted);"><strong>Sources:</strong> ${event.sources.join(', ')}</p>
  `;

    aiBox.innerHTML = `<button id="generate-explanation-btn" class="generate-btn">Generate AI Context for this Event</button>`;

    // Groq wiring
    const btn = document.getElementById('generate-explanation-btn');
    btn.addEventListener('click', async () => {
        btn.textContent = "Analyzing Strategic Impact...";
        btn.disabled = true;

        try {
            const groqClient = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });
            const prompt = `You are a neutral, objective military analyst for Tatakai. Explain the strategic context of this event in exactly 3 short sentences. No fluff. Event: ${event.text}. Details: ${event.detail}`;

            const completion = await groqClient.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.3,
                max_tokens: 150,
            });

            aiBox.innerHTML = `
        <div class="ai-box-header">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i> AI Strategic Analysis
        </div>
        <div class="ai-box-body">
          ${completion.choices[0].message.content}
        </div>
      `;
            if (window.lucide) window.lucide.createIcons();

        } catch (err) {
            console.error(err);
            btn.textContent = "Error Generating Context";
            btn.style.backgroundColor = "var(--color-danger)";
        }
    });

    if (window.lucide) window.lucide.createIcons();

    modal.classList.remove('hidden');

    // Close wiring
    const closeBtn = document.getElementById('timeline-modal-close');
    const closeModal = (e) => {
        if (e.target === modal || e.target.closest('#timeline-modal-close')) {
            modal.classList.add('hidden');
            modal.removeEventListener('click', closeModal);
        }
    };
    modal.addEventListener('click', closeModal);
}
