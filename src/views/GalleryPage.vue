<template>
  <div class="gallery-page">
    <header class="gallery-heading">
      <div class="gallery-shell heading-grid">
        <div class="heading-main">
          <p class="gallery-kicker">
            <span class="kicker-mark" aria-hidden="true"></span>
            LAS // VISUAL ARCHIVE
          </p>
          <h1>画廊<span class="heading-en">GALLERY</span></h1>
          <p class="heading-lead">
            服务器中的建筑、机械与红石工程，记录 Lazy Alien Server 成员共同建造的世界。
          </p>
        </div>
        <dl class="gallery-spec">
          <div class="spec-field">
            <dt>FRAMES</dt>
            <dd>{{ pad(galleryItems.length) }}</dd>
          </div>
          <div class="spec-field">
            <dt>CATEGORIES</dt>
            <dd>{{ pad(galleryCategories.length) }}</dd>
          </div>
          <div class="spec-field">
            <dt>SINCE</dt>
            <dd><time datetime="2022-08-29">2022.08.29</time></dd>
          </div>
        </dl>
      </div>
    </header>

    <div class="gallery-toolbar">
      <div class="gallery-shell toolbar-inner">
        <div class="filter" role="group" aria-label="按类别筛选">
          <button
            v-for="option in filterOptions"
            :key="option.id"
            type="button"
            class="filter-btn"
            :aria-pressed="filter === option.id"
            @click="filter = option.id"
          >
            {{ option.label }}
            <span class="filter-count">{{ pad(option.count) }}</span>
          </button>
        </div>

        <p class="toolbar-status" aria-live="polite">
          SHOWING <strong>{{ pad(visible.length) }}</strong> / {{ pad(galleryItems.length) }}
        </p>

        <div class="view-toggle" role="group" aria-label="显示方式">
          <button
            type="button"
            :aria-pressed="view === 'grid'"
            aria-label="网格视图"
            @click="view = 'grid'"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M1 1h6v6H1zM9 1h6v6H9zM1 9h6v6H1zM9 9h6v6H9z" />
            </svg>
            GRID
          </button>
          <button
            type="button"
            :aria-pressed="view === 'index'"
            aria-label="索引视图"
            @click="view = 'index'"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M1 2h14v2H1zM1 7h14v2H1zM1 12h14v2H1z" />
            </svg>
            INDEX
          </button>
        </div>
      </div>
    </div>

    <main class="gallery-shell gallery-body">
      <!-- Keyed by view + filter so both toggles fade the old layout out
           and re-mount the new one, which replays the staggered entry. -->
      <Transition name="swap" mode="out-in">
        <p v-if="!visible.length" key="empty" class="gallery-empty">该类别暂无作品 // NO FRAMES</p>

        <ol
          v-else-if="view === 'grid'"
          :key="`grid-${filter}`"
          class="gallery-grid"
          aria-label="画廊作品"
        >
          <li
            v-for="(entry, index) in visible"
            :key="entry.item.id"
            class="frame"
            :class="`frame--${layoutOf(index)}`"
            :style="{ '--i': index }"
          >
            <button
              type="button"
              class="frame-trigger"
              :aria-label="`查看大图：${entry.item.title}`"
              @click="open(index)"
            >
              <span
                class="frame-media"
                @pointermove="trackCursor($event, entry.item.width, entry.item.height)"
              >
                <img
                  :src="entry.item.src"
                  :alt="entry.item.title"
                  :width="entry.item.width"
                  :height="entry.item.height"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  decoding="async"
                />
                <span class="frame-cursor" aria-hidden="true">
                  <span class="cursor-reticle"></span>
                  <span class="cursor-coords"> X<b>0000</b>Y<b>0000</b> </span>
                </span>
                <span class="frame-plate" aria-hidden="true">{{ entry.number }}</span>
                <span class="frame-hud" aria-hidden="true">
                  <span>{{ entry.item.width }} × {{ entry.item.height }} PX</span>
                  <span class="hud-action">查看 / VIEW</span>
                </span>
              </span>
              <span class="frame-caption">
                <span class="frame-index">{{ entry.number }}</span>
                <span class="frame-title">
                  <span class="frame-title-cn">{{ entry.item.title }}</span>
                  <span class="frame-title-en">{{ entry.item.titleEn }}</span>
                </span>
                <span class="frame-category">
                  {{ entry.category.label }} / {{ entry.category.labelEn }}
                </span>
              </span>
            </button>
          </li>
        </ol>

        <div v-else :key="`index-${filter}`" class="gallery-index">
          <div class="index-table">
            <p class="index-head" aria-hidden="true">
              <span>NO.</span><span>标题 / TITLE</span><span>类别</span><span>尺寸 / PX</span>
            </p>
            <ol aria-label="画廊索引">
              <li v-for="(entry, index) in visible" :key="entry.item.id" :style="{ '--i': index }">
                <button
                  type="button"
                  class="index-row"
                  :class="{ 'is-previewed': previewEntry === entry }"
                  :aria-label="`查看大图：${entry.item.title}`"
                  @mouseenter="previewIndex = index"
                  @focus="previewIndex = index"
                  @click="open(index)"
                >
                  <span class="index-no">{{ entry.number }}</span>
                  <span class="index-title">
                    {{ entry.item.title }}<span>{{ entry.item.titleEn }}</span>
                  </span>
                  <span class="index-category">{{ entry.category.label }}</span>
                  <span class="index-size">{{ entry.item.width }} × {{ entry.item.height }}</span>
                </button>
              </li>
            </ol>
          </div>

          <figure v-if="previewEntry" class="index-preview" aria-hidden="true">
            <span class="frame-media">
              <img
                :src="previewEntry.item.src"
                alt=""
                :width="previewEntry.item.width"
                :height="previewEntry.item.height"
              />
              <span class="frame-plate">{{ previewEntry.number }}</span>
            </span>
            <figcaption>
              <span>{{ previewEntry.item.titleEn }}</span>
              <span>{{ previewEntry.category.labelEn }}</span>
            </figcaption>
          </figure>
        </div>
      </Transition>
    </main>

    <dialog
      ref="viewer"
      class="viewer"
      aria-label="图片查看器"
      @close="onClose"
      @click.self="close"
      @keydown.left.prevent="step(-1)"
      @keydown.right.prevent="step(1)"
      @wheel="onWheel"
    >
      <figure v-if="activeEntry" class="viewer-figure">
        <div class="viewer-stage" :class="edge && `is-edge-${edge}`">
          <!-- Keyed per image so each switch swaps elements: the old image
               slides and shrinks away while the new one slides in and grows.
               `direction` is `none` on open, which has no CSS, so opening
               keeps only the dialog shutter. -->
          <Transition :name="`switch-${direction}`">
            <img
              :key="activeEntry.item.id"
              :src="activeEntry.item.src"
              :alt="activeEntry.item.title"
              :width="activeEntry.item.width"
              :height="activeEntry.item.height"
              @pointermove="trackEdge"
              @pointerleave="edge = null"
              @click="edge && step(edge === 'next' ? 1 : -1)"
            />
          </Transition>
        </div>
        <figcaption class="viewer-bar">
          <span class="viewer-count">
            <strong>{{ pad(activeIndex + 1) }}</strong> / {{ pad(visible.length) }}
          </span>
          <span class="viewer-title">
            {{ activeEntry.item.title }}
            <span>
              {{ activeEntry.item.titleEn }} // {{ activeEntry.category.labelEn }} //
              {{ activeEntry.item.width }} × {{ activeEntry.item.height }} PX
            </span>
          </span>
          <span class="viewer-controls">
            <button type="button" aria-label="上一张" @click="step(-1)">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" aria-label="下一张" @click="step(1)">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button type="button" class="viewer-close" aria-label="关闭" @click="close">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </span>
        </figcaption>
        <div class="viewer-strip" role="group" aria-label="选择图片">
          <button
            v-for="(entry, index) in visible"
            :key="entry.item.id"
            type="button"
            :aria-label="entry.item.title"
            :aria-current="index === activeIndex ? 'true' : undefined"
            @click="goTo(index)"
          >
            <img :src="entry.item.src" alt="" loading="lazy" decoding="async" />
            <span>{{ entry.number }}</span>
          </button>
        </div>
      </figure>
    </dialog>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, useTemplateRef, watch } from "vue";
import FooterSection from "@/components/FooterSection.vue";
import { galleryCategories, galleryItems } from "@/data/gallery";

const pad = (value: number): string => String(value).padStart(2, "0");

// Archive numbers come from the full list, so filtering never renumbers a frame.
const entries = galleryItems.map((item, index) => ({
  item,
  number: pad(index + 1),
  category: galleryCategories.find((category) => category.id === item.category) ?? {
    id: item.category,
    label: item.category,
    labelEn: item.category.toUpperCase(),
  },
}));
type Entry = (typeof entries)[number];

const ALL = "all";
const filterOptions = [
  { id: ALL, label: "全部", count: entries.length },
  ...galleryCategories.map((category) => ({
    id: category.id,
    label: category.label,
    count: entries.filter((entry) => entry.item.category === category.id).length,
  })),
];

const filter = ref(ALL);
const view = ref<"grid" | "index">("grid");
const visible = computed<Entry[]>(() =>
  filter.value === ALL ? entries : entries.filter((entry) => entry.item.category === filter.value),
);

// Repeating three-frame rhythm: a full-width plate, then a 7/5 column pair.
const layouts = ["wide", "major", "minor"] as const;
const layoutOf = (index: number) => layouts[index % layouts.length];

const pad4 = (value: number): string => String(value).padStart(4, "0");

// Moves the crosshair via `--cx`/`--cy` and writes the pointer position in
// source-image pixels, undoing the `object-fit: cover` scale and crop.
// Writes the DOM directly so pointer moves never trigger a Vue render.
const trackCursor = (event: PointerEvent, width: number, height: number) => {
  const target = event.currentTarget as HTMLElement;
  const bounds = target.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  target.style.setProperty("--cx", `${x}px`);
  target.style.setProperty("--cy", `${y}px`);

  const scale = Math.max(bounds.width / width, bounds.height / height);
  const sourceX = (x - (bounds.width - width * scale) / 2) / scale;
  const sourceY = (y - (bounds.height - height * scale) / 2) / scale;
  const [xOut, yOut] = target.querySelectorAll<HTMLElement>(".cursor-coords b");
  if (!xOut || !yOut) return;
  xOut.textContent = pad4(Math.min(width - 1, Math.max(0, Math.floor(sourceX))));
  yOut.textContent = pad4(Math.min(height - 1, Math.max(0, Math.floor(sourceY))));
};

const previewIndex = ref(0);
const previewEntry = computed(() => visible.value[previewIndex.value] ?? visible.value[0]);
watch(filter, () => {
  previewIndex.value = 0;
});

const viewer = useTemplateRef<HTMLDialogElement>("viewer");
const activeIndex = ref(0);
const direction = ref<"next" | "prev" | "none">("none");
const activeEntry = computed(() => visible.value[activeIndex.value]);

const open = (index: number) => {
  activeIndex.value = index;
  direction.value = "none";
  document.documentElement.style.overflow = "hidden";
  viewer.value?.showModal();
};
const close = () => viewer.value?.close();
const onClose = () => {
  document.documentElement.style.overflow = "";
};
const step = (delta: number) => {
  const total = visible.value.length;
  direction.value = delta > 0 ? "next" : "prev";
  activeIndex.value = (activeIndex.value + delta + total) % total;
};
const goTo = (index: number) => {
  if (index === activeIndex.value) return;
  direction.value = index > activeIndex.value ? "next" : "prev";
  activeIndex.value = index;
};

// Mouse edge zones: the outer 20% of the image on each side steps on click,
// and the stage class swaps the cursor for a direction arrow.
const edge = ref<"next" | "prev" | null>(null);
const trackEdge = (event: PointerEvent) => {
  if (event.pointerType !== "mouse" || visible.value.length < 2) {
    edge.value = null;
    return;
  }
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const ratio = (event.clientX - bounds.left) / bounds.width;
  edge.value = ratio < 0.2 ? "prev" : ratio > 0.8 ? "next" : null;
};

// Wheel stepping: down = next, up = previous. A wheel or trackpad gesture
// fires a burst of events (plus inertia), so it steps once per burst. A
// 200ms gap between events, or 700ms of continuous scrolling, re-arms it so
// separate notches or a held spin still step more than once.
const WHEEL_GAP = 200;
const WHEEL_REPEAT = 700;
let lastWheel = 0;
let lastWheelStep = 0;
const onWheel = (event: WheelEvent) => {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  event.preventDefault();
  const now = event.timeStamp;
  const armed = now - lastWheel > WHEEL_GAP || now - lastWheelStep > WHEEL_REPEAT;
  lastWheel = now;
  if (!armed || visible.value.length < 2) return;
  lastWheelStep = now;
  step(event.deltaY > 0 ? 1 : -1);
};

onUnmounted(onClose);
</script>

<style scoped lang="scss">
.gallery-page {
  background: $color-primary-black;
  min-height: 100vh;
  padding-top: var(--site-nav-height, 84px);
}

.gallery-shell {
  max-width: calc(#{$content-max-width} + 2 * #{$spacing-md});
  margin: 0 auto;
  padding-inline: $spacing-md;
}

// ---------- Header: blueprint band, 12-column type block ----------
.gallery-heading {
  position: relative;
  border-bottom: 1px solid $color-gray-dark;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(180deg, #000 0%, transparent 100%);
    pointer-events: none;
  }
}

.heading-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: $spacing-md;
  align-items: end;
  padding-top: 72px;
  padding-bottom: 40px;
}

.heading-main {
  grid-column: 1 / span 7;

  h1 {
    display: flex;
    align-items: baseline;
    gap: $spacing-sm;
    font-size: clamp(32px, 4vw, 48px);
    line-height: 1.05;
    color: $color-white;
  }
}

.heading-en {
  font-family: $font-display;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 4px;
  color: $color-blue-bright;
}

.gallery-kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-family: $font-display;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
  color: $color-gray-mid;
}

.kicker-mark {
  flex: none;
  width: 22px;
  height: 10px;
  margin-right: 4px;
  background: $color-blue-bright;
  transform: skewX(-20deg);
}

.heading-lead {
  max-width: 34em;
  margin-top: $spacing-sm;
  color: $color-gray-light;
  font-size: 15px;
  line-height: 1.8;
}

.gallery-spec {
  grid-column: 9 / span 4;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 3px solid $color-blue-bright;
}

.spec-field {
  padding: 10px 12px 0 0;

  & + & {
    padding-left: 12px;
    border-left: 1px solid $color-gray-dark;
  }

  dt {
    font-family: $font-display;
    font-size: 10px;
    letter-spacing: 2px;
    color: $color-gray-mid;
  }

  dd {
    font-family: $font-display;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    font-variant-numeric: tabular-nums;
    color: $color-white;
  }
}

// ---------- Toolbar: sticky control strip ----------
.gallery-toolbar {
  position: sticky;
  top: var(--site-nav-height, 84px);
  z-index: 4;
  border-bottom: 1px solid $color-gray-dark;
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(8px);
}

.toolbar-inner {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  min-height: 56px;
}

// Segmented controls share one hairline frame; the pressed segment fills blue.
%segment {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 14px;
  border: 1px solid $color-gray-dark;
  background: none;
  color: $color-gray-mid;
  font-family: $font-display;
  font-size: 12px;
  letter-spacing: 2px;
  cursor: pointer;
  transition:
    color $transition-fast,
    background-color $transition-fast,
    border-color $transition-fast;

  & + & {
    margin-left: -1px;
  }

  &:hover {
    color: $color-white;
  }

  &[aria-pressed="true"] {
    position: relative;
    border-color: $color-blue-bright;
    background: $color-primary-blue;
    color: $color-white;
  }

  &:focus-visible {
    position: relative;
    z-index: 1;
    outline: 2px solid $color-blue-bright;
    outline-offset: 2px;
  }
}

.filter {
  display: flex;
}

.filter-btn {
  @extend %segment;
}

.filter-count {
  font-size: 10px;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
  opacity: 0.6;
}

.toolbar-status {
  margin-left: auto;
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
  color: $color-gray-mid;

  strong {
    color: $color-blue-bright;
  }
}

.view-toggle {
  display: flex;

  button {
    @extend %segment;
  }

  svg {
    fill: currentColor;
  }
}

// ---------- Grid view: 12 / 7+5 rhythm ----------
.gallery-body {
  padding-top: 56px;
  padding-bottom: 120px;
}

.gallery-empty {
  padding: 96px 0;
  border: 1px dashed $color-gray-dark;
  text-align: center;
  font-family: $font-display;
  letter-spacing: 3px;
  color: $color-gray-mid;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 56px $spacing-md;
  list-style: none;
}

// ---------- View / filter swap ----------
// The old layout fades out (`<Transition mode="out-in">`), then frames and
// index rows of the new one rise in one after another, staggered by `--i`.
.swap-enter-active,
.swap-leave-active {
  transition: opacity $transition-fast;
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}

@keyframes item-rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

.frame,
.index-table li {
  animation: item-rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i, 0) * 60ms);
}

.frame {
  min-width: 0;

  &--wide {
    grid-column: 1 / -1;

    .frame-media {
      aspect-ratio: 21 / 9;
    }
  }

  &--major {
    grid-column: 1 / span 7;
  }

  // Dropped one module so the pair reads as an asymmetric composition.
  &--minor {
    grid-column: 8 / span 5;
    margin-top: 56px;
  }
}

.frame-trigger {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: zoom-in;

  // Corner brackets just outside the whole frame (image + caption).
  &::after {
    content: "";
    position: absolute;
    inset: -12px;
    @include corner-brackets(16px, 2px, $color-blue-bright, 0px);
    opacity: 0;
    transition: opacity $transition-med;
    pointer-events: none;
  }

  &:focus-visible {
    outline: 2px solid $color-blue-bright;
    outline-offset: 6px;
  }
}

.frame-media {
  position: relative;
  display: block;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: $color-black-soft;
  border: 1px solid $color-gray-dark;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.7) brightness(0.85);
    transition: filter $transition-med;
  }
}

// Pointer crosshair: full-length hairlines plus a split-square reticle. Only
// for hover-capable fine pointers; the native cursor is hidden there.
// `trackCursor` writes `--cx`/`--cy` straight to the element (no reactivity).
.frame-cursor {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity $transition-fast;
  pointer-events: none;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: rgba(255, 255, 255, 0.35);
  }

  &::before {
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    transform: translate3d(0, var(--cy, 50%), 0);
  }

  &::after {
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    transform: translate3d(var(--cx, 50%), 0, 0);
  }
}

.cursor-reticle {
  --size: 28px;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: var(--size);
  height: var(--size);
  margin: calc(var(--size) / -2) 0 0 calc(var(--size) / -2);
  border: 2px solid $color-blue-bright;
  background:
    linear-gradient($color-blue-bright, $color-blue-bright) center / 2px 100% no-repeat,
    linear-gradient($color-blue-bright, $color-blue-bright) center / 100% 2px no-repeat,
    rgba(10, 10, 10, 0.35);
  transform: translate3d(var(--cx, 50%), var(--cy, 50%), 0);

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    background: #6cb8ff;
  }
}

.cursor-coords {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 4px 10px;
  background: rgba(10, 10, 10, 0.82);
  border-bottom: 1px solid $color-blue-bright;
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 2px;
  color: $color-gray-mid;

  b {
    margin: 0 10px 0 6px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: $color-white;

    &:last-child {
      margin-right: 0;
    }
  }
}

@media (hover: hover) and (pointer: fine) {
  .frame-trigger .frame-media {
    cursor: none;

    &:hover .frame-cursor {
      opacity: 1;
    }
  }
}

// Flush-left index plate on the frame's top edge.
.frame-plate {
  position: absolute;
  top: 0;
  left: 0;
  padding: 4px 12px;
  background: $color-primary-blue;
  color: $color-white;
  font-family: $font-display;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
}

// Data strip slides up from the bottom edge on hover/focus.
.frame-hud {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(10, 10, 10, 0.82);
  border-top: 1px solid $color-blue-bright;
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
  color: $color-gray-light;
  transform: translateY(100%);
  transition: transform $transition-med;
}

.hud-action {
  color: $color-blue-bright;
}

.frame-caption {
  position: relative;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  align-items: baseline;
  gap: $spacing-sm;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid $color-gray-dark;

  &::before {
    content: "";
    position: absolute;
    top: -2px;
    left: 0;
    width: 0;
    height: 3px;
    background: $color-blue-bright;
    transition: width $transition-med;
  }
}

.frame-index {
  font-family: $font-display;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: $color-blue-bright;
}

.frame-title {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 12px;
  min-width: 0;
}

.frame-title-cn {
  font-size: 16px;
  font-weight: 700;
  color: $color-white;
}

.frame-title-en,
.frame-category {
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 2px;
  color: $color-gray-mid;
}

.frame-trigger:hover,
.frame-trigger:focus-visible {
  .frame-media img {
    filter: none;
  }

  &::after {
    opacity: 1;
  }

  .frame-hud {
    transform: none;
  }

  .frame-caption::before {
    width: 48px;
  }
}

// ---------- Index view: Swiss table + live preview ----------
.gallery-index {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: $spacing-md;
  align-items: start;
}

.index-table {
  grid-column: 1 / span 7;

  ol {
    list-style: none;
  }
}

%index-columns {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) 72px 112px;
  align-items: baseline;
  gap: $spacing-sm;
}

.index-head {
  @extend %index-columns;
  padding-bottom: 10px;
  border-bottom: 3px solid $color-blue-bright;
  font-family: $font-display;
  font-size: 10px;
  letter-spacing: 2px;
  color: $color-gray-mid;
}

.index-row {
  @extend %index-columns;
  position: relative;
  width: 100%;
  padding: 18px 0;
  border: none;
  border-bottom: 1px solid $color-gray-dark;
  background: none;
  color: $color-gray-light;
  font: inherit;
  text-align: left;
  cursor: zoom-in;
  transition: color $transition-fast;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: -$spacing-md;
    width: 12px;
    height: 3px;
    background: $color-blue-bright;
    opacity: 0;
    transition: opacity $transition-fast;
  }

  &.is-previewed {
    color: $color-white;

    &::before {
      opacity: 1;
    }

    .index-no {
      color: $color-blue-bright;
    }
  }

  &:focus-visible {
    outline: 2px solid $color-blue-bright;
    outline-offset: 2px;
  }
}

.index-no,
.index-category,
.index-size {
  font-family: $font-display;
  font-size: 13px;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
}

.index-no {
  color: $color-gray-mid;
  transition: color $transition-fast;
}

.index-title {
  font-size: 16px;
  font-weight: 700;

  span {
    margin-left: 12px;
    font-family: $font-display;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 2px;
    color: $color-gray-mid;
  }
}

.index-category,
.index-size {
  color: $color-gray-mid;
}

.index-size {
  text-align: right;
}

.index-preview {
  grid-column: 9 / span 4;
  position: sticky;
  top: calc(var(--site-nav-height, 84px) + 56px + #{$spacing-md});

  .frame-media img {
    filter: none;
  }

  figcaption {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-family: $font-display;
    font-size: 11px;
    letter-spacing: 2px;
    color: $color-gray-mid;
  }
}

// ---------- Viewer ----------
// Opens and closes with a fade; the image opens like a shutter from its
// horizontal center line and the bar rises under it. `@starting-style`
// supplies the open-from state; `display`/`overlay` keep the dialog in the
// top layer until the closing fade ends.
.viewer {
  max-width: none;
  max-height: none;
  width: 100vw;
  height: 100dvh;
  margin: 0;
  padding: $spacing-md;
  border: none;
  background: rgba(10, 10, 10, 0.95);
  color: $color-white;
  // Centering lives outside `[open]`: while closing, `allow-discrete` keeps
  // `display: flex` until the fade ends, but `[open]`-only rules drop at once.
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition:
    opacity $transition-med,
    display 0.3s allow-discrete,
    overlay 0.3s allow-discrete;

  &[open] {
    display: flex;
    opacity: 1;

    @starting-style {
      opacity: 0;
    }
  }

  &::backdrop {
    background: transparent;
  }
}

.viewer-stage img,
.viewer-bar {
  transition:
    clip-path 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    opacity $transition-med;
}

.viewer:not([open]) .viewer-stage img {
  clip-path: inset(50% 0 50% 0);
}

.viewer[open] .viewer-stage img {
  clip-path: inset(0);

  @starting-style {
    clip-path: inset(50% 0 50% 0);
  }
}

.viewer:not([open]) .viewer-bar {
  opacity: 0;
  transform: translateY(16px);
}

.viewer[open] .viewer-bar {
  transition-delay: 0.1s;

  @starting-style {
    opacity: 0;
    transform: translateY(16px);
  }
}

.viewer-figure {
  display: flex;
  flex-direction: column;
  width: min(100%, 1400px);
  height: 100%;
}

// The stage takes its size only from the flex column (`contain: strict`
// ignores its content), so the switching images can never resize or shift
// the bar and strip, and their slide is clipped at the stage edge. Both
// images share one fixed grid cell during a swap instead of the leaving one
// going out of flow.
.viewer-stage {
  display: grid;
  flex: 1;
  grid-template: minmax(0, 1fr) / minmax(0, 1fr);
  place-items: center;
  min-height: 0;
  contain: strict;

  img {
    grid-area: 1 / 1;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    border: 1px solid $color-gray-dark;
  }
}

// Image switch: the old image slides off toward the travel side while
// shrinking and fading, and the new one slides in from the opposite side,
// growing to full size. Keyframe animations, not transitions, so they
// override the shutter's `clip-path` transition on the re-mounted image.
// The stage's paint containment clips both at its edges; the leaving image
// paints above the entering one.
.switch-next-leave-active,
.switch-prev-leave-active {
  z-index: 1;
  pointer-events: none;
}

// Edge-zone arrow cursors: thin 64px white chevron (right-angle, rounded
// ends); hotspot at the center, resize arrows as fallback.
.viewer-stage.is-edge-prev img {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpath d='M42 12L22 32l20 20' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
      32 32,
    w-resize;
}

.viewer-stage.is-edge-next img {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpath d='M22 12l20 20-20 20' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
      32 32,
    e-resize;
}

.switch-next-enter-active {
  animation: switch-in-next 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.switch-prev-enter-active {
  animation: switch-in-prev 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.switch-next-leave-active {
  animation: switch-out-next 0.4s cubic-bezier(0.55, 0, 0.45, 1) both;
}

.switch-prev-leave-active {
  animation: switch-out-prev 0.4s cubic-bezier(0.55, 0, 0.45, 1) both;
}

@keyframes switch-in-next {
  from {
    clip-path: inset(0);
    opacity: 0;
    transform: translateX(40%) scale(0.8);
  }
  to {
    clip-path: inset(0);
  }
}

@keyframes switch-in-prev {
  from {
    clip-path: inset(0);
    opacity: 0;
    transform: translateX(-40%) scale(0.8);
  }
  to {
    clip-path: inset(0);
  }
}

@keyframes switch-out-next {
  to {
    opacity: 0;
    transform: translateX(-40%) scale(0.8);
  }
}

@keyframes switch-out-prev {
  to {
    opacity: 0;
    transform: translateX(40%) scale(0.8);
  }
}

.viewer-bar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: $spacing-md;
  min-height: 60px;
  border-bottom: 3px solid $color-blue-bright;
}

.viewer-count {
  font-family: $font-display;
  font-size: 12px;
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
  color: $color-gray-mid;

  strong {
    font-size: 18px;
    color: $color-blue-bright;
  }
}

.viewer-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: 700;

  span {
    margin-left: 12px;
    font-family: $font-display;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 2px;
    color: $color-gray-mid;
  }
}

.viewer-controls {
  display: flex;
  gap: 4px;

  button {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid $color-gray-dark;
    background: none;
    color: $color-gray-light;
    cursor: pointer;
    transition:
      color $transition-fast,
      border-color $transition-fast;

    &:hover,
    &:focus-visible {
      border-color: $color-blue-bright;
      color: $color-white;
    }

    &:focus-visible {
      outline: 2px solid $color-blue-bright;
      outline-offset: 2px;
    }
  }

  svg {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: square;
  }
}

.viewer-close {
  margin-left: 8px;
}

.viewer-strip {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  overflow-x: auto;

  button {
    position: relative;
    flex: none;
    width: 96px;
    aspect-ratio: 3 / 2;
    padding: 0;
    border: 1px solid $color-gray-dark;
    background: $color-black-soft;
    cursor: pointer;
    opacity: 0.5;
    transition:
      opacity $transition-fast,
      border-color $transition-fast;

    &:hover,
    &[aria-current="true"] {
      opacity: 1;
    }

    &[aria-current="true"] {
      border-color: $color-blue-bright;
    }

    &:focus-visible {
      outline: 2px solid $color-blue-bright;
      outline-offset: 2px;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1px 5px;
    background: rgba(10, 10, 10, 0.8);
    font-family: $font-display;
    font-size: 10px;
    letter-spacing: 1px;
    color: $color-gray-light;
  }
}

@media (prefers-reduced-motion: reduce) {
  .frame-media img,
  .frame-trigger::after,
  .frame-cursor,
  .frame-hud,
  .frame-caption::before,
  .index-row,
  .index-row::before,
  .index-no,
  .viewer,
  .viewer-stage img,
  .viewer-bar,
  .viewer-controls button,
  .viewer-strip button,
  .swap-enter-active,
  .swap-leave-active,
  %segment {
    transition: none;
  }

  .frame,
  .index-table li,
  .viewer-stage img {
    animation: none;
  }
}

@include tablet {
  .heading-main,
  .gallery-spec {
    grid-column: 1 / -1;
  }

  .gallery-spec {
    margin-top: 32px;
    max-width: 420px;
  }

  .frame--major {
    grid-column: 1 / span 6;
  }

  .frame--minor {
    grid-column: 7 / span 6;
    margin-top: 40px;
  }

  .index-table {
    grid-column: 1 / -1;
  }

  .index-preview {
    display: none;
  }
}

@include mobile {
  .gallery-shell {
    padding-inline: $spacing-sm;
  }

  .heading-grid {
    padding-top: 48px;
    padding-bottom: 32px;
  }

  .toolbar-inner {
    flex-wrap: wrap;
    gap: 8px $spacing-sm;
    padding-block: 10px;
  }

  .toolbar-status {
    display: none;
  }

  .view-toggle {
    margin-left: auto;
  }

  .gallery-body {
    padding-top: 40px;
    padding-bottom: 80px;
  }

  .gallery-grid {
    row-gap: 40px;
  }

  .frame--wide .frame-media {
    aspect-ratio: 3 / 2;
  }

  .frame--major,
  .frame--minor {
    grid-column: 1 / -1;
    margin-top: 0;
  }

  .frame-caption {
    grid-template-columns: 36px minmax(0, 1fr);
  }

  .frame-category {
    grid-column: 2;
  }

  %index-columns {
    grid-template-columns: 40px minmax(0, 1fr) 56px;
  }

  .index-size,
  .index-head span:last-child {
    display: none;
  }

  .viewer {
    padding: $spacing-sm;
  }

  .viewer-bar {
    grid-template-columns: auto minmax(0, 1fr);
    padding-block: 8px;
  }

  .viewer-controls {
    grid-column: 1 / -1;
    justify-content: flex-end;
  }
}
</style>
