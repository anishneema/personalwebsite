import * as THREE from 'three';

// Player avatar built entirely from Three.js primitives (no model files).
// Chunky cartoon proportions, ~2 units tall, feet at local y = 0.
const COLORS = {
  skin: 0xc68642,
  hair: 0x1a0a00,
  brow: 0x1a0a00,
  shirt: 0xffffff,
  jeans: 0x6b7fa3,
  shoe: 0xeeeeee,
  sole: 0x202028,
};

function mat(color, roughness = 0.8) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.05 });
}

// Build a limb (leg or arm) as a pivot group so it can swing from the top.
function buildLimb({ upperLen, upperR, lowerLen, lowerR, upperMat, lowerMat, endMesh }) {
  const pivot = new THREE.Group();

  const upper = new THREE.Mesh(new THREE.CylinderGeometry(upperR, upperR * 0.92, upperLen, 16), upperMat);
  upper.position.y = -upperLen / 2;
  pivot.add(upper);

  const lower = new THREE.Mesh(new THREE.CylinderGeometry(lowerR, lowerR * 0.95, lowerLen, 16), lowerMat);
  lower.position.y = -upperLen - lowerLen / 2;
  pivot.add(lower);

  if (endMesh) {
    endMesh.position.y = -upperLen - lowerLen;
    pivot.add(endMesh);
  }

  pivot.traverse((o) => { o.castShadow = true; });
  return pivot;
}

export function createAvatar() {
  const group = new THREE.Group();

  const skinMat = mat(COLORS.skin, 0.7);
  const hairMat = mat(COLORS.hair, 0.85);
  const browMat = mat(COLORS.brow, 0.85);
  const shirtMat = mat(COLORS.shirt, 0.85);
  const jeansMat = mat(COLORS.jeans, 0.9);
  const shoeMat = mat(COLORS.shoe, 0.6);
  const soleMat = mat(COLORS.sole, 0.9);

  const HIP_Y = 0.95;
  const SHOULDER_Y = 1.5;
  const HEAD_Y = 1.82;

  // ── Torso (shirt) — the breathing scale target ───────────────────
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.3), shirtMat);
  torso.position.y = 1.27;
  torso.castShadow = true;
  group.add(torso);

  // Pelvis / waist (jeans)
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.22, 0.28), jeansMat);
  pelvis.position.y = 0.97;
  pelvis.castShadow = true;
  group.add(pelvis);

  // Short sleeve caps on the shoulders (henley)
  for (const sx of [-1, 1]) {
    const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 16), shirtMat);
    sleeve.position.set(sx * 0.32, SHOULDER_Y - 0.02, 0);
    sleeve.castShadow = true;
    group.add(sleeve);
  }

  // ── Neck + Head ──────────────────────────────────────────────────
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 12), skinMat);
  neck.position.y = 1.58;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 24), skinMat);
  head.position.y = HEAD_Y;
  head.castShadow = true;
  group.add(head);

  // Hair: a rounded cap sitting on top of the head.
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.245, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62),
    hairMat
  );
  hair.position.y = HEAD_Y + 0.02;
  hair.castShadow = true;
  group.add(hair);

  // Eyebrows (dark, slightly thick) on the front (+z) of the face.
  for (const sx of [-1, 1]) {
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.03), browMat);
    brow.position.set(sx * 0.08, HEAD_Y + 0.05, 0.21);
    group.add(brow);
  }
  // Small eyes for character.
  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), browMat);
    eye.position.set(sx * 0.08, HEAD_Y - 0.01, 0.215);
    group.add(eye);
  }

  // ── Legs (jeans + sneakers) ──────────────────────────────────────
  const makeShoe = () => {
    const shoeGroup = new THREE.Group();
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.34), shoeMat);
    shoe.position.set(0, 0.0, 0.06);
    shoeGroup.add(shoe);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.05, 0.36), soleMat);
    sole.position.set(0, -0.07, 0.06);
    shoeGroup.add(sole);
    return shoeGroup;
  };

  const legL = buildLimb({
    upperLen: 0.46, upperR: 0.12, lowerLen: 0.42, lowerR: 0.1,
    upperMat: jeansMat, lowerMat: jeansMat, endMesh: makeShoe(),
  });
  legL.position.set(-0.13, HIP_Y, 0);
  group.add(legL);

  const legR = buildLimb({
    upperLen: 0.46, upperR: 0.12, lowerLen: 0.42, lowerR: 0.1,
    upperMat: jeansMat, lowerMat: jeansMat, endMesh: makeShoe(),
  });
  legR.position.set(0.13, HIP_Y, 0);
  group.add(legR);

  // ── Arms (skin, with small box hands) ────────────────────────────
  const makeHand = () => {
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.11, 0.1), skinMat);
    return hand;
  };

  const armL = buildLimb({
    upperLen: 0.32, upperR: 0.075, lowerLen: 0.3, lowerR: 0.065,
    upperMat: skinMat, lowerMat: skinMat, endMesh: makeHand(),
  });
  armL.position.set(-0.34, SHOULDER_Y, 0);
  group.add(armL);

  const armR = buildLimb({
    upperLen: 0.32, upperR: 0.075, lowerLen: 0.3, lowerR: 0.065,
    upperMat: skinMat, lowerMat: skinMat, endMesh: makeHand(),
  });
  armR.position.set(0.34, SHOULDER_Y, 0);
  group.add(armR);

  // ── Animation state ──────────────────────────────────────────────
  let walkPhase = 0;
  let breatheT = 0;
  let swing = 0;

  // speed01: 0 (idle) .. 1 (full walk). dt in seconds.
  const update = (dt, speed01) => {
    const walking = speed01 > 0.05;

    // Walk cycle: arms and legs swing on opposite phases.
    if (walking) {
      walkPhase += dt * (6 + speed01 * 4);
    }
    const targetSwing = walking ? Math.sin(walkPhase) * 0.5 * Math.min(1, speed01 + 0.2) : 0;
    swing += (targetSwing - swing) * Math.min(1, dt * 12);

    legL.rotation.x = swing;
    legR.rotation.x = -swing;
    armL.rotation.x = -swing;
    armR.rotation.x = swing;

    // Idle breathing: subtle torso scale pulse (eases off while walking).
    breatheT += dt * 2.2;
    const breath = Math.sin(breatheT) * 0.025 * (1 - speed01 * 0.6);
    torso.scale.set(1, 1 + breath, 1);
  };

  return { group, update };
}
