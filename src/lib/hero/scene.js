import * as THREE from 'three';
import { createTruck } from './truck';
import { createWorld, propClip } from './world';
import { glowTexture, liveryTexture, rimTexture, ribsTexture, roadTexture, sandTexture, shadowTexture } from './textures';

const SPEED = 17; // world units (≈ metres) per second

/** Hands control back to the browser so input and painting aren't blocked during setup. */
const yieldToMain = () => {
  const s = globalThis.scheduler;
  return s?.yield ? s.yield() : new Promise((r) => setTimeout(r, 0));
};

/** Runs one setup phase and records its duration (visible in DevTools → Performance → Timings). */
async function phase(name, fn) {
  const start = performance.now();
  const result = await fn();
  performance.measure(`hero:${name}`, { start, end: performance.now() });
  await yieldToMain();
  return result;
}

/**
 * Hero 3D scene: a Wadi Nushakal truck on a desert highway in clear daylight.
 * The truck stays put while the world streams past it, so the scene is endless and cheap.
 *
 * Smoothness safeguards:
 *  - resolution is capped (1.25×) and lowered further if the device can't keep up;
 *  - while the page is being scrolled the scene renders at half rate, so scrolling gets priority;
 *  - it pauses completely when off-screen or when the tab is hidden;
 *  - on very slow devices it settles on a single still frame instead of stuttering.
 */
export async function mountHeroScene(stage) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  const maxRatio = Math.min(window.devicePixelRatio, 1.25);

  const { renderer, scene, camera } = await phase('renderer', () => {
    const renderer = new THREE.WebGLRenderer({
      antialias: !lite,
      powerPreference: 'high-performance',
      stencil: false,
      alpha: false, // the scene paints the whole hero, sky included
    });
    renderer.setPixelRatio(maxRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // Neutral tone mapping keeps light, brand-accurate colours (ACES would grey them out)
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.02;
    const scene = new THREE.Scene();
    // Daylight haze: the distant desert dissolves into the pale horizon
    scene.fog = new THREE.Fog(new THREE.Color('#cdd9e4'), 120, 560);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 2000);
    return { renderer, scene, camera };
  });
  const anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

  const tex = await phase('textures', () => ({
    glow: glowTexture(),
    road: roadTexture(),
    sand: sandTexture(),
    ribs: ribsTexture(),
    rim: rimTexture(),
    shadow: shadowTexture(),
  }));

  const world = await phase('world', () => {
    const w = createWorld({ road: tex.road, sand: tex.sand, glow: tex.glow, anisotropy, lite });
    // The hero is the 3D scene itself now, so the world is drawn: sky, desert, highway and roadside props.
    // The 3D overlay (route line, floating markers) stays off — the route and the status panel are HTML/SVG
    // in HeroAiLayer.vue, where they stay readable and can be positioned against the copy.
    w.group.visible = true;
    w.overlay.visible = false;
    scene.add(w.group, w.overlay);
    return w;
  });

  const livery = await liveryTexture();
  const truck = await phase('truck', () => {
    livery.anisotropy = anisotropy;
    const t = createTruck({ livery, ribs: tex.ribs, rim: tex.rim, shadow: tex.shadow, glow: tex.glow });
    // The truck is the focal point of the hero: it drives forward, its wheels turn and the cab rides the
    // suspension (see truck.js `update`).
    t.group.visible = true;
    scene.add(t.group);
    return t;
  });

  // Soft reflections from the daylight sky itself (built once)
  await phase('environment', () => {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(world.sky.clone());
    scene.environment = pmrem.fromScene(envScene, 0.04, 0.1, 2000).texture;
    scene.environmentIntensity = 0.85;
    pmrem.dispose();
  });

  // Daylight: a high sun from the camera side, bright sky fill, and a soft cool bounce from behind, so the
  // cab and the trailer keep their edges without going dark.
  scene.add(new THREE.HemisphereLight(0xe8f1fb, 0xd8c6a4, 1.45));
  const sun = new THREE.DirectionalLight(0xfff6e8, 2.5);
  sun.position.set(28, 40, 22);
  const back = new THREE.DirectionalLight(0xd6e6f7, 0.65);
  back.position.set(-22, 14, -28);
  scene.add(sun, back);

  stage.appendChild(renderer.domElement);

  // ---------------------------------------------------------------- Framing per layout
  const basePos = new THREE.Vector3();
  const target = new THREE.Vector3();
  const frame = () => {
    const w = Math.max(1, stage.clientWidth);
    const h = Math.max(1, stage.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const aspect = w / h;
    const sideLayout = w >= 1100 || (h < 520 && aspect > 1.5);
    if (sideLayout) {
      // Truck sits in the right half, beside the headline, low enough to ride the road in the photo behind it.
      // On narrower desktop windows (below 16:10) the horizontal field of view is held constant, so the truck
      // doesn't grow into the headline column.
      const narrowFov = 2 * THREE.MathUtils.radToDeg(Math.atan(0.39 / aspect));
      camera.fov = aspect < 1.6 ? Math.min(narrowFov, 40) : aspect > 2.1 ? 29 : 33;
      basePos.set(13.5, 4.6, 21.5);
      target.set(0.4, 2.0, -3.6);
      camera.setViewOffset(w, h, -w * (aspect < 1.5 ? 0.26 : 0.22), -h * 0.05, w, h);
    } else {
      // Stacked layout: whole truck in the lower part of the hero, below the text and above the ticker
      const phone = aspect < 0.6;
      camera.fov = phone ? 46 : aspect < 0.85 ? 38 : aspect < 1.2 ? 32 : 34;
      basePos.set(17, 6.2, 27);
      target.set(0, 2.0, -2.2);
      // phones: lowest; portrait tablets: mid; landscape tablets: lower again, so the cab clears the copy above it
      const drop = phone ? 0.28 : aspect < 1.2 ? 0.2 : 0.26;
      camera.setViewOffset(w, h, phone ? -w * 0.05 : 0, -h * drop, w, h);
    }
    camera.updateProjectionMatrix();

    // Side-by-side layout: keep moving props out of the copy column (see propClip in world.js)
    const copy = sideLayout && stage.parentElement?.querySelector('.hero__content');
    const edge = copy ? copy.getBoundingClientRect().right - stage.getBoundingClientRect().left + 40 : 0;
    propClip.value = Math.max(0, edge) * renderer.getPixelRatio();
  };
  frame();

  // ---------------------------------------------------------------- Interaction
  const listeners = new AbortController(); // removes the window listeners below when the scene is disposed
  const pointer = new THREE.Vector2();
  const eased = new THREE.Vector2();
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
    window.addEventListener(
      'pointermove',
      (e) => pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1),
      { passive: true, signal: listeners.signal },
    );
  }

  let lastScroll = -1e9;
  window.addEventListener('scroll', () => (lastScroll = performance.now()), { passive: true, signal: listeners.signal });

  const placeCamera = (t) => {
    eased.lerp(pointer, 0.05);
    camera.position.set(
      basePos.x + eased.x * 1.1 + Math.sin(t * 0.13) * 0.6,
      basePos.y - eased.y * 0.45,
      basePos.z + Math.cos(t * 0.11) * 0.5,
    );
    camera.lookAt(target);
  };

  // ---------------------------------------------------------------- Adaptive render loop
  const RATIO_STEPS = [maxRatio, Math.min(maxRatio, 1), 0.8];
  let ratioStep = 0;
  let halfRate = false; // render every other frame (≈30 fps)
  let stillOnly = false; // give up animating on very slow devices

  const timer = new THREE.Timer();
  let t = 4;
  let pendingDt = 0;
  let frameIndex = 0;
  let avgMs = 16.7;
  let lastCheck = 0;
  let warmupUntil = 0;
  let running = false;
  let visible = true;
  let raf = 0;

  const renderStill = () => {
    world.update(0, 0, t);
    truck.update(0, 0, t);
    placeCamera(t);
    renderer.render(scene, camera);
  };

  const degrade = () => {
    if (ratioStep < RATIO_STEPS.length - 1) {
      ratioStep++;
      renderer.setPixelRatio(RATIO_STEPS[ratioStep]);
      frame();
    } else if (!halfRate) {
      halfRate = true;
    } else {
      stillOnly = true;
      stop();
      renderStill();
    }
    avgMs = 16.7;
  };

  const render = (now) => {
    raf = requestAnimationFrame(render);
    timer.update(now);
    const dt = Math.min(timer.getDelta(), 0.1);
    pendingDt += dt;

    const scrolling = now - lastScroll < 160;

    // Measure smoothness only while the user isn't scrolling (scrolling stalls aren't the scene's fault)
    if (!scrolling && now > warmupUntil) {
      avgMs = avgMs * 0.92 + dt * 1000 * 0.08;
      if (now - lastCheck > 1500) {
        lastCheck = now;
        if (avgMs > 22) degrade(); // below ~45 fps
      }
    }

    // Half-rate while scrolling (or on slower devices) so the page itself stays smooth
    if ((scrolling || halfRate) && frameIndex++ % 2 === 1) return;

    const step = Math.min(pendingDt, 0.1);
    pendingDt = 0;
    t += step;
    world.update(step, SPEED, t);
    truck.update(step, SPEED, t);
    placeCamera(t);
    renderer.render(scene, camera);
  };

  function start() {
    if (running || reducedMotion || stillOnly) return;
    running = true;
    timer.reset();
    pendingDt = 0;
    warmupUntil = performance.now() + 1200;
    lastCheck = warmupUntil;
    raf = requestAnimationFrame(render);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }
  const sync = () => (visible && !document.hidden ? start() : stop());

  // Pre-compile shaders so the first animated frame doesn't hitch.
  // Where the driver supports it, compilation happens off the main thread.
  await phase('compile', async () => {
    if (renderer.extensions.has('KHR_parallel_shader_compile')) await renderer.compileAsync(scene, camera);
    else renderer.compile(scene, camera);
  });
  await phase('first-frame', renderStill);

  const ro = new ResizeObserver(() => {
    frame();
    if (!running) renderStill();
  });
  ro.observe(stage);

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    sync();
  });
  io.observe(stage);
  document.addEventListener('visibilitychange', sync);

  stage.classList.add('is-ready');
  sync();

  // Called when the hero unmounts (navigating to another page): stop, unhook and free the GPU context
  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    document.removeEventListener('visibilitychange', sync);
    listeners.abort();
    scene.traverse((o) => {
      o.geometry?.dispose();
      [].concat(o.material ?? []).forEach((m) => m.dispose());
    });
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
