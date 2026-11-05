import * as m from "motion/react-m";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionStyle } from "motion/react";
import type { PointerEvent } from "react";
import { useRef, useState } from "react";
import { About } from "./About.tsx";
import s from "./Home.module.css";
import { AT, FOLLOW, rise, settle, unfold, useIntro, wipe } from "./motion.ts";
import { Meta } from "./Meta.tsx";
import { Rail } from "./Rail.tsx";
import { StageNav } from "./StageNav.tsx";
import { Veil } from "./Veil.tsx";
import { TRACK_SCROLL, UPTIME, UPTIME_START, easeInOutCubic } from "./scroll.ts";
import { PHASE } from "./transition.ts";
import { UptimeSection } from "./UptimeSection.tsx";
import { Wordmark } from "./Wordmark.tsx";

/** Max backdrop shift in px at the viewport edge, opposite to the pointer. */
const PARALLAX = { x: 18, y: 12 };

/** Smooths wheel steps so the scrubbed transition glides instead of jumping. */
const SCRUB = { stiffness: 140, damping: 30, restDelta: 0.0005 } as const;

const CORNERS = [
  { letter: "L", className: s.cornerL, from: "110%", at: AT.corners },
  { letter: "A", className: s.cornerA, from: "-110%", at: AT.corners + 0.08 },
  { letter: "S", className: s.cornerS, from: "110%", at: AT.corners + 0.16 },
];

/**
 * Homepage: a white card over the full-bleed build screenshot, pinned while
 * the page scrolls through a tall track. The track's scroll progress is
 * split into segments (scroll.ts): the first scrubs the transition to the
 * about panel (transition.ts), the second lifts that panel away, dims the
 * photo, and builds the uptime layout directly on it, with no card. Mouse
 * position (normalized to -1..1) drives backdrop parallax, wordmark shear,
 * and the circles sliding along the rail; touch and reduced motion leave
 * those still.
 */
export function Home() {
  const reduce = useReducedMotion();
  const intro = useIntro();
  const [loaded, setLoaded] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, SCRUB);
  const track = reduce ? scrollYProgress : smooth;
  const about = useTransform(track, [0, UPTIME_START], [0, 1]);
  const uptimeProgress = useTransform(track, [UPTIME_START, 1], [0, 1]);
  const cue = useTransform(about, [0, 0.03], [1, 0]);
  // the about card leaves upward: 0 in place, 1 fully above the viewport
  const lift = useTransform(uptimeProgress, [...UPTIME.lift], [0, 1], { ease: easeInOutCubic });
  const leave = useTransform(lift, [0, 1], [1, 0]);
  const shade = useTransform(uptimeProgress, [...UPTIME.shade], [0, 1]);
  // once the blue panel covers the hero, its links leave the tab order
  const [covered, setCovered] = useState(false);
  useMotionValueEvent(about, "change", (v) => setCovered(v >= PHASE.covered));

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, FOLLOW);
  const sy = useSpring(py, FOLLOW);
  const bgX = useTransform(sx, (v) => v * -PARALLAX.x);
  const bgY = useTransform(sy, (v) => v * -PARALLAX.y);
  const follow = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    px.set((event.clientX / window.innerWidth) * 2 - 1);
    py.set((event.clientY / window.innerHeight) * 2 - 1);
  };
  const release = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <main ref={trackRef} className={s.track} style={{ height: `${100 + TRACK_SCROLL}svh` }}>
      <div className={s.stage} onPointerMove={follow} onPointerLeave={release}>
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
        <m.div className={s.shade} style={{ opacity: shade }} aria-hidden="true" />

        <m.div
          className={`${s.frame} ${s.card} ${s.lift}`}
          style={reduce ? { opacity: leave } : ({ "--lift": lift } as MotionStyle)}
          variants={unfold}
          initial={intro}
          animate="show"
        >
          <div className={s.board}>
            <div className={s.hero} inert={covered}>
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
            <Veil progress={about} />
            <About progress={about} />
          </div>
        </m.div>

        <UptimeSection progress={uptimeProgress} pointer={{ x: sx, y: sy }} />

        <m.div className={s.cue} style={{ opacity: cue }} aria-hidden="true">
          SCROLL
          <span className={s.cueLine} />
        </m.div>
      </div>
    </main>
  );
}
