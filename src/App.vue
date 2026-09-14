<script setup>
import { onMounted } from 'vue';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';

onMounted(() => {
  window.__wnReady = true; // tells the index.html safety net that the app loaded
});
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <SiteHeader />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter />
</template>
