# LASweb-v3

Experimental, motion-driven version of the Lazy Alien Server (LAS) website. React 19, TypeScript, [Vite+](https://viteplus.dev/), pnpm, and [Motion](https://motion.dev/).

```bash
vp install      # install dependencies
vp dev          # dev server
vp check        # format, lint, type check
vp run build    # type check and production build
```

Project context and design rules: [AGENTS.md](AGENTS.md). LAS content handed over from LASweb-v2: [docs/las-handoff.md](docs/las-handoff.md).

## Deployment

The site runs on Cloudflare Workers Static Assets through `cf` and `cloudflare.config.ts`; Wrangler is not used. `main` is the production branch, while `beta-3` and other branches deploy as Workers Previews.

```bash
pnpm run deploy          # production
pnpm run deploy:preview  # preview
```
