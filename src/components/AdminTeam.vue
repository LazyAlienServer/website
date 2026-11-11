<template>
  <section class="admin-section">
    <div class="section-shell">
      <header class="admin-header" v-reveal>
        <p class="admin-kicker"><span class="admin-plate">Crew manifest</span></p>
        <h2 class="admin-title">管理团队</h2>
        <div class="admin-manifest">
          <p class="admin-count">
            <span class="admin-count-num">{{ pad(operators.length) }}</span>
            <span class="admin-count-label">Operators</span>
          </p>
          <ul class="admin-roles">
            <li
              v-for="entry in roleSummary"
              :key="entry.role"
              class="admin-role"
              :class="`role-${entry.role}`"
            >
              <span class="admin-role-swatch" aria-hidden="true"></span>
              {{ roleLabel(entry.role) }} {{ pad(entry.count) }}
            </li>
          </ul>
        </div>
      </header>

      <ol class="admin-grid">
        <li v-for="(op, i) in operators" :key="op.name" class="op-item" v-reveal>
          <component
            :is="op.bilibiliUrl ? 'a' : 'div'"
            class="op-card"
            :class="[`role-${op.role}`, { 'is-link': op.bilibiliUrl }]"
            :href="op.bilibiliUrl ?? undefined"
            :target="op.bilibiliUrl ? '_blank' : undefined"
            :rel="op.bilibiliUrl ? 'noopener noreferrer' : undefined"
          >
            <span class="op-head">
              <span class="op-index" aria-hidden="true">{{ pad(i + 1) }}</span>
              <span v-if="op.bilibiliUrl" class="op-link">Bilibili ↗</span>
            </span>

            <span class="op-frame">
              <img
                v-if="!failedAvatars.has(op.name)"
                class="op-avatar"
                :src="op.avatarUrl"
                :alt="`${op.name} operator avatar`"
                loading="lazy"
                @error="onAvatarError(op.name)"
              />
              <span
                v-else
                class="op-avatar op-avatar-fallback"
                role="img"
                :aria-label="`${op.name} operator avatar unavailable`"
              >
                {{ op.name.charAt(0) }}
              </span>
            </span>

            <span class="op-name">{{ op.name }}</span>
            <span class="op-meta">
              <span class="status-mark" :class="`status-${op.status}`" aria-hidden="true"></span>
              <span>{{ op.title }}</span>
              <span class="op-role">{{ roleLabel(op.role) }}</span>
            </span>
          </component>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";

type OperatorRole = "admin" | "tech" | "mod";
type OperatorStatus = "online" | "away";

interface Operator {
  name: string;
  title: string;
  bilibiliUrl: string | null;
  avatarUrl: string;
  status: OperatorStatus;
  role: OperatorRole;
}

const AVATAR_BASE = "https://lzalien.org/source/img/admins";

const operators: Operator[] = [
  {
    name: "tanh_Heng",
    title: "物理服主",
    bilibiliUrl: "https://space.bilibili.com/454721668",
    avatarUrl: `${AVATAR_BASE}/tanh_Heng.png`,
    status: "online",
    role: "admin",
  },
  {
    name: "CatCoinZHSM",
    title: "服主",
    bilibiliUrl: "https://space.bilibili.com/401914568",
    avatarUrl: `${AVATAR_BASE}/CatCoinZHSM.png`,
    status: "online",
    role: "admin",
  },
  {
    name: "Fanzhitianyu",
    title: "技术管理/红石",
    bilibiliUrl: null,
    avatarUrl: `${AVATAR_BASE}/Fanzhitianyu.png`,
    status: "online",
    role: "tech",
  },
  {
    name: "RCY_QWQ",
    title: "技术管理/红石",
    bilibiliUrl: null,
    avatarUrl: `${AVATAR_BASE}/RCY_QWQ.png`,
    status: "online",
    role: "tech",
  },
  {
    name: "yizhi_jiyan_",
    title: "技术管理/建筑",
    bilibiliUrl: null,
    avatarUrl: `${AVATAR_BASE}/yizhi_jiyan_.png`,
    status: "online",
    role: "tech",
  },
  {
    name: "Eclipse_313",
    title: "寄术支持",
    bilibiliUrl: null,
    avatarUrl: `${AVATAR_BASE}/Eclipse_313.png`,
    status: "online",
    role: "tech",
  },
  {
    name: "bookban_7",
    title: "综合管理",
    bilibiliUrl: null,
    avatarUrl: `${AVATAR_BASE}/bookban_7.png`,
    status: "online",
    role: "mod",
  },
  {
    name: "4rcadia",
    title: "精神支持",
    bilibiliUrl: "https://space.bilibili.com/499244418",
    avatarUrl: "https://avatars.githubusercontent.com/u/97033226",
    status: "away",
    role: "mod",
  },
];

const roleLabels: Record<string, string> = {
  core: "Core",
  tech: "Tech",
  admin: "Admin",
  mod: "Mod",
};

const roleLabel = (role: OperatorRole): string =>
  roleLabels[role] ?? role.charAt(0).toUpperCase() + role.slice(1);

const pad = (value: number): string => String(value).padStart(2, "0");

const ROLE_ORDER: OperatorRole[] = ["admin", "tech", "mod"];
const roleSummary = ROLE_ORDER.map((role) => ({
  role,
  count: operators.filter((op) => op.role === role).length,
}));

// names of operators whose avatar failed to load — initials fallback renders instead
const failedAvatars = reactive(new Set<string>());
const onAvatarError = (name: string): void => {
  failedAvatars.add(name);
};
</script>

<style scoped lang="scss">
// In light the section is a gray band between white ones.
.admin-section {
  background-color: $color-bg;

  @include light {
    background-color: $color-surface;
  }
}

// Role colors, shared by the legend swatches and the card tabs. Both are 4px
// marks, so they use ink roles; both brand inks are black in light, so the
// lower roles step down in tone there.
.role-admin {
  --role-color: #{$color-accent-ink};
}

.role-tech {
  --role-color: #{$color-accent-ink-deep};

  @include light {
    --role-color: #{fade($color-fg, 0.55)};
  }
}

.role-mod {
  --role-color: #{fade($color-fg, 0.55)};

  @include light {
    --role-color: #{fade($color-fg, 0.25)};
  }
}

// ---------- Header: nameplate and title, headcount and role legend ----------
// Two rows on one grid: the nameplate and its rule across the full width,
// then the title and the manifest sharing the title's baseline. The count is
// set at the title's size, so the row reads as one line of type.
.admin-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: last baseline;
  gap: $spacing-sm $spacing-lg;
  margin-bottom: $spacing-lg;
}

// Nameplate: a solid brand plate (blue in dark, yellow with black text in
// light) with a scribed rule to the shell's right edge, ending in a tick.
.admin-kicker {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;

  &::after {
    content: "";
    flex: 1;
    height: 9px;
    border-right: 1px solid $color-line;
    background: linear-gradient($color-line, $color-line) center / 100% 1px no-repeat;
  }
}

.admin-plate {
  flex: none;
  padding: 6px 12px;
  background: $color-accent;
  color: $color-on-accent;
  font-family: $font-display;
  font-size: $font-size-label;
  font-weight: $font-weight-bold;
  line-height: 1;
}

.admin-title {
  line-height: 1;
}

// count, then the legend after a short hairline, all on the title's baseline
.admin-manifest {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: $spacing-xs $spacing-md;
}

.admin-count {
  display: flex;
  align-items: baseline;
  gap: $spacing-xs;
}

.admin-count-num {
  font-family: $font-display;
  font-size: $font-size-h2;
  font-weight: $font-weight-bold;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: $color-fg;
}

.admin-count-label,
.admin-role {
  font-family: $font-display;
  font-size: $font-size-label;
  line-height: 1;
}

.admin-count-label {
  color: $color-fg-subtle;
}

.admin-roles {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  padding-left: $spacing-md;
  border-left: 1px solid $color-line;
  list-style: none;
}

.admin-role {
  color: $color-fg-muted;
}

.admin-role-swatch {
  display: inline-block;
  width: 12px;
  height: 4px;
  margin-right: 6px;
  vertical-align: middle;
  background: var(--role-color);
}

// ---------- Operator grid: open cells on hairlines, no card surfaces ----------
// 4 / 2 / 2 columns — desktop / tablet / mobile
.admin-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: $spacing-lg $spacing-md;
  list-style: none;
}

.op-item {
  display: flex;
}

// Each cell hangs from a hairline. A 4px tab in the role color sits on its
// left end and runs the full width when a linked cell is hovered or focused.
.op-card {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding-top: $spacing-sm;
  border-top: 1px solid $color-line;
  color: $color-fg;

  &::before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    width: 32px;
    height: 4px;
    background: var(--role-color);
    transition: width $transition-med;
  }

  &.is-link:hover,
  &.is-link:focus-visible {
    &::before {
      width: 100%;
    }

    .op-link {
      color: $color-accent-ink;
    }
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 4px;
  }
}

.op-head {
  display: flex;
  justify-content: space-between;
  gap: $spacing-sm;
  font-family: $font-display;
  font-size: $font-size-label;
  line-height: 1;
}

.op-index {
  font-variant-numeric: tabular-nums;
  color: $color-fg-subtle;
}

.op-link {
  color: $color-fg-subtle;
  transition: color $transition-fast;
}

// Square avatar with crop marks on two opposite corners, drawn in hairline
// ink just outside the image.
.op-frame {
  position: relative;
  align-self: flex-start;
  margin: $spacing-md 0 0 6px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    border: 0 solid $color-fg-subtle;
  }

  &::before {
    top: -6px;
    left: -6px;
    border-top-width: 1px;
    border-left-width: 1px;
  }

  &::after {
    right: -6px;
    bottom: -6px;
    border-right-width: 1px;
    border-bottom-width: 1px;
  }
}

.op-avatar {
  display: block;
  width: 64px;
  height: 64px;
  object-fit: cover;
}

.op-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-line;
  font-family: $font-display;
  font-size: $font-size-h4;
  font-weight: $font-weight-bold;
}

.op-name {
  margin-top: $spacing-md;
  font-family: $font-display;
  font-size: $font-size-lead;
  font-weight: $font-weight-bold;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

// status mark + title + role, the role set off by a hairline
.op-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 6px;
  font-size: $font-size-small;
  color: $color-fg-muted;
}

.status-mark {
  flex: none;
  width: 6px;
  height: 6px;

  &.status-online {
    background: $color-accent-ink;
  }

  &.status-away {
    border: 1px solid $color-fg-subtle;
  }
}

.op-role {
  padding-left: 8px;
  border-left: 1px solid $color-line;
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-fg-subtle;
}

@include tablet {
  .admin-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@include mobile {
  .admin-header {
    grid-template-columns: 1fr;
  }

  .admin-grid {
    gap: $spacing-md $spacing-sm;
  }

  .op-avatar {
    width: 48px;
    height: 48px;
  }

  .op-name {
    font-size: $font-size-body;
  }
}

@media (prefers-reduced-motion: reduce) {
  .op-card::before {
    transition: none;
  }
}
</style>
