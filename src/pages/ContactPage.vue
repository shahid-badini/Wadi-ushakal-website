<script setup>
import { onMounted } from 'vue';
import AppIcon from '../components/ui/AppIcon.vue';
import ContactForm from '../components/ContactForm.vue';
import { company } from '../data/site';
import { initReveal } from '../lib/reveal';
import { usePageHead } from '../lib/head';

usePageHead({
  path: '/contact',
  title: 'Contact Us | Wadi Nushakal — UAE Transport & Logistics',
  description:
    'Have a transportation requirement? Get in touch with Wadi Nushakal in Beda Zayed, Al Dhafra, Abu Dhabi — by email, phone or with a quote request.',
});

const mailto = `mailto:${company.email}`;
const cards = [
  { icon: 'building', label: 'Company', value: company.name, sub: 'Transport & Logistics · UAE' },
  { icon: 'mail', label: 'Email', value: company.email, href: mailto },
  { icon: 'phone', label: 'Phone', value: company.phoneDisplay, href: company.phoneHref },
  { icon: 'pin', label: 'Address', value: company.address.full, href: company.address.mapsHref, map: true },
];

onMounted(initReveal);
</script>

<template>
  <section class="contact-hero" aria-labelledby="contact-title">
    <div class="grid-bg" aria-hidden="true"></div>
    <svg class="contact-hero__lines" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
      <path d="M-40 470 C 260 420, 460 560, 760 470 S 1200 330, 1480 400" />
      <path d="M-40 540 C 320 500, 560 610, 860 540 S 1240 450, 1480 500" />
    </svg>

    <div class="container contact-hero__grid">
      <div class="contact-hero__copy">
        <h1 id="contact-title" data-reveal style="--reveal-delay: 80">
          Let’s Move <span class="text-gradient">Your Cargo.</span>
        </h1>
        <p class="lead" data-reveal style="--reveal-delay: 160">
          Have a transportation requirement? Get in touch with Wadi Nushakal and let’s discuss your logistics needs.
        </p>
        <ul class="contact-hero__quick" role="list" data-reveal style="--reveal-delay: 220">
          <li>
            <a :href="company.phoneHref"><AppIcon name="phone" :size="18" />{{ company.phoneDisplay }}</a>
          </li>
          <li>
            <a :href="mailto"><AppIcon name="mail" :size="18" />{{ company.email }}</a>
          </li>
        </ul>
      </div>

      <!-- Illustrative route card (decorative, CSS-animated) -->
      <div class="route-card panel" data-reveal="scale" style="--reveal-delay: 200" aria-hidden="true">
        <div class="route-card__head">
          <span class="route-card__label">Transport request</span>
          <span class="route-card__pill"><span class="route-card__dot"></span>Ready to plan</span>
        </div>
        <div class="route-card__road">
          <span class="route-card__stop"><AppIcon name="pin" :size="18" /></span>
          <span class="route-card__track">
            <span class="route-card__fill"></span>
            <span class="route-card__mover">
              <span class="route-card__truck"><AppIcon name="truck" :size="22" /></span>
            </span>
          </span>
          <span class="route-card__stop route-card__stop--end"><AppIcon name="pin" :size="18" /></span>
        </div>
        <div class="route-card__ends">
          <span><small>Pickup</small>Collected &amp; secured</span>
          <span><small>Destination</small>Delivered with care</span>
        </div>
        <ul class="route-card__meta" role="list">
          <li><AppIcon name="shield" :size="18" />Cargo safety</li>
          <li><AppIcon name="truck" :size="18" />Reliable transport</li>
          <li><AppIcon name="pin" :size="18" />Al Dhafra, Abu Dhabi</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="section contact-main" aria-labelledby="contact-info-title">
    <div class="container contact-main__grid">
      <div class="contact-info">
        <h2 id="contact-info-title" data-reveal style="--reveal-delay: 60">Talk to our team</h2>
        <p class="muted" data-reveal style="--reveal-delay: 120">
          Reach us directly by email or phone, or send your requirement with the form.
        </p>

        <ul class="contact-info__cards" role="list">
          <li v-for="(c, i) in cards" :key="c.label" data-reveal :style="{ '--reveal-delay': 160 + i * 60 }">
            <component
              :is="c.href ? 'a' : 'div'"
              class="info-card"
              :href="c.href"
              :target="c.map ? '_blank' : null"
              :rel="c.map ? 'noopener noreferrer' : null"
            >
              <span class="info-card__icon"><AppIcon :name="c.icon" :size="22" /></span>
              <span class="info-card__body">
                <small>{{ c.label }}</small>
                <address v-if="c.map">{{ c.value }}</address>
                <strong v-else>{{ c.value }}</strong>
                <span v-if="c.sub" class="info-card__sub">{{ c.sub }}</span>
              </span>
              <AppIcon v-if="c.href" name="arrow-up-right" :size="18" class="info-card__arrow" />
              <span v-if="c.map" class="visually-hidden">(opens map in a new tab)</span>
            </component>
          </li>
        </ul>
      </div>

      <div class="contact-main__form" data-reveal="scale">
        <ContactForm />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- Page hero ---------- */
.contact-hero {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: calc(var(--header-h) + clamp(2.5rem, 7vw, 5.5rem)) 0 clamp(3rem, 6vw, 5rem);
  background:
    radial-gradient(55% 80% at 85% 15%, rgba(74, 131, 184, 0.14), transparent 70%),
    linear-gradient(180deg, #e8eef4 0%, var(--bg) 100%);
  border-bottom: 1px solid var(--line);
}

.contact-hero .grid-bg {
  z-index: -1;
}

.contact-hero__lines {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.contact-hero__lines path {
  fill: none;
  stroke: var(--brand);
  stroke-width: 1.4;
  stroke-dasharray: 3 14;
  opacity: 0.35;
  vector-effect: non-scaling-stroke;
}

.contact-hero__lines path:nth-child(2) {
  opacity: 0.2;
}

.contact-hero__grid {
  display: grid;
  gap: clamp(2.5rem, 5vw, 4rem);
  align-items: center;
}

@media (min-width: 1000px) {
  .contact-hero__grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  }
}

.contact-hero__copy {
  display: grid;
  gap: 1.25rem;
  justify-items: start;
  max-width: 44rem;
}

.contact-hero h1 {
  font-size: clamp(2.125rem, 1.3rem + 2.8vw, 3.75rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.035em;
}

.contact-hero h1 .text-gradient {
  display: inline-block;
  padding-bottom: 0.06em;
}

.contact-hero__quick {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0.5rem 0 0;
}

.contact-hero__quick a {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 44px;
  padding: 0.5rem 1.05rem;
  border-radius: 999px;
  border: 1px solid var(--line-2);
  background: var(--surface);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  word-break: break-word;
  transition:
    border-color 0.25s ease,
    color 0.25s ease;
}

.contact-hero__quick a:hover {
  border-color: var(--brand);
  color: var(--brand-deep);
}

.contact-hero__quick svg {
  flex: none;
  color: var(--brand-strong);
}

/* Route card */
.route-card {
  --cycle: 6s;
  width: 100%;
  max-width: 34rem;
  justify-self: end;
  padding: clamp(1.25rem, 3vw, 2rem);
  border-radius: var(--radius-lg);
}

.route-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.route-card__label,
.route-card__ends small {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.route-card__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 650;
  color: var(--ok);
  background: rgba(21, 122, 82, 0.08);
  border: 1px solid rgba(21, 122, 82, 0.2);
}

.route-card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.route-card__road {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

.route-card__stop {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: var(--brand-strong);
  background: var(--brand-tint);
  border: 1px solid rgba(74, 131, 184, 0.25);
}

.route-card__stop--end {
  color: #fff;
  background: var(--brand-strong);
  border-color: var(--brand-strong);
}

.route-card__track {
  position: relative;
  flex: 1;
  height: 2px;
  background: repeating-linear-gradient(90deg, rgba(15, 27, 42, 0.22) 0 5px, transparent 5px 10px);
}

.route-card__fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--brand-deep), var(--brand));
  transform-origin: left;
  transform: scaleX(1);
}

/* The mover spans the track, so translateX(100%) carries the truck from start to end */
.route-card__mover {
  position: absolute;
  inset: 0 22px;
}

.route-card__truck {
  position: absolute;
  left: 0;
  top: 50%;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  color: #fff;
  background: var(--brand-strong);
  box-shadow: 0 10px 22px -10px rgba(47, 100, 151, 0.8);
  transform: translate(-50%, -50%);
}

@media (prefers-reduced-motion: no-preference) {
  .route-card__mover {
    animation: route-move var(--cycle) var(--ease-in-out) infinite;
  }
  .route-card__fill {
    animation: route-fill var(--cycle) var(--ease-in-out) infinite;
  }
}

@keyframes route-move {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  78% {
    transform: translateX(100%);
    opacity: 1;
  }
  92%,
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes route-fill {
  0% {
    transform: scaleX(0);
  }
  78%,
  92% {
    transform: scaleX(1);
    opacity: 1;
  }
  100% {
    transform: scaleX(1);
    opacity: 0;
  }
}

.route-card__ends {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.1rem;
  font-size: 0.9rem;
  font-weight: 650;
  color: var(--text);
}

.route-card__ends span:last-child {
  text-align: right;
}

.route-card__meta {
  display: grid;
  gap: 0.65rem;
  margin: 1.5rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--line);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-2);
}

.route-card__meta li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.route-card__meta svg {
  color: var(--brand-strong);
}

@media (max-width: 999px) {
  .route-card {
    justify-self: start;
  }
}

/* ---------- Details + form ---------- */
.contact-main__grid {
  display: grid;
  gap: clamp(2.5rem, 5vw, 4.5rem);
  align-items: start;
}

@media (min-width: 1000px) {
  .contact-main__grid {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  }
}

.contact-info {
  display: grid;
  gap: 1rem;
}

.contact-info h2 {
  font-size: clamp(1.5rem, 1.15rem + 1.1vw, 2.25rem);
}

.contact-info__cards {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0 0;
}

@media (min-width: 640px) and (max-width: 999px) {
  .contact-info__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.info-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  height: 100%;
  padding: 1rem 1.15rem;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;
}

a.info-card:hover {
  border-color: rgba(74, 131, 184, 0.5);
  background: var(--brand-tint);
}

.info-card__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  color: var(--brand-strong);
  background: var(--brand-tint);
  border: 1px solid rgba(74, 131, 184, 0.22);
}

.info-card__body {
  min-width: 0;
}

.info-card small {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.info-card strong,
.info-card address {
  display: block;
  margin-top: 0.1rem;
  font-style: normal;
  font-weight: 650;
  line-height: 1.45;
  color: var(--text);
  word-break: break-word;
}

.info-card__sub {
  display: block;
  font-size: 0.85rem;
  color: var(--muted);
}

.info-card__arrow {
  color: var(--muted);
  transition:
    color 0.3s ease,
    transform 0.3s var(--ease-out);
}

a.info-card:hover .info-card__arrow {
  color: var(--brand-strong);
  transform: translate(2px, -2px);
}

.contact-main__form {
  padding: clamp(1.25rem, 3.5vw, 2.75rem);
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
}

@media (max-width: 479px) {
  .info-card {
    grid-template-columns: auto 1fr;
    padding: 0.9rem;
  }
  .info-card__arrow {
    display: none;
  }
  .info-card__icon {
    width: 42px;
    height: 42px;
  }
}
</style>
