# 变更日志

> **English:** [CHANGELOG.md](CHANGELOG.md)

本文件为 [CHANGELOG.md](CHANGELOG.md) 的简体中文镜像，便于中文读者阅读；版本与条目与英文版保持一致。

格式参考 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

自 **2.0.0** 起，面向发布的说明以英文 `CHANGELOG.md` 为权威来源；历史条目可能保留最初撰写语言。

## [Unreleased]

### 新增

- 新增工作流能力：`fec-tdd-workflow`、`fec-refactor-clean`、`fec-doc-sync`、`/fec-plan`、`/fec-tdd`、`/fec-build-fix`、`/fec-refactor-clean`、`/fec-doc-sync`，以及 `frontend-build-fixer`、`frontend-refactor-cleaner`、`frontend-doc-updater`。
- 新增 agent workflow 与 working modes 共享规则，并扩展 testing、performance、refactoring、git、comment 规则，补充 TDD、增量验证、清理和文档同步指导。

### 变更

- 增强 `fec-validation-fix` 的增量 build-fix 行为，并在 Node 安全 hook 中加入跨平台长命令日志提示。

## [2.2.1] - 2026-05-21

### 新增

- **Qoder runtime 支持**：新增 `qoder` 安装器、runtime 文档、能力元数据、README 说明和 Marketplace 关键词。通用安装器现在记录并支持 15 个 AI coding runtime。
- **测试策略工作流**：新增 `frontend-test-planner`、`/fec-test-plan` 和 `fec-testing-strategy`，用于按风险规划前端测试层级，覆盖静态检查、单元、组件、集成、E2E、视觉、无障碍、安全与性能等维度。
- **新前端工作流技能**：新增 `fec-ui-design-direction`、`fec-interface-polish` 和 `fec-vite-project-standard`；原验证修复流程改为 `fec-validation-fix`。
- **独立 skill 发布管线**：新增 `scripts/pack-skills.ts`、`scripts/check-skills-publish.ts`、共享 skill 打包工具，以及 `npm run pack:skills`、`npm run check:skills-publish`、`npm run pack:all`，可为每个 skill 生成并校验独立可发布包。
- **CLI 诊断与 metadata 检查**：新增 `frontend-craft matrix`、`frontend-craft doctor <runtime>` 和 `frontend-craft sync-metadata --check`，用于查看 runtime 能力矩阵、安装健康状态与公开 metadata 一致性。
- **Skill 评估数据集**：新增 `skills/eval_queries.json`，用于验证 skill 发现与路由质量。

### 变更

- **TypeScript 迁移**：将通用 CLI、安装器、runtime 转换器、hook 脚本、OpenClaw 打包脚本和测试从 `.mjs` 迁移到 TypeScript，并通过 `dist/` 下的编译产物作为运行入口。
- **Agentskills 兼容的 skill 布局**：所有 skill 目录统一为 `fec-*` 命名，补充 frontmatter 与 references 文件结构，将 `skills/metadata.json` 扩展至 28 个 skills，并同步英文、简体中文、繁体中文、日文和韩文 README 的技能目录树。
- **Runtime 能力模型**：新增显式的 runtime 能力分层，覆盖 skills、agents、commands、hooks、rules、templates、MCP、reports 与 init 行为，使安装器输出和文档能准确反映不同 runtime 的支持范围。
- **Claude/OpenClaw 打包元数据**：刷新插件描述、支持的 runtime 关键词与 hook 命令示例，使其匹配 TypeScript 构建产物以及当前 10 agents / 28 skills / 4 commands 的能力范围。
- **发布产物布局**：`pack:skills` 现在将独立 skill 发布包写入根目录 `skill-packages/`，不再写入 `dist/skill-packages/`，让独立发布包与 TypeScript 构建产物分离。
- **干净的 TypeScript 构建**：`npm run build` 现在会在编译前清理 `dist/`，避免历史生成的 JavaScript 文件混入后续打包产物。

### 修复

- **根 npm 包内容**：收紧 npm `files` 清单，`npm pack` 只发布编译后的 `dist/` 运行时代码和插件资产，不再泄漏 `bin/`、`src/`、`scripts/` 下的 TypeScript 源码。
- **打包回归测试**：新增 npm pack 校验，防止 TypeScript 源码泄漏、无对应源码的陈旧编译文件残留，以及根 npm 包误包含独立 `skill-packages/`。

### 移除

- 迁移到 `fec-*` 布局后，移除旧的无前缀 skill 目录。
- 移除已不匹配当前包结构的旧迁移文档与 skills fusion 评估文档。

## [2.1.2] - 2026-05-20

### 变更

- **CONTRIBUTING 文档**：完善 `CONTRIBUTING.md` 与 `CONTRIBUTING.zh-CN.md`，新增项目结构概览、本地开发与调试指南、测试说明（Node.js `node:test`、单文件运行、通过 `FRONTEND_CRAFT_FORCE_INTERACTIVE=1` 测试交互模式）、OpenClaw 构建管线（`build`/`typecheck`/`pack`）、`scripts/` 目录参考表，以及安装器架构关系图。

- **OpenClaw 包重命名**：`frontend-craft-openclaw` → `frontend-craft`。npm 包名、tarball 文件名及 README 引用全部更新。打包产物改写入 `npm-packages/openclaw/` 而非仓库根目录。影响 `scripts/openclaw/pack-openclaw.ts`、`README.md`、`README.zh-CN.md`、`README.openclaw.md`、`README.openclaw.zh-CN.md` 及 `docs/MIGRATION-FROM-LEGACY-REPOS.md`。CHANGELOG 中 2.0.0/2.0.1 历史条目也已同步修正。

- **交互式安装向导**：将数字选择提示升级为 TTY 交互式可选 prompt 系统，支持 ↑↓ 导航、Space 切换、Backspace 删除、搜索过滤和分页。影响 `src/install/interactive.ts`，并在 `tests/install/cli.test.ts` 中新增测试覆盖。

## [2.1.1] - 2026-05-19

### 新增

- **11 个新技能**：`fec-data-fetching`（TanStack Query）、`fec-form-handling`（React Hook Form + Zod）、`fec-browser-storage`（客户端持久化）、`fec-route-protection`（权限路由）、`fec-component-testing`（RTL / Vue Test Utils）、`fec-storybook-component-doc`（Storybook 文档）、`fec-list-virtualization`（react-window / TanStack Virtual）、`fec-pwa-implementation`（PWA）、`fec-web-workers`（Web Worker）、`fec-canvas-threejs`（Canvas/Three.js/R3F）、`fec-svg-animation`（SVG 动画）。
- **共享规则**：`responsive-design.md`、`rendering-patterns.md` — 通过 `/fec-init` 部署。
- **metadata 一致性测试**：`tests/install/metadata-consistency.test.ts` 校验 `skills/metadata.json`、README 表格与 Marketplace 描述保持同步。

### 变更

- **Agent 行为（`frontend-code-reviewer`）**：默认只输出评审报告，不再修改业务文件，除非用户明确要求。
- **Skill 结构**：React、Vue、Next.js、Nuxt、Monorepo、legacy-web、legacy-migration、implement-from-design 等技能统一为五段式结构：Purpose / When to Use / Procedure / Constraints / Expected Output。
- **脚手架模板**：修正 React CSS import（`import './<Name>.styles.css'` 替代模块化导入）；Vue 模板使用 `<slot />` 替代裸组件标签。
- **Marketplace 描述**：skills 数量从 13 → 24，补充新能力（组件测试、路由保护、PWA、Web Workers、Canvas/Three.js、SVG 动画）。
- **Skills 融合评估报告**（`docs/skills-fusion-assessment.md`）：从 399 行精简为 64 行结论版，附覆盖矩阵。

## [2.0.1] - 2026-05-14

### 修复

- **Claude Code 插件 hooks：** `hooks/hooks.json` 中引用内置 `dist/scripts/*.js` 时使用 **`${CLAUDE_PLUGIN_ROOT}`**，以便在 Marketplace 与 **`--plugin-dir`** 加载时由 Claude Code 正确替换插件根路径。运行时**不会**替换 **`${FRONTEND_CRAFT_ROOT}`**，在 **Windows + Git Bash** 下可能导致 hook 解析到 Git 安装目录下的错误路径。

### 变更

- **版本号：** 根 npm 包、`.claude-plugin` 清单、`openclaw.plugin.json` 以及 `npm-packages/openclaw/` 中的 **`frontend-craft`** 暂存包均升至 **2.0.1**。

## [2.0.0] - 2026-05-14

### 新增

- **通用 CLI** `frontend-craft`：`install`、`list`、`version`、`uninstall`（卸载仅为提示）；支持 runtime：Claude Code、Codex、Cursor、Windsurf、OpenCode、Kilo、Gemini CLI、Copilot、Antigravity、Augment、Trae、CodeBuddy、Cline、OpenClaw（`src/install/`、`bin/frontend-craft.ts`）。在 TTY 下执行 `npx frontend-craft` / 无 runtime 的 `install` 可进入交互向导；支持 `--local` / `-l` 安装到当前项目。
- **根目录 `package.json`**：Node 22+ `engines`、npm `files` 清单、通过 `node --test` 运行的测试。
- **`templates/shared/rules`** 与 **`templates/claude/`** 布局；Codex 模板在 **`templates/codex/`**；OpenClaw 模板在 **`templates/openclaw/`**。
- **`openclaw.plugin.json`** 与 **`src/openclaw/`** TypeScript 插件（由原 `frontend-craft-openclaw` 合并）；`npm run build:openclaw` 构建，`npm run pack:openclaw` 在 **`npm-packages/openclaw/`** 生成 **`frontend-craft-<version>.tgz`**（打包过程会暂存至 `npm-packages/openclaw/`）。
- **`docs/runtimes/*.md`** 各 runtime 安装摘要（含非交互场景下 `--local` / `--global` 提示）。
- **`LICENSE`**（MIT）。
- **开源治理**：英文 `CONTRIBUTING.md`、简体中文 **CONTRIBUTING.zh-CN.md**、`SECURITY.md` / **SECURITY.zh-CN.md**、`CODE_OF_CONDUCT.md` / **CODE_OF_CONDUCT.zh-CN.md**、**CHANGELOG.zh-CN.md**、GitHub Issue 模板、PR 模板与 CI 工作流。

### 变更

- **CLI 安装体验：** 非交互终端在缺少 runtime 或缺少安装范围时，默认 **全局 `claude`** 并打印提示；TTY 下可询问 Global / Local，除非已传入 `--global` / `--local`；`install` 参数中的 `--help` / `-h` / `help` 仅打印帮助，不执行安装。
- **Hooks** 与文档中的脚本路径改用 **`${FRONTEND_CRAFT_ROOT}`**（安装器仍会将旧占位符 `${CLAUDE_PLUGIN_ROOT}` 展开以兼容）。
- **斜杠命令** 采用防冲突的 **`/fec-*`** 前缀：`/fec-init`、`/fec-review`、`/fec-scaffold`。旧根命令（`/init`、`/review`、`/scaffold`）及 `/frontend-craft:*` 名称不再发布。
- **`commands/fec-init.md`** 已按新模板路径更新。
- **`scripts/sync-codex-agents-toml.ts`** 需要 **`CODEX_AGENTS_DIR`**（默认不再写入本仓库）。
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
