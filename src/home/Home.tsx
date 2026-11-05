import * as m from "motion/react-m";
import { useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { useState } from "react";
import s from "./Home.module.css";
import { AT, FOLLOW, rise, settle, unfold, useIntro, wipe } from "./motion.ts";
import { Meta } from "./Meta.tsx";
import { Rail } from "./Rail.tsx";
import { StageNav } from "./StageNav.tsx";
import { Wordmark } from "./Wordmark.tsx";

/** Max backdrop shift in px at the viewport edge, opposite to the pointer. */
const PARALLAX = { x: 18, y: 12 };

const CORNERS = [
  { letter: "L", className: s.cornerL, from: "110%", at: AT.corners },
  { letter: "A", className: s.cornerA, from: "-110%", at: AT.corners + 0.08 },
  { letter: "S", className: s.cornerS, from: "110%", at: AT.corners + 0.16 },
];

/**
 * Single-screen homepage: a white card over the full-bleed build screenshot.
 * Mouse position (normalized to -1..1) drives backdrop parallax, wordmark
 * shear, and the circles sliding along the rail; touch and reduced motion
 * leave everything still.
 */
export function Home() {
  const reduce = useReducedMotion();
  const intro = useIntro();
  const [loaded, setLoaded] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, FOLLOW);
  const sy = useSpring(py, FOLLOW);
  const bgX = useTransform(sx, (v) => v * -PARALLAX.x);
  const bgY = useTransform(sy, (v) => v * -PARALLAX.y);

  const track = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    px.set((event.clientX / window.innerWidth) * 2 - 1);
    py.set((event.clientY / window.innerHeight) * 2 - 1);
  };
  const release = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <main className={s.stage} onPointerMove={track} onPointerLeave={release}>
      {/* scaled past the viewport so parallax never exposes an edge */}
      <m.div className={s.backdrop} style={{ x: bgX, y: bgY, scale: 1.06 }}>
        <m.img
          src="/hero.webp"
          alt="LAS survival build — gothic hall"
          fetchPriority="high"
          decoding="async"
          variants={settle}
          initial={intro}
          animate={loaded ? "show" : "hidden"}
          onLoad={() => setLoaded(true)}
        />
      </m.div>

      <m.div className={s.card} variants={unfold} initial={intro} animate="show">
        <div className={s.board}>
          <m.span
            role="img"
            aria-label="LAS logo"
            className={s.logo}
            variants={wipe}
            custom={{ at: AT.corners - 0.1, from: "inset(0% 100% 0% 0%)" }}
            initial={intro}
            animate="show"
          />

          {CORNERS.map(({ letter, className, from, at }) => (
            <span key={letter} aria-hidden="true" className={`${s.corner} ${className}`}>
              <m.span
                className={s.rise}
                variants={rise}
                custom={{ at, from }}
                initial={intro}
                animate="show"
              >
                {letter}
              </m.span>
            </span>
          ))}

          <Rail sy={sy} />
          <Wordmark sx={sx} />
          <StageNav />
          <Meta />
        </div>
      </m.div>
    </main>
  );
}
