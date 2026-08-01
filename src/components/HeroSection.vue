<template>
  <section class="hero">
    <!-- LEFT: carbon black content panel -->
    <div class="hero-panel">
      <nav class="nav">
        <router-link to="/" class="nav-logo">
          <img :src="logoUrl" alt="LAS logo" />
          <span>LAZY ALIEN SERVER</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="active">首页</router-link>
          <router-link to="/rules">规章</router-link>
        </div>
      </nav>

      <div class="panel-body">
        <div class="index-row">
          <span class="index-num">01</span>
          <span class="index-label">// SYSTEM ONLINE</span>
        </div>
        <h1>LAZY ALIEN<br /><span class="accent">SERVER</span></h1>
        <p class="sub-cn">与 LAS 的成员们，携手并进</p>
        <div class="rule"></div>
        <div class="cta-row">
          <a class="btn btn-primary" href="#join">加入我们</a>
          <a class="btn btn-ghost" href="#about">了解详情</a>
        </div>
      </div>

      <div class="panel-footer">
        <div class="signal">
          <span class="signal-indicator"></span>
          SERVER STATUS: ONLINE
        </div>
        <span>LZALIEN.ORG — V2.0</span>
      </div>
    </div>

    <!-- RIGHT: hero image with diagonal clip -->
    <div class="hero-visual">
      <img
        ref="heroImage"
        class="hero-img"
        src="/hero.webp"
        alt="LAS survival build — gothic hall"
      />
      <!-- blue seam tracing the image edge -->
      <div class="seam-glow"></div>
      <div class="seam"></div>
      <div class="meta-tag">MINECRAFT TECH SERVER<br />EST. 2022.08.29</div>
      <div class="watermark">LAS</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import logoUrl from "@/assets/logo.svg";

const heroImage = ref<HTMLImageElement | null>(null);

// Subtle parallax — image drifts at 0.5x scroll speed
const onScroll = () => {
  if (heroImage.value) {
    heroImage.value.style.transform = `translateY(${window.scrollY * 0.5}px)`;
  }
};

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped lang="scss">
.hero {
  display: flex;
  height: 100vh;
  min-height: 640px;
  width: 100%;
  position: relative;
  background: $color-primary-black;
}

// ---------- LEFT PANEL ----------
.hero-panel {
  width: 40%;
  height: 100%;
  background: $color-primary-black;
  display: flex;
  flex-direction: column;
  padding: 0 $spacing-lg * 1.2 $spacing-lg $spacing-lg;
  position: relative;
  z-index: 6;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  padding: $spacing-md 0;
  border-bottom: 1px solid $color-gray-dark;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 14px;

  img {
    height: 44px;
    width: auto;
  }

  span {
    font-family: $font-display;
    font-weight: 700;
    font-size: 18px;
    color: $color-white;
    letter-spacing: 1px;
  }
}

.nav-links {
  display: flex;
  gap: 28px;

  a {
    color: $color-gray-mid;
    font-size: 14px;
    letter-spacing: 2px;
    transition: color $transition-fast;

    &:hover {
      color: $color-blue-bright;
    }

    &.active {
      color: $color-white;
      border-bottom: 2px solid $color-blue-bright;
      padding-bottom: 4px;
    }
  }
}

.panel-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.index-row {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: 28px;
}

.index-num {
  font-family: $font-display;
  font-size: 14px;
  color: $color-white;
  background: $color-primary-blue;
  padding: 4px 10px;
  font-weight: 700;
  letter-spacing: 1px;
}

.index-label {
  color: $color-gray-mid;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

h1 {
  font-size: clamp(44px, 4.6vw, 68px);
  line-height: 1.02;
  color: $color-white;
  letter-spacing: -1px;
  margin-bottom: $spacing-xs;

  .accent {
    color: $color-blue-bright;
  }
}

.sub-cn {
  font-size: $font-size-h4;
  color: $color-gray-light;
  font-weight: 400;
  margin-top: 18px;
  letter-spacing: 6px;
}

.rule {
  width: 64px;
  height: 6px;
  background: $color-white;
  margin: 30px 0;
}

.cta-row {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 16px 38px;
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
  clip-path: polygon(14px 0, 100% 0, 100% 100%, 0 100%);
}

.btn-ghost {
  border: 2px solid $color-white;
  color: $color-white;
}

.panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $spacing-sm;
  border-top: 1px solid $color-gray-dark;
  padding-top: 20px;
  color: $color-gray-mid;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.signal {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
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
  background: $color-blue-bright;
}

.seam-glow {
  width: calc(8% + 14px);
  z-index: 3;
  clip-path: polygon(calc(100% - 14px) 0, 100% 0, 14px 100%, 0 100%);
  background: rgba(30, 144, 255, 0.3);
}

// ---------- RIGHT VISUAL ----------
.hero-visual {
  width: 60%;
  height: 100%;
  position: relative;
  overflow: hidden;
  clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%);
  background: $color-primary-black;
}

.hero-img {
  width: 100%;
  height: 110%; // headroom for parallax drift
  object-fit: cover;
  filter: saturate(0.7) brightness(0.72) contrast(1.05);
  will-change: transform;
}

.hero-visual::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(255deg, rgba(0, 102, 204, 0.45) 0%, rgba(10, 10, 10, 0) 55%),
    linear-gradient(0deg, rgba(10, 10, 10, 0.55) 0%, rgba(10, 10, 10, 0) 40%);
  pointer-events: none;
}

.watermark {
  position: absolute;
  right: $spacing-lg;
  bottom: 40px;
  z-index: 4;
  font-family: $font-display;
  font-weight: 700;
  font-size: clamp(96px, 12vw, 180px);
  line-height: 0.8;
  letter-spacing: -4px;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.4);
  user-select: none;
  pointer-events: none;
}

.meta-tag {
  position: absolute;
  right: $spacing-lg;
  top: 120px;
  z-index: 4;
  text-align: right;
  color: $color-white;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-right: 3px solid $color-blue-bright;
  padding-right: 12px;
  line-height: 1.7;
  opacity: 0.9;
}

// ---------- RESPONSIVE ----------
@include tablet {
  .hero {
    flex-direction: column-reverse;
    height: auto;
    min-height: 100vh;
  }

  .hero-panel {
    width: 100%;
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
  .nav-logo span {
    display: none;
  }

  .sub-cn {
    font-size: 18px;
    letter-spacing: 3px;
  }

  .panel-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: $spacing-xs;
  }

  .hero-visual {
    height: 36vh;
  }
}
</style>
