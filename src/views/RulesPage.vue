<template>
  <div class="rules-page">
    <nav class="rules-nav">
      <router-link to="/" class="back-link">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          width="16"
          height="16"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回首页
      </router-link>
      <h1 class="nav-title">LazyAlienServer规章制度</h1>
      <span class="nav-version">2023.08.15</span>
    </nav>

    <article class="rules-content">
      <section v-for="(chapter, ci) in chapters" :key="chapter.id" class="chapter">
        <div class="chapter-header">
          <span class="chapter-index">{{ String(ci + 1).padStart(2, "0") }}</span>
          <h2 :id="String(ci + 1).padStart(2, '0')">{{ chapter.title }}</h2>
        </div>
        <div
          v-for="article in chapter.articles"
          :key="article.id"
          class="article"
          :class="{ 'article--flash': activeFlashArticleIds.includes(article.id) }"
        >
          <h3>{{ article.title }}</h3>
          <div class="article-body" v-html="article.content"></div>
        </div>
      </section>

      <footer class="rules-signoff">
        <p>
          <a href="https://space.bilibili.com/454721668" target="_blank" rel="noopener noreferrer"
            >tanh丶桁</a
          >
          &amp;
          <a href="https://space.bilibili.com/" target="_blank" rel="noopener noreferrer"
            >LazyAlienServer</a
          >
        </p>
        <p class="signoff-date">2023.08.15</p>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { chapters } from "@/data/rules";

const route = useRoute();

const flashArticleIdsByPath: Record<string, readonly string[]> = {
  "01": [
    "article-37",
    "article-38",
    "article-39",
    "article-40",
    "article-41",
    "article-42",
    "article-43",
  ],
  "02": ["article-44", "article-45", "article-46", "article-47"],
};

const activeFlashArticleIds = computed(() => {
  const path = route.query.path;
  return flashArticleIdsByPath[typeof path === "string" ? path : ""] ?? [];
});
</script>

<style scoped lang="scss">
.rules-page {
  background: $color-primary-black;
  min-height: 100vh;
}

.rules-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $color-gray-dark;
  border-left: 6px solid $color-primary-blue;
  padding: 16px $spacing-md;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  color: $color-gray-light;
  font-size: 14px;
  letter-spacing: 1px;
  white-space: nowrap;
  transition: color $transition-fast;

  &:hover {
    color: $color-blue-bright;
  }
}

.nav-title {
  font-size: 20px;
  color: $color-white;
  letter-spacing: 2px;
  text-align: center;
}

.nav-version {
  font-size: 12px;
  color: $color-gray-mid;
  letter-spacing: 2px;
  white-space: nowrap;
}

.rules-content {
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-lg $spacing-md $spacing-xl;
}

.chapter {
  margin-bottom: $spacing-xl;

  // chapter divider — blue line
  & + .chapter {
    border-top: 2px solid $color-primary-blue;
    padding-top: $spacing-lg;
  }
}

.chapter-header {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;

  .chapter-index {
    font-family: $font-display;
    font-size: $font-size-h3;
    font-weight: 700;
    color: transparent;
    -webkit-text-stroke: 1.5px $color-blue-bright;
  }

  h2 {
    font-size: $font-size-h3;
    color: $color-blue-bright;
  }
}

.article {
  margin-bottom: $spacing-md;
  padding-left: $spacing-md;
  border-left: 1px solid $color-gray-dark;

  h3 {
    font-size: $font-size-body-lg;
    color: $color-white;
    margin-bottom: $spacing-xs;
  }
}

.article--flash {
  animation: rules-article-flash 1.6s ease-out;
}

@keyframes rules-article-flash {
  0%,
  100% {
    background-color: transparent;
    box-shadow: none;
  }

  10%,
  35% {
    background-color: rgba(0, 102, 204, 0.32);
    box-shadow:
      0 0 0 1px rgba(30, 144, 255, 0.8),
      0 0 22px rgba(30, 144, 255, 0.28);
  }

  55% {
    background-color: rgba(0, 102, 204, 0.1);
    box-shadow: 0 0 0 1px rgba(30, 144, 255, 0.35);
  }
}

@media (prefers-reduced-motion: reduce) {
  .article--flash {
    animation: none;
    background-color: rgba(0, 102, 204, 0.18);
    box-shadow: 0 0 0 1px rgba(30, 144, 255, 0.45);
  }
}

.article-body {
  font-size: $font-size-body;
  line-height: 1.8;
  color: $color-gray-light;

  :deep(p) {
    margin-bottom: $spacing-xs;
  }

  :deep(p.note) {
    color: $color-gray-mid;
    font-size: 14px;
    padding-left: $spacing-sm;
    border-left: 2px solid $color-primary-blue;
    margin-top: 4px;
  }

  :deep(a) {
    color: $color-blue-bright;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color $transition-fast;

    &:hover {
      text-decoration-color: $color-blue-bright;
    }
  }

  :deep(ol) {
    margin: $spacing-xs 0 $spacing-xs $spacing-md;

    li {
      margin-bottom: 4px;
    }
  }
}

.rules-signoff {
  border-top: 1px solid $color-gray-dark;
  padding-top: $spacing-lg;
  text-align: right;
  color: $color-gray-light;

  a {
    color: $color-blue-bright;
  }

  .signoff-date {
    color: $color-gray-mid;
    font-size: 14px;
    letter-spacing: 2px;
  }
}

@include mobile {
  .nav-title {
    font-size: 16px;
  }

  .nav-version {
    display: none;
  }

  .chapter-header {
    .chapter-index {
      font-size: 28px;
    }

    h2 {
      font-size: 22px;
    }
  }
}
</style>
