# Project Introduction

LASweb-v2 is the official website for Lazy Alien Server (LAS), a Chinese Minecraft server organization focused on student-led technical exchange. The site presents LAS's community, founding timeline, infrastructure, open-source projects, administration team, and joining information, with a separate rules page.

## Architecture

- Vue 3 application using Composition API and `<script setup lang="ts">`.
- TypeScript for application logic, SCSS for styling, and Vite+ for development, builds, checking, and package management.
- `src/views/` contains route-level pages: `HomePage.vue` composes the landing-page sections, `RulesPage.vue` renders the rules data, `GalleryPage.vue` the image archive, `MapPage.vue` embeds the BlueMap server map full screen (styled by `public/bluemap/las.css`, loaded on the BlueMap side), and `StatusPage.vue` shows each access route's reachability (both linked from the navbar's 更多 panel).
- `src/components/` contains reusable landing-page sections and interactive modules such as the live timer, tech support bento tiles, GitHub project listing, and join flow.
- `src/data/rules.ts` is the source of truth for the rules page; `src/styles/` contains shared design tokens and global industrial UI styles.
- `src/router/index.ts` defines the `/`, `/rules`, `/gallery`, `/map`, and `/status` routes. The `@` alias resolves to `src/`.
- `worker/index.ts` is the Cloudflare Worker: a 10-minute cron checks each route in the `STATUS_ROUTES` secret (JSON array of named groups, each a list of routes with a `name`, a `host:port` `target`, and an optional failover `dns` hostname) and keeps uptime counts in the `STATUS_DB` D1 database. Plain routes are tcpinged (retried up to 3 times); `dns` routes are online while their IP is among the hostname's A records, read from its authoritative nameservers over TCP. `GET /api/status` (the only `/api/*` route; static assets serve everything else) returns names, up/down, and hourly and daily counts only, so server addresses never reach the browser. Local values live in the gitignored `.dev.vars`; never commit addresses.

Detailed runtime boundaries, state ownership, data flows, and modification entry points are documented in [architecture.md](architecture.md).

## Product and Design Context

The visual language is neo-industrial and technological: blue and black are primary colors, white is used for contrast, and interfaces use panels, grid lines, status indicators, clipped corners, and restrained motion. Preserve the existing Chinese-language content and responsive behavior when changing UI. Respect `prefers-reduced-motion` and keep interactive controls keyboard-accessible.

Themes: dark (default) and light, switched in the navbar (default follows the system). Light follows the Endfield site (endfield.hypergryph.com): white ground, `#f2f2f2` panels, `#010101` ink, industrial yellow `#fffa00`, and a section rhythm that is not all white: the navbar is `#f2f2f2`, the scroll tickers are yellow bands with black type, the timer and hardware sections form a dark block, the admin section is a gray band with borderless white cards, the join group zone is a translucent (50%) yellow panel with a black button, and the footer is dark. Colors are role tokens (`$color-fg`, `$color-accent`, `$color-accent-ink`, …; see `src/styles/variables.scss`), never raw hues: dark must stay unchanged when light changes. In light, yellow is only a fill on white — surfaces carrying black text, selected states, bands and bars at least 6px thick; brand text, thin lines, dots, and focus rings are black ink. Dark sections use the `dark-surface` mixin, where yellow is the brand ink. Light-only fixes go in `@include light { … }`.

Tilt rule: every slanted mark, edge, or panel uses the hero split-line angle, never a hand-picked degree. The angle is the shared `--hero-slant` (with `--hero-slant-tan`) defined in `src/styles/global.scss`. It is computed from the hero image's clipped left edge, so it follows the viewport. Apply it as `transform: skewX(calc(-1 * var(--hero-slant)))` so slants lean like `/`. For a slanted edge on one side only, skew a background pseudo-element and clip it with `overflow: hidden` rather than hard-coding a pixel offset in `clip-path`. Out of scope: 45° corner chamfers (`clipped-panel`), diagonal hatch patterns, rotations (clock hands, arrows, vertical labels), and the hero seam itself.

Typography rule: use only the four weight tokens (`$font-weight-regular`, `-medium`, `-bold`, `-black`) and never introduce another weight. Text below body size (16px) uses exactly two size tokens: `$font-size-small` (14px: secondary copy, descriptions, nav links, notes, small controls) and `$font-size-label` (12px: keys, plates, badges, indices, counts, HUD readouts, metadata); never write a raw size under 16px and never scale small text with the viewport (exceptions: decorative glyph art and the clamp minimum of fluid display sizes). The “all caps + small type + wide letter-spacing” label pattern is prohibited: small labels use normal case and no tracking. Uppercase is reserved for brand wordmarks and oversized display type. Em dashes and centered dots are not used in interface copy; separate labels with layout (gaps, rules, or separate lines) instead.

## Important Rules

- Do not perform browser-based verification or use browser tooling unless the user explicitly asks for it.

## Working Notes

- The homepage fetches and caches the six most-starred repositories from the LazyAlienServer GitHub organization at runtime.
- The founding date used by the live timer is 2022-08-29.
- Images and logos are available under `public/`, `src/assets/`, and `.design/`; reuse existing assets and patterns before adding new ones.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
