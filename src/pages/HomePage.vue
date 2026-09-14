<script setup>
import { onMounted } from 'vue';
import HeroSection from '../components/HeroSection.vue';
import AboutSection from '../components/AboutSection.vue';
import ServicesSection from '../components/ServicesSection.vue';
import FleetSection from '../components/FleetSection.vue';
import WhyUsSection from '../components/WhyUsSection.vue';
import EveryMileSection from '../components/EveryMileSection.vue';
import UaeMapSection from '../components/UaeMapSection.vue';
import { initReveal } from '../lib/reveal';
import { initSpotlight } from '../lib/spotlight';
import { usePageHead } from '../lib/head';

usePageHead({
  path: '/',
  title: 'Wadi Nushakal | UAE Transport & Logistics',
  description:
    'Wadi Nushakal provides professional transport and logistics solutions in the UAE, delivering cargo with reliability, safety and commitment.',
});

// Page-wide effects that scan the rendered DOM (the sections are mounted before this runs)
onMounted(() => {
  initReveal();
  initSpotlight();
});
</script>

<template>
  <HeroSection />
  <AboutSection />
  <ServicesSection />
  <FleetSection />
  <WhyUsSection />
  <EveryMileSection />
  <UaeMapSection />
</template>
