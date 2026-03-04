/**
 * Tatakai — AI Analyzer (Groq Integration)
 */
import Groq from 'groq-sdk';
import { EVENTS } from '../data/events.js';

let groq;

try {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (apiKey) {
    groq = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // fine for this prototype
    });
  } else {
    console.warn("Groq API key not found. AI Analyzer will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Groq SDK", error);
}

const SYSTEM_PROMPT = `
You are the Tatakai AI Analyzer. Your job is to explain geopolitical and military terms related to the ongoing Middle East conflict (March 2026).
Tatakai ethos: "Facts only. No gamification. Source-verified."

RULES:
1. Be intensely objective and neutral. NO opinions.
2. Use plain English that a 12-year-old could understand.
3. Keep answers under 100 words. Be concise.
4. Do not speculate on "who is winning" or who is right/wrong.
5. If you don't know the answer, say "I don't have verified information on that."
`;

export function initAnalyzer() {
  const analyzerBtn = document.getElementById('analyzer-toggle');
  const panel = document.getElementById('analyzer-panel');
  const closeBtn = document.getElementById('analyzer-close');
  const input = document.getElementById('analyzer-input');
  const sendBtn = document.getElementById('analyzer-send');
  const messagesDiv = document.getElementById('analyzer-messages');

  if (!groq) {
    // Hide the analyzer button entirely if no API key
    if (analyzerBtn) analyzerBtn.style.display = 'none';
    return;
  }

  // Toggle Panel
  analyzerBtn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // Handle Send
  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';

    // Add user message
    addMessage(text, 'user');

    // Add loading indicator
    const loadingId = addMessage('Thinking...', 'ai', true);

    try {
      // Build context string from recent events
      const recentEvents = [...EVENTS].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
      const contextStr = recentEvents.map(e => `${e.time}: ${e.text}`).join('\n');

      const stream = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: `${SYSTEM_PROMPT}\n\nRECENT EVENTS CONTEXT:\n${contextStr}` },
          { role: 'user', content: text }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 150,
        stream: true,
      });

      let fullResponse = '';
      const messageEl = document.getElementById(loadingId);
      if (messageEl) messageEl.textContent = ''; // clear "Thinking..."

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        if (messageEl) messageEl.textContent = fullResponse;
      }

    } catch (error) {
      console.error("Groq API Error:", error);
      const messageEl = document.getElementById(loadingId);
      if (messageEl) messageEl.textContent = "Error: Couldn't connect to AI. Please try again later.";
    }
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  return groq;
}

function addMessage(text, sender, isLoading = false) {
  const messagesDiv = document.getElementById('analyzer-messages');
  const id = 'msg-' + Math.random().toString(36).substr(2, 9);

  const div = document.createElement('div');
  div.className = `analyzer-msg ${sender}`;
  div.innerHTML = `<div class="msg-content" id="${id}">${text}</div>`;

  if (isLoading) {
    div.classList.add('loading');
  }

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  return id;
}
