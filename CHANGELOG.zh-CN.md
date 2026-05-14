# 变更日志

> **English:** [CHANGELOG.md](CHANGELOG.md)

本文件为 [CHANGELOG.md](CHANGELOG.md) 的简体中文镜像，便于中文读者阅读；版本与条目与英文版保持一致。

格式参考 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

自 **2.0.0** 起，面向发布的说明以英文 `CHANGELOG.md` 为权威来源；历史条目可能保留最初撰写语言。

## [2.0.0] - 2026-05-14

### 新增

- **通用 CLI** `frontend-craft`：`install`、`list`、`version`、`uninstall`（卸载仅为提示）；支持 runtime：Claude Code、Codex、Cursor、Windsurf、OpenCode、Kilo、Gemini CLI、Copilot、Antigravity、Augment、Trae、CodeBuddy、Cline、OpenClaw（`src/install/`、`bin/frontend-craft.mjs`）。在 TTY 下执行 `npx frontend-craft` / 无 runtime 的 `install` 可进入交互向导；支持 `--local` / `-l` 安装到当前项目。
- **根目录 `package.json`**：Node 22+ `engines`、npm `files` 清单、通过 `node --test` 运行的测试。
- **`templates/shared/rules`** 与 **`templates/claude/`** 布局；Codex 模板在 **`templates/codex/`**；OpenClaw 模板在 **`templates/openclaw/`**。
- **`openclaw.plugin.json`** 与 **`src/openclaw/`** TypeScript 插件（由原 `frontend-craft-openclaw` 合并）；`npm run build:openclaw` 构建，`npm run pack:openclaw` 在**仓库根目录**生成 **`frontend-craft-openclaw-<version>.tgz`**（打包过程会暂存至 `npm-packages/openclaw/`）。
- **`docs/runtimes/*.md`** 各 runtime 安装摘要（含非交互场景下 `--local` / `--global` 提示）。
- **`LICENSE`**（MIT）。
- **开源治理**：英文 `CONTRIBUTING.md`、简体中文 **CONTRIBUTING.zh-CN.md**、`SECURITY.md` / **SECURITY.zh-CN.md**、`CODE_OF_CONDUCT.md` / **CODE_OF_CONDUCT.zh-CN.md**、**CHANGELOG.zh-CN.md**、GitHub Issue 模板、PR 模板与 CI 工作流。

### 变更

- **CLI 安装体验：** 非交互终端在缺少 runtime 或缺少安装范围时，默认 **全局 `claude`** 并打印提示；TTY 下可询问 Global / Local，除非已传入 `--global` / `--local`；`install` 参数中的 `--help` / `-h` / `help` 仅打印帮助，不执行安装。
- **Hooks** 与文档中的脚本路径改用 **`${FRONTEND_CRAFT_ROOT}`**（安装器仍会将旧占位符 `${CLAUDE_PLUGIN_ROOT}` 展开以兼容）。
- **斜杠命令** 采用防冲突的 **`/fec-*`** 前缀：`/fec-init`、`/fec-review`、`/fec-scaffold`。旧根命令（`/init`、`/review`、`/scaffold`）及 `/frontend-craft:*` 名称不再发布。
- **`commands/fec-init.md`** 已按新模板路径更新。
- **`scripts/sync-codex-agents-toml.mjs`** 需要 **`CODEX_AGENTS_DIR`**（默认不再写入本仓库）。
- **README** 已补充贡献、安全、行为准则与 CI 状态链接，便于国际贡献者。

### 移除

- 顶层 **`templates/rules/`**（迁至 `templates/shared/rules/`）；**`templates/CLAUDE.md`** / **`templates/settings.json`** 迁至 **`templates/claude/`**。

## [1.1.0] - 2026-03-18

### 新增

- `fec-legacy-to-modern-migration` skill — jQuery/MPA 迁移至 React/Vue 3 + TS 的策略与流程
- `fec-e2e-testing` skill — Playwright/Cypress E2E 测试规范
- `fec-nextjs-project-standard` skill — Next.js 项目规范（App Router、SSR/SSG）
- `fec-nuxt-project-standard` skill — Nuxt 3 项目规范（SSR/SSG）
- `fec-monorepo-project-standard` skill — Monorepo 项目规范
- `rules/ci-cd.md` 模板 — CI/CD 流水线规范
- `rules/refactoring.md` 模板 — 重构项目约束（图片、样式、功能等价）
- CONTRIBUTING.md — 贡献指南
- CHANGELOG.md — 版本变更记录

### 变更

- `testing.md` — 补充 E2E 测试规则
- `frontend-architect` agent — 增加 `fec-legacy-to-modern-migration` skill 引用
- `fec-legacy-to-modern-migration` skill — 新增重构实施要求：图片（使用原项目资源、禁止内联 SVG）、样式（参考效果不照搬 CSS、优先 flex、禁止内联样式）、目标（视觉交互一致、功能等价、代码更简洁易维护）

---

## [1.0.0] - 2026-03-18

### 新增

- 初始发布
- 5 个 Agents：frontend-architect、performance-optimizer、ui-checker、figma-implementer、design-token-mapper
- 9 个 Skills：fec-frontend-code-review、fec-security-review、fec-accessibility-check、fec-react-project-standard、fec-vue3-project-standard、fec-implement-from-design、fec-test-and-fix、fec-legacy-web-standard、fec-legacy-to-modern-migration
- 3 个 Commands：init、review、scaffold
- Hooks：SessionStart、PreToolUse、PostToolUse、Stop、Notification
- 11 个规则模板：CLAUDE.md、settings.json、vue、react、design-system、testing、git-conventions、i18n、performance、api-layer、state-management、error-handling、naming-conventions
- MCP 集成：Figma、Sketch、MasterGo、Pixso、墨刀
- 多语言 README：English、简体中文、繁體中文、日本語、한국어
- 报告自动保存为 Markdown 至 `reports/` 目录
