# Changelog

**简体中文:** [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Project-facing release notes are maintained in English from 2.0.0 onward. Historical entries may preserve their original language.

## [Unreleased]

### Removed

- `/fec-test-plan` slash command — test-planning intent is now handled by `/fec-plan`.

### Changed

- `/fec-plan` is now the unified planning entry: it handles both implementation/architecture planning and test-strategy planning based on user intent.

## [2.3.1] - 2026-05-25

### Added

- **Claude cache cleanup hook:** added `fec-cleanup-claude-cache` hook for automatic Claude cache management during session start.
- **Cache diagnostics:** added `--fix-cache` and `--dry-run` flags to `frontend-craft doctor claude` for inspecting and cleaning stale cache entries.
- **New module:** `src/install/claude-cache.ts` with cache report generation, cleanup logic, and result rendering.
- **Hook registration:** registered `fec-cleanup-claude-cache` in `hooks/hooks.json` and `scripts/build-dist.ts`.

### Changed

- **Doctor command:** extended `doctor` report to include Claude cache status when runtime is `claude`.
- **Install documentation:** clarified Claude Code Marketplace as the preferred single-source install for Claude Code users; added warnings against running both Marketplace and CLI copies in the same scope, documented `--force` requirement for dual-install conflicts, and clarified that `/fec-init` only initializes project config, not a second plugin install.
- **Test coverage:** added `tests/install/claude-cache.test.ts`; expanded end-to-end, metadata consistency, and update test coverage.

## [2.3.0] - 2026-05-22

### Added

- Added new workflow capabilities: `fec-tdd-workflow`, `fec-refactor-clean`, `fec-doc-sync`, `/fec-plan`, `/fec-tdd`, `/fec-build-fix`, `/fec-refactor-clean`, `/fec-doc-sync`, plus `fec-build-fixer`, `fec-refactor-cleaner`, and `fec-doc-updater`.
- Added shared rules for agent workflow and working modes, and expanded testing, performance, refactoring, git, and comment rules with TDD, incremental validation, cleanup, and documentation-sync guidance.
- **Update/upgrade commands:** added `frontend-craft update` and `frontend-craft upgrade` with manifest-based file protection, allowing safe in-place updates without overwriting user-modified files.
- **esbuild minification:** added an esbuild minification step to the build pipeline, producing smaller compiled output for `dist/`.
- **Version sync script:** added `scripts/sync-version.ts` to propagate the package version across plugin metadata files, keeping `package.json`, `openclaw.json`, and skill manifests in lockstep.

### Changed

- Enhanced `fec-validation-fix` with incremental build-fix behavior and added cross-platform long-running command guidance in the Node security hook.
- **Build pipeline restructure:** moved hook scripts from `hooks/` to `src/hooks/`, switched the build pipeline to tsx-based compilation, bundled the CLI entry point into `dist/bin/`, and stopped publishing `dist/src/` in the npm package.
- **Install module type annotations:** added comprehensive TypeScript type annotations to the install module for improved type safety and editor support.
- **README layout:** replaced the detailed directory tree with a concise summary and a link to the full project structure documentation.
- **CONTRIBUTING guides:** updated `CONTRIBUTING.md` and `CONTRIBUTING.zh-CN.md` to reflect the tsx-based build pipeline and the hook script relocation to `src/hooks/`.

### Fixed

- **Install mkdir:** skipped `mkdir` when the target directory already exists, preventing unnecessary errors during repeated installs.

## [2.2.1] - 2026-05-21

### Added

- **Qoder runtime support:** added the `qoder` installer, runtime documentation, capability metadata, README coverage, and marketplace keywords. The universal installer now documents and supports 15 AI coding runtimes.
- **Testing strategy workflow:** added `fec-test-planner`, `/fec-test-plan`, and `fec-testing-strategy` for risk-based frontend test planning across static checks, unit, component, integration, E2E, visual, accessibility, security, and performance layers.
- **New frontend workflow skills:** added `fec-ui-design-direction`, `fec-interface-polish`, and `fec-vite-project-standard`; replaced the former validation workflow with `fec-validation-fix`.
- **Standalone skill publishing pipeline:** added `scripts/pack-skills.ts`, `scripts/check-skills-publish.ts`, shared skill packaging helpers, `npm run pack:skills`, `npm run check:skills-publish`, and `npm run pack:all` for generating and validating one publishable package per skill.
- **CLI diagnostics and metadata checks:** added `frontend-craft matrix`, `frontend-craft doctor <runtime>`, and `frontend-craft sync-metadata --check` to inspect runtime capabilities, installation health, and public metadata consistency.
- **Skill evaluation dataset:** added `skills/eval_queries.json` for validating skill discovery and routing quality.

### Changed

- **TypeScript migration:** migrated the universal CLI, installers, runtime converters, hook scripts, OpenClaw packaging scripts, and tests from `.mjs` to TypeScript, with compiled runtime entry points under `dist/`.
- **Agentskills-compatible skill layout:** normalized all skill directories to the `fec-*` naming scheme, added frontmatter and reference-file structure, expanded `skills/metadata.json` to 28 skills, and synchronized README skill trees across English, Simplified Chinese, Traditional Chinese, Japanese, and Korean docs.
- **Runtime capability model:** introduced explicit per-runtime capability tiers for skills, agents, commands, hooks, rules, templates, MCP, reports, and init behavior so installer output and docs reflect each runtime accurately.
- **Claude/OpenClaw packaging metadata:** refreshed plugin descriptions, supported runtime keywords, and hook command examples to match the TypeScript build output and the current 10-agent / 28-skill / 4-command surface.
- **Publish artifact layout:** `pack:skills` now writes standalone skill packages to root `skill-packages/` instead of `dist/skill-packages/`, keeping publishable skill packages separate from TypeScript build output.
- **Clean TypeScript builds:** `npm run build` now removes `dist/` before compiling so stale generated JavaScript cannot survive into later package outputs.

### Fixed

- **Root npm package contents:** tightened the npm `files` manifest so `npm pack` publishes compiled `dist/` runtime JavaScript and plugin assets without leaking TypeScript source directories (`bin/`, `src/`, or `scripts/`).
- **Packaging regression coverage:** added npm pack validation that rejects leaked TypeScript sources, stale compiled files without matching source files, and accidental inclusion of standalone `skill-packages/` in the root npm package.

### Removed

- Removed legacy unprefixed skill directories after migrating them to the `fec-*` layout.
- Removed stale migration and skills-fusion assessment documents that no longer matched the current package structure.

## [2.1.2] - 2026-05-20

### Changed

- **CONTRIBUTING docs:** expanded `CONTRIBUTING.md` and `CONTRIBUTING.zh-CN.md` with project structure overview, local development and debugging guide, testing instructions (Node.js `node:test`, single-file runs, interactive mode via `FRONTEND_CRAFT_FORCE_INTERACTIVE=1`), OpenClaw build pipeline (`build`/`typecheck`/`pack`), `scripts/` directory reference table, and installer architecture diagram.

- **OpenClaw package renamed:** `frontend-craft-openclaw` → `frontend-craft`. The npm package name, tarball filename, and README references are all updated. The packed tarball is now written to `npm-packages/openclaw/` instead of the repository root. Affects `scripts/openclaw/pack-openclaw.ts`, `README.md`, `README.zh-CN.md`, `README.openclaw.md`, `README.openclaw.zh-CN.md`, and `docs/MIGRATION-FROM-LEGACY-REPOS.md`. Historical CHANGELOG entries for 2.0.0/2.0.1 also corrected.

- **Interactive installer:** replaced numeric-choice prompts with a TTY-interactive selectable prompt system featuring ↑↓ navigation, Space toggle, Backspace to remove, search filtering, and pagination. Affects `src/install/interactive.ts` and adds new test coverage in `tests/install/cli.test.ts`.

## [2.1.1] - 2026-05-19

### Added

- **11 new skills**: `fec-data-fetching` (TanStack Query), `fec-form-handling` (React Hook Form + Zod), `fec-browser-storage` (client persistence), `fec-route-protection` (auth/permission routes), `fec-component-testing` (RTL / Vue Test Utils), `fec-storybook-component-doc` (Storybook docs), `fec-list-virtualization` (react-window / TanStack Virtual), `fec-pwa-implementation` (PWA), `fec-web-workers` (Web Worker), `fec-canvas-threejs` (Canvas/Three.js/R3F), `fec-svg-animation` (SVG motion).
- **Shared rules**: `responsive-design.md`, `rendering-patterns.md` — deployed via `/fec-init`.
- **metadata consistency test**: `tests/install/metadata-consistency.test.ts` validates that `skills/metadata.json`, README tables, and marketplace description stay in sync.

### Changed

- **Agent behavior (`fec-code-reviewer`):** report-only by default — no longer modifies business files unless explicitly requested.
- **Skill structure**: React, Vue, Next.js, Nuxt, Monorepo, legacy-web, legacy-migration, and implement-from-design skills aligned to a five-section template: Purpose / When to Use / Procedure / Constraints / Expected Output.
- **Scaffold templates**: fixed React CSS import (`import './<Name>.styles.css'` instead of `import styles from ...`); Vue scaffold uses `<slot />` instead of bare component tag.
- **Marketplace description**: skills count updated from 13 → 24, with new capabilities (component testing, route protection, PWA, Web Workers, Canvas/Three.js, SVG animation).
- **Skills fusion assessment** (`docs/skills-fusion-assessment.md`): condensed from 399 lines to a 64-line reference with coverage matrix.

## [2.0.1] - 2026-05-14

### Fixed

- **Claude Code plugin hooks:** `hooks/hooks.json` now references bundled scripts with **`${CLAUDE_PLUGIN_ROOT}`**, which Claude Code substitutes for marketplace and `--plugin-dir` loads. **`${FRONTEND_CRAFT_ROOT}`** is not substituted by the runtime and could break hooks on **Windows + Git Bash** (an empty prefix made `/scripts/...` resolve under the Git for Windows installation directory).

### Changed

- **Version:** 2.0.1 across the root npm package, `.claude-plugin` manifests, `openclaw.plugin.json`, and the **`frontend-craft`** staging package under `npm-packages/openclaw/`.

## [2.0.0] - 2026-05-14

### Added

- **Universal CLI** `frontend-craft`: `install`, `list`, `version`, `uninstall` (hints); supports runtimes: Claude Code, Codex, Cursor, Windsurf, OpenCode, Kilo, Gemini CLI, Copilot, Antigravity, Augment, Trae, CodeBuddy, Cline, OpenClaw (`src/install/`, `bin/frontend-craft.ts`). Interactive wizard when you run `npx frontend-craft` / `install` with no runtime (TTY), plus `--local` / `-l` for project installs.
- **Root `package.json`** with Node 22+ engines, npm `files` manifest, tests via `node --test`.
- **`templates/shared/rules`** + **`templates/claude/`** layout; Codex templates under **`templates/codex/`**; OpenClaw templates under **`templates/openclaw/`**.
- **`openclaw.plugin.json`** and **`src/openclaw/`** TypeScript plugin (from former `frontend-craft-openclaw`); build via `npm run build:openclaw`, pack via `npm run pack:openclaw` → **`frontend-craft-<version>.tgz`** under **`npm-packages/openclaw/`** (staging uses `npm-packages/openclaw/` during the pack).
- **`docs/runtimes/*.md`** per-runtime install stubs (with non-interactive `--local` / `--global` reminders).
- **`LICENSE`** (MIT).
- **Open source governance**: English `CONTRIBUTING.md`, **Simplified Chinese** `CONTRIBUTING.zh-CN.md`, `SECURITY.md` / `SECURITY.zh-CN.md`, `CODE_OF_CONDUCT.md` / `CODE_OF_CONDUCT.zh-CN.md`, `CHANGELOG.zh-CN.md`, GitHub issue templates, pull request template, and CI workflow.

### Changed

- **CLI install UX:** non-interactive terminals default missing runtime / missing install scope to **global `claude`** with console notices; TTY installs can prompt for Global vs Local unless `--global` / `--local` is passed; `install --help` / `--help` on the install argv prints help without installing.
- **Hooks** and docs now use **`${FRONTEND_CRAFT_ROOT}`** for script paths (installer still expands legacy `${CLAUDE_PLUGIN_ROOT}` for compatibility).
- **Slash commands** now use the collision-resistant **`/fec-*`** prefix: `/fec-init`, `/fec-review`, `/fec-scaffold`. Legacy root commands (`/init`, `/review`, `/scaffold`) and `/frontend-craft:*` command names are no longer published.
- **`commands/fec-init.md`** updated for new template paths.
- **`scripts/sync-codex-agents-toml.ts`** requires **`CODEX_AGENTS_DIR`** (no longer writes into this repo by default).
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
- `rules/fec-ci-cd.md` 模板 — CI/CD 流水线规范
- `rules/fec-refactoring.md` 模板 — 重构项目约束（图片、样式、功能等价）
- CONTRIBUTING.md — 贡献指南
- CHANGELOG.md — 版本变更记录

### Changed

- `testing.md` — 补充 E2E 测试规则
- `fec-architect` agent — 增加 `fec-legacy-to-modern-migration` skill 引用
- `fec-legacy-to-modern-migration` skill — 新增重构实施要求：图片（使用原项目资源、禁止内联 SVG）、样式（参考效果不照搬 CSS、优先 flex、禁止内联样式）、目标（视觉交互一致、功能等价、代码更简洁易维护）

---

## [1.0.0] - 2026-03-18

### Added

- 初始发布
- 5 个 Agents：fec-architect、performance-optimizer、ui-checker、figma-implementer、design-token-mapper
- 9 个 Skills：fec-code-review、fec-security-review、fec-accessibility-check、fec-react-project-standard、fec-vue3-project-standard、fec-implement-from-design、fec-test-and-fix、fec-legacy-web-standard、fec-legacy-to-modern-migration
- 3 个 Commands：init、review、scaffold
- Hooks：SessionStart、PreToolUse、PostToolUse、Stop、Notification
- 11 个规则模板：CLAUDE.md、settings.json、vue、react、design-system、testing、git-conventions、i18n、performance、api-layer、state-management、error-handling、naming-conventions
- MCP 集成：Figma、Sketch、MasterGo、Pixso、墨刀
- 多语言 README：English、简体中文、繁體中文、日本語、한국어
- 报告自动保存为 Markdown 至 `reports/` 目录
