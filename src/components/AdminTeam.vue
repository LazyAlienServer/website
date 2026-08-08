<template>
  <section class="admin-section">
    <div class="section-shell">
      <div class="section-header" v-reveal>
        <div class="index-row">
          <span class="index-num">06</span>
          <span class="index-label">// OPERATORS</span>
        </div>
        <h2 class="section-title">管理团队</h2>
        <div class="title-rule"></div>
      </div>

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
              {{ op.title }} · {{ roleLabel(op.role) }}
            </span>
          </span>

          <span class="op-link" :class="{ disabled: !op.bilibiliUrl }">
            <template v-if="op.bilibiliUrl">BILIBILI →</template>
            <template v-else>—</template>
          </span>
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
];

const roleLabels: Record<string, string> = {
  core: "CORE",
  tech: "TECH",
  admin: "ADMIN",
  mod: "MOD",
};

const roleLabel = (role: OperatorRole): string => roleLabels[role] ?? role.toUpperCase();

const pad = (value: number): string => String(value).padStart(2, "0");

// names of operators whose avatar failed to load — initials fallback renders instead
const failedAvatars = reactive(new Set<string>());
const onAvatarError = (name: string): void => {
  failedAvatars.add(name);
};
</script>

<style scoped lang="scss">
.admin-section {
  background-color: $color-primary-black;
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
  background: $color-black-soft;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: $color-white;
  transition:
    transform $transition-med,
    border-color $transition-med;

  // only linked operators get interactive affordances
  &:not(.no-link):hover {
    transform: translateY(-3px);
    border-color: rgba(30, 144, 255, 0.35);

    .op-link {
      color: $color-blue-bright;
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
  font-size: 10px;
  letter-spacing: 1px;
  color: $color-gray-mid;
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
  font-weight: 700;
  color: $color-white;
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
  font-weight: 700;
  letter-spacing: 1px;
  color: $color-white;
  overflow-wrap: break-word;
}

// subtitle: status dot + title + role, all plain text
.op-subtitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $color-gray-mid;
}

.status-dot {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;

  &.status-online {
    background: $color-blue-bright;
    box-shadow: 0 0 6px $color-blue-bright;
  }

  &.status-away {
    background: $color-gray-mid;
  }
}

.op-link {
  position: absolute;
  right: 14px;
  bottom: 12px;
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-gray-mid;
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

  .op-subtitle {
    font-size: 10px;
  }
}
</style>
