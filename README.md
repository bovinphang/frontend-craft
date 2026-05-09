# frontend-craft

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
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

**A shared Claude Code plugin for enterprise frontend teams.**

Integrates code review, security review, design-to-code (Figma/Sketch/MasterGo/Pixso/墨刀/摹客), accessibility checks, automated quality assurance, and project templates. All review, analysis, and evaluation reports are automatically saved as Markdown files to the project `reports/` directory for archiving, traceability, and team sharing.

---

## 🚀 Quick Start

Get started in 2 minutes:

### Step 1: Install the plugin

```bash
# Add marketplace
/plugin marketplace add bovinphang/frontend-craft

# Install plugin
/plugin install frontend-craft@bovinphang-frontend-craft

# Activate
/reload-plugins
```

### Step 2: Initialize project config (recommended)

```bash
# Copy project templates to .claude/ directory
/frontend-craft:init
```

After initialization, customize for your project:

1. `.claude/CLAUDE.md` — Update project info, package manager, common commands
2. `.claude/rules/` — Remove inapplicable rules (e.g. delete `vue.md` for React-only projects, delete `i18n.md` if i18n is not needed)
3. `.claude/settings.json` — Adjust permission whitelist

> **Why this step?** The plugin provides reusable Skills, Agents, and Hooks. CLAUDE.md and rules are project-level config and must live under the project root `.claude/` for Claude Code to recognize them. The `/init` command helps you set this up quickly.

### Step 3: Start using

```bash
# Code review (outputs to reports/code-review-*.md)
/frontend-craft:review

# Create page/feature/component by convention
/frontend-craft:scaffold page UserDetail
/frontend-craft:scaffold component DataTable

# List available commands
/plugin list frontend-craft@bovinphang-frontend-craft
```

✨ **Done!** You now have access to 9 agents, 14 skills, and 3 commands.

---

## 🌐 Cross-platform support

This plugin fully supports **Windows, macOS, and Linux**. All hooks and scripts are implemented in Node.js for cross-platform compatibility.

---

## Single-repo multi-target build

To support **Claude Code, OpenCode, Gemini CLI, Kilo, Codex, Copilot, Cursor, Windsurf, Antigravity, Augment, Trae, CodeBuddy, Cline, and OpenClaw** from one repository, this repo now includes a target manifest and build script:

- `targets.manifest.json` — enabled targets and output directories
- `scripts/build-targets.mjs` — generates per-target artifacts into `dist/`

Build all enabled targets:

```bash
node scripts/build-targets.mjs
```

Build only one target (example: codex):

```bash
node scripts/build-targets.mjs --target codex
```

## Multi-agent skills (Skills CLI)

If your team uses **Claude Code**, **OpenAI Codex**, **Cursor**, **OpenCode**, **Gemini CLI**, **OpenClaw**, **Continue**, **CodeBuddy**, **Trae**, **Kimi Code CLI**, or other AI coding agents, you can install the **workflow skills** from this repo into each tool’s skills directory using the [Skills CLI](https://skills.sh/docs/cli) (`npx skills`). The CLI supports dozens of agents; the exact list appears in interactive prompts or in the upstream documentation.

**Skills CLI vs. full plugin**

- **Skills CLI** — Installs the skill packages under [`skills/`](skills/) into the directories your chosen agents expect. Use this when you want the same review and frontend standards across multiple tools.
- **Full Claude Code plugin** — Still use [Installation](#installation) (`/plugin marketplace add`, etc.) to get **Agents**, **Slash commands**, **Hooks**, and **project templates** (`templates/`), not only skills.

**Requirements:** Node.js ≥ 18 (same as above).

**Install skills**

```bash
npx skills add bovinphang/frontend-craft
```

Follow the prompts for project vs. global install (`-g`), symlink vs. copy (`--copy`), and which agents to enable. To list skills in the repo without installing, run `npx skills add bovinphang/frontend-craft -l`. For specific skills or agents, use `--skill` / `--agent` (see `npx skills --help`).

**Update skills**

From the project where skills were installed (or after a global install, use the matching scope):

```bash
npx skills update
```

This updates all installed skills to their latest versions. You can run `npx skills check` first to see what would change.

**Telemetry:** The CLI may collect anonymous telemetry by default. To disable it, set `DISABLE_TELEMETRY=1`. Details: [skills.sh CLI docs](https://skills.sh/docs/cli).

---

## 📦 What's inside

This repository is a **Claude Code plugin** that can be installed directly or loaded locally via `--plugin-dir`.

```
frontend-craft/
|-- .claude-plugin/   # Plugin and marketplace manifests
|   |-- plugin.json         # Plugin metadata
|   |-- marketplace.json    # Marketplace directory for /plugin marketplace add
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
|   |-- init.md        # /init - Initialize project templates
|   |-- review.md      # /review - Code review
|   |-- scaffold.md    # /scaffold - Create page/feature/component
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
|-- templates/        # Project config templates (copied via /init)
|   |-- CLAUDE.md
|   |-- settings.json
|   |-- rules/         # vue, react, design-system, testing, etc.
|
|-- .mcp.json         # MCP server config (Figma, Sketch, MasterGo, Pixso, 墨刀)
└-- README.md
```

---

## 📥 Installation

> **Requirements:** Claude Code v1.0.33+, Node.js >= 18, npm/pnpm/yarn.

### Option 1: Install as plugin (recommended)

```bash
# Add marketplace
/plugin marketplace add bovinphang/frontend-craft

# Install plugin
/plugin install frontend-craft@bovinphang-frontend-craft
```

Or add to `~/.claude/settings.json` or project `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "frontend-craft": {
      "source": {
        "source": "github",
        "repo": "bovinphang/frontend-craft"
      }
    }
  }
}
```

### Option 2: Team project-level auto-install

Add the `extraKnownMarketplaces` config above to `.claude/settings.json` in the project root. Team members will be prompted to install when they trust the project directory.

### Option 3: Local development / testing

Clone the repo and load via `--plugin-dir` (no install, suitable for development and debugging):

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### Option 4: Git Submodule (project-level sharing)

```bash
# Add as submodule in project root
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft

git add .gitmodules .claude/plugins/frontend-craft
git commit -m "feat: add frontend-craft as shared Claude Code plugin"
```

After cloning, team members run:

```bash
git submodule update --init --recursive
```

Then load with `--plugin-dir`:

```bash
claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 Feature overview

### Commands

| Command | Purpose | Report output |
|---------|---------|----------------|
| `/frontend-craft:init` | Initialize project templates to `.claude/` | — |
| `/frontend-craft:review` | Code review for specified or recently changed files, output graded report | `code-review-*.md` |
| `/frontend-craft:scaffold` | Create page / feature / component structure and boilerplate by convention | — |

### Skills (auto-activated)

| Skill | Purpose | Report output |
|-------|---------|----------------|
| `frontend-code-review` | Review code on architecture, types, rendering, styles, a11y | `code-review-*.md` |
| `security-review` | Security review: XSS, CSRF, sensitive data leakage, input validation | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA accessibility check | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript project standards (structure, components, routing, state, API layer) | — |
| `vue3-project-standard` | Vue 3 + TypeScript project standards (structure, components, routing, Pinia, API layer) | — |
| `implement-from-design` | Implement UI from Figma/Sketch/MasterGo/Pixso/墨刀/摹客 design files | `design-plan-*.md` |
| `test-and-fix` | Run lint, type-check, test, build and fix failures | `test-fix-*.md` |
| `legacy-web-standard` | Development and maintenance standards for JS + jQuery + HTML legacy projects | — |
| `legacy-to-modern-migration` | Strategy, concept mapping, and phased workflow for jQuery/MPA → React/Vue 3 + TS | `migration-plan-*.md` |
| `e2e-testing` | Playwright/Cypress E2E standards: directory structure, Page Object, CI integration | — |
| `nextjs-project-standard` | Next.js 14+ App Router, SSR/SSG, streaming, metadata, middleware standards | — |
| `nuxt-project-standard` | Nuxt 3 SSR/SSG, composables, data fetching, routing, middleware standards | — |
| `monorepo-project-standard` | pnpm workspace, Turborepo, Nx: structure, deps, task orchestration | — |

### Agents

| Agent | Purpose | Report output |
|-------|---------|----------------|
| `frontend-architect` | Page splitting, component architecture, state flow design, directory planning, large refactors | `architecture-proposal-*.md` |
| `frontend-code-reviewer` | Frontend code review: React/Vue/Next/Nuxt, TS, styles, client-side security, confidence-based findings | `code-review-*.md` |
| `frontend-security-reviewer` | Frontend security: XSS, client secrets, dangerous DOM/APIs, third-party scripts, CSP, dependency audit | `security-review-*.md` |
| `frontend-e2e-runner` | E2E authoring & runs (Playwright/Cypress), flaky quarantine, traces/screenshots/videos, CI alignment; optional `e2e-summary-*.md` | `e2e-summary-*.md` (optional) |
| `typescript-reviewer` | TS/JS review: run typecheck/eslint, PR merge readiness, type safety, async, security, idiomatic patterns; report-only | `typescript-review-*.md` |
| `performance-optimizer` | Analyze performance bottlenecks (bundle size, render performance, network), output quantified optimization plan | `performance-review-*.md` |
| `ui-checker` | UI visual issue debugging, design fidelity evaluation | `ui-fidelity-review-*.md` |
| `figma-implementer` | Precise UI implementation from Figma/Sketch/MasterGo/Pixso/墨刀/摹客 design files | `design-implementation-*.md` |
| `design-token-mapper` | Map design variables to project Design Tokens | `token-mapping-*.md` |

### Hooks (auto-executed)

| Event | Behavior |
|-------|----------|
| `SessionStart` | Detect project framework and package manager |
| `PreToolUse(Bash)` | Block dangerous commands (rm -rf, force push, etc.) |
| `PostToolUse(Write/Edit)` | Auto Prettier on modified files |
| `Stop` | Run lint, type-check, test, build on session end |
| `Notification` | Cross-platform desktop notifications (macOS / Linux / Windows) |

### MCP integration

| Service | Purpose |
|---------|---------|
| Figma | Read design context, variable definitions |
| Figma Desktop | Figma desktop integration |
| Sketch | Read design selection screenshots |
| MasterGo | Read DSL structure data, component hierarchy and styles |
| Pixso | Local MCP for frame data, code snippets, image assets |
| 墨刀 | Get prototype data, generate design descriptions, import HTML |
| 摹客 | No MCP; supported via user screenshots/annotations/exported CSS |

### Project templates (initialized via `/init`)

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project description, common commands, working principles, security requirements |
| `settings.json` | Permission whitelist/blacklist, environment variables |
| `rules/vue.md` | Vue 3 component standards and anti-patterns |
| `rules/react.md` | React component standards and anti-patterns |
| `rules/design-system.md` | Design system, Token, accessibility rules |
| `rules/testing.md` | Testing and validation rules |
| `rules/git-conventions.md` | Conventional Commits convention |
| `rules/i18n.md` | Internationalization copy standards |
| `rules/performance.md` | Frontend performance optimization rules |
| `rules/api-layer.md` | API layer typing, error handling standards |
| `rules/state-management.md` | State classification, management strategy, anti-patterns |
| `rules/error-handling.md` | Error layering, Error Boundary, fallback UI, reporting standards |
| `rules/naming-conventions.md` | Unified naming for files, components, variables, routes, API, CSS |
| `rules/code-comments.md` | When and how to write frontend code comments (why, not what) |
| `rules/ci-cd.md` | CI/CD pipeline stages, GitHub Actions / GitLab CI examples, secrets handling |
| `rules/refactoring.md` | Refactoring constraints: images, styles, no inline SVG/styles, flex layout, feature parity |

---

## ⚙️ Configuration

### Prerequisites

- Node.js >= 18
- npm, pnpm, or yarn
- Git Bash (required on Windows for hook script execution)

### MCP server

Before using design-related features, set the corresponding environment variables for your design tools:

| Variable | Tool | How to get |
|----------|------|------------|
| `FIGMA_API_KEY` | Figma / Figma Desktop | Figma account settings > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch developer settings |
| `MG_MCP_TOKEN` | MasterGo | MasterGo account settings > Security > Generate Token |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI feature page for access token |

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

| Report type | Filename pattern | Source |
|-------------|------------------|--------|
| Code review | `code-review-YYYY-MM-DD-HHmmss.md` | `/review` command, `frontend-code-review` skill, `frontend-code-reviewer` agent |
| TypeScript / JS review | `typescript-review-YYYY-MM-DD-HHmmss.md` | `typescript-reviewer` agent |
| Security review | `security-review-YYYY-MM-DD-HHmmss.md` | `security-review` skill, `frontend-security-reviewer` agent |
| Accessibility | `accessibility-review-YYYY-MM-DD-HHmmss.md` | `accessibility-check` skill |
| Performance | `performance-review-YYYY-MM-DD-HHmmss.md` | `performance-optimizer` agent |
| Architecture | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` agent |
| Design fidelity | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md` | `ui-checker` agent |
| Design implementation | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` agent |
| Token mapping | `token-mapping-YYYY-MM-DD-HHmmss.md` | `design-token-mapper` agent |
| Design plan | `design-plan-YYYY-MM-DD-HHmmss.md` | `implement-from-design` skill |
| Test fix | `test-fix-YYYY-MM-DD-HHmmss.md` | `test-and-fix` skill |
| E2E run summary | `e2e-summary-YYYY-MM-DD-HHmmss.md` | `frontend-e2e-runner` agent (optional) |
| Migration plan | `migration-plan-YYYY-MM-DD-HHmmss.md` | `legacy-to-modern-migration` skill |

> **Tip:** Add `reports/` to `.gitignore` to avoid committing auto-generated reports, or keep them committed for team history.

---

## 📥 Update

For Marketplace installs, run in Claude Code:

```
/plugin marketplace update bovinphang-frontend-craft
```

Or enable auto-update so Claude Code pulls the latest on each start:

1. Run `/plugin` in Claude Code to open the plugin manager
2. Switch to the **Marketplaces** tab
3. Select `bovinphang-frontend-craft`
4. Choose **Enable auto-update**

> Third-party Marketplaces do not enable auto-update by default. After enabling, Claude Code will refresh Marketplace data and update installed plugins on each start.

For Git submodule installs:

```bash
git submodule update --remote .claude/plugins/frontend-craft
```

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
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/security-check.mjs\""
}
```

---

## 📄 License

MIT — Use freely, modify as needed, contribute back if you can.

---

**If this repo helps you, give it a Star. Build something great.**
