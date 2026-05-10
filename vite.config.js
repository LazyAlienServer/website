import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const html = ({ scripts = ["/main.tsx"], styles = [] } = {}) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>las-website</title>
    ${styles.map((href) => `<link rel="stylesheet" href="/${href}" />`).join("\n    ")}
  </head>
  <body>
    <div id="root"></div>
    ${scripts.map((src) => `<script type="module" src="${src}"></script>`).join("\n    ")}
  </body>
</html>`;

const generatedHtmlEntry = () => ({
  name: "generated-html-entry",
  configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      if (request.url !== "/") {
        next();
        return;
      }

      const transformedHtml = await server.transformIndexHtml("/", html());
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.end(transformedHtml);
    });
  },
  generateBundle(_, bundle) {
    const entry = Object.values(bundle).find(
      (item) => item.type === "chunk" && item.isEntry,
    );
    const styles = Object.values(bundle)
      .filter((item) => item.type === "asset" && item.fileName.endsWith(".css"))
      .map((item) => item.fileName);

    if (!entry || entry.type !== "chunk") return;

    this.emitFile({
      type: "asset",
      fileName: "index.html",
      source: html({ scripts: [`/${entry.fileName}`], styles }),
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  root: "src",
  publicDir: "src/public",
  plugins: [generatedHtmlEntry(), react(), tailwindcss()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "main.tsx",
    },
  },
});
