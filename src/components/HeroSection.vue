<template>
  <section class="hero">
    <div class="hero-panel">
      <div class="panel-body">
        <p class="hero-kicker">
          <span class="kicker-block" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M5 5 19 19M19 7v12H7" />
            </svg>
          </span>
          We are
        </p>
        <h1>LAZY ALIEN<br /><span class="accent">SERVER</span></h1>
        <p class="sub-cn">与 LAS 的成员们，携手并进</p>
        <div class="rule"></div>
        <div class="cta-row">
          <a class="btn btn-primary" href="#join">加入我们</a>
          <a class="btn btn-ghost" href="#about">了解详情</a>
        </div>
      </div>

      <div class="panel-footer">
        <span class="panel-footer-motto">矢志不渝，历久弥新。</span>
        <span class="panel-footer-meta">
          <span>lzalien.org</span>
          <span>v2.0</span>
        </span>
      </div>
    </div>

    <div class="hero-visual">
      <img ref="heroImage" class="hero-img" :src="heroShot.src" :alt="heroShot.alt" />
      <div class="seam-glow"></div>
      <div class="seam"></div>
      <div class="meta-tag">
        <span>Minecraft Tech Server</span>
        <span>Est. 2022.08.29</span>
      </div>
      <div class="watermark">LAS</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { theme } from "@/composables/theme";

// Each theme has its own hero shot. `theme` is already set from `data-theme`
// (applied before first paint in index.html), so only one image is requested.
const HERO_SHOTS = {
  dark: { src: "/hero.webp", alt: "LAS survival build, gothic hall" },
  light: { src: "/ftl-ender-pearl.webp", alt: "LAS redstone build, FTL pearl cannon" },
};
const heroShot = computed(() => HERO_SHOTS[theme.value]);

const heroImage = ref<HTMLImageElement | null>(null);
let scrollFrameId = 0;

const updateScrollEffects = () => {
  if (heroImage.value) {
    heroImage.value.style.transform = `translateY(${window.scrollY * 0.5}px)`;
  }
};

const scheduleScrollEffects = () => {
  cancelAnimationFrame(scrollFrameId);
  scrollFrameId = requestAnimationFrame(updateScrollEffects);
};

onMounted(() => {
  updateScrollEffects();
  window.addEventListener("scroll", scheduleScrollEffects, { passive: true });
  window.addEventListener("resize", scheduleScrollEffects);
});

onUnmounted(() => {
  cancelAnimationFrame(scrollFrameId);
  window.removeEventListener("scroll", scheduleScrollEffects);
  window.removeEventListener("resize", scheduleScrollEffects);
});
</script>

<style scoped lang="scss">
.hero {
  display: flex;
  height: 100vh;
  min-height: 640px;
  width: 100%;
  position: relative;
  background: $color-bg;
}

// ---------- LEFT PANEL ----------
.hero-panel {
  width: 40%;
  height: 100%;
  background: $color-bg;
  display: flex;
  flex-direction: column;
  padding: $spacing-lg $spacing-lg * 1.2 $spacing-lg $spacing-lg;
  position: relative;
  z-index: 6;
  flex: none;
}

.panel-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

// Section-title kicker after the Endfield site's headings: a solid block
// with a ↘ arrow at its right end, pointing into the wordmark, and "We are"
// set beside it. Dark: blue block, white arrow and text; light: gray block,
// black arrow and text. Sizes are in em of the kicker's font size, so the
// block stays a little taller than the cap height at every width.
.hero-kicker {
  display: flex;
  align-items: center;
  gap: 0.3em;
  margin-bottom: $spacing-md;
  font-family: $font-display;
  font-size: clamp(24px, 2.2vw, 34px);
  font-weight: $font-weight-medium;
  line-height: 1;
  color: $color-fg;
}

.kicker-block {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: flex-end;
  width: 3em;
  height: 0.9em;
  padding-right: 0.1em;
  background: $color-accent;
  color: $color-on-accent;

  @include light {
    background: $color-line;
  }

  svg {
    width: 0.62em;
    height: 0.62em;
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: square;
  }
}

h1 {
  font-size: clamp(44px, 4.6vw, 68px);
  line-height: 1.02;
  color: $color-fg;
  margin-bottom: $spacing-xs;

  .accent {
    color: $color-accent-ink;
  }
}

.sub-cn {
  margin-top: 20px;
  font-size: $font-size-lead;
  line-height: 1.7;
  font-weight: $font-weight-regular;
  color: $color-fg-muted;
}

.rule {
  width: 64px;
  height: 6px;
  margin: 28px 0 32px;
  background: $color-fg;
}

.cta-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

// Both buttons share one height, one type size, and one vertical rhythm. The
// primary's fill is a skewed layer; the secondary's outline is an inset
// shadow so a hairline never changes the box's size.
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  padding: 0 32px;
  font-size: $font-size-body;
  font-weight: $font-weight-medium;
  line-height: 1;
  transition:
    filter $transition-fast,
    box-shadow $transition-fast,
    color $transition-fast;

  &:active {
    translate: 0 1px;
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 3px;
  }
}

// Slanted left edge at the hero slant: a background layer skewed from its
// bottom-left corner, clipped by the button so the right edge stays square.
// Skew scales with the button's own height, so no height is hard-coded.
.btn-primary {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  // Extra inset on the skewed side keeps the label optically centered.
  padding-left: 36px;
  color: $color-on-accent;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: $color-accent;
    transform-origin: 0 100%;
    transform: skewX(calc(-1 * var(--hero-slant)));
  }

  &:hover {
    filter: brightness(1.12);
  }
}

.btn-ghost {
  color: $color-fg;
  box-shadow: inset 0 0 0 1px fade($color-fg, 0.32);

  &:hover {
    box-shadow: inset 0 0 0 1px $color-fg;
  }
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: $spacing-sm;
  border-top: 1px solid $color-line;
  padding-top: 16px;
  font-size: $font-size-label;
  color: $color-fg-subtle;
}

.panel-footer-motto {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: "";
    flex: none;
    width: 6px;
    height: 6px;
    background: $color-accent-ink;
  }
}

.panel-footer-meta {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  font-family: $font-display;
  font-weight: $font-weight-medium;
  font-variant-numeric: tabular-nums;
}

// ---------- SEAM ----------
// Clipped strips inside .hero-visual — always parallel to the image's
// clipped left edge (8% → 0) regardless of viewport size.
// Solid 6px core + 14px translucent glow underlay extending into the image.
.seam,
.seam-glow {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.seam {
  width: calc(8% + 6px);
  z-index: 4;
  clip-path: polygon(calc(100% - 6px) 0, 100% 0, 6px 100%, 0 100%);
  background: $color-accent-bright;
}

.seam-glow {
  width: calc(8% + 14px);
  z-index: 3;
  clip-path: polygon(calc(100% - 14px) 0, 100% 0, 14px 100%, 0 100%);
  background: fade($color-accent-bright, 0.3);
}

// ---------- RIGHT VISUAL ----------
.hero-visual {
  width: 60%;
  height: 100%;
  position: relative;
  overflow: hidden;
  clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%);
  background: $color-photo-scrim;
}

// Dark dims the shot and covers it with a brand wash from the right and a
// bottom scrim; light shows the shot undimmed with only the wash (yellow),
// fully transparent from the middle to the left edge.
.hero-img {
  width: 100%;
  height: 110%; // headroom for parallax drift
  object-fit: cover;
  filter: saturate(0.7) brightness(0.72) contrast(1.05);
  will-change: transform;

  @include light {
    filter: none;
  }
}

.hero-visual::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(255deg, fade($color-accent-deep, 0.45) 0%, rgba($color-photo-scrim, 0) 55%),
    linear-gradient(0deg, rgba($color-photo-scrim, 0.55) 0%, rgba($color-photo-scrim, 0) 40%);
  pointer-events: none;

  @include light {
    background: linear-gradient(255deg, fade($color-accent-deep, 0.45) 0%, transparent 55%);
  }
}

// Cropped by the visual's bottom edge and right-aligned with the meta tag,
// so it reads as part of the frame rather than a floating word.
.watermark {
  position: absolute;
  right: $spacing-lg;
  bottom: -0.08em;
  z-index: 4;
  font-family: $font-display;
  font-weight: $font-weight-bold;
  font-size: clamp(96px, 12vw, 180px);
  line-height: 0.8;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba($color-on-photo, 0.28);
  user-select: none;
  pointer-events: none;
}

// A right-aligned label plate: a short accent rule above two quiet lines.
// The text shadow keeps white type legible on the undimmed light hero shot.
.meta-tag {
  position: absolute;
  right: $spacing-lg;
  top: $spacing-lg;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-family: $font-display;
  font-size: $font-size-label;
  font-weight: $font-weight-medium;
  line-height: 1.6;
  text-align: right;
  color: $color-on-photo;
  opacity: 0.92;
  text-shadow: 0 1px 12px rgba($color-photo-scrim, 0.5);

  &::before {
    content: "";
    width: 32px;
    height: 6px;
    margin-bottom: 10px;
    background: $color-accent-bright;
    box-shadow: 0 0 10px rgba($color-photo-scrim, 0.35);
  }
}

// ---------- RESPONSIVE ----------
@include tablet {
  .hero {
    display: contents;
  }

  .hero-panel {
    order: -1;
    width: 100%;
    height: auto;
    min-height: calc(100vh - 46vh);
    padding: 0 $spacing-md $spacing-lg;
  }

  .panel-body {
    padding: $spacing-lg 0;
  }

  .seam,
  .seam-glow {
    display: none;
  }

  .hero-visual {
    order: -3;
    width: 100%;
    height: 46vh;
    clip-path: none;
  }
  .watermark {
    font-size: 96px;
  }

  .meta-tag {
    top: $spacing-md;
    right: $spacing-md;
  }
}

@include mobile {
  .sub-cn {
    font-size: 18px;
  }

  .panel-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-xs;
  }

  // The navbar is docked in flow under this image (see `SiteNavbar.vue`):
  // pull the image up over the nav's top margin to the page top, and leave
  // the nav's height below it so the panel starts after the nav.
  .hero-visual {
    height: $hero-visual-height-mobile;
    margin-top: calc(-1 * ($hero-visual-height-mobile + var(--site-nav-height, 0px)));
    margin-bottom: var(--site-nav-height, 0px);
  }
}
</style>
