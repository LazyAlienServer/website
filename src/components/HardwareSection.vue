<template>
  <section class="hardware-section">
    <div class="section-shell hw-shell">
      <div class="hw-main">
        <div class="hw-intro">
          <div class="section-header" v-reveal>
            <div class="index-row">
              <span class="index-num">04</span>
              <span class="index-label">// TECH SUPPORT</span>
            </div>
            <h2 class="section-title">技术支持</h2>
            <p class="section-subtitle">强劲的服务与支持为服务器保驾护航</p>
            <div class="title-rule"></div>
          </div>
          <div class="hardware-tags" role="list" aria-label="Hardware status">
            <span
              v-for="(tag, index) in hardwareTags"
              :key="tag"
              class="hardware-tag"
              :class="{ active: index === activeTagIndex }"
              role="listitem"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="hw-accordion" v-reveal @mouseenter="onHoverStart" @mouseleave="onHoverEnd">
          <button
            v-for="(item, i) in hardware"
            :key="item.title"
            type="button"
            class="hw-panel"
            :class="{ active: i === activeIndex }"
            :aria-expanded="i === activeIndex"
            @click="select(i)"
          >
            <span class="hw-skin" aria-hidden="true">
              <span class="hw-watermark" aria-hidden="true" v-html="item.icon"></span>
            </span>
            <span class="hw-vlabel" aria-hidden="true">{{ item.short }}</span>
            <span class="hw-detail">
              <span class="hw-icon" aria-hidden="true" v-html="item.icon"></span>
              <span class="hw-name">{{ item.title }}</span>
              <span class="hw-desc">{{ item.description }}</span>
              <span class="hw-specs">
                <span v-for="spec in item.specs" :key="spec" class="hw-spec">{{ spec }}</span>
              </span>
            </span>
            <span class="sr-only">{{ item.title }}</span>
          </button>
        </div>
      </div>
      <InfrastructureFeatures />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from "vue";
import InfrastructureFeatures from "./InfrastructureFeatures.vue";

const icons = {
  cpu: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="14" y="14" width="36" height="36" />
    <rect x="24" y="24" width="16" height="16" />
    <path d="M22 14V6M32 14V6M42 14V6M22 58v-8M32 58v-8M42 58v-8M14 22H6M14 32H6M14 42H6M58 22h-8M58 32h-8M58 42h-8" />
  </svg>`,
  ram: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="6" y="18" width="52" height="22" />
    <rect x="12" y="24" width="6" height="10" />
    <rect x="22" y="24" width="6" height="10" />
    <rect x="32" y="24" width="6" height="10" />
    <rect x="42" y="24" width="6" height="10" />
    <path d="M10 40v8h6v-4h4v4h6v-4h4v4h6v-4h4v4h6v-4h4v4h6v-8" />
  </svg>`,
  storage: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M32 8 56 20 32 32 8 20z" />
    <path d="m8 32 24 12 24-12M8 44l24 12 24-12" />
  </svg>`,
};

interface HardwareSpec {
  short: string;
  title: string;
  description: string;
  icon: string;
  specs: string[];
}

const hardware: HardwareSpec[] = [
  {
    short: "CPU",
    title: "CPU — i9-13900K",
    description: "强大性能！主频可达5.8-6.0GHz，为服务器提供充沛算力。",
    icon: icons.cpu,
    specs: ["24C / 32T — 8P + 16E CORES", "MAX TURBO 5.8 GHZ", "36MB SMART CACHE"],
  },
  {
    short: "RAM",
    title: "RAM — DDR5 5600MHz 内存",
    description: "48G x 2 幻锋戟 DDR5-5600MHz，高频大容量保障流畅运行。",
    icon: icons.ram,
    specs: ["48GB × 2 — 96GB TOTAL", "DDR5-6200MHZ CL32", "DUAL CHANNEL KIT"],
  },
  {
    short: "RAID",
    title: "Storage — 2TB × 4 RAID 10",
    description:
      "4 块 2TB M.2 SSD 组成 RAID 10 存储阵列，在提升并发读写的同时保留镜像冗余，兼顾速度、容量与数据安全。",
    icon: icons.storage,
    specs: ["2TB × 4 M.2 NVME SSD", "RAID 10 — 4TB USABLE", "STRIPED SPEED + MIRROR REDUNDANCY"],
  },
];

const hardwareTags = ["99% UPTIME", "13900K", "96GB DDR5", "4TB RAID 10", "BGP & CN2", "DEV TEAM"];
const TAG_INTERVAL = 3000;
const activeTagIndex = shallowRef(0);

// ── auto-rotation state machine ─────────────────────────────
// default: first panel expanded; rotate every 5s;
// click selects a panel and starts a 10s cooldown; hover pauses only.
const AUTO_INTERVAL = 5000;
const COOLDOWN = 10000;

const activeIndex = ref(0);
const hovering = ref(false);
const cooling = ref(false);
const motionSafe = ref(true);

let tagTimer: ReturnType<typeof setInterval> | undefined;

const startTagRotation = (): void => {
  if (!motionSafe.value || tagTimer !== undefined) return;
  tagTimer = setInterval(() => {
    activeTagIndex.value = (activeTagIndex.value + 1) % hardwareTags.length;
  }, TAG_INTERVAL);
};

const stopTagRotation = (): void => {
  if (tagTimer !== undefined) {
    clearInterval(tagTimer);
    tagTimer = undefined;
  }
};

let autoTimer: ReturnType<typeof setInterval> | undefined;
let cooldownTimer: ReturnType<typeof setTimeout> | undefined;

const stopAuto = (): void => {
  if (autoTimer !== undefined) {
    clearInterval(autoTimer);
    autoTimer = undefined;
  }
};

const startAuto = (): void => {
  if (!motionSafe.value || autoTimer !== undefined) return;
  autoTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % hardware.length;
  }, AUTO_INTERVAL);
};

const resumeIfIdle = (): void => {
  if (!hovering.value && !cooling.value) startAuto();
};

const onHoverStart = (): void => {
  hovering.value = true;
  stopAuto();
};

const onHoverEnd = (): void => {
  hovering.value = false;
  resumeIfIdle();
};

const select = (index: number): void => {
  activeIndex.value = index;
  cooling.value = true;
  stopAuto();
  if (cooldownTimer !== undefined) clearTimeout(cooldownTimer);
  cooldownTimer = setTimeout(() => {
    cooling.value = false;
    resumeIfIdle();
  }, COOLDOWN);
};

onMounted(() => {
  motionSafe.value = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  startAuto();
  startTagRotation();
});

onUnmounted(() => {
  stopAuto();
  stopTagRotation();
  if (cooldownTimer !== undefined) clearTimeout(cooldownTimer);
});
</script>

<style scoped lang="scss">
.hardware-section {
  background-color: $color-primary-black;
}

// screen-reader-only text (full title inside the button)
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.hw-shell {
  display: block;
}

.hw-main {
  display: flex;
  align-items: flex-start;
  gap: clamp(20px, 3.5vw, 48px);
}

.hw-intro {
  flex: 0 0 clamp(200px, 25vw, 280px);
  margin-top: 24px;

  .section-header {
    margin-bottom: 0;
  }
}

.hardware-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
}

.hardware-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 7px 10px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: $color-black-soft;
  color: $color-gray-light;
  font-family: $font-display;
  font-size: clamp(10px, 0.9vw, 12px);
  font-weight: 700;
  letter-spacing: 0.8px;
  line-height: 1;
  opacity: 0.72;
  white-space: nowrap;
  transition:
    background-color 0.35s ease,
    border-color 0.35s ease,
    color 0.35s ease,
    opacity 0.35s ease;

  &.active {
    border-color: $color-white;
    background: $color-white;
    color: $color-primary-black;
    opacity: 1;
  }
}

// ── slanted accordion ───────────────────────────────────────
.hw-accordion {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  // slant matches the hero exactly: horizontal offset = height × (4.8vw / 100vh)
  --accordion-h: clamp(440px, 55vw, 580px);
  --slant-angle: 4deg; // fallback matching the hero's skewX(-4deg) magnitude
  --slant-tan: 0.07; // ≈ tan(4°) fallback
  --slant: calc(var(--slant-tan) * var(--accordion-h));
  height: var(--accordion-h);
}

@supports (transform: skewX(atan2(1vw, 1vh))) {
  .hw-accordion {
    --slant-angle: atan2(4.8vw, 100vh);
    --slant-tan: tan(atan2(4.8vw, 100vh));
  }
}

.hw-panel {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  transition: flex-grow 0.5s ease;

  // faint full-perimeter frame — skin insets 1px on all sides to reveal it
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.25);
    clip-path: polygon(var(--slant) 0, 100% 0, calc(100% - var(--slant)) 100%, 0 100%);
  }

  &.active {
    flex-grow: 4;
  }
}

// overlap each panel by one skew minus an 8px channel, so adjacent slanted
// edges run parallel with a narrow black gap between them
.hw-panel + .hw-panel {
  margin-left: calc(8px - var(--slant));
}

.hw-skin {
  position: absolute;
  inset: 0;
  background-color: $color-primary-black;
  // white diagonal stripes on collapsed panels too
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 0,
    rgba(255, 255, 255, 0.1) 2px,
    transparent 2px,
    transparent 10px
  );
  clip-path: polygon(
    calc(var(--slant) + 1px) 1px,
    calc(100% - 1px) 1px,
    calc(100% - var(--slant) - 1px) calc(100% - 1px),
    1px calc(100% - 1px)
  );
  transition: background-color $transition-med;

  .hw-panel.active & {
    background-color: $color-primary-blue;
    // faded diagonal hatch — industrial texture on the expanded panel
    background-image: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.05) 0,
      rgba(255, 255, 255, 0.05) 2px,
      transparent 2px,
      transparent 10px
    );
  }

  .hw-panel:not(.active):hover &,
  .hw-panel:not(.active):focus-visible & {
    background-color: #17171c;
  }

  .hw-panel.active:focus-visible & {
    background-color: $color-blue-bright;
  }
}

// oversized icon watermark bleeding off both sides — collapsed panel texture
.hw-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 260px;
  height: 260px;
  transform: translate(-50%, -50%);
  color: $color-white;
  opacity: 0.07;
  pointer-events: none;
  transition:
    opacity 0.4s ease,
    color 0.3s ease;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }

  .hw-panel.active & {
    opacity: 0;
  }

  .hw-panel:not(.active):hover & {
    color: $color-blue-bright;
    opacity: 0.3;
  }
}

// vertical stacked label — visible in both states
// upright stacked label, sheared parallel to the panel slant via skew
.hw-vlabel {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) skewX(calc(-1 * var(--slant-angle)));
  writing-mode: vertical-rl;
  text-orientation: upright;
  white-space: nowrap;
  font-family: $font-display;
  font-weight: 500;
  font-size: clamp(28px, 3vw, 42px);
  letter-spacing: 12px;
  color: $color-white;
  transition:
    left 0.5s ease,
    transform 0.5s ease,
    font-size 0.3s ease;

  // expanded: big label hugs the slanted left edge — origin pinned to the
  // left-center so the skew keeps the column parallel with a constant gap,
  // independent of letter count
  .hw-panel.active & {
    left: calc(var(--slant) / 2);
    transform: translateY(-50%) skewX(calc(-1 * var(--slant-angle)));
    transform-origin: 0 50%;
  }
}

// expanded content
.hw-detail {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  padding: 24px clamp(24px, 4vw, 48px) 24px clamp(54px, 8vw, 90px);
  color: $color-white;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  .hw-panel.active & {
    opacity: 1;
    transform: none;
    transition-delay: 0.2s;
  }
}

.hw-icon {
  margin-left: calc(var(--slant) * 0.6);
  width: clamp(56px, 7vw, 72px);
  height: clamp(56px, 7vw, 72px);
  color: $color-white;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.hw-name {
  margin-left: calc(var(--slant) * 0.4);
  font-family: $font-display;
  font-size: clamp(16px, 1.8vw, 24px);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  overflow-wrap: break-word;
}

.hw-desc {
  margin-left: calc(var(--slant) * 0.2);
  font-size: clamp(13px, 1.1vw, 15px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  overflow-wrap: break-word;
}

.hw-specs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

// rows keep stepping along the slant inside the spec list
.hw-spec:nth-child(1) {
  margin-left: calc(var(--slant) * 0.1);
}

.hw-spec:nth-child(2) {
  margin-left: calc(var(--slant) * 0.05);
}

.hw-spec {
  font-family: $font-display;
  font-size: 12px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
  overflow-wrap: break-word;

  &::before {
    content: "»";
    margin-right: 6px;
    color: rgba(255, 255, 255, 0.7);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hardware-tag {
    transition: none;
  }
}
// ── mobile: vertical accordion ──────────────────────────────
@include mobile {
  .hw-main {
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-lg;
  }

  .hw-intro {
    flex: none;
  }

  .hw-accordion {
    flex-direction: column;
    height: auto;
    gap: 8px;
  }

  .hw-panel {
    flex: none;
    width: 100%;
    margin-left: 0;
    display: grid;
    grid-template-rows: 48px 0fr;
    transition: grid-template-rows 0.6s ease;
    transition-delay: 0s;
    &.active {
      grid-template-rows: 48px 1fr;
    }

    &::before {
      // straight frame on mobile — no slant on the stacked layout
      clip-path: none;
    }
  }

  .hw-panel + .hw-panel {
    margin-left: 0;
  }

  .hw-skin {
    overflow: hidden;
    clip-path: inset(1px);
  }

  .hw-watermark {
    width: 120px;
    height: 120px;
  }

  // no slant effects on mobile: label fills the collapsed row
  .hw-vlabel {
    position: static;
    transform: none;
    writing-mode: horizontal-tb;
    align-self: center;
    justify-self: stretch;
    text-align: center;
    letter-spacing: 8px;
    font-size: clamp(18px, 6vw, 26px);

    .hw-panel.active & {
      transform: none;
      font-size: clamp(18px, 6vw, 26px);
    }
  }

  .hw-icon,
  .hw-name,
  .hw-desc,
  .hw-specs,
  .hw-spec {
    margin-left: 0;
  }

  .hw-detail {
    position: static;
    overflow: hidden;
    opacity: 0;
    transition-delay: 0s;
    padding: 0 24px;
    transform: none;
    padding-bottom: 0;
    justify-content: flex-start;
    transition: opacity 2s ease;

    .hw-panel.active & {
      opacity: 1;
    }
  }
  .hw-specs {
    padding-bottom: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hw-panel,
  .hw-skin,
  .hw-vlabel,
  .hw-detail {
    transition: none;
  }
}
</style>
