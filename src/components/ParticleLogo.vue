<template>
  <div
    ref="frame"
    class="particle-logo"
    role="img"
    :aria-label="label"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <canvas v-if="!failed" ref="canvas" class="particle-canvas" aria-hidden="true"></canvas>
    <img v-else class="particle-fallback" :src="src" alt="" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, shallowRef, useTemplateRef } from "vue";

// Samples both images into a sparse dot grid and morphs one particle swarm
// between them: `src` at rest, `hoverSrc` while hovered. The pointer gently
// pushes nearby dots aside and a few free dots drift in the background.
// Size the root element from the parent (e.g. aspect-ratio).
const props = defineProps<{
  src: string;
  hoverSrc: string;
  label: string;
}>();

// sampling grid pitch and drawn dot size, in CSS pixels
const PITCH = 5;
const DOT = 1.5;
const ALPHA_MIN = 96;
// per-particle stiffness range: soft springs + strong damping give a
// staggered, overshoot-free drift instead of one synchronized snap.
// Values are the 0.008–0.02 / 0.8 tuning time-stretched 2.5× (k / 2.5², d^(1 / 2.5)),
// so arrivals spread over roughly 3–8s; retune all three together.
const SPRING_MIN = 0.00128;
const SPRING_MAX = 0.0032;
const DAMPING = 0.9146;
const COLOR_EASE = 0.016;
const BRIGHTNESS_MIN = 0.7;
// sampled colors are mixed this far toward white so dots read clearly on black
const LIGHTEN = 0.3;
const REPEL_RADIUS = 40;
// kept low: against these soft springs a stronger push opens a large hole (~25px now)
const REPEL_FORCE = 0.15;
const AMBIENT_COUNT = 18;
const AMBIENT_SPEED = 0.12;
// point records in target buffers: x, y, r, g, b
const STRIDE = 5;

const frame = useTemplateRef<HTMLDivElement>("frame");
const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
const failed = shallowRef(false);

let images: HTMLImageElement[] = [];
let ctx: CanvasRenderingContext2D | null = null;
let buffer: ImageData | null = null;
let dpr = 1;
let builtWidth = 0;
let builtHeight = 0;

let count = 0;
let pos: Float32Array = new Float32Array(0);
let vel: Float32Array = new Float32Array(0);
let color: Float32Array = new Float32Array(0);
let spring: Float32Array = new Float32Array(0);
let brightness: Float32Array = new Float32Array(0);
let restTargets: Float32Array = new Float32Array(0);
let hoverTargets: Float32Array = new Float32Array(0);
// free-floating dots: x, y, vx, vy, alpha
let ambient: Float32Array = new Float32Array(0);

let hovering = false;
let pointerActive = false;
let pointerX = 0;
let pointerY = 0;
let visible = false;
let motionSafe = true;
let disposed = false;
let rafId = 0;
let resizeObserver: ResizeObserver | undefined;
let intersectionObserver: IntersectionObserver | undefined;

const random = (min: number, max: number): number => min + Math.random() * (max - min);

const loadImage = async (url: string): Promise<HTMLImageElement> => {
  const img = new Image();
  img.src = url;
  await img.decode();
  return img;
};

const drawnBounds = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
): { x: number; y: number; w: number; h: number } | null => {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] === 0) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
};

const samplePoints = (img: HTMLImageElement, width: number, height: number): Float32Array => {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const offCtx = off.getContext("2d", { willReadFrequently: true });
  if (!offCtx) return new Float32Array(0);

  // first pass: contain-fit the whole image to find its drawn bounds
  const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const left = (width - img.naturalWidth * scale) / 2;
  const top = (height - img.naturalHeight * scale) / 2;
  offCtx.drawImage(img, left, top, img.naturalWidth * scale, img.naturalHeight * scale);
  let { data } = offCtx.getImageData(0, 0, width, height);

  // second pass: redraw only the drawn bounds, contain-fit to the frame, so
  // empty margins inside the source never shrink the shape
  const bounds = drawnBounds(data, width, height);
  if (bounds) {
    const sx = (bounds.x - left) / scale;
    const sy = (bounds.y - top) / scale;
    const sw = bounds.w / scale;
    const sh = bounds.h / scale;
    const fit = Math.min(width / sw, height / sh);
    offCtx.clearRect(0, 0, width, height);
    offCtx.drawImage(
      img,
      sx,
      sy,
      sw,
      sh,
      (width - sw * fit) / 2,
      (height - sh * fit) / 2,
      sw * fit,
      sh * fit,
    );
    data = offCtx.getImageData(0, 0, width, height).data;
  }
  const points: number[] = [];
  for (let y = 2; y < height; y += PITCH) {
    for (let x = 2; x < width; x += PITCH) {
      const i = (y * width + x) * 4;
      if (data[i + 3] >= ALPHA_MIN) {
        points.push(
          x,
          y,
          data[i] + (255 - data[i]) * LIGHTEN,
          data[i + 1] + (255 - data[i + 1]) * LIGHTEN,
          data[i + 2] + (255 - data[i + 2]) * LIGHTEN,
        );
      }
    }
  }

  // shuffle records so the morph pairs unrelated points instead of sweeping rows
  const out = Float32Array.from(points);
  const total = out.length / STRIDE;
  const swap = new Float32Array(STRIDE);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    swap.set(out.subarray(i * STRIDE, i * STRIDE + STRIDE));
    out.copyWithin(i * STRIDE, j * STRIDE, j * STRIDE + STRIDE);
    out.set(swap, j * STRIDE);
  }
  return out;
};

// repeat points of the sparser shape so every particle has a target in both
const expand = (points: Float32Array, size: number): Float32Array => {
  const pointCount = points.length / STRIDE;
  const out = new Float32Array(size * STRIDE);
  for (let i = 0; i < size; i++) {
    const from = (i % pointCount) * STRIDE;
    out.set(points.subarray(from, from + STRIDE), i * STRIDE);
  }
  return out;
};

const build = (scatter: boolean): boolean => {
  const el = frame.value;
  const cv = canvas.value;
  if (!el || !cv || images.length !== 2) return false;

  const width = Math.floor(el.clientWidth);
  const height = Math.floor(el.clientHeight);
  if (width === builtWidth && height === builtHeight) return false;
  builtWidth = width;
  builtHeight = height;
  count = 0;
  if (width === 0 || height === 0) return false;

  dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(width * dpr);
  cv.height = Math.round(height * dpr);
  ctx = cv.getContext("2d");
  if (!ctx) return false;
  buffer = ctx.createImageData(cv.width, cv.height);

  const rest = samplePoints(images[0], width, height);
  const hover = samplePoints(images[1], width, height);
  if (rest.length === 0 || hover.length === 0) return false;

  count = Math.max(rest.length, hover.length) / STRIDE;
  restTargets = expand(rest, count);
  hoverTargets = expand(hover, count);
  pos = new Float32Array(count * 2);
  vel = new Float32Array(count * 2);
  color = new Float32Array(count * 3);
  spring = new Float32Array(count);
  brightness = new Float32Array(count);

  const start = hovering ? hoverTargets : restTargets;
  for (let i = 0; i < count; i++) {
    const t = i * STRIDE;
    pos[i * 2] = scatter ? Math.random() * width : start[t];
    pos[i * 2 + 1] = scatter ? Math.random() * height : start[t + 1];
    color.set(start.subarray(t + 2, t + 5), i * 3);
    spring[i] = random(SPRING_MIN, SPRING_MAX);
    brightness[i] = random(BRIGHTNESS_MIN, 1);
  }

  ambient = new Float32Array(AMBIENT_COUNT * 5);
  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const a = i * 5;
    const angle = Math.random() * Math.PI * 2;
    const speed = random(0.3, 1) * AMBIENT_SPEED;
    ambient[a] = Math.random() * width;
    ambient[a + 1] = Math.random() * height;
    ambient[a + 2] = Math.cos(angle) * speed;
    ambient[a + 3] = Math.sin(angle) * speed;
    ambient[a + 4] = random(0.2, 0.6);
  }
  return true;
};

const step = (): void => {
  const target = hovering ? hoverTargets : restTargets;
  const radius2 = REPEL_RADIUS * REPEL_RADIUS;

  for (let i = 0; i < count; i++) {
    const p = i * 2;
    const t = i * STRIDE;
    const c = i * 3;
    let ax = (target[t] - pos[p]) * spring[i];
    let ay = (target[t + 1] - pos[p + 1]) * spring[i];

    if (pointerActive) {
      const dx = pos[p] - pointerX;
      const dy = pos[p + 1] - pointerY;
      const d2 = dx * dx + dy * dy;
      if (d2 < radius2 && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        const f = ((1 - d / REPEL_RADIUS) * REPEL_FORCE) / d;
        ax += dx * f;
        ay += dy * f;
      }
    }

    vel[p] = (vel[p] + ax) * DAMPING;
    vel[p + 1] = (vel[p + 1] + ay) * DAMPING;
    pos[p] += vel[p];
    pos[p + 1] += vel[p + 1];

    for (let k = 0; k < 3; k++) {
      color[c + k] += (target[t + 2 + k] - color[c + k]) * COLOR_EASE;
    }
  }

  // ambient dots wrap around the frame edges
  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const a = i * 5;
    ambient[a] = (ambient[a] + ambient[a + 2] + builtWidth) % builtWidth;
    ambient[a + 1] = (ambient[a + 1] + ambient[a + 3] + builtHeight) % builtHeight;
  }
};

const snap = (): void => {
  const target = hovering ? hoverTargets : restTargets;
  vel.fill(0);
  for (let i = 0; i < count; i++) {
    const t = i * STRIDE;
    pos[i * 2] = target[t];
    pos[i * 2 + 1] = target[t + 1];
    color.set(target.subarray(t + 2, t + 5), i * 3);
  }
};

const plot = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  size: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number,
): void => {
  const x0 = Math.round(x * dpr);
  const y0 = Math.round(y * dpr);
  const xStart = Math.max(0, x0);
  const xEnd = Math.min(width, x0 + size);
  const yEnd = Math.min(height, y0 + size);
  for (let py = Math.max(0, y0); py < yEnd; py++) {
    let o = (py * width + xStart) * 4;
    for (let px = xStart; px < xEnd; px++) {
      data[o] = r;
      data[o + 1] = g;
      data[o + 2] = b;
      data[o + 3] = a;
      o += 4;
    }
  }
};

// writes dots straight into one ImageData: no per-particle canvas calls
const draw = (): void => {
  if (!ctx || !buffer) return;
  const { data, width, height } = buffer;
  const size = Math.max(1, Math.round(DOT * dpr));
  data.fill(0);

  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const a = i * 5;
    plot(
      data,
      width,
      height,
      size,
      ambient[a],
      ambient[a + 1],
      255,
      255,
      255,
      ambient[a + 4] * 255,
    );
  }
  for (let i = 0; i < count; i++) {
    const c = i * 3;
    plot(
      data,
      width,
      height,
      size,
      pos[i * 2],
      pos[i * 2 + 1],
      color[c],
      color[c + 1],
      color[c + 2],
      brightness[i] * 255,
    );
  }
  ctx.putImageData(buffer, 0, 0);
};

const tick = (): void => {
  rafId = 0;
  step();
  draw();
  schedule();
};

// continuous while visible (ambient drift); offscreen frames stop entirely
const schedule = (): void => {
  if (rafId || !visible || count === 0) return;
  if (!motionSafe) {
    snap();
    draw();
    return;
  }
  rafId = requestAnimationFrame(tick);
};

const updatePointer = (event: PointerEvent): void => {
  const rect = frame.value?.getBoundingClientRect();
  if (!motionSafe || !rect) return;
  pointerActive = true;
  pointerX = event.clientX - rect.left;
  pointerY = event.clientY - rect.top;
};

const onPointerEnter = (event: PointerEvent): void => {
  hovering = true;
  updatePointer(event);
  schedule();
};

const onPointerMove = (event: PointerEvent): void => {
  updatePointer(event);
};

const onPointerLeave = (): void => {
  hovering = false;
  pointerActive = false;
  schedule();
};

onMounted(async () => {
  motionSafe = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try {
    images = await Promise.all([loadImage(props.src), loadImage(props.hoverSrc)]);
  } catch {
    failed.value = true;
    return;
  }
  if (disposed || !frame.value) return;

  build(motionSafe);
  resizeObserver = new ResizeObserver(() => {
    if (build(false)) schedule();
  });
  resizeObserver.observe(frame.value);
  intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    schedule();
  });
  intersectionObserver.observe(frame.value);
});

onUnmounted(() => {
  disposed = true;
  cancelAnimationFrame(rafId);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
});
</script>

<style scoped lang="scss">
.particle-logo {
  position: relative;
}

.particle-canvas,
.particle-fallback {
  display: block;
  width: 100%;
  height: 100%;
}

.particle-fallback {
  object-fit: contain;
}
</style>
