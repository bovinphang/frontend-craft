# frontend-craft-openclaw

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

`frontend-craft-openclaw` ships the OpenClaw-native package for [frontend-craft](https://github.com/bovinphang/frontend-craft): workflow skills, markdown commands, OpenClaw workspace templates, typed hooks, a design MCP reference, and the optional `frontend_craft_init_workspace` tool.

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
openclaw plugins install frontend-craft-openclaw
```

From a local tarball built from the main repository:

```bash
npm install
npm run pack:openclaw
openclaw plugins install ./frontend-craft-openclaw-<version>.tgz
```

For local development, link the package directory:

```bash
openclaw plugins install -l /path/to/frontend-craft/npm-packages/openclaw
```

### 2. Enable The Plugin

The plugin id is `frontend-craft` even when the npm package is `frontend-craft-openclaw`.

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

| Variable | Tool |
| --- | --- |
| `FIGMA_API_KEY` | Figma / Desktop |
| `SKETCH_API_KEY` | Sketch |
| `MG_MCP_TOKEN` | MasterGo |
| `MODAO_TOKEN` | Modao |

Pixso uses the local MCP URL shown in `.mcp.json`. MockingBot has no MCP integration; use screenshots or exported specs.

---

## Package Layout

```text
frontend-craft-openclaw/
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

### Commands

| File | Purpose |
| --- | --- |
| `commands/fec-init.md` | Initialize frontend-craft workspace templates |
| `commands/fec-review.md` | Guided frontend code review |
| `commands/fec-scaffold.md` | Page / feature / component scaffolding guide |

### Skills

| Skill | Purpose |
| --- | --- |
| `fec-frontend-code-review` | Architecture, type safety, rendering, styles, accessibility, tests, security |
| `fec-security-review` | XSS, CSRF, sensitive data leakage, unsafe input handling |
| `fec-accessibility-check` | WCAG-oriented semantic structure, keyboard support, focus, labels |
| `fec-react-project-standard` | React + TypeScript project standards |
| `fec-vue3-project-standard` | Vue 3 + TypeScript project standards |
| `fec-implement-from-design` | Implement UI from Figma, Sketch, MasterGo, Pixso, Modao, or screenshots |
| `fec-test-and-fix` | Run validation commands, diagnose failures, and fix safely |
| `fec-legacy-web-standard` | JavaScript + jQuery + HTML/CSS legacy frontend standards |
| `fec-legacy-to-modern-migration` | jQuery / MPA migration strategy to React or Vue + TypeScript |
| `fec-e2e-testing` | Playwright / Cypress E2E structure, artifacts, CI, and flaky test handling |
| `fec-nextjs-project-standard` | Next.js App Router, SSR/SSG, routing, metadata, middleware |
| `fec-nuxt-project-standard` | Nuxt 3 SSR/SSG, composables, routing, middleware |
| `fec-monorepo-project-standard` | pnpm workspace, Turborepo, Nx structure and task orchestration |

### Using skills (scenarios & examples)

Skills live under `skills/<id>/SKILL.md`. OpenClaw exposes them as plugin skill roots (`openclaw.plugin.json` lists `skills` and `commands`). The harness typically **auto-selects** a workflow when your plain-language request matches a skill’s frontmatter `description`; exact behavior depends on your OpenClaw / agent setup. You do **not** need to know internal skill ids—describe the outcome you want. (Power users may still mention an id if they know it.)

**Tips**

- Point to **paths or components** when asking for reviews or refactors.
- For design-to-code, attach a **Figma link / node id**, **screenshot**, or say which MCP you configured.
- When lint, typecheck, tests, or build fail, name the **exact commands** you run if they are non-standard.

**Scenarios and example prompts**

| Scenario | Skill (reference) | Example prompt (no skill names) |
| --- | --- | --- |
| PR or branch review before merge | `fec-frontend-code-review` | “Please review `src/features/checkout/` before I merge: architecture, types, a11y, and tests. Save a markdown report under `reports/`.” |
| Focus on XSS, secrets, dangerous DOM | `fec-security-review` | “Audit `src/lib/auth.ts` and anything that renders or stores user-controlled HTML for XSS and secret leaks; list fixes by severity.” |
| New dialog / form — keyboard & ARIA | `fec-accessibility-check` | “Check `src/components/ConfirmDialog.tsx` for keyboard traps, focus order, labels, and ARIA; suggest concrete fixes.” |
| Align a React module with team conventions | `fec-react-project-standard` | “We use React 18 and TanStack Query. Review `src/pages/Dashboard/` against solid React + TS patterns and our existing abstractions.” |
| Align a Vue module with team conventions | `fec-vue3-project-standard` | “Review `src/views/Settings.vue` and its composables for Vue 3 + TS best practices and consistency with the rest of the app.” |
| Implement from Figma / screenshot | `fec-implement-from-design` | “Implement this screen from Figma node `123:456`: match spacing and design tokens, reuse our `Button`, and note any assumptions.” |
| CI red or local script failures | `fec-test-and-fix` | “`pnpm lint` and `pnpm test` are failing—find the root causes, fix them, and don’t weaken types or skip checks.” |
| Maintain jQuery / MPA legacy pages | `fec-legacy-web-standard` | “For `public/js/legacy/*.js`, suggest safe refactors and patterns that keep current behavior; we still ship this in production.” |
| Plan jQuery → React/Vue migration | `fec-legacy-to-modern-migration` | “We have `static/app.js` in jQuery + MPA. Outline a phased migration to React + TypeScript with risks and milestones.” |
| Add or stabilize E2E | `fec-e2e-testing` | “Add a Playwright smoke test for login; use a clear folder layout and Page Objects, and mention how to run it in CI.” |
| Next.js App Router feature | `fec-nextjs-project-standard` | “Review `app/(dashboard)/reports/page.tsx` and related server actions for Next.js App Router best practices (data fetching, errors, metadata).” |
| Nuxt 3 feature or layout | `fec-nuxt-project-standard` | “Review `pages/admin/*.vue` and `composables/useApi.ts` for Nuxt 3 SSR/data/composables conventions.” |
| Monorepo boundaries and tasks | `fec-monorepo-project-standard` | “`apps/web` depends on `packages/ui`—check package boundaries, workspace config, and Turborepo task graph for issues.” |

**Slash commands (markdown under `commands/`)**

These are loaded as command specs; use them when you want a **fixed checklist** instead of free-form matching. In chat, describe what you want—the agent can follow the matching command doc without you naming it.

| Command doc | When to use | Example (plain language) |
| --- | --- | --- |
| `fec-init.md` | Bootstrap **Claude-style** `.claude/` templates in a **project repo** (paths in the doc target `.claude/`). | “Initialize this repo’s `.claude/` with the frontend-craft templates and rules from the plugin; ask before overwriting.” |
| `fec-review.md` | Guided review + save `reports/code-review-*.md`. | “Review the files changed in my last commit and write a structured markdown report under `reports/`.” |
| `fec-scaffold.md` | Page / feature / component folder layout. | “Scaffold a new React page `UserDetail` with the usual `src/pages/...` layout and empty `components/` and `hooks/` folders.” |

### Hooks

| Hook | Behavior |
| --- | --- |
| `before_tool_call` | Blocks dangerous shell / exec-style commands |
| `after_tool_call` | Optionally runs Prettier on write/edit targets (`formatAfterWrite`, default on) |
| `before_prompt_build` | Prepends a one-time framework and package-manager hint per session |
| `agent_end` | Emits a completion bell/log line when a run succeeds (`notifyOnAgentEnd`, default on) |

### Plugin Config

| Key | Type | Default | Meaning |
| --- | --- | --- | --- |
| `formatAfterWrite` | boolean | `true` | Run Prettier after write/edit tool calls |
| `notifyOnAgentEnd` | boolean | `true` | Emit a completion bell/log line when an agent run succeeds |

---

## Build From Source

From the main `frontend-craft` repository:

```bash
npm install
npm run typecheck:openclaw
npm run pack:openclaw
```

`npm run pack:openclaw` builds and verifies the OpenClaw bundle, refreshes `npm-packages/openclaw`, and writes `frontend-craft-openclaw-<version>.tgz` to the repository root.

---

## License

MIT
