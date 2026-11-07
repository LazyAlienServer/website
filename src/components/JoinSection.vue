<template>
  <section id="join" class="join-section">
    <div class="section-shell join-layout">
      <h2 class="join-head join-title" v-reveal>加入我们</h2>

      <ol class="paths" v-reveal>
        <li v-for="item in paths" :key="item.index">
          <router-link
            class="path"
            :to="{ path: '/rules', query: { path: item.index }, hash: '#06' }"
          >
            <span class="path-index">{{ item.index }}</span>
            <h3 class="path-title">{{ item.title }}</h3>
            <span class="path-arrow" aria-hidden="true">→</span>
            <p class="path-desc">{{ item.description }}</p>
          </router-link>
        </li>
      </ol>

      <!-- full-height hatched divider, slanted at the hero seam's angle -->
      <div class="zone-divider" aria-hidden="true"></div>
      <div class="group-panel" aria-hidden="true"></div>
      <!-- display mark on the panel, level with the section title -->
      <p class="group-mark" aria-hidden="true">JOIN US</p>

      <div class="group-inner" v-reveal>
        <p class="group-label">服外交流群</p>
        <p class="group-number">835047145</p>
        <div class="group-actions">
          <a
            class="btn btn-primary join-btn"
            href="https://qm.qq.com/q/32DhVd36iI"
            target="_blank"
            rel="noopener"
            >加入 QQ 群</a
          >
          <button
            class="btn copy-btn"
            :class="{ 'is-copied': copied }"
            type="button"
            :aria-label="copied ? '已复制群号' : '复制群号'"
            :title="copied ? '已复制群号' : '复制群号'"
            @click="copyGroupNumber"
          >
            <svg
              class="copy-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="square"
              stroke-linejoin="miter"
              aria-hidden="true"
            >
              <path v-if="!copied" d="M9 9h10v10H9z" />
              <path v-if="!copied" d="M5 15H4V5h10v1" />
              <path v-else d="m5 12 4 4L19 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from "vue";

// `index` doubles as the rules page `path` query value.
const paths = [
  {
    index: "01",
    title: "审核制",
    description: "通过素养审核（一审）与技术审核（二审），考察综合素质与红石、后勤或建筑能力。",
  },
  {
    index: "02",
    title: "邀请制",
    description: "由成员担保邀请，通过面试及技术审核；被邀请人违规时邀请人承担连带责任。",
  },
] as const;

const GROUP_NUMBER = "835047145";
const copied = shallowRef(false);
let resetCopiedTimer: ReturnType<typeof setTimeout> | undefined;

async function copyGroupNumber() {
  try {
    await navigator.clipboard.writeText(GROUP_NUMBER);
  } catch {
    const input = document.createElement("textarea");
    input.value = GROUP_NUMBER;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  copied.value = true;
  clearTimeout(resetCopiedTimer);
  resetCopiedTimer = setTimeout(() => {
    copied.value = false;
  }, 2000);
}

onBeforeUnmount(() => clearTimeout(resetCopiedTimer));
</script>

<style scoped lang="scss">
// ---------- Section-wide blueprint grid ----------
.join-section {
  // subtle cold blue-black separation from the rest of the site
  background-color: #0c0f14;
  background-image:
    linear-gradient(fade($color-fg, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, fade($color-fg, 0.045) 1px, transparent 1px);
  background-size: 56px 56px;

  // the blue-black tint is dark-only; light sits on the plain page white
  @include light {
    background-color: $color-bg;
  }
}

// Two shared rows: the heading, then the path list beside the group plate, so
// the plate's top rule continues the list's first rule across the divider and
// its controls sit on the list's last rule. The divider and the group panel
// span both rows; the auto column is as wide as the plate.
.join-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px auto;
  grid-template-rows: auto auto;
}

.join-head,
.paths {
  grid-column: 1;
  // breathing room before the hatched divider
  margin-right: 12px;
}

// ---------- Heading ----------
.join-head {
  grid-row: 1;
  margin-bottom: $spacing-lg;
}

.join-title {
  font-size: $font-size-h2;
  color: $color-fg;
}

// ---------- Path list: a ruled table, one row per route ----------
.paths {
  grid-row: 2;
  border-bottom: 1px solid $color-line;
  list-style: none;
}

.path {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-areas:
    "index title arrow"
    ". desc .";
  gap: $spacing-xs $spacing-md;
  padding-block: $spacing-md;
  border-top: 1px solid $color-line;
  color: inherit;
  text-decoration: none;

  // hover: an ink bar grows over the row's bottom rule (z-index lifts it above
  // the next row's top rule)
  &::after {
    content: "";
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 3px;
    background: $color-accent-ink;
    transform: scaleX(0);
    transform-origin: left center;
    // quick launch with a long deceleration at the finish
    transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 4px;
  }
}

.path-index,
.path-arrow {
  font-family: $font-display;
  font-size: $font-size-h4;
  line-height: 1.15;
}

.path-index {
  grid-area: index;
  font-weight: $font-weight-regular;
  font-variant-numeric: tabular-nums;
  color: $color-accent-ink;
}

.path-title {
  grid-area: title;
  font-size: $font-size-h4;
  color: $color-fg;
}

.path-arrow {
  grid-area: arrow;
  color: $color-fg-subtle;
  transition:
    color $transition-fast,
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.path:hover .path-arrow,
.path:focus-visible .path-arrow {
  color: $color-accent-ink;
  transform: translateX(4px);
}

.path-desc {
  grid-area: desc;
  font-size: $font-size-body;
  color: $color-fg-muted;
  line-height: 1.7;
}

.btn {
  display: inline-block;
  padding: 12px 28px;
  font-size: 16px;
  line-height: 24px;
  font-weight: $font-weight-medium;
  transition: filter $transition-fast;

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    filter: brightness(1.04);
  }
}

.btn-primary {
  background: $color-accent;
  color: $color-on-accent;

  // brightening the yellow fill is invisible in light: mark hover with an underline
  @include light {
    &:hover {
      text-decoration: underline 2px;
      text-underline-offset: 4px;
    }
  }
}

// ---------- Full-height hatched divider at the hero seam's slant ----------
.zone-divider {
  grid-column: 2;
  grid-row: 1 / -1;
  // negative block margins extend it through the shell padding to the
  // section's top and bottom edges
  margin-block: calc(-1 * $section-padding-y);
  transform-origin: 0 100%;
  transform: skewX(calc(-1 * var(--hero-slant)));
  @include hatch-strip(fade($color-accent-ink, 0.55), 45deg, 2px, 8px);
}

// ---------- Group panel and plate (right) ----------
// Negative margins carry the panel through the shell padding to the section's
// top, bottom, and right edges. The tint is a skewed pseudo-element clipped by
// the panel, so only the left edge slants: uniform blue in dark, solid yellow
// in light, where the controls on it turn black.
.group-panel {
  grid-column: 3;
  grid-row: 1 / -1;
  position: relative;
  overflow: hidden;
  margin-block: calc(-1 * $section-padding-y);
  // spans the shell's horizontal padding plus the centered-shell margin
  margin-right: calc(-1 * ((100vw - min(1200px, 100vw)) / 2 + $spacing-md));

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: fade($color-accent-deep, 0.1);
    transform-origin: 0 100%;
    transform: skewX(calc(-1 * var(--hero-slant)));

    @include light {
      background: $color-accent;
    }
  }
}

// Set like the page headings (display face, bold) at the title's size and line
// box, so the two read as one line across the divider; right-aligned to the
// plate's edge.
.group-mark {
  grid-column: 3;
  grid-row: 1;
  position: relative;
  padding-left: $spacing-lg * 1.3;
  font-family: $font-display;
  font-size: $font-size-h2;
  font-weight: $font-weight-bold;
  line-height: 1.15;
  text-align: right;
  color: $color-accent-ink;
}

// Data plate in the list's row: label under a scribed rule (right-aligned
// under the mark), the number, and the controls pushed down onto the list's
// last rule. Rows stretch to the widest one (the number), so the plate ends
// flush at the shell's content edge.
.group-inner {
  grid-column: 3;
  grid-row: 2;
  position: relative;
  display: flex;
  flex-direction: column;
  // clears the slanted left edge, which leans further right higher up
  padding-left: $spacing-lg * 1.3;
}

.group-label {
  padding-top: $spacing-md;
  border-top: 1px solid $color-accent-ink;
  font-size: 14px;
  line-height: 1;
  text-align: right;
  color: $color-fg-muted;
}

.group-number {
  margin-top: $spacing-sm;
  margin-bottom: $spacing-md;
  font-family: $font-display;
  font-size: clamp(38px, 6vw, 56px);
  font-weight: $font-weight-bold;
  line-height: 1;
  color: $color-accent-ink;
  font-variant-numeric: tabular-nums;
}

.group-actions {
  display: flex;
  gap: $spacing-xs;
  margin-top: auto;
}

// Fills the row beside the copy square. On the yellow panel in light it is a
// black block.
.join-btn {
  flex: 1;
  text-align: center;

  @include light {
    background: $color-fg;
    color: $color-bg;
  }
}

// Square copy control beside the join action, as tall as the join button.
.copy-btn {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 1px solid $color-accent-ink;
  background: fade($color-accent-deep, 0.12);
  color: $color-accent-ink;
  line-height: 1;
  overflow: hidden;

  &:hover {
    transform: none;
    filter: brightness(1.25);

    .copy-icon {
      transform: translateX(3px);
    }
  }

  // brightness does nothing to a black icon on the yellow panel: fill black
  // in light
  @include light {
    &:hover {
      background: $color-fg;
      color: $color-bg;
    }
  }
}

.copy-icon {
  width: 20px;
  height: 20px;
  transition: transform $transition-fast;
}

// ---------- Responsive ----------
@include tablet {
  // tablet shells use 72px vertical padding, not the desktop 120px
  .zone-divider,
  .group-panel {
    margin-block: calc(-1 * $spacing-lg * 1.5);
  }

  .group-mark,
  .group-inner {
    // tablet: base left padding minus 12px
    padding-left: calc($spacing-lg - 12px);
  }
}

@include mobile {
  .join-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .join-head,
  .paths {
    margin-right: 0;
  }

  .zone-divider {
    display: none;
  }

  // the panel becomes a full-bleed band from below the list to the section's
  // bottom edge, holding the mark and then the plate
  .group-panel,
  .group-mark,
  .group-inner {
    grid-column: 1;
  }

  .group-panel {
    grid-row: 3 / 5;
    margin-top: $spacing-lg;
    margin-right: calc(-1 * $spacing-sm);
    margin-bottom: calc(-1 * $spacing-lg);
    margin-left: calc(-1 * $spacing-sm);

    &::before {
      transform: none;
    }
  }

  .group-mark {
    grid-row: 3;
    margin-top: $spacing-lg;
    padding: $spacing-lg 0 0;
  }

  .group-inner {
    grid-row: 4;
    padding: $spacing-md 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .path::after,
  .path-arrow {
    transition: none;
  }

  .path:hover .path-arrow,
  .path:focus-visible .path-arrow,
  .copy-btn:hover .copy-icon {
    transform: none;
  }
}
</style>
