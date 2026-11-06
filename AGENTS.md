# Project Introduction

LASweb-v3 is an experimental third version of the website for Lazy Alien Server (LAS), a Chinese Minecraft server organization focused on student-led technical exchange. The production site is LASweb-v2 (`../LASweb-v2`, Vue). v3 explores a motion- and animation-driven design in a modernist, minimalist direction.

All LAS facts (identity, copy, routes, hardware, team, join paths, the full rules text, gallery, assets) are in [docs/las-handoff.md](docs/las-handoff.md), extracted from v2. Use it instead of inventing LAS content; v2 is the source of truth when they disagree.

## Architecture

- React 19 with TypeScript, built and checked with Vite+ (`vp`), pnpm as package manager.
- Motion: `motion` (`motion/react`). Components use `m.*` from `motion/react-m` under `<LazyMotion features={domAnimation} strict>` in `src/App.tsx`; a full `motion.*` component throws at runtime by design. `MotionConfig reducedMotion="user"` wraps the app.
- `src/home/` is the homepage (currently the only page): a pinned stage while the page scrolls, first the hero card, then the about panel, then the uptime layout.
  - `Home.tsx` — scroll track and sticky stage, backdrop and its uptime dim (`.shade`), card, logo, corner letters; owns pointer tracking and scroll progress (split into segments); lifts the card away; makes the hero layer `inert` once the blue panel covers it.
  - `Wordmark.tsx` (`<h1>` LAZY / ALIEN / SERVER), `Rail.tsx` (double rule, band hairlines, circles, JOIN US / MORE flags), `StageNav.tsx` (nav list), `Meta.tsx` (key/value info bands, live uptime).
  - `scroll.ts` — scroll segments (`SEGMENTS`, track length), the uptime segment timeline (`UPTIME`), easing helpers, `useRise` / `useGrow` for scrubbed reveals.
  - `transition.ts` — the about transition as a pure function of progress: `PHASE` ranges, module grid geometry (`boardFor`), logo sampling into particles, `drawVeil`. `Veil.tsx` is the canvas that calls it; `About.tsx` is the about text (DOM) that rises in at the end.
  - `UptimeSection.tsx` (running time, rolling digits, founding-to-now timeline), `Clock.tsx` (UTC+8 clock in Swiss railway clock geometry, hands written per frame), `Uptime.module.css`; `time.ts` — `useNow` (second-aligned), uptime and UTC+8 year helpers.
  - `motion.ts` — the intro timeline (`AT`), easing, shared variants, `useIntro`.
  - `content.ts` — nav items, wordmark lines, info band items, `FOUNDED` (uptime origin), uptime labels, about copy (verbatim from v2).
  - `Home.module.css` — homepage layout; `.frame` is the card-sized box (shared by the card and the uptime layout), `.card` the white surface.
- `src/index.css` — color tokens (`--blue #0f66dd`, `--black`, `--white`, `--ink-mute` for secondary text), `--ease`, font (Noto Sans, Noto Sans SC for Chinese), resets.
- Assets from v2: `public/hero.webp`, `public/floatingcity.webp`, `public/ftl-ender-pearl.webp`, `public/favicon.svg`, `src/assets/logo.svg` (white-filled wordmark, used as a CSS mask so it takes `currentColor`).

## Design Context

Modernism and minimalism: white card over a full-bleed, slightly dimmed build screenshot; bold sans type, rules, circles, solid label blocks. Two colors with fixed roles: blue (`#0f66dd`) is the brand (wordmark, logo, L / A / S, flags, nav arrows and the active or hovered item); black is structure and information (rails, circles, hairlines, nav labels, info text, with `--ink-mute` for keys). No gradients, textures, shadows, or extra hues. Motion carries the expression, not decoration.

The card has a fixed ratio: 2:1 on landscape viewports (`min(80vw, 150svh)` wide), 1:2 on portrait ones. `.board` defines an artboard unit `--u` from the card's container units (`container: card / size`), and every size and offset is a multiple of it, on a 100u module: landscape 1600 × 800, portrait 400 × 800, switched by `@container card (aspect-ratio < 1)`. Landscape grid: left column 0–200 (logo, L), double rail at 200, content to 1400, right column 1400–1600 (A, S); hairlines at 160 and 640 split a top info band, the middle stage (wordmark, nav, circles), and a bottom info band. Change positions through the custom properties on `.board`, keeping both artboards in step. Portrait shows only the first two info blocks of each band.

The uptime layout has no card: it sits on the photo (dimmed further by `.shade`) inside the same frame, so it uses the same artboard. No visible title (the `<h2>` is screen-reader only); the clock sits at the left edge (40u) and the days, h/m/s and timeline form one block (820–1420u) centered on the clock. A decorative grid frames it, at the hero rail's stroke weight: a white rule across the whole stage under the layout (730u), a white double rule down the whole stage right of the readout (1528 / 1552u, the hero rail's gap), two blue rules that frame the clock with the same 50u gap as the white rule below it (across the stage above the dial, bottom edge at 70u; down the stage right of it at 650u, landscape only), and v2's timer slogan (A Realistic Dream. / 做一场现实的梦) under the white rule, one line per column. Lines only for structure (clock ring and ticks, timeline, grid), white figures, and blue as solid blocks (day-unit block, founding square, current-year bar), the two framing rules, and the plain seconds hand. Apart from the slogan, every text labels a value.

## Motion Rules

- The intro is one timeline: retime it only through `AT` in `src/home/motion.ts`. Order: backdrop settles, card unfolds from a horizontal line, rails draw and band hairlines branch off them, then wordmark, nav, circles and flags, corner letters and logo, and the info text last.
- Reveals slide content inside an `overflow: hidden` mask (`rise`) or animate `clip-path` (`wipe`, `unfold`). Masks clip focus outlines, so focus styles inside masks must draw within the box (nav links use an underline).
- Pointer-driven motion (backdrop parallax, wordmark line shear, circles sliding along the rail, uptime foreground layers) reacts to mouse pointers only, through springs; touch input leaves the stage still. The uptime foreground has three layers that follow the pointer by depth (`DEPTH` in `UptimeSection.tsx`): the grid with its slogan, the clock, and the right-hand readout (days, h/m/s, timeline) moving as one panel; the backdrop moves the other way.
- Respect `prefers-reduced-motion`: `useIntro()` returns `initial={false}` so elements render in their final state, pointer tracking is off, and CSS transitions and loops are cut in `src/index.css`. Every new animation must follow the same path.
- Scroll: the track's progress is split into segments (`SEGMENTS` in `scroll.ts`, 150svh about + 110svh uptime; the track is one screen taller, set inline). Progress over the track is smoothed by a spring and mapped to each segment's own 0–1, so every step is a function of progress and reverses on scroll up.
- About segment (`PHASE` in `transition.ts`): each 100u module cell flips once from edge-on to a flat blue face, in a seeded random order with overlapping windows (about 50 tiles mid-turn at once on landscape; random axis and direction per tile), and the panel is covered at 0.40; white particles then appear one by one at scattered points over the first half of the assemble phase (each fading and growing in, then holding briefly) and fly into the sampled logo, the logo shifts left (up on portrait), and the about content rises: two corner rows (top: ABOUT and a rule growing right to the edge; bottom: a rule growing left from US; the words are white at the size and anchors of the hero's L / A / S), the title with one divider under it, and the body. Under reduced motion it is a plain fade of the panel, the logo already in place, and opacity-only text and rules. The logo position in `transition.ts` and the `--about-*` properties in CSS must stay in step.
- Uptime segment (`UPTIME` in `scroll.ts`): the card lifts up out of the viewport while the photo dims; the uptime layout paints above the card, so it stays hidden until the card has cleared (`UPTIME.show`), then builds: the grid rule grows across and the double rule draws down and up, clock ring draws from 12 (its dash is dropped once complete, so no seam shows), ticks appear clockwise, hands sweep from 12 to the time; days, then h/m/s rise; the timeline line grows, its marks fade in, and the current-year bar grows; the slogan rises last. Digits roll on each second. The seconds hand ticks once a second (a 150 ms snap to the next mark, `TICK_MS` in `Clock.tsx`) and the minute hand jumps once a minute. Under reduced motion the card fades out as the layout fades in, the clock is drawn in full with the seconds hand stepping without the snap, and reveals are opacity only.
- Keep interactive controls keyboard-accessible with visible focus.

Typography rule: use only the four weight tokens (`$font-weight-regular`, `-medium`, `-bold`, `-black`) and never introduce another weight. The “all caps + small type + wide letter-spacing” label pattern is prohibited: small labels use normal case and no tracking. Uppercase is reserved for brand wordmarks and oversized display type. Em dashes and centered dots are not used in interface copy; separate labels with layout (gaps, rules, or separate lines) instead.

## Important Rules

- Do not perform browser-based verification or use browser tooling unless the user explicitly asks for it.
- Avoid file names in one folder that differ only by case (e.g. `Veil.tsx` beside `veil.ts`): on Windows the type checker loses the project's ambient types for one of them.

## Deployment

- The site is served by Cloudflare Workers Static Assets. `cloudflare.config.ts` is the source of truth and `cf` is the CLI; do not add Wrangler or a Wrangler config.
- `main` is the Workers Builds production branch. `beta-3` and other branches deploy through Workers Previews.
- `pnpm run build` writes `dist/`, then `scripts/build-output.mjs` writes the `.cloudflare/output/v0/` tree consumed by `cf deploy --prebuilt`.
- Manual deploys: `pnpm run deploy` for production, `pnpm run deploy:preview` for a preview.

## Working Notes

- Only HOME has a page. RULES, ALBUM, MAP, MORE and the JOIN US / MORE flags are placeholder links (`<a>` without `href`); give them an `href` in `src/home/content.ts` or `Rail.tsx` once their pages exist. v2 targets for later: join QQ group `https://qm.qq.com/q/32DhVd36iI`, rules and gallery content in the handoff doc.
- The founding date is 2022-08-29.

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
