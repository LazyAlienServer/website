<template>
  <section id="join" class="join-section">
    <div class="section-shell">
      <div class="join-panel" v-reveal>
        <div class="section-header">
          <div class="index-row">
            <span class="index-num">07</span>
            <span class="index-label">// ENLIST</span>
          </div>
          <h2 class="section-title">如何加入LAS</h2>
          <div class="title-rule"></div>
        </div>

        <div class="paths-grid">
          <div class="path-card">
            <span class="path-index">PATH 01</span>
            <h3 class="path-title">审核制</h3>
            <p class="path-desc">
              通过素养审核（一审）与技术审核（二审），考察综合素质与红石、后勤或建筑能力。
            </p>
          </div>
          <div class="path-card">
            <span class="path-index">PATH 02</span>
            <h3 class="path-title">邀请担保制</h3>
            <p class="path-desc">
              由成员担保邀请，通过面试及技术审核；被邀请人违规时邀请人承担连带责任。
            </p>
          </div>
        </div>

        <router-link to="/rules" class="btn btn-primary join-cta">查看完整规章</router-link>

        <p class="contact">联系我们: 835047145 (服外交流群)</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.join-section {
  background: $color-primary-black;
}

.join-panel {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  border-left: 4px solid $color-primary-blue;
  padding-left: $spacing-lg;
  text-align: left;
}

.paths-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.path-card {
  @include clipped-panel;
  padding: $spacing-md;
  transition:
    transform $transition-med,
    border-color $transition-med;

  &:hover {
    transform: translateY(-4px);
    border-color: $color-primary-blue;
  }
}

.path-index {
  font-size: 11px;
  letter-spacing: 3px;
  color: $color-blue-bright;
  text-transform: uppercase;
}

.path-title {
  font-size: $font-size-h4;
  color: $color-white;
  margin: $spacing-xs 0 $spacing-sm;
}

.path-desc {
  font-size: $font-size-body;
  color: $color-gray-light;
  line-height: 1.7;
}

.btn {
  display: inline-block;
  padding: 16px 44px;
  font-size: 16px;
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

.btn-primary {
  background: $color-primary-blue;
  color: $color-white;
  clip-path: polygon(14px 0, 100% 0, 100% 100%, 0 100%);
}

.join-cta {
  display: block;
  width: fit-content;
  margin: 0 auto $spacing-lg;
  transform: translateX(calc(#{$spacing-lg} / -2));
}

.contact {
  font-size: 14px;
  color: $color-gray-mid;
  letter-spacing: 1px;
  text-align: center;
  transform: translateX(calc(#{$spacing-lg} / -2));
}

@include mobile {
  .join-panel {
    padding-left: $spacing-sm;
  }

  .paths-grid {
    grid-template-columns: 1fr;
  }

  .join-cta,
  .contact {
    transform: none;
  }
}
</style>
