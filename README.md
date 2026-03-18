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

[**English**](README.md) | [简体中文](README.zh-CN.md)| [繁體中文](docs/zh-TW/README.md) | [日本語](docs/ja-JP/README.md) | [한국어](docs/ko-KR/README.md)

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

After initialization, customize `.claude/CLAUDE.md`, `rules/`, and `settings.json` for your project.

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

✨ **Done!** You now have access to 5 agents, 8 skills, and 3 commands.

---

## 🌐 Cross-platform support

This plugin fully supports **Windows, macOS, and Linux**. All hooks and scripts are implemented in Node.js for cross-platform compatibility.

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
```

---

## 📥 Installation

> **Requirements:** Claude Code v1.0.33+, Node.js >= 18, npm/pnpm/yarn.

### Option 1: Install as plugin (recommended)

```bash
/plugin marketplace add bovinphang/frontend-craft
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

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### Option 4: Git Submodule (project-level sharing)

```bash
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft
# Team: git submodule update --init --recursive
# Load: claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 Feature overview

### Commands

| Command | Purpose | Report output |
|---------|---------|----------------|
| `/frontend-craft:init` | Initialize project templates to `.claude/` | — |
| `/frontend-craft:review` | Code review for specified or recently changed files | `code-review-*.md` |
| `/frontend-craft:scaffold` | Create page / feature / component structure | — |

### Skills (auto-activated)

| Skill | Purpose | Report output |
|-------|---------|----------------|
| `frontend-code-review` | Architecture, types, rendering, styles, a11y | `code-review-*.md` |
| `security-review` | XSS, CSRF, sensitive data, input validation | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA accessibility | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript project standards | — |
| `vue3-project-standard` | Vue 3 + TypeScript project standards | — |
| `implement-from-design` | Implement UI from design files | `design-plan-*.md` |
| `test-and-fix` | lint, type-check, test, build and fix | `test-fix-*.md` |
| `legacy-web-standard` | JS + jQuery + HTML legacy standards | — |

### Agents

| Agent | Purpose | Report output |
|-------|---------|----------------|
| `frontend-architect` | Page splitting, component architecture, state flow, refactoring | `architecture-proposal-*.md` |
| `performance-optimizer` | Performance analysis, optimization recommendations | `performance-review-*.md` |
| `ui-checker` | UI visual issues, design fidelity evaluation | `ui-fidelity-review-*.md` |
| `figma-implementer` | Precise UI implementation from design | `design-implementation-*.md` |
| `design-token-mapper` | Map design variables to Design Tokens | `token-mapping-*.md` |

### Hooks (auto-executed)

| Event | Behavior |
|-------|----------|
| `SessionStart` | Detect project framework and package manager |
| `PreToolUse(Bash)` | Block dangerous commands (rm -rf, force push, etc.) |
| `PostToolUse(Write/Edit)` | Auto Prettier on modified files |
| `Stop` | Run lint, type-check, test, build on session end |
| `Notification` | Cross-platform desktop notifications |

### MCP integration

| Service | Purpose |
|---------|---------|
| Figma / Figma Desktop | Design context, variable definitions |
| Sketch | Design selection screenshots |
| MasterGo | DSL structure data |
| Pixso | Local MCP for frame data, code snippets |
| 墨刀 (Modao) | Prototype data, design descriptions |
| 摹客 (Mockplus) | No MCP; user screenshots/annotations |

---

## 📄 Report output

All review, analysis, and evaluation outputs are saved as Markdown files to the project `reports/` directory.

| Report type | Filename pattern | Source |
|-------------|------------------|--------|
| Code review | `code-review-*.md` | `/review`, `frontend-code-review` |
| Security review | `security-review-*.md` | `security-review` |
| Accessibility | `accessibility-review-*.md` | `accessibility-check` |
| Performance | `performance-review-*.md` | `performance-optimizer` |
| Architecture | `architecture-proposal-*.md` | `frontend-architect` |
| Design fidelity | `ui-fidelity-review-*.md` | `ui-checker` |
| Design implementation | `design-implementation-*.md` | `figma-implementer` |
| Token mapping | `token-mapping-*.md` | `design-token-mapper` |
| Design plan | `design-plan-*.md` | `implement-from-design` |
| Test fix | `test-fix-*.md` | `test-and-fix` |

> **Tip:** Add `reports/` to `.gitignore` or commit as needed for history.

---

## ⚙️ Configuration

### MCP environment variables

| Variable | Tool | How to get |
|----------|------|------------|
| `FIGMA_API_KEY` | Figma | Figma account > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch developer settings |
| `MG_MCP_TOKEN` | MasterGo | MasterGo account > Security settings |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI page |

Pixso uses local MCP (enable in client); 摹客 works via user screenshots/annotations.

---

## 📥 Update

```bash
# Marketplace install
/plugin marketplace update bovinphang-frontend-craft

# Enable auto-update: /plugin → Marketplaces → select → Enable auto-update

# Submodule install
git submodule update --remote .claude/plugins/frontend-craft
```

---

## 📄 License

MIT — Use freely, modify as needed, contribute back if you can.

---

**If this repo helps you, give it a Star. Build something great.**
