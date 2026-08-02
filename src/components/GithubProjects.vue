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
        <div v-for="n in 6" :key="n" class="repo-card skeleton">
          <div class="sk-line sk-title"></div>
          <div class="sk-line"></div>
          <div class="sk-line sk-short"></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state" v-reveal>
        <p>Failed to load projects</p>
        <button class="retry-btn" @click="loadRepos">重试</button>
      </div>

      <!-- Repo cards -->
      <div v-else class="repo-grid">
        <a
          v-for="repo in repos"
          :key="repo.name"
          class="repo-card"
          :href="repo.html_url"
          target="_blank"
          rel="noopener noreferrer"
          v-reveal
        >
          <h3 class="repo-name">{{ repo.name }}</h3>
          <p class="repo-desc">{{ repo.description || "No description provided." }}</p>
          <div class="repo-meta">
            <span class="repo-stars">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path
                  d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"
                />
              </svg>
              {{ repo.stargazers_count }}
            </span>
            <span v-if="repo.language" class="repo-lang">
              <span class="lang-dot"></span>{{ repo.language }}
            </span>
          </div>
        </a>
      </div>
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
  background: $color-primary-black;
}

.repo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-md;
}

.repo-card {
  @include clipped-panel($color-white, $color-white);
  @include corner-brackets(12px, 2px, $color-primary-blue, 14px);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: $spacing-md;
  color: $color-primary-black;
  transition:
    transform $transition-med,
    box-shadow $transition-med;

  // blue accent bar on top
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: $color-primary-blue;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 102, 204, 0.25);
  }
}

.repo-name {
  font-size: 20px;
  color: $color-primary-black;
  margin: $spacing-sm 0;
  text-transform: none;
  letter-spacing: 0;
}

.repo-desc {
  flex: 1;
  font-size: 14px;
  color: $color-gray-mid;
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
  font-size: 14px;
}

.repo-stars {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: $color-primary-blue;
  font-weight: 600;
}

.repo-lang {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: $color-gray-mid;
}

.lang-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: $color-primary-blue;
}

// Skeleton loaders
.repo-card.skeleton {
  min-height: 168px;

  &::before {
    background: $color-gray-dark;
  }
}

.sk-line {
  height: 14px;
  background: $color-gray-light;
  margin-bottom: $spacing-sm;
  animation: sk-pulse 1.4s ease-in-out infinite;
}

.sk-title {
  height: 22px;
  width: 60%;
}

.sk-short {
  width: 40%;
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

// Error state
.error-state {
  @include clipped-panel;
  padding: $spacing-lg;
  text-align: center;
  color: $color-gray-light;

  p {
    font-size: $font-size-body-lg;
    margin-bottom: $spacing-md;
  }
}

.retry-btn {
  background: $color-primary-blue;
  color: $color-white;
  border: none;
  padding: 12px 36px;
  font-size: $font-size-body;
  font-weight: 600;
  letter-spacing: 2px;
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
