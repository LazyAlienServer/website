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
import HeroSection from '@/components/HeroSection.vue'
import IntroSection from '@/components/IntroSection.vue'
import LiveTimer from '@/components/LiveTimer.vue'
import HardwareSection from '@/components/HardwareSection.vue'
import GithubProjects from '@/components/GithubProjects.vue'
import AdminTeam from '@/components/AdminTeam.vue'
import JoinSection from '@/components/JoinSection.vue'
import FooterSection from '@/components/FooterSection.vue'
</script>
