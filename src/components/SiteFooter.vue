<script setup>
import AppLogo from './ui/AppLogo.vue';
import AppIcon from './ui/AppIcon.vue';
import NavLink from './ui/NavLink.vue';
import { nav, company } from '../data/site';

const contacts = [
  { icon: 'mail', label: 'Email', value: company.email, href: `mailto:${company.email}` },
  { icon: 'phone', label: 'Phone', value: company.phoneDisplay, href: company.phoneHref },
  { icon: 'pin', label: 'Address', value: company.address.full },
];
</script>

<template>
  <footer class="site-footer">
    <!-- Brand gradient (#F5F5F5 → #4A83B8) with soft drifting light orbs and a dot grid behind a glass box -->
    <div class="site-footer__orbs" aria-hidden="true">
      <span class="site-footer__orb site-footer__orb--1"></span>
      <span class="site-footer__orb site-footer__orb--2"></span>
    </div>
    <div class="site-footer__dots" aria-hidden="true"></div>

    <div class="container">
      <div class="site-footer__box">
        <div class="site-footer__top">
          <div class="site-footer__brand">
            <AppLogo />
            <p class="site-footer__slogan">{{ company.brand.main }}</p>
            <p class="site-footer__tagline">{{ company.brand.tagline }}</p>
            <p class="site-footer__status"><span class="site-footer__pulse"></span>Based in Al Dhafra, Abu Dhabi</p>
          </div>

          <nav class="site-footer__col" aria-label="Footer">
            <h2 class="site-footer__title">Navigation</h2>
            <ul role="list" class="site-footer__links">
              <li v-for="item in nav" :key="item.href">
                <NavLink :to="item.href">
                  <AppIcon name="arrow" :size="14" class="site-footer__link-arrow" />
                  {{ item.label }}
                </NavLink>
              </li>
            </ul>
          </nav>

          <div class="site-footer__col">
            <h2 class="site-footer__title">Contact</h2>
            <ul role="list" class="site-footer__contact">
              <li v-for="c in contacts" :key="c.label">
                <span class="site-footer__icon"><AppIcon :name="c.icon" :size="18" /></span>
                <span>
                  <small>{{ c.label }}</small>
                  <a v-if="c.href" :href="c.href">{{ c.value }}</a>
                  <address v-else>{{ c.value }}</address>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div class="site-footer__bottom">
          <p>&copy; {{ company.name }}. All Rights Reserved.</p>
          <a class="site-footer__top-link" href="#main">
            Back to top
            <AppIcon name="arrow-up-right" :size="16" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding-block: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 3vw, 2.5rem);
  background: linear-gradient(180deg, #f5f5f5 0%, #4a83b8 100%);
  border-top: 1px solid var(--line);
}

/* Soft light orbs (plain radial gradients, transform-only drift) */
.site-footer__orbs {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
}

.site-footer__orb {
  position: absolute;
  width: min(50vw, 680px);
  aspect-ratio: 1;
  border-radius: 50%;
  animation: footer-drift 20s ease-in-out infinite alternate;
}

.site-footer__orb--1 {
  left: -12%;
  bottom: -40%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(56, 189, 248, 0) 66%);
}

.site-footer__orb--2 {
  right: -10%;
  top: -30%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 66%);
  animation-duration: 26s;
  animation-direction: alternate-reverse;
}

@keyframes footer-drift {
  to {
    transform: translate3d(8%, -6%, 0) scale(1.1);
  }
}

.site-footer__dots {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(rgba(15, 27, 42, 0.14) 1px, transparent 1.5px);
  background-size: 22px 22px;
  mask-image: linear-gradient(180deg, transparent 0%, #000 60%);
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 60%);
}

/* The glass box */
.site-footer__box {
  position: relative;
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 4vw, 3rem) 0;
  border-radius: var(--radius-lg);
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.86) 0%, rgba(255, 255, 255, 0.6) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 30px 60px -30px rgba(15, 27, 42, 0.5);
}

/* Gradient rim */
.site-footer__box::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(56, 189, 248, 0.45) 45%, rgba(74, 131, 184, 0.7));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.site-footer__top {
  display: grid;
  gap: 2.5rem;
  padding-bottom: clamp(2rem, 4vw, 3rem);
}

@media (min-width: 720px) {
  .site-footer__top {
    grid-template-columns: 1fr 1fr;
  }
  .site-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1024px) {
  .site-footer__top {
    grid-template-columns: 1.4fr 0.8fr 1.3fr;
  }
  .site-footer__brand {
    grid-column: auto;
  }
}

.site-footer__slogan {
  margin-top: 1.4rem;
  font-size: clamp(1.25rem, 1.05rem + 0.7vw, 1.6rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--text);
}

.site-footer__tagline {
  margin-top: 0.5rem;
  color: var(--text-2);
}

/* "Live" status chip with a pulse (transform/opacity only) */
.site-footer__status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 1.25rem;
  padding: 0.4rem 0.9rem 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 650;
  color: var(--ok);
  background: rgba(21, 122, 82, 0.08);
  border: 1px solid rgba(21, 122, 82, 0.2);
}

.site-footer__pulse {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.site-footer__pulse::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: currentColor;
  animation: footer-pulse 2s ease-out infinite;
}

@keyframes footer-pulse {
  from {
    transform: scale(1);
    opacity: 0.6;
  }
  to {
    transform: scale(3);
    opacity: 0;
  }
}

.site-footer__title {
  margin-bottom: 1rem;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-deep);
  font-weight: 800;
}

.site-footer__links {
  display: grid;
  gap: 0.1rem;
  margin: 0;
}

.site-footer__links a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 40px;
  font-weight: 550;
  color: var(--text-2);
  transition: color 0.25s ease;
}

/* The arrow sits just left of the text (outside the column edge), so link text lines up with the heading */
.site-footer__link-arrow {
  margin-left: -1.375rem;
  color: var(--brand);
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 0.25s ease,
    transform 0.3s var(--ease-out);
}

.site-footer__links a:hover {
  color: var(--brand-deep);
}

.site-footer__links a:hover .site-footer__link-arrow {
  opacity: 1;
  transform: none;
}

.site-footer__contact {
  display: grid;
  gap: 0.9rem;
  margin: 0;
}

.site-footer__contact li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.8rem;
  align-items: start;
}

/* Gradient icon tiles (same style as the Why Us cards) */
.site-footer__icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, var(--brand-strong) 0%, #3a9ad6 55%, #6f7cf0 100%);
  box-shadow: 0 10px 20px -12px rgba(47, 100, 151, 0.85);
}

.site-footer__contact small {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-2);
}

.site-footer__contact a,
.site-footer__contact address {
  display: block;
  margin-top: 0.1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text);
  word-break: break-word;
}

.site-footer__contact a:hover {
  color: var(--brand-deep);
}

/* Bottom row inside the box, under a gradient divider */
.site-footer__bottom {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  padding-block: 1.25rem max(1.25rem, env(safe-area-inset-bottom));
  font-size: 0.85rem;
  color: var(--text-2);
}

.site-footer__bottom::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 131, 184, 0.5), rgba(56, 189, 248, 0.5), transparent);
}

.site-footer__top-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 40px;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  font-weight: 650;
  color: var(--brand-deep);
  background: var(--brand-tint);
  transition: background-color 0.25s ease;
}

.site-footer__top-link:hover {
  background: #dce8f4;
}

@media (max-width: 719px) {
  .site-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
