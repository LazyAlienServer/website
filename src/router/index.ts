import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import RulesPage from "@/views/RulesPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/rules", name: "rules", component: RulesPage },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: -72 };
    return { top: 0 };
  },
});

export default router;
