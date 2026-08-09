<template>
  <section class="github-section">
    <div class="section-shell gh-shell">
      <!-- Left brand rail: LAS mark + vertical GITHUB label -->
      <div class="gh-rail" aria-hidden="true">
        <img class="gh-rail-logo" :src="logoUrl" alt="" />
        <div class="gh-rail-labels">
          <span class="gh-rail-text">GITHUB</span>
          <span class="gh-rail-detail">
            <span class="gh-rail-detail-desktop">GITHUB.COM/<br />LAZYALIENSERVER</span>
            <span class="gh-rail-detail-mobile">LAZYALIENSERVER</span>
          </span>
        </div>
      </div>
      <div class="gh-content">
        <div class="github-title" v-reveal>
          <p class="github-title-kicker">LAZY ALIEN SERVER</p>
          <div class="github-title-en-row">
            <span class="github-title-mark" aria-hidden="true"></span>
            <span class="github-title-en">OPEN SOURCE</span>
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
          <p class="error-label">REPOSITORY INDEX OFFLINE</p>
          <p class="error-msg">{{ error ?? "No public repositories found." }}</p>
          <button class="retry-btn" @click="loadRepos">RETRY UPLINK</button>
        </div>

        <template v-else>
          <!-- Dynamic title row (desktop) — tracks the featured repo -->
          <div class="feature-head" v-reveal>
            <Transition name="head-swap" mode="out-in">
              <div :key="active.name" class="feature-head-inner">
                <p class="feature-meta">
                  <span class="feature-tag">// {{ active.language ?? "MISC" }}</span>
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
            >
              <div class="card-body">
                <span class="card-index" aria-hidden="true">{{ pad(i + 1) }}</span>
                <h4 class="card-name">{{ repo.name }}</h4>
                <p class="card-desc">{{ repo.description || "No description provided." }}</p>
                <div class="card-meta">
                  <span v-if="repo.language" class="lang-text">{{ repo.language }}</span>
                  <span v-else class="lang-none">—</span>
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
            <div
              v-for="(repo, i) in repos"
              :key="`mobile-${repo.name}`"
              class="mobile-card-item"
              :data-slot="slotOf(i)"
              :aria-hidden="slotOf(i) > 1 ? 'true' : undefined"
            >
              <div class="card-caption">
                <span class="caption-meta">
                  <span class="caption-tag">// {{ repo.language ?? "MISC" }}</span>
                  <time>{{ formatDate(repo.pushed_at) }}</time>
                </span>
                <span class="caption-name">{{ repo.name }}</span>
              </div>

              <a
                class="mobile-repo-card"
                :href="repo.html_url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-current="slotOf(i) === 0 ? 'true' : undefined"
                :tabindex="slotOf(i) > 1 ? -1 : undefined"
                @click="onRepoClick($event, i)"
              >
                <div class="card-body">
                  <span class="card-index" aria-hidden="true">{{ pad(i + 1) }}</span>
                  <h4 class="card-name">{{ repo.name }}</h4>
                  <p class="card-desc">{{ repo.description || "No description provided." }}</p>
                  <div class="card-meta">
                    <span v-if="repo.language" class="lang-text">{{ repo.language }}</span>
                    <span v-else class="lang-none">—</span>
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
          </div>

          <div class="deck-controls" v-reveal>
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
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const AUTOPLAY_MS = 6_000;
const AUTO_SWITCH_COOLDOWN_MS = 5_000;
let autoSwitchCooldownUntil = 0;
let autoplayId: number | undefined;

const active = computed(() => repos.value[current.value] ?? repos.value[0]);

// Circular slot: 0 featured, 1-2 peeks, 3 offstage-right, 4 offstage-left.
// Invisible slots absorb the wrap-around jump so visible cards always slide.
const slotOf = (i: number): number => (i - current.value + repos.value.length) % repos.value.length;

const go = (i: number, userInitiated = false) => {
  if (userInitiated) {
    autoSwitchCooldownUntil = Date.now() + AUTO_SWITCH_COOLDOWN_MS;
  }
  current.value = (i + repos.value.length) % repos.value.length;
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
.github-section {
  background-color: $color-primary-black;
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
  background: $color-primary-blue;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-md 0;
}

.gh-rail-logo {
  width: 44px;
  flex-shrink: 0;
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
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $color-white;
  line-height: 1;
}

.gh-rail-detail {
  height: fit-content;
  position: relative;
  width: 18px;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.76);
}

.gh-rail-detail-desktop,
.gh-rail-detail-mobile {
  position: absolute;
  top: 0;
  left: 100%;
  display: block;
  font-family: $font-display;
  line-height: 1.1;
  letter-spacing: 0.8px;
  white-space: nowrap;
  transform: rotate(90deg);
  transform-origin: top left;
}

.gh-rail-detail-desktop {
  font-size: 8px;
  font-weight: 400;
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
  font-size: 9px;
  letter-spacing: 2px;
  color: $color-gray-mid;
}

.github-title-en-row {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-top: 2px;
}

.github-title-mark {
  width: 48px;
  height: 18px;
  background: transparent;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 1) 0,
    rgba(255, 255, 255, 1) 2px,
    transparent 2px,
    transparent 7px
  );
  border: none;
}

.github-title-en {
  font-family: $font-display;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1px;
  color: $color-white;
}

.github-title-cn {
  margin-top: 2px;
  font-size: $font-size-h2;
  color: $color-white;
}

// ---------- Dynamic title row (desktop) ----------
.feature-head {
  min-height: 108px;
}

.feature-meta {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  font-family: $font-display;
  font-size: 14px;
  letter-spacing: 2px;
  color: $color-gray-mid;
  text-transform: uppercase;
}

.feature-tag {
  color: $color-blue-bright;
}

.feature-date {
  color: $color-gray-mid;
}

.feature-name {
  margin-top: $spacing-xs;
  font-size: $font-size-h3;
  color: $color-white;
  text-transform: none;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feature-rule {
  height: 1px;
  margin-top: $spacing-sm;
  background: linear-gradient(90deg, $color-gray-dark 0%, rgba(42, 42, 42, 0) 100%);
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
    outline: 2px solid $color-blue-bright;
    outline-offset: 4px;
  }
}

.deck-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: $color-black-soft;
  color: $color-white;
  font: inherit;
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  transition: border-color $transition-med;

  &:hover,
  &:focus-visible {
    border-color: rgba(30, 144, 255, 0.35);
  }

  &:focus-visible {
    outline: 2px solid $color-blue-bright;
    outline-offset: -2px;
  }
}

@include desktop {
  .deck-card {
    position: absolute;
    top: 0;
    width: 41%;
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

    &[data-slot="1"] {
      transform: translate3d(104%, 0, 0) scale(0.72);
      z-index: 2;
    }

    &[data-slot="2"] {
      transform: translate3d(182%, 0, 0) scale(0.72);
      z-index: 1;
    }

    // Offstage slots absorb wrap-around while remaining invisible.
    &[data-slot="3"] {
      transform: translate3d(259%, 0, 0) scale(0.72);
      opacity: 0;
      pointer-events: none;
    }

    &[data-slot="4"] {
      transform: translate3d(-110%, 0, 0) scale(0.72);
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
  font-weight: 700;
  line-height: 1;
  color: rgba(30, 144, 255, 0.1);
  pointer-events: none;
  user-select: none;
}

.card-name {
  font-size: 28px;
  color: $color-white;
  text-transform: none;
  letter-spacing: 0.5px;
  overflow-wrap: break-word;
}

.card-desc {
  flex: 1;
  margin-top: $spacing-sm;
  font-size: 15px;
  color: $color-gray-light;
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
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: $color-blue-bright;
}

.lang-none {
  color: $color-gray-mid;
}

.repo-stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: $font-display;
  font-size: 14px;
  font-weight: 700;
  color: $color-blue-bright;
}

.repo-link {
  margin-left: auto;
  display: inline-flex;
  color: $color-gray-mid;

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
    color: $color-blue-bright;
  }
}

// Independent mobile list — absent from desktop layout
.mobile-card-list {
  display: none;
}

.card-caption {
  display: none;
}

// ---------- Controls ----------
.deck-controls {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-md;
}

.page-btn {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid $color-gray-dark;
  background: transparent;
  color: $color-white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    border-color $transition-fast,
    background $transition-fast,
    transform $transition-fast;

  &:hover {
    border-color: $color-blue-bright;
    background: rgba(30, 144, 255, 0.12);
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid $color-blue-bright;
    outline-offset: 2px;
  }
}

.deck-counter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: $font-display;
  font-size: 14px;
  letter-spacing: 2px;
  color: $color-gray-light;

  .counter-divider {
    color: $color-gray-mid;
  }
}

.more-btn {
  margin-left: 16px;
  display: inline-flex;
  align-items: center;
  gap: 24px;
  height: 46px;
  padding: 0 28px;
  background: $color-black-soft;
  border: 1px solid $color-gray-dark;
  color: $color-white;
  font-size: 15px;
  font-weight: 600;
  transition:
    border-color $transition-fast,
    background $transition-fast;

  &::before {
    content: "";
    margin-left: -12px;
    width: 4px;
    height: 18px;
    background: $color-blue-bright;
  }

  &:hover,
  &:focus-visible {
    border-color: $color-blue-bright;
    background: rgba(30, 144, 255, 0.08);
  }

  &:focus-visible {
    outline: 2px solid $color-blue-bright;
    outline-offset: 2px;
  }
}

// ---------- Skeleton ----------
.deck-card.skeleton {
  cursor: default;

  &:hover {
    border-color: rgba(255, 255, 255, 0.06);
  }
}

.sk-block {
  display: block;
  height: 12px;
  background: $color-gray-dark;
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

.sk-caption-line {
  width: 70%;
  margin-top: $spacing-sm;
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
  background: $color-black-soft;
  border: 1px solid rgba(255, 68, 68, 0.3);
}

.error-label {
  font-family: $font-display;
  font-size: $font-size-h4;
  letter-spacing: 3px;
  color: #ff4444;
  text-shadow: 0 0 12px rgba(255, 68, 68, 0.6);
}

.error-msg {
  margin: $spacing-sm 0 $spacing-md;
  font-size: $font-size-body;
  color: $color-gray-light;
}

.retry-btn {
  background: $color-blue-bright;
  color: $color-white;
  border: none;
  padding: 12px 36px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
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
  .gh-shell {
    --gh-rail-width: clamp(40px, calc(5.72vw + 3.33px), 72px);
    --gh-column-gap: clamp(16px, calc(5.72vw - 20.67px), 48px);
    --gh-overhang: clamp(18px, calc(2.5vw + 1.97px), 32px);

    grid-template-columns: var(--gh-rail-width) minmax(0, 1fr);
    gap: var(--gh-column-gap);
    padding-block: clamp(64px, calc(10.02vw - 0.24px), 120px);
    padding-inline: clamp(16px, calc(1.43vw + 6.84px), 24px);
  }

  .gh-rail {
    margin-block: calc(0px - var(--gh-overhang));
    padding-block: clamp(12px, calc(2.15vw - 1.78px), 24px);
  }

  .gh-rail-logo {
    width: clamp(28px, calc(2.86vw + 9.66px), 44px);
  }

  .gh-rail-text {
    font-size: clamp(16px, calc(1.43vw + 6.83px), 24px);
  }

  .gh-rail-labels {
    gap: 0;
  }

  .gh-rail-detail-desktop {
    font-size: clamp(6px, calc(0.36vw + 4.71px), 8px);
  }

  .github-title {
    margin-bottom: clamp(24px, calc(4.29vw - 3.52px), 48px);
  }

  .github-title-kicker {
    font-size: clamp(8px, calc(0.18vw + 6.85px), 9px);
  }

  .github-title-mark {
    width: clamp(32px, calc(2.86vw + 13.66px), 48px);
    height: clamp(14px, calc(0.72vw + 9.41px), 18px);
  }

  .github-title-en {
    font-size: clamp(15px, calc(0.89vw + 9.29px), 20px);
  }

  .github-title-cn {
    font-size: clamp(32px, calc(2.86vw + 13.66px), 48px);
  }

  .feature-head {
    min-height: clamp(84px, calc(4.29vw + 56.48px), 108px);
  }

  .feature-meta {
    gap: clamp(8px, calc(1.43vw - 1.17px), 16px);
    font-size: clamp(11px, calc(0.54vw + 7.56px), 14px);
  }

  .feature-name {
    font-size: clamp(24px, calc(2.15vw + 10.22px), 36px);
  }

  .deck {
    height: auto;
    min-height: 202.5px;
    margin-top: clamp(12px, calc(2.15vw - 1.78px), 24px);

    &::before {
      content: "";
      display: block;
      width: 41%;
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
    font-size: clamp(12px, calc(0.54vw + 8.56px), 15px);
  }

  .card-meta {
    gap: clamp(12px, calc(2.15vw - 1.78px), 24px);
    margin-top: clamp(12px, calc(2.15vw - 1.78px), 24px);
  }

  .lang-text {
    font-size: clamp(9px, calc(0.36vw + 6.71px), 11px);
  }

  .repo-stars {
    font-size: clamp(12px, calc(0.36vw + 9.71px), 14px);
  }

  .deck-controls {
    gap: clamp(8px, calc(1.43vw - 1.17px), 16px);
    margin-top: clamp(12px, calc(2.15vw - 1.78px), 24px);
  }

  .page-btn {
    width: clamp(38px, calc(1.43vw + 28.84px), 46px);
    height: clamp(38px, calc(1.43vw + 28.84px), 46px);
  }

  .deck-counter {
    gap: clamp(6px, calc(0.36vw + 3.71px), 8px);
    font-size: clamp(12px, calc(0.36vw + 9.71px), 14px);
  }

  .more-btn {
    gap: clamp(18px, calc(0.72vw + 5.41px), 24px);
    height: clamp(38px, calc(1.43vw + 28.84px), 46px);
    padding-inline: clamp(32px, calc(2.15vw + 2.22px), 40px);
    font-size: clamp(13px, calc(0.36vw + 10.71px), 15px);

    &::before {
      height: clamp(14px, calc(0.72vw + 9.41px), 18px);
    }
  }
}

@include mobile {
  .gh-shell {
    width: 100%;
    max-width: 480px;
    margin-inline: 0 auto;
    grid-template-columns: 36px minmax(0, 1fr);
    gap: $spacing-sm;
  }

  .gh-rail {
    position: relative;
    left: -$spacing-sm;
    padding: $spacing-sm 0;
  }

  .gh-rail-logo {
    width: 24px;
  }

  .gh-rail-text {
    font-size: 15px;
    letter-spacing: 0;
  }

  .gh-rail-labels {
    gap: 0;
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
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  // Stacked bulletin list — current + next, each with its own caption
  .feature-head {
    display: none;
  }

  .desktop-deck {
    display: none;
  }

  .mobile-card-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    outline: none;

    &:focus-visible {
      outline: 2px solid $color-blue-bright;
      outline-offset: 4px;
    }
  }

  .mobile-card-item {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    &[data-slot="2"],
    &[data-slot="3"],
    &[data-slot="4"] {
      display: none;
    }
  }

  .mobile-repo-card {
    display: block;
    width: 100%;
    min-width: 0;
    background: $color-black-soft;
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: $color-white;
    overflow: hidden;
    transition: border-color $transition-med;

    @include corner-brackets;

    &:hover,
    &:focus-visible {
      border-color: rgba(30, 144, 255, 0.35);
    }

    &:focus-visible {
      outline: 2px solid $color-blue-bright;
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

  .card-name {
    font-size: clamp(16px, 5vw, 22px);
  }

  .card-body {
    min-height: 0;
  }

  .card-desc {
    margin-top: clamp(8px, 2.5vw, 12px);
    line-clamp: 2;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
  }

  .card-meta {
    gap: clamp(10px, 3vw, 16px);
    margin-top: clamp(10px, 3vw, 16px);
  }

  .card-index {
    font-size: 96px;
    bottom: -14px;
  }

  .card-caption {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 2px $spacing-xs;
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .caption-meta {
    display: flex;
    align-items: baseline;
    gap: $spacing-sm;
    font-family: $font-display;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: $color-gray-mid;
  }

  .caption-tag {
    color: $color-blue-bright;
  }

  .caption-name {
    font-family: $font-display;
    font-size: 18px;
    font-weight: 700;
    color: $color-white;
    overflow-wrap: break-word;
  }

  .deck-controls {
    flex-wrap: nowrap;
    gap: clamp(6px, 1.5vw, 10px);
  }

  .page-btn {
    width: clamp(36px, 8vw, 44px);
    height: clamp(36px, 8vw, 44px);
  }

  .deck-counter {
    flex-shrink: 0;
    gap: clamp(4px, 1.2vw, 8px);
    font-size: clamp(11px, 2.8vw, 14px);
    white-space: nowrap;
  }

  .more-btn {
    min-width: 0;
    height: clamp(36px, 8vw, 44px);
    padding-inline: clamp(12px, 2.5vw, 18px);
    gap: clamp(8px, 2vw, 12px);
    font-size: clamp(12px, 2.8vw, 14px);
    white-space: nowrap;

    &::before {
      margin-left: -4px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .deck-card {
    transition: none;
  }

  .head-swap-enter-active,
  .head-swap-leave-active {
    transition: none;
  }

  .sk-block {
    animation: none;
  }
}
</style>
