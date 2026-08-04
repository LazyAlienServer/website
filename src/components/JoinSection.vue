<template>
  <section id="join" class="join-section">
    <div class="section-shell join-layout">
      <div class="enlist-side" v-reveal>
        <div class="section-header">
          <div class="index-row">
            <span class="index-join">JOIN US</span>
          </div>
          <h2 class="section-title">加入我们</h2>
        </div>

        <div class="paths-grid">
          <div class="path-card">
            <div class="path-head">
              <h3 class="path-title">审核制</h3>
              <span class="path-index">PATH 01</span>
            </div>
            <p class="path-desc">
              通过素养审核（一审）与技术审核（二审），考察综合素质与红石、后勤或建筑能力。
            </p>
          </div>
          <div class="path-card">
            <div class="path-head">
              <h3 class="path-title">邀请担保制</h3>
              <span class="path-index">PATH 02</span>
            </div>
            <p class="path-desc">
              由成员担保邀请，通过面试及技术审核；被邀请人违规时邀请人承担连带责任。
            </p>
          </div>
        </div>
      </div>

      <!-- full-height hatched divider, slanted at the hero seam's angle -->
      <div class="zone-divider" aria-hidden="true"></div>

      <div class="group-zone" v-reveal>
        <div class="group-inner">
          <div class="group-status">
            <span class="signal-indicator"></span>
            <span class="group-status-text">CHANNEL OPEN // RECRUITING</span>
          </div>
          <p class="group-number">835047145</p>
          <p class="group-caption">服外交流群 // QQ GROUP</p>
          <div class="group-actions">
            <a
              class="btn btn-primary join-btn"
              href="https://qm.qq.com/cgi-bin/qm/qr?k=835047145"
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from "vue";

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
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 56px 56px;
}

.join-layout {
  display: flex;
  align-items: stretch;
  position: relative;
}

// ---------- Enlist side (left) ----------
// flexes to fill everything the auto-sized group zone and the 48px band
// leave behind
.enlist-side {
  flex: 1 1 0;
  min-width: 0;
  // breathing room before the hatched divider
  padding-right: 12px;
}

// blue JOIN US index label — keeps the control-panel row language
.index-join {
  font-family: $font-display;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: $color-blue-bright;
}

// PATH cards stack vertically — one per row
.paths-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
}

.path-card {
  position: relative;
  // PATH hover uses directional index and underline motion, not card lift
  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: -12px;
    left: 0;
    height: 3px;
    background: $color-blue-bright;
    transform: scaleX(0);
    transform-origin: left center;
    // quick launch with a long deceleration at the finish
    transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover::after {
    transform: scaleX(1);
  }
}

// title and index share one row: title left, blue index right
.path-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;
}

.path-index {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  font-family: $font-display;
  font-size: $font-size-h4;
  font-weight: 400;
  letter-spacing: 3px;
  color: $color-blue-bright;
  text-transform: uppercase;
  white-space: nowrap;
}

// The arrow expands from the right edge toward the index text, shifting the
// PATH label left as it appears.
.path-index::after {
  content: "→";
  display: inline-block;
  width: 0;
  margin-left: 0;
  overflow: hidden;
  opacity: 0;
  transition:
    width 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    margin-left 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.path-card:hover .path-index::after {
  width: 1.1em;
  margin-left: $spacing-xs;
  opacity: 1;
  transform: translateX(0);
}

.path-title {
  font-size: $font-size-h4;
  color: $color-white;
}

.path-desc {
  font-size: $font-size-body;
  color: $color-gray-light;
  line-height: 1.7;
}

.btn {
  display: inline-block;
  padding: 16px 44px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: filter $transition-fast;

  &:hover {
    filter: brightness(1.08);
  }

  &:active {
    filter: brightness(1.04);
  }
}

.btn-primary {
  background: $color-primary-blue;
  color: $color-white;
}

// ---------- Full-height hatched divider at the hero seam's slant ----------
.zone-divider {
  // Flow item: enlist fills the space before it; the auto-sized group zone
  // starts immediately after it. Negative block margins extend it through
  // the shell padding to the section's top and bottom edges.
  flex: 0 0 48px;
  margin-top: calc(-1 * $section-padding-y);
  margin-bottom: calc(-1 * $section-padding-y);
  transform-origin: 0 100%;
  transform: skewX(-4deg);
  @include hatch-strip(rgba(30, 144, 255, 0.55), 45deg, 2px, 8px);

  // hero visual: left edge runs 8% of a 60vw panel over 100vh — the skew
  // scales the horizontal shift with the element's own height, so the angle
  // matches the hero exactly at every viewport
  @supports (transform: skewX(atan2(1vw, 1vh))) {
    transform: skewX(atan2(-4.8vw, 100vh));
  }
}

// ---------- Group zone (right) ----------
.group-zone {
  position: relative;
  // Content determines the group width; enlist consumes the remainder.
  flex: 0 0 auto;
  display: flex;
  overflow: hidden;
  // The divider now occupies its own 48px flow slot, so the blue cut starts
  // directly at the divider's right edge.
  margin-top: calc(-1 * $section-padding-y);
  margin-bottom: calc(-1 * $section-padding-y);
  margin-left: 0;
  // negative right margin spans the shell's horizontal padding plus the
  // centered-shell margin, so the blue reaches the section's right edge
  margin-right: calc(-1 * ((100vw - min(1200px, 100vw)) / 2 + $spacing-md));
  // uniform tint — gradient removed per request
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 102, 204, 0.1);
    transform-origin: 0 100%;
    transform: skewX(-4deg);

    @supports (transform: skewX(atan2(1vw, 1vh))) {
      transform: skewX(atan2(-4.8vw, 100vh));
    }
  }
}

.group-inner {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: $spacing-md;
  text-align: right;
  padding: $spacing-lg;
  padding-left: $spacing-lg * 1.3;
  // offset the zone extension and the inner right padding so content ends
  // exactly at the shell's content edge
  margin-right: calc((100vw - min(1200px, 100vw)) / 2 + $spacing-md - $spacing-lg);
}

.group-status {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.group-status-text {
  font-size: 11px;
  letter-spacing: 3px;
  color: $color-gray-light;
  text-transform: uppercase;
}

.group-number {
  font-family: $font-display;
  font-size: clamp(38px, 4.5vw, 56px);
  font-weight: 700;
  letter-spacing: 5px;
  color: $color-blue-bright;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 24px rgba(30, 144, 255, 0.35);
}

.group-caption {
  font-size: 12px;
  letter-spacing: 3px;
  color: $color-gray-mid;
}

.group-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: $spacing-xs;
}

// Subtle join button hover: no scaling or rotating scan effect.
.join-btn {
  transition: filter $transition-fast;
}

// Square copy control beside the join action.
.copy-btn {
  display: inline-grid;
  place-items: center;
  width: 58px;
  height: 58px;
  padding: 0;
  border: 1px solid $color-blue-bright;
  background: rgba(0, 102, 204, 0.12);
  color: $color-blue-bright;
  line-height: 1;
  overflow: hidden;

  &:hover {
    transform: none;
    filter: brightness(1.25);

    .copy-icon {
      transform: translateX(3px);
    }
  }
}

.copy-icon {
  width: 22px;
  height: 22px;
  transition: transform $transition-fast;
}

// ---------- Responsive ----------
@include tablet {
  .zone-divider {
    // Tablet shells use 72px vertical padding, not the desktop 120px.
    margin-block: calc(-1 * $spacing-lg * 1.5);
  }

  .group-zone {
    margin-block: calc(-1 * $spacing-lg * 1.5);
  }

  .group-inner {
    // tablet: base left padding minus 12px
    padding-left: calc($spacing-lg - 12px);
  }

  .group-status-text {
    letter-spacing: clamp(1px, 0.2vw, 3px);
  }

  .group-actions {
    gap: clamp(6px, 1vw, 8px);
  }

  .group-actions .join-btn {
    padding: clamp(12px, calc(12px + (100vw - 640px) * 0.0104167), 16px)
      clamp(28px, calc(28px + (100vw - 640px) * 0.0416667), 44px);
    font-size: clamp(14px, calc(14px + (100vw - 640px) * 0.0052083), 16px);
  }

  .group-actions .copy-btn {
    width: clamp(50px, calc(50px + (100vw - 640px) * 0.0208333), 58px);
    height: clamp(50px, calc(50px + (100vw - 640px) * 0.0208333), 58px);
  }
}

@include mobile {
  .join-layout {
    flex-direction: column;
    margin-bottom: -24px;
  }

  .enlist-side {
    flex: none;
    width: 100%;
  }

  .zone-divider {
    display: none;
  }

  .group-zone {
    flex: none;
    // extend the background across both shell side paddings on mobile
    margin-top: 0;
    margin-right: calc(-1 * $spacing-sm);
    margin-bottom: 0;
    margin-left: calc(-1 * $spacing-sm);
    // let the blue layer's bottom stretch past the zone box
    overflow: visible;

    &::before {
      // background-only extension: top stays anchored to the zone, bottom
      // runs through the shell's bottom padding to the section's edge —
      // no layout margin involved
      top: 0;
      bottom: calc(-1 * $spacing-lg * 1.5);
      transform: none;
    }
  }

  .group-inner {
    padding: $spacing-lg $spacing-sm;
    // mobile: base left padding minus 12px
    padding-left: calc($spacing-sm - 12px);
    margin-right: 0;
  }

  .group-status-text {
    letter-spacing: 3px;
  }

  .group-actions .join-btn {
    padding: 16px 44px;
    font-size: 16px;
  }

  .group-actions .copy-btn {
    width: 58px;
    height: 58px;
  }

  .group-actions .copy-btn {
    order: -1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .copy-btn:hover .copy-icon {
    transform: none;
  }
}
</style>
