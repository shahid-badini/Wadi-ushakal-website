<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  to: { type: String, required: true },
});

// Section links ("/#about") are plain in-page anchors on the home page, and router links from other pages
const route = useRoute();
const inPage = computed(() => props.to.startsWith('/#') && route.path === '/');
</script>

<template>
  <a v-if="inPage" :href="to.slice(1)"><slot /></a>
  <RouterLink v-else :to="to"><slot /></RouterLink>
</template>
