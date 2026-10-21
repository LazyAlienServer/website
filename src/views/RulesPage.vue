<template>
  <div class="rules-page">
    <header class="rules-heading">
      <p class="rules-kicker">LAS // COMMUNITY PROTOCOL</p>
      <h1>LazyAlienServer规章制度</h1>
      <p class="rules-version">修订日期 <time datetime="2023-08-15">2023.08.15</time></p>
    </header>

    <nav class="rules-toc" aria-label="章节目录">
      <a
        v-for="(chapter, ci) in chapters"
        :key="chapter.id"
        :href="`#${String(ci + 1).padStart(2, '0')}`"
        :class="{ 'is-active': activeChapterIndex === ci }"
        :aria-current="activeChapterIndex === ci ? 'location' : undefined"
      >
        <span class="toc-title">{{ chapter.title }}</span>
        <span class="toc-marker" aria-hidden="true"></span>
      </a>
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
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { chapters } from "@/data/rules";
import FooterSection from "@/components/FooterSection.vue";

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

const activeChapterIndex = ref(0);
let frame = 0;
const updateChapter = () => {
  frame = 0;
  const offset =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--site-nav-height"),
    ) || 84;
  const headings = document.querySelectorAll<HTMLElement>(".chapter-header h2[id]");
  let current = 0;
  headings.forEach((heading, index) => {
    if (heading.getBoundingClientRect().top <= offset + 32) current = index;
  });
  activeChapterIndex.value = current;
};
const scheduleChapter = () => {
  if (!frame) frame = requestAnimationFrame(updateChapter);
};
onMounted(() => {
  updateChapter();
  window.addEventListener("scroll", scheduleChapter, { passive: true });
  window.addEventListener("resize", scheduleChapter);
});
onUnmounted(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener("scroll", scheduleChapter);
  window.removeEventListener("resize", scheduleChapter);
});
</script>

<style scoped lang="scss">
.rules-page {
  background: $color-primary-black;
  min-height: 100vh;
  padding-top: var(--site-nav-height, 84px);
}

.rules-toc {
  position: fixed;
  top: 50%;
  right: 24px;
  z-index: 5;
  width: min(240px, calc((100vw - 900px) / 2 - 48px));
  max-height: calc(100dvh - var(--site-nav-height, 84px) * 2);
  overflow-y: auto;
  transform: translateY(-50%);

  a {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    padding: 8px 0;
    color: $color-gray-mid;
    font-size: 13px;

    &:hover,
    &.is-active {
      color: $color-blue-bright;
    }
    &:focus-visible {
      outline: 1px solid $color-blue-bright;
      outline-offset: -1px;
    }
  }
}

.toc-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.toc-marker {
  flex: none;
  width: 8px;
  height: 3px;
  background: currentColor;
  opacity: 0.4;
}

.is-active .toc-marker {
  width: 16px;
  opacity: 1;
}

.chapter-header h2 {
  scroll-margin-top: calc(var(--site-nav-height, 84px) + 24px);
}

@media (max-width: 1200px) {
  .rules-toc {
    display: none;
  }
}

.rules-heading {
  max-width: 900px;
  margin: 0 auto;
  padding: $spacing-lg * 1.5 $spacing-md $spacing-lg;
  border-bottom: 1px solid $color-gray-dark;

  h1 {
    max-width: 20ch;
    font-size: clamp(28px, 4vw, 48px);
    overflow-wrap: anywhere;
  }
}

.rules-kicker {
  margin-bottom: $spacing-sm;
  font-family: $font-display;
  font-size: 12px;
  letter-spacing: 3px;
  color: $color-blue-bright;
}

.rules-version {
  margin-top: $spacing-md;
  color: $color-gray-mid;
  font-size: 12px;
  letter-spacing: 2px;
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
