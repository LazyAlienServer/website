<template>
  <section class="hardware-section" aria-labelledby="hw-title">
    <div class="section-shell hw-sheet">
      <header class="hw-head" v-reveal>
        <div class="hw-heading">
          <h2 id="hw-title" class="hw-title">技术支持</h2>
          <p class="hw-subtitle">强劲的服务与支持为服务器保驾护航</p>
        </div>
        <ul class="hw-tags" aria-label="硬件与服务要点">
          <li v-for="(tag, i) in hardwareTags" :key="tag" class="hw-tag">
            <span class="hw-tag-key" aria-hidden="true">{{ pad(i + 1) }}</span>
            <span class="hw-tag-value">{{ tag }}</span>
          </li>
        </ul>
      </header>

      <div class="hw-specs" v-reveal>
        <article
          v-for="(item, i) in hardware"
          :key="item.title"
          class="hw-spec"
          :aria-labelledby="`hw-spec-${i}`"
        >
          <div class="hw-spec-head" aria-hidden="true">
            <span class="hw-plate">{{ item.short }}</span>
            <span class="hw-spec-index">HW-{{ pad(i + 1) }}</span>
            <span class="hw-icon" v-html="item.icon"></span>
          </div>
          <p class="hw-metric" aria-hidden="true">
            {{ item.metric.value }}<span class="hw-unit">{{ item.metric.unit }}</span>
          </p>
          <h3 :id="`hw-spec-${i}`" class="hw-name">{{ item.title }}</h3>
          <p class="hw-desc">{{ item.description }}</p>
        </article>
      </div>

      <span class="hw-tape" aria-hidden="true"></span>
      <InfrastructureFeatures />
    </div>
  </section>
</template>

<script setup lang="ts">
import InfrastructureFeatures from "./InfrastructureFeatures.vue";

// Line drawings on a 64×64 grid; rendered as hairline part marks.
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
  storage: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M32 8 56 20 32 32 8 20z" />
    <path d="m8 32 24 12 24-12M8 44l24 12 24-12" />
  </svg>`,
};

// `metric` is the part's headline figure, set large at the top of its column.
interface HardwareSpec {
  short: string;
  title: string;
  description: string;
  icon: string;
  metric: { value: string; unit: string };
}

const hardware: HardwareSpec[] = [
  {
    short: "CPU",
    title: "i9-13900K",
    description:
      "Intel 酷睿 i9-13900K，24 核 32 线程（8 个性能核 + 16 个能效核），主频可达 5.8–6.0GHz，配备 36MB 智能缓存。高主频让单线程的游戏逻辑运算稳定流畅，多核心则承担区块加载、备份等后台任务，为服务器提供充沛算力。",
    icon: icons.cpu,
    metric: { value: "5.8", unit: "GHz" },
  },
  {
    short: "RAM",
    title: "DDR5 5600MHz 内存",
    description:
      "两条 48GB 幻锋戟 DDR5-5600MHz 内存组成双通道，总容量 96GB。高频带宽加快数据交换，大容量可同时常驻更多已加载区块、实体与后台服务，保障多人在线时依然流畅运行。",
    icon: icons.ram,
    metric: { value: "96", unit: "GB" },
  },
  {
    short: "RAID",
    title: "4 × 2TB NVMe",
    description:
      "4 块 2TB M.2 NVMe SSD 组成 RAID 10 存储阵列，可用容量 4TB。条带化提升并发读写速度，镜像冗余让任意一块硬盘故障时数据仍完整可用，兼顾速度、容量与数据安全。",
    icon: icons.storage,
    metric: { value: "4", unit: "TB" },
  },
];

const hardwareTags = ["99% uptime", "13900K", "96GB DDR5", "4TB RAID 10", "BGP & CN2", "Dev team"];

const pad = (n: number): string => String(n).padStart(2, "0");
</script>

<style scoped lang="scss">
// Swiss data sheet with industrial marks. Everything sits on one 12-column
// grid with a 24px gutter (`--hw-gap`): the heading spans columns 1–4 over
// the CPU part, the shield tags start on column 5 with the RAM part, the part
// columns span 4, and `InfrastructureFeatures.vue` repeats the 3-column split
// with the same gutter, so every flush-left edge lines up down the sheet.
// Rules carry the hierarchy instead of boxes: a 2px rule heads each part,
// hairlines head each feature. One accent: the part plates, the tag values,
// and the hazard tape.
//
// Dark in both themes: in light it continues the timer's dark block, with
// yellow as the accent (black text on the plates and tag values).
.hardware-section {
  @include dark-surface;
  background-color: $color-bg;
}

.hw-sheet {
  --hw-gap: 24px;
}

.hw-head,
.hw-specs {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--hw-gap);
}

// ---------- Head: heading + shield tags ----------
.hw-head {
  align-items: end;
}

.hw-heading {
  grid-column: 1 / 5;
}

// same size as `.github-title-cn` in GithubProjects.vue: fixed h2 on
// mobile, scaled down with the viewport above it; change both together
.hw-title {
  font-size: $font-size-h2;
  line-height: 1.1;
  color: $color-fg;

  @include desktop {
    font-size: clamp(32px, calc(2.86vw + 13.66px), 48px);
  }
}

.hw-subtitle {
  margin-top: 12px;
  font-size: 14px;
  color: $color-fg-muted;
}

.hw-tags {
  grid-column: 5 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
}

// Flat-square shield, same build as the intro badges in IntroSection.vue
// (change both together): index key segment, accent value segment. The key
// keeps the dark neutral in light, since the section stays dark.
.hw-tag {
  display: flex;
}

.hw-tag-key,
.hw-tag-value {
  display: flex;
  align-items: center;
  padding: 3px 8px;
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
}

.hw-tag-key {
  background: $color-line;
  color: $color-fg-muted;
  font-family: $font-display;
}

.hw-tag-value {
  background: $color-accent;
  color: $color-on-accent;
}

// ---------- Parts: three columns, each headed by a 2px rule ----------
.hw-specs {
  row-gap: $spacing-lg;
  margin-top: $spacing-lg * 1.5;
}

.hw-spec {
  grid-column: span 4;
  min-width: 0;
  padding-top: $spacing-sm;
  border-top: 2px solid $color-fg;
}

.hw-spec-head {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: $font-display;
}

// nameplate: same build as the admin `CREW MANIFEST` plate
.hw-plate {
  padding: 6px 12px;
  background: $color-accent;
  color: $color-on-accent;
  font-size: 12px;
  font-weight: $font-weight-bold;
  line-height: 1;
}

.hw-spec-index {
  font-size: 12px;
  color: $color-fg-subtle;
}

// hairline part drawing at the column's right edge
.hw-icon {
  width: 36px;
  height: 36px;
  margin-left: auto;
  color: $color-fg-subtle;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  :deep(svg *) {
    vector-effect: non-scaling-stroke;
    stroke-width: 1.5px;
  }
}

// figure with its unit set small against the cap height
.hw-metric {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: $spacing-lg;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $color-line;
  font-family: $font-display;
  font-size: clamp(60px, 7.6vw, 108px);
  font-weight: $font-weight-bold;
  line-height: 0.8;
  font-variant-numeric: tabular-nums;
  color: $color-fg;
}

.hw-unit {
  font-size: clamp(14px, 1.4vw, 20px);
  font-weight: $font-weight-medium;
  line-height: 1;
  color: $color-fg-subtle;
}

.hw-name {
  margin-top: $spacing-md;
  font-family: $font-display;
  font-size: clamp(16px, 1.5vw, 20px);
  font-weight: $font-weight-bold;
  line-height: 1.3;
  color: $color-fg;
  overflow-wrap: break-word;
}

.hw-desc {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.8;
  color: $color-fg-muted;
  overflow-wrap: break-word;
}

// ---------- Hazard tape closing the parts ----------
.hw-tape {
  display: block;
  height: 8px;
  margin-top: $spacing-xl;
  @include hatch-strip($color-accent-ink, 45deg, 2px, 8px);
}

@include tablet {
  .hw-tape {
    margin-top: $spacing-lg * 1.5;
  }
}

@include mobile {
  .hw-sheet {
    --hw-gap: 16px;
  }

  .hw-heading,
  .hw-tags {
    grid-column: 1 / -1;
  }

  .hw-tags {
    margin-top: $spacing-md;
  }

  .hw-spec {
    grid-column: 1 / -1;
  }

  .hw-metric {
    font-size: 76px;
  }

  .hw-specs,
  .hw-tape {
    margin-top: $spacing-lg;
  }
}
</style>
