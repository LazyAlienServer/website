import * as m from "motion/react-m";
import { META_BOTTOM, META_TOP } from "./content.ts";
import type { MetaItem } from "./content.ts";
import s from "./Home.module.css";
import { AT, useIntro, wipe } from "./motion.ts";
import { pad, uptime, useNow } from "./time.ts";

/** `1528D 04:12:33`: whole days, then the time within the current day. */
function Uptime() {
  const { days, hours, minutes, seconds } = uptime(useNow());
  return `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
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
