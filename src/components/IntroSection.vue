<template>
  <section class="intro-section">
    <div class="section-shell">
      <div class="intro-grid" v-reveal>
        <div class="intro-icon">
          <img :src="logoUrl" alt="LAS emblem" />
        </div>
        <div class="intro-content">
          <div class="section-header">
            <div class="index-row">
              <span class="index-num">02</span>
              <span class="index-label">// ABOUT US</span>
            </div>
            <h2 class="section-title">关于我们</h2>
            <div class="title-rule"></div>
          </div>
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
</script>

<style scoped lang="scss">
.intro-section {
  background: $color-primary-black;
  position: relative;
}

.intro-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: $spacing-lg * 1.2;
  align-items: start;
  border-left: 4px solid $color-primary-blue;
  padding-left: $spacing-lg;
}

.intro-icon {
  img {
    width: 100%;
    opacity: 0.9;
  }
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

@include tablet {
  .intro-grid {
    grid-template-columns: 1fr;
    padding-left: $spacing-md;
  }

  .intro-icon {
    max-width: 160px;
  }
}

@include mobile {
  .intro-grid {
    padding-left: $spacing-sm;
  }

  .intro-text p {
    font-size: $font-size-body;
  }
}
</style>
