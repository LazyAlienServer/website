<template>
  <section class="hardware-section" aria-labelledby="hw-title">
    <!-- Background: columns of binary falling at their own depth and speed.
         v-text keeps template whitespace out of the pre-formatted columns. -->
    <div class="hw-rain" aria-hidden="true">
      <span
        v-for="(column, i) in rainColumns"
        :key="i"
        class="hw-rain-column"
        :class="`hw-rain-column--${column.tier}`"
        :style="{ '--duration': `${column.duration}s`, '--delay': `${column.delay}s` }"
        v-text="column.text"
      ></span>
    </div>
    <div class="section-shell">
      <h2 id="hw-title" class="hw-title" v-reveal>
        <span class="hw-title-lead">技术支持</span>
        <span class="hw-title-main">强劲的服务与支持，为服务器保驾护航。</span>
      </h2>

      <ul class="hw-grid" v-reveal>
        <li
          v-for="tile in tiles"
          :key="tile.key"
          class="hw-tile"
          :class="[`hw-tile--${tile.key}`, `hw-tile--${tile.kind}`]"
        >
          <template v-if="tile.kind === 'figure'">
            <p class="hw-lead">{{ tile.lead }}</p>
            <p class="hw-figure">
              {{ tile.value }}<span class="hw-unit">{{ tile.unit }}</span>
            </p>
            <p class="hw-note">{{ tile.note }}</p>
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

// Two tile kinds: a figure (lead line, value with unit, note) or an icon
// beside one sentence whose opening phrase is set bright. `key` names the
// tile's grid area, so the order here is only the reading order.
type Tile =
  | { kind: "figure"; key: string; lead: string; value: string; unit: string; note: string }
  | { kind: "icon"; key: string; icon: string; strong: string; text: string };

const tiles: Tile[] = [
  {
    kind: "figure",
    key: "cpu",
    lead: "i9-13900K 主频最高",
    value: "5.8",
    unit: "GHz",
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
    lead: "RAID 10 可用容量",
    value: "4",
    unit: "TB",
    note: "4 块 2TB NVMe。",
  },
  {
    kind: "figure",
    key: "uptime",
    lead: "服务器在线率",
    value: "99",
    unit: "%",
    note: "多节点负载容灾。",
  },
  {
    kind: "icon",
    key: "network",
    icon: icons.network,
    strong: "BGP 多线与香港 CN2",
    text: " 线路接入，海外延迟平均降低 100-200ms。",
  },
  {
    kind: "icon",
    key: "plugin",
    icon: icons.plugin,
    strong: "自研插件与模组",
    text: "，由开发团队持续迭代。",
  },
];

// Background rain: columns of binary, each a fixed pseudo-random run of digits
// broken by gaps (seeded, so every visit draws the same field). A column holds
// its run twice and slides down by one run per loop, so the loop is seamless;
// one run (RAIN_LENGTH lines at 20px) is taller than the section on any width.
// Columns sit at three depths: far ones faint and slow, near ones brighter and
// faster, a few in brand ink fastest.
const RAIN_COLUMNS = 112;
const RAIN_LENGTH = 112;

type RainTier = "far" | "near" | "brand";

// speed range in lines per second for each depth
const RAIN_SPEED: Record<RainTier, [number, number]> = {
  far: [0.6, 1],
  near: [1, 1.6],
  brand: [1.6, 2.4],
};

const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const random = seeded(0x1a5);
const between = (min: number, max: number) => min + random() * (max - min);

// Digit runs of 3-14 lines separated by gaps of 1-8 blank lines.
const rainRun = (): string => {
  const lines: string[] = [];
  while (lines.length < RAIN_LENGTH) {
    const digits = Math.round(between(3, 14));
    for (let i = 0; i < digits; i++) lines.push(random() < 0.5 ? "0" : "1");
    const gap = Math.round(between(1, 8));
    for (let i = 0; i < gap; i++) lines.push(" ");
  }
  return lines.slice(0, RAIN_LENGTH).join("\n");
};

const rainColumns = Array.from({ length: RAIN_COLUMNS }, () => {
  const roll = random();
  const tier: RainTier = roll < 0.1 ? "brand" : roll < 0.45 ? "near" : "far";
  const run = rainRun();
  const duration = RAIN_LENGTH / between(...RAIN_SPEED[tier]);
  return {
    tier,
    text: `${run}\n${run}`,
    duration: Math.round(duration),
    // negative, so every column is already mid-fall on first paint
    delay: -Math.round(random() * duration),
  };
});
</script>

<style scoped lang="scss">
// Bento grid of unequal tiles. A two-tone heading (muted lead, bright line)
// over a 4-column grid: the CPU takes a 2 × 2 tile in brand fill with an
// oversized figure, memory, network and plugins take wide icon tiles,
// storage and uptime small figure tiles.
//
// Dark in both themes: in light it continues the timer's dark block; the CPU
// tile turns yellow with black text and the icons turn yellow.
//
// Behind the tiles, columns of binary fall down the band at three depths and
// fade out at its top and bottom. The tiles are opaque, so the rain shows in
// the gutters and around the heading. Reduced motion: the columns stand still.
.hardware-section {
  @include dark-surface;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: $color-surface;
}

// Columns on a fixed 24px pitch from the left edge; the row is clipped at the
// right, so narrow screens show fewer columns rather than denser ones. Columns
// keep their content height (not stretched), so -50% is exactly one run.
.hw-rain {
  position: absolute;
  inset: 0;
  z-index: -1;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  mask-image: linear-gradient(transparent, #000 15%, #000 85%, transparent);
}

.hw-rain-column {
  flex: none;
  width: 24px;
  font-family: $font-display;
  font-size: $font-size-label;
  line-height: 20px;
  text-align: center;
  white-space: pre;
  color: fade($color-fg, 0.05);
  animation: hw-rain-fall var(--duration) linear var(--delay) infinite;

  &--near {
    color: fade($color-fg, 0.1);
  }

  &--brand {
    color: fade($color-accent-ink, 0.3);
  }
}

// starts one run up, ends in place: the second copy takes the first's spot
@keyframes hw-rain-fall {
  from {
    transform: translateY(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hw-rain-column {
    animation: none;
  }
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
  grid-template-areas:
    "cpu cpu ram ram"
    "cpu cpu storage uptime"
    "network network plugin plugin";
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: minmax(200px, auto);
  gap: $spacing-md;
  margin-top: $spacing-lg;
  list-style: none;
}

.hw-tile {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 32px;
  background: $color-bg;

  @each $area in cpu, ram, storage, uptime, network, plugin {
    &--#{$area} {
      grid-area: $area;
    }
  }
}

// ---------- Figure tiles ----------
.hw-tile--figure {
  justify-content: space-between;
  gap: $spacing-sm;
}

.hw-lead,
.hw-note {
  font-size: $font-size-small;
  line-height: 1.6;
  color: $color-fg-subtle;
}

.hw-figure {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: auto;
  font-family: $font-display;
  font-size: clamp(48px, 4.4vw, 64px);
  font-weight: $font-weight-bold;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: $color-fg;
  white-space: nowrap;
}

.hw-unit {
  font-size: $font-size-lead;
  font-weight: $font-weight-medium;
  color: $color-fg-subtle;
}

// The lead tile: brand fill, the figure set oversized
.hw-tile--cpu {
  background: $color-accent;
  color: $color-on-accent;

  .hw-lead,
  .hw-note {
    font-size: $font-size-body;
    color: fade($color-on-accent, 0.75);
  }

  .hw-figure {
    font-size: clamp(88px, 10vw, 144px);
    color: $color-on-accent;
  }

  .hw-unit {
    font-size: $font-size-h4;
    color: fade($color-on-accent, 0.75);
  }
}

// ---------- Icon tiles: icon beside the sentence ----------
.hw-tile--icon {
  flex-direction: row;
  align-items: center;
  gap: $spacing-md;
}

.hw-icon {
  flex: none;
  width: 64px;
  height: 64px;
  color: $color-accent-ink;

  :deep(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.hw-text {
  font-size: $font-size-lead;
  font-weight: $font-weight-medium;
  line-height: 1.4;
  color: $color-fg-subtle;
  overflow-wrap: break-word;
  text-wrap: balance;

  strong {
    font-weight: $font-weight-bold;
    color: $color-fg;
  }
}

// ---------- Tablet and mobile: two columns ----------
@include tablet {
  .hw-grid {
    grid-template-areas:
      "cpu cpu"
      "ram ram"
      "storage uptime"
      "network network"
      "plugin plugin";
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(160px, auto);
  }

  .hw-tile--cpu {
    min-height: 280px;
  }
}

@include mobile {
  .hw-title {
    font-size: $font-size-h4;
  }

  .hw-grid {
    gap: $spacing-sm;
    margin-top: $spacing-md;
  }

  .hw-tile {
    padding: $spacing-md;
  }

  .hw-figure {
    font-size: 40px;
  }

  .hw-tile--cpu {
    min-height: 240px;

    .hw-figure {
      font-size: 72px;
    }
  }

  .hw-icon {
    width: 48px;
    height: 48px;
  }

  .hw-text {
    font-size: $font-size-body;
  }
}
</style>
