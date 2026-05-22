<div align="center">

# frontend-craft

### One toolkit. Every AI coding assistant. Production-grade frontend standards.

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/frontend-craft)](https://www.npmjs.com/package/frontend-craft)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Node](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vue](https://img.shields.io/badge/-Vue-4FC08D?logo=vue.js&logoColor=white)
![Figma](https://img.shields.io/badge/-Figma-F24E1E?logo=figma&logoColor=white)

**🌐 Language / 语言 / 語言 / 言語 / 언어**

[**English**](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](docs/zh-TW/README.md) · [日本語](docs/ja-JP/README.md) · [한국어](docs/ko-KR/README.md)

</div>

---

`frontend-craft` is a **universal frontend plugin** that brings the same opinionated engineering standards to all **15 AI coding assistants** listed below:

`claude` `codex` `cursor` `windsurf` `opencode`
`kilo` `gemini` `copilot` `antigravity` `augment`
`trae` `codebuddy` `cline` `openclaw` `qoder`

Per-runtime paths and caveats live in [`docs/runtimes/`](docs/runtimes/).

It bundles **13 specialized agents**, **31 auto-activated skills**, **9 slash commands**, **5 event-driven hooks**, **MCP templates** for 6 design tools, and a complete **rules library** into a single installable package. Run one command, and every AI session on your team writes React, Vue, Next.js, or Nuxt the same way — typed, accessible, secure, and consistent.

```bash
npx frontend-craft@latest
```

That’s it. The wizard walks you through the rest.

---

## Why frontend-craft?

| Problem                                                              | What frontend-craft does                                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| AI assistants write inconsistent, untyped, or insecure frontend code | **31 skills** encode team standards — auto-activated when the assistant touches matching files |
| Each AI tool has its own plugin format                               | **One CLI** installs the same rules, agents, and hooks into 15 runtimes                        |
| Design-to-code handoff is lossy                                      | **MCP templates** read Figma, Sketch, MasterGo, Pixso, 墨刀, and 摹客 directly                 |
| Reviews are ad-hoc and shallow                                       | **13 agents** produce graded reports: code, security, a11y, performance, TS, UI fidelity       |
| No one remembers to run lint/tests                                   | **Event-driven hooks** validate on save and session end — automatically                        |
| New projects start from scratch every time                           | **`/fec-init`** scaffolds CLAUDE.md, rules, and settings in seconds                            |

---

## Install

Requires **Node.js 22+**. Works on **Windows, macOS, and Linux**.

### Option 1 — Interactive wizard (recommended)

```bash
npx frontend-craft@latest
```

The wizard lets you pick one or more runtimes and whether to install globally or per-project. It’s the friendliest way to get started.

### Option 2 — Scripted install

```bash
# Install into the current project
npx frontend-craft@latest install --local claude

# Install globally for a runtime
npx frontend-craft@latest install --global codex

# Preview what would be installed across all runtimes
npx frontend-craft@latest install --all --dry-run --global

# List available runtimes
npx frontend-craft@latest list
```

> **CI / scripts:** always pass `--global` / `-g` or `--local` / `-l`. Without a TTY, the CLI defaults to `claude --global` if neither is set.

### Option 3 — Claude Code Marketplace

If you install only through the **Claude Code Marketplace** (native plugin flow), full steps are in [docs/runtimes/claude.md](docs/runtimes/claude.md) · [简体中文](docs/runtimes/claude.zh-CN.md).

---

## Quick start

Once installed, you have a full frontend engineering toolkit available in every AI session:

```text
You: "Review my recent changes"
→ The frontend-code-reviewer agent is dispatched, produces reports/code-review-*.md

You: "/fec-review"
→ Runs a structured review across architecture, types, rendering, styles, a11y

You: "Implement the checkout page from this Figma link"
→ The figma-implementer agent reads the design via MCP, emits components and a report

You: "/fec-scaffold dashboard feature"
→ Creates a page / feature / component directory tree following project conventions

You: "/fec-build-fix"
→ Incrementally repairs lint, type-check, test, and build failures
```

All slash commands below are shown for **Claude Code**; other runtimes expose the same capabilities through their own command systems (see [`docs/runtimes/`](docs/runtimes/)).

---

## What’s inside

### Commands

Slash commands are the primary entry points for structured workflows. Most produce a timestamped Markdown report under `reports/`.

| Command               | Purpose                                                                | Report                       |
| --------------------- | ---------------------------------------------------------------------- | ---------------------------- |
| `/fec-init`           | Initialize project templates (CLAUDE.md, rules, settings)              | —                            |
| `/fec-review`         | Structured review of specified or recently changed files               | `code-review-*.md`           |
| `/fec-test-plan`      | Plan testing layers, risk coverage, and execution order                | `test-plan-*.md`             |
| `/fec-scaffold`       | Create page / feature / component boilerplate by convention            | —                            |
| `/fec-plan`           | Architect features, refactors, or migrations before implementation     | `architecture-proposal-*.md` |
| `/fec-tdd`            | Red → green → refactor loop for frontend TDD                           | —                            |
| `/fec-build-fix`      | Incrementally repair lint, type-check, test, build, or CI failures     | `validation-fix-*.md`        |
| `/fec-refactor-clean` | Classify and safely remove dead code, unused exports, styles, and deps | `refactor-clean-*.md`        |
| `/fec-doc-sync`       | Sync READMEs, runtime docs, capability tables, and metadata            | —                            |

### Skills (auto-activated)

Skills are workflow definitions that activate automatically based on file patterns, frameworks, or task context. They encode review dimensions, output conventions, and report formats.

**Project standards** — conventions enforced whenever matching frameworks are detected:

| Skill                           | Scope                                                                 |
| ------------------------------- | --------------------------------------------------------------------- |
| `fec-react-project-standard`    | React + TypeScript (structure, components, routing, state, API layer) |
| `fec-vue3-project-standard`     | Vue 3 + TypeScript (structure, components, routing, Pinia, API layer) |
| `fec-nextjs-project-standard`   | Next.js 14+ App Router, SSR/SSG, streaming, metadata                  |
| `fec-nuxt-project-standard`     | Nuxt 3 SSR/SSG, composables, data fetching, middleware                |
| `fec-vite-project-standard`     | Vite config, env safety, HMR, dev proxy, build optimization           |
| `fec-monorepo-project-standard` | pnpm workspace, Turborepo, Nx structure and task orchestration        |

**Quality & review** — activated during code review, PR, or refactoring workflows:

| Skill                      | Scope                                                                    |
| -------------------------- | ------------------------------------------------------------------------ |
| `fec-frontend-code-review` | Architecture, types, rendering, styles, a11y review                      |
| `fec-security-review`      | XSS, CSRF, sensitive data leakage, input validation                      |
| `fec-accessibility-check`  | WCAG 2.1 AA compliance                                                   |
| `fec-typescript-review`    | Type safety, async correctness, idiomatic patterns                       |
| `fec-testing-strategy`     | Layer selection across static, unit, component, integration, E2E, visual |
| `fec-validation-fix`       | Run and repair lint, type-check, test, build in one pass                 |
| `fec-refactor-clean`       | Safe dead-code, unused export, style, route, dependency cleanup          |

**Feature implementation** — activated when building specific UI surfaces:

| Skill                         | Scope                                                                  |
| ----------------------------- | ---------------------------------------------------------------------- |
| `fec-implement-from-design`   | Build UI from Figma/Sketch/MasterGo/Pixso/墨刀/摹客 design files       |
| `fec-data-fetching`           | TanStack Query / server-state fetching, caching, optimistic updates    |
| `fec-form-handling`           | React Hook Form + Zod, dynamic fields, uploads, multi-step flows       |
| `fec-browser-storage`         | localStorage / sessionStorage / IndexedDB / Cookies selection          |
| `fec-route-protection`        | Auth and permission routes for React Router, Next.js, Vue Router, Nuxt |
| `fec-component-testing`       | React Testing Library / Vue Test Utils with regression scenarios       |
| `fec-storybook-component-doc` | Storybook docs, addons, MDX, interaction and visual test integration   |
| `fec-list-virtualization`     | react-window / TanStack Virtual with measurement strategies            |
| `fec-e2e-testing`             | Playwright / Cypress E2E with Page Object and CI integration           |
| `fec-pwa-implementation`      | Manifest, service worker, offline cache, install prompts               |
| `fec-web-workers`             | Web Worker integration, transferables, Comlink, worker pools           |
| `fec-canvas-threejs`          | Canvas 2D, Three.js, React Three Fiber, WebGL                          |
| `fec-svg-animation`           | CSS / Framer Motion / GSAP SVG animation with reduced-motion           |

**UI & polish** — activated when refining visual output:

| Skill                     | Scope                                                                |
| ------------------------- | -------------------------------------------------------------------- |
| `fec-ui-design-direction` | Product UI direction, first-screen hierarchy, domain tone            |
| `fec-interface-polish`    | Spacing, typography, radius, shadows, hit areas, states, transitions |

**Migration & docs** — activated during modernization or documentation work:

| Skill                            | Scope                                                           |
| -------------------------------- | --------------------------------------------------------------- |
| `fec-legacy-web-standard`        | Standards for JS + jQuery + HTML maintenance                    |
| `fec-legacy-to-modern-migration` | jQuery/MPA → React/Vue 3 + TS strategy and phased workflow      |
| `fec-tdd-workflow`               | Test-first frontend implementation with red-green-refactor      |
| `fec-doc-sync`                   | Keep public docs in sync with scripts, skills, agents, commands |

### Agents

Agents are specialized sub-agents dispatched by the main assistant to handle a focused task. Each returns a structured report.

| Agent                        | Focus                                                                      | Report                       |
| ---------------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| `frontend-code-reviewer`     | React/Vue/Next/Nuxt, TS, styles, client-side security (confidence-based)   | `code-review-*.md`           |
| `typescript-reviewer`        | Type safety, async correctness, idiomatic patterns (report-only)           | `typescript-review-*.md`     |
| `frontend-security-reviewer` | XSS, client secrets, dangerous DOM/APIs, CSP, dependency audit             | `security-review-*.md`       |
| `performance-optimizer`      | Bundle size, render performance, network bottlenecks                       | `performance-review-*.md`    |
| `frontend-architect`         | Page splitting, component architecture, state flow, directory planning     | `architecture-proposal-*.md` |
| `frontend-test-planner`      | Risk-to-layer matrix: static, unit, component, E2E, visual, a11y, security | `test-plan-*.md`             |
| `frontend-build-fixer`       | Incremental lint / type-check / test / build / CI repair                   | `validation-fix-*.md`        |
| `frontend-refactor-cleaner`  | Classify and safely remove unused code, exports, styles, routes, deps      | `refactor-clean-*.md`        |
| `frontend-e2e-runner`        | E2E authoring and runs (Playwright/Cypress), flaky quarantine, traces      | `e2e-summary-*.md`           |
| `frontend-doc-updater`       | Sync README, runtime docs, structure, capability tables, metadata          | —                            |
| `ui-checker`                 | Visual issue debugging and design fidelity evaluation                      | `ui-fidelity-review-*.md`    |
| `figma-implementer`          | Precise UI implementation from Figma/Sketch/MasterGo/Pixso/墨刀/摹客       | `design-implementation-*.md` |
| `design-token-mapper`        | Map design variables to project Design Tokens                              | `token-mapping-*.md`         |

### Hooks (event-driven)

Hooks run automatically on AI assistant events — no invocation needed.

| Event                     | Behavior                                                       |
| ------------------------- | -------------------------------------------------------------- |
| `SessionStart`            | Detect project framework and package manager                   |
| `PreToolUse(Bash)`        | Block dangerous commands (`rm -rf`, force push, etc.)          |
| `PostToolUse(Write/Edit)` | Auto-format modified files with Prettier                       |
| `Stop`                    | Run lint, type-check, test, and build on session end           |
| `Notification`            | Cross-platform desktop notifications (macOS / Linux / Windows) |

### MCP integration

Plug your AI assistant directly into design tools for lossless design-to-code workflows.

| Service           | Capabilities                                         |
| ----------------- | ---------------------------------------------------- |
| **Figma**         | Read design context and variable definitions         |
| **Figma Desktop** | Figma desktop client integration                     |
| **Sketch**        | Read design selection screenshots                    |
| **MasterGo**      | Read DSL structure, component hierarchy, styles      |
| **Pixso**         | Local MCP: frame data, code snippets, image assets   |
| **墨刀**          | Prototype data, design descriptions, HTML import     |
| **摹客**          | Screenshot/annotation/exported-CSS workflow (no MCP) |

### Project templates (`/fec-init`)

Run `/fec-init` to scaffold a ready-to-use rules library and project config into `.claude/`:

<details>
<summary>Click to see all 18 template files</summary>

| File                          | Purpose                                                           |
| ----------------------------- | ----------------------------------------------------------------- |
| `CLAUDE.md`                   | Project description, commands, working principles, security       |
| `settings.json`               | Permission whitelist/blacklist, environment variables             |
| `rules/vue.md`                | Vue 3 component standards and anti-patterns                       |
| `rules/react.md`              | React component standards and anti-patterns                       |
| `rules/design-system.md`      | Design system, tokens, accessibility                              |
| `rules/testing.md`            | Testing and validation rules                                      |
| `rules/git-conventions.md`    | Conventional Commits                                              |
| `rules/i18n.md`               | Internationalization copy standards                               |
| `rules/performance.md`        | Frontend performance rules                                        |
| `rules/api-layer.md`          | API layer typing and error handling                               |
| `rules/state-management.md`   | State classification, strategy, anti-patterns                     |
| `rules/error-handling.md`     | Error layering, Error Boundary, fallback UI, reporting            |
| `rules/naming-conventions.md` | Unified naming for files, components, variables, routes, API, CSS |
| `rules/code-comments.md`      | When and how to write frontend comments                           |
| `rules/ci-cd.md`              | CI/CD pipeline stages, GitHub Actions / GitLab CI, secrets        |
| `rules/refactoring.md`        | Refactoring constraints and feature-parity requirements           |
| `rules/agent-workflow.md`     | Agent collaboration boundaries and delegation                     |
| `rules/working-modes.md`      | Research, planning, development, review, finishing modes          |

</details>

---

## Configuration

### Prerequisites

- **Node.js 22+**
- **npm, pnpm, or yarn**
- **Git Bash** (Windows only — required for hook scripts)

### MCP design-tool tokens

Set the environment variable for whichever design tool your team uses:

| Variable         | Tool                  | How to get                                            |
| ---------------- | --------------------- | ----------------------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma account settings → Personal Access Tokens       |
| `SKETCH_API_KEY` | Sketch                | Sketch developer settings                             |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo account settings → Security → Generate Token |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI feature page → access token                   |

> **Pixso** uses a local MCP server — enable MCP in the Pixso client, no env var needed.
> **摹客** has no MCP integration; works via screenshots and exported CSS.

Add to your shell config for persistence:

```bash
# macOS / Linux — append to ~/.bashrc or ~/.zshrc
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

```powershell
# Windows — set as system environment variables, or in PowerShell:
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

---

## Reports

Every review, analysis, and evaluation writes a timestamped Markdown report to `reports/`. These serve as an audit trail and a handoff artifact for PRs.

<details>
<summary>Click to see all 15 report types</summary>

| Report type            | Filename pattern                             | Produced by                                                              |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| Code review            | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review`, `fec-frontend-code-review`, `frontend-code-reviewer`      |
| TypeScript / JS review | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `typescript-reviewer`                                                    |
| Security review        | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review`, `frontend-security-reviewer`                      |
| Accessibility          | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check`                                                |
| Performance            | `performance-review-YYYY-MM-DD-HHmmss.md`    | `performance-optimizer`                                                  |
| Architecture           | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect`                                                     |
| Design fidelity        | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `ui-checker`                                                             |
| Design implementation  | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer`                                                      |
| Token mapping          | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `design-token-mapper`                                                    |
| Design plan            | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design`                                              |
| Test plan              | `test-plan-YYYY-MM-DD-HHmmss.md`             | `/fec-test-plan`, `fec-testing-strategy`, `frontend-test-planner`        |
| Validation fix         | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix`                                                     |
| Refactor clean         | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`, `fec-refactor-clean`, `frontend-refactor-cleaner` |
| E2E run summary        | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `frontend-e2e-runner` (optional)                                         |
| Migration plan         | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                         |

</details>

> **Tip:** add `reports/` to `.gitignore` to keep the auto-generated reports out of version control — or commit them to preserve a team review history.

---

## Updates

```bash
# Update a CLI-managed install (same scope as the original install)
npx frontend-craft@latest update <runtime> --local
npx frontend-craft@latest update <runtime> --global
# `upgrade` is an alias for `update`
```

The CLI writes `frontend-craft.manifest.json` into the runtime directory and **skips files you’ve modified locally**, so customizations survive updates.

For **Claude Code Marketplace** or **submodule** installs, see [docs/runtimes/claude.md](docs/runtimes/claude.md) · [简体中文](docs/runtimes/claude.zh-CN.md).

---

## Legacy Skills CLI

If your team already uses the standalone [Skills CLI](https://skills.sh/docs/cli), it can still install just the workflow skill packages from [`skills/`](skills/):

```bash
npx skills add bovinphang/frontend-craft   # follow prompts, or add -g for global
npx skills update                          # update to latest
npx skills check                           # preview available updates
```

| CLI                  | Installs                                                            |
| -------------------- | ------------------------------------------------------------------- |
| `npx frontend-craft` | Skills + runtime-specific agents, commands, hooks, rules, templates |
| `npx skills`         | Skills only (for existing Skills CLI workflows)                     |

To disable telemetry: `DISABLE_TELEMETRY=1`. Details: [skills.sh CLI docs](https://skills.sh/docs/cli).

---

## Community

- [Contributing Guide](CONTRIBUTING.md) — development setup, PR checklist, localization policy ([简体中文](CONTRIBUTING.zh-CN.md))
- [Security Policy](SECURITY.md) — private vulnerability reporting ([简体中文](SECURITY.zh-CN.md))
- [Code of Conduct](CODE_OF_CONDUCT.md) — community standards ([简体中文](CODE_OF_CONDUCT.zh-CN.md))
- [Changelog](CHANGELOG.md) — release notes ([简体中文](CHANGELOG.zh-CN.md))
- [Project structure](docs/project-structure.md) — full directory layout and file responsibilities

---

## License

[MIT](LICENSE) — use freely, modify as needed, contribute back if you can.

---

<div align="center">

**If frontend-craft helps your team ship better code, [give it a Star](https://github.com/bovinphang/frontend-craft).**

</div>
