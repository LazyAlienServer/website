import { useEffect, useState } from "react";
import { FOUNDED } from "./content.ts";

export const pad = (n: number) => String(n).padStart(2, "0");

/** LAS keeps UTC+8 time: the founding instant, year boundaries, and the clock. */
export const UTC8 = 8 * 3_600_000;

export type Uptime = { days: number; hours: number; minutes: number; seconds: number };

/** Whole days since `FOUNDED`, then the time within the current day. */
export const uptime = (now: number): Uptime => {
  const total = Math.max(0, Math.floor((now - FOUNDED) / 1000));
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
};

/** Start of 1 January of `year`, UTC+8, as a timestamp. */
export const yearStart = (year: number) => Date.UTC(year, 0, 1) - UTC8;

/** Calendar year of `time` in UTC+8. */
export const yearOf = (time: number) => new Date(time + UTC8).getUTCFullYear();

/**
 * Current time, re-rendering on each whole second. Ticks are aligned to the
 * second boundary, so every counter on the page changes together.
 */
export function useNow(): number {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const delay = () => 1000 - (Date.now() % 1000);
    const tick = () => {
      setNow(Date.now());
      id = window.setTimeout(tick, delay());
    };
    let id = window.setTimeout(tick, delay());
    return () => window.clearTimeout(id);
  }, []);
  return now;
}
