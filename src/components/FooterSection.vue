<template>
  <footer class="footer-section">
    <div class="footer-inner">
      <router-link to="/" class="footer-logo">
        <img :src="logoUrl" alt="LAS logo" />
        <span>LAZY ALIEN SERVER</span>
      </router-link>

      <div class="footer-credits">
        <p>官网设计 / tanh_Heng</p>
        <p>技术支持 / LAS Dev Team</p>
      </div>

      <div class="footer-contact">
        <p>联系我们 / 835047145</p>
        <p class="contact-note">(服外交流群)</p>
      </div>
    </div>
    <div class="footer-bar">
      <span>© {{ year }} LAZY ALIEN SERVER</span>
      <span>EST. 2022.08.29 — V2.0</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/logo.svg'

const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
.footer-section {
  background: $color-primary-black;
  border-top: 1px solid $color-gray-dark;
  position: relative;

  // blue top accent
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    width: 160px;
    height: 4px;
    background: $color-primary-blue;
  }
}

.footer-inner {
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 60px $spacing-md;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-lg;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 14px;

  img {
    height: 40px;
    width: auto;
  }

  span {
    font-family: $font-display;
    font-weight: 700;
    font-size: 16px;
    color: $color-white;
    letter-spacing: 1px;
  }
}

.footer-credits,
.footer-contact {
  p {
    font-size: 14px;
    color: $color-gray-light;
    line-height: 2;
    letter-spacing: 1px;
  }

  .contact-note {
    color: $color-gray-mid;
  }
}

.footer-contact {
  text-align: right;
}

.footer-bar {
  border-top: 1px solid $color-gray-dark;
  padding: $spacing-sm $spacing-md;
  display: flex;
  justify-content: space-between;
  gap: $spacing-sm;
  max-width: $content-max-width;
  margin: 0 auto;
  font-size: 11px;
  letter-spacing: 2px;
  color: $color-gray-mid;
  text-transform: uppercase;
}

@include tablet {
  .footer-inner {
    flex-direction: column;
    text-align: center;
    gap: $spacing-md;
  }

  .footer-contact {
    text-align: center;
  }

  .footer-bar {
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
  }
}
</style>
