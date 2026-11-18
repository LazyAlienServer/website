import { clamp01, easeInOutCubic, easeOutCubic, seg } from "./scroll.ts";

/*
 * Scroll transition from the hero card to the about panel, drawn on one
 * canvas over the card. `drawVeil` is a pure function of scroll progress p
 * (0–1 over the pinned track), so scrubbing backward replays it exactly.
 *
 *   flip      the card's 100u module cells each turn over once, in a random
 *             order with overlapping windows, from edge-on to a flat blue
 *             face; once all have landed the card is a blue panel (`covered`)
 *   assemble  white particles scattered over the panel fly into the logo
 *   shift     the logo moves aside (left on landscape, up on portrait)
 *   copy      the about text rises in beside it (DOM, see About.tsx)
 */

export const PHASE = {
  /** every tile starts and finishes its flip inside this range */
  flip: [0.03, 0.38],
  /** panel fully blue; the hero beneath is made inert from here */
  covered: 0.4,
  assemble: [0.42, 0.7],
  shift: [0.72, 0.86],
  /** first about line starts here; later lines follow (About.tsx) */
  copy: 0.76,
} as const;

/**
 * Length of one tile's flip, in scroll progress. Starts are spread over the
 * rest of the flip range, so with 128 tiles (landscape) a new flip starts
 * about every 0.002 and roughly 50 tiles are mid-turn at once.
 */
const FLIP_DUR = 0.1;

/** Camera distance as a multiple of the tile's half-size; smaller is a stronger perspective. */
const PERSPECTIVE = 5;

/** How much a tile darkens toward black when edge-on, so the turn reads in depth. */
const SHADE = 0.4;

/**
 * Per-particle timeline inside the assemble phase (shares of it): each
 * particle appears at its own random moment within `appear`, fades and
 * grows in over `fade`, holds at its scatter point for `linger`, then flies
 * to the logo. Travel length is whatever is left, so the last particle to
 * appear lands exactly at the end of the phase.
 */
const PARTICLE = { appear: 0.5, fade: 0.12, linger: 0.08 };
const TRAVEL = 1 - PARTICLE.appear - PARTICLE.linger;

const BLUE = [15, 102, 221] as const;
const BLACK = [10, 10, 10] as const;
const WHITE = "#ffffff";
const blue = `rgb(${BLUE.join(" ")})`;

/** Deterministic PRNG, so every visit plays the same flip order and particle scatter. */
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** One module cell: when its flip starts, which axis it turns about, and which way. */
export type Tile = { start: number; axis: "x" | "y"; sign: 1 | -1 };

/**
 * Card geometry in CSS px, mirroring `.board` in Home.module.css:
 * artboard unit `u`, the 100u module grid (16 × 8 landscape, 4 × 8
 * portrait), and one `Tile` per cell in row-major order.
 */
export type Board = {
  w: number;
  h: number;
  u: number;
  cols: number;
  rows: number;
  portrait: boolean;
  tiles: Tile[];
};

/**
 * Flip order is a seeded shuffle of the cells; the k-th cell in that order
 * starts at a random point inside the k-th of n equal slots, so starts are
 * random but evenly spread and windows always overlap.
 */
const tilesFor = (n: number): Tile[] => {
  const rand = mulberry32(829);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const span = PHASE.flip[1] - PHASE.flip[0] - FLIP_DUR;
  const tiles = new Array<Tile>(n);
  order.forEach((cell, k) => {
    tiles[cell] = {
      start: PHASE.flip[0] + ((k + rand()) / n) * span,
      axis: rand() < 0.5 ? "x" : "y",
      sign: rand() < 0.5 ? 1 : -1,
    };
  });
  return tiles;
};

export const boardFor = (w: number, h: number): Board => {
  const portrait = w < h;
  const u = portrait ? Math.min(w / 400, h / 800) : Math.min(w / 1600, h / 800);
  const module = 100 * u;
  const cols = Math.max(1, Math.round(w / module));
  const rows = Math.max(1, Math.round(h / module));
  return { w, h, u, cols, rows, portrait, tiles: tilesFor(cols * rows) };
};

/**
 * Logo placement: centered while it assembles, then shifted aside to make
 * room for the about text. Values in artboard units; keep in step with the
 * `--about-*` properties in Home.module.css.
 */
const logoBox = (b: Board) => {
  const lw = (b.portrait ? 240 : 480) * b.u;
  const lh = (lw * 73) / 97;
  return {
    lw,
    lh,
    x: b.w / 2 - lw / 2,
    y: b.h / 2 - lh / 2,
    dx: b.portrait ? 0 : (470 - 800) * b.u,
    dy: b.portrait ? (230 - 400) * b.u : 0,
  };
};

type Particle = {
  /** target within the logo box, 0–1 */
  nx: number;
  ny: number;
  /** start within the card, 0–1 */
  sx: number;
  sy: number;
  /** when it appears, as a share of the assemble phase (0–`PARTICLE.appear`) */
  delay: number;
  /** sideways bend of the flight path, as a share of its length */
  curl: number;
};

export type Logo = { particles: Particle[]; pitch: number };

const SAMPLE_W = 220;

/**
 * Rasterizes the logo and keeps opaque pixels on a regular lattice, with the
 * lattice step chosen so about `max` points remain. The lattice gives a
 * clean halftone logo rather than random noise.
 */
export async function sampleLogo(url: string, max = 2400): Promise<Logo> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const sh = Math.round((SAMPLE_W * 73) / 97);
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_W;
  canvas.height = sh;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { particles: [], pitch: 1 };
  ctx.drawImage(img, 0, 0, SAMPLE_W, sh);
  const alpha = ctx.getImageData(0, 0, SAMPLE_W, sh).data;
  const opaque = (x: number, y: number) => alpha[(y * SAMPLE_W + x) * 4 + 3] > 128;

  let filled = 0;
  for (let y = 0; y < sh; y++) for (let x = 0; x < SAMPLE_W; x++) if (opaque(x, y)) filled++;
  const step = Math.max(1, Math.round(Math.sqrt(filled / max)));

  const rand = mulberry32(20220829);
  const particles: Particle[] = [];
  for (let y = 0; y < sh; y += step) {
    for (let x = 0; x < SAMPLE_W; x += step) {
      if (!opaque(x, y)) continue;
      particles.push({
        nx: x / SAMPLE_W,
        ny: y / sh,
        sx: rand(),
        sy: rand(),
        delay: rand() * PARTICLE.appear,
        curl: (rand() - 0.5) * 0.4,
      });
    }
  }
  return { particles, pitch: step / SAMPLE_W };
}

/**
 * Turn angle of a tile's blue face at progress p, in radians: ±π/2 is
 * edge-on, 0 is flat facing the viewer. `null` before its flip starts.
 */
const tileAngle = (p: number, tile: Tile): number | null => {
  const t = easeOutCubic(seg(p, tile.start, tile.start + FLIP_DUR));
  return t <= 0 ? null : tile.sign * (1 - t) * (Math.PI / 2);
};

/**
 * Draws a cell's blue face turned by `angle` about its vertical (`y`) or
 * horizontal (`x`) center axis, in perspective: the edge swinging toward
 * the viewer grows, the far edge shrinks, and the face darkens as it turns
 * edge-on.
 */
function drawTile(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  angle: number,
  axis: "x" | "y",
) {
  // +1px so flat tiles meet without seams
  const half = ((axis === "y" ? w : h) + 1) / 2;
  const across = ((axis === "y" ? h : w) + 1) / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const d = PERSPECTIVE * half;
  const near = d / (d - half * sin);
  const far = d / (d + half * sin);
  const cx = x + w / 2;
  const cy = y + h / 2;

  const m = SHADE * Math.abs(sin);
  const rgb = BLUE.map((v, i) => Math.round(v + (BLACK[i] - v) * m));
  ctx.fillStyle = `rgb(${rgb.join(" ")})`;
  ctx.beginPath();
  if (axis === "y") {
    ctx.moveTo(cx - half * cos * far, cy - across * far);
    ctx.lineTo(cx + half * cos * near, cy - across * near);
    ctx.lineTo(cx + half * cos * near, cy + across * near);
    ctx.lineTo(cx - half * cos * far, cy + across * far);
  } else {
    ctx.moveTo(cx - across * far, cy - half * cos * far);
    ctx.lineTo(cx + across * far, cy - half * cos * far);
    ctx.lineTo(cx + across * near, cy + half * cos * near);
    ctx.lineTo(cx - across * near, cy + half * cos * near);
  }
  ctx.closePath();
  ctx.fill();
}

function drawTiles(ctx: CanvasRenderingContext2D, b: Board, p: number) {
  if (p >= PHASE.covered) {
    ctx.fillStyle = blue;
    ctx.fillRect(0, 0, b.w, b.h);
    return;
  }
  const cw = b.w / b.cols;
  const ch = b.h / b.rows;
  b.tiles.forEach((tile, i) => {
    const angle = tileAngle(p, tile);
    if (angle === null) return;
    const c = i % b.cols;
    const r = Math.floor(i / b.cols);
    drawTile(ctx, c * cw, r * ch, cw, ch, angle, tile.axis);
  });
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  b: Board,
  logo: Logo,
  a: number,
  shift: number,
  settled: boolean,
) {
  const box = logoBox(b);
  const ox = box.x + box.dx * shift;
  const oy = box.y + box.dy * shift;
  const dot = box.lw * logo.pitch * 0.72;
  ctx.fillStyle = WHITE;
  const base = ctx.globalAlpha;
  for (const q of logo.particles) {
    const tx = ox + q.nx * box.lw;
    const ty = oy + q.ny * box.lh;
    if (settled) {
      ctx.fillRect(tx - dot / 2, ty - dot / 2, dot, dot);
      continue;
    }
    const local = a - q.delay;
    if (local <= 0) continue;
    const shown = easeOutCubic(clamp01(local / PARTICLE.fade));
    const t = easeInOutCubic(clamp01((local - PARTICLE.linger) / TRAVEL));
    const sx = q.sx * b.w;
    const sy = q.sy * b.h;
    const dx = tx - sx;
    const dy = ty - sy;
    const bend = Math.sin(Math.PI * t) * q.curl;
    const x = sx + dx * t - dy * bend;
    const y = sy + dy * t + dx * bend;
    const size = dot * (0.5 + 0.5 * t) * shown;
    ctx.globalAlpha = base * shown;
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
  }
  ctx.globalAlpha = base;
}

/**
 * Reduced motion keeps the same end state with no flips or travel: the
 * panel and the logo (already in its final place) fade in over the same
 * scroll range.
 */
function drawReduced(ctx: CanvasRenderingContext2D, b: Board, logo: Logo | null, p: number) {
  ctx.globalAlpha = seg(p, 0.1, 0.35);
  ctx.fillStyle = blue;
  ctx.fillRect(0, 0, b.w, b.h);
  const show = seg(p, 0.45, 0.6);
  if (logo && show > 0) {
    ctx.globalAlpha = show;
    drawParticles(ctx, b, logo, 1, 1, true);
  }
  ctx.globalAlpha = 1;
}

export function drawVeil(
  ctx: CanvasRenderingContext2D,
  b: Board,
  logo: Logo | null,
  p: number,
  reduce: boolean,
) {
  ctx.clearRect(0, 0, b.w, b.h);
  if (p <= PHASE.flip[0]) return;
  if (reduce) {
    drawReduced(ctx, b, logo, p);
    return;
  }
  drawTiles(ctx, b, p);

  const a = seg(p, PHASE.assemble[0], PHASE.assemble[1]);
  if (!logo || a <= 0) return;
  drawParticles(ctx, b, logo, a, easeInOutCubic(seg(p, PHASE.shift[0], PHASE.shift[1])), a >= 1);
}
