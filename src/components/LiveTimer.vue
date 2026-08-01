<template>
  <section class="timer-section">
    <div class="section-shell">
      <div class="timer-panel" v-reveal>
        <div class="section-header">
          <div class="index-row">
            <span class="index-num">03</span>
            <span class="index-label">// UPTIME</span>
          </div>
          <h2 class="section-title">已稳定运行</h2>
          <p class="section-subtitle">SINCE 2022.08.29</p>
        </div>

        <div class="timer-grid">
          <div class="timer-cell">
            <span class="timer-value">{{ days }}</span>
            <span class="timer-label">天</span>
          </div>
          <div class="timer-cell">
            <span class="timer-value">{{ pad(hours) }}</span>
            <span class="timer-label">小时</span>
          </div>
          <div class="timer-cell">
            <span class="timer-value">{{ pad(minutes) }}</span>
            <span class="timer-label">分钟</span>
          </div>
          <div class="timer-cell">
            <span class="timer-value">{{ pad(seconds) }}</span>
            <span class="timer-label">秒</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const establishedDate = new Date('2022-08-29T00:00:00+08:00')

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let intervalId: number

const updateTimer = () => {
  const diff = Date.now() - establishedDate.getTime()

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24)
  minutes.value = Math.floor((diff / (1000 * 60)) % 60)
  seconds.value = Math.floor((diff / 1000) % 60)
}

const pad = (n: number) => String(n).padStart(2, '0')

onMounted(() => {
  updateTimer()
  intervalId = window.setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped lang="scss">
.timer-section {
  background: $color-primary-black;
}

.timer-panel {
  @include clipped-panel;
  position: relative;
  padding: $spacing-lg;
  overflow: hidden;

  // blueprint grid decoration
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
  }

  // blue top accent bar
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $color-primary-blue 0%, $color-white 100%);
  }
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;
  position: relative;
  z-index: 1;
}

.timer-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md 0;
  border-left: 1px solid $color-gray-dark;

  &:first-child {
    border-left: none;
  }
}

.timer-value {
  font-family: $font-display;
  font-size: clamp(44px, 6vw, 72px);
  font-weight: 700;
  line-height: 1;
  color: $color-blue-bright;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 24px rgba(30, 144, 255, 0.35);
}

.timer-label {
  font-size: $font-size-body;
  color: $color-gray-mid;
  letter-spacing: 4px;
}

@include mobile {
  .timer-panel {
    padding: $spacing-md;
  }

  .timer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md 0;
  }

  .timer-cell:nth-child(3) {
    border-left: none;
  }

  .timer-cell:nth-child(1),
  .timer-cell:nth-child(2) {
    border-bottom: 1px solid $color-gray-dark;
    padding-bottom: $spacing-md;
  }
}
</style>
