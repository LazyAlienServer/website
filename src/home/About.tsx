import { useReducedMotion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { ABOUT } from "./content.ts";
import s from "./Home.module.css";
import { easeOutCubic } from "./scroll.ts";
import { PHASE } from "./transition.ts";

/** Gap between consecutive line starts, and each line's own length, in scroll progress. */
const LINE = { gap: 0.022, span: 0.07 };

/** Start of slot `index` in the copy sequence. */
const slot = (index: number) => PHASE.copy + index * LINE.gap;

/** Corner rows: each rule grows out from its word toward the card edge, in scroll progress. */
const RULE = { span: 0.1 };

/**
 * One block sliding into its mask as scroll progress passes `at`; `from`
 * is the start offset (negative drops in from above).
 */
function Reveal({
  progress,
  at,
  from = "105%",
  className,
  children,
}: {
  progress: MotionValue<number>;
  at: number;
  from?: string;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const range = [at, at + LINE.span];
  const y = useTransform(progress, range, [from, "0%"], { ease: easeOutCubic });
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <div className={`${s.aboutMask} ${className ?? ""}`}>
      <m.div style={reduce ? { opacity } : { y }}>{children}</m.div>
    </div>
  );
}

/** Hairline that grows along its `transform-origin` (set per row in CSS). */
function Rule({
  progress,
  at,
  className,
}: {
  progress: MotionValue<number>;
  at: number;
  className: string;
}) {
  const reduce = useReducedMotion();
  const range = [at, at + RULE.span];
  const scaleX = useTransform(progress, range, [0, 1], { ease: easeOutCubic });
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <m.span className={`${s.aboutRule} ${className}`} style={reduce ? { opacity } : { scaleX }} />
  );
}

/**
 * About panel content: the two corner rows (decorative, the h2 names the
 * section) and the about text beside the particle logo. Top row: ABOUT and
 * a rule running right to the edge; bottom row: a rule running left from US.
 */
export function About({ progress }: { progress: MotionValue<number> }) {
  const topRule = slot(0.5);
  const bottomRule = slot(3.5);
  return (
    <>
      <div className={`${s.aboutRow} ${s.aboutRowTop}`} aria-hidden="true">
        <Reveal progress={progress} at={slot(0)} from="-105%" className={s.aboutCorner}>
          {ABOUT.corners[0]}
        </Reveal>
        <Rule progress={progress} at={topRule} className={s.aboutRuleTop} />
      </div>
      <div className={`${s.aboutRow} ${s.aboutRowBottom}`} aria-hidden="true">
        <Rule progress={progress} at={bottomRule} className={s.aboutRuleBottom} />
        <Reveal progress={progress} at={slot(3)} className={s.aboutCorner}>
          {ABOUT.corners[1]}
        </Reveal>
      </div>

      <section className={s.about} aria-labelledby="about-title">
        <Reveal progress={progress} at={slot(0)}>
          <h2 id="about-title" className={s.aboutTitle}>
            {ABOUT.title}
          </h2>
        </Reveal>
        {ABOUT.body.map((paragraph, i) => (
          <Reveal key={paragraph} progress={progress} at={slot(1 + i)} className={s.aboutBodyMask}>
            <p className={s.aboutBody}>{paragraph}</p>
          </Reveal>
        ))}
      </section>
    </>
  );
}
