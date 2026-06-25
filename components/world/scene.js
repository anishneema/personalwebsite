import * as THREE from 'three';

// ── Global design palette ─────────────────────────────────────────────
export const COLORS = {
  bg: 0x050510,
  walls: 0x0a0a2e,
  floor: 0x0d0d1a,
  ceiling: 0x07071a,
  grid: 0x4488ff,
  accent: 0x4488ff,
  highlight: 0x7eb8ff,
  ambient: 0x112244,
};

// Room dimensions (world units). Square room, walls 6 high.
export const ROOM = {
  width: 26,
  depth: 26,
  height: 6,
};

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);
  // Fog falls off into black for depth and contrast.
  scene.fog = new THREE.Fog(COLORS.bg, 16, 52);
  return scene;
}

export function buildRoom(scene) {
  const { width, depth, height } = ROOM;
  const group = new THREE.Group();
  group.name = 'room';

  // ── Floor ────────────────────────────────────────────────────────
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({
      color: 0x0a0a20,
      roughness: 0.92,
      metalness: 0.12,
      emissive: 0x06060f,
      emissiveIntensity: 0.25,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  // Subtle blue grid lines on the floor.
  const divisions = Math.max(width, depth);
  const grid = new THREE.GridHelper(divisions, divisions, COLORS.grid, COLORS.grid);
  grid.position.y = 0.015;
  grid.material.transparent = true;
  grid.material.opacity = 0.22;
  group.add(grid);

  // ── Ceiling ──────────────────────────────────────────────────────
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({
      color: 0x07071a,
      roughness: 1,
      metalness: 0,
      emissive: 0x05050f,
      emissiveIntensity: 0.15,
      side: THREE.DoubleSide,
    })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = height;
  group.add(ceiling);

  // ── Walls ────────────────────────────────────────────────────────
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x101030,
    roughness: 0.85,
    metalness: 0.2,
    emissive: 0x0a0a22,
    emissiveIntensity: 0.22,
    side: THREE.DoubleSide,
  });
  const halfW = width / 2;
  const halfD = depth / 2;
  const makeWall = (w, x, z, ry) => {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(w, height), wallMat);
    wall.position.set(x, height / 2, z);
    wall.rotation.y = ry;
    wall.receiveShadow = true;
    group.add(wall);
  };
  makeWall(width, 0, -halfD, 0);            // North wall, faces +z
  makeWall(width, 0, halfD, Math.PI);       // South wall, faces -z
  makeWall(depth, halfW, 0, -Math.PI / 2);  // East wall, faces -x
  makeWall(depth, -halfW, 0, Math.PI / 2);  // West wall, faces +x

  scene.add(group);
  return group;
}

export function addLighting(scene) {
  // Low ambient blue fill — keeps shadows dark for contrast.
  const ambient = new THREE.AmbientLight(0x141d33, 1.4);
  scene.add(ambient);

  // Subtle hemisphere fill: cool blue from above, near-black from the floor.
  const hemi = new THREE.HemisphereLight(0x4a6098, 0x05050f, 0.7);
  hemi.position.set(0, ROOM.height, 0);
  scene.add(hemi);

  // One cool-blue directional light casting soft shadows and shape.
  const dir = new THREE.DirectionalLight(0xaecaff, 1.9);
  dir.position.set(8, 14, 6);
  dir.castShadow = true;
  dir.shadow.mapSize.set(1024, 1024);
  dir.shadow.camera.near = 1;
  dir.shadow.camera.far = 60;
  dir.shadow.camera.left = -ROOM.width;
  dir.shadow.camera.right = ROOM.width;
  dir.shadow.camera.top = ROOM.depth;
  dir.shadow.camera.bottom = -ROOM.depth;
  scene.add(dir);

  // Small blue point lights in each corner for depth.
  const { width, depth, height } = ROOM;
  const cx = width / 2 - 2.5;
  const cz = depth / 2 - 2.5;
  const lights = [];
  for (const [sx, sz] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const p = new THREE.PointLight(COLORS.accent, 28, 20, 1.8);
    p.position.set(sx * cx, height - 1.2, sz * cz);
    scene.add(p);
    lights.push(p);
  }

  // Soft central overhead light so the middle of the room isn't a void.
  const center = new THREE.PointLight(0x6f8fd8, 16, 32, 1.6);
  center.position.set(0, height - 0.5, 0);
  scene.add(center);
  lights.push(center);

  return { ambient, hemi, dir, lights };
}

// ── Wall frames ──────────────────────────────────────────────────────
// Builds one framed picture per experience, mounted on the walls and
// evenly distributed around the room. Returns an array of frame handles
// the game loop uses for proximity glow + interaction.
const FRAME_W = 3.2;
const FRAME_H = 2.2;
const FRAME_Y = 2.5; // center height on the wall

// A crisp text sprite (auto-sized by aspect). Used for nameplates + wall headers.
function makeTextSprite(text, opts = {}) {
  const fontSize = opts.fontSize ?? 64;
  const color = opts.color ?? '#ffffff';
  const glow = opts.glow ?? 'rgba(68,136,255,0.9)';
  const height = opts.height ?? 1;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.font = font;
  const pad = fontSize * 1.2;
  canvas.width = Math.ceil(ctx.measureText(text).width + pad);
  canvas.height = Math.ceil(fontSize * 1.8);

  ctx.font = font; // reset after resize
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = glow;
  ctx.shadowBlur = fontSize * 0.4;
  ctx.fillStyle = '#7eb8ff';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false, // stays readable from across the room
  });
  const sprite = new THREE.Sprite(material);
  const aspect = canvas.width / canvas.height;
  sprite.scale.set(height * aspect, height, 1);
  return sprite;
}

// Word-wrap helper for canvas text.
function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Fallback "logo" for items with no image: the name drawn on the accent color.
function makeLogoMaterial(text, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  ctx.font = '700 88px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const lines = wrapLines(ctx, text, 560);
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;
  ctx.fillStyle = color;
  const lh = 104;
  const startY = canvas.height / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, canvas.width / 2, startY + i * lh));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return new THREE.MeshBasicMaterial({ map: texture, transparent: true });
}

// Build a single framed picture for one item. Returns the group + handles.
function buildFrameMesh(item) {
  const group = new THREE.Group();
  const accentColor = new THREE.Color(item.color);

  // Glowing blue border (slightly larger plane behind everything).
  const borderMat = new THREE.MeshStandardMaterial({
    color: COLORS.accent,
    emissive: COLORS.accent,
    emissiveIntensity: 0.7,
    roughness: 0.4,
    metalness: 0.3,
  });
  const border = new THREE.Mesh(new THREE.PlaneGeometry(FRAME_W + 0.3, FRAME_H + 0.3), borderMat);
  border.position.z = 0.03;
  group.add(border);

  // Dark frame background.
  const bg = new THREE.Mesh(
    new THREE.PlaneGeometry(FRAME_W, FRAME_H),
    new THREE.MeshStandardMaterial({
      color: 0x05050f,
      emissive: 0x05050f,
      emissiveIntensity: 0.4,
      roughness: 0.9,
    })
  );
  bg.position.z = 0.05;
  group.add(bg);

  // Inner picture: the logo image if available, else a clean text logo.
  const picMat = item.image
    ? (() => {
        const tex = new THREE.TextureLoader().load(item.image);
        tex.colorSpace = THREE.SRGBColorSpace;
        return new THREE.MeshBasicMaterial({ map: tex, transparent: true });
      })()
    : makeLogoMaterial(item.company, item.color);
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(FRAME_W * 0.82, FRAME_H * 0.74), picMat);
  pic.position.set(0, 0, 0.07);
  group.add(pic);

  // A small colored light so each frame casts its accent into the room.
  const glowLight = new THREE.PointLight(accentColor, 0, 7, 2);
  glowLight.position.set(0, 0, 1.2);
  group.add(glowLight);

  return { group, borderMat, glowLight };
}

// Orientation per wall (frames face into the room).
const WALL_RY = {
  north: 0,
  south: Math.PI,
  east: -Math.PI / 2,
  west: Math.PI / 2,
};

// Builds every section's frames on its assigned wall, evenly spaced, with a
// large header above. Returns a flat array of frame handles for the game loop.
export function buildFrames(scene, sections) {
  const { width, depth } = ROOM;
  const halfW = width / 2 - 0.08;
  const halfD = depth / 2 - 0.08;
  const MARGIN = 2.5;
  const HEADER_Y = 4.7;

  const frames = [];

  for (const section of sections) {
    const wall = section.wall;
    const ry = WALL_RY[wall] ?? 0;
    const items = section.items;
    const n = items.length;
    const horizontal = wall === 'north' || wall === 'south';
    const wallLen = horizontal ? width : depth;
    const usable = wallLen - MARGIN * 2;

    // Map an item index to its (x, z) position along the wall.
    const placeAt = (i) => {
      const t = n <= 1 ? 0 : -usable / 2 + usable * (i / (n - 1));
      if (wall === 'north') return [t, -halfD];
      if (wall === 'south') return [t, halfD];
      if (wall === 'east') return [halfW, t];
      return [-halfW, t]; // west
    };

    items.forEach((item, i) => {
      const [x, z] = placeAt(i);
      const { group, borderMat, glowLight } = buildFrameMesh(item);
      group.position.set(x, FRAME_Y, z);
      group.rotation.y = ry;
      scene.add(group);

      frames.push({
        id: item.id,
        data: item,
        group,
        borderMat,
        glowLight,
        color: item.color,
        worldPos: new THREE.Vector3(x, FRAME_Y, z),
      });
    });

    // Section header centered on the wall (some sections opt out).
    if (section.hideHeader) continue;
    let hx = 0;
    let hz = 0;
    if (wall === 'north') hz = -halfD;
    else if (wall === 'south') hz = halfD;
    else if (wall === 'east') hx = halfW;
    else hx = -halfW;

    const header = makeTextSprite(section.title.toUpperCase(), {
      fontSize: 96,
      height: 1.5,
      glow: 'rgba(68,136,255,1)',
    });
    header.position.set(hx, HEADER_Y, hz);
    scene.add(header);
  }

  return frames;
}

// ── Floating particles ───────────────────────────────────────────────
// Soft blue points drifting slowly upward through the room.
export function buildParticles(scene, count = 260) {
  const { width, depth, height } = ROOM;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * (width - 1);
    positions[i * 3 + 1] = Math.random() * height;
    positions[i * 3 + 2] = (Math.random() - 0.5) * (depth - 1);
    speeds[i] = 0.05 + Math.random() * 0.12;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: COLORS.accent,
    size: 0.06,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  const update = (dt) => {
    const arr = geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] + speeds[i] * dt;
      if (y > height) y = 0; // wrap back to the floor
      arr[i * 3 + 1] = y;
    }
    geometry.attributes.position.needsUpdate = true;
  };

  return { points, update };
}

