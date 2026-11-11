<template>
  <section class="github-section">
    <div class="section-shell gh-shell">
      <!-- Left brand rail: LAS mark + vertical GITHUB label -->
      <div class="gh-rail" aria-hidden="true">
        <!-- Wide screens: a scale split into one segment per repo; the mark
             follows the featured repo, a ghost the hovered or focused card -->
        <div
          v-if="repos.length"
          class="gh-scale"
          :style="{ '--n': repos.length, '--at': current, '--to': hovered ?? current }"
        >
          <span
            class="gh-scale-mark gh-scale-mark--ghost"
            :class="{ 'is-on': hovered !== null && hovered !== current }"
          ></span>
          <span class="gh-scale-mark">
            <span class="gh-scale-index">{{ pad(current + 1) }}</span>
          </span>
        </div>
        <img class="gh-rail-logo" :src="logoUrl" alt="" />
        <div class="gh-rail-labels">
          <span class="gh-rail-text">GitHub</span>
          <span class="gh-rail-detail">
            <span class="gh-rail-detail-desktop">github.com/<br />LazyAlienServer</span>
            <span class="gh-rail-detail-mobile">LazyAlienServer</span>
          </span>
        </div>
      </div>
      <div class="gh-content">
        <div class="github-title" v-reveal>
          <p class="github-title-kicker">Lazy Alien Server</p>
          <div class="github-title-en-row">
            <span class="github-title-block" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M5 5 19 19M19 7v12H7" />
              </svg>
            </span>
            <span>Open source</span>
          </div>
          <h2 class="github-title-cn">开源项目</h2>
        </div>

        <!-- Loading skeletons — same silhouette as the live deck -->
        <template v-if="loading">
          <div class="feature-head" aria-hidden="true">
            <span class="sk-block sk-head-meta"></span>
            <span class="sk-block sk-head-name"></span>
            <div class="feature-rule"></div>
          </div>
          <div class="deck" aria-hidden="true">
            <div v-for="s in 3" :key="s" class="deck-card skeleton" :data-slot="s - 1">
              <div class="card-body">
                <span class="sk-block sk-idx"></span>
                <span class="sk-block sk-name"></span>
                <span class="sk-block sk-desc"></span>
                <span class="sk-block sk-desc sk-short"></span>
                <div class="sk-meta">
                  <span class="sk-block sk-chip"></span>
                  <span class="sk-block sk-stars"></span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Error state -->
        <div v-else-if="error || repos.length === 0" class="error-state" v-reveal>
          <p class="error-label">Repository index offline</p>
          <p class="error-msg">{{ error ?? "No public repositories found." }}</p>
          <button class="retry-btn" @click="loadRepos">Retry uplink</button>
        </div>

        <template v-else>
          <!-- Dynamic title row (desktop) — tracks the featured repo -->
          <div class="feature-head" v-reveal>
            <Transition name="head-swap" mode="out-in">
              <div :key="active.name" class="feature-head-inner">
                <p class="feature-meta">
                  <span class="feature-tag">// {{ active.language ?? "misc" }}</span>
                  <time class="feature-date">{{ formatDate(active.pushed_at) }}</time>
                </p>
                <h3 class="feature-name">{{ active.name }}</h3>
              </div>
            </Transition>
            <div class="feature-rule"></div>
          </div>

          <!-- Deck: slot 0 = featured link, slots 1-2 = peek previews, 3-4 = offstage -->
          <div
            class="deck desktop-deck"
            role="group"
            aria-roledescription="carousel"
            aria-label="开源项目轮播"
            tabindex="0"
            v-reveal
            @keydown.left.prevent="prev(true)"
            @keydown.right.prevent="next(true)"
            @mouseenter="hoverPaused = true"
            @mouseleave="hoverPaused = false"
            @focusin="hoverPaused = true"
            @focusout="hoverPaused = false"
          >
            <a
              v-for="(repo, i) in repos"
              :key="repo.name"
              class="deck-card"
              :data-slot="slotOf(i)"
              :href="repo.html_url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-current="slotOf(i) === 0 ? 'true' : undefined"
              :aria-hidden="slotOf(i) > 2 ? 'true' : undefined"
              :tabindex="slotOf(i) > 2 ? -1 : undefined"
              @click="onRepoClick($event, i)"
              @mouseenter="hovered = i"
              @mouseleave="hovered = null"
              @focus="hovered = i"
              @blur="hovered = null"
            >
              <div class="card-body">
                <span class="card-index" aria-hidden="true">{{ pad(i + 1) }}</span>
                <h4 class="card-name">{{ repo.name }}</h4>
                <p class="card-desc">{{ repo.description || "No description provided." }}</p>
                <div class="card-meta">
                  <span v-if="repo.language" class="lang-text">{{ repo.language }}</span>
                  <span class="repo-stars">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="14"
                      height="14"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"
                      />
                    </svg>
                    {{ repo.stargazers_count }}
                  </span>
                  <span v-if="slotOf(i) === 0" class="repo-link" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      width="16"
                      height="16"
                    >
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </div>

          <div
            class="mobile-card-list"
            role="group"
            aria-roledescription="carousel"
            aria-label="开源项目移动端列表"
            tabindex="0"
            v-reveal
            @keydown.left.prevent="prev(true)"
            @keydown.right.prevent="next(true)"
            @focusin="hoverPaused = true"
            @focusout="hoverPaused = false"
          >
            <!-- Only the current and next repos render; on a switch the next
                 card slides up into the current place while the old one leaves -->
            <TransitionGroup
              tag="div"
              class="mobile-card-track"
              :name="direction > 0 ? 'stack-next' : 'stack-prev'"
            >
              <div
                v-for="{ repo, i, slot } in mobileRepos"
                :key="`mobile-${repo.name}`"
                class="mobile-card-item"
              >
                <a
                  class="mobile-repo-card"
                  :href="repo.html_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-current="slot === 0 ? 'true' : undefined"
                  @click="onRepoClick($event, i)"
                >
                  <div class="card-body">
                    <span class="card-index" aria-hidden="true">{{ pad(i + 1) }}</span>
                    <h4 class="card-name">{{ repo.name }}</h4>
                    <p class="card-desc">{{ repo.description || "No description provided." }}</p>
                    <div class="card-meta">
                      <span v-if="repo.language" class="lang-text">{{ repo.language }}</span>
                      <span class="repo-stars">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="14"
                          height="14"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"
                          />
                        </svg>
                        {{ repo.stargazers_count }}
                      </span>
                      <time class="card-date">{{ formatDate(repo.pushed_at) }}</time>
                      <span v-if="slot === 0" class="repo-link" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          width="16"
                          height="16"
                        >
                          <path d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </TransitionGroup>
          </div>

          <div class="deck-controls" v-reveal>
            <div class="deck-pager">
              <button type="button" class="page-btn" aria-label="上一个项目" @click="prev(true)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <span class="deck-counter" aria-live="polite">
                {{ current + 1 }}<span class="counter-divider">/</span>{{ repos.length }}
              </span>
              <button type="button" class="page-btn" aria-label="下一个项目" @click="next(true)">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <a
              class="more-btn"
              href="https://github.com/LazyAlienServer"
              target="_blank"
              rel="noopener noreferrer"
            >
              查看更多
            </a>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import logoUrl from "@/assets/logo.svg";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
}

interface RepoCache {
  at: number;
  repos: Repo[];
}

const isRepo = (value: unknown): value is Repo => {
  if (typeof value !== "object" || value === null) return false;
  const repo = value as Record<string, unknown>;
  return (
    typeof repo.name === "string" &&
    (repo.description === null || typeof repo.description === "string") &&
    typeof repo.html_url === "string" &&
    typeof repo.stargazers_count === "number" &&
    (repo.language === null || typeof repo.language === "string") &&
    typeof repo.pushed_at === "string"
  );
};

const isRepoArray = (value: unknown): value is Repo[] =>
  Array.isArray(value) && value.every(isRepo);

const isRepoCache = (value: unknown): value is RepoCache => {
  if (typeof value !== "object" || value === null) return false;
  const cache = value as Record<string, unknown>;
  return typeof cache.at === "number" && isRepoArray(cache.repos);
};

const repos = ref<Repo[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const CACHE_KEY = "las-github-repos";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes — mitigates GitHub API rate limits
const REPO_COUNT = 5;

const pad = (value: number): string => String(value).padStart(2, "0");
const formatDate = (iso: string): string => iso.slice(0, 10).split("-").join(".");

const loadRepos = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("https://api.github.com/orgs/LazyAlienServer/repos?per_page=100");
    if (!response.ok) throw new Error("Failed to fetch repos");
    const data: unknown = await response.json();
    if (!isRepoArray(data)) throw new Error("Invalid repository response");
    // list API can't sort by stars — sort client-side, take top N
    repos.value = data.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, REPO_COUNT);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos: repos.value }));
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    loading.value = false;
  }
};

// ---------- Carousel ----------
const current = ref(0);
const hoverPaused = ref(false);
// Desktop card under the pointer or focus, shown as a ghost on the gutter scale.
const hovered = ref<number | null>(null);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const AUTOPLAY_MS = 6_000;
const AUTO_SWITCH_COOLDOWN_MS = 5_000;
let autoSwitchCooldownUntil = 0;
let autoplayId: number | undefined;

const active = computed(() => repos.value[current.value] ?? repos.value[0]);

// Circular slot: 0 featured, 1-2 peeks, 3 offstage-right, 4 offstage-left.
// Invisible slots absorb the wrap-around jump so visible cards always slide.
const slotOf = (i: number): number => (i - current.value + repos.value.length) % repos.value.length;

// Mobile renders the current repo and the next one (one when there is only
// one repo), in slot order, so the list stays current-first across the wrap.
const mobileRepos = computed(() => {
  const count = repos.value.length;
  return Array.from({ length: Math.min(2, count) }, (_, slot) => {
    const i = (current.value + slot) % count;
    return { repo: repos.value[i], i, slot };
  });
});

// Travel direction of the last switch (1 forward, -1 back): picks the mobile
// stack transition. Taken as the shorter way round the circular list.
const direction = ref<1 | -1>(1);

const go = (i: number, userInitiated = false) => {
  if (userInitiated) {
    autoSwitchCooldownUntil = Date.now() + AUTO_SWITCH_COOLDOWN_MS;
  }
  const count = repos.value.length;
  const target = (i + count) % count;
  const delta = (target - current.value + count) % count;
  direction.value = delta <= count / 2 ? 1 : -1;
  current.value = target;
};

const onRepoClick = (event: MouseEvent, i: number) => {
  if (slotOf(i) === 0) return;
  event.preventDefault();
  go(i, true);
};
const next = (userInitiated = false) => go(current.value + 1, userInitiated);
const prev = (userInitiated = false) => go(current.value - 1, userInitiated);

onMounted(() => {
  // Warm cache first — instant paint, no rate-limit burn
  try {
    const cachedValue = localStorage.getItem(CACHE_KEY);
    if (cachedValue) {
      const cachedData: unknown = JSON.parse(cachedValue);
      if (
        isRepoCache(cachedData) &&
        Date.now() - cachedData.at < CACHE_TTL &&
        cachedData.repos.length
      ) {
        repos.value = cachedData.repos;
        loading.value = false;
        return;
      }
    }
  } catch {
    // corrupt cache — fall through to network
  }
  void loadRepos();
});

onMounted(() => {
  if (reduceMotion) return;
  autoplayId = window.setInterval(() => {
    if (hoverPaused.value || document.hidden) return;
    if (Date.now() < autoSwitchCooldownUntil) return;
    next();
  }, AUTOPLAY_MS);
});

onUnmounted(() => clearInterval(autoplayId));
</script>

<style scoped lang="scss">
// Clips the deck and the head rule, which run on to the viewport's right edge.
.github-section {
  background-color: $color-bg;
  overflow-x: clip;
}

.gh-shell {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: $spacing-lg;
  align-items: stretch;
}

.gh-content {
  min-width: 0;
}

// ---------- Left brand rail ----------
.gh-rail {
  align-self: stretch;
  background: $color-accent;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-md 0;
}

.gh-rail-logo {
  width: 44px;
  flex-shrink: 0;

  // The logo asset is white; it sits on the yellow rail in light.
  @include light {
    filter: brightness(0);
  }
}

.gh-rail-labels {
  margin-top: auto;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  width: 100%;
}

.gh-rail-text {
  writing-mode: vertical-rl;
  font-family: $font-display;
  font-size: 24px;
  font-weight: $font-weight-bold;
  color: $color-on-accent;
  line-height: 1;
}

.gh-rail-detail {
  height: fit-content;
  position: relative;
  width: 18px;
  flex-shrink: 0;
  color: fade($color-on-accent, 0.76);
}

.gh-rail-detail-desktop,
.gh-rail-detail-mobile {
  position: absolute;
  top: 0;
  left: 100%;
  display: block;
  font-family: $font-display;
  line-height: 1.1;
  white-space: nowrap;
  transform: rotate(90deg);
  transform-origin: top left;
}

.gh-rail-detail-desktop {
  font-size: 8px;
  font-weight: $font-weight-regular;
}

.gh-rail-detail-mobile {
  display: none;
}

// ---------- Structure-reference section title ----------
.github-title {
  margin-bottom: $spacing-lg;
}

.github-title-kicker {
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-fg-subtle;
}

// Kicker after the Endfield headings, same build as the hero's "We are" row
// (HeroSection.vue): a block with a ↘ arrow at its right end, sized in em of
// the row's font size. Dark: blue block, white arrow; light: gray block,
// black arrow.
.github-title-en-row {
  display: flex;
  align-items: center;
  gap: 0.3em;
  margin-top: 2px;
  font-family: $font-display;
  font-size: 20px;
  font-weight: $font-weight-medium;
  line-height: 1;
  color: $color-fg;
}

.github-title-block {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: flex-end;
  width: 3em;
  height: 0.9em;
  padding-right: 0.1em;
  background: $color-accent;
  color: $color-on-accent;

  @include light {
    background: $color-line;
  }

  svg {
    width: 0.62em;
    height: 0.62em;
    fill: none;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: square;
  }
}

.github-title-cn {
  margin-top: $spacing-xs;
  font-size: $font-size-h3;
  color: $color-fg;
}

// ---------- Dynamic title row (desktop) ----------
// One line: tag and date, the featured repo's name, then a full-width rule.
.feature-meta {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  font-family: $font-display;
  font-size: $font-size-small;
  color: $color-fg-subtle;
}

.feature-tag {
  color: $color-accent-ink;
}

.feature-date {
  color: $color-fg-subtle;
}

.feature-name {
  margin-top: $spacing-xs;
  font-size: $font-size-h4;
  font-weight: $font-weight-medium;
  color: $color-fg;
  text-transform: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// runs on to the viewport's right edge, like the deck below it
.feature-rule {
  height: 1px;
  margin-top: $spacing-sm;
  margin-right: -100vw;
  background: $color-line;
}

.head-swap-enter-active,
.head-swap-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.head-swap-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.head-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// ---------- Deck ----------
.deck {
  position: relative;
  height: 340px;
  margin-top: $spacing-md;
  overflow: hidden;
  outline: none;

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 4px;
  }
}

.deck-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  border: 1px solid fade($color-fg, 0.06);
  background: $color-surface;
  color: $color-fg;
  font: inherit;
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  transition: border-color $transition-med;

  &:hover,
  &:focus-visible {
    border-color: fade($color-accent-ink, 0.35);
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: -2px;
  }
}

@include desktop {
  .deck-card {
    position: absolute;
    top: 0;
    width: 50%;
    min-width: 360px;
    transform-origin: left center;
    will-change: transform, opacity;
    transition:
      transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.4s ease,
      border-color $transition-med;

    &[data-slot="0"] {
      transform: translate3d(0, 0, 0) scale(1);
      z-index: 3;

      @include corner-brackets;
    }

    // Peeks at 82%, centred on the featured card and dimmed like the
    // reference's washed-out previews; hover or focus lifts them.
    &[data-slot="1"],
    &[data-slot="2"] {
      opacity: 0.45;

      &:hover,
      &:focus-visible {
        opacity: 0.8;
      }
    }

    &[data-slot="1"] {
      transform: translate3d(104%, 0, 0) scale(0.82);
      z-index: 2;
    }

    &[data-slot="2"] {
      transform: translate3d(190%, 0, 0) scale(0.82);
      z-index: 1;
    }

    // Offstage slots absorb wrap-around while remaining invisible.
    &[data-slot="3"] {
      transform: translate3d(276%, 0, 0) scale(0.82);
      opacity: 0;
      pointer-events: none;
    }

    &[data-slot="4"] {
      transform: translate3d(-110%, 0, 0) scale(0.82);
      opacity: 0;
      pointer-events: none;
    }
  }
}

// ---------- Card interior (full size = featured & mobile) ----------
.card-body {
  position: relative;
  flex: none;
  display: flex;
  flex-direction: column;
  aspect-ratio: 16 / 9;
  padding: $spacing-md;
  overflow: hidden;
}

.card-index {
  position: absolute;
  right: $spacing-sm;
  bottom: -24px;
  font-family: $font-display;
  font-size: 160px;
  font-weight: $font-weight-bold;
  line-height: 1;
  color: fade($color-accent-ink, 0.1);
  pointer-events: none;
  user-select: none;
}

.card-name {
  font-size: 28px;
  color: $color-fg;
  text-transform: none;
  overflow-wrap: break-word;
}

.card-desc {
  flex: 1;
  margin-top: $spacing-sm;
  font-size: $font-size-small;
  color: $color-fg-muted;
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-top: $spacing-md;
}

.lang-text {
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-accent-ink;
}

.repo-stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: $font-display;
  font-size: $font-size-small;
  font-weight: $font-weight-bold;
  color: $color-accent-ink;
}

// mobile cards only: the date the head row shows on desktop
.card-date {
  font-family: $font-display;
  font-size: $font-size-label;
  color: $color-fg-subtle;
}

.repo-link {
  margin-left: auto;
  display: inline-flex;
  color: $color-fg-subtle;

  svg {
    transition:
      transform $transition-med,
      color $transition-med;
  }
}

.deck-card[data-slot="0"] {
  &:hover .repo-link svg,
  &:focus-visible .repo-link svg {
    transform: rotate(-45deg) translateX(4px);
    color: $color-accent-ink;
  }
}

// Independent mobile list — absent from desktop layout
.mobile-card-list {
  display: none;
}

// ---------- Controls ----------
// After the reference: a pager capsule (both arrows and the count in one
// pill), then the dark "more" button with a brand bar.
.deck-controls {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-top: $spacing-md;
}

.deck-pager {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: $spacing-xs;
  padding: 4px;
  border: 1px solid $color-line;
  border-radius: 999px;
  background: $color-surface;
}

.page-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid $color-line;
  background: $color-bg;
  color: $color-fg;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    border-color $transition-fast,
    background $transition-fast,
    transform $transition-fast;

  &:hover {
    border-color: $color-accent-ink;
    background: fade($color-accent-bright, 0.12);
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: 2px;
  }
}

.deck-counter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: $font-display;
  font-size: $font-size-small;
  color: $color-fg-muted;

  .counter-divider {
    color: $color-fg-subtle;
  }
}

// Dark in both themes, like the reference's: in light it takes the dark
// neutrals, so the bar turns yellow on it. The focus ring is drawn inside,
// on the dark fill, where the yellow ink reads. Label centred, bar pinned at
// the left edge; wide enough to read as a button beside the pager.
.more-btn {
  @include dark-surface;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 176px;
  height: 46px;
  padding: 0 28px;
  background: $color-surface;
  border: 1px solid $color-line;
  color: $color-fg;
  font-size: $font-size-small;
  font-weight: $font-weight-medium;
  transition:
    border-color $transition-fast,
    background $transition-fast;

  &::before {
    content: "";
    position: absolute;
    left: 12px;
    width: 4px;
    height: 18px;
    background: $color-accent-ink;
  }

  &:hover,
  &:focus-visible {
    border-color: $color-accent-ink;
    // opaque mix, so the white label never ends up over the light page
    background: color-mix(in srgb, $color-accent-bright 8%, $color-surface);
  }

  &:focus-visible {
    outline: 2px solid $color-accent-ink;
    outline-offset: -4px;
  }
}

// ---------- Skeleton ----------
.deck-card.skeleton {
  cursor: default;

  &:hover {
    border-color: fade($color-fg, 0.06);
  }
}

.sk-block {
  display: block;
  height: 12px;
  background: $color-line;
  animation: sk-pulse 1.4s ease-in-out infinite;
}

.sk-head-meta {
  width: 180px;
}

.sk-head-name {
  width: 40%;
  height: 28px;
  margin-top: $spacing-sm;
}

.sk-idx {
  width: 32px;
  height: 20px;
  margin-bottom: $spacing-sm;
}

.sk-name {
  width: 55%;
  height: 22px;
  margin-bottom: $spacing-sm;
}

.sk-desc {
  width: 90%;
  margin-bottom: 8px;
}

.sk-short {
  width: 60%;
}

.sk-meta {
  display: flex;
  gap: $spacing-md;
  margin-top: auto;
  padding-top: $spacing-md;
}

.sk-chip {
  width: 56px;
}

.sk-stars {
  width: 40px;
}

@keyframes sk-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

// ---------- Error state ----------
.error-state {
  padding: $spacing-lg;
  text-align: center;
  background: $color-surface;
  border: 1px solid fade($color-danger, 0.3);
}

.error-label {
  font-family: $font-display;
  font-size: $font-size-h4;
  color: $color-danger;
  text-shadow: 0 0 12px fade($color-danger, 0.6);

  // Glows are dark-only; a red halo on white just blurs the label.
  @include light {
    text-shadow: none;
  }
}

.error-msg {
  margin: $spacing-sm 0 $spacing-md;
  font-size: $font-size-body;
  color: $color-fg-muted;
}

.retry-btn {
  background: $color-accent-bright;
  color: $color-on-accent;
  border: none;
  padding: 12px 36px;
  font-size: $font-size-small;
  font-weight: $font-weight-medium;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
  transition:
    transform $transition-fast,
    filter $transition-fast;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }

  &:active {
    transform: scale(0.98);
  }
}

// ---------- Responsive ----------
@include desktop {
  // Rail up to 80px wide. Like the reference's yellow rail it runs well past
  // the content, overhanging it by up to 72px top and bottom.
  //
  // The content column starts at the same edge as the other sections; the
  // rail and its gap sit outside it, in the page gutter. The shell moves left
  // by `--gh-shift` and grows by as much, so its right edge stays put. Where
  // the gutter is too narrow for the rail (below 1200px plus twice its reach)
  // the shift shrinks to the gutter, and the content steps right instead.
  .gh-shell {
    --gh-rail-width: clamp(40px, calc(5.72vw + 3.33px), 80px);
    --gh-column-gap: clamp(16px, calc(5.72vw - 20.67px), 48px);
    --gh-overhang: clamp(18px, calc(3.75vw + 2px), 72px);
    --gh-gutter: max(0px, (100% - #{$content-max-width}) / 2);
    --gh-shift: min(var(--gh-rail-width) + var(--gh-column-gap), var(--gh-gutter));

    grid-template-columns: var(--gh-rail-width) minmax(0, 1fr);
    gap: var(--gh-column-gap);
    max-width: calc(#{$content-max-width} + var(--gh-shift));
    margin-left: calc(var(--gh-gutter) - var(--gh-shift));
    margin-right: auto;
    padding-block: clamp(64px, calc(10.02vw - 0.24px), 120px);
    padding-inline: clamp(16px, calc(1.43vw + 6.84px), 24px);
  }

  .gh-rail {
    margin-block: calc(0px - var(--gh-overhang));
    padding-block: clamp(12px, calc(2.15vw - 1.78px), 32px);
  }

  .gh-rail-logo {
    width: clamp(28px, calc(2.86vw + 9.66px), 48px);
  }

  .gh-rail-text {
    font-size: clamp(16px, calc(1.43vw + 6.83px), 26px);
  }

  .gh-rail-labels {
    gap: 0;
  }

  // two lines of decorative micro text: the slot is as wide as both
  .gh-rail-detail {
    width: 2.2em;
    font-size: clamp(6px, calc(0.36vw + 4.71px), 10px);
  }

  .gh-rail-detail-desktop {
    font-size: 1em;
  }

  .github-title {
    margin-bottom: clamp(24px, calc(4.29vw - 3.52px), 48px);
  }

  .github-title-en-row {
    font-size: clamp(15px, calc(0.89vw + 9.29px), 20px);
  }

  .github-title-cn {
    font-size: clamp(28px, calc(1.43vw + 18.83px), 36px);
  }

  .feature-meta {
    gap: clamp(8px, calc(1.43vw - 1.17px), 16px);
  }

  .feature-name {
    font-size: clamp(20px, calc(0.72vw + 15.41px), 24px);
  }

  // The featured card takes half the content width. The deck is clipped at
  // its left edge only: the peeks run on to the viewport's right edge (the
  // section clips them there), as in the reference.
  .deck {
    height: auto;
    min-height: 202.5px;
    margin-top: clamp(12px, calc(2.15vw - 1.78px), 24px);
    overflow: visible;
    clip-path: inset(-8px -100vw -8px -8px);

    &::before {
      content: "";
      display: block;
      width: 50%;
      min-width: 360px;
      aspect-ratio: 16 / 9;
    }
  }

  .deck-card {
    min-width: 360px;
  }

  .card-body {
    padding: clamp(16px, calc(1.43vw + 6.84px), 24px);
  }

  .card-index {
    right: clamp(8px, calc(1.43vw - 1.17px), 16px);
    bottom: clamp(-24px, calc(-0.72vw - 5.41px), -10px);
    font-size: clamp(96px, calc(11.45vw + 22.61px), 160px);
  }

  .card-name {
    font-size: clamp(18px, calc(1.79vw + 6.54px), 28px);
  }

  .card-desc {
    margin-top: clamp(8px, calc(1.43vw - 1.17px), 16px);
  }

  .card-meta {
    gap: clamp(12px, calc(2.15vw - 1.78px), 24px);
    margin-top: clamp(12px, calc(2.15vw - 1.78px), 24px);
  }

  .deck-controls {
    margin-top: clamp(12px, calc(2.15vw - 1.78px), 24px);
  }

  .page-btn {
    width: clamp(38px, calc(1.43vw + 28.84px), 46px);
    height: clamp(38px, calc(1.43vw + 28.84px), 46px);
  }

  .deck-counter {
    gap: clamp(6px, calc(0.36vw + 3.71px), 8px);
  }

  .more-btn {
    height: clamp(38px, calc(1.43vw + 28.84px), 46px);
    padding-inline: clamp(32px, calc(2.15vw + 2.22px), 40px);

    &::before {
      height: clamp(14px, calc(0.72vw + 9.41px), 18px);
    }
  }
}

// ---------- Wide screens: drafting marks in the left gutter ----------
// Once the gutter left of the rail is wide enough (about 96px from 1600px),
// it carries a drawing-sheet treatment in hairlines: the rail's top and bottom
// edges extend out to the viewport edge like dimension lines, and the head
// rule continues behind the rail across the gutter, so it spans the whole
// viewport. `.github-section` clips everything at the viewport edge.
//
// Beside the rail runs a scale linked to the carousel: a baseline with minor
// ticks every 16px, split by longer ticks into one segment per repo (`--n`).
// An ink mark fills the featured repo's segment (`--at`, from `current`) and
// slides with the deck's easing when it switches, carrying the repo's index;
// a fainter ghost slides to the segment of the card under the pointer or
// focus (`--to`, from `hovered`).
.gh-scale {
  display: none;
}

@media (min-width: 1600px) {
  // Positioned and raised: `v-reveal` leaves a transform on the head, which
  // would otherwise paint its rule over the rail.
  .gh-rail {
    position: relative;
    z-index: 1;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 100%;
      bottom: 0;
      width: 100vw;
      pointer-events: none;
      background:
        linear-gradient($color-line, $color-line) top / 100% 1px no-repeat,
        linear-gradient($color-line, $color-line) bottom / 100% 1px no-repeat;
    }
  }

  // 40px box ending 16px left of the rail: baseline 8px in from its right,
  // ticks reaching left from the baseline, marks between baseline and rail.
  .gh-scale {
    --segment: calc(100% / var(--n));
    --tick: #{fade($color-fg-subtle, 0.5)};

    position: absolute;
    top: 0;
    right: calc(100% + 16px);
    bottom: 0;
    display: block;
    width: 40px;
    pointer-events: none;
    background:
      linear-gradient($color-line, $color-line) right 8px top / 1px 100% no-repeat,
      repeating-linear-gradient($color-line 0 1px, transparent 1px 16px) right 9px top / 4px 100%
        no-repeat,
      linear-gradient(var(--tick) 0 1px, transparent 1px) right 9px top / 10px var(--segment)
        repeat-y,
      linear-gradient(var(--tick), var(--tick)) right 9px bottom / 10px 1px no-repeat;
  }

  .gh-scale-mark {
    position: absolute;
    top: calc(var(--at) * var(--segment));
    right: 4px;
    width: 2px;
    height: var(--segment);
    background: $color-accent-ink;
    transition: top 0.55s cubic-bezier(0.22, 1, 0.36, 1);

    &--ghost {
      top: calc(var(--to) * var(--segment));
      background: fade($color-accent-ink, 0.4);
      opacity: 0;
      transition:
        top 0.55s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.3s ease;

      &.is-on {
        opacity: 1;
      }
    }
  }

  // left of the ticks, level with the top of the featured segment
  .gh-scale-index {
    position: absolute;
    top: 4px;
    right: calc(100% + 20px);
    font-family: $font-display;
    font-size: $font-size-label;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    color: $color-accent-ink;
  }

  .feature-rule {
    margin-left: -100vw;
  }
}

@media (min-width: 1600px) and (prefers-reduced-motion: reduce) {
  .gh-scale-mark {
    transition: none;
  }
}

@include mobile {
  .gh-shell {
    width: 100%;
    max-width: 480px;
    margin-inline: 0 auto;
    grid-template-columns: 40px minmax(0, 1fr);
    gap: $spacing-sm;
  }

  // overhangs the content by 24px top and bottom, like the desktop rail
  .gh-rail {
    position: relative;
    left: -$spacing-sm;
    margin-block: -$spacing-md;
    padding: $spacing-sm 0;
  }

  .gh-rail-logo {
    width: 28px;
  }

  .gh-rail-text {
    font-size: $font-size-body-lg;
  }

  .gh-rail-labels {
    gap: 0;
  }

  .github-title-en-row {
    font-size: $font-size-body;
  }

  .github-title-cn {
    font-size: $font-size-h4;
  }

  .github-title {
    margin-bottom: $spacing-md;
  }

  .gh-rail-detail {
    width: 10px;
    height: 76px;
  }

  .gh-rail-detail-desktop {
    display: none;
  }

  .gh-rail-detail-mobile {
    display: block;
    font-size: 5px;
    font-weight: $font-weight-regular;
  }

  // Stacked list: current + next, each card carrying its own date
  .feature-head {
    display: none;
  }

  .desktop-deck {
    display: none;
  }

  .mobile-card-list {
    display: block;
    outline: none;

    &:focus-visible {
      outline: 2px solid $color-accent-ink;
      outline-offset: 4px;
    }
  }

  .mobile-card-track {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  // Stack switch, same easing as the desktop deck. Forward: the old current
  // card rises and fades from the top, the next card moves up into its place,
  // and the new next card rises in at the bottom. Back mirrors it. Leaving
  // cards are taken out of flow, pinned to the edge they leave from, so the
  // staying card's move starts at once.
  .stack-next-move,
  .stack-prev-move,
  .stack-next-enter-active,
  .stack-prev-enter-active,
  .stack-next-leave-active,
  .stack-prev-leave-active {
    transition:
      transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.4s ease;
  }

  .stack-next-leave-active,
  .stack-prev-leave-active {
    position: absolute;
    left: 0;
    width: 100%;
  }

  .stack-next-leave-active {
    top: 0;
  }

  .stack-prev-leave-active {
    bottom: 0;
  }

  .stack-next-enter-from,
  .stack-prev-leave-to {
    opacity: 0;
    transform: translateY($spacing-md);
  }

  .stack-next-leave-to,
  .stack-prev-enter-from {
    opacity: 0;
    transform: translateY(-$spacing-md);
  }

  .mobile-repo-card {
    display: block;
    width: 100%;
    min-width: 0;
    background: $color-surface;
    border: 1px solid fade($color-fg, 0.06);
    color: $color-fg;
    overflow: hidden;
    transition: border-color $transition-med;

    @include corner-brackets;

    &:hover,
    &:focus-visible {
      border-color: fade($color-accent-ink, 0.35);
    }

    &:focus-visible {
      outline: 2px solid $color-accent-ink;
      outline-offset: -2px;
    }
  }

  // Keep loading skeletons stacked while the mobile list is unavailable.
  .deck:not(.desktop-deck) {
    height: auto;
    overflow: visible;
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    &::before {
      content: none;
    }
  }

  .deck-card.skeleton {
    position: static;
    width: 100%;
    height: auto;
    min-width: 0;

    &[data-slot="2"] {
      display: none;
    }
  }

  // Every card is the same height whatever its text, so the section (and the
  // rail beside it) keeps one height while the carousel turns: one line of
  // name, two lines' room for the description even when it is shorter.
  .card-name {
    font-size: clamp(16px, 5vw, 22px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // content height instead of 16:9, so two cards and the controls fit one
  // screen
  .card-body {
    aspect-ratio: auto;
    padding: $spacing-sm;
  }

  .card-desc {
    flex: none;
    height: 3.2em; // 2 lines at the 1.6 line height
    margin-top: $spacing-xs;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
  }

  .card-meta {
    gap: $spacing-sm;
    margin-top: 12px;
  }

  .card-index {
    font-size: 72px;
    bottom: -10px;
  }

  .deck-controls {
    flex-wrap: nowrap;
    gap: $spacing-sm;
  }

  .page-btn {
    width: clamp(36px, 8vw, 44px);
    height: clamp(36px, 8vw, 44px);
  }

  .deck-counter {
    flex-shrink: 0;
    gap: clamp(4px, 1.2vw, 8px);
    font-size: $font-size-small;
    white-space: nowrap;
  }

  // fills the rest of the row, label centred, bar kept at the left edge
  .more-btn {
    flex: 1;
    min-width: 0;
    height: clamp(36px, 8vw, 44px);
    padding-inline: clamp(12px, 2.5vw, 18px);
    font-size: $font-size-small;
    white-space: nowrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deck-card {
    transition: none;
  }

  .head-swap-enter-active,
  .head-swap-leave-active,
  .stack-next-move,
  .stack-prev-move,
  .stack-next-enter-active,
  .stack-prev-enter-active,
  .stack-next-leave-active,
  .stack-prev-leave-active {
    transition: none;
  }

  .sk-block {
    animation: none;
  }
}
</style>
