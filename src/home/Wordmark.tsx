import * as m from "motion/react-m";
import { useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { TITLE } from "./content.ts";
import type { TitleLine } from "./content.ts";
import s from "./Home.module.css";
import { AT, rise, useIntro } from "./motion.ts";

/** Max horizontal drift in px for a line with `drift: 1`. */
const DRIFT = 14;

function Line({ line, index, sx }: { line: TitleLine; index: number; sx: MotionValue<number> }) {
  const intro = useIntro();
  const x = useTransform(sx, (v) => v * line.drift * DRIFT);

  return (
    <m.span className={s.titleLine} style={{ x, paddingLeft: `${line.indent}em` }}>
      <m.span
        className={s.rise}
        variants={rise}
        custom={{ at: AT.title + index * 0.09, from: "110%" }}
        initial={intro}
        animate="show"
      >
        {/* trailing space keeps the words apart in the accessible name */}
        {`${line.text} `}
      </m.span>
    </m.span>
  );
}

export function Wordmark({ sx }: { sx: MotionValue<number> }) {
  return (
    <h1 className={s.title}>
      {TITLE.map((line, index) => (
        <Line key={line.text} line={line} index={index} sx={sx} />
      ))}
    </h1>
  );
}
