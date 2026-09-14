<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: Number, default: 24 },
});

// Stroke icons drawn on a 24×24 grid. Kept inline so no icon font or sprite request is needed.
const paths = {
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  route:
    '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"/><path d="m8.8 12 2.2 2.2 4.3-4.4"/>',
  handshake:
    '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2.1 2.1 0 0 0-3 0l-.9.9a1.4 1.4 0 1 1-2-2l2.8-2.8a3.9 3.9 0 0 1 5.2-.3l.5.4a2 2 0 0 0 1.4.5H21v7h-2"/><path d="M3 7h3l3.2-1.6a2 2 0 0 1 2.1.2"/><path d="M3 14h2l4 4a1.4 1.4 0 0 0 2-2"/>',
  network:
    '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2V12m0 0-5.4 5.3M12 12l5.4 5.3"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  badge:
    '<circle cx="12" cy="9" r="5.5"/><path d="m9.6 9 1.6 1.6 3.2-3.2"/><path d="M8.5 13.8 7 21l5-2.5 5 2.5-1.5-7.2"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  truck:
    '<path d="M2.5 6.5h11v9h-11z"/><path d="M13.5 9.5h4l3 3.2v2.8h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  phone:
    '<path d="M5 4h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 6.9 6.9l1.3-2 4 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"/>',
  map: '<path d="m9 4.5-5.5 2v13l5.5-2 6 2 5.5-2v-13l-5.5 2-6-2Z"/><path d="M9 4.5v13M15 6.5v13"/>',
  building:
    '<path d="M4.5 20.5v-15l8-2.5v17.5"/><path d="M12.5 8.5l7 2.5v9.5"/><path d="M2.5 20.5h19"/><path d="M7.5 8h2M7.5 11.5h2M7.5 15h2M15.5 13.5h1.5M15.5 17h1.5"/>',
};
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="paths[name]"
  ></svg>
</template>
