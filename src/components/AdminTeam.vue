<template>
  <section class="admin-section">
    <div class="section-shell">
      <header class="admin-header" v-reveal>
        <div class="admin-heading">
          <p class="admin-kicker"><span class="admin-plate">Crew manifest</span></p>
          <h2 class="admin-title">管理团队</h2>
        </div>
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
        <ol class="admin-roster" aria-hidden="true">
          <li v-for="op in operators" :key="op.name" :class="`role-${op.role}`"></li>
        </ol>
      </header>

      <div class="admin-grid">
        <component
          :is="op.bilibiliUrl ? 'a' : 'div'"
          v-for="(op, i) in operators"
          :key="op.name"
          class="op-card"
          :class="{ 'no-link': !op.bilibiliUrl }"
          :href="op.bilibiliUrl ?? undefined"
          :target="op.bilibiliUrl ? '_blank' : undefined"
          :rel="op.bilibiliUrl ? 'noopener noreferrer' : undefined"
          v-reveal
        >
          <span class="op-index" aria-hidden="true">OP-{{ pad(i + 1) }}</span>

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
            class="op-avatar-fallback"
            role="img"
            :aria-label="`${op.name} operator avatar unavailable`"
          >
            {{ op.name.charAt(0) }}
          </span>

          <span class="op-info">
            <span class="op-name">{{ op.name }}</span>
            <span class="op-subtitle">
              <span class="status-dot" :class="`status-${op.status}`" aria-hidden="true"></span>
              <span>{{ op.title }}</span>
              <span class="op-role">{{ roleLabel(op.role) }}</span>
            </span>
          </span>

          <span v-if="op.bilibiliUrl" class="op-link">Bilibili →</span>
        </component>
      </div>
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
// In light the section is a gray band between white ones, and the cards
// turn white on it.
.admin-section {
  background-color: $color-bg;

  @include light {
    background-color: $color-surface;
  }
}

// ---------- Manifest header: headcount, role legend, per-operator roster strip ----------
// role colors are shared by the legend swatches and the roster segments; both
// are 4px lines, so they use ink roles
.role-admin {
  --role-color: #{$color-accent-ink};
}

.role-tech {
  --role-color: #{$color-accent-ink-deep};

  // both brand inks are black in light: step the lower roles down in tone
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

.admin-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: $spacing-md $spacing-lg;
  margin-bottom: $spacing-lg;
}

// Nameplate: a solid brand plate (blue in dark, yellow with black text in
// light) with a scribed rule running on to the headcount column.
.admin-kicker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: $spacing-sm;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: $color-line;
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

.admin-manifest {
  display: flex;
  align-items: flex-end;
  gap: $spacing-md;
}

.admin-count {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.admin-count-num {
  font-family: $font-display;
  font-size: 56px;
  font-weight: $font-weight-bold;
  line-height: 0.85;
  font-variant-numeric: tabular-nums;
  color: $color-fg;
}

.admin-count-label {
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-fg-subtle;
}

.admin-roles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: $spacing-md;
  border-left: 1px solid $color-line;
  list-style: none;
}

.admin-role {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-fg-muted;
}

.admin-role-swatch {
  width: 10px;
  height: 4px;
  background: var(--role-color);
}

// one segment per operator card, in card order
.admin-roster {
  grid-column: 1 / -1;
  display: flex;
  gap: 4px;
  list-style: none;

  li {
    flex: 1;
    height: 4px;
    background: var(--role-color);
  }
}

// 3 / 3 / 2 columns — desktop / tablet / mobile
.admin-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.op-card {
  position: relative;
  display: flex;
  gap: 14px;
  padding: 18px 18px 34px;
  overflow: hidden;
  background: $color-surface;
  border: 1px solid fade($color-fg, 0.06);
  color: $color-fg;
  transition:
    transform $transition-med,
    border-color $transition-med;

  @include light {
    background: $color-bg;
  }

  // only linked operators get interactive affordances
  &:not(.no-link):hover {
    transform: translateY(-3px);
    border-color: fade($color-accent-ink, 0.35);

    .op-link {
      color: $color-accent-ink;
    }
  }

  &.no-link {
    cursor: default;
  }
}

.op-index {
  position: absolute;
  top: 12px;
  right: 14px;
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-fg-subtle;
}

.op-avatar,
.op-avatar-fallback {
  flex-shrink: 0;
  width: clamp(56px, 5vw, 72px);
  height: clamp(56px, 5vw, 72px);
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
}

.op-avatar {
  object-fit: cover;
}

.op-avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $font-display;
  font-size: clamp(20px, 2vw, 28px);
  font-weight: $font-weight-bold;
  color: $color-fg;
}

.op-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding-top: 2px;
}

.op-name {
  font-family: $font-display;
  font-size: clamp(16px, 2.5vw, 20px);
  font-weight: $font-weight-bold;
  color: $color-fg;
  overflow-wrap: break-word;
}

// subtitle: status dot + title + role, all plain text
.op-subtitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-fg-subtle;
}

.op-role {
  padding-left: 7px;
  border-left: 1px solid $color-line;
  color: $color-fg-muted;
}

.status-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;

  &.status-online {
    background: $color-accent-ink;
    box-shadow: 0 0 6px $color-glow;
  }

  &.status-away {
    background: $color-fg-subtle;
  }
}

.op-link {
  position: absolute;
  right: 14px;
  bottom: 12px;
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-fg-subtle;
  transition: color $transition-fast;
}

@include tablet {
  .admin-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// mobile: 2 columns, cards go vertical — avatar top, text full width below
@include mobile {
  .admin-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .op-card {
    flex-direction: column;
    gap: 10px;
    padding: 16px 14px 32px;
  }

  .op-avatar,
  .op-avatar-fallback {
    width: clamp(44px, 15vw, 56px);
    height: clamp(44px, 15vw, 56px);
  }

  .admin-header {
    grid-template-columns: 1fr;
  }
}
</style>
