<template>
  <div ref="band" class="ticker" aria-hidden="true">
    <div ref="track" class="ticker-track">
      <span v-for="n in TICKER_UNITS" :key="n" class="ticker-unit">
        <span class="ticker-solid">LAZY ALIEN SERVER</span>
        <span class="ticker-mark"></span>
        <span class="ticker-outline">LAZY ALIEN SERVER</span>
        <span class="ticker-mark"></span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from "vue";

// `direction` is where the text drifts while scrolling down; scrolling up
// reverses it.
const { direction = "left" } = defineProps<{ direction?: "left" | "right" }>();

// Enough repeated units that the track still covers ultra-wide viewports
// after shifting by up to one unit.
const TICKER_UNITS = 4;
const TICKER_SPEED = 0.35;

const band = useTemplateRef<HTMLElement>("band");
const track = useTemplateRef<HTMLElement>("track");
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
let frame = 0;

// The offset wraps by one unit width so the repeated text loops seamlessly at
// any scroll distance. Work is skipped while the band is off screen.
const update = () => {
  const bounds = band.value?.getBoundingClientRect();
  const unit = track.value?.firstElementChild?.getBoundingClientRect().width ?? 0;
  if (!track.value || !bounds || !unit || bounds.bottom < 0 || bounds.top > window.innerHeight)
    return;
  const shift = motion.matches ? 0 : (window.scrollY * TICKER_SPEED) % unit;
  const x = direction === "left" ? -shift : shift - unit;
  track.value.style.transform = `translate3d(${x}px, 0, 0)`;
};

const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(update);
};

onMounted(() => {
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  motion.addEventListener("change", schedule);
  void document.fonts.ready.then(schedule);
});

onUnmounted(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  motion.removeEventListener("change", schedule);
});
</script>

<style scoped lang="scss">
.ticker {
  --ticker-size: 56px;

  display: flex;
  align-items: center;
  height: 112px;
  overflow: hidden;
  background: $color-primary-black;
  border-block: 1px solid $color-gray-dark;
  pointer-events: none;
  user-select: none;
}

.ticker-track {
  display: flex;
  flex: none;
  will-change: transform;
}

.ticker-unit {
  display: flex;
  flex: none;
  align-items: center;
  gap: calc(var(--ticker-size) * 0.45);
  padding-right: calc(var(--ticker-size) * 0.45);
  font-family: $font-display;
  font-size: var(--ticker-size);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.ticker-solid {
  color: $color-white;
}

.ticker-outline {
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.45);
}

// Slanted blue plate, leaning at the hero split line's angle. That line is
// `.hero-visual`'s clipped left edge in `HeroSection.vue`: 8% of the 60%-wide
// image (4.8vw) across the hero height (100vh, min 640px). The fixed skew is
// a fallback for browsers without CSS `atan2()`.
.ticker-mark {
  width: calc(var(--ticker-size) * 0.5);
  height: calc(var(--ticker-size) * 0.5);
  background: $color-blue-bright;
  transform: skewX(-5deg);
  transform: skewX(calc(-1 * atan2(4.8vw, max(100vh, 640px))));
}

@include tablet {
  .ticker {
    --ticker-size: 36px;
    height: 72px;
  }
}

@include mobile {
  .ticker {
    --ticker-size: 24px;
    height: 48px;
  }
}
</style>
