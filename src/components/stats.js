/**
 * Tatakai — Animated Stats Cards
 */

export function initStats() {
    const statValues = document.querySelectorAll('.stat-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => observer.observe(el));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    const suffix = element.dataset.suffix || '';
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        element.textContent = current.toLocaleString() + (target > 100 ? '+' : '') + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Update a specific stat
export function updateStat(id, value, suffix = '') {
    const card = document.getElementById(id);
    if (!card) return;

    const valueEl = card.querySelector('.stat-value');
    if (valueEl) {
        valueEl.style.animation = 'countUp 0.4s var(--ease-out)';
        valueEl.textContent = value.toLocaleString() + suffix;
        setTimeout(() => { valueEl.style.animation = ''; }, 400);
    }
}
