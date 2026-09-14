/**
 * Loads the Three.js hero scene lazily, after first paint, so it never blocks the initial render.
 * Keeps the CSS horizon fallback when:
 *  - WebGL2 is unavailable,
 *  - the visitor has Save-Data enabled, or
 *  - WebGL is software-rendered (no GPU acceleration) — the scene would run on the CPU and make the page janky.
 * Append `?force3d` to the URL to bypass the software-renderer check (useful for automated screenshots).
 *
 * Returns a cleanup function: called when the hero unmounts (e.g. navigating to /contact), it cancels a pending
 * load or stops the running scene and frees its WebGL context.
 */
export function initHeroScene() {
  const stage = document.querySelector('[data-hero-stage]');
  if (!stage || navigator.connection?.saveData) return;
  const force = new URLSearchParams(location.search).has('force3d');
  let cancelled = false;
  let dispose;

  // The GPU probe creates a WebGL context, which can be slow — so it also waits until the page is idle.
  const load = () => {
    if (cancelled) return;
    const gl = probeWebGL();
    if (!gl.supported || (gl.software && !force)) return;
    import('./hero/scene')
      .then(({ mountHeroScene }) => mountHeroScene(stage))
      .then((stop) => (cancelled ? stop() : (dispose = stop)))
      .catch((err) => console.warn('Hero scene unavailable:', err));
  };
  const idle = (cb) =>
    'requestIdleCallback' in window ? window.requestIdleCallback(cb, { timeout: 1200 }) : globalThis.setTimeout(cb, 200);
  const onLoad = () => idle(load);

  if (document.readyState === 'complete') idle(load);
  else window.addEventListener('load', onLoad, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener('load', onLoad);
    dispose?.();
  };
}

function probeWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
    if (!gl) return { supported: false, software: false };
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    const software = /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { supported: true, software };
  } catch {
    return { supported: false, software: false };
  }
}
