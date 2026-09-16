import * as THREE from 'three';

/*
 * All hero textures are drawn procedurally on <canvas> — no image downloads for the 3D scene.
 */

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

function toTexture(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Soft radial dot, used for the network nodes. */
export function glowTexture() {
  const [c, g] = makeCanvas(64, 64);
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.8)');
  grd.addColorStop(0.6, 'rgba(255,255,255,0.2)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return toTexture(c);
}

/** Soft elliptical contact shadow for under the truck. */
export function shadowTexture() {
  const [c, g] = makeCanvas(128, 512);
  g.setTransform(1, 0, 0, 4, 0, 0);
  const grd = g.createRadialGradient(64, 64, 8, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,0.9)');
  grd.addColorStop(0.55, 'rgba(0,0,0,0.5)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return toTexture(c);
}

/**
 * Highway surface in daylight: one 12×12 m tile. Two 3.6 m lanes, dashed centre line, solid edge lines, shoulders.
 * Texture u spans the road width, v spans the tile length.
 */
export function roadTexture() {
  const S = 512;
  const [c, g] = makeCanvas(S, S);
  const px = S / 12;

  g.fillStyle = '#54585e';
  g.fillRect(0, 0, S, S);
  // shoulders slightly lighter
  g.fillStyle = '#63676d';
  g.fillRect(0, 0, 2.4 * px, S);
  g.fillRect(S - 2.4 * px, 0, 2.4 * px, S);

  // asphalt grain
  const img = g.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 16;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);

  // wheel-track darkening in each lane
  g.fillStyle = 'rgba(0,0,0,0.12)';
  [3.3, 5.1, 6.9, 8.7].forEach((x) => g.fillRect(x * px - 12, 0, 24, S));

  // edge lines
  g.fillStyle = 'rgba(248,248,248,0.92)';
  g.fillRect(2.4 * px - 3, 0, 6, S);
  g.fillRect(S - 2.4 * px - 3, 0, 6, S);
  // dashed centre (3 m dash / 9 m gap)
  g.fillRect(S / 2 - 3, 0, 6, 3 * px);

  const t = toTexture(c);
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Fine, light sand detail with wind ripples — tiled over the desert floor. */
export function sandTexture() {
  const S = 256;
  const [c, g] = makeCanvas(S, S);
  g.fillStyle = '#e2cfa8';
  g.fillRect(0, 0, S, S);
  // ripples
  for (let y = 0; y < S; y += 6) {
    g.strokeStyle = `rgba(160,120,70,${0.05 + Math.random() * 0.05})`;
    g.lineWidth = 2;
    g.beginPath();
    for (let x = 0; x <= S; x += 8) {
      const yy = y + Math.sin((x / S) * Math.PI * 4 + y * 0.3) * 2;
      if (x === 0) g.moveTo(x, yy);
      else g.lineTo(x, yy);
    }
    g.stroke();
  }
  const img = g.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 20;
    img.data[i] += n;
    img.data[i + 1] += n * 0.85;
    img.data[i + 2] += n * 0.7;
  }
  g.putImageData(img, 0, 0);
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Wheel face: tyre sidewall, steel rim with vents, hub and wheel nuts. */
export function rimTexture() {
  const S = 256;
  const [c, g] = makeCanvas(S, S);
  const cx = S / 2;
  const circle = (r, fill) => {
    g.fillStyle = fill;
    g.beginPath();
    g.arc(cx, cx, r, 0, Math.PI * 2);
    g.fill();
  };
  circle(128, '#1a1b1d');
  circle(92, '#9aa0a7');
  circle(84, '#c3c7cc');
  // vent holes
  g.fillStyle = '#343840';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    g.beginPath();
    g.ellipse(cx + Math.cos(a) * 60, cx + Math.sin(a) * 60, 11, 16, a, 0, Math.PI * 2);
    g.fill();
  }
  circle(38, '#dde0e4');
  circle(30, '#a8adb3');
  // nuts
  g.fillStyle = '#eef0f2';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    g.beginPath();
    g.arc(cx + Math.cos(a) * 34, cx + Math.sin(a) * 34, 4.5, 0, Math.PI * 2);
    g.fill();
  }
  circle(12, '#43464b');
  return toTexture(c);
}

/** Vertical corrugation used as a bump map on the trailer. */
export function ribsTexture() {
  const [c, g] = makeCanvas(64, 4);
  const grd = g.createLinearGradient(0, 0, 64, 0);
  grd.addColorStop(0, '#000');
  grd.addColorStop(0.2, '#fff');
  grd.addColorStop(0.5, '#fff');
  grd.addColorStop(0.7, '#000');
  grd.addColorStop(1, '#000');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 4);
  const t = toTexture(c, false);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Trailer side livery in the brand blue, with the Wadi Nushakal wordmark. Waits for the web font so canvas text matches the site. */
export async function liveryTexture() {
  const family = '"Manrope Variable", "Helvetica Neue", Arial, sans-serif';
  try {
    await Promise.race([document.fonts.load(`800 110px ${family}`), new Promise((r) => setTimeout(r, 1500))]);
  } catch {
    /* fall back to system font */
  }

  const W = 2048;
  const H = 436; // ≈ 13.6 m × 2.9 m
  const [c, g] = makeCanvas(W, H);
  const ctx = g;

  const base = g.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#f7f7f6');
  base.addColorStop(0.6, '#eeeeec');
  base.addColorStop(1, '#dcdcda');
  g.fillStyle = base;
  g.fillRect(0, 0, W, H);

  // Brand-blue sweep towards the rear of the trailer
  const sweep = g.createLinearGradient(W * 0.55, H, W, 0);
  sweep.addColorStop(0, '#2f6497');
  sweep.addColorStop(0.6, '#4a83b8');
  sweep.addColorStop(1, '#7fa9d1');
  g.fillStyle = sweep;
  g.beginPath();
  g.moveTo(W * 0.56, H);
  g.bezierCurveTo(W * 0.72, H * 0.78, W * 0.86, H * 0.4, W, H * 0.08);
  g.lineTo(W, H);
  g.closePath();
  g.fill();
  // navy pinstripe following the sweep
  g.strokeStyle = '#1b2a3b';
  g.lineWidth = 10;
  g.beginPath();
  g.moveTo(W * 0.5, H);
  g.bezierCurveTo(W * 0.68, H * 0.74, W * 0.84, H * 0.32, W, H * -0.02);
  g.stroke();

  // Logo mark: white "W" on a brand-blue tile
  const mx = 110;
  const my = 118;
  const ms = 170;
  g.fillStyle = '#4a83b8';
  g.beginPath();
  g.roundRect(mx, my, ms, ms, 38);
  g.fill();
  g.strokeStyle = '#ffffff';
  g.lineWidth = 15;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const p = (x, y) => [mx + (x / 48) * ms, my + (y / 48) * ms];
  g.beginPath();
  g.moveTo(...p(10, 14));
  g.lineTo(...p(17.5, 34));
  g.lineTo(...p(24, 21));
  g.lineTo(...p(30.5, 34));
  g.lineTo(...p(38, 14));
  g.stroke();
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.arc(...p(24, 12.5), 9, 0, Math.PI * 2);
  g.fill();

  // Wordmark
  ctx.fontStretch = 'expanded';
  g.fillStyle = '#0f1b2a';
  g.font = `800 118px ${family}`;
  g.textBaseline = 'alphabetic';
  g.fillText('WADI NUSHAKAL', 330, 232);

  ctx.letterSpacing = '10px';
  g.fillStyle = '#2f6497';
  g.font = `700 34px ${family}`;
  g.fillText('TRANSPORT & LOGISTICS', 336, 288);

  ctx.letterSpacing = '0px';
  ctx.fontStretch = 'normal';
  g.fillStyle = '#3a4758';
  g.font = `600 32px ${family}`;
  g.fillText('Your Cargo, Our Commitment.', 336, 344);

  // top / bottom rails
  g.fillStyle = '#b9bcc0';
  g.fillRect(0, 0, W, 10);
  g.fillStyle = '#3a4048';
  g.fillRect(0, H - 14, W, 14);

  return toTexture(c);
}
