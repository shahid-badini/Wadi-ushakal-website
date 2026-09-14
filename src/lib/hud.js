import { prefersReducedMotion, watchVisibility } from './utils';

const CYCLE_MS = 8000;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Illustrative hero dashboard.
 * The progress dot and bar are animated in CSS (see HeroSection.vue → .is-running), so they stay off the main thread.
 * This only updates the "% progress" readout about 10 times a second, and only while the hero is on screen.
 */
export function initHud() {
  const hud = document.querySelector('.hero__hud');
  const label = document.querySelector('[data-hud-progress]');
  const hero = document.getElementById('home');
  if (!hud || !label || !hero || prefersReducedMotion()) return;

  const desktop = window.matchMedia('(min-width: 1100px)');
  const start = performance.now();
  let visible = true;
  let timer = 0;

  // Start the CSS animation now so it shares a clock with the text readout
  hud.classList.add('is-running');

  const tick = () => {
    const t = ((performance.now() - start) % CYCLE_MS) / CYCLE_MS;
    // travels for 85% of the cycle, then holds at destination (matches the CSS keyframes)
    label.textContent = `${Math.round(easeInOut(Math.min(1, t / 0.85)) * 100)}%`;
  };

  const sync = () => {
    clearInterval(timer);
    timer = 0;
    if (visible && desktop.matches && !document.hidden) {
      tick();
      timer = window.setInterval(tick, 100);
    }
  };

  const unwatch = watchVisibility(hero, (v) => {
    visible = v;
    sync();
  });
  desktop.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);

  // Cleanup for when the hero unmounts (navigating to another page)
  return () => {
    clearInterval(timer);
    unwatch();
    desktop.removeEventListener('change', sync);
    document.removeEventListener('visibilitychange', sync);
  };
}
