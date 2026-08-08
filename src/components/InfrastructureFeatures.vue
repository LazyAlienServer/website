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
    <template v-for="(capability, index) in capabilities" :key="capability.title">
      <article class="infra-feature">
        <span class="infra-icon" aria-hidden="true" v-html="capability.icon"></span>
        <span class="infra-copy">
          <strong class="infra-title">{{ capability.title }}</strong>
          <span class="infra-description">{{ capability.description }}</span>
        </span>
      </article>
      <span v-if="index < capabilities.length - 1" class="infra-divider" aria-hidden="true"></span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.infra-features {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr) 1px) minmax(0, 1fr);
  align-items: stretch;
  gap: clamp(16px, 2.5vw, 32px);
  margin-top: clamp(48px, 8vw, 72px);
}

.infra-divider {
  width: 1px;
  background: rgba(255, 255, 255, 0.18);
}

.infra-feature {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: clamp(16px, 2vw, 24px);

  &:hover .infra-icon {
    color: $color-white;
  }
}

.infra-icon {
  display: grid;
  flex: 0 0 clamp(44px, 4vw, 56px);
  width: clamp(44px, 4vw, 56px);
  height: clamp(44px, 4vw, 56px);
  place-items: center;
  color: $color-blue-bright;
  transition: color $transition-fast;

  :deep(svg) {
    width: 58%;
    height: 58%;
  }
}

.infra-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.infra-title {
  color: $color-white;
  font-family: $font-display;
  font-size: clamp(15px, 1.35vw, 19px);
  font-weight: 700;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.infra-description {
  color: $color-gray-mid;
  font-size: clamp(12px, 1vw, 14px);
  line-height: 1.7;
  overflow-wrap: anywhere;
}

@include tablet {
  .infra-features {
    gap: 16px;
  }

  .infra-feature {
    gap: 14px;
  }

  .infra-icon {
    flex-basis: 44px;
    width: 44px;
    height: 44px;
  }
}

@include mobile {
  .infra-features {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 48px;
  }

  // .infra-feature {
  //   min-height: 92px;
  // }

  .infra-divider {
    width: 100%;
    height: 1px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .infra-icon {
    transition: none;
  }
}
</style>
