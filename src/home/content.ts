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

/** About panel copy, verbatim from v2's IntroSection (docs/las-handoff.md §3). */
export const ABOUT = {
  /** decorative corner words, top-left and bottom-right */
  corners: ["ABOUT", "US"],
  title: "关于我们",
  body: [
    "Lazy Alien Server简称LAS~是以学生群体为主的技术交流向Minecraft服务器。",
    "我们充分鼓励技术探索与交流，并欢迎有能力的玩家加入。",
    "我们为成员提供强大的硬件支持，依托于高性能物理机和完善的存储与备份方案，我们能够提供充足的性能并保障数据安全。",
    "除此之外，我们还设有开发团队，并有多个自主开发的模组和插件。",
  ],
} as const;
