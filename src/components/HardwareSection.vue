<template>
  <section class="hardware-section">
    <div class="section-shell hw-shell">
      <div class="hw-main">
        <div class="hw-intro">
          <header v-reveal>
            <h2 class="hw-header-title">技术支持</h2>
            <p class="hw-header-subtitle">强劲的服务与支持为服务器保驾护航</p>
          </header>
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
          <p class="hw-display" aria-hidden="true" v-reveal>TECH<br />SUPPORT</p>
        </div>

        <div
          class="hw-accordion"
          :style="{ '--hw-cycle': `${AUTO_INTERVAL}ms` }"
          v-reveal
          @mouseenter="onHoverStart"
          @mouseleave="onHoverEnd"
        >
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
              <span class="hw-watermark" v-html="item.icon"></span>
              <span
                v-if="rotating && i === activeIndex"
                :key="`${activeIndex}-${cycle}`"
                class="hw-progress"
              ></span>
            </span>
            <span class="hw-head" aria-hidden="true">
              <span class="hw-index">{{ pad(i + 1) }}</span>
              <span class="hw-code">
                <span v-for="(char, c) in item.short" :key="c" class="hw-char">{{ char }}</span>
              </span>
            </span>
            <span class="hw-detail">
              <span class="hw-metric" aria-hidden="true">
                {{ item.metric.value }}<span class="hw-unit">{{ item.metric.unit }}</span>
              </span>
              <span class="hw-name">{{ item.title }}</span>
              <span class="hw-desc">{{ item.description }}</span>
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

// Line drawings on a 64×64 grid; rendered as hairline background marks.
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

// `metric` is the panel's headline figure, set large on the expanded panel.
interface HardwareSpec {
  short: string;
  title: string;
  description: string;
  icon: string;
  metric: { value: string; unit: string };
}

const hardware: HardwareSpec[] = [
  {
    short: "CPU",
    title: "CPU — i9-13900K",
    description:
      "Intel 酷睿 i9-13900K，24 核 32 线程（8 个性能核 + 16 个能效核），主频可达 5.8–6.0GHz，配备 36MB 智能缓存。高主频让单线程的游戏逻辑运算稳定流畅，多核心则承担区块加载、备份等后台任务，为服务器提供充沛算力。",
    icon: icons.cpu,
    metric: { value: "5.8", unit: "GHZ" },
  },
  {
    short: "RAM",
    title: "RAM — DDR5 5600MHz 内存",
    description:
      "两条 48GB 幻锋戟 DDR5-5600MHz 内存组成双通道，总容量 96GB。高频带宽加快数据交换，大容量可同时常驻更多已加载区块、实体与后台服务，保障多人在线时依然流畅运行。",
    icon: icons.ram,
    metric: { value: "96", unit: "GB" },
  },
  {
    short: "RAID",
    title: "Storage — 2TB × 4 RAID 10",
    description:
      "4 块 2TB M.2 NVMe SSD 组成 RAID 10 存储阵列，可用容量 4TB。条带化提升并发读写速度，镜像冗余让任意一块硬盘故障时数据仍完整可用，兼顾速度、容量与数据安全。",
    icon: icons.storage,
    metric: { value: "4", unit: "TB" },
  },
];

const pad = (n: number): string => String(n).padStart(2, "0");

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
// `rotating` mirrors `autoTimer`; `cycle` counts restarts so the progress
// bar (keyed on index + cycle) restarts in step with a fresh interval.
const rotating = ref(false);
const cycle = ref(0);

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
  rotating.value = false;
};

const startAuto = (): void => {
  if (!motionSafe.value || autoTimer !== undefined) return;
  cycle.value++;
  rotating.value = true;
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
// Dark in both themes: in light it continues the timer's dark block, with
// yellow as the brand ink and the open panel a yellow block.
.hardware-section {
  @include dark-surface;
  background-color: $color-bg;
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
  align-items: stretch;
  gap: clamp(20px, 3.5vw, 48px);
}

// stretched to the accordion's height so the display type can sit on the
// accordion's bottom line; stacked under the accordion (z-index) so type
// running past the column is cut by the first panel's slanted edge
.hw-intro {
  position: relative;
  z-index: 0;
  display: flex;
  flex: 0 0 clamp(200px, 25vw, 280px);
  flex-direction: column;
  margin-top: 24px;
}

// same size as `.github-title-cn` in GithubProjects.vue: fixed h2 on
// mobile, scaled down with the viewport above it; change both together
.hw-header-title {
  font-size: $font-size-h2;
  line-height: 1.1;
  color: $color-fg;

  @include desktop {
    font-size: clamp(32px, calc(2.86vw + 13.66px), 48px);
  }

  // solid accent rule under the title, spanning the intro column
  &::after {
    content: "";
    display: block;
    height: 6px;
    margin-top: 12px;
    background: $color-accent;
  }
}

.hw-header-subtitle {
  margin-top: 12px;
  font-size: 14px;
  letter-spacing: 1px;
  color: $color-fg-muted;
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
  border: 1px solid fade($color-fg, 0.28);
  background: $color-surface;
  color: $color-fg-muted;
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
    border-color: $color-fg;
    background: $color-fg;
    color: $color-bg;
    opacity: 1;

    // the highlighted tag is a selected state: yellow block, not inverted ink
    @include light {
      border-color: $color-accent;
      background: $color-accent;
      color: $color-on-accent;
    }
  }
}

// oversized section name closing the column, baseline on the accordion's
// bottom edge; decorative (the h2 names the section)
.hw-display {
  margin-top: auto;
  padding-top: $spacing-md;
  font-family: $font-display;
  font-size: clamp(50px, 6.6vw, 98px);
  font-weight: 500;
  line-height: 0.88;
  letter-spacing: -1px;
  white-space: nowrap;
  color: $color-accent-ink;
  pointer-events: none;
  user-select: none;
}

// ── slanted accordion ───────────────────────────────────────
// Flat color blocks and lines only. Each panel is a parallelogram on the hero
// slant: a background-colored block with a hairline frame when collapsed, a
// solid accent block when expanded, with its part icon drawn in hairlines in
// the bottom-right corner. Its index sits on a rule across the top; the
// expanded face stacks one large figure, the title, and the description,
// every line starting a fixed gap from the slanted left edge; an on-accent
// line along the bottom times the auto-rotation. Icon and progress line live
// inside `.hw-skin`, so its clip-path cuts them to the slant.
.hw-accordion {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  // slant matches the hero exactly (shared `--hero-slant`, global.scss):
  // horizontal offset = accordion height × tan(hero slant)
  --accordion-h: clamp(440px, 55vw, 580px);
  --slant: calc(var(--hero-slant-tan) * var(--accordion-h));
  // one curve and length for everything that moves with the panel width
  --hw-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --hw-dur: 0.55s;
  // distance from the slanted left edge to every line of text (index,
  // expanded face); the collapsed code is centered instead
  --text-gap: 40px;
  height: var(--accordion-h);
}

.hw-panel {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: $color-fg;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  outline: none;
  transition: flex-grow var(--hw-dur) var(--hw-ease);

  // hairline frame — the skin insets 1px on all sides to reveal it
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: fade($color-fg, 0.2);
    clip-path: polygon(var(--slant) 0, 100% 0, calc(100% - var(--slant)) 100%, 0 100%);
    transition: background-color $transition-med;
  }

  &:hover::before,
  &:focus-visible::before {
    background: $color-fg;
  }

  // everything on the expanded face sits on the accent fill
  &.active {
    flex-grow: 4;
    color: $color-on-accent;

    // the frame continues the skin's fill, so it is a fill, not a line
    &::before {
      background: $color-accent;
    }
  }

  &.active:focus-visible::before {
    background: $color-fg;
  }
}

// overlap each panel by one slant minus an 8px channel, so adjacent slanted
// edges run parallel with a narrow background gap between them
.hw-panel + .hw-panel {
  margin-left: calc(8px - var(--slant));
}

.hw-skin {
  position: absolute;
  inset: 0;
  background-color: $color-bg;
  clip-path: polygon(
    calc(var(--slant) + 1px) 1px,
    calc(100% - 1px) 1px,
    calc(100% - var(--slant) - 1px) calc(100% - 1px),
    1px calc(100% - 1px)
  );
  transition: background-color $transition-med;

  .hw-panel.active & {
    background-color: $color-accent;
  }
}

// anchored to the bottom-right corner, so it rides the right edge as the
// panel widens; strokes stay hairline at any size
.hw-watermark {
  position: absolute;
  right: -40px;
  bottom: -40px;
  width: clamp(240px, 24vw, 320px);
  aspect-ratio: 1;
  color: $color-fg;
  opacity: 0.1;
  transition: opacity $transition-med;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(svg *) {
    vector-effect: non-scaling-stroke;
    stroke-width: 1.5px;
  }

  .hw-panel:hover &,
  .hw-panel:focus-visible & {
    opacity: 0.2;
  }

  .hw-panel.active & {
    color: $color-on-accent;
    opacity: 0.3;
  }
}

// auto-rotation timer: remounted per interval (see `cycle`), so it always
// fills in step with the next switch
.hw-progress {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: $color-on-accent;
  transform-origin: 0 50%;
  animation: hw-progress var(--hw-cycle) linear both;
}

@keyframes hw-progress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

// index on a rule at the top, part code at the bottom. The index is pushed
// in by one slant because the panel's left edge starts there at the top.
.hw-head {
  position: absolute;
  z-index: 1;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 24px var(--text-gap);
  font-family: $font-display;
  font-weight: 700;
  white-space: nowrap;
}

.hw-index {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: var(--slant);
  font-size: 14px;
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
  color: $color-fg-subtle;
  transition: color $transition-med;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.5;
  }

  .hw-panel:hover &,
  .hw-panel:focus-visible & {
    color: $color-fg;
  }

  .hw-panel.active & {
    color: $color-on-accent;
  }
}

// Collapsed only: reads bottom-up, centered on the panel's slanted midline,
// which at height d above the bottom edge is at (W - slant) / 2 + tan * d.
// The column shears at the hero slant from its bottom center, placed on the
// midline 24px up; each letter undoes the shear about its own center, so the
// letters keep their shape and only step right with height (`hw-char`).
.hw-code {
  position: absolute;
  bottom: 24px;
  left: calc((100% - var(--slant)) / 2 + var(--hero-slant-tan) * 24px);
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 4px;
  font-size: clamp(28px, 3vw, 40px);
  color: $color-fg-muted;
  transform: translateX(-50%) skewX(calc(-1 * var(--hero-slant)));
  transform-origin: 50% 100%;
  transition:
    opacity $transition-med 0.3s,
    color $transition-med;

  .hw-panel:hover &,
  .hw-panel:focus-visible & {
    color: $color-fg;
  }

  // hidden on desktop; on mobile it stays in the open panel's head row,
  // where light needs it black on yellow (dark keeps the muted gray)
  .hw-panel.active & {
    opacity: 0;
    transition:
      opacity 0.15s ease-out,
      color $transition-med;

    @include light {
      color: $color-on-accent;
    }
  }
}

// rotate and shear commute, so this leaves each letter only rotated
.hw-char {
  writing-mode: vertical-rl;
  transform: rotate(180deg) skewX(var(--hero-slant));
}

// expanded face: figure, title, and description stacked from the top
.hw-detail {
  position: absolute;
  z-index: 1;
  inset: 0;
  padding-right: calc(var(--slant) + 24px);
  opacity: 0;
  transform: translateY(8px);
  // leaving: vanish before the panel narrows so the text is never squeezed
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;

  // Full-height left float whose `shape-outside` runs parallel to the
  // slanted left edge, `--text-gap` inside it, so every line of text starts
  // the same distance from the edge at any height. Requires block layout
  // (floats do nothing in flex) and no vertical padding here, so the float
  // spans exactly the panel height.
  &::before {
    content: "";
    float: left;
    width: calc(var(--slant) + var(--text-gap));
    height: 100%;
    shape-outside: polygon(0 0, 100% 0, var(--text-gap) 100%, 0 100%);
  }

  // entering: wait until the panel is mostly wide, then settle in
  .hw-panel.active & {
    opacity: 1;
    transform: none;
    transition:
      opacity $transition-med 0.3s,
      transform $transition-med 0.3s;
  }
}

.hw-metric {
  display: block;
  padding-top: 64px;
  font-family: $font-display;
  font-size: clamp(72px, 8vw, 120px);
  font-weight: 700;
  line-height: 0.85;
  letter-spacing: -3px;
  font-variant-numeric: tabular-nums;
}

.hw-unit {
  margin-left: 8px;
  font-size: clamp(18px, 2vw, 24px);
  letter-spacing: 2px;
  opacity: 0.7;
}

.hw-name {
  display: block;
  margin-top: 32px;
  font-family: $font-display;
  font-size: clamp(16px, 1.6vw, 22px);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  overflow-wrap: break-word;
}

.hw-desc {
  display: block;
  max-width: 44em;
  margin-top: 12px;
  font-size: clamp(13px, 1.1vw, 15px);
  line-height: 1.7;
  color: fade($color-on-accent, 0.88);
  overflow-wrap: break-word;
}

@media (prefers-reduced-motion: reduce) {
  .hardware-tag {
    transition: none;
  }
}

// ── mobile: vertical accordion ──────────────────────────────
// `--slant: 0px` straightens every clip-path and offset above; each panel
// becomes a grid of the head row (always visible) and the face, which grows
// from 0fr. Head and face are `relative`, not static, so they keep their
// z-index over the absolutely positioned skin.
@include mobile {
  .hw-main {
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-lg;
  }

  .hw-intro {
    flex: none;
  }

  // stacked layout has no bottom line to anchor to
  .hw-display {
    display: none;
  }

  .hw-accordion {
    flex-direction: column;
    gap: 8px;
    height: auto;
    --slant: 0px;
  }

  .hw-panel {
    flex: none;
    display: grid;
    grid-template-rows: 56px 0fr;
    width: 100%;
    transition: grid-template-rows var(--hw-dur) var(--hw-ease);

    &.active {
      grid-template-rows: 56px 1fr;
    }
  }

  .hw-panel + .hw-panel {
    margin-left: 0;
  }

  .hw-head {
    position: relative;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    padding: 0 16px;
  }

  .hw-index::after {
    display: none;
  }

  .hw-code,
  .hw-panel.active .hw-code {
    position: static;
    flex-direction: row;
    transform: none;
    opacity: 1;
    font-size: 20px;
  }

  .hw-char {
    writing-mode: horizontal-tb;
    transform: none;
  }

  // the icon only shows on the open panel; in a 56px row it is just noise
  .hw-watermark {
    right: -24px;
    bottom: -24px;
    width: 160px;
    opacity: 0;

    .hw-panel:hover &,
    .hw-panel:focus-visible & {
      opacity: 0;
    }

    .hw-panel.active & {
      opacity: 0.3;
    }
  }

  // vertical spacing on the children, not the face: padding on a 0fr grid
  // item would keep it from collapsing fully. No slant, so no float.
  .hw-detail {
    position: relative;
    min-height: 0;
    overflow: hidden;
    padding: 0 16px;
    transform: none;

    &::before {
      display: none;
    }

    .hw-panel.active & {
      transform: none;
      transition: opacity $transition-med 0.2s;
    }
  }

  .hw-metric {
    padding-top: 8px;
    font-size: clamp(56px, 18vw, 80px);
  }

  .hw-name {
    margin-top: 24px;
  }

  .hw-desc {
    margin-bottom: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hw-panel,
  .hw-panel::before,
  .hw-skin,
  .hw-watermark,
  .hw-index,
  .hw-code,
  .hw-panel.active .hw-code,
  .hw-detail,
  .hw-panel.active .hw-detail {
    transition: none;
  }
}
</style>
