/**
 * Tatakai — Share Modal Component
 */

export function initShare() {
    const shareBtn = document.getElementById('share-btn');
    const modal = document.getElementById('share-modal');
    const closeBtn = document.getElementById('modal-close');
    const copyBtn = document.getElementById('share-copy');

    const shareText = 'Tatakai.live — Day 3: 347 launches, ~78% intercepted, 12 civilian impacts. Live conflict tracker with verified sources only. https://tatakai.live';

    shareBtn.addEventListener('click', () => {
        // Try native Web Share API (mobile)
        if (navigator.share) {
            navigator.share({
                title: 'Tatakai — Real-Time Conflict Tracker',
                text: shareText,
                url: 'https://tatakai.live',
            }).catch(() => {
                // Fallback to modal
                modal.classList.remove('hidden');
            });
        } else {
            modal.classList.remove('hidden');
        }
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Copy link
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            copyBtn.querySelector('span').textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.querySelector('span').textContent = 'Copy Link';
            }, 2000);
        } catch {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = shareText;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            copyBtn.querySelector('span').textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.querySelector('span').textContent = 'Copy Link';
            }, 2000);
        }
    });

    // Share links
    const encoded = encodeURIComponent(shareText);
    const url = encodeURIComponent('https://tatakai.live');

    document.getElementById('share-whatsapp').href = `https://wa.me/?text=${encoded}`;
    document.getElementById('share-telegram').href = `https://t.me/share/url?url=${url}&text=${encoded}`;
    document.getElementById('share-x').href = `https://twitter.com/intent/tweet?text=${encoded}`;

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
        }
    });
}
