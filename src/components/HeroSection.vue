<script setup>
import AppIcon from './ui/AppIcon.vue';
import { company } from '../data/site';
import { photo } from '../data/images';

// The hero is the owner's own photograph of a cargo truck, used exactly as supplied (no crop, no colour
// edit — the framing is done with object-position below). It sits in a panel on the right so the copy on
// the left stays on the plain page background: no overlay or fade is needed anywhere over the photo.
const road = photo('hero-logistics');
</script>

<template>
  <section id="home" class="hero" aria-labelledby="hero-title">
    <!-- Photograph of the truck: a panel on the right on desktop, the lower part of the scene on phones -->
    <div class="hero__bg" aria-hidden="true">
      <picture>
        <source
          v-for="(srcset, format) in road.sources"
          :key="`w-${format}`"
          :type="`image/${format}`"
          :srcset="srcset"
          sizes="100vw"
        />
        <img :src="road.img.src" :width="road.img.w" :height="road.img.h" alt="" fetchpriority="high" decoding="async" />
      </picture>
    </div>

    <!-- Two columns on desktop: copy on the left, the photo and the contact panel on the right -->
    <div class="container hero__inner">
      <div class="hero__content">
        <p class="hero__badge" data-hero-in style="--d: 0">
          <span class="hero__badge-icon"><AppIcon name="truck" :size="16" /></span>
          <span>UAE Transport &amp; Logistics</span>
          <span class="hero__badge-loc"><AppIcon name="pin" :size="14" />Abu Dhabi</span>
        </p>
        <h1 id="hero-title" class="hero__title" data-hero-in style="--d: 1">
          Your Cargo,<br />
          <span class="text-gradient">Our Commitment.</span>
        </h1>
        <p class="hero__tagline" data-hero-in style="--d: 2">{{ company.brand.tagline }}</p>
        <p class="hero__support" data-hero-in style="--d: 3">{{ company.brand.supporting }}</p>

        <div class="hero__actions" data-hero-in style="--d: 4">
          <RouterLink class="btn btn--primary" to="/contact">
            Get in Touch
            <AppIcon name="arrow" class="arrow" />
          </RouterLink>
          <a class="btn btn--ghost" href="#services">
            Our Services
            <AppIcon name="arrow" class="arrow" />
          </a>
        </div>

        <ul class="hero__trust" role="list" data-hero-in style="--d: 5">
          <li>
            <span class="hero__trust-icon"><AppIcon name="shield" :size="18" /></span>
            <strong>Cargo Safety</strong>
          </li>
          <li>
            <span class="hero__trust-icon"><AppIcon name="truck" :size="18" /></span>
            <strong>Reliable Transport</strong>
          </li>
          <li>
            <span class="hero__trust-icon"><AppIcon name="pin" :size="18" /></span>
            <strong>UAE-Based</strong>
          </li>
        </ul>
      </div>

      <!-- One substantial panel on the right rather than a scatter of small cards -->
      <aside class="hero__panel" data-hero-in style="--d: 6">
        <p class="hero__panel-label">
          <span class="hero__panel-dot" aria-hidden="true"></span>
          Direct line
        </p>
        <a class="hero__panel-phone" :href="company.phoneHref">{{ company.phoneDisplay }}</a>
        <p class="hero__panel-note">Speak to us about your load — pickup, route and timing.</p>

        <ul class="hero__panel-list" role="list">
          <li>
            <span class="hero__panel-icon"><AppIcon name="pin" :size="18" /></span>
            <span>
              <strong>Al Dhafra, Abu Dhabi</strong>
              Beda Zayed Industrial Area
            </span>
          </li>
          <li>
            <span class="hero__panel-icon"><AppIcon name="truck" :size="18" /></span>
            <span>
              <strong>Cargo, heavy &amp; commercial</strong>
              Road transport across the UAE
            </span>
          </li>
        </ul>

        <RouterLink class="hero__panel-cta" to="/contact">
          Request a quote
          <AppIcon name="arrow" class="arrow" />
        </RouterLink>
      </aside>
    </div>

  </section>
</template>

<style scoped>
.hero {
  /* the service ticker that used to run along the bottom has been removed */
  --ticker-h: 0px;
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
  background: var(--bg-3);
}

/* The photograph covers the whole hero — left, right, top and bottom — and carries no overlay, wash or
   tint of any kind. The copy stays readable because it sits on its own frosted card (.hero__content), not
   because the photo has been darkened or washed out. */
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -3;
  overflow: hidden;
}

/* The section below the hero is on the light page background, so the photo used to stop dead at the hero's
   bottom edge. This is a thin closure along that edge only — the photo itself is left clean. */
.hero__bg::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 15%;
  z-index: 1;
  background: linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 0.55) 62%, var(--bg) 100%);
}

.hero__bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* keeps the truck low and to the right, with the sky and the flyover behind the copy */
  object-position: 60% 58%;
  /* light treatment only — the overcast sky stays bright, matching the light theme */
  filter: contrast(1.04) saturate(1.04);
}

/* Tablet & phone: the photo still covers the whole hero; the crop moves so the truck stays in view below
   the copy card rather than behind it. */
@media (max-width: 1099px) {
  .hero__bg :deep(img) {
    object-position: 62% 72%;
  }
}

.hero__inner {
  position: relative;
  display: grid;
  align-items: center;
  padding-top: calc(var(--header-h) + clamp(2rem, 6vh, 4.5rem));
  padding-bottom: calc(var(--ticker-h) + clamp(4rem, 10vh, 7rem));
}

/* No panel or wash behind the copy: the dark type carries its own soft light halo instead, which keeps it
   readable wherever the photograph happens to be dark while leaving the photo itself untouched. */
.hero__content {
  /* wide enough for "Our Commitment." on one line, still inside the left half at every desktop width */
  max-width: 38rem;
  text-shadow:
    0 1px 2px rgba(255, 255, 255, 0.75),
    0 0 16px rgba(255, 255, 255, 0.65);
}

/* Badge */
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.3rem 1rem 0.3rem 0.3rem;
  border-radius: 999px;
  /* tinted rather than white, so it separates from the white card behind it */
  background: var(--brand-tint);
  border: 1px solid rgba(74, 131, 184, 0.22);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text);
}

.hero__badge-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fff;
  background: var(--brand-strong);
}

.hero__badge-loc {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding-left: 0.7rem;
  border-left: 1px solid var(--line-2);
  color: var(--brand-deep);
}

/* Headline */
.hero__title {
  margin-top: 1.25rem;
  font-size: var(--fs-hero);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.035em;
}

/* On the photograph the gradient fill washed out against the bright clouds, and a text-shadow cannot help a
   background-clipped fill, so this line is painted in one deep brand tone with its own halo instead. */
.hero__title .text-gradient {
  display: inline-block;
  padding-bottom: 0.06em;
  background: none;
  -webkit-background-clip: border-box;
  background-clip: border-box;
  -webkit-text-fill-color: currentColor;
  color: #255a8c;
  text-shadow:
    0 1px 2px rgba(255, 255, 255, 0.8),
    0 0 18px rgba(255, 255, 255, 0.7);
}

.hero__tagline {
  margin-top: 1.5rem;
  font-size: clamp(1.05rem, 0.95rem + 0.45vw, 1.35rem);
  font-weight: 650;
  color: var(--text);
  letter-spacing: -0.01em;
}

.hero__support {
  margin-top: 0.5rem;
  font-size: clamp(0.95rem, 0.92rem + 0.15vw, 1.05rem);
  color: var(--text-2);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 2rem;
}

/* Trust points — open layout, divided by thin lines */
.hero__trust {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  margin: 2.5rem 0 0;
}

/* the trust row sits lowest, where the photo is darkest (the truck), so each point gets a light capsule
   of its own rather than relying on the halo */
.hero__trust li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  padding: 0.3rem 0.85rem 0.3rem 0.3rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
}

.hero__trust li + li {
  margin-left: 0.6rem;
}

.hero__trust strong {
  text-shadow: none;
}

.hero__trust-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: var(--brand-strong);
  background: var(--brand-tint);
  border: 1px solid rgba(74, 131, 184, 0.25);
}

.hero__trust strong {
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text);
}

/* Intro animation for hero content (opacity + transform only) */
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
   Contact panel on the right — one generous card instead of several small ones
   ========================================================================== */
.hero__panel {
  display: none;
  justify-self: end;
  width: min(24rem, 100%);
  padding: 1.75rem 1.75rem 1.5rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.9);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  backdrop-filter: blur(16px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: var(--shadow-lg);
}

.hero__panel-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-deep);
}

/* pulse drawn with transform/opacity on a pseudo-element (no box-shadow repaint) */
.hero__panel-dot {
  position: relative;
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ok);
}

.hero__panel-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--ok);
  animation: panel-pulse 2.4s ease-out infinite;
}

@keyframes panel-pulse {
  from {
    transform: scale(1);
    opacity: 0.55;
  }
  to {
    transform: scale(3);
    opacity: 0;
  }
}

.hero__panel-phone {
  display: inline-block;
  margin-top: 0.6rem;
  font-size: clamp(1.4rem, 1.1rem + 0.8vw, 1.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
  text-decoration: none;
  font-variant-numeric: tabular-nums;
}

.hero__panel-phone:hover {
  color: var(--brand-deep);
}

.hero__panel-note {
  margin: 0.4rem 0 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text-2);
}

.hero__panel-list {
  margin: 1.35rem 0 0;
  padding: 1.35rem 0 0;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 1rem;
}

.hero__panel-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.hero__panel-list strong {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
}

.hero__panel-list span span,
.hero__panel-list li > span:last-child {
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--muted);
}

.hero__panel-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--brand-tint);
  color: var(--brand-strong);
}

.hero__panel-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--brand-deep);
  text-decoration: none;
}

.hero__panel-cta .arrow {
  transition: transform 0.25s var(--ease-out);
}

.hero__panel-cta:hover .arrow {
  transform: translateX(4px);
}

/* Desktop: copy on the left, the contact panel over the photo on the right */
@media (min-width: 1100px) {
  .hero__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, auto);
    column-gap: clamp(2rem, 4vw, 5rem);
  }
  .hero__panel {
    display: block;
  }
}

@media (min-width: 1100px) and (max-height: 720px) {
  .hero__panel {
    padding: 1.35rem 1.35rem 1.15rem;
  }
  .hero__panel-list {
    margin-top: 1rem;
    padding-top: 1rem;
    gap: 0.75rem;
  }
}

@media (min-width: 1800px) {
  .hero__content {
    max-width: 44rem;
  }
}

/* Tablet & mobile: copy on top, the truck in the lower part of the scene */
@media (max-width: 1099px) {
  .hero {
    align-items: flex-start;
  }
  .hero__inner {
    padding-top: calc(var(--header-h) + clamp(1.75rem, 5vh, 3.5rem));
    padding-bottom: calc(var(--ticker-h) + 40vh);
  }
}

@media (max-width: 1099px) and (min-width: 700px) {
  .hero__inner {
    padding-bottom: calc(var(--ticker-h) + 34vh);
  }
}

/* Narrow screens: trust points as three compact columns */
@media (max-width: 699px) {
  .hero__trust {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 1.75rem;
  }
  .hero__trust li {
    flex-direction: column;
    gap: 0.45rem;
    padding: 0.55rem 0.4rem;
    text-align: center;
    white-space: normal;
  }
  .hero__trust li + li {
    margin-left: 0.4rem;
  }
  .hero__trust strong {
    font-size: 0.75rem;
  }
}

@media (max-width: 479px) {
  .hero__trust {
    display: none;
  }
  .hero__badge {
    font-size: 0.68rem;
    letter-spacing: 0.08em;
  }
  .hero__actions {
    gap: 0.6rem;
    margin-top: 1.75rem;
  }
  .hero__actions .btn {
    flex: 1 1 auto;
    padding-inline: 1.05rem;
  }
  .hero__tagline {
    margin-top: 1.25rem;
  }
  .hero__inner {
    padding-bottom: 34vh;
  }
}

@media (max-width: 419px) {
  .hero__badge-loc {
    display: none;
  }
}

@media (max-width: 359px) {
  .hero__actions .btn {
    flex-basis: 100%;
  }
}

/* Landscape phones: keep text readable, the scene stays behind */
@media (max-width: 1099px) and (max-height: 500px) and (orientation: landscape) {
  .hero__inner {
    padding-bottom: calc(var(--ticker-h) + 3rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .js [data-hero-in] {
    opacity: 1;
    transform: none;
    animation: none;
  }
  .hero__panel-dot::after {
    animation: none;
  }
}
</style>
