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
            <div class="intro-tab">
              <span class="intro-tab-id">LAS</span>
              <span class="intro-tab-label">PROFILE // 档案</span>
            </div>
            <h2 class="intro-title">关于我们</h2>
            <dl class="intro-record">
              <div class="intro-field">
                <dt>NAME</dt>
                <dd>Lazy Alien Server</dd>
              </div>
              <div class="intro-field">
                <dt>FOCUS</dt>
                <dd>技术交流</dd>
              </div>
              <div class="intro-field">
                <dt>MEMBERS</dt>
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
        <span class="deco-text">SYS.STATUS // ONLINE</span>
        <span class="deco-text">MODE // SURVIVAL</span>
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
  background: $color-primary-black;
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
    color: $color-gray-light;
    margin-bottom: $spacing-md;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// ---------- Profile header: folder tab + record fields ----------
.intro-header {
  margin-bottom: $spacing-lg;
}

// tab shares the hairline's color so it reads as one folder edge
.intro-tab {
  display: flex;
  align-items: flex-end;
  margin-bottom: $spacing-md;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: $color-gray-dark;
  }
}

.intro-tab-id,
.intro-tab-label {
  font-family: $font-display;
  font-size: 12px;
  letter-spacing: 3px;
  line-height: 1;
  padding: 8px 12px 7px;
}

.intro-tab-id {
  background: $color-primary-blue;
  color: $color-white;
  font-weight: 700;
}

.intro-tab-label {
  padding-right: 28px;
  background: $color-gray-dark;
  color: $color-gray-light;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%);
}

.intro-record {
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
  margin-top: $spacing-md;
}

.intro-field {
  padding: 2px 24px 2px 12px;
  border-left: 1px solid $color-gray-dark;

  &:first-child {
    border-left: 3px solid $color-white;
  }

  dt {
    font-family: $font-display;
    font-size: 10px;
    letter-spacing: 2px;
    color: $color-gray-mid;
  }

  dd {
    font-size: 14px;
    letter-spacing: 1px;
    color: $color-white;
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
      rgba(42, 42, 42, 0) 0%,
      $color-gray-dark 30%,
      $color-gray-dark 70%,
      rgba(42, 42, 42, 0) 100%
    );
  }

  .deco-text {
    writing-mode: vertical-rl;
    font-size: 11px;
    letter-spacing: 3px;
    color: $color-gray-mid;
    text-transform: uppercase;
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

// tablet and mobile: single text column without the particle emblem or profile tab
@include tablet {
  .intro-grid {
    grid-template-columns: 1fr;
  }

  .intro-icon,
  .intro-tab {
    display: none;
  }
}

@include mobile {
  .intro-text p {
    font-size: $font-size-body;
  }
}
</style>
