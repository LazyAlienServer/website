# Project Introduction

LASweb-v2 is the official website for Lazy Alien Server (LAS), a Chinese Minecraft server organization focused on student-led technical exchange. The site presents LAS's community, founding timeline, infrastructure, open-source projects, administration team, and joining information, with a separate rules page.

## Architecture

- Vue 3 application using Composition API and `<script setup lang="ts">`.
- TypeScript for application logic, SCSS for styling, and Vite+ for development, builds, checking, and package management.
- `src/views/` contains route-level pages: `HomePage.vue` composes the landing-page sections and `RulesPage.vue` renders the rules data.
- `src/components/` contains reusable landing-page sections and interactive modules such as the live timer, hardware accordion, GitHub project listing, and join flow.
- `src/data/rules.ts` is the source of truth for the rules page; `src/styles/` contains shared design tokens and global industrial UI styles.
- `src/router/index.ts` defines the `/` home route and `/rules` rules route. The `@` alias resolves to `src/`.

Detailed runtime boundaries, state ownership, data flows, and modification entry points are documented in [architecture.md](architecture.md).

## Product and Design Context

The visual language is neo-industrial and technological: blue and black are primary colors, white is used for contrast, and interfaces use panels, grid lines, status indicators, clipped corners, and restrained motion. Preserve the existing Chinese-language content and responsive behavior when changing UI. Respect `prefers-reduced-motion` and keep interactive controls keyboard-accessible.

## Important Rules

- Do not perform browser-based verification or use browser tooling unless the user explicitly asks for it.

## Working Notes

- The homepage fetches and caches the six most-starred repositories from the LazyAlienServer GitHub organization at runtime.
- The founding date used by the live timer is 2022-08-29.
- Images and logos are available under `public/`, `src/assets/`, and `.design/`; reuse existing assets and patterns before adding new ones.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
