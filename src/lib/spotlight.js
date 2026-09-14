import { hasFinePointer, prefersReducedMotion } from './utils';
/** Pointer-following glow on [data-spotlight] cards. */
export function initSpotlight() {
    if (!hasFinePointer() || prefersReducedMotion())
        return;
    document.querySelectorAll('[data-spotlight]').forEach((card) => {
        card.addEventListener('pointermove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        }, { passive: true });
    });
}
