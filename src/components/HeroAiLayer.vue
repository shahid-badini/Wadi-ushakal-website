<script setup>
/*
 * Smart-logistics layer over the hero scene: a glowing route from Abu Dhabi to the destination, GPS pins,
 * a vehicle indicator travelling the route, data points and a floating status panel.
 *
 * It is a design element, not live tracking data, so the drawing is aria-hidden and the panel is labelled
 * as illustrative. Everything animates with transform / opacity / stroke-dashoffset only, so it stays on
 * the GPU compositor — the hero has to hold 60 fps on an integrated GPU.
 *
 * Coordinates are a 1600 x 900 map of the hero, stretched over it. The route lives in the open sky above
 * the truck, to the right of the copy (which ends around x 760) and left of the panel (which starts at
 * about x 1280).
 */
const ROUTE = 'M880 258 C 960 205, 1030 172, 1100 158 S 1160 156, 1180 146';
const NODES = [
  { x: 880, y: 258 },
  { x: 1100, y: 158 },
];
const PARTICLES = [0, 1, 2];
</script>

<template>
  <div class="ai" aria-hidden="true">
    <svg class="ai__svg" viewBox="0 0 1600 900" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ai-route" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stop-color="#b56a10" stop-opacity="0.3" />
          <stop offset="0.45" stop-color="#e08a1a" stop-opacity="0.95" />
          <stop offset="1" stop-color="#f0a02a" stop-opacity="0.95" />
        </linearGradient>
        <radialGradient id="ai-node">
          <stop offset="0" stop-color="#ffe7b8" />
          <stop offset="1" stop-color="#c8781a" />
        </radialGradient>
      </defs>

      <!-- faint digital map behind the route -->
      <g class="ai__mesh">
        <path d="M880 258 L1010 205 L1100 158 L1180 146" />
        <path d="M880 258 L1000 130 L1180 146" />
        <path d="M1100 158 L1140 220 L1180 146" />
      </g>

      <!-- the route: a dashed track with a bright line drawing along it -->
      <path class="ai__track" :d="ROUTE" />
      <path class="ai__line" :d="ROUTE" pathLength="1" />

      <!-- data points travelling the route -->
      <g class="ai__flow">
        <circle v-for="p in PARTICLES" :key="p" class="ai__dot" :style="{ '--i': p }" r="4">
          <animateMotion :dur="`${7 + p * 0.6}s`" repeatCount="indefinite" :begin="`${p * 2.2}s`" :path="ROUTE" />
        </circle>
      </g>

      <!-- the vehicle indicator -->
      <g class="ai__vehicle">
        <rect x="-11" y="-7" width="22" height="14" rx="3" />
        <animateMotion dur="11s" repeatCount="indefinite" :path="ROUTE" rotate="auto" />
      </g>

      <!-- GPS pins -->
      <g class="ai__nodes">
        <g v-for="(n, i) in NODES" :key="i" :transform="`translate(${n.x} ${n.y})`" :style="{ '--i': i }">
          <circle class="ai__pulse" r="13" />
          <circle class="ai__node" r="6" fill="url(#ai-node)" />
        </g>
      </g>

      <!-- destination marker -->
      <g class="ai__dest" transform="translate(1180 146)">
        <circle class="ai__dest-ring" r="20" />
        <circle class="ai__dest-ring ai__dest-ring--2" r="20" />
        <path
          class="ai__pin"
          d="M0 -22 C 10 -22, 16 -14, 16 -6 C 16 5, 0 18, 0 18 C 0 18, -16 5, -16 -6 C -16 -14, -10 -22, 0 -22 Z"
        />
        <circle class="ai__pin-dot" cy="-6" r="5" />
      </g>
    </svg>

    <!-- place labels -->
    <span class="ai__place ai__place--from">Abu Dhabi</span>
    <span class="ai__place ai__place--to">Destination</span>

    <!-- status panel: a design element, not live data -->
    <div class="ai__panel">
      <p class="ai__panel-title">Smart Logistics</p>
      <dl class="ai__panel-list">
        <div>
          <dt>Route Status</dt>
          <dd><span class="ai__dotlight ai__dotlight--live"></span>In Transit</dd>
        </div>
        <div>
          <dt>Cargo</dt>
          <dd><span class="ai__dotlight ai__dotlight--live"></span>Secure</dd>
        </div>
        <div>
          <dt>Destination</dt>
          <dd><span class="ai__panel-pin"></span>UAE</dd>
        </div>
      </dl>
      <p class="ai__panel-note">Illustrative</p>
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

/* ---------- digital map ---------- */
.ai__mesh path {
  fill: none;
  stroke: rgba(150, 90, 20, 0.34);
  stroke-width: 1;
  stroke-dasharray: 2 10;
  vector-effect: non-scaling-stroke;
}

/* ---------- route ---------- */
.ai__track {
  fill: none;
  stroke: rgba(90, 70, 40, 0.3);
  stroke-width: 2;
  stroke-dasharray: 5 12;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.ai__line {
  fill: none;
  stroke: url(#ai-route);
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  vector-effect: non-scaling-stroke;
  animation: ai-draw 11s var(--ease-in-out) infinite;
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

/* ---------- data points ---------- */
.ai__dot {
  fill: #8a5410;
  opacity: 0;
  animation: ai-spark 7s linear infinite;
  animation-delay: calc(var(--i) * 2.2s);
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

/* ---------- vehicle indicator ---------- */
.ai__vehicle rect {
  fill: rgba(255, 252, 245, 0.92);
  stroke: #c8781a;
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}

/* ---------- GPS pins ---------- */
.ai__node {
  stroke: rgba(255, 252, 245, 0.95);
  stroke-width: 1.5;
}

.ai__pulse {
  fill: rgba(240, 160, 42, 0.32);
  transform-origin: center;
  transform-box: fill-box;
  animation: ai-pulse 3s ease-out infinite;
  animation-delay: calc(var(--i) * 0.8s);
}

@keyframes ai-pulse {
  0% {
    transform: scale(0.5);
    opacity: 0.85;
  }
  70%,
  100% {
    transform: scale(2.3);
    opacity: 0;
  }
}

/* ---------- destination ---------- */
.ai__pin {
  fill: #c8781a;
  stroke: rgba(255, 252, 245, 0.95);
  stroke-width: 1.5;
}

.ai__pin-dot {
  fill: #8a5410;
}

.ai__dest-ring {
  fill: none;
  stroke: rgba(200, 120, 26, 0.6);
  stroke-width: 1.5;
  transform-origin: center;
  transform-box: fill-box;
  animation: ai-ping 3.4s var(--ease-out) infinite;
}

.ai__dest-ring--2 {
  animation-delay: 1.7s;
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

/* ---------- place labels ---------- */
.ai__place {
  position: absolute;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text);
  text-shadow: 0 1px 10px rgba(255, 255, 255, 0.9);
  opacity: 0;
  animation: ai-in 0.9s var(--ease-out) 0.7s forwards;
}

/* percentages of the same 1600 x 900 map the route is drawn on */
.ai__place--from {
  left: 51.5%;
  top: 24.5%;
  transform: translate(-50%, 0);
}

.ai__place--to {
  left: 73.7%;
  top: 12.5%;
  transform: translate(-50%, 0);
}

@keyframes ai-in {
  from {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
  to {
    opacity: 1;
  }
}

/* ---------- status panel ---------- */
.ai__panel {
  position: absolute;
  top: 29%;
  right: 4.5%;
  width: min(19rem, 32vw);
  padding: 1rem 1.15rem 0.85rem;
  border-radius: 14px;
  border: 1px solid var(--line);
  border-left: 3px solid #c8781a;
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.76) 100%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
  box-shadow: var(--shadow-lg);
  opacity: 0;
  animation: ai-panel-in 0.9s var(--ease-out) 1s forwards;
}

@keyframes ai-panel-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.ai__panel-title {
  margin: 0 0 0.75rem;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text);
}

.ai__panel-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
}

.ai__panel-list > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.ai__panel-list dt {
  font-size: 0.8rem;
  color: var(--muted);
}

.ai__panel-list dd {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text);
}

.ai__dotlight {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ok);
}

.ai__panel-pin {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f0a02a;
}

.ai__panel-note {
  margin: 0.7rem 0 0;
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

/* Phones and small tablets: the sky band is short, so the route and the panel are dropped and the scene is
   left clean — the copy and the truck carry the hero there. */
@media (max-width: 899px) {
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
  .ai__dest-ring {
    animation: none;
  }
  .ai__dot {
    opacity: 1;
  }
  .ai__vehicle animateMotion {
    display: none;
  }
  .ai__place,
  .ai__panel {
    opacity: 1;
    animation: none;
  }
}
</style>
