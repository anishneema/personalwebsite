import * as THREE from 'three';
import { createScene, buildRoom, addLighting, buildFrames, buildParticles, ROOM } from './scene.js';
import { createAvatar } from './avatar.js';
import { createFootsteps } from './audio.js';
import { sections } from './data.js';

const PROXIMITY = 3; // units within which a frame becomes active

// Shortest signed angular step from a to b (handles wrap-around).
function lerpAngle(a, b, t) {
  let diff = (b - a) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

// Third-person walk around the room: WASD moves relative to the camera,
// the avatar turns to face movement, mouse orbits the camera.
export function createGame(container) {
  // ── Renderer ──────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  container.appendChild(renderer.domElement);

  // ── Scene ─────────────────────────────────────────────────────────
  const scene = createScene();
  buildRoom(scene);
  addLighting(scene);
  const frames = buildFrames(scene, sections);
  const particles = buildParticles(scene);

  const avatar = createAvatar();
  scene.add(avatar.group);

  const footsteps = createFootsteps();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    120
  );

  // ── Player + camera state ─────────────────────────────────────────
  const RADIUS = 0.6; // keeps the player off the walls
  const MAX_SPEED = 6;
  const ACCEL = 12; // how quickly velocity reaches target (smoothing)
  const TURN_LERP = 0.18; // avatar rotation toward movement direction
  const CAM_LERP = 0.08; // camera follow lag
  const CAM_DIST = 6;
  const CAM_TARGET_Y = 1.4;

  const player = {
    pos: new THREE.Vector3(0, 0, 4),
    vel: new THREE.Vector3(),
    facing: Math.PI, // avatar yaw (local +z forward), faces into the room
  };
  const cam = {
    yaw: Math.PI,   // orbit angle; forward = (sin, 0, cos)
    pitch: 0.32,    // elevation above the target
  };
  const boundX = ROOM.width / 2 - RADIUS;
  const boundZ = ROOM.depth / 2 - RADIUS;
  const camBoundX = ROOM.width / 2 - 0.4;
  const camBoundZ = ROOM.depth / 2 - 0.4;

  avatar.group.position.set(player.pos.x, 0, player.pos.z);
  avatar.group.rotation.y = player.facing;

  // Intro: camera pans from the ceiling down to the player on first load.
  const INTRO_DUR = 2.8;
  let introT = 0;
  let intro = true;

  // Analog movement axis from a mobile joystick (-1..1). Added to WASD.
  const moveAxis = { x: 0, y: 0 };

  let stepTimer = 0; // footstep cadence

  // ── Interaction state ─────────────────────────────────────────────
  let paused = false;        // true while the detail panel is open
  let panelExp = null;       // the experience currently shown, or null
  let nearestFrame = null;   // frame within PROXIMITY, or null

  // Tell React what (if anything) the panel should show.
  const emitPanel = () => {
    container.dispatchEvent(new CustomEvent('world-panel', { detail: { exp: panelExp } }));
  };

  const openPanel = (exp) => {
    panelExp = exp;
    paused = true;
    emitPanel();
  };

  const closePanel = () => {
    if (!panelExp) return;
    panelExp = null;
    paused = false;
    emitPanel();
  };

  // E toggles: open the nearest frame, or close the panel if one is open.
  // Frames with a `link` act as buttons — they open the URL in a new tab.
  const toggleInteract = () => {
    if (panelExp) {
      closePanel();
      return;
    }
    if (!nearestFrame) return;
    const data = nearestFrame.data;
    if (data.link) {
      window.open(data.link, '_blank', 'noopener');
      return;
    }
    openPanel(data);
  };

  // ── Input ─────────────────────────────────────────────────────────
  const keys = Object.create(null);
  const onKeyDown = (e) => {
    keys[e.code] = true;
    markEntered();
    unlockAudio();
    if (e.code === 'KeyE') toggleInteract();
    else if (e.code === 'Escape' && panelExp) closePanel();
  };
  const onKeyUp = (e) => { keys[e.code] = false; };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // ── Drag to look (cursor stays visible, full 360° by dragging) ────
  const SENS = 0.005;
  const PITCH_LIMIT = Math.PI / 2 - 0.05;
  const canvas = renderer.domElement;
  canvas.style.cursor = 'grab';

  let entered = false;
  const markEntered = () => {
    if (entered) return;
    entered = true;
    container.dispatchEvent(new CustomEvent('world-entered'));
  };
  // Audio can only start from a real user gesture (click / key / touch).
  const unlockAudio = () => footsteps.unlock();

  let dragging = false;
  let lastMouse = { x: 0, y: 0 };
  const onMouseDown = (e) => {
    markEntered();
    unlockAudio();
    dragging = true;
    lastMouse = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
  };
  const onMouseUp = () => {
    dragging = false;
    canvas.style.cursor = 'grab';
  };
  // Each drag stroke rotates the camera; repeat strokes for unlimited 360°.
  const onMouseMove = (e) => {
    if (!dragging || paused || intro) return;
    cam.yaw -= (e.clientX - lastMouse.x) * SENS;
    cam.pitch += (e.clientY - lastMouse.y) * SENS;
    cam.pitch = Math.max(-0.15, Math.min(PITCH_LIMIT, cam.pitch));
    lastMouse = { x: e.clientX, y: e.clientY };
  };
  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);

  // ── Touch look (mobile): drag on the canvas orbits the camera ─────
  const TOUCH_SENS = 0.005;
  let lastTouch = null;
  const onTouchStart = (e) => {
    markEntered();
    unlockAudio();
    if (e.touches.length > 0) {
      lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };
  const onTouchMove = (e) => {
    if (!lastTouch || e.touches.length === 0) return;
    const t = e.touches[0];
    cam.yaw -= (t.clientX - lastTouch.x) * TOUCH_SENS;
    cam.pitch += (t.clientY - lastTouch.y) * TOUCH_SENS;
    cam.pitch = Math.max(-0.15, Math.min(PITCH_LIMIT, cam.pitch));
    lastTouch = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = () => { lastTouch = null; };
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });
  canvas.addEventListener('touchend', onTouchEnd);

  // ── Resize ────────────────────────────────────────────────────────
  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  // ── Loop ──────────────────────────────────────────────────────────
  let lastTime = performance.now();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const wishDir = new THREE.Vector3();
  const targetVel = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  const camDesired = new THREE.Vector3();
  let raf = 0;

  // Camera-relative movement axes (flat on the floor plane).
  const updateCameraAxes = () => {
    forward.set(Math.sin(cam.yaw), 0, Math.cos(cam.yaw));
    right.set(-forward.z, 0, forward.x); // camera's right-hand direction
  };

  // Fill camTarget + camDesired (clamped inside the room) for the current state.
  const computeCam = () => {
    camTarget.set(player.pos.x, CAM_TARGET_Y, player.pos.z);
    const cp = Math.cos(cam.pitch);
    camDesired.set(
      camTarget.x - Math.sin(cam.yaw) * CAM_DIST * cp,
      camTarget.y + Math.sin(cam.pitch) * CAM_DIST,
      camTarget.z - Math.cos(cam.yaw) * CAM_DIST * cp
    );
    // Keep the camera inside the room so it never clips through walls.
    camDesired.x = Math.max(-camBoundX, Math.min(camBoundX, camDesired.x));
    camDesired.z = Math.max(-camBoundZ, Math.min(camBoundZ, camDesired.z));
    camDesired.y = Math.max(0.5, Math.min(ROOM.height - 0.3, camDesired.y));
  };

  const placeCamera = (lerpT) => {
    computeCam();
    if (lerpT >= 1) camera.position.copy(camDesired);
    else camera.position.lerp(camDesired, lerpT);
    camera.lookAt(camTarget);
  };

  const update = (dt) => {
    updateCameraAxes();

    const canMove = !paused && !intro;
    let f = 0;
    let s = 0;
    if (canMove) {
      if (keys.KeyW || keys.ArrowUp) f += 1;
      if (keys.KeyS || keys.ArrowDown) f -= 1;
      if (keys.KeyD || keys.ArrowRight) s += 1;
      if (keys.KeyA || keys.ArrowLeft) s -= 1;
      // Mobile joystick (analog).
      f += -moveAxis.y;
      s += moveAxis.x;
    }

    wishDir.set(0, 0, 0)
      .addScaledVector(forward, f)
      .addScaledVector(right, s);
    const moving = wishDir.lengthSq() > 0.0004;
    if (moving) wishDir.normalize();

    // Smooth (lerp) the velocity toward the desired direction.
    targetVel.copy(wishDir).multiplyScalar(MAX_SPEED);
    player.vel.lerp(targetVel, Math.min(1, ACCEL * dt));

    player.pos.x += player.vel.x * dt;
    player.pos.z += player.vel.z * dt;

    // Wall collision: clamp inside the room footprint.
    player.pos.x = Math.max(-boundX, Math.min(boundX, player.pos.x));
    player.pos.z = Math.max(-boundZ, Math.min(boundZ, player.pos.z));

    // Turn the avatar to face its movement direction with a slight lag.
    if (moving) {
      const targetFacing = Math.atan2(wishDir.x, wishDir.z);
      player.facing = lerpAngle(player.facing, targetFacing, TURN_LERP);
    }
    avatar.group.position.set(player.pos.x, 0, player.pos.z);
    avatar.group.rotation.y = player.facing;

    // Drive the avatar's walk/idle animation.
    const speed01 = player.vel.length() / MAX_SPEED;
    avatar.update(dt, speed01);

    // Footstep audio, cadence scaling with speed.
    if (speed01 > 0.15) {
      stepTimer -= dt;
      if (stepTimer <= 0) {
        footsteps.step();
        stepTimer = 0.52 / (0.6 + speed01);
      }
    } else {
      stepTimer = 0;
    }

    // Camera: intro pan from the ceiling, then normal follow.
    if (intro) {
      introT += dt;
      const k = Math.min(1, introT / INTRO_DUR);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // easeInOut
      computeCam();
      const startX = camTarget.x;
      const startY = ROOM.height - 0.4;
      const startZ = camTarget.z + 0.01;
      camera.position.set(
        startX + (camDesired.x - startX) * e,
        startY + (camDesired.y - startY) * e,
        startZ + (camDesired.z - startZ) * e
      );
      camera.lookAt(camTarget);
      if (k >= 1) intro = false;
    } else {
      placeCamera(CAM_LERP);
    }

    particles.update(dt);
    updateFrames(dt);
  };

  // Proximity glow + pulse, and "nearest frame" tracking for the prompt.
  let elapsed = 0;
  const updateFrames = (dt) => {
    elapsed += dt;
    let best = null;
    let bestDist = Infinity;

    for (const frame of frames) {
      const dx = frame.worldPos.x - player.pos.x;
      const dz = frame.worldPos.z - player.pos.z;
      const dist = Math.hypot(dx, dz);
      const active = dist < PROXIMITY;

      frame.active = active;
      if (active && dist < bestDist) {
        bestDist = dist;
        best = frame;
      }

      // Border glow: gentle base glow, brighter pulse when in range.
      const pulse = 0.5 + 0.5 * Math.sin(elapsed * 4);
      const targetEmissive = active ? 1.4 + pulse * 1.1 : 0.7;
      frame.borderMat.emissiveIntensity +=
        (targetEmissive - frame.borderMat.emissiveIntensity) * Math.min(1, dt * 8);

      const targetLight = active ? 2.5 + pulse * 1.5 : 0;
      frame.glowLight.intensity +=
        (targetLight - frame.glowLight.intensity) * Math.min(1, dt * 8);

      // Subtle scale pop when active.
      const targetScale = active ? 1.05 : 1;
      const s = frame.group.scale.x + (targetScale - frame.group.scale.x) * Math.min(1, dt * 8);
      frame.group.scale.set(s, s, s);
    }

    if (best !== nearestFrame) {
      nearestFrame = best;
      container.dispatchEvent(
        new CustomEvent('world-near', { detail: { exp: best ? best.data : null } })
      );
    }
  };

  const loop = () => {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    update(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  placeCamera(1); // snap camera into place on first frame
  loop();

  // Snapshot used by the mini-map (read each frame by the UI).
  const getState = () => ({
    px: player.pos.x,
    pz: player.pos.z,
    facing: player.facing,
    room: { width: ROOM.width, depth: ROOM.depth },
    frames: frames.map((fr) => ({
      x: fr.worldPos.x,
      z: fr.worldPos.z,
      color: fr.color,
      active: !!fr.active,
    })),
  });

  // Mobile joystick feeds an analog axis (-1..1 each).
  const setMoveAxis = (x, y) => {
    moveAxis.x = Math.max(-1, Math.min(1, x));
    moveAxis.y = Math.max(-1, Math.min(1, y));
  };

  // ── Teardown ──────────────────────────────────────────────────────
  const dispose = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchmove', onTouchMove);
    canvas.removeEventListener('touchend', onTouchEnd);
    footsteps.dispose();
    renderer.dispose();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };

  return { dispose, closePanel, interact: toggleInteract, getState, setMoveAxis };
}
