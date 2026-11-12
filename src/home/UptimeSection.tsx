import { AnimatePresence, useReducedMotion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { Clock } from "./Clock.tsx";
import { FOUNDED, UPTIME_COPY } from "./content.ts";
import s from "./Home.module.css";
import { EASE } from "./motion.ts";
import { UPTIME, useGrow, useRise } from "./scroll.ts";
import { pad, uptime, useNow, yearOf, yearStart } from "./time.ts";
import u from "./Uptime.module.css";

/**
 * One digit in a fixed-width mask; a changed value rolls in from below while
 * the old one leaves upward. An invisible `0` sizes the mask (tabular
 * figures, so every digit has its width).
 */
function Digit({ value }: { value: string }) {
  return (
    <span className={u.digit}>
      <span className={u.sizer}>0</span>
      <AnimatePresence initial={false}>
        <m.span
          key={value}
          className={u.digitFace}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

const Digits = ({ value }: { value: string }) =>
  value.split("").map((d, i) => <Digit key={i} value={d} />);

/** Block that slides into its mask at `at` in the segment's progress. */
function Rise({
  progress,
  at,
  className,
  children,
}: {
  progress: MotionValue<number>;
  at: number;
  className: string;
  children: ReactNode;
}) {
  return (
    <div className={`${u.mask} ${className}`}>
      <m.div style={useRise(progress, at)}>{children}</m.div>
    </div>
  );
}

/**
 * Founding-to-now line: a tick at each 1 January (UTC+8), a blue square at
 * the founding date, and a blue bar over the current year so far.
 */
function Timeline({ progress, now }: { progress: MotionValue<number>; now: number }) {
  const span = now - FOUNDED;
  const at = (time: number) => `${((time - FOUNDED) / span) * 100}%`;
  const years: number[] = [];
  for (let y = yearOf(FOUNDED) + 1; y <= yearOf(now); y++) years.push(y);
  const marks = useTransform(progress, [...UPTIME.marks], [0, 1]);
  const rule = useGrow(progress, UPTIME.line);
  const bar = useGrow(progress, UPTIME.bar);

  return (
    <div className={u.line} aria-hidden="true">
      <m.span className={u.lineRule} style={rule} />
      <m.span className={u.lineBar} style={{ left: at(yearStart(yearOf(now))), ...bar }} />
      <m.div className={u.lineMarks} style={{ opacity: marks }}>
        <span className={u.lineStart} />
        <span className={u.lineFounded}>{UPTIME_COPY.founded}</span>
        <span className={u.lineNow}>{UPTIME_COPY.now}</span>
        {years.map((y) => (
          <span key={y} className={u.lineYear} style={{ left: at(yearStart(y)) }}>
            {y}
          </span>
        ))}
      </m.div>
    </div>
  );
}

/**
 * Decorative grid on the photo: a white rule across the stage under the
 * layout, a white double rule down it right of the readout (drawing toward
 * each other, like the hero rail), two blue rules framing the clock (one
 * across above it, one down between it and the readout), and v2's timer
 * slogan under the white rule.
 */
function Grid({ progress }: { progress: MotionValue<number> }) {
  const across = useGrow(progress, UPTIME.grid);
  const acrossTop = useGrow(progress, UPTIME.gridTop);
  const split = useGrow(progress, UPTIME.split, "y");
  const down = useGrow(progress, UPTIME.rail1, "y");
  const up = useGrow(progress, UPTIME.rail2, "y");
  const [en, cn] = UPTIME_COPY.dream;
  return (
    <div aria-hidden="true">
      {/* blue first: the white rules paint over them where they cross */}
      <m.span className={`${u.grid} ${u.gridH} ${u.gridBlue} ${u.gridTop}`} style={acrossTop} />
      <m.span className={`${u.grid} ${u.gridV} ${u.gridBlue} ${u.gridSplit}`} style={split} />
      <m.span className={`${u.grid} ${u.gridH}`} style={across} />
      <m.span className={`${u.grid} ${u.gridV} ${u.gridV1}`} style={down} />
      <m.span className={`${u.grid} ${u.gridV} ${u.gridV2}`} style={up} />
      <Rise progress={progress} at={UPTIME.dream} className={u.dreamEn}>
        {en}
      </Rise>
      <Rise progress={progress} at={UPTIME.dream + 0.04} className={u.dreamCn}>
        {cn}
      </Rise>
    </div>
  );
}

/**
 * Foreground parallax: three layers follow the pointer (the backdrop moves
 * the other way, see Home.tsx), farther for nearer ones: the grid, the
 * clock, and the readout on the right (days, h/m/s, timeline) as one panel.
 * `SHIFT` is the shift in px at the viewport edge for depth 1.
 */
const SHIFT = { x: 24, y: 16 };
const DEPTH = { grid: 0.3, clock: 0.55, panel: 1 } as const;

/** Mouse position (normalized -1..1, spring-smoothed), from Home. */
export type Pointer = { x: MotionValue<number>; y: MotionValue<number> };

function Layer({
  pointer,
  depth,
  children,
}: {
  pointer: Pointer;
  depth: number;
  children: ReactNode;
}) {
  const x = useTransform(pointer.x, (v) => v * SHIFT.x * depth);
  const y = useTransform(pointer.y, (v) => v * SHIFT.y * depth);
  return (
    <m.div className={u.layer} style={{ x, y }}>
      {children}
    </m.div>
  );
}

/**
 * Uptime layout, set straight on the dimmed photo with no card: the UTC+8
 * clock on the left; beside it, the running time since the founding date
 * and the founding-to-now timeline. It shares the cards' frame, so it lines
 * up with where the about panel was. It paints above the hero/about card,
 * so it stays hidden until that card has lifted clear.
 */
export function UptimeSection({
  progress,
  pointer,
}: {
  progress: MotionValue<number>;
  pointer: Pointer;
}) {
  const reduce = useReducedMotion();
  const now = useNow();
  const { days, hours, minutes, seconds } = uptime(now);
  const { units } = UPTIME_COPY;

  // reduced motion: the whole layout fades in over the lift instead
  const show = useTransform(
    progress,
    reduce ? [UPTIME.lift[0], UPTIME.show] : [UPTIME.show - 0.005, UPTIME.show],
    [0, 1],
  );

  return (
    <m.section
      className={`${s.frame} ${u.section}`}
      style={{ opacity: show }}
      aria-labelledby="uptime-title"
    >
      <div className={u.board}>
        {/* the section's name for assistive tech; the layout itself carries no title */}
        <h2 id="uptime-title" className={u.srOnly}>
          {UPTIME_COPY.title}
        </h2>
        <p className={u.srOnly}>
          {`自 ${UPTIME_COPY.founded} 起已运行 ${days} ${units.days} ${hours} ${units.hours} ${minutes} ${units.minutes} ${seconds} ${units.seconds}`}
        </p>

        <Layer pointer={pointer} depth={DEPTH.grid}>
          <Grid progress={progress} />
        </Layer>

        <Layer pointer={pointer} depth={DEPTH.clock}>
          <div className={u.clockBox}>
            <Clock progress={progress} />
          </div>
        </Layer>

        <Layer pointer={pointer} depth={DEPTH.panel}>
          <Rise progress={progress} at={UPTIME.days} className={u.daysMask}>
            <p className={u.days} aria-hidden="true">
              <Digits value={String(days)} />
              <span className={u.daysUnit}>{units.days}</span>
            </p>
          </Rise>
          <Rise progress={progress} at={UPTIME.hms} className={u.hmsMask}>
            <p className={u.hms} aria-hidden="true">
              {(
                [
                  [hours, units.hours],
                  [minutes, units.minutes],
                  [seconds, units.seconds],
                ] as const
              ).map(([value, unit]) => (
                <span key={unit} className={u.hmsGroup}>
                  <Digits value={pad(value)} />
                  <span className={u.hmsUnit}>{unit}</span>
                </span>
              ))}
            </p>
          </Rise>
          <Timeline progress={progress} now={now} />
        </Layer>
      </div>
    </m.section>
  );
}
