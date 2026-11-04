import { useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import logoUrl from "../assets/logo.svg";
import s from "./Home.module.css";
import { boardFor, drawVeil, sampleLogo } from "./transition.ts";
import type { Logo } from "./transition.ts";

// sampled once per page load; the logo never changes
let logoSample: Promise<Logo> | undefined;

/** Canvas over the card that draws the scroll transition (see transition.ts). */
export function Veil({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let board = boardFor(canvas.clientWidth, canvas.clientHeight);
    let logo: Logo | null = null;
    let alive = true;
    const render = () => drawVeil(ctx, board, logo, progress.get(), reduce);

    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      board = boardFor(width, height);
      render();
    });
    resize.observe(canvas);

    logoSample ??= sampleLogo(logoUrl);
    void logoSample.then((sample) => {
      if (!alive) return;
      logo = sample;
      render();
    });

    const stop = progress.on("change", render);
    return () => {
      alive = false;
      resize.disconnect();
      stop();
    };
  }, [progress, reduce]);

  return <canvas ref={ref} className={s.veil} aria-hidden="true" />;
}
