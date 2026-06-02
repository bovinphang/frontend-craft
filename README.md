<div align="center">

<img src="assets/brand/frontend-craft.png" alt="frontend-craft logo" width="200" />

# frontend-craft

### One toolkit. Every AI coding assistant. Production-grade frontend standards.

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@bovinphang/frontend-craft)](https://www.npmjs.com/package/@bovinphang/frontend-craft)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Node](https://img.shields.io/badge/Node.js-22+-5FA04E?logo=node.js&logoColor=white)
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

It bundles **13 specialized agents**, **41 auto-activated skills**, **8 slash commands**, **5 event-driven hooks**, **MCP integrations** for 6 design-tool endpoints, and a complete **rules library** into a single installable package. Run one command, and every AI session on your team writes React, Vue, Next.js, or Nuxt the same way — typed, accessible, secure, and consistent.

---

## Why frontend-craft?

| Problem                                                              | What frontend-craft does                                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| AI assistants write inconsistent, untyped, or insecure frontend code | **41 skills** encode team standards — auto-activated when the assistant touches matching files |
| Each AI tool has its own plugin format                               | **One CLI** installs the same rules, agents, and hooks into 15 runtimes                        |
| Design-to-code handoff is lossy                                      | **MCP integrations** bring in richer context from Figma, Figma Desktop, Sketch, MasterGo, Pixso, and 墨刀 |
| Reviews are ad-hoc and shallow                                       | **13 agents** produce graded reports: code, security, a11y, performance, TS, UI fidelity       |
| No one remembers to run lint/tests                                   | **Event-driven hooks** validate on save and session end — automatically                        |
| New projects start from scratch every time                           | **`/fec-init`** scaffolds CLAUDE.md, rules, and settings in seconds                            |

---

## Install

Requires **Node.js 22+**. Works on **Windows, macOS, and Linux**.

### Option 1 - Global CLI project init (recommended)

```bash
npm install -g @bovinphang/frontend-craft@latest
cd your-project
fec init
fec init codex      # initialize for a specific runtime
fec init claude     # initialize for Claude Code
```

`fec init` is the terminal CLI command for initializing the current project. In an interactive terminal, omit the runtime to choose one from the prompt; in non-interactive terminals, the CLI defaults to `claude` when no runtime is specified. `init` installs locally by default unless you explicitly pass `--global`, for example `fec init codex --global`. The in-assistant `/fec-init` slash command is separate and runs after frontend-craft is installed in your AI runtime.

### Option 2 — No-global interactive wizard

```bash
npx @bovinphang/frontend-craft@latest
```

Use this when you do not want to install a global `fec` command. The wizard walks through the full install flow: choose one or more runtimes, then choose whether to install globally or into the current project.

### Option 3 — Scripted install

```bash
# Install into the current project
npx @bovinphang/frontend-craft@latest install --local claude

# Install globally for a runtime
npx @bovinphang/frontend-craft@latest install --global codex

# Preview what would be installed across all runtimes
npx @bovinphang/frontend-craft@latest install --all --dry-run --global

# List available runtimes
npx @bovinphang/frontend-craft@latest list
```

> **CI / scripts:** always pass `--global` / `-g` or `--local` / `-l`. Without a TTY, the CLI defaults to `claude --global` if neither is set.

### Option 4 — Claude Code Marketplace

For Claude Code users, **Claude Code Marketplace** is the preferred single-source install. Use the CLI for Claude only when you need cross-runtime installs, scripted/offline file copies, or non-Marketplace environments.

If Marketplace is already installed, the CLI will not install or update a second Claude copy, even with `--force`; update through Claude Code Marketplace instead. If a CLI-managed Claude install already exists in the other scope, interactive terminals ask whether to keep that source updated or uninstall it before switching. Non-interactive terminals stop and print the exact `update`, `uninstall`, and `install` commands to run.

Full Claude-specific steps are in [docs/runtimes/claude.md](docs/runtimes/claude.md) · [简体中文](docs/runtimes/claude.zh-CN.md).

---

## Quick start

Once installed, you have a full frontend engineering toolkit available in every AI session:

```text
You: "Review my recent changes"
→ The fec-code-reviewer agent is dispatched, produces reports/code-review-*.md

You: "/fec-review"
→ Runs a structured review across architecture, types, rendering, styles, a11y

You: "Implement the checkout page from this Figma link"
→ The fec-figma-implementer agent reads the design via MCP, emits components and a report

You: "/fec-scaffold dashboard feature"
→ Creates a page / feature / component directory tree following project conventions

You: "/fec-refactor-clean"
→ Classifies and safely removes dead code, unused exports, styles, and deps
```

All slash commands below are shown for **Claude Code**; other runtimes expose the same capabilities through their own command systems (see [`docs/runtimes/`](docs/runtimes/)).

---

## Example prompts

For a complete scenario-based prompt library, see [docs/example-prompts.md](docs/example-prompts.md).

```text
You: "Review my recent changes before merge. Focus on architecture, type safety, rendering behavior, styles, accessibility, and missing tests."
You: "Before coding, plan the account billing feature: route structure, component boundaries, data flow, state ownership, validation flow, and rollout risks."
You: "Build a multi-step registration form with React Hook Form + Zod, file upload, conditional fields, async validation, and accessible errors."
You: "Implement the UI from Figma node 123:456. Use existing design tokens and components, match spacing and responsive states, and document assumptions."
You: "`/fec-refactor-clean` Clean up dead code in this module."
```

---

## What’s inside

### Commands

Slash commands are the primary entry points for structured workflows. Most produce a timestamped Markdown report under `reports/`.

| Command               | Purpose                                                                | Report                                           |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| `/fec-init`           | Initialize project templates (CLAUDE.md, rules, settings)              | —                                                |
| `/fec-review`         | Structured review of specified or recently changed files               | `code-review-*.md`                               |
| `/fec-scaffold`       | Create page / feature / component boilerplate by convention            | —                                                |
| `/fec-plan`           | Unified planning: implementation architecture or test strategy         | `architecture-proposal-*.md` or `test-plan-*.md` |
| `/fec-tdd`            | Red → green → refactor loop for frontend TDD                           | —                                                |
| `/fec-debug`          | Diagnose and fix frontend issues: build, runtime, UI, and API failures | `debug-*.md`                                     |
| `/fec-refactor-clean` | Classify and safely remove dead code, unused exports, styles, and deps | `refactor-clean-*.md`                            |
| `/fec-doc-sync`       | Sync READMEs, runtime docs, capability tables, and metadata            | —                                                |

### Skills (auto-activated)

Skills are workflow definitions that activate automatically based on file patterns, frameworks, or task context. They encode review dimensions, output conventions, and report formats.

The skills below are grouped by use case so you can quickly find project standards, implementation, testing, review, design, migration, and documentation workflows.

**Project standards** — conventions enforced whenever matching frameworks are detected:

| Skill                           | Scope                                                                 |
| ------------------------------- | --------------------------------------------------------------------- |
| `fec-react-project-standard`    | React + TypeScript (structure, components, routing, state, API layer) |
| `fec-vue3-project-standard`     | Vue 3 + TypeScript (structure, components, routing, Pinia, API layer) |
| `fec-nextjs-project-standard`   | Next.js 14+ App Router, SSR/SSG, streaming, metadata                  |
| `fec-nuxt-project-standard`     | Nuxt 3 SSR/SSG, composables, data fetching, middleware                |
| `fec-vite-project-standard`     | Vite config, env safety, HMR, dev proxy, build optimization           |
| `fec-monorepo-project-standard` | pnpm workspace, Turborepo, Nx structure and task orchestration        |

**Implementation capabilities** — activated when building specific frontend behavior:

| Skill                     | Scope                                                                     |
| ------------------------- | ------------------------------------------------------------------------- |
| `fec-data-fetching`       | TanStack Query / server-state fetching, caching, optimistic updates       |
| `fec-api-integration`     | Typed API clients, auth refresh, uploads, realtime integration            |
| `fec-state-management`    | State ownership, store selection, URL state, server/form/local boundaries |
| `fec-form-handling`       | React Hook Form + Zod, dynamic fields, uploads, multi-step flows          |
| `fec-browser-storage`     | localStorage / sessionStorage / IndexedDB / Cookies selection             |
| `fec-route-protection`    | Auth and permission routes for React Router, Next.js, Vue Router, Nuxt    |
| `fec-pwa-implementation`  | Manifest, service worker, offline cache, install prompts                  |
| `fec-web-workers`         | Web Worker integration, transferables, Comlink, worker pools              |
| `fec-canvas-threejs`      | Canvas 2D, Three.js, React Three Fiber, WebGL                             |
| `fec-svg-animation`       | CSS / Framer Motion / GSAP SVG animation with reduced-motion              |
| `fec-list-virtualization` | react-window / TanStack Virtual with measurement strategies               |

**Testing** — activated when planning or authoring frontend test coverage:

| Skill                   | Scope                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| `fec-testing-strategy`  | Layer selection across static, unit, component, integration, E2E, visual |
| `fec-component-testing` | React Testing Library / Vue Test Utils with regression scenarios         |
| `fec-e2e-testing`       | Playwright / Cypress E2E with Page Object and CI integration             |
| `fec-tdd-workflow`      | Test-first frontend implementation with red-green-refactor               |

**Review & quality** — activated during review, validation, or cleanup workflows:

| Skill                          | Scope                                                                         |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `fec-code-review`              | Architecture, types, rendering, styles, a11y review                           |
| `fec-typescript-type-safety`   | Type contracts, DTO mapping, type guards, generics, type-level checks         |
| `fec-security-review`          | XSS, CSRF, sensitive data leakage, input validation                           |
| `fec-accessibility-check`      | WCAG 2.2, keyboard, focus, touch, and screen-reader behavior                  |
| `fec-dependency-upgrade`       | Dependency upgrades, lockfile review, CVE remediation, migration verification |
| `fec-validation-fix`           | Run and repair lint, type-check, test, build in one pass                      |
| `fec-performance-optimization` | Core Web Vitals, bundle, rendering, memory, network, and budget reviews       |
| `fec-refactor-clean`           | Safe dead-code, unused export, style, route, dependency cleanup               |

**Design UI** — activated for design-to-code, design systems, and visual polish:

| Skill                         | Scope                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------- |
| `fec-ui-design`               | UI direction, visual identity, polish, states, visual QA                      |
| `fec-tailwind-design-system`  | Tailwind tokens, theme extension, variants, class governance, dark mode       |
| `fec-responsive-layout`       | Mobile-first layouts, container queries, data-dense responsive UI             |
| `fec-motion-interaction`      | Interaction motion, page transitions, scroll animation, reduced motion        |
| `fec-implement-from-design`   | Build UI from Figma/Sketch/MasterGo/Pixso/墨刀 design files, or 摹客 assets   |
| `fec-storybook-component-doc` | Storybook component docs, design-system presentation, isolated state previews |

**Legacy migration** — activated during modernization work:

| Skill                            | Scope                                                      |
| -------------------------------- | ---------------------------------------------------------- |
| `fec-legacy-web-standard`        | Standards for JS + jQuery + HTML maintenance               |
| `fec-legacy-to-modern-migration` | jQuery/MPA → React/Vue 3 + TS strategy and phased workflow |

**Maintenance docs** — activated during documentation upkeep:

| Skill                           | Scope                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `fec-alchemy`                   | Absorb reference system ideas through original, project-native redesign                 |
| `fec-doc-sync`                  | Keep public docs in sync with scripts, skills, agents, commands                        |
| `fec-source-driven-development` | Verify version-sensitive frontend decisions against project facts and official sources |

### Agents

Agents are specialized sub-agents dispatched by the main assistant to handle a focused task. Each returns a structured report.

| Agent                       | Focus                                                                      | Report                       |
| --------------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| `fec-code-reviewer`         | React/Vue/Next/Nuxt, TS, styles, client-side security (confidence-based)   | `code-review-*.md`           |
| `fec-typescript-reviewer`   | Type safety, async correctness, idiomatic patterns (report-only)           | `typescript-review-*.md`     |
| `fec-security-reviewer`     | XSS, client secrets, dangerous DOM/APIs, CSP, dependency audit             | `security-review-*.md`       |
| `fec-performance-optimizer` | Bundle size, render performance, network bottlenecks                       | `performance-review-*.md`    |
| `fec-architect`             | Page splitting, component architecture, state flow, directory planning     | `architecture-proposal-*.md` |
| `fec-test-planner`          | Risk-to-layer matrix: static, unit, component, E2E, visual, a11y, security | `test-plan-*.md`             |
| `fec-debugger`              | Complex frontend diagnostics for build, runtime, UI, and API failures      | `debug-*.md`                 |
| `fec-refactor-cleaner`      | Classify and safely remove unused code, exports, styles, routes, deps      | `refactor-clean-*.md`        |
| `fec-e2e-runner`            | E2E authoring and runs (Playwright/Cypress), flaky quarantine, traces      | `e2e-summary-*.md`           |
| `fec-doc-updater`           | Sync README, runtime docs, structure, capability tables, metadata          | —                            |
| `fec-ui-checker`            | Visual issue debugging and design fidelity evaluation                      | `ui-fidelity-review-*.md`    |
| `fec-figma-implementer`     | Precise UI implementation from Figma/Sketch/MasterGo/Pixso/墨刀 designs    | `design-implementation-*.md` |
| `fec-design-token-mapper`   | Map design variables to project Design Tokens                              | `token-mapping-*.md`         |

### Hooks (event-driven)

Hooks run automatically on AI assistant events — no invocation needed.

| Event                     | Behavior                                                       |
| ------------------------- | -------------------------------------------------------------- |
| `SessionStart`            | Clean Claude cache, then detect project framework and package manager |
| `PreToolUse(Bash)`        | Block dangerous commands (`rm -rf`, force push, etc.)          |
| `PostToolUse(Write/Edit)` | Auto-format modified files with Prettier                       |
| `Stop`                    | Run lint, type-check, test, and build on session end           |
| `Notification`            | Cross-platform desktop notifications (macOS / Linux / Windows) |

### MCP integration

Plug your AI assistant into design tools for design-to-code workflows with richer design context.

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
<summary>Click to see all 20 template files</summary>

| File                                     | Purpose                                                               |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `CLAUDE.md`                              | Project description, commands, working principles, security           |
| `settings.json`                          | Permission whitelist/blacklist, environment variables                 |
| `rules/fec-vue.md`                       | Vue 3 component standards and anti-patterns                           |
| `rules/fec-react.md`                     | React component standards and anti-patterns                           |
| `rules/fec-design-system.md`             | Design system, tokens, accessibility                                  |
| `rules/fec-testing.md`                   | Testing and validation rules                                          |
| `rules/fec-git-conventions.md`           | Conventional Commits                                                  |
| `rules/fec-i18n.md`                      | Internationalization copy standards                                   |
| `rules/fec-performance.md`               | Frontend performance rules                                            |
| `rules/fec-rendering-patterns.md`        | Rendering lifecycle, hydration, SSR/CSR, and update patterns          |
| `rules/fec-responsive-design.md`         | Responsive layout, breakpoints, touch targets, and viewport behavior  |
| `rules/fec-source-driven-development.md` | Source-driven decisions, official docs, version-sensitive assumptions |
| `rules/fec-api-layer.md`                 | API layer typing and error handling                                   |
| `rules/fec-state-management.md`          | State classification, strategy, anti-patterns                         |
| `rules/fec-error-handling.md`            | Error layering, Error Boundary, fallback UI, reporting                |
| `rules/fec-naming-conventions.md`        | Unified naming for files, components, variables, routes, API, CSS     |
| `rules/fec-code-comments.md`             | When and how to write frontend comments                               |
| `rules/fec-ci-cd.md`                     | CI/CD pipeline stages, GitHub Actions / GitLab CI, secrets            |
| `rules/fec-refactoring.md`               | Refactoring constraints and feature-parity requirements               |
| `rules/fec-agent-workflow.md`            | Agent collaboration boundaries and delegation                         |
| `rules/fec-working-modes.md`             | Research, planning, development, review, finishing modes              |

</details>

---

## Configuration

### Prerequisites

- **Node.js 22+**
- **npm, pnpm, or yarn**
- **Git Bash or a compatible shell** (Windows only, when your AI runtime invokes shell-based commands)

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

| Report type            | Filename pattern                             | Produced by                                                         |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| Code review            | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review`, `fec-code-review`, `fec-code-reviewer`               |
| TypeScript / JS review | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `fec-typescript-reviewer`                                           |
| Security review        | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review`, `fec-security-reviewer`                      |
| Accessibility          | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check`                                           |
| Performance            | `performance-review-YYYY-MM-DD-HHmmss.md`    | `fec-performance-optimizer`                                         |
| Architecture           | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `fec-architect`                                                     |
| Design fidelity        | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `fec-ui-checker`                                                    |
| Design implementation  | `design-implementation-YYYY-MM-DD-HHmmss.md` | `fec-figma-implementer`                                             |
| Token mapping          | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `fec-design-token-mapper`                                           |
| Design plan            | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design`                                         |
| Test plan              | `test-plan-YYYY-MM-DD-HHmmss.md`             | `/fec-plan`, `fec-testing-strategy`, `fec-test-planner`             |
| Validation fix         | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix`                                                |
| Refactor clean         | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`, `fec-refactor-clean`, `fec-refactor-cleaner` |
| E2E run summary        | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `fec-e2e-runner` (optional)                                         |
| Migration plan         | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                    |

</details>

> **Tip:** add `reports/` to `.gitignore` to keep the auto-generated reports out of version control — or commit them to preserve a team review history.

---

## Update and Remove

`fec` is the short command for `frontend-craft`. If you have not installed the global `fec` command, use the same arguments with `npx @bovinphang/frontend-craft@latest`, for example `npx @bovinphang/frontend-craft@latest update`.

### Update

```bash
fec update                         # Update all discovered CLI-managed installs
fec update <runtime> --local        # Update one local CLI-managed install
fec update <runtime> --global       # Update one global CLI-managed install
fec upgrade <runtime> --global      # `upgrade` is an alias for `update`
```

### Remove

```bash
fec uninstall                       # Remove all discovered CLI-managed installs
fec remove                          # `remove` is an alias for `uninstall`
fec uninstall <runtime>             # Remove a specific runtime install
fec remove <runtime>                # Same removal through the alias
fec uninstall --global              # Remove discovered global installs only
fec remove --local                  # Remove discovered local installs only
fec uninstall <runtime> --dry-run   # Preview removals
fec uninstall <runtime> --force     # Remove modified managed files too
```

The CLI writes `frontend-craft.manifest.json` into the runtime directory. `update` discovers those manifests automatically when no runtime is provided and **skips files you’ve modified locally**, so customizations survive updates.

`uninstall`/`remove` only deletes files recorded in the manifest. It skips modified files by default; add `--force` only when you want to remove modified managed files too. `--force` does not override a Claude Code Marketplace install.

For **Claude Code Marketplace** or **submodule** installs, see [docs/runtimes/claude.md](docs/runtimes/claude.md) · [简体中文](docs/runtimes/claude.zh-CN.md). `/fec-init` only initializes project config; it is not a second plugin install.

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
| `npx @bovinphang/frontend-craft` | Skills + runtime-specific agents, commands, hooks, rules, templates |
| `npx skills`         | Skills only (for existing Skills CLI workflows)                     |

To disable telemetry: `DISABLE_TELEMETRY=1`. Details: [skills.sh CLI docs](https://skills.sh/docs/cli).

---

## Community

- [Contributing Guide](CONTRIBUTING.md) — development setup, PR checklist, localization policy ([简体中文](CONTRIBUTING.zh-CN.md))
- [Security Policy](SECURITY.md) — private vulnerability reporting ([简体中文](SECURITY.zh-CN.md))
- [Code of Conduct](CODE_OF_CONDUCT.md) — community standards ([简体中文](CODE_OF_CONDUCT.zh-CN.md))
- [Changelog](CHANGELOG.md) — release notes ([简体中文](CHANGELOG.zh-CN.md))
- [Project structure](docs/project-structure.md) — full directory layout and file responsibilities ([简体中文](docs/zh-CN/project-structure.md))

---

## License

[MIT](LICENSE) — use freely, modify as needed, contribute back if you can.

---

<div align="center">

**If frontend-craft helps your team ship better code, [give it a Star](https://github.com/bovinphang/frontend-craft).**

</div>
