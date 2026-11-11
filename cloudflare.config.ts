import { bindings, defineConfig, triggers } from "cf/config";

export default defineConfig({
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
      // Uptime history (latest result, hourly and daily rollups). No id: the
      // first `cf deploy` provisions the database.
      STATUS_DB: bindings.d1({ name: "las-web-status" }),
    },
    // Route checks run here, not per request (worker/index.ts `scheduled`).
    triggers: [triggers.scheduled({ schedule: "*/10 * * * *" })],
    domains: ["lzalien.org"],
    workersDev: true,
    previewUrls: true,
    observability: { enabled: true, issues: { enabled: true } },
  },
});
