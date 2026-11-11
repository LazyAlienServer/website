<template>
  <!-- `data-fit` is set by `fitNav()`, never by Vue: it is switched while
       measuring. See the fit section of the script. -->
  <div ref="root" class="nav-content">
    <router-link to="/" class="nav-logo">
      <img :src="logoUrl" alt="LAS logo" />
      <span>LAZY ALIEN SERVER</span>
    </router-link>
    <div ref="end" class="nav-end" @keydown.esc="closeMenu(true)">
      <!-- Shown only when the links do not fit on one line (`data-fit="menu"`):
           a disclosure for the link list, which then hangs from the bar. -->
      <button
        ref="menuToggle"
        type="button"
        class="nav-icon-button nav-menu-toggle"
        aria-label="菜单"
        aria-controls="nav-links"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M2 4h12M2 8h12M2 12h12" />
        </svg>
      </button>
      <div id="nav-links" class="nav-links" :class="{ 'is-open': menuOpen }">
        <router-link to="/" :class="{ active: route.name === 'home' }" @click="closeMenu()">
          首页
        </router-link>
        <router-link to="/rules" :class="{ active: route.name === 'rules' }" @click="closeMenu()">
          规章
        </router-link>
        <router-link
          to="/gallery"
          :class="{ active: route.name === 'gallery' }"
          @click="closeMenu()"
        >
          画廊
        </router-link>
        <!-- 更多 expanded in place: these copies show only in the menu, where
             the 更多 disclosure below is hidden. -->
        <router-link
          v-for="link in MORE_LINKS"
          :key="link.name"
          :to="link.to"
          class="nav-flat"
          :class="{ active: route.name === link.name }"
          @click="closeMenu()"
        >
          {{ link.label }}
        </router-link>
        <!-- Disclosure, not a menu: a button that shows a panel. The panel is
             positioned against the fixed navbar (this wrapper stays static),
             so it hangs from the bar's bottom edge. A mouse opens it on hover;
             the panel is a DOM child, so moving onto it keeps it open. -->
        <div
          ref="more"
          class="nav-more"
          @keydown.esc="closeMore(true)"
          @pointerenter="onMoreEnter"
          @pointerleave="onMoreLeave"
        >
          <button
            ref="moreToggle"
            type="button"
            class="nav-more-toggle"
            :class="{ active: moreActive }"
            aria-controls="nav-more-panel"
            :aria-expanded="moreOpen"
            @pointerdown="onTogglePointerDown"
            @click="onToggleClick"
          >
            更多
            <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
              <path d="M2 3.5 5 6.5 8 3.5" />
            </svg>
          </button>
          <Transition name="nav-more">
            <ul v-show="moreOpen" id="nav-more-panel" class="nav-more-panel">
              <li v-for="link in MORE_LINKS" :key="link.name">
                <router-link
                  :to="link.to"
                  :class="{ active: route.name === link.name }"
                  @click="closeMore()"
                >
                  {{ link.label }}
                </router-link>
              </li>
            </ul>
          </Transition>
        </div>
      </div>
      <button
        type="button"
        class="nav-icon-button theme-toggle"
        aria-label="切换主题"
        :title="toggleLabel"
        :aria-pressed="theme === 'light'"
        @click="toggleTheme"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <circle cx="8" cy="8" r="6.25" />
          <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import logoUrl from "@/assets/logo.svg";
import { theme, toggleTheme } from "@/composables/theme";

const route = useRoute();
const toggleLabel = computed(() => (theme.value === "light" ? "切换至深色模式" : "切换至浅色模式"));

// ---------- 更多 panel: secondary pages ----------
// `name` is the route name; the toggle reads as active on any of them.
const MORE_LINKS = [
  { to: "/map", name: "map", label: "地图" },
  { to: "/status", name: "status", label: "服务器状态" },
];

const more = ref<HTMLElement | null>(null);
const moreToggle = ref<HTMLButtonElement | null>(null);
const moreOpen = ref(false);
const moreActive = computed(() => MORE_LINKS.some((link) => link.name === route.name));

// Hover-open is mouse only (touch and pen keep click-to-toggle). Leaving
// closes after a delay so the pointer can cross the bar's padding between the
// toggle and the panel, which lies outside the wrapper's box.
const HOVER_CLOSE_DELAY = 200;
let hoverCloseTimer: ReturnType<typeof setTimeout> | undefined;
// Set on the toggle's pointerdown, read by the click that follows it.
let toggleByMouse = false;

const cancelHoverClose = () => {
  clearTimeout(hoverCloseTimer);
  hoverCloseTimer = undefined;
};

const closeMore = (refocus = false) => {
  cancelHoverClose();
  if (!moreOpen.value) return;
  moreOpen.value = false;
  if (refocus) moreToggle.value?.focus();
};

const onMoreEnter = (event: PointerEvent) => {
  if (event.pointerType !== "mouse") return;
  cancelHoverClose();
  moreOpen.value = true;
};

const onMoreLeave = (event: PointerEvent) => {
  if (event.pointerType !== "mouse") return;
  cancelHoverClose();
  hoverCloseTimer = setTimeout(() => closeMore(), HOVER_CLOSE_DELAY);
};

const onTogglePointerDown = (event: PointerEvent) => {
  toggleByMouse = event.pointerType === "mouse";
};

// A mouse has already opened the panel by hovering, so its click keeps it
// open instead of toggling it shut; keyboard and touch clicks toggle.
const onToggleClick = () => {
  moreOpen.value = toggleByMouse || !moreOpen.value;
  toggleByMouse = false;
};

const onPointerDown = (event: PointerEvent) => {
  if (!more.value?.contains(event.target as Node)) closeMore();
};

watch(moreOpen, (open) => {
  if (open) document.addEventListener("pointerdown", onPointerDown);
  else document.removeEventListener("pointerdown", onPointerDown);
});
watch(
  () => route.fullPath,
  () => {
    closeMore();
    closeMenu();
  },
);

// ---------- Fit: the row never wraps ----------
// The row (logo, gap, links, theme toggle) keeps its natural width, so it
// either fits the bar or gives way, in this order: `full`, then `short` (no
// wordmark), then `tight` (also narrower gaps), then `menu` (links behind the
// menu button, 更多 expanded in place). The bar's width changes with the
// viewport and, on the home page, with the desktop bar's expansion, so the
// observer re-fits on every resize. Natural widths are measured once (and
// again when the web fonts arrive) by switching `data-fit` and reading
// layout; resizes only compare them.
type Fit = "full" | "short" | "tight" | "menu";
const ROWS = ["full", "short", "tight"] as const;

const root = ref<HTMLElement | null>(null);
const end = ref<HTMLElement | null>(null);
const menuToggle = ref<HTMLButtonElement | null>(null);
const menuOpen = ref(false);
const isMenu = ref(false);
let needed: Record<(typeof ROWS)[number], number> | undefined;
let current: Fit | undefined;
// the wordmark's collapse, while it plays; the layout switches when it ends
let exit: Animation | undefined;
let observer: ResizeObserver | undefined;

// Layout changes animate, except the first fit after mount and under reduced
// motion. The wordmark grows in and collapses out (width, then the logo gap),
// so the links slide along with it; changed gaps ease to their new size;
// items a change brings onto the bar (the links replacing the menu button,
// the menu button) fade and drop in, left to right. Other leaving items go
// at once.
const CHANGE_MS = 240;
const ENTER_STAGGER_MS = 40;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
// phones always take the menu; keep in step with `$breakpoint-mobile`
const mobile = window.matchMedia("(max-width: 640px)");

const wordmarkOf = (content: HTMLElement) => content.querySelector<HTMLElement>(".nav-logo span")!;

// shown to hidden; reversed for the way in
const wordmarkFrames = (content: HTMLElement): Keyframe[] => {
  const logoGap = getComputedStyle(content.querySelector(".nav-logo")!).columnGap;
  return [
    {
      maxWidth: `${wordmarkOf(content).getBoundingClientRect().width}px`,
      opacity: 1,
      marginLeft: "0px",
    },
    { maxWidth: "0px", opacity: 0, marginLeft: `-${logoGap}` },
  ];
};

const gapsOf = (content: HTMLElement): HTMLElement[] => [
  content.querySelector<HTMLElement>(".nav-links")!,
  end.value!,
];

const rowWidth = (content: HTMLElement, bar: HTMLElement): number =>
  content.querySelector(".nav-logo")!.getBoundingClientRect().width +
  Number.parseFloat(getComputedStyle(bar).columnGap) +
  end.value!.getBoundingClientRect().width;

const measure = (content: HTMLElement, bar: HTMLElement) => {
  // running animations change widths; the layout stays at `current`
  for (const animation of content.getAnimations({ subtree: true })) animation.cancel();
  exit = undefined;
  const widths = { full: 0, short: 0, tight: 0 };
  for (const row of ROWS) {
    content.dataset.fit = row;
    widths[row] = rowWidth(content, bar);
  }
  needed = widths;
  if (current) content.dataset.fit = current;
  else delete content.dataset.fit;
};

const switchTo = (content: HTMLElement, fit: Fit) => {
  const from = current;
  const oldGaps = gapsOf(content).map((el) => getComputedStyle(el).columnGap);
  content.dataset.fit = fit;
  current = fit;
  isMenu.value = fit === "menu";
  if (!from || from === fit || reducedMotion.matches) return;

  const timing = { duration: CHANGE_MS, easing: "ease-out" };
  if (fit === "full") wordmarkOf(content).animate(wordmarkFrames(content).reverse(), timing);
  if (from !== "menu" && fit !== "menu") {
    gapsOf(content).forEach((el, index) => {
      const gap = getComputedStyle(el).columnGap;
      if (gap !== oldGaps[index]) el.animate({ columnGap: [oldGaps[index]!, gap] }, timing);
    });
  }
  const entering =
    fit === "menu"
      ? content.querySelectorAll(".nav-menu-toggle")
      : from === "menu"
        ? content.querySelectorAll(".nav-links > a:not(.nav-flat), .nav-more")
        : [];
  entering.forEach((item, index) =>
    item.animate(
      [
        { opacity: 0, transform: "translateY(-6px)" },
        { opacity: 1, transform: "none" },
      ],
      { ...timing, delay: index * ENTER_STAGGER_MS, fill: "backwards" },
    ),
  );
};

const roomOf = (bar: HTMLElement): number => {
  const style = getComputedStyle(bar);
  // 1px of slack for subpixel rounding
  return (
    bar.clientWidth -
    Number.parseFloat(style.paddingLeft) -
    Number.parseFloat(style.paddingRight) +
    1
  );
};

const pick = (bar: HTMLElement, rows: readonly (typeof ROWS)[number][] = ROWS): Fit => {
  if (mobile.matches) return "menu";
  const room = roomOf(bar);
  return rows.find((row) => needed![row] <= room) ?? "menu";
};

const fitNav = () => {
  const content = root.value;
  const bar = content?.parentElement;
  if (!content || !bar || !end.value) return;
  if (!needed) measure(content, bar);
  const fit = pick(bar);

  // collapsing: turn back if the wordmark fits again, else let it finish
  if (exit) {
    if ((fit === "full") === exit.playbackRate > 0) exit.reverse();
    return;
  }
  if (fit === current) return;
  if (current !== "full" || reducedMotion.matches) {
    switchTo(content, fit);
    return;
  }

  // Leaving `full`: the wordmark collapses first, then the layout switches to
  // the widest row without it that fits by then; a reversed collapse stays
  // `full`. Until then the row may overflow the shrinking bar slightly.
  const animation = wordmarkOf(content).animate(wordmarkFrames(content), {
    duration: CHANGE_MS,
    easing: "ease-in",
    fill: "forwards",
  });
  exit = animation;
  animation.onfinish = () => {
    if (exit !== animation) return;
    exit = undefined;
    if (animation.playbackRate > 0) {
      switchTo(content, pick(bar, ["short", "tight"]));
    }
    animation.cancel();
    fitNav();
  };
};

const closeMenu = (refocus = false) => {
  if (!menuOpen.value) return;
  menuOpen.value = false;
  if (refocus) menuToggle.value?.focus();
};

const onMenuPointerDown = (event: PointerEvent) => {
  if (!end.value?.contains(event.target as Node)) closeMenu();
};

watch(menuOpen, (open) => {
  if (open) document.addEventListener("pointerdown", onMenuPointerDown);
  else document.removeEventListener("pointerdown", onMenuPointerDown);
});
// leaving the menu layout closes whichever panel belonged to the old one
watch(isMenu, () => {
  closeMenu();
  closeMore();
});

const remeasure = () => {
  needed = undefined;
  fitNav();
};

onMounted(() => {
  fitNav();
  const bar = root.value?.parentElement;
  if (bar) {
    observer = new ResizeObserver(fitNav);
    observer.observe(bar);
  }
  void document.fonts.ready.then(remeasure);
  // measured widths include the wordmark only above the phone breakpoint
  mobile.addEventListener("change", remeasure);
});

onUnmounted(() => {
  cancelHoverClose();
  observer?.disconnect();
  mobile.removeEventListener("change", remeasure);
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("pointerdown", onMenuPointerDown);
});
</script>

<style scoped lang="scss">
.nav-content {
  display: contents;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: none;

  img {
    height: 35.2px;
    width: auto;

    // the logo file is white
    @include light {
      filter: brightness(0);
    }
  }

  span {
    font-family: $font-display;
    font-weight: $font-weight-bold;
    font-size: 18px;
    white-space: nowrap;
    // clips the text while the wordmark collapses (`wordmarkFrames`)
    overflow: hidden;
    color: $color-fg;
  }
}

// Phones hide it too (`mobile` below): there the bar holds only the logo and
// the menu and theme buttons.
.nav-content[data-fit="short"],
.nav-content[data-fit="tight"] {
  .nav-logo span {
    display: none;
  }
}

@include mobile {
  .nav-logo span {
    display: none;
  }
}

// last step before the menu: the gaps close in
.nav-content[data-fit="tight"] {
  .nav-end {
    gap: $spacing-xs;
  }

  .nav-links {
    gap: $spacing-sm;
  }
}

// The toggle sits close to the links: the home navbar is only 40% wide on
// desktop, so every pixel of this row counts.
.nav-end {
  display: flex;
  flex: none;
  align-items: center;
  gap: $spacing-sm;
}

.nav-links {
  display: flex;
  gap: 28px;
  white-space: nowrap;

  // direct children only: the 更多 panel's links are styled on their own
  > a,
  .nav-more-toggle {
    position: relative;
    // symmetric so the text, not text plus underline gap, sits on the row's
    // center line with the logo and the theme toggle
    padding-block: 6px;
    font-size: $font-size-small;
    font-weight: $font-weight-medium;
    color: $color-fg-subtle;
    transition: color $transition-fast;

    // The underline is drawn below the text instead of as a border, so the
    // active link never sits a few pixels above its neighbours.
    &::after {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: $color-accent-ink;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform $transition-fast;
    }

    &:hover,
    &.active {
      color: $color-fg;
    }

    &:hover::after,
    &.active::after {
      transform: scaleX(1);
    }
  }
}

// ---------- 更多: toggle styled as a link, panel hung from the bar ----------
.nav-more-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-inline: 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  line-height: inherit;
  cursor: pointer;

  svg {
    width: 10px;
    height: 10px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    transition: transform $transition-fast;
  }

  &[aria-expanded="true"] {
    color: $color-fg;

    &::after {
      transform: scaleX(1);
    }

    svg {
      transform: scaleY(-1);
    }
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 2px;
  }
}

// ---------- Panels hung from the bar: 更多, and the link list in the menu ----------
// Containing block is the fixed or sticky `.nav` (every ancestor up to it is
// static or `display: contents`): top edge on the bar's bottom, right edge on
// the content inset. `$color-bg` is the bar's own fill (gray in light).
@mixin nav-panel {
  position: absolute;
  top: 100%;
  right: var(--nav-inline);
  min-width: 180px;
  padding-block: 6px;
  border: 1px solid $color-line;
  background: $color-bg;
}

@mixin nav-panel-link {
  display: block;
  padding: 8px $spacing-sm;
  font-size: $font-size-small;
  font-weight: $font-weight-medium;
  color: $color-fg-subtle;
  transition:
    color $transition-fast,
    background-color $transition-fast;

  &:hover,
  &.active {
    color: $color-fg;
  }

  &:hover {
    background: fade($color-fg, 0.08);
  }

  // current page: a brand-ink bar on the left edge
  &.active {
    box-shadow: inset 2px 0 $color-accent-ink;
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: -2px;
  }
}

.nav-more-panel {
  @include nav-panel;
  list-style: none;

  a {
    @include nav-panel-link;
  }
}

// Expand: the panel unrolls down from the bar's bottom edge (clip from the
// bottom up) and rolls back up on close. Both ends must be `inset()`: the
// panel's own `clip-path: none` does not interpolate, so it would jump. Under
// reduced motion there is no transition, so Vue shows or hides it at once.
.nav-more-enter-active,
.nav-more-leave-active {
  transition: clip-path $transition-fast;
}

.nav-more-enter-to,
.nav-more-leave-from {
  clip-path: inset(0);
}

.nav-more-enter-from,
.nav-more-leave-to {
  clip-path: inset(0 0 100% 0);
}

@media (prefers-reduced-motion: reduce) {
  .nav-more-enter-active,
  .nav-more-leave-active {
    transition: none;
  }
}

// Icon buttons on the bar. No frame: the icon alone sits on the nav like the
// links, with a hover plate.
.nav-icon-button {
  display: grid;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: $color-fg-subtle;
  transition:
    color $transition-fast,
    background-color $transition-fast;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover,
  &[aria-expanded="true"] {
    color: $color-fg;
    background: fade($color-fg, 0.08);
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 2px;
  }
}

// Half-filled disc; it flips sides when light is on (`aria-pressed`).
.theme-toggle {
  circle {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }

  path {
    fill: currentColor;
  }

  &[aria-pressed="true"] svg {
    transform: scaleX(-1);
  }
}

.nav-menu-toggle {
  display: none;

  path {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }
}

.nav-flat {
  display: none;
}

// ---------- Menu: the links did not fit (`data-fit="menu"`) ----------
// The link list becomes a panel under the bar, with 更多's pages listed in
// place of the 更多 disclosure. It unrolls like the 更多 panel; `visibility`
// waits for the roll-up before hiding the links from focus and readers.
.nav-content[data-fit="menu"] {
  .nav-menu-toggle {
    display: grid;
  }

  .nav-more {
    display: none;
  }

  .nav-links {
    @include nav-panel;
    flex-direction: column;
    gap: 0;
    visibility: hidden;
    clip-path: inset(0 0 100% 0);
    transition:
      clip-path $transition-fast,
      visibility 0s 0.2s;

    &.is-open {
      visibility: visible;
      clip-path: inset(0);
      transition: clip-path $transition-fast;
    }

    > a {
      @include nav-panel-link;

      &::after {
        content: none;
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav-content[data-fit="menu"] .nav-links,
  .nav-content[data-fit="menu"] .nav-links.is-open {
    transition: none;
  }
}
</style>
