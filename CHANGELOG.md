# Changelog

**简体中文:** [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Project-facing release notes are maintained in English from 2.0.0 onward. Historical entries may preserve their original language.

## [2.0.0] - 2026-05-14

### Added

- **Universal CLI** `frontend-craft`: `install`, `list`, `version`, `uninstall` (hints); supports runtimes: Claude Code, Codex, Cursor, Windsurf, OpenCode, Kilo, Gemini CLI, Copilot, Antigravity, Augment, Trae, CodeBuddy, Cline, OpenClaw (`src/install/`, `bin/frontend-craft.mjs`). Interactive wizard when you run `npx frontend-craft` / `install` with no runtime (TTY), plus `--local` / `-l` for project installs.
- **Root `package.json`** with Node 22+ engines, npm `files` manifest, tests via `node --test`.
- **`templates/shared/rules`** + **`templates/claude/`** layout; Codex templates under **`templates/codex/`**; OpenClaw templates under **`templates/openclaw/`**.
- **`openclaw.plugin.json`** and **`src/openclaw/`** TypeScript plugin (from former `frontend-craft-openclaw`); build via `npm run build:openclaw`, pack via `npm run pack:openclaw` → **`frontend-craft-openclaw-<version>.tgz`** at the **repository root** (staging uses `npm-packages/openclaw/` during the pack).
- **`docs/runtimes/*.md`** per-runtime install stubs (with non-interactive `--local` / `--global` reminders).
- **`LICENSE`** (MIT).
- **Open source governance**: English `CONTRIBUTING.md`, **Simplified Chinese** `CONTRIBUTING.zh-CN.md`, `SECURITY.md` / `SECURITY.zh-CN.md`, `CODE_OF_CONDUCT.md` / `CODE_OF_CONDUCT.zh-CN.md`, `CHANGELOG.zh-CN.md`, GitHub issue templates, pull request template, and CI workflow.

### Changed

- **CLI install UX:** non-interactive terminals default missing runtime / missing install scope to **global `claude`** with console notices; TTY installs can prompt for Global vs Local unless `--global` / `--local` is passed; `install --help` / `--help` on the install argv prints help without installing.
- **Hooks** and docs now use **`${FRONTEND_CRAFT_ROOT}`** for script paths (installer still expands legacy `${CLAUDE_PLUGIN_ROOT}` for compatibility).
- **Slash commands** now use the collision-resistant **`/fec-*`** prefix: `/fec-init`, `/fec-review`, `/fec-scaffold`. Legacy root commands (`/init`, `/review`, `/scaffold`) and `/frontend-craft:*` command names are no longer published.
- **`commands/fec-init.md`** updated for new template paths.
- **`scripts/sync-codex-agents-toml.mjs`** requires **`CODEX_AGENTS_DIR`** (no longer writes into this repo by default).
- **README files** now link to contributing, security, code of conduct, and CI status for international contributors.

### Removed

- Top-level **`templates/rules/`** (moved to `templates/shared/rules/`); **`templates/CLAUDE.md`** / **`templates/settings.json`** moved to **`templates/claude/`**.

## [1.1.0] - 2026-03-18

### Added

- `fec-legacy-to-modern-migration` skill — jQuery/MPA 迁移至 React/Vue 3 + TS 的策略与流程
- `fec-e2e-testing` skill — Playwright/Cypress E2E 测试规范
- `fec-nextjs-project-standard` skill — Next.js 项目规范（App Router、SSR/SSG）
- `fec-nuxt-project-standard` skill — Nuxt 3 项目规范（SSR/SSG）
- `fec-monorepo-project-standard` skill — Monorepo 项目规范
- `rules/ci-cd.md` 模板 — CI/CD 流水线规范
- `rules/refactoring.md` 模板 — 重构项目约束（图片、样式、功能等价）
- CONTRIBUTING.md — 贡献指南
- CHANGELOG.md — 版本变更记录

### Changed

- `testing.md` — 补充 E2E 测试规则
- `frontend-architect` agent — 增加 `fec-legacy-to-modern-migration` skill 引用
- `fec-legacy-to-modern-migration` skill — 新增重构实施要求：图片（使用原项目资源、禁止内联 SVG）、样式（参考效果不照搬 CSS、优先 flex、禁止内联样式）、目标（视觉交互一致、功能等价、代码更简洁易维护）

---

## [1.0.0] - 2026-03-18

### Added

- 初始发布
- 5 个 Agents：frontend-architect、performance-optimizer、ui-checker、figma-implementer、design-token-mapper
- 9 个 Skills：fec-frontend-code-review、fec-security-review、fec-accessibility-check、fec-react-project-standard、fec-vue3-project-standard、fec-implement-from-design、fec-test-and-fix、fec-legacy-web-standard、fec-legacy-to-modern-migration
- 3 个 Commands：init、review、scaffold
- Hooks：SessionStart、PreToolUse、PostToolUse、Stop、Notification
- 11 个规则模板：CLAUDE.md、settings.json、vue、react、design-system、testing、git-conventions、i18n、performance、api-layer、state-management、error-handling、naming-conventions
- MCP 集成：Figma、Sketch、MasterGo、Pixso、墨刀
- 多语言 README：English、简体中文、繁體中文、日本語、한국어
- 报告自动保存为 Markdown 至 `reports/` 目录
