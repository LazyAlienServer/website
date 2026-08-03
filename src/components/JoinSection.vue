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
          <a
            class="btn btn-primary join-btn"
            href="https://qm.qq.com/cgi-bin/qm/qr?k=835047145"
            target="_blank"
            rel="noopener"
            >加入 QQ 群</a
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
// ---------- Section-wide blueprint grid ----------
.join-section {
  background-color: $color-primary-black;
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
// fixed width leaves room for the centered divider: 50% − half the band's
// mid-height offset (2.4vw) − half the visible band (17px incl. skew shift)
.enlist-side {
  flex: 0 0 calc(50% - 2.4vw - 17px);
  min-width: 0;
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
  // no panel box — bare text starting flush with the section title
  transition: transform $transition-med;

  &:hover {
    transform: translateY(-4px);
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
  font-family: $font-display;
  font-size: $font-size-h4;
  font-weight: 400;
  letter-spacing: 3px;
  color: $color-blue-bright;
  text-transform: uppercase;
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
  transition:
    transform $transition-fast,
    filter $transition-fast;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }

  &:active {
    transform: scale(0.98);
  }
}

.btn-primary {
  background: $color-primary-blue;
  color: $color-white;
}

// ---------- Full-height hatched divider at the hero seam's slant ----------
.zone-divider {
  // absolute, out of flow: spans the full section (top/bottom 0 against the
  // shell's padding box); skewed so the band's sides sit at exactly the hero
  // seam's angle (4.8vw over 100vh) for any section height
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(50% - 2.4vw - 17px);
  width: 48px;
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
  flex: 1 1 0;
  display: flex;
  overflow: hidden;
  // 48px right of the divider box: the skewed blue layer's left edge then
  // coincides with the divider's right edge
  margin-top: calc(-1 * $section-padding-y);
  margin-bottom: calc(-1 * $section-padding-y);
  margin-left: $spacing-lg;
  // negative right margin spans the shell's horizontal padding plus the
  // centered-shell margin, so the blue reaches the section's right edge
  margin-right: calc(-1 * ((100vw - min(1200px, 100vw)) / 2 + $spacing-md));

  // blue layer, skewed at the hero seam's angle — its left edge is the cut;
  // horizontal gradient keeps the right side (section edge) clearly blue
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(0, 102, 204, 0.05) 0%, rgba(0, 102, 204, 0.16) 100%);
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
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  text-align: center;
  padding: $spacing-lg;
  // the zone's negative right margin widens it past the shell — offset that
  // extension here so the content stays where it was before it
  margin-right: calc((100vw - min(1200px, 100vw)) / 2 + $spacing-md);
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
  font-size: clamp(36px, 4.5vw, 56px);
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

// ---------- Scan effect: glowing arc flowing around the join button, hover only ----------
.join-btn {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  // rotating conic arc — the moving light
  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300%;
    aspect-ratio: 1;
    z-index: -2;
    background: conic-gradient(
      transparent 0deg 260deg,
      $color-blue-bright 310deg,
      $color-white 330deg,
      transparent 360deg
    );
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 0;
    transition: opacity $transition-fast;
    pointer-events: none;
  }

  // inner fill carves the ring down to a border
  &::after {
    content: "";
    position: absolute;
    inset: 2px;
    z-index: -1;
    background: $color-primary-blue;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
    animation: scan-rotate 1.2s linear infinite;
  }
}

@keyframes scan-rotate {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

// ---------- Responsive ----------
@include tablet {
  .group-zone {
    margin-block: calc(-1 * $spacing-lg * 1.5);
  }
}

@include mobile {
  .join-layout {
    flex-direction: column;
  }

  .enlist-side {
    flex: none;
    width: 100%;
  }

  .zone-divider {
    position: relative;
    top: auto;
    bottom: auto;
    left: auto;
    width: 100%;
    height: 32px;
    margin: $spacing-md 0;
    transform: none;
    clip-path: polygon(2% 0, 100% 0, 98% 100%, 0 100%);
  }

  .group-zone {
    flex: none;
    margin: 0 calc(-1 * $spacing-sm) 0 0;

    &::before {
      transform: none;
    }
  }

  .group-inner {
    padding: $spacing-lg $spacing-sm;
    margin-right: $spacing-sm;
  }
}

@media (prefers-reduced-motion: reduce) {
  .join-btn:hover::before {
    animation: none;
  }
}
</style>
