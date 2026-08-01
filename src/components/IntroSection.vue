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
