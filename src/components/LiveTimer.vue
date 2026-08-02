<template>
  <section class="timer-section">
    <!-- Changeable background slides -->
    <div class="bg-slides" aria-hidden="true">
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

    <!-- Rotating survey dial decoration -->
    <div class="dial-ring" aria-hidden="true"></div>

    <div class="section-shell">
      <div class="timer-panel" v-reveal>
        <div class="section-header">
          <div class="index-row">
            <span class="index-num">03</span>
            <span class="index-label">// UPTIME</span>
          </div>
          <h2 class="section-title">已稳定运行</h2>
          <p class="section-subtitle">SINCE 2022.08.29</p>
        </div>

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

        <div class="signal-row">
          <span class="signal-indicator"></span>
          <span class="signal-text">SIGNAL LOCK // LIVE FEED</span>
        </div>
      </div>

      <!-- Carousel controls: switch buttons + index indicator -->
      <div class="carousel-controls" v-reveal>
        <button class="ctrl-btn" type="button" aria-label="上一张背景" @click="prev">
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
              @click="go(i)"
            ></button>
          </div>
        </div>

        <button class="ctrl-btn" type="button" aria-label="下一张背景" @click="next">
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

      <p class="slide-caption">{{ slides[current].name }}</p>
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

const updateTimer = () => {
  const diff = Date.now() - establishedDate.getTime();

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutes.value = Math.floor((diff / (1000 * 60)) % 60);
  seconds.value = Math.floor((diff / 1000) % 60);
};

const pad = (n: number) => String(n).padStart(2, "0");

// ---------- Background carousel ----------
const slides = [
  { src: "/floatingcity.webp", name: "FLOATING CITY // 浮空城" },
  { src: "/ftl-ender-pearl.webp", name: "FTL PEARL CANNON // FTL 珍珠炮" },
  { src: "/hero.webp", name: "GOTHIC HALL // 哥特殿堂" },
];

const current = ref(0);

const go = (i: number) => {
  current.value = (i + slides.length) % slides.length;
};
const next = () => go(current.value + 1);
const prev = () => go(current.value - 1);

onMounted(() => {
  updateTimer();
  intervalId = window.setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style scoped lang="scss">
.timer-section {
  position: relative;
  background: $color-primary-black;
  overflow: hidden;
}

// ---------- Background carousel ----------
.bg-slides {
  position: absolute;
  inset: 0;
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
      rgba(10, 10, 10, 0.84) 0%,
      rgba(10, 10, 10, 0.74) 50%,
      rgba(10, 10, 10, 0.92) 100%
    ),
    linear-gradient(90deg, rgba(0, 102, 204, 0.16) 0%, rgba(0, 102, 204, 0) 60%);
}

// ---------- Survey dial decoration ----------
.dial-ring {
  position: absolute;
  z-index: 1;
  right: -160px;
  top: 50%;
  width: 560px;
  height: 560px;
  border: 1px dashed rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  animation: dial-spin 90s linear infinite;

  &::before {
    content: "";
    position: absolute;
    inset: 56px;
    border: 1px solid rgba(30, 144, 255, 0.16);
    border-radius: 50%;
  }

  // bearing tick at 12 o'clock
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: -6px;
    width: 2px;
    height: 14px;
    margin-left: -1px;
    background: $color-blue-bright;
  }
}

@keyframes dial-spin {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

.section-shell {
  position: relative;
  z-index: 2;
}

// ---------- Timer panel (glass control panel) ----------
.timer-panel {
  position: relative;
  padding: $spacing-lg;
  background: rgba(10, 10, 10, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  @include corner-brackets(18px, 2px, $color-blue-bright, 10px);

  // hatch strip along the bottom edge
  &::after {
    content: "";
    position: absolute;
    left: 40px;
    right: 40px;
    bottom: 12px;
    height: 6px;
    @include hatch-strip;
    opacity: 0.6;
    pointer-events: none;
  }
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;
  position: relative;
  z-index: 1;
}

.timer-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md 0;
  border-left: 1px solid $color-gray-dark;

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
  color: $color-gray-mid;
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
  color: $color-gray-mid;
}

// ---------- Carousel controls ----------
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-top: $spacing-md;
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
  align-items: center;
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
  color: $color-gray-mid;
}

.idx-total {
  font-size: 14px;
  color: $color-gray-mid;
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
  margin-top: $spacing-sm;
  text-align: center;
  font-size: 12px;
  letter-spacing: 3px;
  color: $color-gray-mid;
  text-transform: uppercase;
}

@include mobile {
  .dial-ring {
    display: none;
  }

  .timer-panel {
    padding: $spacing-md;
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
    border-bottom: 1px solid $color-gray-dark;
    padding-bottom: $spacing-md;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dial-ring {
    animation: none;
  }

  .bg-slide {
    transition: none;
  }
}
</style>
