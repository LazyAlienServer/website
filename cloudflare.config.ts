import { defineConfig } from "cf/config";

// The site is a client-side React app: `vp build` writes `dist/index.html` plus
// hashed assets, and the Worker only serves those static files.
export default defineConfig({
  worker: {
    name: "las-web",
    compatibilityDate: "2026-11-06",
    assets: { notFoundHandling: "single-page-application" },
    domains: ["lzalien.org"],
    workersDev: true,
    previewUrls: true,
    observability: { enabled: true },
  },
});
