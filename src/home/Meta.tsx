import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { FOUNDED, META_BOTTOM, META_TOP } from "./content.ts";
import type { MetaItem } from "./content.ts";
import s from "./Home.module.css";
import { AT, useIntro, wipe } from "./motion.ts";

const pad = (n: number) => String(n).padStart(2, "0");

/** `1528D 04:12:33`: whole days, then the time within the current day. */
const formatUptime = (now: number) => {
  const total = Math.max(0, Math.floor((now - FOUNDED) / 1000));
  const days = Math.floor(total / 86_400);
  const hours = Math.floor(total / 3600) % 24;
  const minutes = Math.floor(total / 60) % 60;
  return `${days}D ${pad(hours)}:${pad(minutes)}:${pad(total % 60)}`;
};

function Uptime() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return formatUptime(now);
}

function Band({
  items,
  className,
  at,
  from,
}: {
  items: readonly MetaItem[];
  className: string;
  at: number;
  from: string;
}) {
  const intro = useIntro();
  return (
    <dl className={`${s.meta} ${className}`}>
      {items.map((item, i) => (
        <m.div
          key={item.key}
          className={s.metaItem}
          variants={wipe}
          custom={{ at: at + i * 0.08, from }}
          initial={intro}
          animate="show"
        >
          <dt>{item.key}</dt>
          <dd>{"uptime" in item ? <Uptime /> : item.value}</dd>
        </m.div>
      ))}
    </dl>
  );
}

/** Info text in the top and bottom bands, each block wiping open toward the card edge. */
export function Meta() {
  return (
    <>
      <Band items={META_TOP} className={s.metaTop} at={AT.meta} from="inset(0% 0% 100% 0%)" />
      <Band
        items={META_BOTTOM}
        className={s.metaBottom}
        at={AT.meta + 0.1}
        from="inset(100% 0% 0% 0%)"
      />
    </>
  );
}
