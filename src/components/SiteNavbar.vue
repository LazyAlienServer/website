<template>
  <nav
    id="site-nav"
    ref="navbar"
    class="nav"
    :class="{ 'nav--expanded': expanded, 'nav--home': route.name === 'home' }"
    aria-label="主导航"
  >
    <span class="nav-surface" aria-hidden="true"></span>
    <span class="nav-underline" aria-hidden="true"></span>
    <span class="nav-trail" aria-hidden="true"></span>
    <SiteNav />
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import SiteNav from "./SiteNav.vue";

const route = useRoute();
const navbar = ref<HTMLElement | null>(null);
const scrolled = ref(false);
const expanded = computed(() => route.name !== "home" || scrolled.value);
let frame = 0;
let observer: ResizeObserver | undefined;

const update = () => {
  scrolled.value = window.scrollY > 48;
  const visual = document.querySelector<HTMLElement>(".hero-visual");
  if (route.name !== "home" || !visual || !navbar.value || window.innerWidth <= 1024) return;
  const bounds = visual.getBoundingClientRect();
  const slope = bounds.height > 0 ? (bounds.width * 0.08) / bounds.height : 0;
  const top = bounds.left + bounds.width * 0.08 + bounds.top * slope;
  navbar.value.style.setProperty("--seam-top", `${top}px`);
  navbar.value.style.setProperty(
    "--seam-bottom",
    `${top - navbar.value.getBoundingClientRect().height * slope}px`,
  );
};
const schedule = () => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(update);
};
watch(() => route.name, schedule, { flush: "post" });
onMounted(() => {
  update();
  observer = new ResizeObserver(() => {
    if (navbar.value)
      document.documentElement.style.setProperty(
        "--site-nav-height",
        `${navbar.value.getBoundingClientRect().height}px`,
      );
    schedule();
  });
  if (navbar.value) observer.observe(navbar.value);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
});
onUnmounted(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
});
</script>

<style scoped lang="scss">
@property --nav-blue-progress {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}

@property --nav-body-progress {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}

.nav {
  --nav-inline: #{$spacing-lg};
  --seam-top: 44.8vw;
  --seam-bottom: 44.8vw;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  // Captured apart from the page in route view transitions (global.scss).
  view-transition-name: site-nav;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  width: 40%;
  padding: $spacing-md var(--nav-inline);
  background: $color-primary-black;
  transition: width 0.7s cubic-bezier(0.16, 1, 0.3, 1);

  // Gray underline follows the content insets: logo left to links right.
  &::before {
    content: "";
    position: absolute;
    right: var(--nav-inline);
    bottom: 0;
    left: var(--nav-inline);
    height: 1px;
    background: $color-gray-dark;
    pointer-events: none;
  }

  &.nav--expanded {
    width: 100vw;
  }
}

.nav-surface {
  display: none;
}

.nav-underline {
  position: absolute;
}

// Invisible stand-in captured as its own `nav-trail` view-transition group;
// global.scss paints that group blue when the router's page transition moves
// the navbar (`data-nav-move`). The router finds the navbar by `#site-nav`.
.nav-trail {
  position: absolute;
  inset: 0;
  view-transition-name: nav-trail;
  pointer-events: none;
}

// Both surfaces use the Hero's exact seam coordinates. Blue expands first;
// black follows via the nav's width transition. On collapse the order reverses.
@media (min-width: 1025px) {
  .nav {
    isolation: isolate;
    background: transparent;
    transition:
      width 420ms cubic-bezier(0.16, 1, 0.3, 1),
      --nav-body-progress 420ms cubic-bezier(0.16, 1, 0.3, 1),
      --nav-blue-progress 270ms cubic-bezier(0.16, 1, 0.3, 1) 420ms;

    &::before {
      top: 0;
      bottom: 0;
      left: 0;
      right: auto;
      width: 100vw;
      height: auto;
      z-index: -2;
      background: $color-blue-bright;
      clip-path: polygon(
        0 0,
        calc(var(--seam-top) + 6px + (100vw - var(--seam-top) - 6px) * var(--nav-blue-progress)) 0,
        calc(
            var(--seam-bottom) + 6px + (100vw - var(--seam-bottom) - 6px) * var(--nav-blue-progress)
          )
          100%,
        0 100%
      );
    }

    &.nav--expanded {
      --nav-blue-progress: 1;
      --nav-body-progress: 1;
      transition:
        width 420ms cubic-bezier(0.16, 1, 0.3, 1) 240ms,
        --nav-body-progress 420ms cubic-bezier(0.16, 1, 0.3, 1) 240ms,
        --nav-blue-progress 240ms cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  .nav-surface {
    position: absolute;
    inset: 0 auto 0 0;
    z-index: -1;
    display: block;
    width: 100vw;
    background: $color-primary-black;
    clip-path: polygon(
      0 0,
      calc(var(--seam-top) + (100vw - var(--seam-top)) * var(--nav-body-progress)) 0,
      calc(var(--seam-bottom) + (100vw - var(--seam-bottom)) * var(--nav-body-progress)) 100%,
      0 100%
    );
    pointer-events: none;
  }

  .nav-underline {
    right: var(--nav-inline);
    bottom: 0;
    left: var(--nav-inline);
    height: 1px;
    background: $color-gray-dark;
    pointer-events: none;
  }
}

@media (min-width: 1025px) and (prefers-reduced-motion: reduce) {
  .nav,
  .nav.nav--expanded {
    transition: none;

    &::before,
    .nav-surface {
      transition: none;
    }
  }
}

@include tablet {
  .nav,
  .nav.nav--expanded {
    --nav-inline: #{$spacing-md};
    width: 100%;
    transition: none;
  }
}
@include mobile {
  .nav,
  .nav.nav--expanded {
    --nav-inline: #{$spacing-sm};
  }

  // Home: dock in flow right under the stacked hero image, then stick to the
  // viewport top once scrolled there. `HeroSection.vue` pulls its image up
  // into this top margin; other routes keep the fixed bar.
  .nav.nav--home {
    position: sticky;
    margin-top: $hero-visual-height-mobile;
  }
}
</style>
