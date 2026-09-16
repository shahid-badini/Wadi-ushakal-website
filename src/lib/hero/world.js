import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Road centre (the truck drives in the right-hand lane at x = 0). */
export const ROAD_X = -1.8;
const Z_NEAR = 45; // props enter here (behind the camera) and are recycled back here once they pass the horizon
const SPAN = 440;

// Brand blue, as sRGB values for shaders that write colour directly (toneMapped: false)
const BRAND_SRGB = '0.290, 0.514, 0.722'; // #4A83B8
const BRAND_DEEP_SRGB = '0.239, 0.463, 0.678'; // #3D76AD

/**
 * Screen-space mask for the moving props (delineators, lamp posts, location pins): they dissolve out behind the
 * hero copy on the left, so the headline stays calm and readable without laying an overlay over the scene.
 * `value` is the mask edge in drawing-buffer pixels from the left (0 = off); scene.js sets it per layout.
 */
export const propClip = { value: 0 };
const maskProps = (mat) => {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uClipX = propClip;
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uClipX;').replace(
      'void main() {',
      `void main() {
        if (uClipX > 0.0) {
          float n = fract(sin(dot(floor(gl_FragCoord.xy), vec2(12.9898, 78.233))) * 43758.5453);
          if (smoothstep(uClipX - 60.0, uClipX, gl_FragCoord.x) < n) discard;
        }`,
    );
  };
  return mat;
};

const smoothstep = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const ridge = (v) => 1 - Math.abs(Math.sin(v));

/** Dune height field; flat next to the highway and rising into the desert. */
export function duneHeight(x, z) {
  const d = Math.abs(x - ROAD_X);
  const mask = smoothstep(9, 55, d);
  if (mask === 0) return 0;
  const amp = 0.55 + Math.min(d / 220, 1);
  const h =
    9 * ridge(x * 0.018 + Math.sin(z * 0.011) * 1.6) * (0.6 + 0.4 * Math.sin(z * 0.007 + x * 0.004)) +
    4 * ridge(x * 0.041 - z * 0.023 + 1.3) +
    1.4 * Math.sin(x * 0.09 + z * 0.05);
  return h * amp * mask;
}

export function createWorld(opts) {
  const group = new THREE.Group(); // desert, sky, road, roadside props — not drawn over the hero photo
  // Overlay: the brand route line and the floating location markers. These ARE drawn over the photo,
  // so scene.js adds this group to the scene separately (see `world.overlay`).
  const overlay = new THREE.Group();
  let travelled = 0;

  // ------------------------------------------------------------------ Daylight sky (also lights the truck)
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(900, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        // Clear UAE daylight: bright sky, pale haze at the horizon, high sun ahead of the truck
        uTop: { value: new THREE.Color('#7fb0dd') },
        uMid: { value: new THREE.Color('#bcd8ee') },
        uHorizon: { value: new THREE.Color('#eef3f7') },
        uGround: { value: new THREE.Color('#e3d7bf') },
        uSun: { value: new THREE.Color('#fff6e4') },
        uSunDir: { value: new THREE.Vector3(0.35, 0.42, -1).normalize() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vDir;
        uniform vec3 uTop, uMid, uHorizon, uGround, uSun, uSunDir;
        void main() {
          vec3 d = normalize(vDir);
          float h = d.y;
          float s = max(dot(d, uSunDir), 0.0);
          vec3 horizon = mix(vec3(0.72, 0.79, 0.86), uHorizon, pow(s, 3.0));
          vec3 col = mix(horizon, uMid, smoothstep(0.0, 0.22, h));
          col = mix(col, uTop, smoothstep(0.18, 0.7, h));
          col = mix(col, uGround, smoothstep(0.0, -0.06, h));
          col += uSun * (pow(s, 6.0) * 0.35 + pow(s, 120.0) * 1.2);
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }),
  );
  group.add(sky);

  // ------------------------------------------------------------------ Desert floor with dunes + scrolling detail
  const GW = 1400;
  const GD = 1000;
  const groundGeo = new THREE.PlaneGeometry(GW, GD, opts.lite ? 80 : 120, opts.lite ? 64 : 96).rotateX(-Math.PI / 2);
  groundGeo.translate(ROAD_X, 0, -GD / 2 + 120);
  const gp = groundGeo.attributes.position;
  const colors = new Float32Array(gp.count * 3);
  // Daylight sand: warm shadow in the hollows, bright light on the crests
  const cLow = new THREE.Color('#b79c72');
  const cHigh = new THREE.Color('#ead7b0');
  const c = new THREE.Color();
  for (let i = 0; i < gp.count; i++) {
    const h = duneHeight(gp.getX(i), gp.getZ(i));
    gp.setY(i, h);
    c.copy(cLow).lerp(cHigh, Math.min(1, h / 16));
    colors.set([c.r, c.g, c.b], i * 3);
  }
  groundGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  groundGeo.computeVertexNormals();

  const sand = opts.sand;
  sand.repeat.set(GW / 8, GD / 8);
  sand.anisotropy = opts.anisotropy;
  const gridScroll = { value: 0 };
  const groundMat = new THREE.MeshStandardMaterial({ vertexColors: true, map: sand, roughness: 0.95, metalness: 0 });
  // Subtle brand-blue survey grid on the terrain (visual only), mixed into the surface colour
  groundMat.onBeforeCompile = (shader) => {
    shader.uniforms.uScroll = gridScroll;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nuniform float uScroll;')
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        vec2 gp = vec2(vWPos.x, vWPos.z - uScroll) / 10.0;
        vec2 gd = abs(fract(gp - 0.5) - 0.5) / fwidth(gp);
        float gl = 1.0 - min(min(gd.x, gd.y), 1.0);
        float gfade = smoothstep(300.0, 20.0, -vWPos.z + 20.0) * smoothstep(8.0, 22.0, abs(vWPos.x - (${ROAD_X.toFixed(1)})));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.42, 0.78), gl * gfade * 0.22);`,
      )
      // the grid lines glow softly at dusk
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.1, 0.32, 0.75) * gl * gfade * 0.3;',
      );
  };
  group.add(new THREE.Mesh(groundGeo, groundMat));

  // ------------------------------------------------------------------ Highway
  const road = opts.road;
  road.repeat.set(1, GD / 12);
  road.anisotropy = opts.anisotropy;
  group.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(12, GD).rotateX(-Math.PI / 2).translate(ROAD_X, 0.03, -GD / 2 + 120),
      new THREE.MeshStandardMaterial({
        map: road,
        roughness: 0.82,
        metalness: 0.02,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
    ),
  );

  // ------------------------------------------------------------------ Brand-blue route line along the truck's lane
  const routeUniforms = { uScroll: { value: 0 } };
  overlay.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, GD).rotateX(-Math.PI / 2).translate(0, 0.06, -GD / 2 + 120),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: routeUniforms,
        vertexShader: /* glsl */ `
          varying vec2 vUv; varying float vZ;
          void main() {
            vUv = uv;
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vZ = wp.z;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }`,
        fragmentShader: /* glsl */ `
          varying vec2 vUv; varying float vZ; uniform float uScroll;
          void main() {
            float x = abs(vUv.x - 0.5) * 2.0;
            float core = smoothstep(0.2, 0.0, x);
            float halo = pow(1.0 - x, 3.0) * 0.25;
            float dash = smoothstep(0.3, 0.5, fract((vZ - uScroll) / 4.0));
            dash = 0.35 + 0.65 * dash;
            float ahead = step(4.6, vZ);
            float fade = smoothstep(-520.0, -30.0, vZ) * smoothstep(48.0, 18.0, vZ);
            float a = (core * dash + halo) * fade * mix(0.55, 0.95, ahead);
            gl_FragColor = vec4(vec3(${BRAND_DEEP_SRGB}), a);
          }`,
      }),
    ),
  );

  // ------------------------------------------------------------------ Roadside delineators (instanced)
  const postGap = 16;
  const postZ = [];
  for (let z = Z_NEAR; z > Z_NEAR - SPAN; z -= postGap) postZ.push(z);
  const postXs = [ROAD_X - 6.5, ROAD_X + 6.5];
  const postCount = postZ.length * postXs.length;
  const posts = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.12, 1.0, 0.12),
    maskProps(new THREE.MeshStandardMaterial({ color: 0xf2f3f5, roughness: 0.6 })),
    postCount,
  );
  const reflectors = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.14, 0.16, 0.13),
    maskProps(new THREE.MeshBasicMaterial({ color: 0x4a83b8, toneMapped: false })),
    postCount,
  );
  group.add(posts, reflectors);

  // ------------------------------------------------------------------ Highway lamp posts on the far verge
  const lampGap = 55;
  const lampZ = [];
  for (let z = Z_NEAR; z > Z_NEAR - SPAN; z -= lampGap) lampZ.push(z);
  const lampX = ROAD_X - 8.4;
  const poleGeo = mergeGeometries([
    new THREE.CylinderGeometry(0.11, 0.16, 10, 8).translate(0, 5, 0),
    new THREE.BoxGeometry(3.2, 0.12, 0.12).translate(1.5, 9.9, 0),
    new THREE.BoxGeometry(0.9, 0.18, 0.42).translate(2.95, 9.8, 0),
  ]);
  const poles = new THREE.InstancedMesh(
    poleGeo,
    maskProps(new THREE.MeshStandardMaterial({ color: 0x8a939e, metalness: 0.5, roughness: 0.45 })),
    lampZ.length,
  );
  group.add(poles);

  // ------------------------------------------------------------------ Floating location markers (brand blue)
  const pinMat = maskProps(
    new THREE.MeshStandardMaterial({
      color: 0x4a83b8,
      emissive: 0x3a8fdc,
      emissiveIntensity: 0.9, // pins glow at dusk
      metalness: 0.1,
      roughness: 0.35,
    }),
  );
  const brandBasic = (opacity) =>
    maskProps(
      new THREE.MeshBasicMaterial({
        color: 0x4a83b8,
        transparent: true,
        opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
  const pinGeo = mergeGeometries([
    new THREE.SphereGeometry(0.62, 20, 12).translate(0, 1.0, 0),
    new THREE.ConeGeometry(0.5, 1.2, 20).rotateX(Math.PI).translate(0, 0.25, 0),
  ]);
  const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 1, 6, 1, true);
  const ringGeo = new THREE.RingGeometry(0.85, 1.0, 40).rotateX(-Math.PI / 2);
  const markerDefs = [
    { x: 17, z: -28 },
    { x: -26, z: -95 },
    { x: 30, z: -170 },
    { x: -16, z: -250 },
    { x: 24, z: -340 },
  ];
  const markers = markerDefs.map((d, i) => {
    const m = new THREE.Group();
    const pinGroup = new THREE.Group();
    pinGroup.add(new THREE.Mesh(pinGeo, pinMat));
    const beam = new THREE.Mesh(beamGeo, brandBasic(0.35));
    const ring = new THREE.Mesh(ringGeo, brandBasic(0.6));
    m.add(pinGroup, beam, ring);
    overlay.add(m);
    return { group: m, pinGroup, beam, ring, x: d.x, z: d.z, phase: i * 1.37 };
  });

  // ------------------------------------------------------------------ Distant logistics network arcs
  const arcUniforms = { uTime: { value: 0 } };
  const arcMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: arcUniforms,
    vertexShader: /* glsl */ `
      attribute float aT; varying float vT;
      void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      varying float vT; uniform float uTime;
      void main() {
        float f = fract(vT * 2.0 - uTime * 0.18);
        float flow = smoothstep(0.0, 0.06, f) * (1.0 - smoothstep(0.06, 0.28, f));
        gl_FragColor = vec4(vec3(${BRAND_SRGB}), 0.3 + flow * 0.6);
      }`,
  });
  const arcEnds = [];
  const addArc = (a, b, lift) => {
    const mid = a.clone().lerp(b, 0.5);
    mid.y += lift;
    const pts = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(64);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(pts.map((_, i) => i / (pts.length - 1))), 1));
    group.add(new THREE.Line(geo, arcMat));
    arcEnds.push(a, b);
  };
  const n1 = new THREE.Vector3(-170, 14, -400);
  const n2 = new THREE.Vector3(-30, 10, -560);
  const n3 = new THREE.Vector3(150, 16, -430);
  const n4 = new THREE.Vector3(80, 10, -300);
  addArc(n1, n2, 60);
  addArc(n2, n3, 70);
  addArc(n1, n4, 80);
  addArc(n4, n3, 40);
  group.add(
    new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(arcEnds),
      new THREE.PointsMaterial({
        map: opts.glow,
        color: 0x4a83b8,
        size: 12,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      }),
    ),
  );

  // ------------------------------------------------------------------ Per-frame update
  const m4 = new THREE.Matrix4();
  const wrap = (z) => (z < Z_NEAR - SPAN ? z + SPAN : z);
  // Delineators re-enter just in front of the camera, so they never sweep across the headline
  const wrapPost = (z) => (z < 16 - SPAN ? z + SPAN : z);

  const placeProps = (dz) => {
    let k = 0;
    for (let i = 0; i < postZ.length; i++) {
      postZ[i] = wrapPost(postZ[i] + dz);
      for (const x of postXs) {
        posts.setMatrixAt(k, m4.makeTranslation(x, 0.5, postZ[i]));
        reflectors.setMatrixAt(k, m4.makeTranslation(x, 0.86, postZ[i]));
        k++;
      }
    }
    posts.instanceMatrix.needsUpdate = true;
    reflectors.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < lampZ.length; i++) {
      lampZ[i] = wrap(lampZ[i] + dz);
      poles.setMatrixAt(i, m4.makeTranslation(lampX, 0, lampZ[i]));
    }
    poles.instanceMatrix.needsUpdate = true;
  };
  placeProps(0);

  const update = (dt, speed, t) => {
    // The truck faces +z (towards the camera) and drives forward, so the world streams the other way (−z),
    // past the trailer and away to the horizon. The wheels in truck.js roll in the same direction.
    const dz = -speed * dt;
    travelled += dz;
    road.offset.y = (travelled / 12) % 1;
    sand.offset.y = (travelled / 8) % 1;
    gridScroll.value = travelled % 10;
    routeUniforms.uScroll.value = travelled % 4;
    arcUniforms.uTime.value = t;
    placeProps(dz);

    markers.forEach((mk) => {
      mk.z += dz;
      if (mk.z < Z_NEAR - SPAN) {
        mk.z += SPAN;
        mk.x = (Math.random() < 0.5 ? -1 : 1) * (14 + Math.random() * 22);
      }
      const hover = 5.2 + Math.sin(t * 1.4 + mk.phase) * 0.35;
      mk.group.position.set(mk.x, duneHeight(mk.x, mk.z), mk.z);
      mk.pinGroup.position.y = hover;
      mk.pinGroup.rotation.y = t * 0.8 + mk.phase;
      mk.beam.scale.y = hover;
      mk.beam.position.y = hover / 2;
      const pulse = (t * 0.6 + mk.phase) % 1;
      mk.ring.position.y = 0.08;
      mk.ring.scale.setScalar(1 + pulse * 3.5);
      mk.ring.material.opacity = (1 - pulse) * 0.6;
    });
  };

  return { group, overlay, sky, update };
}
