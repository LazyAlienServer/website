import { bindings, defineConfig, triggers } from "cf/config";

// The site is a client-side React app: `vp build` writes `dist/index.html` plus
// hashed assets, and the Worker only serves those static files.
// `isPreview` is set by `cf previews deploy`. Previews reject the `triggers`
// field, and Cron Triggers only ever target production, so it is omitted there.
export default defineConfig(({ isPreview }) => ({
  accountId: "9a69f1d9357de40a684b037f0a7405ae",
  worker: {
    name: "las-web",
    compatibilityDate: "2026-11-06",
    // Serves /api/* only; everything else is static assets (the SPA).
    entrypoint: "./worker/index.ts",
    assets: { notFoundHandling: "single-page-application", runWorkerFirst: ["/api/*"] },
    env: {
      // JSON array of groups, each { "name", "routes": [{ "name", "target":
      // "host:port", "dns"?: failover hostname }] }, checked by the cron below
      // (TCP, or DNS when "dns" is set). Set it as a Worker secret, never in
      // the repo: the addresses must not reach the browser.
      STATUS_ROUTES: bindings.secret(),
      // Uptime history (latest result, half-hourly and daily rollups). No id: the
      // first `cf deploy` provisions the database.
      STATUS_DB: bindings.d1({ name: "las-web-status" }),
    },
    // Route checks run here, not per request (worker/index.ts `scheduled`).
    ...(isPreview ? {} : { triggers: [triggers.scheduled({ schedule: "*/5 * * * *" })] }),
    domains: ["lzalien.org"],
    workersDev: true,
    previewUrls: true,
    observability: { enabled: true, issues: { enabled: true } },
  },
}));
