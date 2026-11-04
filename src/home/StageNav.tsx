import * as m from "motion/react-m";
import { NAV } from "./content.ts";
import s from "./Home.module.css";
import { AT, rise, useIntro } from "./motion.ts";

function Arrow() {
  return (
    <svg className={s.arrow} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4 20 20M20 7v13H7" />
    </svg>
  );
}

export function StageNav() {
  const intro = useIntro();
  return (
    <nav className={s.nav} aria-label="主导航">
      <ul className={s.navList}>
        {NAV.map((item, i) => (
          <li key={item.label} className={s.navItem}>
            <m.span
              className={s.rise}
              variants={rise}
              custom={{ at: AT.nav + i * 0.07, from: "105%" }}
              initial={intro}
              animate="show"
            >
              <a
                className={s.navLink}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
                <Arrow />
              </a>
            </m.span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
