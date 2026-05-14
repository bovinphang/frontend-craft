# frontend-craft

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vue](https://img.shields.io/badge/-Vue-4FC08D?logo=vue.js&logoColor=white)
![Figma](https://img.shields.io/badge/-Figma-F24E1E?logo=figma&logoColor=white)
![Node](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)

---

<div align="center">

**🌐 Language / 语言 / 語言 / 言語 / 언어**

[**English**](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](docs/zh-TW/README.md) | [日本語](docs/ja-JP/README.md) | [한국어](docs/ko-KR/README.md)

</div>

---

**A universal frontend plugin for Claude Code, Codex, Cursor, OpenCode, Gemini CLI, Windsurf, Copilot, OpenClaw, and more.**

`frontend-craft` packages frontend review agents, workflow skills, slash commands, hooks, MCP templates, and project rules into one repo. Use the CLI to install the same frontend standards into 14 supported AI coding runtimes. If you install only through **Claude Code Marketplace** (native plugin flow), see [docs/runtimes/claude.md](docs/runtimes/claude.md) · [简体中文](docs/runtimes/claude.zh-CN.md).

---

## Community and Governance

- [Contributing Guide](CONTRIBUTING.md) - development setup, PR checklist, and localization policy.
- [Security Policy](SECURITY.md) - private vulnerability reporting and supported scope.
- [Code of Conduct](CODE_OF_CONDUCT.md) - community standards for participation.
- **Simplified Chinese:** [Contributing](CONTRIBUTING.zh-CN.md) · [Security](SECURITY.zh-CN.md) · [Code of Conduct](CODE_OF_CONDUCT.zh-CN.md) · [Changelog](CHANGELOG.zh-CN.md)

---

## Universal Install (Recommended)

Requires **Node.js 22+**. The CLI writes files under each tool’s expected layout (see [`src/install/runtime-homes.mjs`](src/install/runtime-homes.mjs)).

**Interactive (terminal):** run `npx frontend-craft@latest` or `npx frontend-craft@latest install` with no runtime to pick runtimes and Global vs Local. If you pass `install <runtime>` but omit `--global` / `--local`, the CLI asks where to install (**TTY only**).

**Scripts / CI:** always pass **`--global` / `-g`** or **`--local` / `-l`**. When stdin is not a TTY and both are omitted, the CLI defaults to **global** **`claude`** and prints a short notice.

```bash
npx frontend-craft@latest list
npx frontend-craft@latest install --local claude
npx frontend-craft@latest install --global codex
npx frontend-craft@latest install cursor --local
npx frontend-craft@latest install --all --dry-run --global
```

Supported runtimes: `claude`, `codex`, `cursor`, `windsurf`, `opencode`, `kilo`, `gemini`, `copilot`, `antigravity`, `augment`, `trae`, `codebuddy`, `cline`, `openclaw`.

Per-runtime notes live in [`docs/runtimes/`](docs/runtimes/). The OpenClaw npm package can be packed from this repo with `npm run pack:openclaw`, which builds and verifies, then writes **`frontend-craft-openclaw-<version>.tgz`** to the **repository root** (for example `frontend-craft-openclaw-2.0.1.tgz`).

---

## Quick start

1. Run `npx frontend-craft@latest` (wizard) or `npx frontend-craft@latest install --local <runtime>` / `install --global <runtime>` for scripted installs.
2. Open the matching note under [`docs/runtimes/`](docs/runtimes/) for your tool (paths, caveats).
3. **Claude Code Marketplace only:** full marketplace install, `/fec-init`, and update steps are in [docs/runtimes/claude.md](docs/runtimes/claude.md) · [简体中文](docs/runtimes/claude.zh-CN.md).

---

## 🌐 Cross-platform support

This plugin fully supports **Windows, macOS, and Linux**. All hooks and scripts are implemented in Node.js for cross-platform compatibility.

---

## Legacy Skills CLI

The recommended multi-runtime path is now `npx frontend-craft@latest` (interactive wizard) or `npx frontend-craft@latest install [--local|--global] <runtime>` for scripted installs. If your team already uses the standalone [Skills CLI](https://skills.sh/docs/cli), it can still install only the workflow skill packages from [`skills/`](skills/).

### Skills CLI vs. frontend-craft CLI

- **`npx frontend-craft`** — Installs skills plus the runtime-specific agents, commands, hooks, rules, and templates supported by this repository. Prefer the interactive flow from **Universal Install** above, or pass `--local` / `--global` when stdin is not a TTY.
- **`npx skills`** — Installs only the skill packages, useful for existing Skills CLI workflows.

### Requirements

Node.js 22+ for `frontend-craft`; follow Skills CLI's own requirements when using `npx skills`.

### Install skills

```bash
npx skills add bovinphang/frontend-craft
```

Follow the prompts for project vs. global install (`-g`), symlink vs. copy (`--copy`), and which agents to enable. To list skills in the repo without installing, run `npx skills add bovinphang/frontend-craft -l`. For specific skills or agents, use `--skill` / `--agent` (see `npx skills --help`).

### Update skills

From the project where skills were installed (or after a global install, use the matching scope):

```bash
npx skills update
```

This updates all installed skills to their latest versions. You can run `npx skills check` first to see what would change.

**Telemetry:** The CLI may collect anonymous telemetry by default. To disable it, set `DISABLE_TELEMETRY=1`. Details: [skills.sh CLI docs](https://skills.sh/docs/cli).

---

## 📦 What's Inside

This repository is a **universal frontend plugin** with native layouts for multiple AI coding tools. Claude Code plugin metadata is included under `.claude-plugin/`.

```text
frontend-craft/
|-- .claude-plugin/   # Claude Code plugin + marketplace manifests
|   |-- plugin.json         # Plugin metadata
|   |-- marketplace.json    # Marketplace directory metadata
|
|-- agents/           # Specialized sub-agents for delegation
|   |-- frontend-architect.md    # Page splitting, component architecture, state flow
|   |-- frontend-code-reviewer.md # Frontend-focused code review (quality, security, a11y)
|   |-- frontend-security-reviewer.md # Frontend attack surface: XSS, secrets, CSP, deps
|   |-- frontend-e2e-runner.md     # E2E authoring, execution, flaky handling, artifacts, CI
|   |-- typescript-reviewer.md    # TS/JS type safety, async, security, report-only review
|   |-- performance-optimizer.md # Performance bottleneck analysis and optimization
|   |-- ui-checker.md            # UI visual issues, design fidelity evaluation
|   |-- figma-implementer.md     # Precise UI implementation from design
|   |-- design-token-mapper.md   # Map design variables to Design Tokens
|
|-- skills/           # Workflow definitions and domain knowledge
|   |-- frontend-code-review/    # Architecture, types, rendering, styles, a11y
|   |-- security-review/         # XSS, CSRF, sensitive data, input validation
|   |-- accessibility-check/     # WCAG 2.1 AA accessibility
|   |-- react-project-standard/  # React + TypeScript project standards
|   |-- vue3-project-standard/   # Vue 3 + TypeScript project standards
|   |-- implement-from-design/   # Implement UI from design files
|   |-- test-and-fix/            # lint, type-check, test, build and fix
|   |-- legacy-web-standard/     # JS + jQuery + HTML legacy project standards
|   |-- legacy-to-modern-migration/  # jQuery/MPA migration to React/Vue strategy and workflow
|   |-- e2e-testing/                # Playwright/Cypress E2E testing standards
|   |-- nextjs-project-standard/    # Next.js 14+ App Router, SSR/SSG standards
|   |-- nuxt-project-standard/      # Nuxt 3 SSR/SSG, composables standards
|   |-- monorepo-project-standard/  # pnpm workspace, Turborepo, Nx standards
|
|-- commands/         # Slash commands for quick execution
|   |-- fec-init.md     # /fec-init - Initialize project templates
|   |-- fec-review.md   # /fec-review - Code review
|   |-- fec-scaffold.md # /fec-scaffold - Create page/feature/component
|
|-- hooks/            # Event-driven automation
|   |-- hooks.json     # PreToolUse, PostToolUse, Stop, Notification, etc.
|
|-- scripts/          # Cross-platform Node.js scripts
|   |-- security-check.mjs      # Block dangerous commands
|   |-- format-changed-file.mjs # Auto Prettier formatting
|   |-- run-tests.mjs           # Run checks on session end
|   |-- session-start.mjs       # Detect framework on session start
|   |-- notify.mjs              # Cross-platform desktop notifications
|
|-- templates/        # Runtime-specific project templates
|   |-- claude/        # CLAUDE.md and settings.json
|   |-- codex/         # AGENTS.md and config.toml
|   |-- openclaw/      # AGENTS.md and OPENCLAW-CONFIG.md
|   |-- shared/rules/  # vue, react, design-system, testing, etc.
|
|-- .mcp.json         # MCP server config (Figma, Sketch, MasterGo, Pixso, 墨刀)
└-- README.md
```

---

## Feature overview

Slash commands in the tables below are shown **for Claude Code** as a familiar example; other runtimes receive the same capabilities via their installed commands and templates (see [`docs/runtimes/`](docs/runtimes/)).

### Commands

| Command                    | Purpose                                                                   | Report output      |
| -------------------------- | ------------------------------------------------------------------------- | ------------------ |
| `/fec-init`     | Initialize project templates to `.claude/`                                | —                  |
| `/fec-review`   | Code review for specified or recently changed files, output graded report | `code-review-*.md` |
| `/fec-scaffold` | Create page / feature / component structure and boilerplate by convention | —                  |

### Skills (auto-activated)

| Skill                        | Purpose                                                                                 | Report output               |
| ---------------------------- | --------------------------------------------------------------------------------------- | --------------------------- |
| `fec-frontend-code-review`       | Review code on architecture, types, rendering, styles, a11y                             | `code-review-*.md`          |
| `fec-security-review`            | Security review: XSS, CSRF, sensitive data leakage, input validation                    | `security-review-*.md`      |
| `fec-accessibility-check`        | WCAG 2.1 AA accessibility check                                                         | `accessibility-review-*.md` |
| `fec-react-project-standard`     | React + TypeScript project standards (structure, components, routing, state, API layer) | —                           |
| `fec-vue3-project-standard`      | Vue 3 + TypeScript project standards (structure, components, routing, Pinia, API layer) | —                           |
| `fec-implement-from-design`      | Implement UI from Figma/Sketch/MasterGo/Pixso/墨刀/摹客 design files                    | `design-plan-*.md`          |
| `fec-test-and-fix`               | Run lint, type-check, test, build and fix failures                                      | `test-fix-*.md`             |
| `fec-legacy-web-standard`        | Development and maintenance standards for JS + jQuery + HTML legacy projects            | —                           |
| `fec-legacy-to-modern-migration` | Strategy, concept mapping, and phased workflow for jQuery/MPA → React/Vue 3 + TS        | `migration-plan-*.md`       |
| `fec-e2e-testing`                | Playwright/Cypress E2E standards: directory structure, Page Object, CI integration      | —                           |
| `fec-nextjs-project-standard`    | Next.js 14+ App Router, SSR/SSG, streaming, metadata, middleware standards              | —                           |
| `fec-nuxt-project-standard`      | Nuxt 3 SSR/SSG, composables, data fetching, routing, middleware standards               | —                           |
| `fec-monorepo-project-standard`  | pnpm workspace, Turborepo, Nx: structure, deps, task orchestration                      | —                           |

### Agents

| Agent                        | Purpose                                                                                                                           | Report output                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `frontend-architect`         | Page splitting, component architecture, state flow design, directory planning, large refactors                                    | `architecture-proposal-*.md`  |
| `frontend-code-reviewer`     | Frontend code review: React/Vue/Next/Nuxt, TS, styles, client-side security, confidence-based findings                            | `code-review-*.md`            |
| `frontend-security-reviewer` | Frontend security: XSS, client secrets, dangerous DOM/APIs, third-party scripts, CSP, dependency audit                            | `security-review-*.md`        |
| `frontend-e2e-runner`        | E2E authoring & runs (Playwright/Cypress), flaky quarantine, traces/screenshots/videos, CI alignment; optional `e2e-summary-*.md` | `e2e-summary-*.md` (optional) |
| `typescript-reviewer`        | TS/JS review: run typecheck/eslint, PR merge readiness, type safety, async, security, idiomatic patterns; report-only             | `typescript-review-*.md`      |
| `performance-optimizer`      | Analyze performance bottlenecks (bundle size, render performance, network), output quantified optimization plan                   | `performance-review-*.md`     |
| `ui-checker`                 | UI visual issue debugging, design fidelity evaluation                                                                             | `ui-fidelity-review-*.md`     |
| `figma-implementer`          | Precise UI implementation from Figma/Sketch/MasterGo/Pixso/墨刀/摹客 design files                                                 | `design-implementation-*.md`  |
| `design-token-mapper`        | Map design variables to project Design Tokens                                                                                     | `token-mapping-*.md`          |

### Hooks (auto-executed)

| Event                     | Behavior                                                       |
| ------------------------- | -------------------------------------------------------------- |
| `SessionStart`            | Detect project framework and package manager                   |
| `PreToolUse(Bash)`        | Block dangerous commands (rm -rf, force push, etc.)            |
| `PostToolUse(Write/Edit)` | Auto Prettier on modified files                                |
| `Stop`                    | Run lint, type-check, test, build on session end               |
| `Notification`            | Cross-platform desktop notifications (macOS / Linux / Windows) |

### MCP integration

| Service       | Purpose                                                         |
| ------------- | --------------------------------------------------------------- |
| Figma         | Read design context, variable definitions                       |
| Figma Desktop | Figma desktop integration                                       |
| Sketch        | Read design selection screenshots                               |
| MasterGo      | Read DSL structure data, component hierarchy and styles         |
| Pixso         | Local MCP for frame data, code snippets, image assets           |
| 墨刀          | Get prototype data, generate design descriptions, import HTML   |
| 摹客          | No MCP; supported via user screenshots/annotations/exported CSS |

### Project templates (initialized via `/fec-init`)

| File                          | Purpose                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `CLAUDE.md`                   | Project description, common commands, working principles, security requirements            |
| `settings.json`               | Permission whitelist/blacklist, environment variables                                      |
| `rules/vue.md`                | Vue 3 component standards and anti-patterns                                                |
| `rules/react.md`              | React component standards and anti-patterns                                                |
| `rules/design-system.md`      | Design system, Token, accessibility rules                                                  |
| `rules/testing.md`            | Testing and validation rules                                                               |
| `rules/git-conventions.md`    | Conventional Commits convention                                                            |
| `rules/i18n.md`               | Internationalization copy standards                                                        |
| `rules/performance.md`        | Frontend performance optimization rules                                                    |
| `rules/api-layer.md`          | API layer typing, error handling standards                                                 |
| `rules/state-management.md`   | State classification, management strategy, anti-patterns                                   |
| `rules/error-handling.md`     | Error layering, Error Boundary, fallback UI, reporting standards                           |
| `rules/naming-conventions.md` | Unified naming for files, components, variables, routes, API, CSS                          |
| `rules/code-comments.md`      | When and how to write frontend code comments (why, not what)                               |
| `rules/ci-cd.md`              | CI/CD pipeline stages, GitHub Actions / GitLab CI examples, secrets handling               |
| `rules/refactoring.md`        | Refactoring constraints: images, styles, no inline SVG/styles, flex layout, feature parity |

---

## ⚙️ Configuration

### Prerequisites

- Node.js 22+
- npm, pnpm, or yarn
- Git Bash (required on Windows for hook script execution)

### MCP server

Before using design-related features, set the corresponding environment variables for your design tools:

| Variable         | Tool                  | How to get                                            |
| ---------------- | --------------------- | ----------------------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma account settings > Personal Access Tokens       |
| `SKETCH_API_KEY` | Sketch                | Sketch developer settings                             |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo account settings > Security > Generate Token |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI feature page for access token                 |

> Pixso uses local MCP; enable MCP in the Pixso client. No extra env vars needed.
> 摹客 has no MCP; works via user screenshots/annotations.

**macOS / Linux:**

```bash
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

**Windows (PowerShell):**

```powershell
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

Add these to your shell config (`~/.bashrc`, `~/.zshrc`) or Windows system environment variables.

---

## 📄 Report output

All review, analysis, and evaluation outputs are saved as Markdown files to the project `reports/` directory.

| Report type            | Filename pattern                             | Source                                                                          |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------------------- |
| Code review            | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review` command, `fec-frontend-code-review` skill, `frontend-code-reviewer` agent |
| TypeScript / JS review | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `typescript-reviewer` agent                                                     |
| Security review        | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review` skill, `frontend-security-reviewer` agent                     |
| Accessibility          | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check` skill                                                     |
| Performance            | `performance-review-YYYY-MM-DD-HHmmss.md`    | `performance-optimizer` agent                                                   |
| Architecture           | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` agent                                                      |
| Design fidelity        | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `ui-checker` agent                                                              |
| Design implementation  | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` agent                                                       |
| Token mapping          | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `design-token-mapper` agent                                                     |
| Design plan            | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design` skill                                                   |
| Test fix               | `test-fix-YYYY-MM-DD-HHmmss.md`              | `fec-test-and-fix` skill                                                            |
| E2E run summary        | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `frontend-e2e-runner` agent (optional)                                          |
| Migration plan         | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration` skill                                              |

> **Tip:** Add `reports/` to `.gitignore` to avoid committing auto-generated reports, or keep them committed for team history.

---

## Staying up to date

- **CLI installs:** Re-run `npx frontend-craft@latest install` with the same `--local` / `--global` flags and runtime(s), and read [CHANGELOG.md](CHANGELOG.md) for release notes.
- **Claude Code Marketplace or submodule installs:** See **Updating** in [docs/runtimes/claude.md](docs/runtimes/claude.md) · [简体中文](docs/runtimes/claude.zh-CN.md).

---

## 🎯 Key concepts

### Agents

Sub-agents handle delegated tasks within a limited scope. Example:

```markdown
---
name: performance-optimizer
description: Analyze frontend performance bottlenecks and provide optimization plan
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
---

You are a senior engineer focused on frontend performance analysis and optimization...
```

### Skills

Skills are workflow definitions invoked by commands or agents, including review dimensions, output format, and report file conventions:

```markdown
# Frontend code review

## Review dimensions

1. Architecture - Component boundaries, separation of concerns
2. Type safety - any usage, props types
   ...

## Report file output

- Directory: reports/
- Filename: code-review-YYYY-MM-DD-HHmmss.md
```

### Hooks

Hooks run on tool events. Example — block dangerous commands:

```json
{
  "event": "PreToolUse",
  "matcher": "tool == \"Bash\"",
  "command": "node \"${FRONTEND_CRAFT_ROOT}/scripts/security-check.mjs\""
}
```

---

## 📄 License

MIT — Use freely, modify as needed, contribute back if you can.

---

**If this repo helps you, give it a Star. Build something great.**
