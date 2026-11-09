import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "9a69f1d9357de40a684b037f0a7405ae",
  worker: {
    name: "las-web",
    compatibilityDate: "2026-11-06",
    assets: { notFoundHandling: "single-page-application" },
    domains: ["lzalien.org"],
    workersDev: true,
    previewUrls: true,
    observability: { enabled: true, issues: { enabled: true } },
  },
});
