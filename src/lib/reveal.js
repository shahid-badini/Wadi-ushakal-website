import { prefersReducedMotion } from './utils';
/** One-shot scroll reveals for [data-reveal], [data-reveal-img] and the UAE map ([data-map]). */
export function initReveal() {
    const targets = document.querySelectorAll('[data-reveal], [data-reveal-img], [data-map]');
    const show = (el) => {
        if (el.hasAttribute('data-reveal') || el.hasAttribute('data-reveal-img'))
            el.classList.add('is-visible');
        if (el.hasAttribute('data-map'))
            el.classList.add('is-live');
    };
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        targets.forEach(show);
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting)
                return;
            show(entry.target);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((el) => io.observe(el));
}
