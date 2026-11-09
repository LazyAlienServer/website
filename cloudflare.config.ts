import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "las-web",
    compatibilityDate: "2026-11-01",
    observability: {
      enabled: true,
    },
    assets: {
      notFoundHandling: "single-page-application",
    },
  },
});
