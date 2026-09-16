<script setup>
import AppIcon from './ui/AppIcon.vue';
import { whyUs } from '../data/site';
</script>

<template>
  <section id="why-us" class="section why" aria-labelledby="why-title">
    <!-- Soft drifting colour orbs + dot grid behind the glass cards (transform-only animation) -->
    <div class="why__orbs" aria-hidden="true">
      <span class="why__orb why__orb--1"></span>
      <span class="why__orb why__orb--2"></span>
      <span class="why__orb why__orb--3"></span>
    </div>
    <div class="why__dots" aria-hidden="true"></div>

    <div class="container">
      <div class="section-head why__head">
        <h2 id="why-title" data-reveal style="--reveal-delay: 80">
          Trust, earned <span class="text-gradient">on every mile.</span>
        </h2>
      </div>

      <ul class="why__grid" role="list">
        <li
          v-for="(item, i) in whyUs"
          :key="item.title"
          class="why-card"
          data-reveal
          data-spotlight
          :style="{ '--reveal-delay': (i % 3) * 90 }"
        >
          <span class="why-card__num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="why-card__icon"><AppIcon :name="item.icon" :size="26" /></span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <span class="why-card__scan" aria-hidden="true"></span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.why {
  overflow: hidden;
  isolation: isolate;
  background: linear-gradient(180deg, #f4f7fb 0%, #eef3f9 100%);
  border-block: 1px solid var(--line);
}

/* Background: blurred colour orbs are plain radial gradients (no CSS blur filter), drifting with transforms */
.why__orbs {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.why__orb {
  position: absolute;
  width: min(46vw, 640px);
  aspect-ratio: 1;
  border-radius: 50%;
  animation: orb-drift 18s ease-in-out infinite alternate;
}

.why__orb--1 {
  top: -14%;
  left: -8%;
  background: radial-gradient(circle, rgba(74, 131, 184, 0.45) 0%, rgba(74, 131, 184, 0) 66%);
}

.why__orb--2 {
  top: 18%;
  right: -12%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.36) 0%, rgba(56, 189, 248, 0) 66%);
  animation-duration: 22s;
  animation-direction: alternate-reverse;
}

.why__orb--3 {
  bottom: -30%;
  left: 32%;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.32) 0%, rgba(129, 140, 248, 0) 66%);
  animation-duration: 26s;
}

@keyframes orb-drift {
  to {
    transform: translate3d(7%, 9%, 0) scale(1.12);
  }
}

/* Fine "data grid" of dots, fading out towards the edges */
.why__dots {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(rgba(47, 100, 151, 0.16) 1px, transparent 1.5px);
  background-size: 22px 22px;
  mask-image: radial-gradient(ellipse 75% 65% at 50% 55%, #000 25%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 55%, #000 25%, transparent 80%);
}

.why__head {
  max-width: 40rem;
}

.why__grid {
  display: grid;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
}

@media (min-width: 640px) {
  .why__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .why__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Glass card: translucent white over the soft background, with a light edge and a gradient rim.
   Nothing sharp sits behind the cards, so they look frosted without a costly backdrop blur. */
.why-card {
  --mx: 50%;
  --my: 50%;
  position: relative;
  display: grid;
  align-content: start;
  gap: 0.7rem;
  padding: clamp(1.5rem, 2.6vw, 2.25rem);
  border-radius: var(--radius-lg);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.46) 100%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 22px 46px -28px rgba(31, 72, 120, 0.45);
  overflow: hidden;
  isolation: isolate;
}

/* Gradient rim (brand blue → sky → indigo), brighter on hover */
.why-card::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(74, 131, 184, 0.7), rgba(56, 189, 248, 0.45) 45%, rgba(129, 140, 248, 0.6));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.45;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

/* Soft glow that follows the pointer (position set by lib/spotlight.js) */
.why-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(360px circle at var(--mx) var(--my), rgba(56, 189, 248, 0.16), transparent 45%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.why-card:hover::before {
  opacity: 1;
}

.why-card:hover::after {
  opacity: 1;
}

.why-card__num {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(47, 100, 151, 0.16);
  transition: -webkit-text-stroke-color 0.3s ease;
}

.why-card:hover .why-card__num {
  -webkit-text-stroke-color: rgba(56, 160, 224, 0.55);
}

/* Icon tile with a gradient and a glow; a ring appears around it on hover */
.why-card__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 0.6rem;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, var(--brand-strong) 0%, #3a9ad6 55%, #6f7cf0 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 12px 24px -12px rgba(47, 100, 151, 0.85);
  transition: transform 0.35s var(--ease-out);
}

.why-card__icon::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 21px;
  border: 1px solid rgba(58, 154, 214, 0.45);
  opacity: 0;
  transform: scale(0.88);
  transition:
    opacity 0.35s ease,
    transform 0.35s var(--ease-out);
}

.why-card:hover .why-card__icon {
  transform: translateY(-3px);
}

.why-card:hover .why-card__icon::after {
  opacity: 1;
  transform: scale(1);
}

.why-card h3 {
  font-size: clamp(1.1rem, 1rem + 0.35vw, 1.3rem);
}

.why-card p {
  color: var(--text-2);
  max-width: 30ch;
}

/* "Scan" line that sweeps along the bottom edge on hover */
.why-card__scan {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #38bdf8 30%, var(--brand-strong) 60%, transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.7s var(--ease-out);
}

.why-card:hover .why-card__scan {
  transform: scaleX(1);
}
</style>
