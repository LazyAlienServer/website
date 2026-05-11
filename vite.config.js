import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { generatedHtmlEntry } from "./config/vite/generatedHtmlEntry.js";

// https://vite.dev/config/
export default defineConfig({
  root: "src",
  base: process.env.BASE_PATH ?? "/",
  publicDir: "public",
  plugins: [generatedHtmlEntry(), react(), tailwindcss()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "main.tsx",
    },
  },
});
