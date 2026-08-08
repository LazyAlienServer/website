<template>
  <section class="github-section">
    <div class="section-shell">
      <div class="section-header" v-reveal>
        <div class="index-row">
          <span class="index-num">05</span>
          <span class="index-label">// OPEN SOURCE</span>
        </div>
        <h2 class="section-title">开源项目</h2>
        <p class="section-subtitle">GITHUB.COM/LAZYALIENSERVER</p>
        <div class="title-rule"></div>
      </div>

      <!-- Loading skeletons -->
      <div v-if="loading" class="repo-grid">
        <div v-for="n in 6" :key="n" class="repo-card skeleton" aria-hidden="true">
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

      <!-- Error state -->
      <div v-else-if="error" class="error-state" v-reveal>
        <p class="error-label">REPOSITORY INDEX OFFLINE</p>
        <p class="error-msg">{{ error }}</p>
        <button class="retry-btn" @click="loadRepos">RETRY UPLINK</button>
      </div>

      <!-- Repo cards -->
      <template v-else>
        <div class="repo-grid">
          <a
            v-for="(repo, i) in repos"
            :key="repo.name"
            class="repo-card"
            :href="repo.html_url"
            target="_blank"
            rel="noopener noreferrer"
            v-reveal
          >
            <div class="repo-top">
              <span class="repo-idx">{{ pad(i + 1) }}</span>
              <h3 class="repo-name">{{ repo.name }}</h3>
            </div>
            <p class="repo-desc">{{ repo.description || "No description provided." }}</p>
            <div class="repo-meta">
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
              <span class="repo-link" aria-hidden="true">
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
          </a>
        </div>

        <div class="repo-footer">
          <span>SYSTEM STATUS: {{ pad(repos.length) }} ENTRIES</span>
          <span>SORT: STARS DESC</span>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
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
    (repo.language === null || typeof repo.language === "string")
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

const pad = (value: number): string => String(value).padStart(2, "0");

const loadRepos = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch("https://api.github.com/orgs/LazyAlienServer/repos?per_page=100");
    if (!response.ok) throw new Error("Failed to fetch repos");
    const data: unknown = await response.json();
    if (!isRepoArray(data)) throw new Error("Invalid repository response");
    // list API can't sort by stars — sort client-side, take top 6
    repos.value = data.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), repos: repos.value }));
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    loading.value = false;
  }
};

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
</script>

<style scoped lang="scss">
.github-section {
  background-color: $color-primary-black;
}

.repo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.repo-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: $spacing-md;
  overflow: hidden;
  background: $color-black-soft;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: $color-white;
  transition:
    transform $transition-med,
    border-color $transition-med;

  &:hover,
  &:focus-visible {
    transform: translateY(-4px);
    border-color: rgba(30, 144, 255, 0.35);

    .repo-link svg {
      transform: rotate(-45deg) translateX(4px);
      color: $color-blue-bright;
    }
  }

  &:focus-visible {
    outline: 2px solid $color-blue-bright;
    outline-offset: -2px;
  }
}

.repo-top {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.repo-idx {
  flex-shrink: 0;
  font-family: $font-display;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
  color: $color-blue-bright;
}

.repo-name {
  font-size: 18px;
  color: $color-white;
  text-transform: none;
  letter-spacing: 0.5px;
  overflow-wrap: break-word;
}

.repo-desc {
  flex: 1;
  font-size: 14px;
  color: $color-gray-light;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repo-meta {
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

// registry footer caption under the grid
.repo-footer {
  display: flex;
  justify-content: space-between;
  gap: $spacing-sm;
  flex-wrap: wrap;
  margin-top: $spacing-md;
  font-family: $font-display;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: $color-gray-mid;
}

// Skeleton loaders — dark blocks pulsing inside card silhouettes
.repo-card.skeleton {
  min-height: 176px;
  cursor: default;

  &:hover {
    transform: none;
    border-color: rgba(255, 255, 255, 0.06);
  }
}

.sk-block {
  display: block;
  height: 12px;
  background: $color-gray-dark;
  animation: sk-pulse 1.4s ease-in-out infinite;
}

.sk-idx {
  width: 24px;
  margin-bottom: $spacing-sm;
}

.sk-name {
  width: 55%;
  height: 18px;
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

// Error state — dark panel, red accents
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

@include tablet {
  .repo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include mobile {
  .repo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
