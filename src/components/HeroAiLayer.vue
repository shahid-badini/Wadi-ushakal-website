<script setup>
/*
 * Smart-logistics layer drawn over the hero photograph: a glowing route across the scene, GPS-style nodes,
 * a destination marker, data points travelling along the route and a few holographic readouts.
 *
 * It is illustrative, not live tracking data, so the whole layer is aria-hidden.
 * Everything animates with transform / opacity / stroke-dashoffset only, so it stays on the GPU compositor
 * (the hero has to hold 60 fps on an integrated GPU).
 */
/* Coordinates live in a 1600 x 900 viewBox stretched over the photo, which is now full-bleed behind the
   whole hero (aspect 1.5 - 1.78 across desktop widths), so the stretch stays mild and circles read as round.
   Everything is kept inside the band of open sky that no other element uses: x 470-1150, y 120-340 —
   right of the hero copy (the headline ends at x 432 of 900, i.e. 768 of 1600... measured per width below),
   left of the "Shipment" card (starts x 634 of 900 = 1127 of 1600) and above the tagline. */
/* The route runs through the open sky / treeline above the truck and ends at a destination marker ahead of it,
   so it never sits on the vehicle itself: the truck fills x 104-644 of the panel at every width, the HUD cards
   take the space to its right and the hero copy the space to its left, leaving the band above the cargo box
   (its top edge is y 321 at 1920, lower at narrower widths) as the only clear run across the photo.
   The run has to clear the headline, which reaches x 768 (of 1600) at the narrowest desktop width, and stop
   before the "Shipment" card, whose left edge sits at x 1127; the marker's outermost ring is 47 units wide. */
const ROUTE = 'M800 300 C 880 262, 960 205, 1040 168';
const NODES = [
  { x: 800, y: 300, label: 'Pickup' },
  { x: 885, y: 256, label: null },
  { x: 968, y: 203, label: 'In transit' },
];
const PARTICLES = [0, 1, 2, 3];
</script>

<template>
  <div class="ai" aria-hidden="true">
    <svg class="ai__svg" viewBox="0 0 1600 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ai-route" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#4a83b8" stop-opacity="0.25" />
          <stop offset="0.45" stop-color="#38bdf8" stop-opacity="0.95" />
          <stop offset="1" stop-color="#818cf8" stop-opacity="0.9" />
        </linearGradient>
        <radialGradient id="ai-node">
          <stop offset="0" stop-color="#e8f6ff" />
          <stop offset="1" stop-color="#38bdf8" />
        </radialGradient>
      </defs>

      <!-- network mesh behind the route -->
      <g class="ai__mesh">
        <path d="M800 300 L885 256 L968 203 L1040 168" />
        <path d="M800 300 L900 150 L1040 168" />
        <path d="M885 256 L950 310 L1040 168" />
      </g>

      <!-- the route: a dashed track with a bright line drawing along it -->
      <path class="ai__track" :d="ROUTE" />
      <path class="ai__line" :d="ROUTE" pathLength="1" />

      <!-- data points running along the route -->
      <g class="ai__flow">
        <circle v-for="p in PARTICLES" :key="p" class="ai__dot" :style="{ '--i': p }" r="3.4">
          <animateMotion :dur="`${6 + p * 0.4}s`" repeatCount="indefinite" :begin="`${p * 1.5}s`" :path="ROUTE" />
        </circle>
      </g>

      <!-- GPS nodes -->
      <g class="ai__nodes">
        <g v-for="(n, i) in NODES" :key="i" :transform="`translate(${n.x} ${n.y})`" :style="{ '--i': i }">
          <circle class="ai__pulse" r="10" />
          <circle class="ai__node" r="5" fill="url(#ai-node)" />
        </g>
      </g>

      <!-- destination marker -->
      <g class="ai__dest" transform="translate(1040 168)">
        <circle class="ai__dest-ring" r="18" />
        <circle class="ai__dest-ring ai__dest-ring--2" r="18" />
        <path class="ai__pin" d="M0 -20 C 9 -20, 14 -13, 14 -6 C 14 4, 0 16, 0 16 C 0 16, -14 4, -14 -6 C -14 -13, -9 -20, 0 -20 Z" />
        <circle class="ai__pin-dot" cy="-6" r="4.5" />
      </g>
    </svg>

    <!-- holographic readouts, stacked in the gap between the "Shipment" and "Cargo status" cards -->
    <div class="ai__hud">
      <div class="ai__chip ai__chip--scan">
        <span class="ai__scan-dot"></span>
        <span>Cargo tracking active</span>
      </div>
      <div class="ai__chip ai__chip--eta">
        <span class="ai__chip-label">Route optimised</span>
        <strong>Al Dhafra → Destination</strong>
        <span class="ai__readout">
          <span class="ai__distance">412 km</span>
          <span class="ai__bar"><span class="ai__bar-fill"></span></span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.ai__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* ---------- network mesh ---------- */
.ai__mesh path {
  fill: none;
  stroke: rgba(56, 189, 248, 0.35);
  stroke-width: 1;
  stroke-dasharray: 2 9;
  vector-effect: non-scaling-stroke;
}

/* ---------- route ---------- */
.ai__track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.45);
  stroke-width: 2.5;
  stroke-dasharray: 5 11;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.ai__line {
  fill: none;
  stroke: url(#ai-route);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  vector-effect: non-scaling-stroke;
  filter: none;
  animation: ai-draw 7s var(--ease-in-out) infinite;
}

@keyframes ai-draw {
  0% {
    stroke-dashoffset: 1;
  }
  55%,
  100% {
    stroke-dashoffset: 0;
  }
}

/* ---------- data points along the route ---------- */
.ai__dot {
  fill: #eaf7ff;
  opacity: 0;
  animation: ai-spark 6s linear infinite;
  animation-delay: calc(var(--i) * 1.5s);
}

@keyframes ai-spark {
  0%,
  100% {
    opacity: 0;
  }
  8%,
  85% {
    opacity: 1;
  }
}

/* ---------- GPS nodes ---------- */
.ai__node {
  stroke: rgba(255, 255, 255, 0.9);
  stroke-width: 1.5;
}

.ai__pulse {
  fill: rgba(56, 189, 248, 0.35);
  transform-origin: center;
  transform-box: fill-box;
  animation: ai-pulse 2.8s ease-out infinite;
  animation-delay: calc(var(--i) * 0.6s);
}

@keyframes ai-pulse {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  70%,
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

/* ---------- destination ---------- */
.ai__pin {
  fill: rgba(47, 100, 151, 0.9);
  stroke: rgba(232, 246, 255, 0.9);
  stroke-width: 1.5;
}

.ai__pin-dot {
  fill: #eaf7ff;
}

.ai__dest-ring {
  fill: none;
  stroke: rgba(56, 189, 248, 0.7);
  stroke-width: 1.5;
  transform-origin: center;
  transform-box: fill-box;
  animation: ai-ping 3s var(--ease-out) infinite;
}

.ai__dest-ring--2 {
  animation-delay: 1.5s;
}

@keyframes ai-ping {
  0% {
    transform: scale(0.6);
    opacity: 0.9;
  }
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}

/* ---------- holographic readouts ---------- */
.ai__chip {
  /* laid out by .ai__hud, which does the positioning */
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.85rem;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 650;
  color: #eaf7ff;
  background: linear-gradient(140deg, rgba(9, 24, 43, 0.68) 0%, rgba(9, 24, 43, 0.45) 100%);
  border: 1px solid rgba(160, 220, 255, 0.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 14px 30px -18px rgba(4, 16, 32, 0.9);
  opacity: 0;
  animation: ai-chip-in 0.9s var(--ease-out) forwards;
}

/* The readouts sit in the horizontal gap between the two right-hand HUD cards ("Shipment" above,
   "Cargo status" below), so they never collide with either at any desktop width. */
.ai__hud {
  position: absolute;
  top: 38%;
  /* 7.5% lines the readouts up with the right edge of the HUD cards */
  right: 7.5%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.ai__chip--eta {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  animation-delay: 1.2s;
}

.ai__chip--scan {
  animation-delay: 0.9s;
}

.ai__chip-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(180, 226, 255, 0.85);
}

.ai__chip strong {
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
}

/* digital distance + progress inside the route readout */
.ai__readout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.ai__distance {
  font-size: 0.72rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #bfe6ff;
}

.ai__bar {
  position: relative;
  width: 72px;
  height: 3px;
  border-radius: 3px;
  overflow: hidden;
  background: rgba(160, 220, 255, 0.28);
}

.ai__bar-fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #38bdf8, #a5e4ff);
  transform-origin: left;
  transform: scaleX(0.42);
  animation: ai-bar 7s var(--ease-in-out) infinite;
}

@keyframes ai-bar {
  0% {
    transform: scaleX(0.06);
  }
  55%,
  100% {
    transform: scaleX(1);
  }
}

@keyframes ai-chip-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.ai__scan-dot {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6ee7b0;
}

.ai__scan-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: currentColor;
  background: #6ee7b0;
  animation: ai-dot 2s ease-out infinite;
}

@keyframes ai-dot {
  from {
    transform: scale(1);
    opacity: 0.7;
  }
  to {
    transform: scale(3);
    opacity: 0;
  }
}

/* Tablets and phones: the panel is short and wide-cropped, so the route would stretch across the photo as a
   bare diagonal — the whole layer is dropped there and the photograph is left clean. */
@media (max-width: 1099px) {
  .ai {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ai__line {
    stroke-dashoffset: 0;
    animation: none;
  }
  .ai__dot,
  .ai__pulse,
  .ai__dest-ring,
  .ai__bar-fill,
  .ai__scan-dot::after {
    animation: none;
  }
  .ai__dot {
    opacity: 1;
  }
  .ai__chip {
    opacity: 1;
    animation: none;
  }
}
</style>
