// vp migrate: merged .oxlintrc.json (ef6e6cb104ac6f709ffe016fe29977ef).
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";
import { generatedHtmlEntry } from "./config/vite/generatedHtmlEntry.js";
import { lazyPlugins } from "vite-plus";

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    plugins: ["react", "typescript", "jsx-a11y"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  root: "src",
  base: process.env.BASE_PATH ?? "/",
  publicDir: "public",
  plugins: lazyPlugins(() => [generatedHtmlEntry(), react(), tailwindcss()]),
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "main.tsx",
    },
  },
});
