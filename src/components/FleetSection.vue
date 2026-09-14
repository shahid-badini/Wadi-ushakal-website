<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import AppIcon from './ui/AppIcon.vue';
import ResponsivePicture from './ui/ResponsivePicture.vue';
import { fleet } from '../data/site';
import { photo } from '../data/images';
import { prefersReducedMotion } from '../lib/utils';

const cards = fleet.map((f, i) => ({ ...f, num: String(i + 1).padStart(2, '0'), picture: photo(f.image) }));

// Desktop accordion: one card is expanded at a time (hover on mouse devices, click / Enter everywhere)
const active = ref(0);
const finePointer = ref(false);
const ctas = [];

function activate(i, focusCta = false) {
  if (active.value !== i) active.value = i;
  if (focusCta) nextTick(() => ctas[i]?.focus({ preventScroll: true }));
}

// The cards have a reactive :class, and Vue rewrites className on every update — which would drop an
// `is-visible` class added directly to the DOM by lib/reveal.js. So the reveal state lives in Vue here.
const revealed = ref(false);
const listEl = ref(null);
let io;

onMounted(() => {
  finePointer.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealed.value = true;
    return;
  }
  io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      revealed.value = true;
      io.disconnect();
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  io.observe(listEl.value);
});

onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <section id="fleet" class="section fleet" aria-labelledby="fleet-title">
    <div class="container">
      <div class="section-head section-head--split">
        <div>
          <p class="eyebrow" data-reveal>Our Fleet</p>
          <h2 id="fleet-title" data-reveal style="--reveal-delay: 80">
            Built to Move <span class="text-gradient">What Matters.</span>
          </h2>
        </div>
        <p class="lead" data-reveal style="--reveal-delay: 160">
          A range of transport vehicles prepared for the road, so the right vehicle is matched to the right load.
        </p>
      </div>

      <ul ref="listEl" class="fleet__list" role="list">
        <li
          v-for="(card, i) in cards"
          :key="card.id"
          class="fleet-card"
          :class="{ 'is-active': active === i, 'is-visible': revealed }"
          data-reveal
          :style="{ '--reveal-delay': i * 90 }"
          @mouseenter="finePointer && activate(i)"
        >
          <button
            class="fleet-card__trigger"
            type="button"
            :aria-expanded="active === i ? 'true' : 'false'"
            :aria-controls="`fleet-${card.id}`"
            @click="activate(i, true)"
          >
            <span class="visually-hidden">Show details for {{ card.title }}</span>
          </button>
          <div class="fleet-card__media" data-reveal-img>
            <ResponsivePicture
              :image="card.picture"
              sizes="(min-width: 1100px) 50vw, (min-width: 700px) 50vw, 100vw"
              :alt="card.alt"
              :position="card.focus"
            />
          </div>
          <div class="fleet-card__body">
            <span class="fleet-card__index">{{ card.num }}</span>
            <h3 class="fleet-card__title">{{ card.title }}</h3>
            <div :id="`fleet-${card.id}`" class="fleet-card__detail">
              <div class="fleet-card__detail-inner">
                <p>{{ card.text }}</p>
                <RouterLink :ref="(el) => (ctas[i] = el?.$el ?? el)" class="fleet-card__cta" to="/contact">
                  Request transport
                  <AppIcon name="arrow" :size="18" class="arrow" />
                </RouterLink>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <p class="fleet__note" data-reveal>Images are representative of the vehicle categories.</p>
    </div>
  </section>
</template>

<style scoped>
.fleet {
  overflow: hidden;
}

/* ---------- Mobile / tablet (default): photo on top, copy in a white card below ---------- */
.fleet__list {
  display: grid;
  gap: 1rem;
  margin: 0;
}

@media (min-width: 700px) and (max-width: 1099px) {
  .fleet__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.fleet-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  isolation: isolate;
}

.fleet-card__trigger {
  display: none;
}

.fleet-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-3);
}

.fleet-card__media :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fleet-card__body {
  position: relative;
  width: 100%;
  padding: clamp(1.2rem, 2.5vw, 1.75rem);
}

.fleet-card__index {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--brand-deep);
  margin-bottom: 0.4rem;
}

.fleet-card__title {
  font-size: clamp(1.3rem, 1.15rem + 0.5vw, 1.65rem);
}

.fleet-card__detail p {
  margin-top: 0.5rem;
  color: var(--text-2);
  max-width: 38ch;
}

.fleet-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  margin-top: 0.5rem;
  font-weight: 650;
  font-size: 0.92rem;
  color: var(--brand-deep);
}

.fleet-card__cta .arrow {
  transition: transform 0.3s var(--ease-out);
}

.fleet-card__cta:hover .arrow {
  transform: translateX(4px);
}

.fleet__note {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--muted);
}

/* ---------- Desktop: expanding horizontal accordion, copy over the photo ---------- */
@media (min-width: 1100px) {
  .fleet__list {
    display: flex;
    gap: 1rem;
    height: clamp(460px, 42vw, 600px);
    contain: layout;
  }

  .fleet-card {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    background: var(--bg-3);
    transition:
      flex-grow 0.6s var(--ease-out),
      border-color 0.4s ease;
  }

  .fleet-card.is-active {
    flex-grow: 2.8;
    border-color: rgba(74, 131, 184, 0.5);
  }

  .fleet-card__trigger {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: inherit;
  }

  .fleet-card.is-active .fleet-card__trigger {
    pointer-events: none;
  }

  .fleet-card__media {
    position: absolute;
    inset: 0;
    aspect-ratio: auto;
    z-index: -1;
  }

  /* Photo scrim so the white copy stays readable */
  .fleet-card__media::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15, 27, 42, 0) 35%, rgba(15, 27, 42, 0.82) 100%);
  }

  .fleet-card:not(.is-active) .fleet-card__media::after {
    background: linear-gradient(180deg, rgba(15, 27, 42, 0.15) 0%, rgba(15, 27, 42, 0.8) 100%);
  }

  .fleet-card__media :deep(img) {
    transform: scale(1.04);
    transition: transform 1s var(--ease-out);
  }

  .fleet-card.is-active .fleet-card__media :deep(img) {
    transform: scale(1);
  }

  .fleet-card__body {
    z-index: 3;
    pointer-events: none;
    padding: clamp(1.4rem, 2.5vw, 2rem);
  }

  .fleet-card__index {
    color: #cfe0f1;
  }

  .fleet-card__title {
    color: #fff;
    white-space: nowrap;
  }

  .fleet-card:not(.is-active) .fleet-card__title {
    font-size: 1.2rem;
    white-space: normal;
  }

  .fleet-card__detail {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
      grid-template-rows 0.5s var(--ease-out),
      opacity 0.4s ease;
  }

  .fleet-card__detail-inner {
    min-height: 0;
    overflow: hidden;
    max-width: 40ch;
  }

  .fleet-card__detail p {
    color: rgba(255, 255, 255, 0.88);
  }

  .fleet-card__cta {
    color: #fff;
  }

  .fleet-card.is-active .fleet-card__detail {
    grid-template-rows: 1fr;
    opacity: 1;
    transition-delay: 0.15s;
    pointer-events: auto;
  }
}
</style>
