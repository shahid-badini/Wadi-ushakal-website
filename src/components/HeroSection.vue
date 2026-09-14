<script setup>
import AppIcon from './ui/AppIcon.vue';
import HeroAiLayer from './HeroAiLayer.vue';
import { company } from '../data/site';
import { photo } from '../data/images';

/*
 * The hero follows the reference artwork the owner supplied: cinematic UAE highway at sunset, the cargo
 * truck large and to the right, the copy on the left, a glowing logistics route through the sky and a
 * smart-logistics panel top right.
 *
 * It is built as layers, not as the flat reference: `hero-scene-wide.png` is that artwork cropped to the
 * scene alone (its baked-in headline, logo, buttons and panel are outside the crop — the original file is
 * kept as hero-scene.png), and everything readable on top is the site's own markup: real text, real links,
 * and the route / panel drawn in SVG and HTML by HeroAiLayer.vue.
 *
 * The scene is dark, so the hero runs on local light-on-dark tokens on the site's own brand blue. The
 * rest of the site stays on the light global palette.
 */
const scene = photo('hero-scene-wide');
</script>

<template>
  <section id="home" class="hero" aria-labelledby="hero-title">
    <div class="hero__art" aria-hidden="true">
      <picture>
        <source
          v-for="(srcset, format) in scene.sources"
          :key="`w-${format}`"
          :type="`image/${format}`"
          :srcset="srcset"
          sizes="100vw"
        />
        <img
          :src="scene.img.src"
          :width="scene.img.w"
          :height="scene.img.h"
          alt=""
          fetchpriority="high"
          decoding="async"
        />
      </picture>
    </div>

    <!-- glowing route, GPS pins, data points and the smart-logistics panel -->
    <HeroAiLayer />

    <div class="container hero__inner">
      <div class="hero__content">
        <p class="hero__eyebrow" data-hero-in style="--d: 0">
          <span class="hero__eyebrow-rule" aria-hidden="true"></span>
          UAE Transport &amp; Logistics
        </p>
        <h1 id="hero-title" class="hero__title" data-hero-in style="--d: 1">
          Your Cargo,<br />
          <span class="hero__title-accent">Our Commitment.</span>
        </h1>
        <p class="hero__tagline" data-hero-in style="--d: 2">{{ company.brand.tagline }}</p>
        <p class="hero__support" data-hero-in style="--d: 3">{{ company.brand.supporting }}</p>

        <div class="hero__actions" data-hero-in style="--d: 4">
          <RouterLink class="btn hero__btn hero__btn--primary" to="/contact">
            Get a Quote
            <AppIcon name="arrow" class="arrow" />
          </RouterLink>
          <a class="btn hero__btn hero__btn--ghost" href="#services">
            Explore Our Services
            <AppIcon name="arrow" class="arrow" />
          </a>
        </div>

        <ul class="hero__trust" role="list" data-hero-in style="--d: 5">
          <li>
            <span class="hero__trust-icon"><AppIcon name="truck" :size="18" /></span>
            <strong>Reliable<br />Transport</strong>
          </li>
          <li>
            <span class="hero__trust-icon"><AppIcon name="shield" :size="18" /></span>
            <strong>Cargo<br />Safety</strong>
          </li>
          <li>
            <span class="hero__trust-icon"><AppIcon name="network" :size="18" /></span>
            <strong>Seamless<br />Logistics</strong>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  /* hero-only palette: light type on the dark scene, accented with the site brand blue */
  --h-ink: #f5f9fd;
  --h-ink-2: rgba(226, 238, 250, 0.84);
  --h-accent: #4a83b8;
  --h-accent-soft: #8ec5ee;
  --h-glass: rgba(10, 20, 33, 0.5);
  --h-edge: rgba(168, 208, 240, 0.28);
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  color: var(--h-ink);
  background: #0b0d12;
}

/* ==========================================================================
   Scene
   ========================================================================== */
.hero__art {
  position: absolute;
  inset: 0;
  z-index: -3;
  overflow: hidden;
}

.hero__art :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* the truck sits right of centre in the crop; this keeps it there and the road running out of frame */
  object-position: 56% 66%;
}

/* Depth: the left third is deepened so the copy reads, and the bottom is closed off into the light page. */
.hero__art::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      100deg,
      rgba(6, 8, 13, 0.92) 0%,
      rgba(8, 10, 16, 0.82) 26%,
      rgba(10, 12, 18, 0.45) 50%,
      rgba(12, 14, 20, 0.12) 70%,
      rgba(12, 14, 20, 0) 100%
    ),
    radial-gradient(120% 95% at 62% 55%, transparent 42%, rgba(4, 6, 10, 0.55) 100%);
}

.hero__art::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 16%;
  background: linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 0.42) 62%, var(--bg) 100%);
}

/* ==========================================================================
   Copy
   ========================================================================== */
.hero__inner {
  position: relative;
  display: grid;
  align-items: center;
  padding-top: calc(var(--header-h) + clamp(2rem, 6vh, 4rem));
  padding-bottom: clamp(3.5rem, 11vh, 7rem);
}

.hero__content {
  max-width: 34rem;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--h-ink-2);
}

.hero__eyebrow-rule {
  width: 32px;
  height: 2px;
  border-radius: 2px;
  background: var(--h-accent);
}

/* Smaller than the global --fs-hero: the reference keeps the headline strong but not oversized. */
.hero__title {
  margin-top: 1rem;
  font-size: clamp(2rem, 1.35rem + 2.1vw, 3.35rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.03em;
  color: var(--h-ink);
}

.hero__title-accent {
  display: inline-block;
  padding-bottom: 0.06em;
  color: var(--h-accent-soft);
}

.hero__tagline {
  margin-top: 1.15rem;
  font-size: clamp(1rem, 0.94rem + 0.3vw, 1.2rem);
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--h-ink);
}

.hero__support {
  margin-top: 0.5rem;
  font-size: clamp(0.9rem, 0.88rem + 0.1vw, 0.98rem);
  color: var(--h-ink-2);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.9rem;
}

/* The shared .btn keeps the shape and spacing; the colours come from the hero's own palette. */
.hero__btn--primary {
  color: #ffffff;
  background: linear-gradient(135deg, var(--h-accent) 0%, var(--h-accent-soft) 100%);
  border: 1px solid transparent;
  box-shadow: 0 18px 38px -20px rgba(4, 12, 22, 0.9);
}

.hero__btn--primary:hover {
  background: linear-gradient(135deg, #5a93c8 0%, #7ab6e8 100%);
}

.hero__btn--ghost {
  color: var(--h-ink);
  background: var(--h-glass);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
  backdrop-filter: blur(10px) saturate(140%);
  border: 1px solid var(--h-edge);
}

.hero__btn--ghost:hover {
  background: rgba(16, 32, 52, 0.66);
  border-color: rgba(168, 208, 240, 0.45);
}

/* Trust points */
.hero__trust {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  margin: 2.2rem 0 0;
}

.hero__trust li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  padding-right: 1rem;
}

.hero__trust li + li {
  padding-left: 1rem;
  border-left: 1px solid var(--h-edge);
}

.hero__trust-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  color: var(--h-accent-soft);
  background: var(--h-glass);
  border: 1px solid var(--h-edge);
}

.hero__trust strong {
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--h-ink);
}

/* Intro animation (opacity + transform only) */
.js [data-hero-in] {
  opacity: 0;
  transform: translate3d(0, 20px, 0);
  animation: hero-in 0.9s var(--ease-out) forwards;
  animation-delay: calc(0.1s + var(--d) * 0.09s);
}

@keyframes hero-in {
  to {
    opacity: 1;
    transform: none;
  }
}

/* ==========================================================================
   Responsive
   ========================================================================== */
@media (min-width: 1800px) {
  .hero__content {
    max-width: 38rem;
  }
}

/* Tablet & phone: a taller frame, so the crop pulls in and the wash runs downwards. The copy comes first
   and the truck sits below it, which is the order asked for on mobile. */
@media (max-width: 1099px) {
  .hero {
    align-items: flex-start;
  }
  .hero__art :deep(img) {
    object-position: 56% 76%;
  }
  .hero__art::before {
    background:
      linear-gradient(
        176deg,
        rgba(6, 8, 13, 0.94) 0%,
        rgba(8, 10, 16, 0.86) 32%,
        rgba(10, 12, 18, 0.5) 58%,
        rgba(12, 14, 20, 0.18) 100%
      ),
      radial-gradient(150% 85% at 55% 70%, transparent 38%, rgba(4, 6, 10, 0.5) 100%);
  }
  .hero__inner {
    padding-top: calc(var(--header-h) + clamp(1.75rem, 5vh, 3rem));
    padding-bottom: 38vh;
  }
  .hero__content {
    max-width: 34rem;
  }
}

/* Narrow screens: trust points as three compact columns */
@media (max-width: 699px) {
  .hero__trust {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 1.8rem;
  }
  .hero__trust li {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.45rem;
    padding-right: 0.5rem;
  }
  .hero__trust li + li {
    padding-left: 0.5rem;
  }
  .hero__trust strong {
    font-size: 0.74rem;
  }
}

@media (max-width: 479px) {
  .hero__eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.16em;
  }
  .hero__actions {
    gap: 0.6rem;
    margin-top: 1.6rem;
  }
  .hero__actions .btn {
    flex: 1 1 auto;
    padding-inline: 1rem;
  }
  .hero__tagline {
    margin-top: 1rem;
  }
  .hero__inner {
    padding-bottom: 34vh;
  }
  .hero__trust-icon {
    width: 31px;
    height: 31px;
  }
}

@media (max-width: 359px) {
  .hero__actions .btn {
    flex-basis: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .js [data-hero-in] {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
</style>
