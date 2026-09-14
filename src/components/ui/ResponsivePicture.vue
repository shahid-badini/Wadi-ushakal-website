<script setup>
// Renders a build-time optimised photo (see src/data/images.js) as <picture> with AVIF + WebP sources.
defineProps({
  image: { type: Object, required: true },
  alt: { type: String, default: '' },
  sizes: { type: String, default: '100vw' },
  loading: { type: String, default: 'lazy' },
  // object-position for cropped photos, e.g. '66% 60%' keeps an off-centre vehicle in view
  position: { type: String, default: null },
});
</script>

<template>
  <picture>
    <source
      v-for="(srcset, format) in image.sources"
      :key="format"
      :type="`image/${format}`"
      :srcset="srcset"
      :sizes="sizes"
    />
    <img
      :src="image.img.src"
      :width="image.img.w"
      :height="image.img.h"
      :alt="alt"
      :loading="loading"
      :style="position ? { objectPosition: position } : null"
      decoding="async"
    />
  </picture>
</template>
