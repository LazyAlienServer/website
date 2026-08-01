<template>
  <section class="hardware-section">
    <div class="section-shell">
      <div class="section-header" v-reveal>
        <div class="index-row">
          <span class="index-num">04</span>
          <span class="index-label">// HARDWARE</span>
        </div>
        <h2 class="section-title">硬件支持</h2>
        <p class="section-subtitle">强劲的服务与支持为服务器保驾护航</p>
        <div class="title-rule"></div>
      </div>

      <div class="hardware-grid">
        <div v-for="item in hardware" :key="item.title" class="hw-card" v-reveal>
          <div class="hw-icon" v-html="item.icon"></div>
          <h3 class="hw-title">{{ item.title }}</h3>
          <p class="hw-desc">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const icons = {
  cpu: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="14" y="14" width="36" height="36" />
    <rect x="24" y="24" width="16" height="16" />
    <path d="M22 14V6M32 14V6M42 14V6M22 58v-8M32 58v-8M42 58v-8M14 22H6M14 32H6M14 42H6M58 22h-8M58 32h-8M58 42h-8" />
  </svg>`,
  ram: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="6" y="18" width="52" height="22" />
    <rect x="12" y="24" width="6" height="10" />
    <rect x="22" y="24" width="6" height="10" />
    <rect x="32" y="24" width="6" height="10" />
    <rect x="42" y="24" width="6" height="10" />
    <path d="M10 40v8h6v-4h4v4h6v-4h4v4h6v-4h4v4h6v-4h4v4h6v-8" />
  </svg>`,
  plugin: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M40 8l16 16-8 8-16-16z" />
    <path d="M32 16L14 34l8 8 18-18" />
    <path d="M14 34l-6 16 16-6" />
    <path d="M46 30l4 4" />
  </svg>`
}

const hardware = [
  {
    title: 'CPU — i9-13900K',
    description: '强大性能！主频可达5.8-6.0GHz，为服务器提供充沛算力。',
    icon: icons.cpu
  },
  {
    title: 'RAM — DDR5 内存',
    description: '48Gx2 幻锋戟 DDR5-6200MHz，高频大容量保障流畅运行。',
    icon: icons.ram
  },
  {
    title: 'Plugin — LAS特色插件',
    description: '配合插件及其强大拓展性实现多种功能，自主开发持续迭代。',
    icon: icons.plugin
  }
]
</script>

<style scoped lang="scss">
.hardware-section {
  background: $color-primary-black;
}

.hardware-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.hw-card {
  @include clipped-panel;
  position: relative;
  padding: $spacing-lg $spacing-md;
  overflow: hidden;
  transition:
    transform $transition-med,
    box-shadow $transition-med;

  // blue border sliding in from left on hover
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: $color-primary-blue;
    transition: width $transition-med;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);

    &::before {
      width: 6px;
    }

    .hw-icon {
      color: $color-blue-bright;
    }
  }
}

.hw-icon {
  width: 56px;
  height: 56px;
  color: $color-white;
  margin-bottom: $spacing-md;
  transition: color $transition-med;

  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

.hw-title {
  font-size: $font-size-h4;
  color: $color-white;
  margin-bottom: $spacing-sm;
  letter-spacing: 1px;
}

.hw-desc {
  font-size: $font-size-body;
  color: $color-gray-light;
  line-height: 1.7;
}

@include tablet {
  .hardware-grid {
    grid-template-columns: 1fr;
    max-width: 560px;
    margin: 0 auto;
  }
}
</style>
