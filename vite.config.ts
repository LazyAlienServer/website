import { defineConfig, lazyPlugins } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    ignorePatterns: ["dist/**"],
    plugins: ["eslint", "typescript", "unicorn", "oxc", "import", "vue"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "import/no-commonjs": "error",
      "import/no-self-import": "error",
      "eslint/no-alert": "error",
      "eslint/no-eval": "error",
      "eslint/no-new-func": "error",
      "import/no-duplicates": "error",
      "eslint/no-debugger": "error",
      "typescript/no-floating-promises": "error",
      "typescript/no-unsafe-assignment": "warn",
      "typescript/no-unsafe-member-access": "warn",
      "typescript/consistent-type-imports": "error",
      "typescript/no-unnecessary-type-assertion": "warn",
      "vue/no-side-effects-in-computed-properties": "error",
      "vue/no-watch-after-await": "error",
      "vue/no-lifecycle-after-await": "error",
      "vue/no-expose-after-await": "error",
      "vue/no-import-compiler-macros": "error",
      "vue/prefer-import-from-vue": "error",
      "vue/valid-define-props": "error",
      "vue/no-async-in-computed-properties": "error",
      "vue/no-computed-properties-in-data": "error",
      "vue/no-deprecated-events-api": "error",
      "vue/no-deprecated-model-definition": "error",
      "vue/no-reserved-keys": "error",
      "vue/no-reserved-props": "error",
      "vue/valid-next-tick": "error",
      "vue/valid-define-emits": "error",
    },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [vue()]),
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "/",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;\n`,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
});
