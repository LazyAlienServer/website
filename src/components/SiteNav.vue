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
import { computed } from "vue";
import { useRoute } from "vue-router";
import logoUrl from "@/assets/logo.svg";
import { theme, toggleTheme } from "@/composables/theme";

const route = useRoute();
const toggleLabel = computed(() => (theme.value === "light" ? "切换至深色模式" : "切换至浅色模式"));
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

  a {
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
