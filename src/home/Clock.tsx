import { useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { UPTIME_COPY } from "./content.ts";
import { UPTIME, easeInOutCubic, easeOutCubic, seg } from "./scroll.ts";
import { UTC8 } from "./time.ts";
import u from "./Uptime.module.css";

/**
 * The seconds hand ticks once a second: it rests on each second mark and
 * snaps to the next one over the first `TICK_MS` of the second (instantly
 * under reduced motion). The minute hand jumps once a minute.
 */
const TICK_MS = 150;

const TICKS = Array.from({ length: 60 }, (_, i) => i);

/**
 * Analog clock on UTC+8 in the Swiss railway clock's geometry, drawn in
 * lines only for the dark photo: a hairline ring, bar ticks, tapered white
 * hands, and a plain blue seconds hand. One rAF loop writes the
 * hand angles and the build-in state (ring drawing from 12, ticks appearing
 * clockwise, hands sweeping from 12 to the time) straight to the DOM, so
 * nothing re-renders per frame.
 */
export function Clock({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const face = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const hands = useRef<SVGGElement>(null);
  const hour = useRef<SVGGElement>(null);
  const minute = useRef<SVGGElement>(null);
  const second = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    const turn = (el: SVGGElement | null, deg: number) =>
      el?.setAttribute("transform", `rotate(${deg} 50 50)`);

    const frame = () => {
      const t = progress.get();
      const sweep = reduce ? 1 : easeInOutCubic(seg(t, UPTIME.sweep[0], UPTIME.sweep[1]));
      const draw = reduce ? 1 : easeOutCubic(seg(t, UPTIME.ring[0], UPTIME.ring[1]));
      // a finished ring drops its dash so no seam shows at 12
      ring.current?.style.setProperty("stroke-dasharray", draw >= 1 ? "none" : "1");
      ring.current?.style.setProperty("stroke-dashoffset", String(1 - draw));
      face.current?.style.setProperty(
        "--ticks",
        String(reduce ? 1 : seg(t, UPTIME.ticks[0], UPTIME.ticks[1])),
      );
      // hands stay hidden until they start sweeping away from 12
      hands.current?.style.setProperty(
        "opacity",
        String(reduce ? 1 : seg(t, UPTIME.sweep[0], UPTIME.sweep[0] + 0.03)),
      );

      const now = Date.now() + UTC8;
      const ms = now % 60_000;
      const minutes = Math.floor((now % 3_600_000) / 60_000);
      const hours = Math.floor((now % 43_200_000) / 3_600_000);
      // seconds since the last mark; the snap runs from the previous mark to this one
      const snap = reduce ? 1 : easeOutCubic(Math.min((ms % 1000) / TICK_MS, 1));
      const secondDeg = (Math.floor(ms / 1000) - 1 + snap) * 6;
      turn(hour.current, (hours + minutes / 60) * 30 * sweep);
      turn(minute.current, minutes * 6 * sweep);
      turn(second.current, secondDeg * sweep);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [progress, reduce]);

  return (
    <div ref={face} className={u.clock} role="img" aria-label={`${UPTIME_COPY.zone} 时钟`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {/* rotated so the ring draws clockwise from 12 */}
        <circle
          ref={ring}
          className={u.ring}
          cx="50"
          cy="50"
          r="49.5"
          pathLength="1"
          transform="rotate(-90 50 50)"
        />
        {TICKS.map((i) => (
          <rect
            key={i}
            className={u.tick}
            style={{ "--i": i } as CSSProperties}
            {...(i % 5 === 0
              ? { x: 48.4, y: 4, width: 3.2, height: 11 }
              : { x: 49.45, y: 4, width: 1.1, height: 4 })}
            transform={`rotate(${i * 6} 50 50)`}
          />
        ))}
        <text className={u.zone} x="50" y="73">
          {UPTIME_COPY.zone}
        </text>
        <g ref={hands}>
          <g ref={hour}>
            <polygon className={u.hand} points="46.8,60 53.2,60 52.6,18 47.4,18" />
          </g>
          <g ref={minute}>
            <polygon className={u.hand} points="47.4,62 52.6,62 51.8,6 48.2,6" />
          </g>
          <g ref={second} className={u.second}>
            <rect x="49.4" y="16" width="1.2" height="50" />
          </g>
        </g>
      </svg>
    </div>
  );
}
