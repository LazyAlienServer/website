<template>
  <div class="rules-page">
    <header class="rules-heading">
      <div class="rules-heading-inner">
        <p class="rules-kicker">
          <span class="kicker-mark" aria-hidden="true"></span>
          LAS // COMMUNITY PROTOCOL
        </p>
        <h1>Lazy Alien Server<br /><span class="accent">规章制度</span></h1>
        <dl class="rules-spec">
          <div class="spec-field">
            <dt>REVISION</dt>
            <dd><time datetime="2023-08-15">2023.08.15</time></dd>
          </div>
          <div class="spec-field">
            <dt>CHAPTERS</dt>
            <dd>{{ pad(outline.length) }}</dd>
          </div>
          <div class="spec-field">
            <dt>ARTICLES</dt>
            <dd>{{ pad(articleCount) }}</dd>
          </div>
        </dl>
      </div>
    </header>

    <div class="rules-layout">
      <article class="rules-content">
        <section v-for="chapter in outline" :key="chapter.id" class="chapter">
          <header class="chapter-header">
            <span class="chapter-index" aria-hidden="true">{{ chapter.anchor }}</span>
            <div>
              <p class="chapter-meta">{{ chapter.label }} // 共 {{ chapter.articles.length }} 条</p>
              <h2 :id="chapter.anchor">{{ chapter.title }}</h2>
            </div>
          </header>
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
          <span class="signoff-label">END OF DOCUMENT</span>
          <div>
            <p>
              <a
                href="https://space.bilibili.com/454721668"
                target="_blank"
                rel="noopener noreferrer"
                >tanh丶桁</a
              >
              &amp;
              <a href="https://space.bilibili.com/" target="_blank" rel="noopener noreferrer"
                >LazyAlienServer</a
              >
            </p>
            <p class="signoff-date">2023.08.15</p>
          </div>
        </footer>
      </article>

      <nav ref="toc" class="rules-toc" :class="{ 'is-open': tocOpen }" aria-label="章节目录">
        <div class="toc-panel">
          <button
            type="button"
            class="toc-toggle"
            :aria-expanded="tocOpen"
            aria-controls="rules-toc-list"
            aria-label="展开章节目录"
            @click="tocOpen = true"
          ></button>
          <span class="toc-count" aria-hidden="true">
            {{ outline[activeChapterIndex]?.anchor }}/{{ pad(outline.length) }}
          </span>
          <ol id="rules-toc-list" :inert="tocCompact && !tocOpen">
            <li v-for="(chapter, ci) in outline" :key="chapter.id">
              <a
                :href="`#${chapter.anchor}`"
                :class="{ 'is-active': activeChapterIndex === ci }"
                :aria-current="activeChapterIndex === ci ? 'location' : undefined"
                @click="tocOpen = false"
              >
                <span class="toc-title">{{ chapter.title }}</span>
                <span class="toc-dash" aria-hidden="true"></span>
              </a>
            </li>
          </ol>
        </div>
      </nav>
    </div>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import { useRoute } from "vue-router";
import { chapters } from "@/data/rules";
import FooterSection from "@/components/FooterSection.vue";

const route = useRoute();

const pad = (value: number): string => String(value).padStart(2, "0");

// "第一章 关于 …" → label "第一章" + title "关于 …"; the anchor (01–09) is the route-hash contract.
const outline = chapters.map((chapter, index) => {
  const [, label = "", title = chapter.title] = /^(第.+?章)\s*(.*)$/.exec(chapter.title) ?? [];
  return { ...chapter, anchor: pad(index + 1), label, title };
});

const articleCount = chapters.reduce((total, chapter) => total + chapter.articles.length, 0);

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

// Mobile index: the rail collapses to its dashes; a toggle covering it opens
// the full titles. While collapsed the links are `inert`, so taps and Tab
// reach the toggle instead. A link tap, Escape, or a tap outside closes it,
// and leaving mobile width resets it. `COMPACT_QUERY` must match the
// `mobile` mixin that styles the collapsed rail.
const COMPACT_QUERY = "(max-width: 640px)";
const toc = useTemplateRef<HTMLElement>("toc");
const tocOpen = ref(false);
const tocCompact = ref(false);
let compactMedia: MediaQueryList | undefined;
const syncCompact = () => {
  tocCompact.value = compactMedia?.matches ?? false;
  if (!tocCompact.value) tocOpen.value = false;
};
const closeOnOutside = (event: PointerEvent) => {
  if (!toc.value?.contains(event.target as Node)) tocOpen.value = false;
};
const closeOnEscape = (event: KeyboardEvent) => {
  if (event.key !== "Escape") return;
  tocOpen.value = false;
  toc.value?.querySelector<HTMLElement>(".toc-toggle")?.focus();
};
watch(tocOpen, (open) => {
  if (open) {
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
  } else {
    document.removeEventListener("pointerdown", closeOnOutside);
    document.removeEventListener("keydown", closeOnEscape);
  }
});

onMounted(() => {
  updateChapter();
  window.addEventListener("scroll", scheduleChapter, { passive: true });
  window.addEventListener("resize", scheduleChapter);
  compactMedia = window.matchMedia(COMPACT_QUERY);
  syncCompact();
  compactMedia.addEventListener("change", syncCompact);
});
onUnmounted(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener("scroll", scheduleChapter);
  window.removeEventListener("resize", scheduleChapter);
  compactMedia?.removeEventListener("change", syncCompact);
  document.removeEventListener("pointerdown", closeOnOutside);
  document.removeEventListener("keydown", closeOnEscape);
});
</script>

<style scoped lang="scss">
.rules-page {
  background: $color-primary-black;
  min-height: 100vh;
  padding-top: var(--site-nav-height, 84px);
}

// ---------- Document header: blueprint band + spec plate ----------
.rules-heading {
  position: relative;
  border-bottom: 1px solid $color-gray-dark;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(180deg, #000 0%, transparent 100%);
    pointer-events: none;
  }
}

.rules-heading-inner {
  position: relative;
  max-width: calc(900px + 2 * #{$spacing-md});
  margin: 0 auto;
  padding: 80px $spacing-md 40px;

  h1 {
    font-size: clamp(34px, 4.6vw, 60px);
    line-height: 1.02;
    color: $color-white;
  }

  .accent {
    color: $color-blue-bright;
  }
}

.rules-kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  font-family: $font-display;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 3px;
  color: $color-gray-mid;
}

.kicker-mark {
  flex: none;
  width: 22px;
  height: 10px;
  margin-right: 4px;
  background: $color-blue-bright;
  transform: skewX(calc(-1 * var(--hero-slant)));
}

.rules-spec {
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
  margin-top: 32px;
}

.spec-field {
  padding: 2px 32px 2px 12px;
  border-left: 1px solid $color-gray-dark;

  &:first-child {
    border-left: 3px solid $color-blue-bright;
  }

  dt {
    font-family: $font-display;
    font-size: 10px;
    letter-spacing: 2px;
    color: $color-gray-mid;
  }

  dd {
    font-family: $font-display;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    font-variant-numeric: tabular-nums;
    color: $color-white;
  }
}

// ---------- Layout: centered document column + right index rail ----------
.rules-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 900px) minmax(0, 1fr);
  column-gap: $spacing-lg;
  padding-inline: $spacing-md;
}

.rules-content {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  padding: $spacing-lg 0 96px;
}

// ---------- Chapters ----------
// Hairline divider with a short blue accent, matching the footer's top edge.
.chapter {
  position: relative;

  & + .chapter {
    margin-top: 72px;
    padding-top: $spacing-lg;
    border-top: 1px solid $color-gray-dark;

    &::before {
      content: "";
      position: absolute;
      top: -2px;
      left: 0;
      width: 64px;
      height: 3px;
      background: $color-blue-bright;
    }
  }
}

.chapter-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: end;
  gap: 20px;
  margin-bottom: 28px;

  h2 {
    font-size: clamp(24px, 2.6vw, 32px);
    color: $color-white;
    scroll-margin-top: calc(var(--site-nav-height, 84px) + 24px);
  }
}

.chapter-index {
  font-family: $font-display;
  font-size: 64px;
  font-weight: 700;
  line-height: 0.8;
  font-variant-numeric: tabular-nums;
  color: transparent;
  -webkit-text-stroke: 1px rgba(30, 144, 255, 0.75);
}

.chapter-meta {
  margin-bottom: 6px;
  font-family: $font-display;
  font-size: 12px;
  letter-spacing: 2px;
  color: $color-gray-mid;
}

// ---------- Articles: label column + body column ----------
// Negative inline margin lets the flash highlight frame the row without
// shifting text off the document column.
.article {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: $spacing-md;
  margin-inline: -12px;
  padding: 18px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  h3 {
    padding-top: 3px;
    font-size: 14px;
    letter-spacing: 2px;
    color: $color-gray-mid;
  }
}

.article--flash {
  animation: rules-article-flash 1.6s ease-out;

  h3 {
    color: $color-blue-bright;
  }
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

.article-body {
  font-size: $font-size-body;
  line-height: 1.8;
  color: $color-gray-light;

  :deep(p) {
    margin-bottom: $spacing-xs;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(p.note) {
    margin-top: 6px;
    padding: 6px 12px;
    border-left: 2px solid $color-primary-blue;
    background: rgba(30, 144, 255, 0.06);
    color: $color-gray-mid;
    font-size: 14px;
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

// ---------- Sign-off ----------
.rules-signoff {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: $spacing-md;
  margin-top: 72px;
  padding-top: $spacing-lg;
  border-top: 1px solid $color-gray-dark;
  text-align: right;
  color: $color-gray-light;

  a {
    color: $color-blue-bright;
  }
}

.signoff-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 3px;
  color: $color-gray-mid;

  &::before {
    content: "";
    width: 40px;
    height: 10px;
    @include hatch-strip(rgba(255, 255, 255, 0.3));
  }
}

.signoff-date {
  font-family: $font-display;
  font-size: 13px;
  letter-spacing: 2px;
  color: $color-gray-mid;
}

// ---------- Index rail ----------
// Sticky inside the right grid column, so it stops at the end of the document
// instead of overlapping the footer. The sticky box spans the viewport below
// the navbar and centers the list vertically. Unframed: right-aligned titles,
// each ending in a dash; the active dash lengthens and turns blue.
.rules-toc {
  grid-column: 3;
  grid-row: 1;
  justify-self: end;
  align-self: start;
  position: sticky;
  top: var(--site-nav-height, 84px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: min(240px, 100%);
  height: calc(100dvh - var(--site-nav-height, 84px));

  ol {
    list-style: none;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 7px 0;
    color: $color-gray-mid;
    font-size: 13px;
    transition: color $transition-med;

    &:hover {
      color: $color-gray-light;
    }

    &.is-active {
      color: $color-blue-bright;
    }

    &:focus-visible {
      outline: 1px solid $color-blue-bright;
      outline-offset: 2px;
    }
  }
}

// Sits just above the first entry, right-aligned with the dashes. Absolute,
// so the list itself stays vertically centered in the rail.
.toc-panel {
  position: relative;
}

.toc-count {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  padding: 1px 5px;
  border: 1px solid $color-gray-dark;
  font-family: $font-display;
  font-size: 10px;
  letter-spacing: 1px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: $color-gray-mid;
}

.toc-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.toc-dash {
  flex: none;
  width: 8px;
  height: 2px;
  background: rgba(255, 255, 255, 0.25);
  transition:
    width $transition-med,
    height $transition-med,
    background-color $transition-med;
}

.is-active .toc-dash {
  width: 16px;
  height: 3px;
  background: $color-blue-bright;
}

// Only the mobile rail collapses; elsewhere the toggle does not exist.
.toc-toggle {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .article--flash {
    animation: none;
    background-color: rgba(0, 102, 204, 0.18);
    box-shadow: 0 0 0 1px rgba(30, 144, 255, 0.45);
  }

  .rules-toc a,
  .toc-dash {
    transition: none;
  }
}

// ---------- Responsive ----------
// Below 1360px the side columns are too narrow for readable titles.
@media (max-width: 1360px) {
  .rules-layout {
    display: block;
    max-width: calc(900px + 2 * #{$spacing-md});
    margin-inline: auto;
  }

  .rules-toc {
    display: none;
  }
}

@include mobile {
  .rules-heading-inner {
    padding: 48px $spacing-sm 32px;
  }

  .rules-layout {
    padding-inline: $spacing-sm;
  }

  .spec-field {
    padding-right: 20px;
  }

  .chapter-index {
    font-size: 44px;
  }

  .chapter-header {
    gap: 14px;
  }

  .article {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .rules-signoff {
    flex-direction: column;
    align-items: flex-end;
  }

  // Collapsed index rail: fixed to the right edge, dashes only, with the
  // reading column padded clear of it. The toggle covers the whole rail, so
  // any tap opens the panel; open, the titles slide in from zero width over a
  // dark backing that fades in.
  // Dashes keep their place in both states: every row is a fixed 32px tall
  // (so the vertically centered panel keeps its height), the right padding
  // never changes, and the hidden title takes no width or gap (`gap: 0`,
  // spacing via `margin-right`). The `xx/09` count is not shown on mobile.
  .rules-layout {
    padding-right: 40px;
  }

  .rules-toc {
    display: flex;
    position: fixed;
    top: var(--site-nav-height, 84px);
    right: 0;
    z-index: 5;
    width: auto;
    max-width: calc(100vw - #{$spacing-lg});
    pointer-events: none;

    a {
      gap: 0;
      height: 32px;
      padding: 0;
    }

    .toc-count {
      display: none;
    }

    .toc-title {
      max-width: 0;
      margin-right: 0;
      opacity: 0;
      transition:
        max-width $transition-med,
        margin-right $transition-med,
        opacity $transition-med;
    }

    &.is-open {
      .toc-toggle {
        display: none;
      }

      .toc-title {
        max-width: calc(100vw - 96px);
        margin-right: 10px;
        opacity: 1;
      }

      .toc-panel {
        padding-left: $spacing-sm;
        border-left-color: $color-gray-dark;
        background-color: rgba(10, 10, 10, 0.94);
        backdrop-filter: blur(8px);
      }
    }
  }

  .toc-panel {
    position: relative;
    max-height: 100%;
    overflow-y: auto;
    padding: 4px 8px;
    border-left: 1px solid transparent;
    background-color: transparent;
    pointer-events: auto;
    transition:
      padding $transition-med,
      border-color $transition-med,
      background-color $transition-med,
      backdrop-filter $transition-med;
  }

  .toc-toggle {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 1;
    border: none;
    background: none;
    cursor: pointer;

    &:focus-visible {
      outline: 1px solid $color-blue-bright;
      outline-offset: -1px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .rules-toc .toc-title,
    .toc-panel {
      transition: none;
    }
  }
}
</style>
