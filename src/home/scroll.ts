import { useReducedMotion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

/**
 * The pinned scroll track is split into consecutive segments, each with its
 * own 0–1 progress. Lengths are scroll distance in svh; the track is one
 * screen taller than their sum (Home.tsx).
 *
 *   about   hero card → blue about panel (transition.ts `PHASE`)
 *   uptime  about panel lifts away → uptime layout on the photo (`UPTIME`)
 */
export const SEGMENTS = { about: 150, uptime: 110 } as const;

export const TRACK_SCROLL = SEGMENTS.about + SEGMENTS.uptime;

/** Share of the whole track where the uptime segment starts. */
export const UPTIME_START = SEGMENTS.about / TRACK_SCROLL;

/**
 * Uptime segment timeline, in its own progress. The about card lifts away
 * while the photo dims; once it has cleared, the uptime layout builds on
 * the photo: grid rules draw across and down the stage, clock ring draws,
 * ticks appear clockwise, hands sweep from 12 to the time; days, h/m/s;
 * then the timeline, and the slogan under the grid rule.
 */
export const UPTIME = {
  lift: [0.04, 0.34],
  shade: [0.04, 0.34],
  /** the layout is hidden until the card has cleared it (it paints above the card) */
  show: 0.34,
  grid: [0.34, 0.52],
  gridTop: [0.34, 0.52],
  split: [0.38, 0.58],
  rail1: [0.36, 0.56],
  rail2: [0.4, 0.6],
  ring: [0.34, 0.54],
  ticks: [0.4, 0.6],
  sweep: [0.46, 0.7],
  days: 0.38,
  hms: 0.46,
  line: [0.52, 0.68],
  marks: [0.62, 0.72],
  bar: [0.66, 0.78],
  dream: 0.6,
} as const;

/** Length of one rise-in-mask, in segment progress. */
export const RISE_SPAN = 0.1;

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Style for content sliding into an `overflow: hidden` mask between `at`
 * and `at + span`; `from` is the start offset (negative drops in from
 * above). Under reduced motion it fades instead.
 */
export function useRise(
  progress: MotionValue<number>,
  at: number,
  span = RISE_SPAN,
  from = "105%",
) {
  const reduce = useReducedMotion();
  const range = [at, at + span];
  const y = useTransform(progress, range, [from, "0%"], { ease: easeOutCubic });
  const opacity = useTransform(progress, range, [0, 1]);
  return reduce ? { opacity } : { y };
}

/**
 * Style for a line growing along its `transform-origin` (`axis` x or y)
 * over `range`. Under reduced motion it fades instead.
 */
export function useGrow(
  progress: MotionValue<number>,
  range: readonly [number, number],
  axis: "x" | "y" = "x",
) {
  const reduce = useReducedMotion();
  const scale = useTransform(progress, [...range], [0, 1], { ease: easeOutCubic });
  const opacity = useTransform(progress, [...range], [0, 1]);
  if (reduce) return { opacity };
  return axis === "x" ? { scaleX: scale } : { scaleY: scale };
}
