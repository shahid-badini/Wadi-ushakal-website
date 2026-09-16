<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import AppLogo from './ui/AppLogo.vue';
import AppIcon from './ui/AppIcon.vue';
import NavLink from './ui/NavLink.vue';
import { nav, company } from '../data/site';
import { rafThrottle } from '../lib/utils';

const route = useRoute();
const scrolled = ref(false);
const activeHash = ref('');

// Highlighted nav item: the section in view on the home page, or the current page elsewhere
const current = computed(() => (route.path === '/' ? (activeHash.value ? `/${activeHash.value}` : '') : route.path));
const ariaCurrent = (href) => (current.value === href ? (href.startsWith('/#') ? 'true' : 'page') : null);

// Mobile menu: `open` is the logical state, `shown` removes [hidden], `entered` runs the CSS transition.
const open = ref(false);
const shown = ref(false);
const entered = ref(false);
const toggleEl = ref(null);
const panelEl = ref(null);
let hideTimer = 0;

function setOpen(next, restoreFocus = true) {
  if (next === open.value) return;
  open.value = next;
  clearTimeout(hideTimer);

  if (next) {
    shown.value = true;
    document.documentElement.style.overflow = 'hidden';
    nextTick(() =>
      requestAnimationFrame(() => {
        entered.value = true;
        panelEl.value?.querySelector('a')?.focus({ preventScroll: true });
      }),
    );
  } else {
    entered.value = false;
    document.documentElement.style.overflow = '';
    hideTimer = setTimeout(() => (shown.value = false), 500);
    if (restoreFocus) toggleEl.value?.focus({ preventScroll: true });
  }
}

// Section links on the home page: close first, then scroll once the scroll-lock is released
// (the native jump is swallowed while html is overflow:hidden). Links to other pages are routed by <RouterLink>.
function goTo(event, href) {
  const target = route.path === '/' && href.startsWith('/#') ? document.querySelector(href.slice(1)) : null;
  if (!target) return setOpen(false, false);
  event.preventDefault();
  setOpen(false, false);
  requestAnimationFrame(() => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    history.replaceState(history.state, '', href.slice(1));
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

function onKeydown(e) {
  if (!open.value) return;
  if (e.key === 'Escape') return setOpen(false);
  if (e.key !== 'Tab') return;
  // Keep focus inside the menu (toggle button + panel links) while it is open
  const items = [toggleEl.value, ...panelEl.value.querySelectorAll('a[href], button:not([disabled])')];
  const first = items[0];
  const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// Only touch reactive state when the value actually changes (avoids re-rendering on every scroll frame)
const onScroll = rafThrottle(() => {
  const next = window.scrollY > 24;
  if (next !== scrolled.value) scrolled.value = next;
});

// Scroll-spy: highlight the nav link for the home-page section in view (re-armed on every page change)
let spy;
function watchSections() {
  spy?.disconnect();
  activeHash.value = '';
  if (route.path !== '/' || !('IntersectionObserver' in window)) return;
  // Every section is watched, so sections without a nav link (Every Mile, UAE) clear the highlight
  spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => e.isIntersecting && (activeHash.value = e.target.id ? `#${e.target.id}` : '')),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  document.querySelectorAll('main > section').forEach((section) => spy.observe(section));
}
watch(() => route.path, watchSections, { flush: 'post' });

let desktopQuery;
const onDesktop = (e) => e.matches && setOpen(false, false);

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('keydown', onKeydown);
  desktopQuery = window.matchMedia('(min-width: 1100px)');
  desktopQuery.addEventListener('change', onDesktop);
  watchSections();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('keydown', onKeydown);
  desktopQuery?.removeEventListener('change', onDesktop);
  spy?.disconnect();
});
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled || open }">
    <div class="container">
      <!-- One floating box: company name · navigation · Get Started -->
      <div class="site-header__bar">
        <!-- Light that streams along the glass rim (decorative) -->
        <span class="site-header__glow" aria-hidden="true"></span>
        <AppLogo />

        <nav class="site-nav" aria-label="Primary">
          <ul role="list">
            <li v-for="item in nav" :key="item.href">
              <NavLink :to="item.href" :aria-current="ariaCurrent(item.href)">{{ item.label }}</NavLink>
            </li>
          </ul>
        </nav>

        <div class="site-header__actions">
          <RouterLink class="btn btn--primary site-header__cta" to="/contact">
            Get Started
            <AppIcon name="arrow" class="arrow" />
          </RouterLink>
          <button
            ref="toggleEl"
            class="menu-toggle"
            type="button"
            :aria-expanded="open ? 'true' : 'false'"
            aria-controls="mobile-menu"
            :aria-label="open ? 'Close menu' : 'Open menu'"
            @click="setOpen(!open)"
          >
            <span class="menu-toggle__bars" aria-hidden="true">
              <span></span><span></span><span></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Kept outside <header> so it can cover the whole viewport -->
  <div id="mobile-menu" class="mobile-menu" :class="{ 'is-open': entered }" :hidden="!shown">
    <div class="mobile-menu__backdrop" @click="setOpen(false)"></div>
    <div ref="panelEl" class="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Site menu">
      <nav aria-label="Mobile">
        <ul role="list" class="mobile-menu__list">
          <li v-for="(item, i) in nav" :key="item.href" :style="{ '--i': i }">
            <NavLink :to="item.href" :aria-current="ariaCurrent(item.href)" @click="goTo($event, item.href)">
              <span class="mobile-menu__num">0{{ i + 1 }}</span>
              {{ item.label }}
              <AppIcon name="arrow" class="mobile-menu__arrow" :size="20" />
            </NavLink>
          </li>
        </ul>
      </nav>
      <div class="mobile-menu__footer" :style="{ '--i': nav.length }">
        <RouterLink class="btn btn--primary" to="/contact" @click="setOpen(false, false)">
          Get Started
          <AppIcon name="arrow" class="arrow" />
        </RouterLink>
        <div class="mobile-menu__contact">
          <a :href="company.phoneHref"><AppIcon name="phone" :size="18" />{{ company.phoneDisplay }}</a>
          <a :href="`mailto:${company.email}`"><AppIcon name="mail" :size="18" />{{ company.email }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* The fixed strip itself is transparent and lets clicks through; only the floating glass box is interactive.
   The box is small, so its backdrop blur stays cheap even while the page scrolls underneath. */
.site-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  height: var(--header-h);
  display: flex;
  align-items: center;
  pointer-events: none;
}

.site-header > .container {
  pointer-events: none;
}

.site-header__bar {
  position: relative;
  pointer-events: auto;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;
  height: 60px;
  padding: 0 0.45rem 0 0.7rem;
  border-radius: 999px;
  /* Frosted glass with a faint brand tint */
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.62) 0%, rgba(234, 241, 248, 0.5) 100%);
  -webkit-backdrop-filter: blur(16px) saturate(170%);
  backdrop-filter: blur(16px) saturate(170%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 14px 34px -20px rgba(15, 27, 42, 0.45);
  transition: box-shadow 0.35s ease;
}

/* Gradient rim (brand blue → sky → indigo) */
.site-header__bar::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(120deg, rgba(74, 131, 184, 0.7), rgba(56, 189, 248, 0.5) 50%, rgba(129, 140, 248, 0.65));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* A streak of light that travels along the rim: transform-only animation inside a ring-shaped mask */
.site-header__glow {
  position: absolute;
  inset: 0;
  padding: 1.5px;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.site-header__glow::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 28%;
  background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.95) 40%, rgba(129, 140, 248, 0.95) 60%, transparent);
  transform: translateX(-110%);
  animation: header-stream 7s linear infinite;
}

@keyframes header-stream {
  to {
    transform: translateX(480%);
  }
}

/* Once the page scrolls, the glass gets a little more opaque so the menu stays readable over photos */
.site-header.is-scrolled .site-header__bar {
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 245, 251, 0.72) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 18px 40px -18px rgba(15, 27, 42, 0.5);
}

/* Browsers without backdrop blur get a solid box */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .site-header__bar,
  .site-header.is-scrolled .site-header__bar {
    background: rgba(255, 255, 255, 0.96);
  }
}

.site-header__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.site-nav {
  display: none;
}

.site-nav ul {
  display: flex;
  align-items: center;
  gap: 0.15rem;
  margin: 0;
}

.site-nav a {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-2);
  white-space: nowrap;
  transition:
    color 0.25s ease,
    background-color 0.25s ease;
}

.site-nav a:hover {
  color: var(--brand-deep);
  background: var(--brand-tint);
}



.site-nav a[aria-current] {
  color: var(--on-brand);
  background: linear-gradient(135deg, var(--brand-strong), #3a8fcb);
  box-shadow: 0 6px 16px -8px rgba(47, 100, 151, 0.8);
}

.site-header__cta {
  display: none;
  min-height: 46px;
  padding-inline: 1.3rem;
  font-size: 0.875rem;
  background: linear-gradient(135deg, var(--brand-strong) 0%, #3a8fcb 100%);
}

.site-header__cta:hover {
  background: linear-gradient(135deg, var(--brand-hover) 0%, #3182bd 100%);
}

/* Hamburger */
.menu-toggle {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--brand-tint);
  color: var(--brand-deep);
  transition: background-color 0.25s ease;
}

.menu-toggle:hover {
  background: #dce8f4;
}

.menu-toggle__bars {
  position: relative;
  display: block;
  width: 20px;
  height: 14px;
}

.menu-toggle__bars span {
  position: absolute;
  left: 0;
  height: 2px;
  width: 100%;
  border-radius: 2px;
  background: currentColor;
  transition:
    transform 0.4s var(--ease-out),
    opacity 0.25s ease;
}

.menu-toggle__bars span:nth-child(1) {
  top: 0;
}
.menu-toggle__bars span:nth-child(2) {
  top: 6px;
  width: 70%;
}
.menu-toggle__bars span:nth-child(3) {
  top: 12px;
}

.menu-toggle[aria-expanded='true'] .menu-toggle__bars span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.menu-toggle[aria-expanded='true'] .menu-toggle__bars span:nth-child(2) {
  opacity: 0;
}
.menu-toggle[aria-expanded='true'] .menu-toggle__bars span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

@media (min-width: 640px) {
  .site-header__cta {
    display: inline-flex;
  }
}

@media (min-width: 1100px) {
  .site-header__bar {
    grid-template-columns: 1fr auto 1fr;
    padding-left: 0.9rem;
  }
  .site-nav {
    display: block;
  }
  .menu-toggle {
    display: none;
  }
}

@media (min-width: 1100px) and (max-width: 1279px) {
  .site-nav a {
    padding-inline: 0.7rem;
  }
}

@media (max-width: 380px) {
  .site-header__bar {
    height: 56px;
    padding-left: 0.55rem;
  }
  .menu-toggle {
    width: 42px;
    height: 42px;
  }
}

/* Mobile menu */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 90;
}

.mobile-menu__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 27, 42, 0.35);
  opacity: 0;
  transition: opacity 0.4s var(--ease-out);
}

.mobile-menu__panel {
  position: absolute;
  inset: 0 0 auto 0;
  max-height: 100dvh;
  overflow-y: auto;
  padding: calc(var(--header-h) + 1rem) var(--gutter) max(2rem, env(safe-area-inset-bottom));
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  transform: translateY(-104%);
  transition: transform 0.5s var(--ease-out);
  box-shadow: var(--shadow-lg);
}

.mobile-menu.is-open .mobile-menu__backdrop {
  opacity: 1;
}

.mobile-menu.is-open .mobile-menu__panel {
  transform: translateY(0);
}

.mobile-menu__list {
  margin: 0;
  display: grid;
}

.mobile-menu__list li,
.mobile-menu__footer {
  opacity: 0;
  transform: translateY(-10px);
  transition:
    opacity 0.4s var(--ease-out),
    transform 0.4s var(--ease-out);
  transition-delay: calc(60ms + var(--i) * 40ms);
}

.mobile-menu.is-open .mobile-menu__list li,
.mobile-menu.is-open .mobile-menu__footer {
  opacity: 1;
  transform: none;
}

.mobile-menu__list a {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 56px;
  padding-block: 0.5rem;
  border-bottom: 1px solid var(--line);
  font-size: clamp(1.15rem, 4.2vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
}

.mobile-menu__list a[aria-current] {
  color: var(--brand-deep);
}

.mobile-menu__num {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--brand-deep);
  letter-spacing: 0.1em;
  min-width: 1.6rem;
}

.mobile-menu__arrow {
  margin-left: auto;
  color: var(--muted);
  transition:
    transform 0.3s var(--ease-out),
    color 0.3s ease;
}

.mobile-menu__list a:hover .mobile-menu__arrow {
  transform: translateX(4px);
  color: var(--brand-strong);
}

.mobile-menu__footer {
  display: grid;
  gap: 1.25rem;
  margin-top: 2rem;
}

.mobile-menu__contact {
  display: grid;
  gap: 0.6rem;
  font-size: 0.95rem;
  color: var(--text-2);
}

.mobile-menu__contact a {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 44px;
  word-break: break-all;
}

.mobile-menu__contact svg {
  color: var(--brand-strong);
  flex: none;
}

@media (min-width: 1100px) {
  .mobile-menu {
    display: none !important;
  }
}
</style>
