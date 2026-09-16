<script setup>
import AppIcon from './ui/AppIcon.vue';
import ResponsivePicture from './ui/ResponsivePicture.vue';
import { aboutFocus, company } from '../data/site';
import { photo } from '../data/images';

const mainImage = photo('about-desert-road');
const insetImage = photo('about-tanker-mountain');
</script>

<template>
  <section id="about" class="section about" aria-labelledby="about-title">
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="container about__grid">
      <div class="about__media" data-reveal="fade">
        <figure class="about__main" data-reveal-img>
          <ResponsivePicture
            :image="mainImage"
            sizes="(min-width: 1100px) 44vw, (min-width: 700px) 80vw, 100vw"
            alt="Sheikh Zayed Road and the Dubai skyline"
          />
        </figure>
        <figure class="about__inset" data-reveal-img>
          <ResponsivePicture :image="insetImage" sizes="(min-width: 1100px) 20vw, 40vw" alt="Tipper truck unloading sand at a site in Dubai" />
        </figure>
        <div class="about__badge panel">
          <span class="about__badge-icon"><AppIcon name="pin" :size="20" /></span>
          <span>
            <small>Operating from</small>
            <strong>Al Dhafra, Abu Dhabi</strong>
          </span>
        </div>
      </div>

      <div class="about__content">
        <h2 id="about-title" data-reveal style="--reveal-delay: 80">
          Moving cargo with <span class="text-gradient">care, precision</span> and trust.
        </h2>
        <p class="lead" data-reveal style="--reveal-delay: 160">
          Wadi Nushakal is a UAE-based transport and logistics company committed to moving cargo safely, efficiently,
          and reliably across every mile.
        </p>
        <p class="muted" data-reveal style="--reveal-delay: 220">
          From our base in Beda Zayed, Al Dhafra, we focus on what matters most to our customers: dependable
          transportation, careful handling of every load, and professional service that keeps logistics seamless from
          pickup to delivery.
        </p>

        <ul class="about__focus" role="list">
          <li v-for="(item, i) in aboutFocus" :key="item.label" data-reveal :style="{ '--reveal-delay': 260 + i * 60 }">
            <span class="about__focus-icon"><AppIcon :name="item.icon" :size="20" /></span>
            {{ item.label }}
          </li>
        </ul>

        <blockquote class="about__quote" data-reveal>
          <p>“{{ company.brand.supporting }}”</p>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  overflow: hidden;
}

.about__grid {
  position: relative;
  display: grid;
  gap: clamp(3rem, 6vw, 5.5rem);
  align-items: center;
}

@media (min-width: 1100px) {
  .about__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

/* Media collage */
.about__media {
  position: relative;
  padding: 0 12% 14% 0;
}

.about__main,
.about__inset {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--bg-3);
}

.about__main {
  aspect-ratio: 4 / 4.4;
  box-shadow: var(--shadow);
}

.about__main :deep(img),
.about__inset :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about__inset {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 48%;
  aspect-ratio: 1 / 1.05;
  border: 6px solid var(--bg);
  box-shadow: var(--shadow-lg);
}

.about__badge {
  position: absolute;
  left: 6%;
  bottom: 5%;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 1.2rem 0.85rem 0.85rem;
  border-radius: var(--radius);
}

.about__badge small {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
}

.about__badge strong {
  font-size: 0.95rem;
  font-weight: 650;
  color: var(--text);
}

.about__badge-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--brand-strong);
  color: var(--on-brand);
}

/* Content */
.about__content {
  display: grid;
  gap: 1.4rem;
}

.about__content h2 {
  margin-top: 0.25rem;
}

.about__focus {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.75rem;
  margin: 0.75rem 0 0;
}

.about__focus li {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text);
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;
}

.about__focus li:hover {
  border-color: rgba(74, 131, 184, 0.45);
  background: var(--brand-tint);
}

.about__focus-icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: var(--brand-strong);
  background: var(--brand-tint);
}

.about__quote {
  margin-top: 0.75rem;
  padding-left: 1.25rem;
  border-left: 3px solid var(--brand);
  font-size: clamp(1rem, 0.96rem + 0.2vw, 1.12rem);
  font-weight: 650;
  color: var(--text);
}

@media (max-width: 1099px) {
  .about__media {
    max-width: 720px;
    width: 100%;
  }
  .about__main {
    aspect-ratio: 4 / 3.6;
  }
}

@media (max-width: 479px) {
  .about__media {
    padding: 0 8% 20% 0;
  }
  .about__badge {
    left: 4%;
    bottom: 2%;
    padding: 0.65rem 0.9rem 0.65rem 0.65rem;
  }
  .about__badge-icon {
    width: 34px;
    height: 34px;
  }
  .about__badge strong {
    font-size: 0.85rem;
  }
  .about__inset {
    border-width: 4px;
  }
}
</style>
