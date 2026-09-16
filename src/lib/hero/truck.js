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

  // Materials. The body is the one place worth a physical material: clearcoat over paint is what makes a
  // truck read as a real vehicle rather than a plastic toy, and there is only one such material in the scene.
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xf6f7f7,
    metalness: 0.08,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.35,
  });
  const dark = new THREE.MeshStandardMaterial({ color: 0x16191d, metalness: 0.35, roughness: 0.55 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x33383f, metalness: 0.75, roughness: 0.32 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xeef2f6, metalness: 1, roughness: 0.08, envMapIntensity: 1.6 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0e1620,
    metalness: 0,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 2.1,
    reflectivity: 0.9,
  });
  const accent = new THREE.MeshStandardMaterial({ color: 0x4a83b8, metalness: 0.25, roughness: 0.34 });
  const lens = new THREE.MeshBasicMaterial({ color: 0xf4f7fb });
  const amber = new THREE.MeshBasicMaterial({ color: 0xffb54d });
  const red = new THREE.MeshBasicMaterial({ color: 0xe0352b });

  // ---------------------------------------------------------------- Tractor cab (bobs independently)
  // Built as a real cab reads: a sleeper box, a shoulder that steps in above the doors, a short tapered
  // nose over the engine, and a screen raked back over it. Rounded boxes carry the bevels, which is what
  // stops the whole thing reading as a stack of blocks.
  const cabParts = new PartBuilder();
  cabParts.box(2.48, 2.05, 1.5, paint, [0, 2.28, 2.62], 0.34); // sleeper / body
  cabParts.box(2.46, 1.5, 1.35, paint, [0, 3.42, 2.72], 0.4); // upper shoulder, stepped in
  cabParts.box(2.36, 0.62, 1.75, paint, [0, 4.12, 2.86], 0.3, [-0.05, 0, 0]); // roof
  cabParts.box(2.2, 0.46, 1.05, paint, [0, 4.0, 1.86], 0.22, [0.2, 0, 0]); // roof fairing to the trailer
  // nose: two stacked boxes, the upper one pulled back, so the front slopes instead of standing square
  cabParts.box(2.38, 1.0, 1.15, paint, [0, 2.0, 4.02], 0.26);
  cabParts.box(2.26, 0.62, 0.95, paint, [0, 2.78, 3.88], 0.24, [-0.22, 0, 0]);
  // glazing: a raked screen over the nose, plus door glass
  cabParts.box(2.2, 1.24, 0.06, glass, [0, 3.44, 3.9], 0.02, [-0.26, 0, 0]);
  cabParts.box(0.04, 0.78, 1.15, glass, [1.245, 3.5, 2.78]);
  cabParts.box(0.04, 0.78, 1.15, glass, [-1.245, 3.5, 2.78]);
  cabParts.box(2.32, 0.1, 0.4, dark, [0, 4.12, 3.62], 0.03, [-0.26, 0, 0]); // sun visor over the screen
  // face: grille set into the nose, chrome slats, brand bar
  cabParts.box(1.86, 0.82, 0.08, dark, [0, 2.02, 4.62], 0.04);
  for (let i = 0; i < 5; i++) cabParts.box(1.72, 0.06, 0.05, chrome, [0, 1.74 + i * 0.17, 4.66]);
  cabParts.box(2.26, 0.1, 0.04, accent, [0, 2.56, 4.6], 0.02);
  // headlight housings + lenses, wrapped into the nose corners
  [-0.92, 0.92].forEach((x) => {
    cabParts.box(0.6, 0.3, 0.08, trim, [x, 1.52, 4.58], 0.05);
    cabParts.box(0.48, 0.17, 0.05, lens, [x, 1.52, 4.63], 0.03);
    cabParts.box(0.2, 0.1, 0.05, amber, [x > 0 ? 1.19 : -1.19, 1.52, 4.4], 0.02); // indicators
  });
  cabParts.box(2.54, 0.46, 0.46, trim, [0, 1.12, 4.5], 0.16); // bumper
  cabParts.box(2.26, 0.24, 0.32, dark, [0, 0.8, 4.44], 0.1); // air dam
  [-1, 1].forEach((s2) => cabParts.box(0.12, 0.66, 1.7, paint, [s2 * 1.2, 1.36, 2.9], 0.08)); // side skirts
  // front wheel arches, so the tyres sit in the body instead of beside it
  [-1, 1].forEach((s2) => {
    cabParts.add(new THREE.TorusGeometry(0.66, 0.1, 6, 12, Math.PI), paint, [s2 * 1.14, 1.12, 3.4], [0, Math.PI / 2, 0]);
  });
  // side brand stripes
  cabParts.box(0.03, 0.14, 1.7, accent, [1.255, 1.68, 2.9]);
  cabParts.box(0.03, 0.14, 1.7, accent, [-1.255, 1.68, 2.9]);
  // mirrors on proper arms
  [-1, 1].forEach((s) => {
    cabParts.box(0.4, 0.05, 0.05, dark, [s * 1.44, 3.62, 3.72]);
    cabParts.box(0.12, 0.62, 0.3, paint, [s * 1.66, 3.36, 3.72], 0.05);
    cabParts.box(0.1, 0.28, 0.16, paint, [s * 1.6, 2.86, 3.86], 0.04); // kerb mirror below it
  });
  // roof marker lights
  for (let i = 0; i < 5; i++) cabParts.box(0.15, 0.08, 0.06, amber, [-0.58 + i * 0.29, 4.4, 3.68], 0.02);
  const cab = cabParts.build();
  root.add(cab);


  // ---------------------------------------------------------------- Chassis
  const chassisParts = new PartBuilder();
  chassisParts.box(1.0, 0.3, 6.6, dark, [0, 0.85, 1.1]);
  [-1, 1].forEach((s) => {
    // fuel tank: a polished cylinder slung under the door, the detail that most says "truck"
    chassisParts.add(new THREE.CylinderGeometry(0.34, 0.34, 1.5, 20), chrome, [s * 1.02, 0.94, 1.5], [Math.PI / 2, 0, 0]);
    chassisParts.add(new THREE.TorusGeometry(0.34, 0.035, 5, 16), trim, [s * 1.02, 0.94, 0.85], [0, 0, 0]);
    chassisParts.add(new THREE.TorusGeometry(0.34, 0.035, 5, 16), trim, [s * 1.02, 0.94, 2.15], [0, 0, 0]);
    chassisParts.box(0.36, 0.06, 1.4, trim, [s * 1.02, 1.3, 1.5]); // tank step plate
    chassisParts.box(0.3, 0.06, 0.62, trim, [s * 1.1, 0.62, 2.72]); // lower step
    chassisParts.box(0.3, 0.06, 0.62, trim, [s * 1.1, 1.02, 2.72]); // upper step
    // air tanks behind the drive axles
    chassisParts.add(new THREE.CylinderGeometry(0.16, 0.16, 0.8, 12), trim, [s * 0.62, 0.72, -0.9], [0, 0, Math.PI / 2]);
  });
  // twin chrome exhaust stacks behind the cab
  [-1, 1].forEach((s) => {
    chassisParts.add(new THREE.CylinderGeometry(0.13, 0.13, 2.5, 14), chrome, [s * 1.12, 2.9, 1.62]);
    chassisParts.add(new THREE.CylinderGeometry(0.16, 0.15, 0.2, 14), chrome, [s * 1.12, 4.2, 1.62]);
  });
  chassisParts.box(1.9, 0.07, 0.9, trim, [0, 1.2, 0.5], 0.03); // catwalk between cab and trailer
  chassisParts.box(2.6, 0.08, 2.5, dark, [0, 1.13, -0.45]); // rear fenders
  // mud flaps behind the drive axles
  [-1, 1].forEach((s2) => chassisParts.box(0.62, 0.5, 0.04, dark, [s2 * 0.98, 0.5, -1.85]));
  root.add(chassisParts.build());

  // ---------------------------------------------------------------- Trailer
  const trailer = new THREE.Group();
  const ribsSide = tx.ribs.clone();
  ribsSide.repeat.set(170, 1);
  ribsSide.needsUpdate = true;
  const sideMat = new THREE.MeshStandardMaterial({
    map: tx.livery,
    bumpMap: ribsSide,
    bumpScale: 0.28,
    metalness: 0.45,
    roughness: 0.34,
    envMapIntensity: 1.15,
  });
  const plainMat = new THREE.MeshStandardMaterial({ color: 0xe4e6e9, metalness: 0.45, roughness: 0.34, envMapIntensity: 1.15 });
  const container = new THREE.Mesh(new RoundedBoxGeometry(2.55, 2.9, 13.6, 2, 0.07), [
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
  // aero side skirts along the trailer, which also ground it visually
  [-1, 1].forEach((s2) => trailerParts.box(0.06, 0.62, 7.2, plainMat, [s2 * 1.22, 1.05, -6.2], 0.03));
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
  const wheelGeo = new THREE.CylinderGeometry(1, 1, 1, 32, 1).rotateZ(Math.PI / 2);
  const tyre = new THREE.MeshStandardMaterial({ color: 0x0f1113, roughness: 0.96, metalness: 0 });
  const rimMat = new THREE.MeshStandardMaterial({ map: tx.rim, metalness: 0.85, roughness: 0.22, envMapIntensity: 1.4 });
  const wheels = new THREE.InstancedMesh(wheelGeo, [tyre, rimMat, rimMat], wheelDefs.length);
  root.add(wheels);

  // ---------------------------------------------------------------- Contact shadow (soft, daylight)
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 19),
    new THREE.MeshBasicMaterial({ map: tx.shadow, color: 0x24313f, transparent: true, opacity: 0.42, depthWrite: false }),
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
