<template>
  <div class="status-page">
    <header class="status-heading">
      <div class="status-shell heading-grid">
        <div class="heading-main">
          <h1>服务器状态<span class="heading-en">Status</span></h1>
          <p class="heading-lead">各接入线路的连通性，每 5 分钟检测一次，连接失败时重试 3 次。</p>
        </div>
      </div>
    </header>

    <main class="status-shell status-body">
      <template v-if="report">
        <div class="range-bar">
          <dl class="range-summary">
            <div>
              <dt>在线分组</dt>
              <dd>{{ pad(countOnlineGroups(report.groups)) }}/{{ pad(report.groups.length) }}</dd>
            </div>
            <div>
              <dt>在线线路</dt>
              <dd>{{ pad(countOnline(allRoutes)) }}/{{ pad(allRoutes.length) }}</dd>
            </div>
            <div>
              <dt>检测时间</dt>
              <dd>
                <time v-if="report.checkedAt" :datetime="report.checkedAt">
                  {{ formatTime(report.checkedAt) }}
                </time>
                <template v-else>--</template>
              </dd>
            </div>
            <div>
              <dt>下次检测</dt>
              <dd>
                <time v-if="nextCheckAt" :datetime="nextCheckAt">{{
                  formatTime(nextCheckAt)
                }}</time>
                <template v-else>--</template>
              </dd>
            </div>
          </dl>
          <div class="range-toggle" role="group" aria-label="统计范围">
            <button
              v-for="(option, key) in RANGES"
              :key="key"
              type="button"
              :aria-pressed="range === key"
              @click="range = key"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <section
          v-for="(group, groupIndex) in report.groups"
          :key="groupIndex"
          class="route-group"
          :aria-labelledby="`route-group-${groupIndex}`"
        >
          <header class="group-head">
            <h2 :id="`route-group-${groupIndex}`">{{ group.name }}</h2>
            <p class="group-count">
              在线
              <span>{{ countOnline(group.routes) }}/{{ group.routes.length }}</span>
            </p>
          </header>
          <ol class="route-list">
            <li
              v-for="(item, index) in group.routes"
              :key="index"
              class="route-row"
              :class="`is-${stateOf(item)}`"
            >
              <span class="route-index">{{ pad(index + 1) }}</span>
              <span class="route-name">{{ item.name }}</span>
              <span class="route-meta">
                <span class="route-state">
                  <span class="route-mark" aria-hidden="true"></span>
                  {{ STATE_LABEL[stateOf(item)] }}
                </span>
                <span class="route-uptime">{{ percent(uptime(slotsOf(item))) }}</span>
              </span>
              <!-- Decorative blocks: the whole bar is one image whose label
                   carries the range uptime; the caption below reads out the
                   block under the pointer. -->
              <div
                class="uptime-bar"
                role="img"
                :aria-label="`${RANGES[range].label}可用率 ${percent(uptime(slotsOf(item)))}`"
                @pointerleave="hovered = null"
              >
                <span
                  v-for="(slot, slotIndex) in slotsOf(item)"
                  :key="slotIndex"
                  class="uptime-slot"
                  :class="[
                    `is-${levelOf(slot)}`,
                    { 'is-hovered': isHovered(groupIndex, index, slotIndex) },
                  ]"
                  @pointerenter="hovered = { group: groupIndex, route: index, slot: slotIndex }"
                ></span>
              </div>
              <p class="uptime-caption" aria-hidden="true">
                <template v-if="hovered?.group === groupIndex && hovered.route === index">
                  <span>{{ slotLabel(hovered.slot) }}</span>
                  <span>{{ slotSummary(slotsOf(item)[hovered.slot] ?? null) }}</span>
                </template>
                <template v-else>
                  <span>{{ RANGES[range].start }}</span>
                  <span>{{ RANGES[range].end }}</span>
                </template>
              </p>
            </li>
          </ol>
        </section>
      </template>
      <p v-else class="route-note" :class="{ 'is-error': failed }" role="status">
        {{ failed ? "暂时无法获取状态，稍后将自动重试。" : "正在读取线路状态。" }}
      </p>
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import FooterSection from "@/components/FooterSection.vue";

// Data comes from the site's Worker (`worker/index.ts`): a cron checks every
// route each 5 minutes and keeps half-hourly and daily counts in D1; this page only
// reads them. Group and route names, up/down, and counts are the only data,
// the addresses stay server side. Polled every REFRESH_MS while the tab is
// visible (the Worker caches for the same 60s); a failed refresh keeps the
// last result on screen.
const REFRESH_MS = 60_000;
// keep in step with the cron schedule in cloudflare.config.ts (`*/5`)
const CHECK_INTERVAL_MS = 5 * 60_000;

// [successful checks, total checks]; null when a slot has no checks
type Slot = [number, number] | null;

interface RouteReport {
  name: string;
  online: boolean | null;
  daily: Slot[];
  halfHourly: Slot[];
}

interface GroupReport {
  name: string;
  routes: RouteReport[];
}

interface StatusReport {
  checkedAt: string | null;
  // slot labels, oldest first: "YYYY-MM-DD" days (UTC+8) and half-hour starts (ISO)
  days: string[];
  halfHours: string[];
  groups: GroupReport[];
}

type Range = "day" | "halfHour";
type State = "online" | "offline" | "pending";

const RANGES: Record<Range, { label: string; start: string; end: string }> = {
  day: { label: "90 天", start: "90 天前", end: "今天" },
  halfHour: { label: "24 小时", start: "24 小时前", end: "现在" },
};
const STATE_LABEL: Record<State, string> = { online: "在线", offline: "离线", pending: "未检测" };

const report = ref<StatusReport | null>(null);
const failed = ref(false);
const range = ref<Range>("day");
const hovered = ref<{ group: number; route: number; slot: number } | null>(null);
const allRoutes = computed(() => report.value?.groups.flatMap((group) => group.routes) ?? []);
let fetchedAt = 0;
let timer: number | undefined;

const pad = (value: number): string => String(value).padStart(2, "0");
const countOnline = (routes: RouteReport[]): number =>
  routes.filter((item) => item.online === true).length;
// a group is reachable while any of its routes is online
const countOnlineGroups = (groups: GroupReport[]): number =>
  groups.filter((group) => countOnline(group.routes) > 0).length;
// checks run on the cron's boundaries, so the next one is one interval on
const nextCheckAt = computed(() => {
  const checkedAt = report.value?.checkedAt;
  return checkedAt
    ? new Date(new Date(checkedAt).getTime() + CHECK_INTERVAL_MS).toISOString()
    : null;
});
const stateOf = (item: RouteReport): State =>
  item.online === null ? "pending" : item.online ? "online" : "offline";
const slotsOf = (item: RouteReport): Slot[] =>
  range.value === "day" ? item.daily : item.halfHourly;
const isHovered = (group: number, route: number, slot: number): boolean =>
  hovered.value?.group === group && hovered.value.route === route && hovered.value.slot === slot;

// share of successful checks over the slots that have any; null without data
const uptime = (slots: Slot[]): number | null => {
  let up = 0;
  let total = 0;
  for (const slot of slots) {
    if (!slot) continue;
    up += slot[0];
    total += slot[1];
  }
  return total ? up / total : null;
};

const percent = (ratio: number | null): string =>
  ratio === null
    ? "--"
    : ratio === 1
      ? "100%"
      : `${(Math.floor(ratio * 10_000) / 100).toFixed(2)}%`;

// block colour: normal at 99% and up, degraded from 95%, outage below
const levelOf = (slot: Slot): "up" | "degraded" | "down" | "none" => {
  if (!slot || !slot[1]) return "none";
  const ratio = slot[0] / slot[1];
  return ratio >= 0.99 ? "up" : ratio >= 0.95 ? "degraded" : "down";
};

const timeFormat = new Intl.DateTimeFormat("zh-CN", {
  hour12: false,
  timeZone: "Asia/Shanghai",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const slotFormat = new Intl.DateTimeFormat("zh-CN", {
  hour12: false,
  timeZone: "Asia/Shanghai",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const formatTime = (iso: string): string => timeFormat.format(new Date(iso));

const slotLabel = (index: number): string => {
  if (!report.value) return "";
  return range.value === "day"
    ? (report.value.days[index] ?? "")
    : slotFormat.format(new Date(report.value.halfHours[index] ?? 0));
};

const slotSummary = (slot: Slot): string =>
  slot && slot[1] ? `可用率 ${percent(slot[0] / slot[1])}，检测 ${slot[1]} 次` : "无数据";

const isSlot = (value: unknown): value is Slot =>
  value === null ||
  (Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number");

const isRouteReport = (value: unknown): value is RouteReport => {
  const item = value as RouteReport;
  return (
    typeof value === "object" &&
    value !== null &&
    typeof item.name === "string" &&
    (item.online === null || typeof item.online === "boolean") &&
    Array.isArray(item.daily) &&
    item.daily.every(isSlot) &&
    Array.isArray(item.halfHourly) &&
    item.halfHourly.every(isSlot)
  );
};

const isStatusReport = (value: unknown): value is StatusReport => {
  const body = value as StatusReport;
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray(body.days) &&
    Array.isArray(body.halfHours) &&
    Array.isArray(body.groups) &&
    body.groups.every(
      (group) =>
        typeof group?.name === "string" &&
        Array.isArray(group.routes) &&
        group.routes.every(isRouteReport),
    )
  );
};

const refresh = async () => {
  fetchedAt = Date.now();
  try {
    const response = await fetch("/api/status");
    if (!response.ok) throw new Error(`status ${response.status}`);
    const body: unknown = await response.json();
    if (!isStatusReport(body)) throw new Error("unexpected body");
    report.value = body;
    failed.value = false;
  } catch {
    failed.value = true;
  }
};

const tick = () => {
  if (!document.hidden) void refresh();
};

const onVisibility = () => {
  if (!document.hidden && Date.now() - fetchedAt >= REFRESH_MS) void refresh();
};

onMounted(() => {
  void refresh();
  timer = window.setInterval(tick, REFRESH_MS);
  document.addEventListener("visibilitychange", onVisibility);
});

onUnmounted(() => {
  clearInterval(timer);
  document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<style scoped lang="scss">
.status-page {
  background: $color-bg;
  min-height: 100vh;
  padding-top: var(--site-nav-height, 84px);
}

.status-shell {
  max-width: calc(#{$content-max-width} + 2 * #{$spacing-md});
  margin: 0 auto;
  padding-inline: $spacing-md;
}

// ---------- Header: the gallery's blueprint band and 12-column type block ----------
.status-heading {
  position: relative;
  border-bottom: 1px solid $color-line;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(fade($color-fg, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, fade($color-fg, 0.045) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(180deg, #000 0%, transparent 100%);
    pointer-events: none;
  }
}

.heading-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: $spacing-md;
  align-items: end;
  padding-top: 72px;
  padding-bottom: 40px;
}

.heading-main {
  grid-column: 1 / span 7;

  h1 {
    display: flex;
    align-items: baseline;
    gap: $spacing-sm;
    font-size: clamp(32px, 4vw, 48px);
    line-height: 1.05;
    color: $color-fg;
  }
}

.heading-en {
  font-family: $font-display;
  font-size: $font-size-small;
  font-weight: $font-weight-bold;
  color: $color-accent-ink;
}

.heading-lead {
  max-width: 34em;
  margin-top: $spacing-sm;
  color: $color-fg-muted;
  font-size: $font-size-body;
  line-height: 1.8;
}

// ---------- Route groups: a heavy-ruled head, then one ruled row per route ----------
.status-body {
  padding-top: $spacing-lg;
  padding-bottom: $spacing-xl;
}

.route-group + .route-group {
  margin-top: $spacing-lg;
}

.group-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: $spacing-md;
  padding-bottom: 12px;
  border-bottom: 2px solid $color-fg;

  h2 {
    font-size: $font-size-h4;
    line-height: 1.25;
    color: $color-fg;
  }
}

.group-count {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: $font-size-small;
  color: $color-fg-subtle;

  span {
    font-family: $font-display;
    font-size: $font-size-body;
    font-weight: $font-weight-bold;
    font-variant-numeric: tabular-nums;
    color: $color-fg;
  }
}

.route-list {
  list-style: none;
}

// Row: index | name | state and range uptime, then the bar and its caption
// under the name column.
.route-row {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px $spacing-md;
  padding-block: 20px;
  border-bottom: 1px solid $color-line;
}

.route-index {
  font-family: $font-display;
  font-size: $font-size-label;
  font-weight: $font-weight-bold;
  font-variant-numeric: tabular-nums;
  color: $color-fg-subtle;
}

.route-name {
  font-size: $font-size-lead;
  font-weight: $font-weight-medium;
  color: $color-fg;
  overflow-wrap: anywhere;
}

.route-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.route-state {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: $font-size-small;
  font-weight: $font-weight-medium;
  color: $color-success;

  .is-offline & {
    color: $color-danger;
  }

  .is-pending & {
    color: $color-fg-subtle;
  }
}

// square mark: success online, danger offline, gray before the first check
.route-mark {
  width: 10px;
  height: 10px;
  background: $color-success;

  .is-offline & {
    background: $color-danger;
  }

  .is-pending & {
    background: $color-line;
  }
}

.route-uptime {
  min-width: 4.5em;
  font-family: $font-display;
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: $color-fg;
}

// One block per day or half hour, oldest left; levels as in `levelOf`, in the
// same green / red as the route state.
.uptime-bar {
  grid-column: 2 / -1;
  display: flex;
  gap: 2px;
  height: 28px;
}

.uptime-slot {
  flex: 1 1 0;
  min-width: 0;
  background: $color-line;
  transition: opacity $transition-fast;

  &.is-up {
    background: $color-success;
  }

  &.is-degraded {
    background: fade($color-danger, 0.45);
  }

  &.is-down {
    background: $color-danger;
  }

  &.is-hovered {
    opacity: 0.55;
  }
}

.uptime-caption {
  grid-column: 2 / -1;
  display: flex;
  justify-content: space-between;
  gap: $spacing-sm;
  margin-top: -4px;
  font-family: $font-display;
  font-size: $font-size-label;
  font-variant-numeric: tabular-nums;
  color: $color-fg-subtle;
}

// ---------- Summary and range switch above the groups ----------
.range-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-sm $spacing-md;
  margin-bottom: $spacing-lg;
}

// Sized to the range switch beside it: a 24px value on a 1.5 line box is
// 36px, the switch's height (14px x 1.6 text, 6px padding, 1px border).
.range-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 8px $spacing-md;

  div {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  dt {
    font-size: $font-size-body;
    color: $color-fg-subtle;
  }

  dd {
    font-family: $font-display;
    font-size: $font-size-h4;
    font-weight: $font-weight-bold;
    line-height: 1.5;
    font-variant-numeric: tabular-nums;
    color: $color-fg;
  }
}

// flat segments; the pressed one takes the brand fill
.range-toggle {
  display: flex;
  flex: none;
  border: 1px solid $color-line;

  button {
    padding: 6px 14px;
    border: 0;
    background: transparent;
    font-family: inherit;
    font-size: $font-size-small;
    font-weight: $font-weight-medium;
    color: $color-fg-subtle;
    cursor: pointer;
    transition:
      color $transition-fast,
      background-color $transition-fast;

    & + button {
      border-left: 1px solid $color-line;
    }

    &:hover {
      color: $color-fg;
    }

    &[aria-pressed="true"] {
      background: $color-accent;
      color: $color-on-accent;
    }

    &:focus-visible {
      outline: 2px solid $color-accent-ink;
      outline-offset: 2px;
    }
  }
}

.route-note {
  padding-block: 20px;
  border-block: 1px solid $color-line;
  font-size: $font-size-small;
  color: $color-fg-subtle;

  &.is-error {
    color: $color-danger;
  }
}

@include tablet {
  .heading-main {
    grid-column: 1 / -1;
  }
}

@include mobile {
  .status-shell {
    padding-inline: $spacing-sm;
  }

  .heading-grid {
    padding-top: 48px;
    padding-bottom: 32px;
  }

  .status-body {
    padding-top: $spacing-md;
    padding-bottom: $spacing-lg;
  }

  .route-row {
    grid-template-columns: 32px minmax(0, 1fr) auto;
    gap: 10px $spacing-sm;
    padding-block: 16px;
  }

  .route-name {
    font-size: $font-size-body;
  }

  .route-meta {
    gap: $spacing-sm;
  }

  // 90 blocks on a phone: hairline gaps keep each block visible
  .uptime-bar {
    gap: 1px;
    height: 24px;
  }

  // summary on its own rows, the switch under it
  .range-bar {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: $spacing-md;
  }
}
</style>
