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

      <div class="admin-list">
        <a
          v-for="admin in admins"
          :key="admin.name"
          class="admin-card"
          :href="admin.bilibiliUrl"
          target="_blank"
          rel="noopener noreferrer"
          v-reveal
        >
          <span class="admin-avatar">{{ admin.name.charAt(0) }}</span>
          <span class="admin-info">
            <span class="admin-name">{{ admin.name }}</span>
            <span class="admin-title">{{ admin.title }}</span>
          </span>
          <span class="admin-link">
            BILIBILI
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              width="14"
              height="14"
            >
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Admin {
  name: string;
  title: string;
  bilibiliUrl: string;
}

const admins: Admin[] = [
  {
    name: "CatCoinZHSM",
    title: "服主",
    bilibiliUrl: "https://space.bilibili.com/401914568",
  },
  {
    name: "tanh_Heng",
    title: "物理服主",
    bilibiliUrl: "https://space.bilibili.com/454721668",
  },
];
</script>

<style scoped lang="scss">
.admin-section {
  background: $color-primary-black;
}

.admin-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-width: 720px;
}

.admin-card {
  @include clipped-panel;
  position: relative;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  color: $color-white;

  // short status rail replaces the repeated four-corner frame
  &::before {
    content: "";
    position: absolute;
    left: -1px;
    top: $spacing-sm;
    bottom: $spacing-sm;
    width: 2px;
    background: $color-primary-blue;
    opacity: 0.85;
    pointer-events: none;
  }

  transition:
    transform $transition-med,
    box-shadow $transition-med,
    border-color $transition-med;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
    border-color: $color-primary-blue;

    .admin-name {
      text-decoration-color: $color-blue-bright;
    }

    .admin-link {
      color: $color-blue-bright;
    }
  }
}

.admin-avatar {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-primary-blue;
  color: $color-white;
  font-family: $font-display;
  font-size: 28px;
  font-weight: 700;
}

.admin-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.admin-name {
  font-family: $font-display;
  font-size: $font-size-h4;
  font-weight: 700;
  letter-spacing: 1px;
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 3px;
  text-underline-offset: 6px;
  transition: text-decoration-color $transition-fast;
}

.admin-title {
  font-size: 14px;
  color: $color-gray-mid;
  letter-spacing: 3px;
}

.admin-link {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: 2px;
  color: $color-gray-mid;
  transition: color $transition-fast;
}

@include mobile {
  .admin-card {
    padding: $spacing-sm $spacing-md;
  }

  .admin-avatar {
    width: 48px;
    height: 48px;
    font-size: 22px;
  }

  .admin-link {
    display: none;
  }
}
</style>
