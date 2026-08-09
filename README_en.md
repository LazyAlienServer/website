# LASweb-v2

[中文](README.md) | English

The official website of Lazy Alien Server (LAS), a Chinese Minecraft organization focused on student-led technical exchange and community infrastructure.

## What the site contains

- An introduction to the LAS community and its technical focus
- A live timer since the server organization was founded
- Hardware, storage, backup, and network infrastructure highlights
- Open-source projects from the LazyAlienServer GitHub organization
- The administration and technical team
- Review-based and invitation-based ways to join LAS
- A dedicated LazyAlienServer rules page

## Routes

- Home: `/`
- Rules: `/rules`

Visit the live site at [beta-2.lzalien.org](https://beta-2.lzalien.org/).

## Tech stack

- Vue 3 Composition API
- TypeScript
- SCSS
- Vite+ (the unified Vite, Rolldown, Oxlint, Oxfmt, and Vite Task toolchain)
- Vue Router

## Local development

The project uses the Vite+ CLI and a pinned pnpm version.

```bash
vp install
vp dev
```

Production build, formatting, and linting:

```bash
vp run build
vp fmt --check src/components/GithubProjects.vue
vp lint --deny-warnings
```

`vp run build` runs the TypeScript check before producing the production bundle. Use `vp run <script>` when invoking a script defined by the project.

## Design direction

The site uses a neo-industrial and technological visual language built around blue, black, and white. Panels, blueprint grids, status indicators, hard edges, clipped corners, industrial line textures, and restrained motion establish the interface system. The site preserves its Chinese content, supports desktop, tablet, and mobile layouts, and respects `prefers-reduced-motion`.

## Related links

- [Lazy Alien Server website (old)](https://lzalien.org/)
- [Original LAS rules page](https://lzalien.org/rules/)
