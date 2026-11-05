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
        aria-label="浅色模式"
        title="浅色模式"
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
import { useRoute } from "vue-router";
import logoUrl from "@/assets/logo.svg";
import { theme, toggleTheme } from "@/composables/theme";

const route = useRoute();
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
    font-weight: 700;
    font-size: 18px;
    color: $color-fg;
    letter-spacing: 1px;
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
    color: $color-fg-subtle;
    font-size: 14px;
    letter-spacing: 2px;
    transition: color $transition-fast;

    &:hover {
      color: $color-accent-ink;
    }

    &.active {
      color: $color-fg;
      border-bottom: 2px solid $color-accent-ink;
      padding-bottom: 4px;
    }
  }
}

// Half-filled disc; it flips sides when light is on (`aria-pressed`).
.theme-toggle {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid $color-line;
  background: transparent;
  color: $color-fg-subtle;
  transition:
    color $transition-fast,
    border-color $transition-fast;

  svg {
    width: 16px;
    height: 16px;
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
    color: $color-accent-ink;
    border-color: $color-accent-ink;
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
