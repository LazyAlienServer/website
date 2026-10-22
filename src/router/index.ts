import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import RulesPage from "@/views/RulesPage.vue";
import GalleryPage from "@/views/GalleryPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // `navIndex` is the link's position in `SiteNav.vue`; keep them in sync.
  // It sets the page transition direction.
  routes: [
    { path: "/", name: "home", component: HomePage, meta: { navIndex: 0 } },
    { path: "/rules", name: "rules", component: RulesPage, meta: { navIndex: 1 } },
    { path: "/gallery", name: "gallery", component: GalleryPage, meta: { navIndex: 2 } },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: -72 };
    // Instant: the global `scroll-behavior: smooth` would otherwise scroll the
    // new page while the view transition captures and animates it.
    return { top: 0, behavior: "instant" };
  },
});

// Page-to-page View Transition. The guard starts the transition and lets
// navigation continue only from inside its update callback, i.e. after the
// old page was captured. `afterEach` then waits for the new route's render
// and the router's scroll (a macrotask lets both microtask chains settle)
// before ending the callback, which captures the new page. Only between
// different routes: hash/query moves within one page and the initial load
// stay untouched, as does everything when the API is missing or reduced
// motion is requested. Animations live in `src/styles/global.scss`; they read
// `--page-dir` on `<html>`: 1 when moving right in the navbar order (the new
// page comes in from the right), -1 when moving left.
//
// Navbar travel: on mobile home the navbar is docked under the hero image,
// elsewhere it is fixed at the top. When its viewport top differs between
// the two pages, `data-nav-move` (`up`/`down`) plus `--nav-from` and
// `--nav-to` drive a blue-trail move; otherwise the navbar stays still.
const PAGE_VARS = ["--page-dir", "--nav-from", "--nav-to"];
let finishPageUpdate: (() => void) | undefined;
let activeTransition: ViewTransition | undefined;
let navFromTop = 0;

router.beforeResolve((to, from) => {
  if (
    !from.name ||
    to.name === from.name ||
    !("startViewTransition" in document) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const root = document.documentElement;
  root.style.setProperty(
    "--page-dir",
    (to.meta.navIndex ?? 0) > (from.meta.navIndex ?? 0) ? "1" : "-1",
  );
  navFromTop = document.getElementById("site-nav")?.getBoundingClientRect().top ?? 0;
  return new Promise<void>((proceed) => {
    const transition = document.startViewTransition(
      () =>
        new Promise<void>((done) => {
          finishPageUpdate = done;
          proceed();
        }),
    );
    activeTransition = transition;
    // A newer transition skips this one; only the latest clears the state.
    void transition.finished.finally(() => {
      if (activeTransition !== transition) return;
      activeTransition = undefined;
      for (const name of PAGE_VARS) root.style.removeProperty(name);
      delete root.dataset.navMove;
    });
  });
});

router.afterEach(async () => {
  const finish = finishPageUpdate;
  if (!finish) return;
  finishPageUpdate = undefined;
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve));
  const bounds = document.getElementById("site-nav")?.getBoundingClientRect();
  if (bounds && Math.abs(bounds.top - navFromTop) > 1) {
    const root = document.documentElement;
    root.style.setProperty("--nav-from", `${navFromTop}px`);
    root.style.setProperty("--nav-to", `${bounds.top}px`);
    root.dataset.navMove = bounds.top < navFromTop ? "up" : "down";
  }
  finish();
});

export default router;

declare module "vue-router" {
  interface RouteMeta {
    navIndex?: number;
  }
}
