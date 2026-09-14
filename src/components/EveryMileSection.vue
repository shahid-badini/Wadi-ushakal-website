<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import ResponsivePicture from './ui/ResponsivePicture.vue';
import { journey } from '../data/site';
import { photo } from '../data/images';
import { clamp, prefersReducedMotion, rafThrottle } from '../lib/utils';

const background = photo('uae-desert');
const STEP_THRESHOLDS = [0.04, 0.5, 0.96];
const ROUTE = 'M20 80 C 200 20, 330 110, 500 60 S 800 20, 980 70';

// Scroll-linked journey: 0 → 1 as the route scrolls through the viewport
const progress = ref(0);
const dot = ref({ x: 20, y: 80 });
const pct = computed(() => Math.round(progress.value * 100));

const sectionEl = ref(null);
const journeyEl = ref(null);
const pathEl = ref(null);

let pathLength = 0;
let visible = false;
let io;

function render(p) {
  // Skip tiny changes so Vue only re-renders when something visibly moves
  if (Math.abs(p - progress.value) < 0.002 && p !== 0 && p !== 1) return;
  progress.value = p;
  if (pathEl.value && pathLength) {
    const pt = pathEl.value.getPointAtLength(pathLength * p);
    dot.value = { x: pt.x, y: pt.y };
  }
}

// No background parallax: a moving photo under the frosted-glass cards makes the blur redraw every scroll frame
const update = rafThrottle(() => {
  if (!visible) return;
  const vh = window.innerHeight;
  const r = journeyEl.value.getBoundingClientRect();
  render(clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3)));
});

onMounted(() => {
  pathLength = pathEl.value?.getTotalLength() ?? 0;

  if (prefersReducedMotion()) {
    render(1);
    return;
  }

  io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) update();
    },
    { rootMargin: '100px 0px' },
  );
  io.observe(sectionEl.value);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
});

onBeforeUnmount(() => {
  io?.disconnect();
  window.removeEventListener('scroll', update);
  window.removeEventListener('resize', update);
});
</script>

<template>
  <section ref="sectionEl" class="mile" aria-labelledby="mile-title" :style="{ '--p': progress.toFixed(4) }">
    <!-- The photo is shown clean (no overlay); the copy and the journey sit on their own white cards -->
    <div class="mile__bg" aria-hidden="true">
      <ResponsivePicture :image="background" sizes="100vw" alt="" />
    </div>

    <div class="container mile__inner">
      <div class="mile__head">
        <p class="eyebrow" data-reveal>From pickup to destination</p>
        <h2 id="mile-title" data-reveal style="--reveal-delay: 80">
          Every Mile <span class="text-gradient">Matters.</span>
        </h2>
        <p class="lead" data-reveal style="--reveal-delay: 160">
          From pickup to destination, we focus on keeping your cargo moving safely and efficiently.
        </p>
      </div>

      <div ref="journeyEl" class="journey" data-reveal="fade">
        <div class="journey__meter panel" aria-hidden="true">
          <span>Journey</span>
          <strong>{{ pct }}%</strong>
        </div>

        <svg class="journey__route" viewBox="0 0 1000 120" aria-hidden="true">
          <path class="journey__track" :d="ROUTE" />
          <path ref="pathEl" class="journey__fill" :d="ROUTE" pathLength="1" />
          <circle class="journey__dot" r="7" :cx="dot.x.toFixed(1)" :cy="dot.y.toFixed(1)" />
        </svg>

        <ol class="journey__steps" role="list">
          <li
            v-for="(j, i) in journey"
            :key="j.step"
            class="journey__step"
            :class="{ 'is-active': progress >= STEP_THRESHOLDS[i] }"
          >
            <span class="journey__node" aria-hidden="true"><span></span></span>
            <span class="journey__num">{{ j.step }}</span>
            <h3>{{ j.title }}</h3>
            <p>{{ j.text }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mile {
  --p: 0;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding-block: clamp(6rem, 13vw, 10rem);
  min-height: min(100vh, 940px);
  display: flex;
  align-items: center;
  background: var(--bg);
}

.mile__bg {
  position: absolute;
  inset: 0;
  z-index: -3;
}

.mile__bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 70% 55%;
}

.mile__inner {
  position: relative;
}

.mile__head {
  display: grid;
  gap: 1rem;
  max-width: 42rem;
  padding: clamp(1.25rem, 3vw, 2.25rem);
}

/* Frosted-glass cards for the heading and the journey: the photo shows through, blurred, behind them */
.mile__head,
.journey {
  border-radius: var(--radius-lg);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.18) 100%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    0 24px 50px -28px rgba(15, 27, 42, 0.5);
}

/* Browsers without backdrop blur get a solid-enough card so the text stays readable */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .mile__head,
  .journey {
    background: rgba(255, 255, 255, 0.9);
  }
}

/* Darker copy on the glass for contrast */
.mile__head .lead,
.journey .journey__step p,
.journey .journey__num {
  color: var(--text);
}

.mile__head h2 {
  font-size: clamp(2.25rem, 1.3rem + 3vw, 4rem);
  line-height: 1.02;
}

/* Journey visual — on a glass card (styles shared with .mile__head above) */
.journey {
  position: relative;
  margin-top: clamp(3rem, 6vw, 5rem);
  padding: clamp(1.25rem, 3vw, 2.25rem);
}

.journey__meter {
  display: inline-flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.journey__meter strong {
  font-size: 1rem;
  letter-spacing: 0;
  color: var(--brand-deep);
  font-variant-numeric: tabular-nums;
  min-width: 3.2ch;
  text-align: right;
}

.journey__route {
  display: none;
  width: 100%;
  height: auto;
  overflow: visible;
}

.journey__route path {
  fill: none;
  stroke-linecap: round;
}

.journey__track {
  stroke: rgba(15, 27, 42, 0.22);
  stroke-width: 2;
  stroke-dasharray: 2 10;
}

.journey__fill {
  stroke: var(--brand-strong);
  stroke-width: 3.5;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--p));
}

.journey__dot {
  fill: #fff;
  stroke: var(--brand-strong);
  stroke-width: 4;
}

.journey__steps {
  position: relative;
  display: grid;
  gap: 2rem;
  margin: 0;
  padding-left: 3rem;
}

/* Vertical rail (mobile / tablet) */
.journey__steps::before,
.journey__steps::after {
  content: '';
  position: absolute;
  left: 13px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
}

.journey__steps::before {
  background: var(--line-2);
}

.journey__steps::after {
  background: linear-gradient(180deg, var(--brand), var(--brand-deep));
  transform-origin: top;
  transform: scaleY(var(--p));
}

.journey__step {
  position: relative;
  display: grid;
  gap: 0.4rem;
}

.journey__node {
  position: absolute;
  left: -3rem;
  top: 0.1rem;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--line-2);
  background: var(--surface);
  z-index: 1;
  transition:
    border-color 0.4s ease,
    box-shadow 0.4s ease;
}

.journey__node span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(15, 27, 42, 0.25);
  transition:
    background-color 0.4s ease,
    transform 0.4s var(--ease-out);
}

.journey__step.is-active .journey__node {
  border-color: var(--brand);
  box-shadow: 0 0 0 6px var(--brand-soft);
}

.journey__step.is-active .journey__node span {
  background: var(--brand-strong);
  transform: scale(1.3);
}

.journey__num {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--muted);
  transition: color 0.4s ease;
}

.journey__step.is-active .journey__num {
  color: var(--brand-deep);
}

.journey__step h3 {
  font-size: clamp(1.2rem, 1.05rem + 0.5vw, 1.5rem);
}

.journey__step p {
  color: var(--text-2);
  max-width: 30ch;
}

/* Desktop: horizontal route */
@media (min-width: 900px) {
  .journey__route {
    display: block;
    margin-bottom: -60px;
  }

  .journey__steps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    padding-left: 0;
    gap: 2.5rem;
  }

  .journey__steps::before,
  .journey__steps::after {
    display: none;
  }

  .journey__node {
    position: relative;
    left: auto;
    top: auto;
    margin-bottom: 1.25rem;
    width: 34px;
    height: 34px;
  }

  .journey__step:nth-child(2) {
    justify-items: center;
    text-align: center;
  }

  .journey__step:nth-child(3) {
    justify-items: end;
    text-align: right;
  }
}

</style>
