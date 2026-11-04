import { useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";

/** Expo-out: fast start, long settle. Every intro tween uses it. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Intro timeline, in seconds from mount. Blocks are ordered by dependency:
 * the card opens over the backdrop, the rail draws on the opening card and
 * the band hairlines branch off it, then type and controls land once the
 * structure is in place, and the small info text settles last. Retime here
 * only.
 */
export const AT = {
  card: 0.2,
  rail: 0.95,
  title: 1.05,
  bands: 1.2,
  nav: 1.3,
  circles: 1.35,
  corners: 1.55,
  meta: 1.7,
} as const;

/** Pointer follow for parallax and drift; mouse only (see `Home`). */
export const FOLLOW = { stiffness: 60, damping: 20, mass: 0.6 } as const;

const tween = (delay: number, duration: number): Transition => ({
  delay,
  duration,
  ease: EASE,
});

/**
 * `false` when the user prefers reduced motion, so `initial={useIntro()}`
 * renders every element in its final state with no intro.
 */
export const useIntro = (): false | "hidden" => (useReducedMotion() ? false : "hidden");

/** Slides content into its `overflow: hidden` mask; `from` is the start offset. */
export type Rise = { at: number; from: string };

export const rise: Variants = {
  hidden: ({ from }: Rise) => ({ y: from }),
  show: ({ at }: Rise) => ({ y: "0%", transition: tween(at, 1.1) }),
};

/** Reveals by animating `clip-path` from `from` to fully open. */
export type Wipe = { at: number; from: string };

export const wipe: Variants = {
  hidden: ({ from }: Wipe) => ({ clipPath: from }),
  show: ({ at }: Wipe) => ({ clipPath: "inset(0% 0% 0% 0%)", transition: tween(at, 0.9) }),
};

/** Draws a rail line along its `transform-origin` (set in CSS). */
export const draw: Variants = {
  hidden: { scaleY: 0 },
  show: (at: number) => ({ scaleY: 1, transition: tween(at, 1.2) }),
};

/** Grows a hairline along its `transform-origin` (set in CSS). */
export const extend: Variants = {
  hidden: { scaleX: 0 },
  show: (at: number) => ({ scaleX: 1, transition: tween(at, 1.2) }),
};

/** Traces an SVG stroke from its path start. */
export const trace: Variants = {
  hidden: { pathLength: 0 },
  show: (at: number) => ({ pathLength: 1, transition: tween(at, 1.4) }),
};

/**
 * The card opens as a white line drawn across the screen, which then
 * parts vertically into the full card.
 */
export const unfold: Variants = {
  hidden: { clipPath: "inset(50% 50% 50% 50%)" },
  show: {
    clipPath: ["inset(50% 50% 50% 50%)", "inset(49.8% 0% 49.8% 0%)", "inset(0% 0% 0% 0%)"],
    transition: { delay: AT.card, duration: 1.4, times: [0, 0.4, 1], ease: [EASE, EASE] },
  },
};

/** Backdrop settles from a slow zoom once the image has loaded. */
export const settle: Variants = {
  hidden: { opacity: 0, scale: 1.18 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 2, ease: EASE, opacity: { duration: 0.8, ease: "linear" } },
  },
};
