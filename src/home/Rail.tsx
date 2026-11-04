import * as m from "motion/react-m";
import { useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import s from "./Home.module.css";
import { AT, draw, extend, trace, useIntro, wipe } from "./motion.ts";

/** Max vertical slide in px of each circle along the rail. */
const SLIDE = 30;

/** Second circle trails the first, like a bead further down the string. */
const LAG = { stiffness: 40, damping: 14, mass: 0.8 } as const;

function Circle({ className, y, at }: { className: string; y: MotionValue<number>; at: number }) {
  const intro = useIntro();
  return (
    <m.span aria-hidden="true" className={`${s.circle} ${className}`} style={{ y }}>
      <svg viewBox="0 0 100 100">
        {/* start the stroke at 12 o'clock, where the rail enters */}
        <g transform="rotate(-90 50 50)">
          <m.circle
            cx="50"
            cy="50"
            r="49"
            variants={trace}
            custom={at}
            initial={intro}
            animate="show"
          />
        </g>
      </svg>
    </m.span>
  );
}

/**
 * Double vertical rule with two circles threaded on it, plus the two band
 * hairlines that branch right from it. The JOIN US flag hangs left from the
 * rail, MORE hangs right; each flag rides with its circle and wipes open
 * away from the rail.
 */
export function Rail({ sy }: { sy: MotionValue<number> }) {
  const intro = useIntro();
  const lag = useSpring(sy, LAG);
  const y1 = useTransform(sy, (v) => v * SLIDE);
  const y2 = useTransform(lag, (v) => v * SLIDE);

  return (
    <>
      <m.span
        aria-hidden="true"
        className={`${s.rail} ${s.rail1}`}
        variants={draw}
        custom={AT.rail}
        initial={intro}
        animate="show"
      />
      <m.span
        aria-hidden="true"
        className={`${s.rail} ${s.rail2}`}
        variants={draw}
        custom={AT.rail + 0.12}
        initial={intro}
        animate="show"
      />
      {[s.bandTop, s.bandBottom].map((band, i) => (
        <m.span
          key={band}
          aria-hidden="true"
          className={`${s.band} ${band}`}
          variants={extend}
          custom={AT.bands + i * 0.1}
          initial={intro}
          animate="show"
        />
      ))}

      <Circle className={s.c1} y={y1} at={AT.circles} />
      <Circle className={s.c2} y={y2} at={AT.circles + 0.18} />

      {/* placeholder links (no href) until the join and more pages exist */}
      <m.a
        className={`${s.flag} ${s.flag1}`}
        style={{ y: y1 }}
        variants={wipe}
        custom={{ at: AT.circles + 0.55, from: "inset(0% 0% 0% 100%)" }}
        initial={intro}
        animate="show"
      >
        JOIN US
      </m.a>
      <m.a
        className={`${s.flag} ${s.flag2}`}
        style={{ y: y2 }}
        variants={wipe}
        custom={{ at: AT.circles + 0.7, from: "inset(0% 100% 0% 0%)" }}
        initial={intro}
        animate="show"
      >
        MORE
      </m.a>
    </>
  );
}
