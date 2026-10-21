<template>
  <div class="nav-content">
    <router-link to="/" class="nav-logo">
      <img :src="logoUrl" alt="LAS logo" />
      <span>LAZY ALIEN SERVER</span>
    </router-link>
    <div class="nav-links">
      <router-link to="/" :class="{ active: route.name === 'home' }">首页</router-link>
      <router-link to="/rules" :class="{ active: route.name === 'rules' }">规章</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import logoUrl from "@/assets/logo.svg";

const route = useRoute();
</script>

<style scoped lang="scss">
.nav-content {
  display: contents;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: none;

  img {
    height: 35.2px;
    width: auto;
  }

  span {
    font-family: $font-display;
    font-weight: 700;
    font-size: 18px;
    color: $color-white;
    letter-spacing: 1px;
  }
}

.nav-links {
  display: flex;
  gap: 28px;

  a {
    color: $color-gray-mid;
    font-size: 14px;
    letter-spacing: 2px;
    transition: color $transition-fast;

    &:hover {
      color: $color-blue-bright;
    }

    &.active {
      color: $color-white;
      border-bottom: 2px solid $color-blue-bright;
      padding-bottom: 4px;
    }
  }
}

@include mobile {
  .nav-logo span {
    display: none;
  }
}
</style>
