<template>
  <section class="timer-section" ref="sectionEl">
    <!-- Changeable background slides -->
    <div class="bg-slides" ref="slidesEl" aria-hidden="true">
      <div
        v-for="(slide, i) in slides"
        :key="slide.src"
        class="bg-slide"
        :class="{ active: i === current }"
      >
        <img :src="slide.src" :alt="slide.name" loading="lazy" />
      </div>
    </div>
    <div class="bg-overlay" aria-hidden="true"></div>

    <!-- Real-time UTC+8 clock (analog instrument) -->
    <div class="clock-face" aria-hidden="true">
      <span
        v-for="i in 60"
        :key="i"
        class="tick"
        :class="{ hour: i % 5 === 1 }"
        :style="{ transform: `translateX(-50%) rotate(${(i - 1) * 6}deg)` }"
      ></span>
      <div
        class="hand hand-hour"
        :style="{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }"
      ></div>
      <div
        class="hand hand-minute"
        :style="{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }"
      ></div>
      <div
        class="hand hand-second"
        :style="{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }"
      ></div>
      <div class="clock-hub"></div>
    </div>

    <div class="section-shell">
      <div class="timer-panel" v-reveal>
        <div class="section-header">
          <div class="index-row">
            <span class="index-num">03</span>
            <span class="index-label">// UPTIME</span>
          </div>
          <h2 class="section-title">做一场现实的梦</h2>
          <p class="section-subtitle">SINCE 2022.08.29</p>
        </div>

        <div class="timer-row">
          <svg
            class="timer-bracket timer-bracket-left"
            viewBox="0 0 24 96"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 2H6V94H18" />
          </svg>
          <div class="timer-grid">
            <div class="timer-cell">
              <span class="timer-value">{{ days }}</span>
              <span class="timer-label">天</span>
            </div>
            <div class="timer-cell">
              <span class="timer-value">{{ pad(hours) }}</span>
              <span class="timer-label">小时</span>
            </div>
            <div class="timer-cell">
              <span class="timer-value">{{ pad(minutes) }}</span>
              <span class="timer-label">分钟</span>
            </div>
            <div class="timer-cell">
              <span class="timer-value">{{ pad(seconds) }}</span>
              <span class="timer-label">秒</span>
            </div>
          </div>
          <svg
            class="timer-bracket timer-bracket-right"
            viewBox="0 0 24 96"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M6 2H18V94H6" />
          </svg>
        </div>

        <div class="signal-row">
          <span class="signal-indicator"></span>
          <span class="signal-text">SIGNAL LOCK // LIVE FEED</span>
        </div>
      </div>

      <!-- Carousel control strip: indicator left, caption center, buttons right -->
      <div class="carousel-controls" v-reveal>
        <div class="zone-left">
          <div class="index-indicator">
            <span class="idx-num">
              <span class="idx-current">{{ pad(current + 1) }}</span>
              <span class="idx-sep">/</span>
              <span class="idx-total">{{ pad(slides.length) }}</span>
            </span>
            <div class="idx-bars">
              <button
                v-for="(slide, i) in slides"
                :key="slide.src"
                class="idx-bar"
                :class="{ active: i === current }"
                type="button"
                :aria-label="`切换到背景 ${i + 1}`"
                @click="go(i, true)"
              ></button>
            </div>
          </div>
        </div>

        <p class="slide-caption">{{ slides[current].name }}</p>

        <div class="zone-right">
          <button class="ctrl-btn" type="button" aria-label="上一张背景" @click="prev(true)">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button class="ctrl-btn" type="button" aria-label="下一张背景" @click="next(true)">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// ---------- Uptime counter ----------
const establishedDate = new Date("2022-08-29T00:00:00+08:00");

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let intervalId: number;
const AUTO_SWITCH_COOLDOWN_MS = 5_000;
let autoSwitchCooldownUntil = 0;

const updateTimer = () => {
  const now = Date.now();
  const diff = now - establishedDate.getTime();

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutes.value = Math.floor((diff / (1000 * 60)) % 60);
  seconds.value = Math.floor((diff / 1000) % 60);

  if (
    seconds.value % 5 === 0 &&
    seconds.value !== lastAutoRotationSecond &&
    now >= autoSwitchCooldownUntil
  ) {
    lastAutoRotationSecond = seconds.value;
    next();
  }

  updateClock();
};

const pad = (n: number) => String(n).padStart(2, "0");

// ---------- Background carousel ----------
const slides = [
  { src: "/floatingcity.webp", name: "FLOATING CITY // 浮空城" },
  { src: "/ftl-ender-pearl.webp", name: "FTL PEARL CANNON // FTL 珍珠炮" },
  { src: "/hero.webp", name: "GOTHIC HALL // 哥特殿堂" },
];

const current = ref(0);
let lastAutoRotationSecond = -1;

const go = (i: number, userInitiated = false) => {
  if (userInitiated) {
    autoSwitchCooldownUntil = Date.now() + AUTO_SWITCH_COOLDOWN_MS;
  }

  current.value = (i + slides.length) % slides.length;
};
const next = (userInitiated = false) => go(current.value + 1, userInitiated);
const prev = (userInitiated = false) => go(current.value - 1, userInitiated);

// ---------- UTC+8 analog clock ----------
const hourAngle = ref(0);
const minuteAngle = ref(0);
const secondAngle = ref(0);

const updateClock = () => {
  // shift to UTC+8 regardless of the viewer's timezone
  const now = new Date();
  const utc8 = new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60_000);
  const h = utc8.getHours() % 12;
  const m = utc8.getMinutes();
  const s = utc8.getSeconds();

  secondAngle.value = s * 6;
  minuteAngle.value = m * 6 + s * 0.1;
  hourAngle.value = h * 30 + m * 0.5;
};

// ---------- Scroll parallax (same lag effect as the hero image) ----------
const sectionEl = ref<HTMLElement | null>(null);
const slidesEl = ref<HTMLElement | null>(null);
let rafId = 0;

const updateParallax = () => {
  if (!sectionEl.value || !slidesEl.value) return;
  // translate proportional to the section's distance from the viewport top
  const y = sectionEl.value.getBoundingClientRect().top * 0.2;
  slidesEl.value.style.transform = `translateY(${y.toFixed(1)}px)`;
};

const onScroll = () => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(updateParallax);
};

onMounted(() => {
  updateTimer();
  intervalId = window.setInterval(updateTimer, 1000);
  updateParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  clearInterval(intervalId);
  cancelAnimationFrame(rafId);
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped lang="scss">
.timer-section {
  position: relative;
  background: $color-primary-black;
  overflow: hidden;
}

// ---------- Background carousel ----------
// Oversized vertically (140%) so the parallax translation never exposes edges
.bg-slides {
  position: absolute;
  inset: -20% 0;
  will-change: transform;
}

.bg-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.9s ease;

  &.active {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(10, 10, 10, 0.78) 0%,
      rgba(10, 10, 10, 0.62) 50%,
      rgba(10, 10, 10, 0.85) 100%
    ),
    linear-gradient(90deg, rgba(0, 102, 204, 0.16) 0%, rgba(0, 102, 204, 0) 60%);
}

// ---------- UTC+8 clock ----------
// Static face; hands rotate. Hidden on mobile.
.clock-face {
  position: absolute;
  z-index: 1;
  right: -160px;
  top: 50%;
  width: 560px;
  height: 560px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  transform: translateY(-50%);

  &::before {
    content: "";
    position: absolute;
    inset: 56px;
    border: 1px solid rgba(30, 144, 255, 0.16);
    border-radius: 50%;
  }
}

.tick {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  transform-origin: 50% 280px; // ring radius

  &.hour {
    width: 2px;
    height: 18px;
    background: rgba(30, 144, 255, 0.55);
  }
}

.hand {
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform-origin: 50% 100%;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.8));
}

.hand-hour {
  width: 6px;
  height: 140px;
  background: rgba(255, 255, 255, 0.9);
}

.hand-minute {
  width: 4px;
  height: 205px;
  background: rgba(255, 255, 255, 0.7);
}

.hand-second {
  width: 2px;
  height: 248px;
  background: $color-blue-bright;
  box-shadow: 0 0 12px rgba(30, 144, 255, 0.6);
}

.clock-hub {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  background: $color-blue-bright;
  box-shadow: 0 0 12px rgba(30, 144, 255, 0.8);
}

.section-shell {
  position: relative;
  z-index: 2;
}

// ---------- Timer panel (frame only — no black card) ----------
.timer-panel {
  position: relative;
  padding: $spacing-lg 0;

  // hatch strip along the bottom edge
  &::after {
    content: "";
    position: absolute;
    left: 40px;
    right: 40px;
    bottom: 12px;
    height: 6px;
    @include hatch-strip(rgba(255, 255, 255, 0.25));
    opacity: 0.6;
    pointer-events: none;
  }

  // labels sit directly on the image now — brighten them
  .index-label {
    color: $color-gray-light;
  }
}

// SVG brackets flank the timer row
.timer-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  position: relative;
  z-index: 1;
}

.timer-bracket {
  width: 12px;
  height: clamp(84px, 12vw, 144px);
  flex: 0 0 auto;
  color: $color-gray-light;
  opacity: 0.65;
  overflow: visible;
  user-select: none;

  path {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3px;
  }
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;
  flex: 1;
}

.timer-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md 0;
  border-left: 1px solid rgba(255, 255, 255, 0.18);

  &:first-child {
    border-left: none;
  }
}

.timer-value {
  font-family: $font-display;
  font-size: clamp(44px, 6vw, 72px);
  font-weight: 700;
  line-height: 1;
  color: $color-blue-bright;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 24px rgba(30, 144, 255, 0.35);
}

.timer-label {
  font-size: $font-size-body;
  color: $color-gray-light;
  letter-spacing: 4px;
}

.signal-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  margin-top: $spacing-md;
}

.signal-text {
  font-size: 11px;
  letter-spacing: 3px;
  color: $color-gray-light;
}

// ---------- Carousel control strip ----------
// 3-zone grid: indicator flush left, caption dead-center, buttons flush right
.carousel-controls {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-top: $spacing-md;
}

.zone-left {
  justify-self: start;
}

.zone-right {
  justify-self: end;
  display: flex;
  gap: $spacing-sm;
}

.ctrl-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(17, 17, 20, 0.78);
  border: 1px solid $color-gray-dark;
  color: $color-white;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
  transition:
    color $transition-fast,
    border-color $transition-fast,
    transform $transition-fast;

  &:hover {
    color: $color-blue-bright;
    border-color: $color-primary-blue;
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.96);
  }
}

.index-indicator {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.idx-num {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: $font-display;
  letter-spacing: 2px;
}

.idx-current {
  font-size: 22px;
  font-weight: 700;
  color: $color-blue-bright;
  font-variant-numeric: tabular-nums;
}

.idx-sep {
  color: $color-gray-light;
}

.idx-total {
  font-size: 14px;
  color: $color-gray-light;
}

.idx-bars {
  display: flex;
  gap: 8px;
}

.idx-bar {
  width: 28px;
  height: 4px;
  padding: 0;
  border: none;
  background: $color-gray-dark;
  transition:
    background $transition-fast,
    width $transition-med;

  &.active {
    width: 44px;
    background: $color-blue-bright;
  }

  &:not(.active):hover {
    background: $color-gray-mid;
  }
}

.slide-caption {
  justify-self: center;
  text-align: center;
  font-size: 12px;
  letter-spacing: 3px;
  color: $color-gray-light;
  text-transform: uppercase;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
}

// Cinematic 21:9 band on wide screens; content stays vertically centered
@media (min-width: 1280px) {
  .timer-section {
    aspect-ratio: 21 / 9;
  }

  .section-shell {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: $spacing-lg;
    padding-bottom: $spacing-lg;
  }

  .timer-panel {
    padding: $spacing-md 0;
  }
}

@include mobile {
  // split row preserved; caption wraps to its own centered line
  .carousel-controls {
    grid-template-columns: 1fr 1fr;
    row-gap: $spacing-sm;
  }

  .zone-left {
    grid-column: 1;
    grid-row: 1;
  }

  .zone-right {
    grid-column: 2;
    grid-row: 1;
  }

  .slide-caption {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .clock-face {
    display: none;
  }

  .timer-panel {
    padding: $spacing-md 0;
  }

  .timer-bracket {
    display: none;
  }

  .timer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md 0;
  }

  .timer-cell:nth-child(3) {
    border-left: none;
  }

  .timer-cell:nth-child(1),
  .timer-cell:nth-child(2) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    padding-bottom: $spacing-md;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-slide {
    transition: none;
  }
}
</style>
