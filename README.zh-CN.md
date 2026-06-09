<div align="center">

<img src="assets/brand/frontend-craft.png" alt="frontend-craft logo" width="200" />

# frontend-craft

### 一套工具，适配所有 AI 编程助手，落地生产级前端规范。

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

[English](README.md) · [**简体中文**](README.zh-CN.md) · [繁體中文](docs/zh-TW/README.md) · [日本語](docs/ja-JP/README.md) · [한국어](docs/ko-KR/README.md)

</div>

---

`frontend-craft` 是一个**通用前端插件**，为以下 **15 款 AI 编程助手**注入统一的前端工程规范：

`claude` `codex` `cursor` `windsurf` `opencode`
`kilo` `gemini` `copilot` `antigravity` `augment`
`trae` `codebuddy` `cline` `openclaw` `qoder`

各运行时的路径与注意事项详见 [`docs/runtimes/`](docs/runtimes/)。

它将 **13 个专业 agent**、**42 个自动激活 skill**、**8 个斜杠命令**、**5 个事件驱动 hook**、面向 6 个设计工具端点的 **MCP 集成**以及一整套**规则库**打包为一个可安装单元。运行一条命令，团队里的每一次 AI 会话都将以相同的方式编写 React、Vue、Next.js 或 Nuxt——类型安全、可访问、安全、一致。

---

## 为什么选择 frontend-craft？

| 痛点                                          | frontend-craft 的解法                                                 |
| --------------------------------------------- | --------------------------------------------------------------------- |
| AI 助手写出的前端代码风格不一、缺类型、不安全 | **42 个 skill** 将团队规范编码为可自动激活的工作流                    |
| 每款 AI 工具都有自己的插件格式                | **一条 CLI 命令** 把相同的规则、agent 和 hook 安装到 15 个运行时      |
| 设计稿到代码的交接总有信息损失                | **MCP 集成** 从 Figma、Figma Desktop、Sketch、MasterGo、Pixso、墨刀引入更完整设计上下文 |
| 代码评审随意、浅层                            | **13 个 agent** 输出分级报告：代码、安全、无障碍、性能、TS、UI 还原度 |
| 没人记得跑 lint 和测试                        | **事件驱动 hook** 在保存和会话结束时自动校验                          |
| 新项目每次都从零开始                          | **`/fec-init`** 几秒内脚手架化 CLAUDE.md、规则和 settings             |

---

## 安装

需要 **Node.js 22+**。完整支持 **Windows、macOS 和 Linux**（所有钩子和脚本均使用 Node.js 实现）。

### 方式一：全局安装 fec CLI（推荐）

```bash
# 1. 全局安装 fec 命令
npm install -g @bovinphang/frontend-craft@latest

# 2. 进入你的前端项目
cd your-project

# 3. 交互选择要接入的 AI 运行时
fec setup

# 4. 接入当前项目
fec setup codex
fec setup claude
fec setup all

# 5. 全局接入，适用于所有项目
fec setup codex --global
fec setup claude --global
fec setup all --global

# 6. 预览 / 查询
fec install --all --dry-run --global
fec list
```

`npm install -g` 只是安装 `fec` 终端命令。`fec setup` 是终端里的 CLI 项目接入命令，不是 AI 助手内的 `/fec-init` 斜杠命令。在交互式终端中，不带参数的 `fec setup` 会先让你选择 runtime；`fec setup <runtime>` 和 `fec setup all` 会默认接入当前项目。只有传入 `--global` 时，才会接入对应 AI 工具的全局配置目录，适用于所有项目。

### 方式二：用 npx 临时运行（免全局安装 fec）

```bash
# 1. 交互向导
npx @bovinphang/frontend-craft@latest

# 2. 接入当前项目
npx @bovinphang/frontend-craft@latest install --local codex
npx @bovinphang/frontend-craft@latest install --local claude
npx @bovinphang/frontend-craft@latest install --all --local

# 3. 全局接入，适用于所有项目
npx @bovinphang/frontend-craft@latest install --global codex
npx @bovinphang/frontend-craft@latest install --global claude
npx @bovinphang/frontend-craft@latest install --all --global

# 4. 预览 / 查询
npx @bovinphang/frontend-craft@latest install --all --dry-run --global
npx @bovinphang/frontend-craft@latest list
```

不想全局安装 `fec` 命令时使用 `npx`。不带参数会进入交互向导：先选择一个或多个运行时，再决定接入全局还是当前项目。脚本化安装全部 runtime 时使用 `install --all --local` 或 `install --all --global`，不要写成 `install all`。CI / 脚本场景请始终带上 `--global` / `-g` 或 `--local` / `-l`；非 TTY 且未指定时，CLI 默认安装到 `claude --global`。

### 方式三：Claude Code Marketplace

对 Claude Code 用户，**Claude Code Marketplace** 是推荐的单一来源安装方式。只有在需要跨运行时安装、脚本化/离线复制文件，或非 Marketplace 环境时，才建议对 Claude 使用 CLI。

如果已经通过 Marketplace 安装，CLI 不会再安装或更新第二份 Claude 副本，即使传入 `--force` 也不会覆盖；请通过 Claude Code Marketplace 更新。如果已存在另一个作用域的 CLI 管理安装，交互式终端会询问是保持已安装来源并更新，还是卸载后切换到当前来源；非交互终端会停止并打印明确的 `update`、`uninstall`、`install` 命令。

完整步骤见 [docs/runtimes/claude.zh-CN.md](docs/runtimes/claude.zh-CN.md) · [English](docs/runtimes/claude.md)。

---

## 快速开始

安装完成后，你在每一次 AI 会话中都拥有一套完整的前端工程工具箱：

```text
你："Review my recent changes"
→ fec-code-reviewer agent 被调度，输出 reports/code-review-*.md

你："/fec-review"
→ 按架构、类型、渲染、样式、可访问性等维度执行结构化评审

你："根据这个 Figma 链接实现结算页"
→ fec-figma-implementer agent 通过 MCP 读取设计稿，输出组件和报告

你："/fec-scaffold dashboard feature"
→ 按项目约定创建 page / feature / component 标准目录结构

你："/fec-refactor-clean"
→ 分类并安全清理死代码、未使用导出、样式和依赖
```

下文斜杠命令以 **Claude Code** 为例；其他运行时通过各自的命令系统提供同等能力（详见 [`docs/runtimes/`](docs/runtimes/)）。

---

## 示例提示词

完整的按场景组织的提示词库见 [docs/zh-CN/example-prompts.md](docs/zh-CN/example-prompts.md)。

```text
你：「合并前请评审我最近的改动。重点看架构、类型安全、渲染行为、样式、无障碍和缺失测试。」
你：「先不要写代码，请规划账号账单功能：路由结构、组件边界、数据流、状态归属、校验流程和上线风险。」
你：「请构建多步注册表单：根据项目框架选择表单与 schema 校验方案，包含文件上传、条件字段、异步校验和可访问错误提示。」
你：「请按 Figma 节点 123:456 实现 UI。复用现有 design token 和组件，匹配间距与响应式状态，并说明假设。」
你：「`/fec-refactor-clean` 请清理这个模块里的死代码。」
```

---

## 里面有什么

### 命令（Commands）

斜杠命令是结构化工作流的主入口，多数会输出带时间戳的 Markdown 报告到 `reports/`。

| 命令                  | 用途                                                        | 报告                                             |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| `/fec-init`           | 初始化项目模板（CLAUDE.md、规则、settings）                 | —                                                |
| `/fec-review`         | 对指定文件或最近变更的代码执行结构化评审                    | `code-review-*.md`                               |
| `/fec-scaffold`       | 按规范创建 page / feature / component 样板                  | —                                                |
| `/fec-plan`           | 统一规划入口：实现架构或测试策略                            | `architecture-proposal-*.md` 或 `test-plan-*.md` |
| `/fec-tdd`            | 红 → 绿 → 重构的前端 TDD 循环                               | —                                                |
| `/fec-debug`          | 前端问题诊断与修复：构建失败、运行时错误、UI 异常、接口问题 | `debug-*.md`                                     |
| `/fec-refactor-clean` | 分类并安全清理死代码、未使用导出、样式和依赖                | `refactor-clean-*.md`                            |
| `/fec-doc-sync`       | 同步 README、docs、环境变量、脚本、API/路由说明和部署文档 | —                                                |

### 技能（Skills，自动激活）

技能是根据文件模式、框架或任务上下文**自动激活**的工作流定义，编码了评审维度、输出约定和报告格式。

下方按使用场景分组列出全部自动激活的技能，便于快速找到项目规范、实现、测试、评审、设计、迁移、项目演进和文档维护能力。

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

| 技能                      | 范围                                                       |
| ------------------------- | ---------------------------------------------------------- |
| `fec-data-fetching`       | 服务端状态获取、缓存、失效、SSR、无限加载                  |
| `fec-api-integration`     | 类型化 API client、鉴权刷新、上传、实时集成                |
| `fec-state-management`    | 状态归属、store 选型、URL 状态、服务端/表单/本地状态边界   |
| `fec-form-handling`       | 跨框架表单选型、schema 校验、动态字段、上传                 |
| `fec-browser-storage`     | localStorage / sessionStorage / IndexedDB / Cookies 选型   |
| `fec-route-protection`    | React Router、Next.js、Vue Router、Nuxt 的登录态与权限路由 |
| `fec-pwa-implementation`  | manifest、Service Worker、离线缓存、安装提示               |
| `fec-web-workers`         | Web Worker、Transferable、Comlink、Worker 池               |
| `fec-canvas-threejs`      | Canvas 2D、Three.js、React Three Fiber、WebGL              |
| `fec-svg-animation`       | CSS / Framer Motion / GSAP SVG 动画与 reduced-motion       |
| `fec-list-virtualization` | 按框架选型的大列表虚拟滚动、测量、网格和无限滚动            |

**测试** — 规划或编写前端测试覆盖时激活：

| 技能                    | 范围                                                      |
| ----------------------- | --------------------------------------------------------- |
| `fec-testing-strategy`  | 静态检查、单元、组件、集成、E2E、视觉测试分层             |
| `fec-component-testing` | React Testing Library / Vue Test Utils 组件测试与回归用例 |
| `fec-e2e-testing`       | Playwright / Cypress E2E 与 Page Object 和 CI 集成        |
| `fec-tdd-workflow`      | 测试先行的前端实现，红绿重构循环                          |

**评审与质量** — 代码评审、验证或清理时激活：

| 技能                           | 范围                                                  |
| ------------------------------ | ----------------------------------------------------- |
| `fec-code-review`              | 架构、类型、渲染、样式、可访问性评审                  |
| `fec-debug-framework`          | 系统化诊断构建、运行时、UI 和 API/数据问题            |
| `fec-typescript-project-standard`   | TypeScript 配置、公开类型、声明文件、DTO 和泛型       |
| `fec-security-review`          | XSS、CSRF、敏感数据泄露、输入校验                     |
| `fec-accessibility-check`      | WCAG 2.2、键盘、焦点、触控和屏幕阅读器行为            |
| `fec-dependency-upgrade`       | 依赖升级、lockfile 评审、CVE 修复和迁移验证           |
| `fec-validation-fix`           | 一次性运行并修复 lint、type-check、test、build        |
| `fec-performance-optimization` | Core Web Vitals、包体、渲染、内存、网络与性能预算审查 |
| `fec-refactor-clean`           | 安全清理死代码、未使用导出、样式、路由和依赖          |

**设计 UI** — 设计实现、设计系统或视觉打磨时激活：

| 技能                          | 范围                                                     |
| ----------------------------- | -------------------------------------------------------- |
| `fec-ui-design`               | 产品语境 UI 方向、反模板设计拨盘、媒体策略、状态、视觉 QA |
| `fec-tailwind-design-system`  | Tailwind token、主题扩展、组件变体、class 治理和暗色模式 |
| `fec-responsive-layout`       | 移动优先布局、容器查询、数据密集型响应式界面             |
| `fec-motion-interaction`      | 场景化动效强度、页面转场、滚动动画、reduced-motion       |
| `fec-implement-from-design`   | 基于设计工具、截图或分区级视觉参考实现 UI                |
| `fec-storybook-component-doc` | Storybook 组件文档、设计系统呈现、隔离状态预览           |

**遗留迁移** — 现代化迁移时激活：

| 技能                             | 范围                                           |
| -------------------------------- | ---------------------------------------------- |
| `fec-legacy-web-standard`        | JS + jQuery + HTML 遗留项目的开发与维护规范    |
| `fec-legacy-to-modern-migration` | 遗留前端现代化、目标栈识别与分阶段迁移流程 |

**项目演进** — 吸收参考系统并原创化落到当前项目时激活：

| 技能          | 范围                                       |
| ------------- | ------------------------------------------ |
| `fec-alchemy` | 将参考系统能力原创化吸收到当前项目原生体系 |

**文档维护** — 文档维护时激活：

| 技能                            | 范围                                       |
| ------------------------------- | ------------------------------------------ |
| `fec-backend-requirements-handoff` | 前端向后端交接 UI 数据需求、用户动作、状态、业务规则与待确认问题 |
| `fec-doc-sync`                  | 让前端文档与代码、配置、脚本、路由、API、环境变量和部署事实保持同步 |
| `fec-source-driven-development` | 以项目事实和官方来源验证版本敏感的前端决策 |

### 代理（Agents）

代理是由主助手调度的专业子代理，专注处理单一任务并返回结构化报告。

| 代理                        | 聚焦领域                                                  | 报告                         |
| --------------------------- | --------------------------------------------------------- | ---------------------------- |
| `fec-code-reviewer`         | React/Vue/Next/Nuxt、TS、样式、客户端安全（按置信度降噪） | `code-review-*.md`           |
| `fec-typescript-reviewer`   | 类型安全、异步正确性、惯用模式（只报告不修改）            | `typescript-review-*.md`     |
| `fec-security-reviewer`     | XSS、客户端密钥、危险 DOM/API、CSP、依赖审计              | `security-review-*.md`       |
| `fec-performance-optimizer` | 打包体积、渲染性能、网络瓶颈                              | `performance-review-*.md`    |
| `fec-architect`             | 页面拆分、组件架构、状态流、目录规划                      | `architecture-proposal-*.md` |
| `fec-test-planner`          | 风险-层级映射：静态、单元、组件、E2E、视觉、无障碍、安全  | `test-plan-*.md`             |
| `fec-debugger`              | 复杂前端诊断：构建、运行时、UI 和接口问题                 | `debug-*.md`                 |
| `fec-refactor-cleaner`      | 分类并安全清理未使用代码、导出、样式、路由和依赖          | `refactor-clean-*.md`        |
| `fec-e2e-runner`            | E2E 编写与运行（Playwright/Cypress）、flaky 隔离、Trace   | `e2e-summary-*.md`           |
| `fec-doc-updater`           | 同步 README、runtime 文档、结构、能力表和 metadata        | —                            |
| `fec-ui-checker`            | 视觉问题排查与设计还原度评估                              | `ui-fidelity-review-*.md`    |
| `fec-figma-implementer`     | 按 Figma/Sketch/MasterGo/Pixso/墨刀设计稿精确实现 UI      | `design-implementation-*.md` |
| `fec-design-token-mapper`   | 将设计变量映射到项目 Design Token                         | `token-mapping-*.md`         |

### 钩子（Hooks，事件驱动）

钩子在 AI 助手事件触发时**自动执行**，无需手动调用。

| 事件                      | 行为                                         |
| ------------------------- | -------------------------------------------- |
| `SessionStart`            | 清理 Claude 缓存，然后自动检测项目框架和包管理器 |
| `PreToolUse(Bash)`        | 拦截危险命令（`rm -rf`、force push 等）      |
| `PostToolUse(Write/Edit)` | 对修改的文件自动执行 Prettier                |
| `Stop`                    | 会话结束时执行 lint、type-check、test、build |
| `Notification`            | 跨平台桌面通知（macOS / Linux / Windows）    |

### MCP 集成

将 AI 助手接入设计工具，构建带有更完整设计上下文的设计转代码工作流。

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
<summary>查看全部 20 个模板文件</summary>

| 文件                                     | 用途                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `CLAUDE.md`                              | 项目说明、常用命令、工作原则、安全要求                                |
| `settings.json`                          | 权限白名单/黑名单、环境变量                                           |
| `rules/fec-vue.md`                       | Vue 3 组件规范与反模式                                                |
| `rules/fec-react.md`                     | React 组件规范与反模式                                                |
| `rules/fec-design-system.md`             | 设计系统、Token、可访问性规则                                         |
| `rules/fec-testing.md`                   | 测试与校验规则                                                        |
| `rules/fec-git-conventions.md`           | Conventional Commits 提交规范                                         |
| `rules/fec-i18n.md`                      | 国际化文案规范                                                        |
| `rules/fec-performance.md`               | 前端性能优化规则                                                      |
| `rules/fec-rendering-patterns.md`        | 渲染生命周期、hydration、SSR/CSR 与更新模式                           |
| `rules/fec-responsive-design.md`         | 响应式布局、断点、触摸目标与视口行为                                  |
| `rules/fec-source-driven-development.md` | Source-driven decisions, official docs, version-sensitive assumptions |
| `rules/fec-api-layer.md`                 | API 层类型化与错误处理规范                                            |
| `rules/fec-state-management.md`          | 状态分类、管理策略与反模式                                            |
| `rules/fec-error-handling.md`            | 错误分层、Error Boundary、降级 UI、上报规范                           |
| `rules/fec-naming-conventions.md`        | 文件、组件、变量、路由、API、CSS 统一命名                             |
| `rules/fec-code-comments.md`             | 何时以及如何写前端注释                                                |
| `rules/fec-ci-cd.md`                     | CI/CD 流水线阶段、GitHub Actions / GitLab CI、密钥管理                |
| `rules/fec-refactoring.md`               | 重构约束与功能等价要求                                                |
| `rules/fec-agent-workflow.md`            | 子代理协作边界与委托规则                                              |
| `rules/fec-working-modes.md`             | 调研、计划、开发、评审、收尾模式指导                                  |

</details>

---

## 配置

### 前置条件

- **Node.js 22+**
- **npm、pnpm 或 yarn**
- **Git Bash 或兼容 shell**（仅 Windows，当 AI 运行时需要调用 shell 命令时）

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
<summary>查看全部 16 种报告类型</summary>

| 报告类型       | 文件名模式                                   | 来源                                                                |
| -------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| 代码审查       | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review`、`fec-code-review`、`fec-code-reviewer`               |
| 调试诊断       | `debug-YYYY-MM-DD-HHmmss.md`                 | `/fec-debug`、`fec-debug-framework`、`fec-debugger`                 |
| TS/JS 专项评审 | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `fec-typescript-reviewer`                                           |
| 安全审查       | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review`、`fec-security-reviewer`                      |
| 无障碍检查     | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check`                                           |
| 性能分析       | `performance-review-YYYY-MM-DD-HHmmss.md`    | `fec-performance-optimizer`                                         |
| 架构方案       | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `fec-architect`                                                     |
| 设计还原度     | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `fec-ui-checker`                                                    |
| 设计实现       | `design-implementation-YYYY-MM-DD-HHmmss.md` | `fec-figma-implementer`                                             |
| Token 映射     | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `fec-design-token-mapper`                                           |
| 设计计划       | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design`                                         |
| 测试计划       | `test-plan-YYYY-MM-DD-HHmmss.md`             | `/fec-plan`、`fec-testing-strategy`、`fec-test-planner`             |
| 验证修复       | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix`                                                |
| 重构清理       | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`、`fec-refactor-clean`、`fec-refactor-cleaner` |
| E2E 运行摘要   | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `fec-e2e-runner`（可选）                                            |
| 迁移计划       | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                    |

</details>

> **建议：** 在 `.gitignore` 中添加 `reports/` 以避免将自动生成的报告提交到代码仓库，或保留提交以便团队查看历史审查记录。

---

## 更新与移除

`fec` 是 `frontend-craft` 的短命令。如果没有全局安装 `fec`，可以把同样参数接在 `npx @bovinphang/frontend-craft@latest` 后使用，例如 `npx @bovinphang/frontend-craft@latest update`。

### 更新

```bash
fec update                         # 更新自动发现到的所有 CLI 管理安装
fec update <runtime> --local        # 更新一个本地 CLI 管理安装
fec update <runtime> --global       # 更新一个全局 CLI 管理安装
fec upgrade <runtime> --global      # `upgrade` 是 `update` 的别名
```

### 移除

```bash
fec uninstall                       # 移除自动发现到的所有 CLI 管理安装
fec remove                          # `remove` 是 `uninstall` 的别名
fec uninstall <runtime>             # 移除指定 runtime 安装
fec remove <runtime>                # 使用别名移除指定 runtime
fec uninstall --global              # 只移除发现到的全局安装
fec remove --local                  # 只移除发现到的本地安装
fec uninstall <runtime> --dry-run   # 预览将移除的文件
fec uninstall <runtime> --force     # 连同已修改的托管文件一起移除
```

CLI 会在 runtime 目录写入 `frontend-craft.manifest.json`。不传 runtime 时，`update` 会自动发现这些 manifest，并**跳过你本地修改过的文件**——自定义内容在更新后依然保留。

`uninstall`/`remove` 只删除 manifest 记录的文件，默认跳过已修改文件；只有确认要移除修改过的托管文件时才加 `--force`。`--force` 不会覆盖 Claude Code Marketplace 安装。

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
| `npx @bovinphang/frontend-craft` | 技能 + 运行时专属代理、命令、钩子、规则、模板 |
| `npx skills`         | 仅技能（适用于已有 Skills CLI 工作流）        |

关闭遥测：`DISABLE_TELEMETRY=1`。详见 [skills.sh CLI 文档](https://skills.sh/docs/cli)。

---

## 社区

- [贡献指南](CONTRIBUTING.zh-CN.md) — 开发环境、PR 自检清单与多语言同步规则（[English](CONTRIBUTING.md)）
- [安全策略](SECURITY.zh-CN.md) — 私密漏洞报告方式与支持范围（[English](SECURITY.md)）
- [行为准则](CODE_OF_CONDUCT.zh-CN.md) — 社区参与规范（[English](CODE_OF_CONDUCT.md)）
- [变更日志](CHANGELOG.zh-CN.md) — 版本说明（[English](CHANGELOG.md)）
- [项目结构](docs/zh-CN/project-structure.md) — 完整目录布局与文件职责（[English](docs/project-structure.md)）

---

## 许可证

[MIT](LICENSE) — 自由使用，按需修改，如果可以请回馈社区。

---

<div align="center">

**如果 frontend-craft 帮助了你的团队，[请给它一个 Star](https://github.com/bovinphang/frontend-craft)。**

</div>
