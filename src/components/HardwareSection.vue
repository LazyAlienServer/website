<template>
  <section class="hardware-section" aria-labelledby="hw-title">
    <div class="section-shell">
      <h2 id="hw-title" class="hw-title" v-reveal>
        <span class="hw-title-lead">技术支持</span>
        <span class="hw-title-main">强劲的服务与支持，为服务器保驾护航。</span>
      </h2>

      <ul class="hw-grid" v-reveal>
        <li v-for="tile in tiles" :key="tile.key" class="hw-tile">
          <template v-if="tile.kind === 'figure'">
            <p class="hw-text">{{ tile.lead }}</p>
            <p class="hw-figure">{{ tile.figure }}</p>
            <p class="hw-text">{{ tile.note }}</p>
          </template>
          <template v-else>
            <span class="hw-icon" aria-hidden="true" v-html="tile.icon"></span>
            <p class="hw-text">
              <strong>{{ tile.strong }}</strong
              >{{ tile.text }}
            </p>
          </template>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
// Line drawings on a 64×64 grid, stroked in brand ink.
const icons = {
  ram: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="6" y="18" width="52" height="22" />
    <rect x="12" y="24" width="6" height="10" />
    <rect x="22" y="24" width="6" height="10" />
    <rect x="32" y="24" width="6" height="10" />
    <rect x="42" y="24" width="6" height="10" />
    <path d="M10 40v8h6v-4h4v4h6v-4h4v4h6v-4h4v4h6v-4h4v4h6v-8" />
  </svg>`,
  network: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="32" cy="32" r="22" />
    <path d="M10 32h44M32 10c7 6 10 14 10 22s-3 16-10 22c-7-6-10-14-10-22s3-16 10-22z" />
    <path d="M15 18h34M15 46h34" />
  </svg>`,
  plugin: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M40 8l16 16-8 8-16-16z" />
    <path d="M32 16 14 34l8 8 18-18" />
    <path d="M14 34 8 50l16-6" />
    <path d="M46 30l4 4" />
  </svg>`,
};

// Two tile kinds: a headline figure between a lead line and a note, or an
// icon over one sentence whose opening phrase is set bright.
type Tile =
  | { kind: "figure"; key: string; lead: string; figure: string; note: string }
  | { kind: "icon"; key: string; icon: string; strong: string; text: string };

// Figure and icon tiles alternate, so the 3 × 2 grid reads as a checkerboard.
const tiles: Tile[] = [
  {
    kind: "figure",
    key: "cpu",
    lead: "i9-13900K 主频最高",
    figure: "5.8 GHz",
    note: "24 核 32 线程，单核与多核兼顾。",
  },
  {
    kind: "icon",
    key: "ram",
    icon: icons.ram,
    strong: "96GB DDR5",
    text: " 双通道内存，多人在线依然流畅。",
  },
  {
    kind: "figure",
    key: "storage",
    lead: "RAID 10 阵列可用容量",
    figure: "4 TB",
    note: "4 块 2TB NVMe，任一盘故障数据仍完整。",
  },
  {
    kind: "icon",
    key: "network",
    icon: icons.network,
    strong: "BGP 多线与香港 CN2",
    text: " 线路接入，海外延迟平均降低 100-200ms。",
  },
  {
    kind: "figure",
    key: "uptime",
    lead: "服务器在线率",
    figure: "99%",
    note: "多节点负载容灾，稳定在线。",
  },
  {
    kind: "icon",
    key: "plugin",
    icon: icons.plugin,
    strong: "自研插件与模组",
    text: "，由开发团队持续迭代。",
  },
];
</script>

<style scoped lang="scss">
// Feature tiles after Apple's product pages: a two-tone heading (muted lead,
// bright line) over a 3 × 2 grid of square, rounded black tiles on a raised
// band, each centred on one fact. Dark in both themes: in light it continues
// the timer's dark block, and brand ink (the icons) turns yellow.
.hardware-section {
  @include dark-surface;
  background-color: $color-surface;
}

.hw-title {
  display: flex;
  flex-direction: column;
  font-size: $font-size-h3;
  line-height: 1.25;
}

.hw-title-lead {
  color: $color-fg-subtle;
}

.hw-title-main {
  color: $color-fg;
}

.hw-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: $spacing-md;
  margin-top: $spacing-lg;
  list-style: none;
}

.hw-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  aspect-ratio: 1;
  min-width: 0;
  padding: $spacing-lg $spacing-md;
  border: 1px solid fade($color-fg, 0.06);
  border-radius: 28px;
  background: $color-bg;
  text-align: center;
}

// sentences in muted gray; the opening phrase of icon tiles is set bright
.hw-text {
  max-width: 15em;
  font-size: $font-size-lead;
  font-weight: $font-weight-medium;
  line-height: 1.4;
  color: $color-fg-subtle;
  overflow-wrap: break-word;
  // even lines, so no single character is left alone on the last one
  text-wrap: balance;

  strong {
    font-weight: $font-weight-bold;
    color: $color-fg;
  }
}

.hw-figure {
  // about two thirds of a tile's width at most, leaving air on both sides
  font-size: clamp(48px, 4.4vw, 64px);
  font-weight: $font-weight-bold;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: $color-fg;
  white-space: nowrap;
}

.hw-icon {
  width: 72px;
  height: 72px;
  color: $color-accent-ink;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

@include tablet {
  .hw-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

// stacked: tiles size to their content rather than staying square
@include mobile {
  .hw-title {
    font-size: $font-size-h4;
  }

  .hw-grid {
    grid-template-columns: 1fr;
    gap: $spacing-sm;
    margin-top: $spacing-md;
  }

  .hw-tile {
    aspect-ratio: auto;
    min-height: 240px;
    padding: $spacing-lg $spacing-md;
    border-radius: 24px;
  }

  .hw-text {
    font-size: $font-size-body-lg;
  }

  .hw-figure {
    font-size: 48px;
  }
}
</style>
