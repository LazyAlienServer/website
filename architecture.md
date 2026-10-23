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
  /gallery -> src/views/GalleryPage.vue
```

`createWebHistory(import.meta.env.BASE_URL)` is used. `scrollBehavior` restores saved positions, scrolls to hash targets with a 72px top offset, and otherwise returns to the top instantly (`behavior: "instant"`, overriding the global smooth scroll so the new page is not mid-scroll when the view transition captures it).

Route changes between different pages run a View Transition. `router.beforeResolve` calls `document.startViewTransition` and lets navigation proceed only inside its update callback, after the old page is captured. `router.afterEach` ends the callback after `nextTick` plus one macrotask, so the new route has rendered and scrolled before capture. Initial load, same-route hash/query changes, browsers without the API, and `prefers-reduced-motion` skip it. Direction follows the navbar order: each route's `meta.navIndex` (typed via a `RouteMeta` augmentation, kept in sync with the link order in `SiteNav.vue`) sets `--page-dir` on `<html>` to `1` (toward a link on the right) or `-1`, cleared when the latest transition finishes. The animations live in `src/styles/global.scss`: `root` slides away from the travel side and fades, then the new page slides in from the other side behind a `clip-path` shutter opening from its leading edge. `SiteNavbar.vue` has `view-transition-name: site-nav` and is shown live and unanimated, so it keeps its own width/seam transition instead of moving with the page. When adding a route to the navbar, give it the next `navIndex`.

The Vite alias `@` resolves to `src/`. SCSS receives `src/styles/variables.scss` through Vite's `additionalData`, so component styles can use the shared tokens and mixins without importing the file manually.

## Home page composition

`src/views/HomePage.vue` is a composition surface. It owns ordering, not the implementation of each section:

1. `HeroSection.vue` — fixed navigation, hero visual, scroll-driven seam/parallax.
2. `IntroSection.vue` — LAS introduction, particle emblem (`ParticleLogo.vue`), and decorative technology rail.
3. `LiveTimer.vue` — founding-date uptime counter, UTC+8 analog clock, image carousel, and parallax.
4. `HardwareSection.vue` — hardware accordion; composes `InfrastructureFeatures.vue`.
5. `GithubProjects.vue` — remote GitHub repository index and carousel.
6. `AdminTeam.vue` — operator cards, avatar fallback, and optional Bilibili links.
7. `JoinSection.vue` — rules entry points, QQ group link, and clipboard action.
8. `FooterSection.vue` — shared contact, credits, copyright, founding metadata, and the blue closing wordmark on both home and rules pages.

When changing section order or adding a landing section, start in `HomePage.vue`. When changing behavior or markup, work in the owning component instead of adding route-level logic.

## Rules page composition

`src/views/RulesPage.vue` renders `chapters` from `src/data/rules.ts`. The data model is:

`SiteNav.vue` owns the shared logo, route-aware links, and responsive branding. `SiteNavbar.vue` is mounted once in `App.vue`, remains fixed across route changes, and owns the route/scroll expansion state plus hero seam geometry. It is expanded by default on `/rules`; on `/`, scroll position controls expansion. Keeping the same navbar instance preserves the expansion transition when navigating from a collapsed homepage navbar to RulesPage. RulesPage offsets its content by the observed navbar height and renders the shared `FooterSection.vue` after the rules signoff.

RulesPage lays out a centered 900px document column inside a three-column grid. The chapter index is an unframed list of right-aligned titles, each ending in a dash; it is `position: sticky` in the right column, so it stops at the end of the document instead of overlapping the footer, and it is hidden at 1360px and below. Links reuse the `01`–`09` heading anchors (the route-hash contract used by JoinSection), and CSS scroll margins account for the persistent navbar. A coalesced scroll/resize callback selects the last heading above the navbar offset and sets `aria-current`; the active item turns blue and its dash lengthens. Chapter titles are split into a "第X章" label and a short title at module load; edit titles in `src/data/rules.ts` only.

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

## Gallery page composition

`src/views/GalleryPage.vue` renders `galleryItems` and `galleryCategories` from `src/data/gallery.ts` (images served from `public/`, with intrinsic `width`/`height` to reserve layout space). Archive numbers come from each item's position in the full list, so filtering never renumbers frames. A sticky toolbar under the navbar holds the category filter (`aria-pressed` segments with counts), a live visible-count status, and a GRID/INDEX view toggle. GRID lays frames on a 12-column rhythm by visible index — a full-width plate, then a 7/5 pair with the minor frame dropped — with a hover/focus data strip. On hover-capable fine pointers, grid frames hide the native cursor and show a crosshair: full-length hairlines plus a blue split-square reticle, positioned by `--cx`/`--cy`, and a top-right X/Y readout in source-image pixels (`trackCursor` reverses the `object-fit: cover` scale and crop, so the item's `width`/`height` must match the real file). `trackCursor` writes the CSS variables and readout text directly on `pointermove`, avoiding Vue renders. INDEX is a table whose hovered or focused row drives a sticky preview (hidden at tablet width). Any frame or row opens a native modal `<dialog>` viewer over the current filtered list, with previous/next buttons, arrow keys, a thumbnail strip, Escape and backdrop close; page scroll is locked while it is open and restored on close or unmount. Add images or categories by editing the data file only.

Gallery motion: the empty state, grid, and index sit in one `<Transition name="swap" mode="out-in">`, keyed by view and filter, so either toggle fades the old layout out and re-mounts the new one. Frames and index rows replay a staggered `item-rise` entry via an inline `--i` index. The viewer `<dialog>` fades with `@starting-style` plus `display`/`overlay` `allow-discrete` (close fade where supported), the image opens as a `clip-path` shutter from its center line, and the info bar rises in after it. Inside the open viewer, the image is keyed in a `switch-${direction}` `<Transition>`: `step()` and `goTo()` set `direction` to `next`/`prev`, so the old image slides away and shrinks (40%, scale 0.8) while the new one slides in from the opposite side and grows to full size; `open()` resets it to `none` (no CSS), leaving only the shutter. Both images share one grid cell in a `contain: strict` stage, so the switch never moves the bar or strip. All of it is disabled under reduced motion.

Viewer input beyond buttons, arrow keys, and the strip: with a mouse, the outer 20% of the image on each side (`trackEdge` → `edge`) shows a thin white chevron cursor and steps on click; the leaving image ignores pointer events. A vertical wheel on the dialog steps (down = next) once per burst; a 200ms gap (`WHEEL_GAP`) or 700ms of continuous scrolling (`WHEEL_REPEAT`) re-arms it, so trackpad inertia does not skip several images. Horizontal-dominant wheel events are left alone. Both are disabled with fewer than two visible images.

## Stateful components and side effects

### `SiteNavbar.vue` and `HeroSection.vue`

- `SiteNavbar.vue` derives expansion from route and scroll position: rules is always expanded; home expands after `window.scrollY > 48`.
- Both components coalesce scroll work with `requestAnimationFrame`; Hero owns only its image parallax.
- Desktop nav derives `--seam-top` and `--seam-bottom` from the actual hero visual bounds and its 8%-to-0 clip slope. Both nav surfaces use these same coordinates; registered progress properties animate independently of scroll geometry. Do not reintroduce skew transforms or pixel-offset seam patches.
- Navbar observes its own dimensions and publishes `--site-nav-height` for page offsets. Cleanup cancels frames, disconnects the observer, and removes event listeners.
- The navbar's gray underline remains separate from its seam surfaces.
- Mobile home (≤640px, `nav--home`): the navbar is `position: sticky` in flow with a top margin of `$hero-visual-height-mobile`, so it starts directly under the stacked hero image and sticks to the viewport top once scrolled there. `HeroSection.vue` pulls `.hero-visual` up by that height plus `--site-nav-height` and leaves `--site-nav-height` below it. Change the image height only through the shared token. Other routes and wider viewports keep the fixed bar.
- Navbar travel in page transitions: the router reads `#site-nav`'s viewport top before and after a route change. If it differs (mobile home with the navbar docked ↔ any fixed-bar page), it sets `--nav-from`, `--nav-to` and `data-nav-move` (`up`/`down`) on `<html>`. `global.scss` then animates the `site-nav` group and a blue `nav-trail` group, captured from the invisible `.nav-trail` span. The keyframes move the groups only with `translate` offsets from the new navbar (`--nav-from - --nav-to` → `0`) and leave the UA's own group `transform` in place: on mobile the snapshot containing block extends under the browser's top bar, so viewport tops used as absolute transforms would be off by the bar's height and jump at start and end. The blue only fills the gap between the navbar's top edge and the far end of the travel, so it never sits under or below the navbar. Up: the blue grows to the top first (36%), then the navbar follows and swallows it. Down: the navbar moves first (61%), stretching the blue behind it, then the blue's top edge follows. These are the desktop expand/collapse timings. Otherwise both groups stay unanimated and the trail is hidden.

### `ScrollTicker.vue`

Standalone `aria-hidden` band repeating `LAZY ALIEN SERVER` (solid, outlined, blue skew marks). `HomePage.vue` places one directly above `IntroSection` (`direction="left"`) and one directly below (`direction="right"`); the bands are their own blocks (112/72/48px tall on desktop/tablet/mobile) and do not touch the intro's layout. A rAF-coalesced scroll listener shifts the track by `scrollY × TICKER_SPEED`, wrapped modulo one unit's width so the loop is seamless; `direction` is the drift while scrolling down. Updates are skipped while the band is off screen; reduced motion pins the track. Cleanup cancels the frame and removes the scroll, resize, and media-query listeners.

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

### `ParticleLogo.vue`

Hand-written canvas particle swarm (no dependency). On mount it decodes `src` and `hoverSrc`, trims each to its drawn bounds and contain-fits it to the frame, samples opaque pixels on a sparse 5px grid into colored targets, and morphs one particle set between them: `src` at rest, `hoverSrc` (`.design/logos/logo.svg`, the v1 logo) while hovered. Each particle has its own soft spring stiffness and brightness, so morphs drift in staggered without overshoot; the pointer gently pushes nearby dots aside and a few free dots drift in the background. The animation frame runs continuously only while the element is in view. `ResizeObserver` resamples on size change; reduced motion snaps particles to targets with static ambient dots and no repulsion; an image decode failure falls back to a static `<img>`. The parent sizes the root (Intro uses a square frame so the landscape v2 and portrait v1 logos fill it about equally).

### `AdminTeam.vue`

Operator data is local and typed. Avatar URLs point to the LAS website source directory. A failed avatar name is stored in a reactive `Set` and renders the initials fallback. Only operators with `bilibiliUrl` become links; preserve `noopener noreferrer` on external targets.

### `JoinSection.vue`

The two rules buttons route to `/rules` with query values `path=01` or `path=02` and a chapter hash. The QQ group number is `835047145`. Copying uses `navigator.clipboard` first and a temporary textarea fallback second; timer cleanup belongs in `onBeforeUnmount`.

### `FooterSection.vue`

Both routes render the same footer, including the closing blue wordmark. A normal-flow slot reserves the SVG's 10:1 aspect ratio plus padding and uses `clip-path: inset(0)` to reveal its viewport-fixed, bottom-aligned child only within that slot. The SVG uses a fixed viewBox and `textLength`; CSS handles sizing without font measurement, viewport state, scroll/resize listeners, or animation frames.

## Shared presentation system

`src/styles/variables.scss` is the token and mixin layer:

- Colors: carbon black, soft black, LAS blue, bright blue, white, and gray levels.
- Typography: Inter for body text and Roboto Condensed for display/control labels.
- Spacing: `$spacing-xs` through `$spacing-xl`.
- Breakpoint mixins: `mobile` (max 640px), `tablet` (max 1024px), and `desktop` (min 641px).
- Industrial mixins: `clipped-panel`, `corner-brackets`, and `hatch-strip`.
- Hero slant: `src/styles/global.scss` defines `--hero-slant` and `--hero-slant-tan` on `:root`, the viewport-dependent angle of the hero image's clipped left edge (`atan2(4.8vw, max(100vh, 640px))`), with fixed 1920×1080 fallbacks. Every slant uses it (the AGENTS.md tilt rule): kicker marks (hero, rules, gallery), the hero primary button and intro tab label (skewed `::before` clipped by `overflow: hidden`), ticker marks, the hardware accordion, and the join divider and group tint.

Section headings are intentionally bespoke and owned by each section component (hero identity kicker, intro profile tab, timer founding timeline, hardware TECH SUPPORT kicker, GitHub title, admin roster manifest, join index row). The hero carries no section index. There is no shared section-header component or global header class; derive header data from the section's own constants (`hardware`, `operators`, `establishedDate`).

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
| Change gallery images                       | `src/data/gallery.ts`, `public/`                      | Intrinsic image sizes, frame layout rhythm           |
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
