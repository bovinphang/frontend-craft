# frontend-craft

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)

---

<div align="center">

**Language / 语言**

[**English**](README.md) | [简体中文](README.zh-CN.md)

</div>

---

**An OpenClaw native plugin build for frontend-craft.**

`frontend-craft` ships the OpenClaw-native package for [frontend-craft](https://github.com/bovinphang/frontend-craft): workflow skills, markdown commands, OpenClaw workspace templates, typed hooks, a design MCP reference, and the optional `frontend_craft_init_workspace` tool.

**Requirements:** Node.js **>= 22**, OpenClaw plugin API **>= 2026.4.20**.

---

## Quick Start

### 1. Install

From ClawHub (recommended when published there):

```bash
openclaw plugins install clawhub:frontend-craft
```

From npm:

```bash
openclaw plugins install frontend-craft
```

From a local tarball built from the main repository:

```bash
npm install
npm run pack:openclaw
openclaw plugins install ./frontend-craft-<version>.tgz
```

For local development, link the package directory:

```bash
openclaw plugins install -l /path/to/frontend-craft/npm-packages/openclaw
```

### 2. Enable The Plugin

The npm package name and plugin id are both `frontend-craft`.

```json5
{
  plugins: {
    allow: ["frontend-craft"],
    entries: {
      "frontend-craft": {
        enabled: true,
        config: {
          // Optional, see openclaw.plugin.json:
          // formatAfterWrite: true,
          // notifyOnAgentEnd: true,
        },
      },
    },
  },
}
```

Restart the gateway after changing plugin configuration:

```bash
openclaw gateway restart
openclaw plugins inspect frontend-craft
```

### 3. Initialize An OpenClaw Workspace

OpenClaw loads agent context from the agent workspace, often `~/.openclaw/workspace`. Use the optional `frontend_craft_init_workspace` tool with:

- `workspaceDir`: absolute path to the workspace root
- `overwriteAgents`: `true` only when replacing an existing `AGENTS.md`

The tool copies:

- `templates/openclaw/AGENTS.md` -> workspace `AGENTS.md`
- `templates/shared/rules/*.md` -> workspace `skills/frontend-craft-rules/`

You can also copy those files manually. See `templates/openclaw/OPENCLAW-CONFIG.md` for OpenClaw configuration notes.

### 4. Configure Design MCP Servers

The bundled `.mcp.json` is a reference for Figma, Sketch, MasterGo, Pixso, and Modao. Native OpenClaw plugins do not automatically merge MCP config, so copy the `mcpServers` block into your embedded Pi / gateway MCP configuration.

Common environment variables:

| Variable         | Tool            |
| ---------------- | --------------- |
| `FIGMA_API_KEY`  | Figma / Desktop |
| `SKETCH_API_KEY` | Sketch          |
| `MG_MCP_TOKEN`   | MasterGo        |
| `MODAO_TOKEN`    | Modao           |

Pixso uses the local MCP URL shown in `.mcp.json`. MockingBot has no MCP integration; use screenshots or exported specs.

---

## Package Layout

```text
frontend-craft/
|-- dist/                  # Bundled OpenClaw plugin entry
|-- skills/                # Workflow skills
|-- commands/              # Markdown command specs loaded as skills
|-- templates/openclaw/    # OpenClaw AGENTS.md and config notes
|-- templates/shared/      # Shared frontend rules
|-- .mcp.json              # Design MCP reference
|-- openclaw.plugin.json   # Plugin metadata and config schema
|-- package.json
```

---

## Features

### Skills

| Skill                            | Purpose                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| `fec-code-review`                | Architecture, type safety, rendering, styles, accessibility, tests, security         |
| `fec-security-review`            | XSS, CSRF, sensitive data leakage, unsafe input handling                             |
| `fec-accessibility-check`        | WCAG-oriented semantic structure, keyboard support, focus, labels                    |
| `fec-react-project-standard`     | React + TypeScript project standards                                                 |
| `fec-vue3-project-standard`      | Vue 3 + TypeScript project standards                                                 |
| `fec-implement-from-design`      | Implement UI from Figma, Sketch, MasterGo, Pixso, Modao, or screenshots              |
| `fec-validation-fix`             | Run validation commands, diagnose failures, and fix safely                           |
| `fec-legacy-web-standard`        | JavaScript + jQuery + HTML/CSS legacy frontend standards                             |
| `fec-legacy-to-modern-migration` | Legacy frontend modernization, target-stack selection, and phased migration          |
| `fec-testing-strategy`           | Testing layer selection, risk matrix, and coverage planning                          |
| `fec-e2e-testing`                | Playwright / Cypress E2E structure, artifacts, CI, and flaky test handling           |
| `fec-nextjs-project-standard`    | Next.js App Router, SSR/SSG, routing, metadata, middleware                           |
| `fec-nuxt-project-standard`      | Nuxt 3 SSR/SSG, composables, routing, middleware                                     |
| `fec-monorepo-project-standard`  | pnpm workspace, Turborepo, Nx structure and task orchestration                       |
| `fec-data-fetching`              | Server-state fetching, caching, invalidation, SSR, and infinite loading              |
| `fec-state-management`           | State ownership, store selection, URL/server/form/local state boundaries             |
| `fec-form-handling`              | Framework-aware forms, schema validation, dynamic fields, uploads, multi-step flows  |
| `fec-tailwind-design-system`     | Tailwind tokens, theme extension, variants, class governance, dark mode              |
| `fec-responsive-layout`          | Mobile-first layouts, container queries, data-dense responsive UI                    |
| `fec-browser-storage`            | localStorage/sessionStorage/IndexedDB/Cookies selection and safe client persistence  |
| `fec-route-protection`           | Authenticated and permissioned routes for React Router, Next.js, Vue Router, Nuxt    |
| `fec-component-testing`          | React Testing Library / Vue Test Utils component tests and regression scenarios      |
| `fec-storybook-component-doc`    | Storybook component docs, addons, MDX, interaction and visual test integration       |
| `fec-list-virtualization`        | Framework-aware virtualization, item measurement, grids, and infinite scrolling      |
| `fec-pwa-implementation`         | Manifest, service worker, offline cache, install prompts, update handling            |
| `fec-web-workers`                | Web Worker integration, transferable objects, Comlink, worker pools                  |
| `fec-canvas-threejs`             | Canvas 2D, Three.js, React Three Fiber, WebGL performance and accessibility          |
| `fec-svg-animation`              | SVG animation with CSS, Framer Motion, GSAP, reduced-motion fallbacks                |
| `fec-ui-design`                  | UI direction, visual identity, polish, states, visual QA                             |
| `fec-typescript-type-safety`     | Type contracts, DTO mapping, type guards, generics, and type-level checks            |
| `fec-dependency-upgrade`         | Dependency upgrades, lockfile review, CVE remediation, migration verification        |
| `fec-vite-project-standard`      | Vite config, env safety, HMR, dev proxy, build optimization, library mode            |

### Using skills (scenarios & examples)

Skills live under `skills/<id>/SKILL.md`. OpenClaw exposes them as plugin skill roots (`openclaw.plugin.json` lists `skills` and `commands`). The harness typically **auto-selects** a workflow when your plain-language request matches a skill’s frontmatter `description`; exact behavior depends on your OpenClaw / agent setup. You do **not** need to know internal skill ids—describe the outcome you want. (Power users may still mention an id if they know it.)

This section is a quick OpenClaw-oriented sample, not the full prompt catalog. For complete scenario-based prompts across skills, agents, commands, design workflows, testing, maintenance, and runtime setup, see [docs/example-prompts.md](docs/example-prompts.md).

**Tips**

- Point to **paths or components** when asking for reviews or refactors.
- For design-to-code, attach a **Figma link / node id**, **screenshot**, or say which MCP you configured.
- When lint, typecheck, tests, or build fail, name the **exact commands** you run if they are non-standard.

**OpenClaw quick scenarios and example prompts**

| Scenario                                   | Skill (reference)                | Example prompt (no skill names)                                                                                                                  |
| ------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| PR or branch review before merge           | `fec-code-review`                | “Please review `src/features/checkout/` before I merge: architecture, types, a11y, and tests. Save a markdown report under `reports/`.”          |
| Focus on XSS, secrets, dangerous DOM       | `fec-security-review`            | “Audit `src/lib/auth.ts` and anything that renders or stores user-controlled HTML for XSS and secret leaks; list fixes by severity.”             |
| New dialog / form — keyboard & ARIA        | `fec-accessibility-check`        | “Check `src/components/ConfirmDialog.tsx` for keyboard traps, focus order, labels, and ARIA; suggest concrete fixes.”                            |
| Align a React module with team conventions | `fec-react-project-standard`     | “We use React 18 and TanStack Query. Review `src/pages/Dashboard/` against solid React + TS patterns and our existing abstractions.”             |
| Align a Vue module with team conventions   | `fec-vue3-project-standard`      | “Review `src/views/Settings.vue` and its composables for Vue 3 + TS best practices and consistency with the rest of the app.”                    |
| Implement from Figma / screenshot          | `fec-implement-from-design`      | “Implement this screen from Figma node `123:456`: match spacing and design tokens, reuse our `Button`, and note any assumptions.”                |
| CI red or local script failures            | `fec-validation-fix`             | “`pnpm lint` and `pnpm test` are failing—find the root causes, fix them, and don’t weaken types or skip checks.”                                 |
| Maintain jQuery / MPA legacy pages         | `fec-legacy-web-standard`        | “For `public/js/legacy/*.js`, suggest safe refactors and patterns that keep current behavior; we still ship this in production.”                 |
| Plan legacy frontend modernization         | `fec-legacy-to-modern-migration` | “We have `static/app.js` in jQuery + MPA. Evaluate keeping the MPA, local modernization, or moving to our target stack with risks and milestones.” |
| Plan frontend test coverage                | `fec-testing-strategy`           | “For this checkout refactor, map risks to static checks, unit/component tests, E2E, visual, a11y, and security coverage before we write tests.”  |
| Add or stabilize E2E                       | `fec-e2e-testing`                | “Add a Playwright smoke test for login; use a clear folder layout and Page Objects, and mention how to run it in CI.”                            |
| Next.js App Router feature                 | `fec-nextjs-project-standard`    | “Review `app/(dashboard)/reports/page.tsx` and related server actions for Next.js App Router best practices (data fetching, errors, metadata).”  |
| Nuxt 3 feature or layout                   | `fec-nuxt-project-standard`      | “Review `pages/admin/*.vue` and `composables/useApi.ts` for Nuxt 3 SSR/data/composables conventions.”                                            |
| Monorepo boundaries and tasks              | `fec-monorepo-project-standard`  | “`apps/web` depends on `packages/ui`—check package boundaries, workspace config, and Turborepo task graph for issues.”                           |
| Server-state data fetching                 | `fec-data-fetching`              | “Review `src/data/reports.ts` for server-state fetching, cache keys, invalidation, SSR hydration, and whether a query library is warranted.”       |
| State ownership and store selection        | `fec-state-management`           | “Audit our dashboard state: decide what belongs in URL params, TanStack Query, local state, or the global store, then propose a safe migration.” |
| Complex form with validation               | `fec-form-handling`              | “Build a multi-step registration form; choose the project-appropriate form library and schema validation approach, with uploads and dynamic fields.” |
| Add route guards to an app                 | `fec-route-protection`           | “Secure the `/admin` routes in our React Router app: redirect unauthenticated users and enforce role-based access.”                              |
| Write component unit tests                 | `fec-component-testing`          | “Add RTL tests for `src/components/UserCard.tsx`: render, user-event interactions, and snapshot for regression.”                                 |
| Document a component library               | `fec-storybook-component-doc`    | “Set up Storybook for `packages/ui/` with MDX docs, accessibility addon, and interaction tests.”                                                 |
| Render thousands of list rows              | `fec-list-virtualization`        | “Our `ProductList` renders 10k items—choose a virtualization approach for our framework, dynamic heights, browser search, and SEO constraints.”   |
| Add offline support                        | `fec-pwa-implementation`         | “Make this React app a PWA: manifest, service worker, offline cache strategy, and install prompt.”                                               |
| Heavy computation off main thread          | `fec-web-workers`                | “Move the image-processing logic to a Web Worker with Comlink to keep the UI responsive.”                                                        |
| Build an interactive 3D scene              | `fec-canvas-threejs`             | “Add a Three.js product viewer to `src/components/ProductViewer.tsx` with performance and fallback considerations.”                              |
| Add SVG motion to a landing page           | `fec-svg-animation`              | “Animate the hero SVG with Framer Motion, and ensure reduced-motion users get a static fallback.”                                                |
| Design and polish UI                       | `fec-ui-design`                  | “Review `src/components/Dashboard.tsx` for UI direction, visual identity, spacing, states, and motion polish.”                                   |
| Optimize Vite build config                 | `fec-vite-project-standard`      | “Audit our `vite.config.ts` for HMR, dev proxy, env variable safety, and library mode best practices.”                                           |

**Slash commands (markdown under `commands/`)**

These are loaded as command specs; use them when you want a **fixed checklist** instead of free-form matching. In chat, describe what you want—the agent can follow the matching command doc without you naming it. The table below lists common OpenClaw examples; the complete command prompt set is in [docs/example-prompts.md](docs/example-prompts.md#power-user-prompts).

| Command doc       | When to use                                                                                                 | Example (plain language)                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `fec-init.md`     | Bootstrap **Claude-style** `.claude/` templates in a **project repo** (paths in the doc target `.claude/`). | “Initialize this repo’s `.claude/` with the frontend-craft templates and rules from the plugin; ask before overwriting.”     |
| `fec-review.md`   | Guided review + save `reports/code-review-*.md`.                                                            | “Review the files changed in my last commit and write a structured markdown report under `reports/`.”                        |
| `fec-scaffold.md` | Page / feature / component folder layout.                                                                   | “Scaffold a new React page `UserDetail` with the usual `src/pages/...` layout and empty `components/` and `hooks/` folders.” |

### Hooks

| Hook                  | Behavior                                                                              |
| --------------------- | ------------------------------------------------------------------------------------- |
| `before_tool_call`    | Blocks dangerous shell / exec-style commands                                          |
| `after_tool_call`     | Optionally runs Prettier on write/edit targets (`formatAfterWrite`, default on)       |
| `before_prompt_build` | Prepends a one-time framework and package-manager hint per session                    |
| `agent_end`           | Emits a completion bell/log line when a run succeeds (`notifyOnAgentEnd`, default on) |

### Plugin Config

| Key                | Type    | Default | Meaning                                                    |
| ------------------ | ------- | ------- | ---------------------------------------------------------- |
| `formatAfterWrite` | boolean | `true`  | Run Prettier after write/edit tool calls                   |
| `notifyOnAgentEnd` | boolean | `true`  | Emit a completion bell/log line when an agent run succeeds |

---

## Build From Source

From the main `frontend-craft` repository:

```bash
npm install
npm run typecheck:openclaw
npm run pack:openclaw
```

`npm run pack:openclaw` builds and verifies the OpenClaw bundle, refreshes `npm-packages/openclaw`, and writes `frontend-craft-<version>.tgz` to the `npm-packages/openclaw/` directory.

---

## License

MIT
