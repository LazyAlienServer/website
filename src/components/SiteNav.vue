<template>
  <div class="nav-content">
    <router-link to="/" class="nav-logo">
      <img :src="logoUrl" alt="LAS logo" />
      <span>LAZY ALIEN SERVER</span>
    </router-link>
    <div class="nav-end">
      <div class="nav-links">
        <router-link to="/" :class="{ active: route.name === 'home' }">首页</router-link>
        <router-link to="/rules" :class="{ active: route.name === 'rules' }">规章</router-link>
        <router-link to="/gallery" :class="{ active: route.name === 'gallery' }">画廊</router-link>
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
        class="theme-toggle"
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
import { computed, onUnmounted, ref, watch } from "vue";
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
  () => closeMore(),
);
onUnmounted(() => {
  cancelHoverClose();
  document.removeEventListener("pointerdown", onPointerDown);
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
    color: $color-fg;
  }
}

// The toggle sits close to the links: the home navbar is only 40% wide on
// desktop, so every pixel of this row counts.
.nav-end {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.nav-links {
  display: flex;
  gap: 28px;

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

// Containing block is the fixed `.nav` (every ancestor up to it is static or
// `display: contents`): top edge on the bar's bottom, right edge on the
// content inset. `$color-bg` is the bar's own fill (gray in light).
.nav-more-panel {
  position: absolute;
  top: 100%;
  right: var(--nav-inline);
  min-width: 180px;
  padding-block: 6px;
  border: 1px solid $color-line;
  background: $color-bg;
  list-style: none;

  a {
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

// Half-filled disc; it flips sides when light is on (`aria-pressed`). No
// frame: the icon alone sits on the nav like the links, with a hover plate.
.theme-toggle {
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

  circle {
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }

  path {
    fill: currentColor;
  }

  &:hover {
    color: $color-fg;
    background: fade($color-fg, 0.08);
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 2px;
  }

  &[aria-pressed="true"] svg {
    transform: scaleX(-1);
  }
}

@include mobile {
  .nav-logo span {
    display: none;
  }
}
</style>
