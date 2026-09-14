<script setup>
import NavLink from './NavLink.vue';
</script>

<template>
  <NavLink class="logo" to="/#home" aria-label="Wadi Nushakal — home">
    <svg class="logo__mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="12" fill="#4A83B8" />
      <!-- Stylised "W" drawn as two converging road lanes -->
      <path
        d="M10 14 L17.5 34 L24 21 L30.5 34 L38 14"
        fill="none"
        stroke="#fff"
        stroke-width="4.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="24" cy="12.5" r="2.6" fill="#fff" />
    </svg>
    <span class="logo__text">
      <span class="logo__name">Wadi Nushakal</span>
      <span class="logo__sub">Transport &amp; Logistics</span>
    </span>
  </NavLink>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 44px;
}

.logo__mark {
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 12px;
  box-shadow: 0 6px 16px -8px rgba(61, 118, 173, 0.8);
  transition: transform 0.4s var(--ease-out);
}

.logo:hover .logo__mark {
  transform: rotate(-6deg) scale(1.04);
}

.logo__text {
  display: grid;
  line-height: 1.05;
}

.logo__name {
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--text);
}

.logo__sub {
  margin-top: 0.3rem;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--muted);
  white-space: nowrap;
}

@media (max-width: 380px) {
  .logo__name {
    font-size: 0.9rem;
  }
  .logo__mark {
    width: 36px;
    height: 36px;
  }
}
</style>
