<template>
  <section class="intro-section">
    <div class="section-shell">
      <div class="intro-grid" v-reveal>
        <div class="intro-icon">
          <ParticleLogo
            class="intro-logo"
            :src="logoUrl"
            :hover-src="logoV1Url"
            label="LAS emblem"
          />
        </div>
        <div class="intro-content">
          <header class="intro-header">
            <h2 class="intro-title">关于我们</h2>
            <dl class="intro-badges">
              <div class="intro-badge">
                <dt>Name</dt>
                <dd>Lazy Alien Server</dd>
              </div>
              <div class="intro-badge">
                <dt>Focus</dt>
                <dd>技术交流</dd>
              </div>
              <div class="intro-badge">
                <dt>Members</dt>
                <dd>学生群体</dd>
              </div>
            </dl>
          </header>
          <div class="intro-text">
            <p>Lazy Alien Server简称LAS~是以学生群体为主的技术交流向Minecraft服务器。</p>
            <p>我们充分鼓励技术探索与交流，并欢迎有能力的玩家加入。</p>
            <p>
              我们为成员提供强大的硬件支持，依托于高性能物理机和完善的存储与备份方案，我们能够提供充足的性能并保障数据安全。
            </p>
            <p>除此之外，我们还设有开发团队，并有多个自主开发的模组和插件。</p>
          </div>
        </div>
      </div>

      <!-- Vertical tech rail decoration (wide screens only) -->
      <div class="intro-deco" aria-hidden="true">
        <span class="plus-marker deco-plus-top">+</span>
        <span class="deco-rail"></span>
        <span class="deco-text">sys.status // online</span>
        <span class="deco-text">mode // survival</span>
        <div class="deco-hatch"></div>
        <span class="plus-marker deco-plus-bottom">+</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import logoUrl from "@/assets/logo.svg";
import logoV1Url from "@/assets/logo-v1.svg";
import ParticleLogo from "./ParticleLogo.vue";
</script>

<style scoped lang="scss">
.intro-section {
  background: $color-bg;
  position: relative;
}

.intro-grid {
  display: grid;
  grid-template-columns: 432px 1fr;
  gap: $spacing-lg * 1.2;
  align-items: center;
}

// square frame balances the landscape v2 logo (97 × 73) and the portrait v1
// logo (881 × 1080): they contain-fit to about 75% and 82% of the frame area
.intro-logo {
  display: block;
  width: 100%;
  aspect-ratio: 1;
}

.intro-text {
  p {
    font-size: $font-size-body-lg;
    line-height: 1.8;
    color: $color-fg-muted;
    margin-bottom: $spacing-md;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// ---------- Header: title + shield badges ----------
.intro-header {
  margin-bottom: $spacing-md;
}

.intro-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

// Flat-square shield, about 20px tall like shields.io: a neutral key segment
// and an accent value segment of equal height. Light inverts the key to a
// black block, so it reads like the label/value tags on the Endfield site
// (black key, yellow value).
.intro-badge {
  display: flex;

  dt,
  dd {
    display: flex;
    align-items: center;
    padding: 3px 8px;
    font-size: $font-size-label;
    line-height: 1.2;
    white-space: nowrap;
  }

  dt {
    background: $color-line;
    color: $color-fg-muted;
    font-family: $font-display;

    @include light {
      background: $color-fg;
      color: $color-bg;
    }
  }

  dd {
    background: $color-accent;
    color: $color-on-accent;
  }
}

// ---------- Side tech rail decoration ----------
.intro-deco {
  display: none;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;

  .deco-rail {
    width: 1px;
    height: 120px;
    background: linear-gradient(
      180deg,
      fade($color-line, 0) 0%,
      $color-line 30%,
      $color-line 70%,
      fade($color-line, 0) 100%
    );
  }

  .deco-text {
    writing-mode: vertical-rl;
    font-size: $font-size-label;
    color: $color-fg-subtle;
  }

  .deco-hatch {
    width: 64px;
    height: 64px;
    @include hatch-strip;
    opacity: 0.7;
  }

  .deco-plus-top {
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
  }

  .deco-plus-bottom {
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (min-width: 1400px) {
  .intro-deco {
    display: flex;
  }
}

// tablet and mobile: single text column without the particle emblem
@include tablet {
  .intro-grid {
    grid-template-columns: 1fr;
  }

  .intro-icon {
    display: none;
  }
}

@include mobile {
  .intro-text p {
    font-size: $font-size-body;
  }
}
</style>
