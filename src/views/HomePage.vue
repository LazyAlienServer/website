<template>
  <div class="home-page">
    <HeroSection />
    <main>
      <IntroSection id="about" />
      <LiveTimer />
      <HardwareSection />
      <GithubProjects />
      <AdminTeam />
      <JoinSection />
    </main>
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from "@/components/HeroSection.vue";
import IntroSection from "@/components/IntroSection.vue";
import LiveTimer from "@/components/LiveTimer.vue";
import HardwareSection from "@/components/HardwareSection.vue";
import GithubProjects from "@/components/GithubProjects.vue";
import AdminTeam from "@/components/AdminTeam.vue";
import JoinSection from "@/components/JoinSection.vue";
import FooterSection from "@/components/FooterSection.vue";
</script>

<style scoped lang="scss">
// Fixed side rails — control-panel frame on wide screens
.home-page {
  @include tablet {
    display: flex;
    flex-direction: column;
  }

  &::before,
  &::after {
    content: "";
    position: fixed;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.06);
    z-index: 1;
    pointer-events: none;
    display: none;
  }

  &::before {
    left: 20px;
  }

  &::after {
    right: 20px;
  }
}

@media (min-width: 1400px) {
  .home-page::before,
  .home-page::after {
    display: block;
  }
}
</style>
