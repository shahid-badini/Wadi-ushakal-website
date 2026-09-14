import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Collects parts per material and merges them into one mesh per material,
 * keeping the whole truck to a handful of draw calls.
 */
class PartBuilder {
  parts = new Map();
  tmp = new THREE.Object3D();

  add(geo, mat, pos, rot = [0, 0, 0]) {
    this.tmp.position.set(...pos);
    this.tmp.rotation.set(...rot);
    this.tmp.updateMatrix();
    const g = (geo.index ? geo.toNonIndexed() : geo.clone()).applyMatrix4(this.tmp.matrix);
    g.clearGroups();
    if (!this.parts.has(mat)) this.parts.set(mat, []);
    this.parts.get(mat).push(g);
    geo.dispose();
  }

  box(w, h, d, mat, pos, radius = 0, rot) {
    const geo = radius ? new RoundedBoxGeometry(w, h, d, 3, radius) : new THREE.BoxGeometry(w, h, d);
    this.add(geo, mat, pos, rot);
  }

  build() {
    const group = new THREE.Group();
    this.parts.forEach((geos, mat) => {
      const merged = mergeGeometries(geos);
      geos.forEach((g) => g.dispose());
      if (merged) group.add(new THREE.Mesh(merged, mat));
    });
    return group;
  }
}

export function createTruck(tx) {
  const root = new THREE.Group();

  // Materials — MeshStandardMaterial throughout (physical/clearcoat materials cost an extra shading pass)
  const paint = new THREE.MeshStandardMaterial({ color: 0xf3f3f1, metalness: 0.2, roughness: 0.32 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1e2226, metalness: 0.3, roughness: 0.62 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x3a4048, metalness: 0.6, roughness: 0.4 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xe3e7ec, metalness: 1, roughness: 0.16 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x1b2632, metalness: 0.6, roughness: 0.08, envMapIntensity: 1.3 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x4a83b8, metalness: 0.2, roughness: 0.4 });
  const lens = new THREE.MeshBasicMaterial({ color: 0xf4f7fb });
  const amber = new THREE.MeshBasicMaterial({ color: 0xffb54d });
  const red = new THREE.MeshBasicMaterial({ color: 0xe0352b });

  // ---------------------------------------------------------------- Tractor cab (bobs independently)
  const cabParts = new PartBuilder();
  cabParts.box(2.5, 2.75, 2.3, paint, [0, 2.52, 3.3], 0.16);
  cabParts.box(2.4, 0.56, 1.9, paint, [0, 4.1, 3.05], 0.2, [-0.06, 0, 0]);
  // glazing
  cabParts.box(2.24, 1.12, 0.05, glass, [0, 3.1, 4.44], 0, [-0.07, 0, 0]);
  cabParts.box(0.04, 0.82, 1.05, glass, [1.255, 3.12, 3.72]);
  cabParts.box(0.04, 0.82, 1.05, glass, [-1.255, 3.12, 3.72]);
  cabParts.box(2.34, 0.1, 0.34, dark, [0, 3.76, 4.52]); // sun visor
  // face
  cabParts.box(1.9, 1.0, 0.08, dark, [0, 2.05, 4.47], 0.03);
  for (let i = 0; i < 4; i++) cabParts.box(1.76, 0.055, 0.05, chrome, [0, 1.7 + i * 0.22, 4.52]);
  cabParts.box(2.3, 0.08, 0.03, accent, [0, 2.66, 4.46]);
  // headlight housings + lenses
  [-0.9, 0.9].forEach((x) => {
    cabParts.box(0.66, 0.28, 0.06, trim, [x, 1.5, 4.46]);
    cabParts.box(0.52, 0.15, 0.04, lens, [x, 1.5, 4.5]);
  });
  cabParts.box(2.54, 0.5, 0.42, trim, [0, 1.05, 4.34], 0.06); // bumper
  // side brand stripes
  cabParts.box(0.03, 0.12, 2.0, accent, [1.262, 1.62, 3.3]);
  cabParts.box(0.03, 0.12, 2.0, accent, [-1.262, 1.62, 3.3]);
  // mirrors
  [-1, 1].forEach((s) => {
    cabParts.box(0.36, 0.05, 0.05, dark, [s * 1.42, 3.34, 4.18]);
    cabParts.box(0.14, 0.58, 0.28, paint, [s * 1.62, 3.1, 4.18], 0.04);
  });
  // roof marker lights
  for (let i = 0; i < 5; i++) cabParts.box(0.14, 0.07, 0.05, amber, [-0.56 + i * 0.28, 4.33, 4.02]);
  const cab = cabParts.build();
  root.add(cab);


  // ---------------------------------------------------------------- Chassis
  const chassisParts = new PartBuilder();
  chassisParts.box(1.0, 0.3, 6.6, dark, [0, 0.85, 1.1]);
  [-1, 1].forEach((s) => {
    chassisParts.add(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16), chrome, [s * 1.0, 0.92, 1.35], [Math.PI / 2, 0, 0]);
    chassisParts.box(0.34, 0.5, 0.78, dark, [s * 1.08, 0.95, 2.7]); // steps
  });
  chassisParts.add(new THREE.CylinderGeometry(0.08, 0.08, 1.7, 10), chrome, [1.05, 3.35, 2.02]); // exhaust stack
  chassisParts.box(2.6, 0.08, 2.5, dark, [0, 1.13, -0.45]); // rear fenders
  root.add(chassisParts.build());

  // ---------------------------------------------------------------- Trailer
  const trailer = new THREE.Group();
  const ribsSide = tx.ribs.clone();
  ribsSide.repeat.set(170, 1);
  ribsSide.needsUpdate = true;
  const sideMat = new THREE.MeshStandardMaterial({
    map: tx.livery,
    bumpMap: ribsSide,
    bumpScale: 0.2, // gentle ribs — the low dusk light exaggerates stronger bumps into stripes
    metalness: 0.2,
    roughness: 0.45,
  });
  const plainMat = new THREE.MeshStandardMaterial({ color: 0xe9eaec, metalness: 0.2, roughness: 0.45 });
  const container = new THREE.Mesh(new THREE.BoxGeometry(2.55, 2.9, 13.6), [
    sideMat,
    sideMat,
    plainMat,
    dark,
    plainMat,
    plainMat,
  ]);
  container.position.set(0, 2.85, -5.6);
  trailer.add(container);

  const trailerParts = new PartBuilder();
  trailerParts.box(1.0, 0.28, 13.2, dark, [0, 1.25, -5.6]);
  [-1, 1].forEach((s) => {
    trailerParts.box(0.05, 0.28, 6.4, trim, [s * 1.2, 1.02, -5.3]); // side guard
    trailerParts.box(0.12, 0.9, 0.12, trim, [s * 0.85, 0.85, -2.4]); // landing gear
    // clearance lights along the top & bottom edges
    for (let i = 0; i < 5; i++) {
      const z = 1.0 - i * 3.3;
      trailerParts.box(0.05, 0.08, 0.16, amber, [s * 1.29, 4.2, z]);
      trailerParts.box(0.05, 0.07, 0.12, amber, [s * 1.29, 1.52, z]);
    }
  });
  // corner castings
  [-1, 1].forEach((sx) =>
    [1.5, 4.2].forEach((y) => [1.1, -12.3].forEach((z) => trailerParts.box(0.22, 0.2, 0.22, trim, [sx * 1.2, y, z]))),
  );
  trailerParts.box(2.4, 0.16, 0.16, dark, [0, 0.72, -12.35]); // rear bumper
  [-0.95, 0.95].forEach((x) => trailerParts.box(0.34, 0.12, 0.03, red, [x, 0.95, -12.44]));
  trailer.add(trailerParts.build());
  root.add(trailer);

  // ---------------------------------------------------------------- Wheels (one instanced draw call per material)
  const wheelDefs = [
    // x, z, radius, width
    [1.08, 3.4, 0.52, 0.34], [-1.08, 3.4, 0.52, 0.34],
    [0.98, 0.2, 0.52, 0.62], [-0.98, 0.2, 0.52, 0.62],
    [0.98, -1.1, 0.52, 0.62], [-0.98, -1.1, 0.52, 0.62],
    [0.98, -9.2, 0.5, 0.62], [-0.98, -9.2, 0.5, 0.62],
    [0.98, -10.5, 0.5, 0.62], [-0.98, -10.5, 0.5, 0.62],
    [0.98, -11.8, 0.5, 0.62], [-0.98, -11.8, 0.5, 0.62],
  ];
  const wheelGeo = new THREE.CylinderGeometry(1, 1, 1, 24, 1).rotateZ(Math.PI / 2);
  const tyre = new THREE.MeshStandardMaterial({ color: 0x151619, roughness: 0.92, metalness: 0 });
  const rimMat = new THREE.MeshStandardMaterial({ map: tx.rim, metalness: 0.7, roughness: 0.35 });
  const wheels = new THREE.InstancedMesh(wheelGeo, [tyre, rimMat, rimMat], wheelDefs.length);
  root.add(wheels);

  // ---------------------------------------------------------------- Contact shadow (soft, daylight)
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 19),
    new THREE.MeshBasicMaterial({ map: tx.shadow, color: 0x1c2733, transparent: true, opacity: 0.55, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.25, 0.035, -4);
  root.add(shadow);

  // "Cargo scan" frame that sweeps along the trailer — purely visual, brand blue
  const scan = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 3.4),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      uniforms: { uAlpha: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `
        varying vec2 vUv; uniform float uAlpha;
        void main(){
          vec2 d = min(vUv, 1.0 - vUv);
          float edge = 1.0 - smoothstep(0.0, 0.035, min(d.x, d.y));
          gl_FragColor = vec4(0.290, 0.514, 0.722, (edge * 0.9 + 0.06) * uAlpha);
        }`,
    }),
  );
  scan.position.set(0, 2.85, 1.3);
  root.add(scan);
  const scanMat = scan.material;

  // ---------------------------------------------------------------- Animation
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const axis = new THREE.Vector3(1, 0, 0);
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  let travelled = 0;

  const placeWheels = () => {
    wheelDefs.forEach(([x, z, r, w], i) => {
      q.setFromAxisAngle(axis, travelled / r);
      m.compose(pos.set(x, r, z), q, scl.set(w, r, r));
      wheels.setMatrixAt(i, m);
    });
    wheels.instanceMatrix.needsUpdate = true;
  };
  placeWheels();

  const SCAN_PERIOD = 7;
  const update = (dt, speed, t) => {
    travelled += speed * dt;
    placeWheels();

    // subtle suspension movement
    cab.position.y = Math.sin(t * 7.3) * 0.012 + Math.sin(t * 2.1) * 0.01;
    cab.rotation.x = Math.sin(t * 3.1) * 0.0025;
    trailer.position.y = Math.sin(t * 5.2 + 1.3) * 0.008;

    // scan sweep: 2.4 s pass, then rest
    const phase = (t % SCAN_PERIOD) / 2.4;
    if (phase <= 1) {
      scan.visible = true;
      scan.position.z = 1.3 - phase * 13.8;
      scanMat.uniforms.uAlpha.value = Math.sin(phase * Math.PI) * 0.8;
    } else {
      scan.visible = false;
    }
  };

  return { group: root, update };
}
