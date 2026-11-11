<template>
  <main class="map-page">
    <h1 class="map-title">地图</h1>
    <!-- The frame inherits `color-scheme` from <html> (global.scss), which
         drives `prefers-color-scheme` inside it, so BlueMap's default theme
         follows the site toggle. Its look comes from `public/bluemap/las.css`,
         loaded by the BlueMap server (`styles` in its webapp.conf). -->
    <iframe
      class="map-frame"
      :src="MAP_URL"
      title="LAS 服务器三维地图 (BlueMap)"
      @load="loaded = true"
    ></iframe>
    <!-- `load` fires once BlueMap's page and scripts are in (cross-origin
         frames report nothing finer); its tiles still stream in after. -->
    <Transition name="map-loading">
      <div v-if="!loaded" class="map-loading" role="status">
        <span class="map-loading-bar" aria-hidden="true"></span>
        <span class="map-loading-label">地图加载中</span>
      </div>
    </Transition>
    <a class="map-source" :href="MAP_URL" target="_blank" rel="noopener noreferrer">
      <span class="map-source-key">BlueMap</span>
      <span class="map-source-value">
        新标签页打开
        <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
          <path d="M2 8 8 2M3.5 2H8v4.5" />
        </svg>
      </span>
    </a>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const MAP_URL = "https://bluemap.lzalien.org/";
const loaded = ref(false);
</script>

<style scoped lang="scss">
// One screen, no scroll: the frame fills the viewport under the fixed navbar.
.map-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  padding-top: var(--site-nav-height, 84px);
  background: $color-surface;
}

.map-title {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.map-frame {
  display: block;
  flex: 1;
  width: 100%;
  min-height: 0;
  border: 0;
}

// Covers the frame area (not the navbar) until the frame loads, then fades.
.map-loading {
  position: absolute;
  inset: var(--site-nav-height, 84px) 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  background: $color-surface;
}

.map-loading-enter-active,
.map-loading-leave-active {
  transition: opacity $transition-med;
}

.map-loading-enter-from,
.map-loading-leave-to {
  opacity: 0;
}

// Indeterminate bar: a brand segment sweeping a line-gray track. 6px tall so
// the segment may be yellow in light.
.map-loading-bar {
  position: relative;
  width: 160px;
  height: 6px;
  overflow: hidden;
  background: $color-line;

  &::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 40%;
    background: $color-accent;
    animation: map-loading-sweep 1.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
}

@keyframes map-loading-sweep {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(250%);
  }
}

.map-loading-label {
  font-size: $font-size-small;
  color: $color-fg-muted;
}

@media (prefers-reduced-motion: reduce) {
  .map-loading-bar::before {
    animation: none;
  }

  .map-loading-enter-active,
  .map-loading-leave-active {
    transition: none;
  }
}

// Two-segment shield like the intro badges and hardware tags (key on the line
// gray, value on the brand fill), padded up to a click target. Bottom left is
// the corner BlueMap leaves free (zoom buttons bottom right, controls on top).
.map-source {
  position: absolute;
  bottom: $spacing-sm;
  left: $spacing-sm;
  display: flex;
  font-family: $font-display;
  font-size: $font-size-label;
  font-weight: $font-weight-bold;
  line-height: 1;

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 2px;
  }
}

.map-source-key,
.map-source-value {
  padding: 6px 10px;
}

.map-source-key {
  background: $color-line;
  color: $color-fg-muted;

  @include light {
    color: $color-fg;
  }
}

.map-source-value {
  display: flex;
  align-items: center;
  gap: 6px;
  background: $color-accent;
  color: $color-on-accent;
  transition: filter $transition-fast;

  svg {
    width: 10px;
    height: 10px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }

  .map-source:hover & {
    filter: brightness(1.08);

    // brightening the yellow fill is invisible in light
    @include light {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }
}
</style>
