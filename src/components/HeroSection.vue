<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppIcon from './ui/AppIcon.vue';
import HeroAiLayer from './HeroAiLayer.vue';
import { company } from '../data/site';
import { initHeroScene } from '../lib/hero-loader';

/*
 * The hero is a live 3D scene (Three.js): a Wadi Nushakal truck driving forward down a desert highway in
 * clear daylight — wheels turning, cab riding the suspension, the world streaming past and a slow camera
 * parallax. `src/lib/hero/` builds it; `hero-loader.js` loads it after first paint and skips it when there
 * is no GPU, when Save-Data is on, or when WebGL is software-rendered. In those cases the CSS horizon below
 * is what shows, so the hero is never blank.
 *
 * The copy, the logistics route and the status panel stay in HTML/SVG on top, where they are readable and
 * can be positioned against the text.
 */
// "Get Started": the visitor can type their email here and land on the contact form with it filled in.
// There is no account system and nothing is submitted from the hero — see the note in ContactForm.vue.
const router = useRouter();
const email = ref('');
const emailError = ref('');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function start() {
  const value = email.value.trim();
  if (value && !EMAIL_RE.test(value)) {
    emailError.value = 'Please enter a valid email address.';
    return;
  }
  emailError.value = '';
  router.push(value ? { path: '/contact', query: { email: value } } : { path: '/contact' });
}

let stopScene;
onMounted(() => {
  stopScene = initHeroScene();
});
onBeforeUnmount(() => stopScene?.());
</script>

<template>
  <section id="home" class="hero" aria-labelledby="hero-title">
    <!-- CSS horizon: behind the canvas while it loads, and the fallback when the scene is skipped -->
    <div class="hero__sky" aria-hidden="true"></div>
    <!-- the 3D scene mounts its canvas here -->
    <div class="hero__stage" data-hero-stage aria-hidden="true"></div>

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

        <form class="hero__start" data-hero-in style="--d: 4" novalidate @submit.prevent="start">
          <div class="hero__field">
            <label class="sr-only" for="hero-email">Your email address</label>
            <span class="hero__field-icon" aria-hidden="true"><AppIcon name="mail" :size="18" /></span>
            <input
              id="hero-email"
              v-model="email"
              class="hero__input"
              type="email"
              name="email"
              autocomplete="email"
              inputmode="email"
              placeholder="you@company.com"
              :aria-invalid="emailError ? 'true' : null"
              :aria-describedby="emailError ? 'hero-email-err' : 'hero-email-hint'"
              @input="emailError = ''"
            />
            <button class="btn hero__btn hero__btn--primary" type="submit">
              Get Started
              <AppIcon name="arrow" class="arrow" />
            </button>
          </div>
          <p v-if="emailError" id="hero-email-err" class="hero__field-error" aria-live="polite">{{ emailError }}</p>
          <p v-else id="hero-email-hint" class="hero__field-hint">
            We'll take you to the quote form with your email filled in.
          </p>
        </form>

        <div class="hero__actions" data-hero-in style="--d: 5">
          <a class="btn hero__btn hero__btn--ghost" href="#services">
            Explore Our Services
            <AppIcon name="arrow" class="arrow" />
          </a>
        </div>

        <ul class="hero__trust" role="list" data-hero-in style="--d: 6">
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
  /* hero palette: the site's own light tokens, over the daylight 3D scene */
  --h-ink: var(--text);
  --h-ink-2: var(--text-2);
  --h-accent: var(--brand-strong);
  --h-accent-soft: var(--brand-deep);
  --h-glass: rgba(255, 255, 255, 0.82);
  --h-edge: rgba(74, 131, 184, 0.28);
  position: relative;
  display: flex;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  color: var(--h-ink);
  background: var(--bg-3);
}

/* ==========================================================================
   Scene
   ========================================================================== */
/* Daylight horizon in CSS: shown while the canvas loads, and left in place when the scene is skipped
   (no WebGL, Save-Data, or software rendering). Static — no animation, so it costs nothing. */
.hero__sky {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    radial-gradient(80% 50% at 66% 72%, rgba(255, 246, 228, 0.65) 0%, rgba(255, 246, 228, 0) 62%),
    linear-gradient(180deg, #7fb0dd 0%, #bcd8ee 38%, #eef3f7 63%, #e3d7bf 64%, #cdbb98 100%);
}

.hero__stage {
  position: absolute;
  inset: 0;
  z-index: -2;
}

.hero__stage :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

.hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  height: 14%;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, rgba(245, 245, 245, 0.4) 62%, var(--bg) 100%);
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
  /* No wash and no glow: a text-shadow halo over the scene made every glyph look smudged. The copy sits on
     the light desert and sky, so the dark type reads on its own and stays razor-sharp. */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin: 0;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--h-accent-soft);
}

.hero__eyebrow-rule {
  width: 32px;
  height: 2px;
  border-radius: 2px;
  background: var(--h-accent);
}

/* Smaller than the global --fs-hero: strong but not oversized. */
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
  font-size: clamp(0.94rem, 0.9rem + 0.15vw, 1.02rem);
  font-weight: 500;
  color: var(--text);
}

.hero__start {
  margin-top: 1.9rem;
  max-width: 30rem;
}

/* One rounded row: mail icon, input, and the Get Started button sitting inside it */
.hero__field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.35rem 0.35rem 0.9rem;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid var(--line-2);
  box-shadow: var(--shadow);
}

.hero__field-icon {
  display: grid;
  place-items: center;
  flex: none;
  color: var(--brand-strong);
}

.hero__input {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.55rem 0.1rem;
  border: 0;
  background: none;
  font: inherit;
  font-size: 0.95rem;
  color: var(--text);
}

.hero__input::placeholder {
  color: var(--muted);
}

.hero__input:focus {
  outline: none;
}

.hero__field:focus-within {
  border-color: var(--brand);
  box-shadow:
    var(--shadow),
    0 0 0 3px rgba(74, 131, 184, 0.22);
}

.hero__field-hint,
.hero__field-error {
  margin: 0.55rem 0 0 1rem;
  font-size: 0.82rem;
  color: var(--text-2);
}

.hero__field-error {
  color: var(--error);
  font-weight: 600;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* The shared .btn keeps the shape and spacing; the colours come from the hero's own palette. */
.hero__btn--primary {
  color: var(--on-brand);
  background: linear-gradient(135deg, var(--brand-strong) 0%, #3a8fcb 100%);
  border: 1px solid transparent;
  box-shadow: var(--shadow);
}

.hero__btn--primary:hover {
  background: linear-gradient(135deg, var(--brand-hover) 0%, #3182bd 100%);
}

.hero__btn--ghost {
  color: var(--text);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--line);
}

.hero__btn--ghost:hover {
  background: #ffffff;
  border-color: var(--line-2);
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
  color: var(--brand-strong);
  background: var(--brand-tint);
  border: 1px solid rgba(74, 131, 184, 0.25);
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

/* Tablet & phone: the copy comes first and the truck sits below it (scene.js frames the camera for this) */
@media (max-width: 1099px) {
  .hero {
    align-items: flex-start;
  }
  .hero__inner {
    padding-top: calc(var(--header-h) + clamp(1.75rem, 5vh, 3rem));
    padding-bottom: 38vh;
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

/* Small phones: the email row stacks, so nothing is squeezed past the edge */
@media (max-width: 519px) {
  .hero__field {
    flex-wrap: wrap;
    padding: 0.75rem 0.9rem;
    border-radius: var(--radius);
  }
  .hero__input {
    flex: 1 1 100%;
    padding: 0.35rem 0;
  }
  .hero__field .btn {
    flex: 1 1 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
  .hero__field-hint,
  .hero__field-error {
    margin-left: 0.25rem;
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
