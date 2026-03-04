/**
 * Tatakai — SVG Risk Gauge  
 * Animated arc gauge for strategic risk score (0-100)
 */

export function initRiskGauge() {
    const container = document.getElementById('risk-gauge-container');
    if (!container) return;

    const score = 67; // Current risk score (would be computed from live data)
    const trend = 'escalating'; // escalating | de-escalating | stable

    renderGauge(container, score, trend);
}

function renderGauge(container, score, trend) {
    const color = getScoreColor(score);
    const level = getScoreLevel(score);
    const trendArrow = trend === 'escalating' ? '↑' : trend === 'de-escalating' ? '↓' : '→';
    const trendColor = trend === 'escalating' ? 'var(--threat-critical)' : trend === 'de-escalating' ? 'var(--threat-low)' : 'var(--text-muted)';

    // SVG arc gauge
    const radius = 52;
    const circumference = Math.PI * radius; // Half circle
    const dashOffset = circumference - (score / 100) * circumference;

    container.innerHTML = `
    <div class="risk-gauge">
      <svg viewBox="0 0 120 70" class="risk-gauge-svg">
        <!-- Background arc -->
        <path 
          d="M 10 65 A 52 52 0 0 1 110 65" 
          fill="none" 
          stroke="var(--border-color)" 
          stroke-width="6"
          stroke-linecap="round"
        />
        <!-- Score arc (animated) -->
        <path 
          d="M 10 65 A 52 52 0 0 1 110 65" 
          fill="none" 
          stroke="${color}" 
          stroke-width="6"
          stroke-linecap="round"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${circumference}"
          class="risk-gauge-fill"
          style="--target-offset: ${dashOffset};"
        />
        <!-- Score text -->
        <text x="60" y="52" text-anchor="middle" class="risk-gauge-score" fill="var(--text-primary)">${score}</text>
        <text x="60" y="64" text-anchor="middle" class="risk-gauge-label" fill="${color}">${level}</text>
      </svg>
      <div class="risk-gauge-trend" style="color:${trendColor}">
        <span class="trend-arrow">${trendArrow}</span>
        <span>${trend.toUpperCase()}</span>
      </div>
    </div>
  `;

    // Trigger animation
    requestAnimationFrame(() => {
        const fill = container.querySelector('.risk-gauge-fill');
        if (fill) {
            fill.style.strokeDashoffset = dashOffset;
        }
    });
}

function getScoreColor(score) {
    if (score >= 75) return 'var(--threat-critical)';
    if (score >= 50) return 'var(--threat-high)';
    if (score >= 25) return 'var(--threat-medium)';
    return 'var(--threat-low)';
}

function getScoreLevel(score) {
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'ELEVATED';
    if (score >= 25) return 'GUARDED';
    return 'LOW';
}
