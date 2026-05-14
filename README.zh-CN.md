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

**面向 Claude Code、Codex、Cursor、OpenCode、Gemini CLI、Windsurf、Copilot、OpenClaw 等工具的通用前端插件。**

`frontend-craft` 将前端评审 agents、工作流 skills、斜杠命令、hooks、MCP 模板和项目规范集中在一个仓库中维护。推荐通过 CLI 将同一套前端工程规范安装到 14 种 AI 编程运行时。若你**仅通过 Claude Code Marketplace**（原生插件流程）安装，说明见 [docs/runtimes/claude.zh-CN.md](docs/runtimes/claude.zh-CN.md) · [English](docs/runtimes/claude.md)。

---

## 社区与治理

- [贡献指南](CONTRIBUTING.zh-CN.md) — 开发环境、PR 自检清单与多语言同步规则（[英文 CONTRIBUTING.md](CONTRIBUTING.md)）。
- [安全策略](SECURITY.zh-CN.md) — 私密漏洞报告方式与支持范围（[英文 SECURITY.md](SECURITY.md)）。
- [行为准则](CODE_OF_CONDUCT.zh-CN.md) — 社区参与规范（[英文 CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)）。
- [变更日志](CHANGELOG.zh-CN.md) — 版本说明中文镜像（[英文 CHANGELOG.md](CHANGELOG.md)）。

---

## 通用安装（推荐）

需要 **Node.js 22+**。CLI 会按各工具约定把文件写入对应目录（路径规则见 [`src/install/runtime-homes.mjs`](src/install/runtime-homes.mjs)）。

**在终端里交互安装（推荐）：** 直接运行 `npx frontend-craft@latest` 或 `npx frontend-craft@latest install` 不写 runtime，可按向导多选 runtime，并选择全局或当前项目。若已写 `install <runtime>` 但未带 `--global` / `--local`，在 **TTY** 下仍会询问安装位置。

**脚本 / CI：** 请始终加上 **`--global` / `-g`** 或 **`--local` / `-l`**。若 stdin 不是 TTY 且两者都未指定，CLI 会默认安装 **`claude`** 到 **全局** 并输出提示。

```bash
npx frontend-craft@latest list
npx frontend-craft@latest install --local claude
npx frontend-craft@latest install --global codex
npx frontend-craft@latest install cursor --local
npx frontend-craft@latest install --all --dry-run --global
```

支持的 runtime：`claude`、`codex`、`cursor`、`windsurf`、`opencode`、`kilo`、`gemini`、`copilot`、`antigravity`、`augment`、`trae`、`codebuddy`、`cline`、`openclaw`。

各工具说明见 [`docs/runtimes/`](docs/runtimes/)。OpenClaw 独立 npm 包可在本仓库中通过 `npm run pack:openclaw` 构建并校验，产物为**仓库根目录**下的 **`frontend-craft-openclaw-<version>.tgz`**（例如 `frontend-craft-openclaw-2.0.1.tgz`）。

---

## 快速开始

1. 运行 `npx frontend-craft@latest`（向导）或 `npx frontend-craft@latest install --local <runtime>` / `install --global <runtime>`（脚本化安装）。
2. 在 [`docs/runtimes/`](docs/runtimes/) 中打开与你工具对应的说明（路径与注意事项）。
3. **仅 Claude Code Marketplace：** 市场安装、`/fec-init`、更新等完整步骤见 [docs/runtimes/claude.zh-CN.md](docs/runtimes/claude.zh-CN.md) · [English](docs/runtimes/claude.md)。

---

## 🌐 跨平台支持

此插件完全支持 **Windows、macOS 和 Linux**。所有钩子和脚本均使用 Node.js 实现，确保跨平台兼容。

---

## 旧版 Skills CLI

当前推荐的多 runtime 安装方式是 `npx frontend-craft@latest`（交互向导）或 `npx frontend-craft@latest install [--local|--global] <runtime>`（脚本化安装）。如果团队已经在使用独立的 [Skills CLI](https://skills.sh/docs/cli)，它仍然可以只安装 [`skills/`](skills/) 下的工作流技能包。

### Skills CLI 与 frontend-craft CLI 的区别

- **`npx frontend-craft`** — 安装本仓库支持的 skills、runtime 专用 agents、commands、hooks、rules 和模板。优先使用上文 **通用安装** 的交互流程；非 TTY 时请为 `install` 加上 `--local` 或 `--global`。
- **`npx skills`** — 只安装 skill 包，适合已有 Skills CLI 工作流。

### 环境要求

`frontend-craft` 需要 Node.js 22+；使用 `npx skills` 时以 Skills CLI 自身要求为准。

### 安装技能

```bash
npx skills add bovinphang/frontend-craft
```

按提示选择项目级或全局安装（`-g`）、符号链接或复制（`--copy`），以及要启用的代理。若只想查看仓库内技能列表而不安装，可执行 `npx skills add bovinphang/frontend-craft -l`。若需指定技能名或代理，可使用 `--skill` / `--agent`（详见 `npx skills --help`）。

### 更新技能

在已安装技能的项目目录下执行（若为全局安装，请使用对应作用域）：

```bash
npx skills update
```

该命令会将已安装的技能更新到最新版本。也可先运行 `npx skills check` 查看可用更新。

**遥测：** CLI 默认可能采集匿名遥测。若需关闭，请设置环境变量 `DISABLE_TELEMETRY=1`。说明见 [skills.sh CLI 文档](https://skills.sh/docs/cli)。

---

## 📦 里面有什么

这个仓库是一个 **通用前端插件**，包含多个 AI 编程工具的原生布局；Claude Code 插件元数据位于 `.claude-plugin/`。

```text
frontend-craft/
|-- .claude-plugin/   # Claude Code 插件与市场清单
|   |-- plugin.json         # 插件元数据
|   └-- marketplace.json    # Marketplace 目录元数据
|
|-- agents/           # 用于委托的专业子代理
|   |-- frontend-architect.md    # 页面拆分、组件架构、状态流设计
|   |-- frontend-code-reviewer.md # 专注前端的代码评审（质量、安全、无障碍）
|   |-- frontend-security-reviewer.md # 前端攻击面：XSS、密钥、CSP、依赖
|   |-- frontend-e2e-runner.md     # E2E 编写执行、flaky、产物与 CI
|   |-- typescript-reviewer.md    # TS/JS 类型、异步、安全，只出报告
|   |-- performance-optimizer.md # 性能瓶颈分析与优化方案
|   |-- ui-checker.md            # UI 视觉问题、设计还原度评估
|   |-- figma-implementer.md     # 按设计稿精确实现 UI
|   └-- design-token-mapper.md   # 设计变量映射到 Design Token
|
|-- skills/           # 工作流定义和领域知识
|   |-- frontend-code-review/    # 架构、类型、渲染、样式、可访问性审查
|   |-- security-review/         # XSS、CSRF、敏感数据、输入校验
|   |-- accessibility-check/     # WCAG 2.1 AA 无障碍检查
|   |-- react-project-standard/ # React + TypeScript 项目规范
|   |-- vue3-project-standard/  # Vue 3 + TypeScript 项目规范
|   |-- implement-from-design/   # 基于设计稿实现 UI
|   |-- test-and-fix/           # lint、type-check、test、build 并修复
|   |-- legacy-web-standard/    # JS + jQuery + HTML 传统项目规范
|   |-- legacy-to-modern-migration/  # jQuery/MPA 迁移至 React/Vue 策略与流程
|   |-- e2e-testing/                # Playwright/Cypress E2E 测试规范
|   |-- nextjs-project-standard/    # Next.js 14+ App Router、SSR/SSG 规范
|   |-- nuxt-project-standard/      # Nuxt 3 SSR/SSG、组合式 API 规范
|   |-- monorepo-project-standard/  # pnpm workspace、Turborepo、Nx 规范
|
|-- commands/         # 用于快速执行的斜杠命令
|   |-- fec-init.md     # /fec-init - 初始化项目模板
|   |-- fec-review.md   # /fec-review - 代码规范化评审
|   └-- fec-scaffold.md # /fec-scaffold - 创建 page/feature/component
|
|-- hooks/            # 基于触发器的自动化
|   └-- hooks.json     # PreToolUse、PostToolUse、Stop、Notification 等
|
|-- scripts/          # 跨平台 Node.js 脚本
|   |-- security-check.mjs      # 拦截危险命令
|   |-- format-changed-file.mjs # 自动 Prettier 格式化
|   |-- run-tests.mjs           # 会话结束执行校验
|   |-- session-start.mjs       # 会话开始检测框架
|   └-- notify.mjs              # 跨平台桌面通知
|
|-- templates/        # 各 runtime 的项目级配置模板
|   |-- claude/        # CLAUDE.md 与 settings.json
|   |-- codex/         # AGENTS.md 与 config.toml
|   |-- openclaw/      # AGENTS.md 与 OPENCLAW-CONFIG.md
|   └-- shared/rules/  # vue、react、design-system、testing 等
|
|-- .mcp.json         # MCP 服务器配置（Figma、Sketch、MasterGo、Pixso、墨刀）
└-- README.md
```

---

## 功能概览

下表中的**斜杠命令**以 Claude Code 为例便于对照；其他 runtime 会以各自安装的 commands 与模板提供同等能力（见 [`docs/runtimes/`](docs/runtimes/)）。

### Commands（斜杠命令）

| 命令                       | 用途                                                             | 输出报告           |
| -------------------------- | ---------------------------------------------------------------- | ------------------ |
| `/fec-init`     | 将项目模板初始化到当前项目的 `.claude/` 目录                     | —                  |
| `/fec-review`   | 对指定文件或最近变更的代码执行规范化评审，输出分级报告           | `code-review-*.md` |
| `/fec-scaffold` | 按项目规范创建 page / feature / component 标准目录结构和样板文件 | —                  |

### Skills（自动激活）

| Skill                        | 用途                                                               | 输出报告                    |
| ---------------------------- | ------------------------------------------------------------------ | --------------------------- |
| `fec-frontend-code-review`       | 从架构、类型、渲染、样式、可访问性等维度审查代码                   | `code-review-*.md`          |
| `fec-security-review`            | XSS、CSRF、敏感数据泄露、输入校验等安全审查                        | `security-review-*.md`      |
| `fec-accessibility-check`        | WCAG 2.1 AA 无障碍检查                                             | `accessibility-review-*.md` |
| `fec-react-project-standard`     | React + TypeScript 项目工程规范（结构、组件、路由、状态、API 层）  | —                           |
| `fec-vue3-project-standard`      | Vue 3 + TypeScript 项目工程规范（结构、组件、路由、Pinia、API 层） | —                           |
| `fec-implement-from-design`      | 基于 Figma/Sketch/MasterGo/Pixso/墨刀/摹客设计稿实现 UI            | `design-plan-*.md`          |
| `fec-test-and-fix`               | 执行 lint、type-check、test、build 并修复失败                      | `test-fix-*.md`             |
| `fec-legacy-web-standard`        | JS + jQuery + HTML 传统项目的开发与维护规范                        | —                           |
| `fec-legacy-to-modern-migration` | jQuery/MPA 迁移至 React/Vue 3 + TS 的策略、概念映射与分阶段流程    | `migration-plan-*.md`       |
| `fec-e2e-testing`                | Playwright/Cypress E2E 测试规范：目录结构、Page Object、CI 集成    | —                           |
| `fec-nextjs-project-standard`    | Next.js 14+ App Router、SSR/SSG、流式渲染、元数据规范              | —                           |
| `fec-nuxt-project-standard`      | Nuxt 3 SSR/SSG、组合式 API、数据获取、路由、中间件规范             | —                           |
| `fec-monorepo-project-standard`  | pnpm workspace、Turborepo、Nx：目录结构、依赖管理、任务编排        | —                           |

### Agents（子代理）

| Agent                        | 用途                                                                                         | 输出报告                     |
| ---------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------- |
| `frontend-architect`         | 页面拆分、组件架构、状态流设计、目录规划、大型重构                                           | `architecture-proposal-*.md` |
| `frontend-code-reviewer`     | 前端代码评审：React/Vue/Next/Nuxt、TS、样式、客户端安全、按置信度降噪                        | `code-review-*.md`           |
| `frontend-security-reviewer` | 前端安全：XSS、客户端密钥、危险 DOM/API、第三方脚本、CSP、依赖审计                           | `security-review-*.md`       |
| `frontend-e2e-runner`        | E2E 编写与执行（Playwright/Cypress）、flaky 隔离、Trace/截图/视频、CI 对齐；可选摘要报告     | `e2e-summary-*.md`（可选）   |
| `typescript-reviewer`        | TS/JS 专项：先跑 typecheck/eslint、PR 就绪检查、类型与异步与安全、惯用法；只报告不直接改代码 | `typescript-review-*.md`     |
| `performance-optimizer`      | 分析性能瓶颈（打包体积、渲染性能、网络请求），输出量化优化方案                               | `performance-review-*.md`    |
| `ui-checker`                 | UI 视觉问题排查、设计还原度评估                                                              | `ui-fidelity-review-*.md`    |
| `figma-implementer`          | 按 Figma/Sketch/MasterGo/Pixso/墨刀/摹客设计稿精确实现 UI                                    | `design-implementation-*.md` |
| `design-token-mapper`        | 将设计变量映射到项目 Design Token                                                            | `token-mapping-*.md`         |

### Hooks（自动执行）

| 事件                      | 行为                                         |
| ------------------------- | -------------------------------------------- |
| `SessionStart`            | 自动检测项目框架和包管理器                   |
| `PreToolUse(Bash)`        | 拦截危险命令（rm -rf、force push 等）        |
| `PostToolUse(Write/Edit)` | 对修改的文件自动执行 Prettier                |
| `Stop`                    | 会话结束时执行 lint、type-check、test、build |
| `Notification`            | 跨平台桌面通知（macOS / Linux / Windows）    |

### MCP 集成

| 服务          | 用途                                               |
| ------------- | -------------------------------------------------- |
| Figma         | 读取设计上下文、变量定义                           |
| Figma Desktop | Figma 桌面端集成                                   |
| Sketch        | 读取设计选区截图                                   |
| MasterGo      | 读取 DSL 结构数据、组件层级和样式                  |
| Pixso         | 本地 MCP 获取帧数据、代码片段和图片资源            |
| 墨刀          | 获取原型数据、生成设计描述、导入 HTML              |
| 摹客          | 无 MCP 集成，通过用户提供的截图/标注/导出 CSS 支持 |

### 项目模板（通过 `/fec-init` 初始化）

| 文件                          | 用途                                                              |
| ----------------------------- | ----------------------------------------------------------------- |
| `CLAUDE.md`                   | 项目说明、常用命令、工作原则、安全要求                            |
| `settings.json`               | 权限白名单/黑名单、环境变量                                       |
| `rules/vue.md`                | Vue 3 组件规范和反模式                                            |
| `rules/react.md`              | React 组件规范和反模式                                            |
| `rules/design-system.md`      | 设计系统、Token、可访问性规则                                     |
| `rules/testing.md`            | 测试与校验规则                                                    |
| `rules/git-conventions.md`    | Conventional Commits 提交规范                                     |
| `rules/i18n.md`               | 国际化文案规范                                                    |
| `rules/performance.md`        | 前端性能优化规则                                                  |
| `rules/api-layer.md`          | API 层类型化、错误处理规范                                        |
| `rules/state-management.md`   | 状态分类、管理策略、反模式                                        |
| `rules/error-handling.md`     | 错误分层、Error Boundary、降级 UI、上报规范                       |
| `rules/naming-conventions.md` | 文件、组件、变量、路由、API、CSS 统一命名规范                     |
| `rules/code-comments.md`      | 前端代码注释：何时写、写什么（意图与背景，避免零注释与废话注释）  |
| `rules/ci-cd.md`              | CI/CD 流水线阶段、GitHub Actions / GitLab CI 示例、密钥管理       |
| `rules/refactoring.md`        | 重构约束：图片、样式、禁止内联 SVG/样式、优先 flex 布局、功能等价 |

---

## ⚙️ 配置

### 前置依赖

- Node.js 22+
- npm、pnpm 或 yarn
- Git Bash（Windows 用户需要，用于执行 hook 脚本）

### MCP 服务器

使用设计稿相关功能前，根据团队使用的设计工具设置对应环境变量：

| 环境变量         | 对应工具              | 获取方式                                  |
| ---------------- | --------------------- | ----------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma 账户设置 > Personal Access Tokens   |
| `SKETCH_API_KEY` | Sketch                | Sketch 开发者设置                         |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo 账户设置 > 安全设置 > 生成 Token |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI 功能页面获取访问令牌              |

> Pixso 使用本地 MCP 服务，需在 Pixso 客户端中启用 MCP 功能，无需额外环境变量。
> 摹客暂无 MCP 集成，通过用户提供截图/标注方式工作。

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

建议将环境变量添加到 shell 配置文件（`~/.bashrc`、`~/.zshrc`）或 Windows 系统环境变量中。

---

## 📄 报告输出

所有审查、分析和评估功能均自动将报告保存为 Markdown 文件至项目根目录下的 `reports/` 目录。

| 报告类型       | 文件名模式                                   | 来源                                                                         |
| -------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| 代码审查       | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review` 命令、`fec-frontend-code-review` skill、`frontend-code-reviewer` agent |
| TS/JS 专项评审 | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `typescript-reviewer` agent                                                  |
| 安全审查       | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review` skill、`frontend-security-reviewer` agent                  |
| 无障碍检查     | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check` skill                                                  |
| 性能分析       | `performance-review-YYYY-MM-DD-HHmmss.md`    | `performance-optimizer` agent                                                |
| 架构方案       | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` agent                                                   |
| 设计还原度     | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `ui-checker` agent                                                           |
| 设计实现       | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` agent                                                    |
| Token 映射     | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `design-token-mapper` agent                                                  |
| 设计计划       | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design` skill                                                |
| 测试修复       | `test-fix-YYYY-MM-DD-HHmmss.md`              | `fec-test-and-fix` skill                                                         |
| E2E 运行摘要   | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `frontend-e2e-runner` agent（可选）                                          |
| 迁移计划       | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration` skill                                           |

> **建议**：在 `.gitignore` 中添加 `reports/` 以避免将自动生成的报告提交到代码仓库，或保留提交以便团队成员查看历史审查记录。

---

## 保持更新

- **CLI 安装：** 使用相同的 `--local` / `--global` 与 runtime，重新执行 `npx frontend-craft@latest install`，版本说明见 [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md) / [CHANGELOG.md](CHANGELOG.md)。
- **Claude Code Marketplace 或 submodule 安装：** 见 [docs/runtimes/claude.zh-CN.md](docs/runtimes/claude.zh-CN.md) 中的 **更新** · [English](docs/runtimes/claude.md)。

---

## 🎯 关键概念

### 代理

子代理以有限范围处理委托的任务。示例：

```markdown
---
name: performance-optimizer
description: 分析前端性能瓶颈并给出优化方案
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
---

你是一名专注于前端性能分析与优化的高级工程师...
```

### 技能

技能是由命令或代理调用的工作流定义，包含评审维度、输出格式和报告文件约定：

```markdown
# 前端代码评审

## 评审维度

1. 架构 - 组件边界、职责分离
2. 类型安全 - any 使用、props 类型
   ...

## 报告文件输出

- 目录：reports/
- 文件名：code-review-YYYY-MM-DD-HHmmss.md
```

### 钩子

钩子在工具事件时触发。示例 — 拦截危险命令：

```json
{
  "event": "PreToolUse",
  "matcher": "tool == \"Bash\"",
  "command": "node \"${FRONTEND_CRAFT_ROOT}/scripts/security-check.mjs\""
}
```

---

## 📄 许可证

MIT - 自由使用，根据需要修改，如果可以请回馈。

---

**如果这个仓库有帮助，请给它一个 Star。构建一些很棒的前端。**
