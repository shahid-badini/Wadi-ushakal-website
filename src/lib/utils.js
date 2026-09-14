export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
/** Calls `fn` at most once per animation frame. */
export function rafThrottle(fn) {
    let queued = false;
    let lastArgs;
    return (...args) => {
        lastArgs = args;
        if (queued)
            return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            fn(...lastArgs);
        });
    };
}
/** Runs `onChange(true|false)` as the element enters / leaves the viewport. Returns a function that stops watching. */
export function watchVisibility(el, onChange, rootMargin = '0px') {
    if (!('IntersectionObserver' in window)) {
        onChange(true);
        return () => {};
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => onChange(e.isIntersecting)), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
}
