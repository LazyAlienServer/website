# LASweb-v2 Architecture Guide

This document is the deep navigation map for LLM agents working on LASweb-v2. `AGENTS.md` remains the short project context and policy file; this guide focuses on runtime composition, state ownership, side effects, and safe modification points.

## Source-of-truth rule

Read the implementation before relying on this guide. Component code is authoritative when a summary, comment, or older note disagrees with it. Keep this document focused on stable boundaries and update it when those boundaries change.

## Runtime entry and route graph

```text
src/main.ts
  -> createApp(App)
  -> install vue-router
  -> install vReveal
  -> import src/styles/global.scss
  -> mount #app

src/App.vue
  -> <router-view />

src/router/index.ts
  /       -> src/views/HomePage.vue
  /rules  -> src/views/RulesPage.vue
```

`createWebHistory(import.meta.env.BASE_URL)` is used. `scrollBehavior` restores saved positions, scrolls to hash targets with a 72px top offset, and otherwise returns to the top.

The Vite alias `@` resolves to `src/`. SCSS receives `src/styles/variables.scss` through Vite's `additionalData`, so component styles can use the shared tokens and mixins without importing the file manually.

## Home page composition

`src/views/HomePage.vue` is a composition surface. It owns ordering, not the implementation of each section:

1. `HeroSection.vue` — fixed navigation, hero visual, scroll-driven seam/parallax.
2. `IntroSection.vue` — static LAS introduction and decorative technology rail.
3. `LiveTimer.vue` — founding-date uptime counter, UTC+8 analog clock, image carousel, and parallax.
4. `HardwareSection.vue` — hardware accordion; composes `InfrastructureFeatures.vue`.
5. `GithubProjects.vue` — remote GitHub repository index and carousel.
6. `AdminTeam.vue` — operator cards, avatar fallback, and optional Bilibili links.
7. `JoinSection.vue` — rules entry points, QQ group link, and clipboard action.
8. `FooterSection.vue` — contact, credits, copyright, and founding metadata.
9. `UnderFooterSection.vue` — viewport-aware animated closing wordmark.

When changing section order or adding a landing section, start in `HomePage.vue`. When changing behavior or markup, work in the owning component instead of adding route-level logic.

## Rules page composition

`src/views/RulesPage.vue` renders `chapters` from `src/data/rules.ts`. The data model is:

```ts
interface Article {
  id: string;
  title: string;
  content: string;
}

interface Chapter {
  id: string;
  title: string;
  articles: Article[];
}
```

The page reads `route.query.path` and maps `01` and `02` to article IDs that receive the flash state. Hash navigation targets chapter IDs. Add or edit rules in `src/data/rules.ts`; do not hard-code new article data in the view.

## Stateful components and side effects

### `HeroSection.vue`

- State: `isNavExpanded` is derived from `window.scrollY > 48`.
- Scroll work is coalesced with `requestAnimationFrame`.
- The hero image receives a `translateY` parallax transform.
- Desktop navbar seam variables are written to the nav element: `--navbar-seam-scroll-shift`, `--navbar-edge-height`, and `--navbar-edge-inset`.
- Cleanup must cancel the frame and remove both scroll and resize listeners.
- The navbar's gray underline is a separate fixed element; do not put it on the scrolling seam surface.

### `LiveTimer.vue`

- `establishedDate` is `2022-08-29T00:00:00+08:00`.
- A one-second interval updates days, hours, minutes, seconds, and the UTC+8 clock hand angles.
- The background carousel has three local public images and rotates through `current`.
- Manual carousel changes set a five-second automatic-switch cooldown.
- Scroll parallax uses a separate animation frame and must be cleaned up on unmount.

### `HardwareSection.vue`

- Hardware data and SVG icon strings are local constants in the component.
- `activeIndex` controls the accordion panel.
- Automatic rotation runs every five seconds, pauses on hover, and stops for a ten-second click cooldown.
- `motionSafe` is initialized from `prefers-reduced-motion`; timers do not start when motion is reduced.
- `InfrastructureFeatures.vue` is presentational data plus icon markup and has no shared state contract with the accordion.

### `GithubProjects.vue`

This is the most stateful landing section. Keep the following contracts intact:

- `Repo` requires `name`, `description`, `html_url`, `stargazers_count`, `language`, and `pushed_at`.
- `loadRepos()` requests `https://api.github.com/orgs/LazyAlienServer/repos?per_page=100`, validates the unknown response with type guards, sorts client-side by stars, and keeps `REPO_COUNT = 5`.
- `localStorage` key: `las-github-repos`; cache TTL: ten minutes. Invalid or old cache data falls through to the network request.
- `current` is the single carousel source of truth. `active` derives the current repository; `slotOf()` derives desktop visual slots.
- `go()`, `next()`, and `prev()` wrap with modulo arithmetic. User actions apply a five-second auto-switch cooldown.
- Auto-play runs every six seconds unless reduced motion is requested, the section is hovered/focused, the document is hidden, or the manual cooldown is active.
- Desktop and mobile intentionally use separate DOM trees. The desktop deck owns the transform carousel; the mobile list owns the full-width card plus external caption layout. Both read the same `current` state.
- Preview repository links prevent navigation and promote the preview to the active slot. The active link opens the repository in a new tab.
- Loading, error, and empty states are part of the observable contract. Preserve the retry path and do not silently swallow a failed repository request.

If changing GitHub fields, update the interface, runtime validator, cache compatibility, display formatting, and both desktop/mobile card templates together.

### `AdminTeam.vue`

Operator data is local and typed. Avatar URLs point to the LAS website source directory. A failed avatar name is stored in a reactive `Set` and renders the initials fallback. Only operators with `bilibiliUrl` become links; preserve `noopener noreferrer` on external targets.

### `JoinSection.vue`

The two rules buttons route to `/rules` with query values `path=01` or `path=02` and a chapter hash. The QQ group number is `835047145`. Copying uses `navigator.clipboard` first and a temporary textarea fallback second; timer cleanup belongs in `onBeforeUnmount`.

### `UnderFooterSection.vue`

This component uses template refs and `requestAnimationFrame` to derive viewport clipping, panel position, and responsive wordmark bounds. It also waits for the `Noto Sans SC` font before measuring the SVG title. Keep scroll/resize listener cleanup and frame cancellation together.

## Shared presentation system

`src/styles/variables.scss` is the token and mixin layer:

- Colors: carbon black, soft black, LAS blue, bright blue, white, and gray levels.
- Typography: Inter for body text and Roboto Condensed for display/control labels.
- Spacing: `$spacing-xs` through `$spacing-xl`.
- Breakpoint mixins: `mobile` (max 640px), `tablet` (max 1024px), and `desktop` (min 641px).
- Industrial mixins: `clipped-panel`, `corner-brackets`, and `hatch-strip`.

`src/styles/global.scss` owns resets, body defaults, typography scale, utility panels, blueprint grids, signal animation, section shells, reveal transitions, and the global reduced-motion rules. Prefer existing tokens/mixins over local duplicate values.

`src/directives/reveal.ts` owns the `v-reveal` contract. It adds `.reveal`, observes the element once with `IntersectionObserver`, then adds `.revealed`. The global reduced-motion rule makes revealed content immediately visible without transition.

## Modification map

| Change                                      | Primary file(s)                                       | Also check                                           |
| ------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| Add or reorder homepage content             | `src/views/HomePage.vue`                              | Section component imports and anchor targets         |
| Change hero/nav scroll behavior             | `src/components/HeroSection.vue`                      | Reduced-motion styles and listener cleanup           |
| Change founding timer or image carousel     | `src/components/LiveTimer.vue`                        | Timer interval, cooldown, and public image paths     |
| Change hardware data or accordion           | `src/components/HardwareSection.vue`                  | `InfrastructureFeatures.vue`, keyboard button states |
| Change GitHub repository fields or carousel | `src/components/GithubProjects.vue`                   | Type guards, cache, desktop deck, mobile list        |
| Change rules content                        | `src/data/rules.ts`                                   | `RulesPage.vue` query/hash highlighting              |
| Change rules routing                        | `src/router/index.ts`                                 | Back links and scroll behavior                       |
| Change join destinations or clipboard       | `src/components/JoinSection.vue`                      | Rules query values and cleanup                       |
| Change global layout tokens                 | `src/styles/variables.scss`, `src/styles/global.scss` | All components using the affected token              |

## Tooling and validation

The project uses the Vite+ CLI (`vp`) with a pinned pnpm package manager. The package scripts define `dev`, `build`, `preview`, and `prepare`; there is no dedicated test script in `package.json`.

Typical local workflow:

```bash
vp install
vp dev
vp lint --deny-warnings
vp fmt --check src/components/GithubProjects.vue
vp run build
```

Use `vp run <script>` when a project script or Vite task is being invoked. Avoid broad formatting of unrelated CRLF files; target the changed files when possible. Browser-based verification is governed by `AGENTS.md` and requires explicit user permission.
