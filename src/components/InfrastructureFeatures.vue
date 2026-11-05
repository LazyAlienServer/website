<script setup lang="ts">
interface Capability {
  title: string;
  description: string;
  icon: string;
}

const icons = {
  network: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="32" cy="32" r="22" />
    <path d="M10 32h44M32 10c7 6 10 14 10 22s-3 16-10 22c-7-6-10-14-10-22s3-16 10-22z" />
    <path d="M15 18h34M15 46h34" />
  </svg>`,
  accelerate: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M36 6 17 36h13l-3 22 20-31H34z" />
  </svg>`,
  plugin: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M40 8l16 16-8 8-16-16z" />
    <path d="M32 16 14 34l8 8 18-18" />
    <path d="M14 34 8 50l16-6" />
    <path d="M46 30l4 4" />
  </svg>`,
};

const capabilities: Capability[] = [
  {
    title: "BGP 线路接入，多线容灾",
    description: "多节点 BGP 负载容灾，降低跨网QoS丢包，提升最大吞吐量，减少高峰期延迟。",
    icon: icons.network,
  },
  {
    title: "香港 CN2 节点，海外加速",
    description: "为海外玩家提供更稳定的跨境链路，平均降低 100-200ms 延迟，丢包率低于 10% 。",
    icon: icons.accelerate,
  },
  {
    title: "自研插件模组，持续迭代",
    description:
      "运维工具、服务器插件和模组自主开发；按服务器需求持续迭代，兼顾功能扩展、性能控制与版本兼容。",
    icon: icons.plugin,
  },
];
</script>

<template>
  <div class="infra-features" v-reveal>
    <article v-for="capability in capabilities" :key="capability.title" class="infra-feature">
      <span class="infra-icon" aria-hidden="true" v-html="capability.icon"></span>
      <strong class="infra-title">{{ capability.title }}</strong>
      <span class="infra-description">{{ capability.description }}</span>
    </article>
  </div>
</template>

<style scoped lang="scss">
// The 3-column split and gutter of `HardwareSection.vue`'s 12-column sheet
// (`--hw-gap`, inherited), so each feature starts on a part column's edge.
// Each one is headed by a hairline, like the sheet's ledger cells.
.infra-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: $spacing-lg var(--hw-gap, 24px);
  margin-top: $spacing-lg;
}

.infra-feature {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  padding-top: $spacing-sm;
  border-top: 1px solid $color-line;
}

.infra-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 8px;
  color: $color-accent-ink;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.infra-title {
  color: $color-fg;
  font-family: $font-display;
  font-size: clamp(15px, 1.35vw, 18px);
  font-weight: 700;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.infra-description {
  color: $color-fg-subtle;
  font-size: 13px;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

@include mobile {
  .infra-features {
    grid-template-columns: 1fr;
  }
}
</style>
