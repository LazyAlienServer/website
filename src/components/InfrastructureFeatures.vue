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
    description: "运维工具、服务器插件和模组自主开发，持续迭代，兼顾功能扩展、性能控制与版本兼容。",
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
// (`--hw-gap`, inherited). Features after the first are split by a vertical
// hairline on the part column's left edge and inset from it by one gutter,
// so the rule has the same clearance on both sides.
.infra-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: $spacing-lg var(--hw-gap, 24px);
  margin-top: $spacing-lg;
}

// icon in its own column at the left, title and description beside it
.infra-feature {
  position: relative;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  column-gap: $spacing-sm;
  row-gap: 8px;
  min-width: 0;

  & + & {
    padding-left: var(--hw-gap, 24px);

    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 1px;
      background: $color-line;
    }
  }
}

.infra-icon {
  grid-row: 1 / -1;
  width: 28px;
  height: 28px;
  color: $color-accent-ink;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.infra-title {
  grid-column: 2;
  color: $color-fg;
  font-family: $font-display;
  font-size: clamp(15px, 1.35vw, 18px);
  font-weight: $font-weight-bold;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.infra-description {
  grid-column: 2;
  color: $color-fg-subtle;
  font-size: $font-size-small;
  line-height: 1.7;
  overflow-wrap: anywhere;
}

@include mobile {
  .infra-features {
    grid-template-columns: 1fr;
  }

  // stacked: no side neighbours to split
  .infra-feature + .infra-feature {
    padding-left: 0;

    &::before {
      display: none;
    }
  }
}
</style>
