<div align="center">

# frontend-craft

### 一套工具，适配所有 AI 编程助手，落地生产级前端规范。

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

[English](README.md) · [**简体中文**](README.zh-CN.md) · [繁體中文](docs/zh-TW/README.md) · [日本語](docs/ja-JP/README.md) · [한국어](docs/ko-KR/README.md)

</div>

---

`frontend-craft` 是一个**通用前端插件**，为以下 **15 款 AI 编程助手**注入统一的前端工程规范：

`claude` `codex` `cursor` `windsurf` `opencode`
`kilo` `gemini` `copilot` `antigravity` `augment`
`trae` `codebuddy` `cline` `openclaw` `qoder`

各运行时的路径与注意事项详见 [`docs/runtimes/`](docs/runtimes/)。

它将 **13 个专业 agent**、**30 个自动激活 skill**、**9 个斜杠命令**、**5 个事件驱动 hook**、面向 6 款设计工具的 **MCP 模板**以及一整套**规则库**打包为一个可安装单元。运行一条命令，团队里的每一次 AI 会话都将以相同的方式编写 React、Vue、Next.js 或 Nuxt——类型安全、可访问、安全、一致。

```bash
npx frontend-craft@latest
```

就这样。向导会引导你完成剩余步骤。

---

## 为什么选择 frontend-craft？

| 痛点                                          | frontend-craft 的解法                                                 |
| --------------------------------------------- | --------------------------------------------------------------------- |
| AI 助手写出的前端代码风格不一、缺类型、不安全 | **30 个 skill** 将团队规范编码为可自动激活的工作流                    |
| 每款 AI 工具都有自己的插件格式                | **一条 CLI 命令** 把相同的规则、agent 和 hook 安装到 15 个运行时      |
| 设计稿到代码的交接总有信息损失                | **MCP 模板** 直接读取 Figma、Sketch、MasterGo、Pixso、墨刀、摹客      |
| 代码评审随意、浅层                            | **13 个 agent** 输出分级报告：代码、安全、无障碍、性能、TS、UI 还原度 |
| 没人记得跑 lint 和测试                        | **事件驱动 hook** 在保存和会话结束时自动校验                          |
| 新项目每次都从零开始                          | **`/fec-init`** 几秒内脚手架化 CLAUDE.md、规则和 settings             |

---

## 安装

需要 **Node.js 22+**。完整支持 **Windows、macOS 和 Linux**（所有钩子和脚本均使用 Node.js 实现）。

### 方式一：交互向导（推荐）

```bash
npx frontend-craft@latest
```

向导会引导你选择一个或多个运行时，并决定安装到全局还是当前项目。这是最友好的上手方式。

### 方式二：脚本化安装

```bash
# 安装到当前项目
npx frontend-craft@latest install --local claude

# 全局安装到某个运行时
npx frontend-craft@latest install --global codex

# 预览所有运行时的安装内容（不实际写入）
npx frontend-craft@latest install --all --dry-run --global

# 列出支持的运行时
npx frontend-craft@latest list
```

> **CI / 脚本场景：** 始终带上 `--global` / `-g` 或 `--local` / `-l`。非 TTY 且未指定时，CLI 默认安装到 `claude --global`。

### 方式三：Claude Code Marketplace

对 Claude Code 用户，**Claude Code Marketplace** 是推荐的单一来源安装方式。只有在需要跨运行时安装、脚本化/离线复制文件，或非 Marketplace 环境时，才建议对 Claude 使用 CLI。除非显式传入 `--force`，不要在同一个 Claude 作用域同时启用 Marketplace 和 CLI 两份完整插件。

如果你确实要额外启用一份 CLI 管理的 Claude 安装，请把 `--force` 放在 `install claude` 后面；它不是顶层命令，不能写成 `npx frontend-craft@latest --force`：

```bash
npx frontend-craft@latest install claude --global --force
npx frontend-craft@latest install claude --local --force
```

完整步骤见 [docs/runtimes/claude.zh-CN.md](docs/runtimes/claude.zh-CN.md) · [English](docs/runtimes/claude.md)。

---

---

## 快速开始

安装完成后，你在每一次 AI 会话中都拥有一套完整的前端工程工具箱：

```text
你："Review my recent changes"
→ fec-frontend-code-reviewer agent 被调度，输出 reports/code-review-*.md

你："/fec-review"
→ 按架构、类型、渲染、样式、可访问性等维度执行结构化评审

你："根据这个 Figma 链接实现结算页"
→ fec-figma-implementer agent 通过 MCP 读取设计稿，输出组件和报告

你："/fec-scaffold dashboard feature"
→ 按项目约定创建 page / feature / component 标准目录结构

你："/fec-build-fix"
→ 增量修复 lint、type-check、test 和 build 失败
```

下文斜杠命令以 **Claude Code** 为例；其他运行时通过各自的命令系统提供同等能力（详见 [`docs/runtimes/`](docs/runtimes/)）。

---

## 里面有什么

### 命令（Commands）

斜杠命令是结构化工作流的主入口，多数会输出带时间戳的 Markdown 报告到 `reports/`。

| 命令                  | 用途                                              | 报告                         |
| --------------------- | ------------------------------------------------- | ---------------------------- |
| `/fec-init`           | 初始化项目模板（CLAUDE.md、规则、settings）       | —                            |
| `/fec-review`         | 对指定文件或最近变更的代码执行结构化评审          | `code-review-*.md`           |
| `/fec-test-plan`      | 规划测试分层、风险覆盖与执行顺序                  | `test-plan-*.md`             |
| `/fec-scaffold`       | 按规范创建 page / feature / component 样板        | —                            |
| `/fec-plan`           | 实现前规划功能架构、重构或迁移                    | `architecture-proposal-*.md` |
| `/fec-tdd`            | 红 → 绿 → 重构的前端 TDD 循环                     | —                            |
| `/fec-build-fix`      | 增量修复 lint、type-check、test、build 或 CI 失败 | `validation-fix-*.md`        |
| `/fec-refactor-clean` | 分类并安全清理死代码、未使用导出、样式和依赖      | `refactor-clean-*.md`        |
| `/fec-doc-sync`       | 同步 README、runtime 文档、能力表和公开 metadata  | —                            |

### 技能（Skills，自动激活）

技能是根据文件模式、框架或任务上下文**自动激活**的工作流定义，编码了评审维度、输出约定和报告格式。

**项目规范** — 检测到对应框架时自动生效：

| 技能                            | 范围                                                  |
| ------------------------------- | ----------------------------------------------------- |
| `fec-react-project-standard`    | React + TypeScript（结构、组件、路由、状态、API 层）  |
| `fec-vue3-project-standard`     | Vue 3 + TypeScript（结构、组件、路由、Pinia、API 层） |
| `fec-nextjs-project-standard`   | Next.js 14+ App Router、SSR/SSG、流式渲染、元数据     |
| `fec-nuxt-project-standard`     | Nuxt 3 SSR/SSG、组合式 API、数据获取、中间件          |
| `fec-vite-project-standard`     | Vite 配置、环境变量安全、HMR、开发代理、构建优化      |
| `fec-monorepo-project-standard` | pnpm workspace、Turborepo、Nx 结构与任务编排          |

**实现能力** — 构建特定前端能力时激活：

| 技能                          | 范围                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| `fec-data-fetching`           | TanStack Query / 服务端状态获取、缓存、乐观更新            |
| `fec-form-handling`           | React Hook Form + Zod、动态字段、上传、多步流程            |
| `fec-browser-storage`         | localStorage / sessionStorage / IndexedDB / Cookies 选型   |
| `fec-route-protection`        | React Router、Next.js、Vue Router、Nuxt 的登录态与权限路由 |
| `fec-pwa-implementation`      | manifest、Service Worker、离线缓存、安装提示               |
| `fec-web-workers`             | Web Worker、Transferable、Comlink、Worker 池               |
| `fec-canvas-threejs`          | Canvas 2D、Three.js、React Three Fiber、WebGL              |
| `fec-svg-animation`           | CSS / Framer Motion / GSAP SVG 动画与 reduced-motion       |
| `fec-list-virtualization`     | react-window / TanStack Virtual 大列表虚拟滚动             |

**测试** — 规划或编写前端测试覆盖时激活：

| 技能                          | 范围                                                      |
| ----------------------------- | --------------------------------------------------------- |
| `fec-testing-strategy`        | 静态检查、单元、组件、集成、E2E、视觉测试分层             |
| `fec-component-testing`       | React Testing Library / Vue Test Utils 组件测试与回归用例 |
| `fec-e2e-testing`             | Playwright / Cypress E2E 与 Page Object 和 CI 集成        |
| `fec-tdd-workflow`            | 测试先行的前端实现，红绿重构循环                         |

**评审与质量** — 代码评审、验证或清理时激活：

| 技能                       | 范围                                           |
| -------------------------- | ---------------------------------------------- |
| `fec-frontend-code-review` | 架构、类型、渲染、样式、可访问性评审           |
| `fec-security-review`      | XSS、CSRF、敏感数据泄露、输入校验              |
| `fec-accessibility-check`  | WCAG 2.1 AA 无障碍检查                         |
| `fec-validation-fix`       | 一次性运行并修复 lint、type-check、test、build |
| `fec-refactor-clean`       | 安全清理死代码、未使用导出、样式、路由和依赖   |

**设计 UI** — 设计实现、设计系统或视觉打磨时激活：

| 技能                          | 范围                                                    |
| ----------------------------- | ------------------------------------------------------- |
| `fec-ui-design`              | UI 方向、视觉识别、界面打磨、状态、视觉 QA             |
| `fec-implement-from-design`   | 基于 Figma/Sketch/MasterGo/Pixso/墨刀/摹客设计稿实现 UI |
| `fec-storybook-component-doc` | Storybook 组件文档、Addon、MDX、交互与视觉测试          |

**遗留迁移** — 现代化迁移时激活：

| 技能                             | 范围                                           |
| -------------------------------- | ---------------------------------------------- |
| `fec-legacy-web-standard`        | JS + jQuery + HTML 遗留项目的开发与维护规范    |
| `fec-legacy-to-modern-migration` | jQuery/MPA → React/Vue 3 + TS 策略与分阶段流程 |

**文档维护** — 文档维护时激活：

| 技能           | 范围                                       |
| -------------- | ------------------------------------------ |
| `fec-doc-sync` | 让公开文档与脚本、技能、代理、命令保持同步 |

### 代理（Agents）

代理是由主助手调度的专业子代理，专注处理单一任务并返回结构化报告。

| 代理                         | 聚焦领域                                                  | 报告                         |
| ---------------------------- | --------------------------------------------------------- | ---------------------------- |
| `fec-frontend-code-reviewer`     | React/Vue/Next/Nuxt、TS、样式、客户端安全（按置信度降噪） | `code-review-*.md`           |
| `fec-typescript-reviewer`        | 类型安全、异步正确性、惯用模式（只报告不修改）            | `typescript-review-*.md`     |
| `fec-frontend-security-reviewer` | XSS、客户端密钥、危险 DOM/API、CSP、依赖审计              | `security-review-*.md`       |
| `fec-performance-optimizer`      | 打包体积、渲染性能、网络瓶颈                              | `performance-review-*.md`    |
| `fec-frontend-architect`         | 页面拆分、组件架构、状态流、目录规划                      | `architecture-proposal-*.md` |
| `fec-frontend-test-planner`      | 风险-层级映射：静态、单元、组件、E2E、视觉、无障碍、安全  | `test-plan-*.md`             |
| `fec-frontend-build-fixer`       | 增量修复 lint / type-check / test / build / CI            | `validation-fix-*.md`        |
| `fec-frontend-refactor-cleaner`  | 分类并安全清理未使用代码、导出、样式、路由和依赖          | `refactor-clean-*.md`        |
| `fec-frontend-e2e-runner`        | E2E 编写与运行（Playwright/Cypress）、flaky 隔离、Trace   | `e2e-summary-*.md`           |
| `fec-frontend-doc-updater`       | 同步 README、runtime 文档、结构、能力表和 metadata        | —                            |
| `fec-ui-checker`                 | 视觉问题排查与设计还原度评估                              | `ui-fidelity-review-*.md`    |
| `fec-figma-implementer`          | 按 Figma/Sketch/MasterGo/Pixso/墨刀/摹客设计稿精确实现 UI | `design-implementation-*.md` |
| `fec-design-token-mapper`        | 将设计变量映射到项目 Design Token                         | `token-mapping-*.md`         |

### 钩子（Hooks，事件驱动）

钩子在 AI 助手事件触发时**自动执行**，无需手动调用。

| 事件                      | 行为                                         |
| ------------------------- | -------------------------------------------- |
| `SessionStart`            | 自动检测项目框架和包管理器                   |
| `PreToolUse(Bash)`        | 拦截危险命令（`rm -rf`、force push 等）      |
| `PostToolUse(Write/Edit)` | 对修改的文件自动执行 Prettier                |
| `Stop`                    | 会话结束时执行 lint、type-check、test、build |
| `Notification`            | 跨平台桌面通知（macOS / Linux / Windows）    |

### MCP 集成

将 AI 助手直接接入设计工具，实现无损的设计转代码工作流。

| 服务              | 能力                                 |
| ----------------- | ------------------------------------ |
| **Figma**         | 读取设计上下文与变量定义             |
| **Figma Desktop** | Figma 桌面端集成                     |
| **Sketch**        | 读取设计选区截图                     |
| **MasterGo**      | 读取 DSL 结构、组件层级和样式        |
| **Pixso**         | 本地 MCP：帧数据、代码片段、图片资源 |
| **墨刀**          | 原型数据、设计描述、HTML 导入        |
| **摹客**          | 截图/标注/导出 CSS 工作流（无 MCP）  |

### 项目模板（`/fec-init`）

运行 `/fec-init` 即可将一套开箱即用的规则库和项目配置脚手架化到 `.claude/`：

<details>
<summary>查看全部 18 个模板文件</summary>

| 文件                          | 用途                                                   |
| ----------------------------- | ------------------------------------------------------ |
| `CLAUDE.md`                   | 项目说明、常用命令、工作原则、安全要求                 |
| `settings.json`               | 权限白名单/黑名单、环境变量                            |
| `rules/fec-vue.md`                | Vue 3 组件规范与反模式                                 |
| `rules/fec-react.md`              | React 组件规范与反模式                                 |
| `rules/fec-design-system.md`      | 设计系统、Token、可访问性规则                          |
| `rules/fec-testing.md`            | 测试与校验规则                                         |
| `rules/fec-git-conventions.md`    | Conventional Commits 提交规范                          |
| `rules/fec-i18n.md`               | 国际化文案规范                                         |
| `rules/fec-performance.md`        | 前端性能优化规则                                       |
| `rules/fec-api-layer.md`          | API 层类型化与错误处理规范                             |
| `rules/fec-state-management.md`   | 状态分类、管理策略与反模式                             |
| `rules/fec-error-handling.md`     | 错误分层、Error Boundary、降级 UI、上报规范            |
| `rules/fec-naming-conventions.md` | 文件、组件、变量、路由、API、CSS 统一命名              |
| `rules/fec-code-comments.md`      | 何时以及如何写前端注释                                 |
| `rules/fec-ci-cd.md`              | CI/CD 流水线阶段、GitHub Actions / GitLab CI、密钥管理 |
| `rules/fec-refactoring.md`        | 重构约束与功能等价要求                                 |
| `rules/fec-agent-workflow.md`     | 子代理协作边界与委托规则                               |
| `rules/fec-working-modes.md`      | 调研、计划、开发、评审、收尾模式指导                   |

</details>

---

## 配置

### 前置条件

- **Node.js 22+**
- **npm、pnpm 或 yarn**
- **Git Bash**（仅 Windows — 执行 hook 脚本所需）

### MCP 设计工具令牌

根据团队使用的设计工具设置对应环境变量：

| 环境变量         | 工具                  | 获取方式                                  |
| ---------------- | --------------------- | ----------------------------------------- |
| `FIGMA_API_KEY`  | Figma / Figma Desktop | Figma 账户设置 → Personal Access Tokens   |
| `SKETCH_API_KEY` | Sketch                | Sketch 开发者设置                         |
| `MG_MCP_TOKEN`   | MasterGo              | MasterGo 账户设置 → 安全设置 → 生成 Token |
| `MODAO_TOKEN`    | 墨刀                  | 墨刀 AI 功能页面 → 访问令牌               |

> **Pixso** 使用本地 MCP 服务 — 在 Pixso 客户端启用即可，无需额外环境变量。
> **摹客** 暂无 MCP 集成 — 通过截图和导出 CSS 方式工作。

添加到 shell 配置文件以持久化：

```bash
# macOS / Linux — 追加到 ~/.bashrc 或 ~/.zshrc
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

```powershell
# Windows — 设为系统环境变量，或在 PowerShell 中临时设置：
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

---

## 报告输出

每一次评审、分析和评估都会输出带时间戳的 Markdown 报告到 `reports/`，可作为审计记录和 PR 交付物。

<details>
<summary>查看全部 15 种报告类型</summary>

| 报告类型       | 文件名模式                                   | 来源                                                                     |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| 代码审查       | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review`、`fec-frontend-code-review`、`fec-frontend-code-reviewer`      |
| TS/JS 专项评审 | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `fec-typescript-reviewer`                                                    |
| 安全审查       | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review`、`fec-frontend-security-reviewer`                      |
| 无障碍检查     | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check`                                                |
| 性能分析       | `performance-review-YYYY-MM-DD-HHmmss.md`    | `fec-performance-optimizer`                                                  |
| 架构方案       | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `fec-frontend-architect`                                                     |
| 设计还原度     | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `fec-ui-checker`                                                             |
| 设计实现       | `design-implementation-YYYY-MM-DD-HHmmss.md` | `fec-figma-implementer`                                                      |
| Token 映射     | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `fec-design-token-mapper`                                                    |
| 设计计划       | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design`                                              |
| 测试计划       | `test-plan-YYYY-MM-DD-HHmmss.md`             | `/fec-test-plan`、`fec-testing-strategy`、`fec-frontend-test-planner`        |
| 验证修复       | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix`                                                     |
| 重构清理       | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`、`fec-refactor-clean`、`fec-frontend-refactor-cleaner` |
| E2E 运行摘要   | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `fec-frontend-e2e-runner`（可选）                                            |
| 迁移计划       | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                         |

</details>

> **建议：** 在 `.gitignore` 中添加 `reports/` 以避免将自动生成的报告提交到代码仓库，或保留提交以便团队查看历史审查记录。

---

## 保持更新

```bash
# 更新 CLI 安装（作用域与初次安装一致）
npx frontend-craft@latest update <runtime> --local
npx frontend-craft@latest update <runtime> --global
# `upgrade` 是 `update` 的别名
```

CLI 会在 runtime 目录写入 `frontend-craft.manifest.json`，并**跳过你本地修改过的文件**——自定义内容在更新后依然保留。

**Claude Code Marketplace** 或 **submodule** 安装的更新方式见 [docs/runtimes/claude.zh-CN.md](docs/runtimes/claude.zh-CN.md) · [English](docs/runtimes/claude.md)。`/fec-init` 只初始化项目配置，不是第二次安装插件本体。

---

## 旧版 Skills CLI

如果团队已在使用独立的 [Skills CLI](https://skills.sh/docs/cli)，它仍然可以只安装 [`skills/`](skills/) 下的工作流技能包：

```bash
npx skills add bovinphang/frontend-craft   # 按提示操作，加 -g 可全局安装
npx skills update                          # 更新到最新版本
npx skills check                           # 预览可用更新
```

| CLI                  | 安装内容                                      |
| -------------------- | --------------------------------------------- |
| `npx frontend-craft` | 技能 + 运行时专属代理、命令、钩子、规则、模板 |
| `npx skills`         | 仅技能（适用于已有 Skills CLI 工作流）        |

关闭遥测：`DISABLE_TELEMETRY=1`。详见 [skills.sh CLI 文档](https://skills.sh/docs/cli)。

---

## 社区

- [贡献指南](CONTRIBUTING.zh-CN.md) — 开发环境、PR 自检清单与多语言同步规则（[English](CONTRIBUTING.md)）
- [安全策略](SECURITY.zh-CN.md) — 私密漏洞报告方式与支持范围（[English](SECURITY.md)）
- [行为准则](CODE_OF_CONDUCT.zh-CN.md) — 社区参与规范（[English](CODE_OF_CONDUCT.md)）
- [变更日志](CHANGELOG.zh-CN.md) — 版本说明（[English](CHANGELOG.md)）
- [项目结构](docs/project-structure.md) — 完整目录布局与文件职责

---

## 许可证

[MIT](LICENSE) — 自由使用，按需修改，如果可以请回馈社区。

---

<div align="center">

**如果 frontend-craft 帮助了你的团队，[请给它一个 Star](https://github.com/bovinphang/frontend-craft)。**

</div>
