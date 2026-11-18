export type NavItem = { label: string; href?: string; current?: boolean };

/**
 * Only HOME has a page so far. Items without `href` render as placeholder
 * links (`<a>` with no `href`): not focusable and not announced as links.
 * Give an item an `href` once its page exists.
 */
export const NAV: readonly NavItem[] = [
  { label: "HOME", href: "/", current: true },
  { label: "RULES" },
  { label: "ALBUM" },
  { label: "MAP" },
  { label: "MORE" },
];

/**
 * Wordmark lines. `indent` is the line's left offset in em (the staggered
 * rag); `drift` scales its horizontal pointer drift, with opposite signs so
 * the lines shear against each other.
 */
export type TitleLine = { text: string; indent: number; drift: number };

export const TITLE: readonly TitleLine[] = [
  { text: "LAZY", indent: 0.214, drift: 1 },
  { text: "ALIEN", indent: 0.738, drift: -0.7 },
  { text: "SERVER", indent: 0, drift: 0.45 },
];

/**
 * Key/value blocks in the top and bottom info bands. Portrait cards show
 * only the first two of each band in narrow columns, so keep those short.
 * `uptime` renders the live running time since `FOUNDED`.
 */
export type MetaItem = { key: string; value: string } | { key: string; uptime: true };

export const META_TOP: readonly MetaItem[] = [
  { key: "EST.", value: "2022.08.29" },
  { key: "UPTIME", uptime: true },
  { key: "COMMUNITY", value: "STUDENT-LED TECH EXCHANGE" },
];

export const META_BOTTOM: readonly MetaItem[] = [
  { key: "MOTTO", value: "与 LAS 的成员们，携手并进" },
  { key: "DOMAIN", value: "LZALIEN.ORG" },
  { key: "SERVER", value: "MINECRAFT TECH SERVER" },
];

/** Uptime origin, the same instant as v2's live timer. */
export const FOUNDED = Date.parse("2022-08-29T00:00:00+08:00");
