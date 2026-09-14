<script setup>
import AppIcon from './ui/AppIcon.vue';
import ResponsivePicture from './ui/ResponsivePicture.vue';
import { services } from '../data/site';
import { photo } from '../data/images';

const cards = services.map((s, i) => ({ ...s, num: String(i + 1).padStart(2, '0'), picture: photo(s.image) }));
</script>

<template>
  <section id="services" class="section services" aria-labelledby="services-title">
    <div class="container">
      <div class="section-head section-head--split">
        <div>
          <p class="eyebrow" data-reveal>Our Services</p>
          <h2 id="services-title" data-reveal style="--reveal-delay: 80">
            Transport solutions,<br /><span class="text-gradient">handled with commitment.</span>
          </h2>
        </div>
        <p class="lead" data-reveal style="--reveal-delay: 160">
          Explore our transport service categories. Every job is planned around one principle — your cargo arrives
          safely.
        </p>
      </div>

      <ul class="services__grid" role="list">
        <li
          v-for="(card, i) in cards"
          :key="card.id"
          class="service-card"
          data-reveal
          :style="{ '--reveal-delay': (i % 3) * 90 }"
        >
          <article>
            <div class="service-card__media">
              <ResponsivePicture
                :image="card.picture"
                sizes="(min-width: 1100px) 30vw, (min-width: 700px) 46vw, 100vw"
                :alt="card.alt"
              />
            </div>
            <div class="service-card__body">
              <span class="service-card__num">{{ card.num }}</span>
              <h3>{{ card.title }}</h3>
              <p>{{ card.text }}</p>
              <RouterLink
                class="service-card__link"
                :to="`/contact?service=${card.id}`"
                :aria-label="`Enquire about ${card.title}`"
              >
                <span>Enquire</span>
                <span class="service-card__arrow"><AppIcon name="arrow-up-right" :size="20" /></span>
              </RouterLink>
            </div>
          </article>
        </li>
      </ul>

      <p class="services__note" data-reveal>
        Service categories are shown for general guidance. Contact us to discuss the specific requirements of your
        cargo.
      </p>
    </div>
  </section>
</template>

<style scoped>
.services {
  background: var(--bg-2);
  border-block: 1px solid var(--line);
}

.services__grid {
  display: grid;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin: 0;
}

@media (min-width: 700px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .services__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.service-card article {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition:
    border-color 0.35s ease,
    transform 0.35s var(--ease-out),
    box-shadow 0.35s ease;
}

/* Photo on top, copy below — the vehicle is never hidden behind text */
.service-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-3);
}

.service-card__media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease-out);
}

.service-card__body {
  position: relative;
  display: grid;
  gap: 0.6rem;
  flex: 1;
  align-content: start;
  padding: clamp(1.3rem, 2.2vw, 1.75rem);
}

.service-card__num {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--brand-deep);
}

.service-card h3 {
  font-size: clamp(1.25rem, 1.1rem + 0.5vw, 1.55rem);
  max-width: 18ch;
}

.service-card p {
  color: var(--text-2);
  font-size: 0.97rem;
  max-width: 40ch;
}

.service-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  margin-top: 0.4rem;
  width: fit-content;
  min-height: 44px;
  font-weight: 650;
  font-size: 0.92rem;
  color: var(--brand-deep);
}

/* Stretch the link hit-area over the whole card */
.service-card__link::after {
  content: '';
  position: absolute;
  inset: -100vh 0 0 0;
}

.service-card__arrow {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--brand-tint);
  color: var(--brand-strong);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.service-card__arrow svg {
  transition: transform 0.4s var(--ease-out);
}

/* Hover interactions — only on devices with a fine pointer */
@media (hover: hover) and (pointer: fine) {
  .service-card article:hover {
    transform: translateY(-4px);
    border-color: rgba(74, 131, 184, 0.45);
    box-shadow: var(--shadow-lg);
  }
  .service-card article:hover .service-card__media :deep(img) {
    transform: scale(1.06);
  }
  .service-card article:hover .service-card__arrow {
    background: var(--brand-strong);
    color: var(--on-brand);
  }
  .service-card article:hover .service-card__arrow svg {
    transform: rotate(45deg);
  }
}

.service-card article:focus-within {
  border-color: var(--brand);
}

.service-card__link:focus-visible {
  outline: none;
}

.service-card__link:focus-visible .service-card__arrow {
  outline: 2px solid var(--brand-strong);
  outline-offset: 3px;
}

.services__note {
  margin-top: 2rem;
  font-size: 0.875rem;
  color: var(--muted);
}
</style>
