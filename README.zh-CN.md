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

**面向企业级前端团队的 Claude Code 共享插件。**

集成代码审查、安全审查、设计稿还原（Figma/Sketch/MasterGo/Pixso/墨刀/摹客）、无障碍检查、自动化质量保障和项目规范模板。所有审查、分析和评估报告均自动保存为 Markdown 文件至项目 `reports/` 目录，便于存档、追溯和团队共享。

---

## 🚀 快速开始

在 2 分钟内快速上手：

### 第一步：安装插件

```bash
# 添加市场
/plugin marketplace add bovinphang/frontend-craft

# 安装插件
/plugin install frontend-craft@bovinphang-frontend-craft

# 激活插件
/reload-plugins
```

### 第二步：初始化项目配置（推荐）

```bash
# 将项目模板初始化到当前项目的 .claude/ 目录
/frontend-craft:init
```

初始化后请根据项目实际情况修改：

1. `.claude/CLAUDE.md` — 修改项目基础信息、包管理器、常用命令
2. `.claude/rules/` — 删除不适用的规则文件（如纯 React 项目删除 `vue.md`，不需要 i18n 的项目删除 `i18n.md`）；若项目有 CI/CD 流水线，可保留 `ci-cd.md`
3. `.claude/settings.json` — 调整权限白名单

> **为什么需要这一步？** 插件提供的是可复用的 Skills、Agents 和 Hooks，而 CLAUDE.md 和 rules 是项目级配置，必须位于项目根目录的 `.claude/` 下才能被 Claude Code 识别。`/init` 命令帮你快速完成这个配置。

### 第三步：开始使用

```bash
# 代码评审（输出报告到 reports/code-review-*.md）
/frontend-craft:review

# 按规范创建页面/功能/组件
/frontend-craft:scaffold page UserDetail
/frontend-craft:scaffold component DataTable

# 查看可用命令
/plugin list frontend-craft@bovinphang-frontend-craft
```

✨ **完成！** 你现在可以使用 9 个代理、14 个技能和 3 个命令。

---

## 🌐 跨平台支持

此插件完全支持 **Windows、macOS 和 Linux**。所有钩子和脚本均使用 Node.js 实现，确保跨平台兼容。

---

## 多代理技能安装（Skills CLI）

若团队同时使用 **Claude Code**、**OpenAI Codex**、**Cursor**、**OpenCode**、**Gemini CLI**、**OpenClaw**、**Continue**、**CodeBuddy**、**Trae**、**Kimi Code CLI** 等多种 AI 编程代理，可通过 [Skills CLI](https://skills.sh/docs/cli)（`npx skills`）将本仓库中的**工作流技能**安装到各工具约定的技能目录。CLI 支持数十种代理；完整列表以交互提示或上游文档为准。

**Skills CLI 与完整插件的区别**

- **Skills CLI** — 将 [`skills/`](skills/) 下的技能包安装到你选择的代理目录，便于在多种工具间统一评审与前端规范。
- **完整 Claude Code 插件** — 仍需通过下文 [安装](#安装)（`/plugin marketplace add` 等）获得 **Agents**、**斜杠命令**、**Hooks** 与 **项目模板**（`templates/`），而不仅是技能。

**环境要求：** Node.js ≥ 18（与上文一致）。

**安装技能**

```bash
npx skills add bovinphang/frontend-craft
```

按提示选择项目级或全局安装（`-g`）、符号链接或复制（`--copy`），以及要启用的代理。若只想查看仓库内技能列表而不安装，可执行 `npx skills add bovinphang/frontend-craft -l`。若需指定技能名或代理，可使用 `--skill` / `--agent`（详见 `npx skills --help`）。

**更新技能**

在已安装技能的项目目录下执行（若为全局安装，请使用对应作用域）：

```bash
npx skills update
```

该命令会将已安装的技能更新到最新版本。也可先运行 `npx skills check` 查看可用更新。

**遥测：** CLI 默认可能采集匿名遥测。若需关闭，请设置环境变量 `DISABLE_TELEMETRY=1`。说明见 [skills.sh CLI 文档](https://skills.sh/docs/cli)。

---

## 📦 里面有什么

这个仓库是一个 **Claude Code 插件**，可直接安装或通过 `--plugin-dir` 本地加载。

```
frontend-craft/
|-- .claude-plugin/   # 插件和市场清单
|   |-- plugin.json         # 插件元数据
|   └-- marketplace.json    # /plugin marketplace add 的市场目录
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
|   |-- init.md        # /init - 初始化项目模板
|   |-- review.md      # /review - 代码规范化评审
|   └-- scaffold.md    # /scaffold - 创建 page/feature/component
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
|-- templates/        # 项目级配置模板（通过 /init 复制）
|   |-- CLAUDE.md
|   |-- settings.json
|   └-- rules/         # vue、react、design-system、testing 等
|
|-- .mcp.json         # MCP 服务器配置（Figma、Sketch、MasterGo、Pixso、墨刀）
└-- README.md
```

---

## 📥 安装

> **要求：** Claude Code v1.0.33+，Node.js >= 18，npm/pnpm/yarn。

### 选项 1：作为插件安装（推荐）

```bash
# 添加市场
/plugin marketplace add bovinphang/frontend-craft

# 安装插件
/plugin install frontend-craft@bovinphang-frontend-craft
```

或直接添加到 `~/.claude/settings.json` 或项目 `.claude/settings.json`：

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

### 选项 2：团队项目级自动安装

在项目根目录的 `.claude/settings.json` 中添加上述 `extraKnownMarketplaces` 配置，团队成员 trust 项目目录后会自动提示安装。

### 选项 3：本地开发 / 测试

克隆仓库后使用 `--plugin-dir` 加载（不需要安装，适合开发调试）：

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

### 选项 4：作为 Git Submodule（项目级共享）

```bash
# 在项目根目录下添加为 submodule
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft

git add .gitmodules .claude/plugins/frontend-craft
git commit -m "feat: add frontend-craft as shared Claude Code plugin"
```

团队成员克隆项目后执行：

```bash
git submodule update --init --recursive
```

然后使用 `--plugin-dir` 加载：

```bash
claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 📋 功能概览

### Commands（斜杠命令）

| 命令 | 用途 | 输出报告 |
|------|------|----------|
| `/frontend-craft:init` | 将项目模板初始化到当前项目的 `.claude/` 目录 | — |
| `/frontend-craft:review` | 对指定文件或最近变更的代码执行规范化评审，输出分级报告 | `code-review-*.md` |
| `/frontend-craft:scaffold` | 按项目规范创建 page / feature / component 标准目录结构和样板文件 | — |

### Skills（自动激活）

| Skill | 用途 | 输出报告 |
|-------|------|----------|
| `frontend-code-review` | 从架构、类型、渲染、样式、可访问性等维度审查代码 | `code-review-*.md` |
| `security-review` | XSS、CSRF、敏感数据泄露、输入校验等安全审查 | `security-review-*.md` |
| `accessibility-check` | WCAG 2.1 AA 无障碍检查 | `accessibility-review-*.md` |
| `react-project-standard` | React + TypeScript 项目工程规范（结构、组件、路由、状态、API 层） | — |
| `vue3-project-standard` | Vue 3 + TypeScript 项目工程规范（结构、组件、路由、Pinia、API 层） | — |
| `implement-from-design` | 基于 Figma/Sketch/MasterGo/Pixso/墨刀/摹客设计稿实现 UI | `design-plan-*.md` |
| `test-and-fix` | 执行 lint、type-check、test、build 并修复失败 | `test-fix-*.md` |
| `legacy-web-standard` | JS + jQuery + HTML 传统项目的开发与维护规范 | — |
| `legacy-to-modern-migration` | jQuery/MPA 迁移至 React/Vue 3 + TS 的策略、概念映射与分阶段流程 | `migration-plan-*.md` |
| `e2e-testing` | Playwright/Cypress E2E 测试规范：目录结构、Page Object、CI 集成 | — |
| `nextjs-project-standard` | Next.js 14+ App Router、SSR/SSG、流式渲染、元数据规范 | — |
| `nuxt-project-standard` | Nuxt 3 SSR/SSG、组合式 API、数据获取、路由、中间件规范 | — |
| `monorepo-project-standard` | pnpm workspace、Turborepo、Nx：目录结构、依赖管理、任务编排 | — |

### Agents（子代理）

| Agent | 用途 | 输出报告 |
|-------|------|----------|
| `frontend-architect` | 页面拆分、组件架构、状态流设计、目录规划、大型重构 | `architecture-proposal-*.md` |
| `frontend-code-reviewer` | 前端代码评审：React/Vue/Next/Nuxt、TS、样式、客户端安全、按置信度降噪 | `code-review-*.md` |
| `frontend-security-reviewer` | 前端安全：XSS、客户端密钥、危险 DOM/API、第三方脚本、CSP、依赖审计 | `security-review-*.md` |
| `frontend-e2e-runner` | E2E 编写与执行（Playwright/Cypress）、flaky 隔离、Trace/截图/视频、CI 对齐；可选摘要报告 | `e2e-summary-*.md`（可选） |
| `typescript-reviewer` | TS/JS 专项：先跑 typecheck/eslint、PR 就绪检查、类型与异步与安全、惯用法；只报告不直接改代码 | `typescript-review-*.md` |
| `performance-optimizer` | 分析性能瓶颈（打包体积、渲染性能、网络请求），输出量化优化方案 | `performance-review-*.md` |
| `ui-checker` | UI 视觉问题排查、设计还原度评估 | `ui-fidelity-review-*.md` |
| `figma-implementer` | 按 Figma/Sketch/MasterGo/Pixso/墨刀/摹客设计稿精确实现 UI | `design-implementation-*.md` |
| `design-token-mapper` | 将设计变量映射到项目 Design Token | `token-mapping-*.md` |

### Hooks（自动执行）

| 事件 | 行为 |
|------|------|
| `SessionStart` | 自动检测项目框架和包管理器 |
| `PreToolUse(Bash)` | 拦截危险命令（rm -rf、force push 等） |
| `PostToolUse(Write/Edit)` | 对修改的文件自动执行 Prettier |
| `Stop` | 会话结束时执行 lint、type-check、test、build |
| `Notification` | 跨平台桌面通知（macOS / Linux / Windows） |

### MCP 集成

| 服务 | 用途 |
|------|------|
| Figma | 读取设计上下文、变量定义 |
| Figma Desktop | Figma 桌面端集成 |
| Sketch | 读取设计选区截图 |
| MasterGo | 读取 DSL 结构数据、组件层级和样式 |
| Pixso | 本地 MCP 获取帧数据、代码片段和图片资源 |
| 墨刀 | 获取原型数据、生成设计描述、导入 HTML |
| 摹客 | 无 MCP 集成，通过用户提供的截图/标注/导出 CSS 支持 |


### 项目模板（通过 `/init` 初始化）

| 文件 | 用途 |
|------|------|
| `CLAUDE.md` | 项目说明、常用命令、工作原则、安全要求 |
| `settings.json` | 权限白名单/黑名单、环境变量 |
| `rules/vue.md` | Vue 3 组件规范和反模式 |
| `rules/react.md` | React 组件规范和反模式 |
| `rules/design-system.md` | 设计系统、Token、可访问性规则 |
| `rules/testing.md` | 测试与校验规则 |
| `rules/git-conventions.md` | Conventional Commits 提交规范 |
| `rules/i18n.md` | 国际化文案规范 |
| `rules/performance.md` | 前端性能优化规则 |
| `rules/api-layer.md` | API 层类型化、错误处理规范 |
| `rules/state-management.md` | 状态分类、管理策略、反模式 |
| `rules/error-handling.md` | 错误分层、Error Boundary、降级 UI、上报规范 |
| `rules/naming-conventions.md` | 文件、组件、变量、路由、API、CSS 统一命名规范 |
| `rules/code-comments.md` | 前端代码注释：何时写、写什么（意图与背景，避免零注释与废话注释） |
| `rules/ci-cd.md` | CI/CD 流水线阶段、GitHub Actions / GitLab CI 示例、密钥管理 |
| `rules/refactoring.md` | 重构约束：图片、样式、禁止内联 SVG/样式、优先 flex 布局、功能等价 |

---

## ⚙️ 配置
### 前置依赖
- Node.js >= 18
- npm、pnpm 或 yarn
- Git Bash（Windows 用户需要，用于执行 hook 脚本）

### MCP 服务器

使用设计稿相关功能前，根据团队使用的设计工具设置对应环境变量：

| 环境变量 | 对应工具 | 获取方式 |
|----------|----------|----------|
| `FIGMA_API_KEY` | Figma / Figma Desktop | Figma 账户设置 > Personal Access Tokens |
| `SKETCH_API_KEY` | Sketch | Sketch 开发者设置 |
| `MG_MCP_TOKEN` | MasterGo | MasterGo 账户设置 > 安全设置 > 生成 Token |
| `MODAO_TOKEN` | 墨刀 | 墨刀 AI 功能页面获取访问令牌 |

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

| 报告类型 | 文件名模式 | 来源 |
|----------|-----------|------|
| 代码审查 | `code-review-YYYY-MM-DD-HHmmss.md` | `/review` 命令、`frontend-code-review` skill、`frontend-code-reviewer` agent |
| TS/JS 专项评审 | `typescript-review-YYYY-MM-DD-HHmmss.md` | `typescript-reviewer` agent |
| 安全审查 | `security-review-YYYY-MM-DD-HHmmss.md` | `security-review` skill、`frontend-security-reviewer` agent |
| 无障碍检查 | `accessibility-review-YYYY-MM-DD-HHmmss.md` | `accessibility-check` skill |
| 性能分析 | `performance-review-YYYY-MM-DD-HHmmss.md` | `performance-optimizer` agent |
| 架构方案 | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` agent |
| 设计还原度 | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md` | `ui-checker` agent |
| 设计实现 | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` agent |
| Token 映射 | `token-mapping-YYYY-MM-DD-HHmmss.md` | `design-token-mapper` agent |
| 设计计划 | `design-plan-YYYY-MM-DD-HHmmss.md` | `implement-from-design` skill |
| 测试修复 | `test-fix-YYYY-MM-DD-HHmmss.md` | `test-and-fix` skill |
| E2E 运行摘要 | `e2e-summary-YYYY-MM-DD-HHmmss.md` | `frontend-e2e-runner` agent（可选） |
| 迁移计划 | `migration-plan-YYYY-MM-DD-HHmmss.md` | `legacy-to-modern-migration` skill |

> **建议**：在 `.gitignore` 中添加 `reports/` 以避免将自动生成的报告提交到代码仓库，或保留提交以便团队成员查看历史审查记录。

---

## 📥 更新
通过 Marketplace 安装的插件，在 Claude Code 中执行：

```
/plugin marketplace update bovinphang-frontend-craft
```

或开启自动更新，每次启动 Claude Code 时自动拉取最新版本：

1. 在 Claude Code 中执行 `/plugin` 打开插件管理器
2. 切换到 **Marketplaces** 标签页
3. 选中 `bovinphang-frontend-craft`
4. 选择 **Enable auto-update**

> 第三方 Marketplace 默认不开启自动更新，需手动启用。启用后 Claude Code 每次启动时会自动刷新 Marketplace 数据并更新已安装的插件。

如果使用 Git submodule 方式安装：

```bash
git submodule update --remote .claude/plugins/frontend-craft
```

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
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/security-check.mjs\""
}
```

---


## 📄 许可证

MIT - 自由使用，根据需要修改，如果可以请回馈。

---

**如果这个仓库有帮助，请给它一个 Star。构建一些很棒的前端。**

---

## 🧭 Monorepo 发布流程

### 1）源目录作为唯一真相

以下目录是所有目标产物的唯一输入来源：

- `agents/`
- `skills/`
- `commands/`
- `templates/`

所有构建与发布产物都应由这些目录生成，不应直接修改产物目录中的文件。

### 2）一键构建多端目标

本地或 CI 可使用统一命令：

```bash
./scripts/build-targets.sh
```

建议输出目录：

- `dist/claude-plugin/`（插件包与 marketplace 元数据）
- `dist/skills-cli/`（供 Skills CLI 使用的技能包）
- `dist/docs/`（多语言文档快照）

### 3）CI 阶段

建议至少包含以下关卡：

1. **Schema 校验**：校验插件清单与发布元数据 JSON/YAML。
2. **产物 diff 检查**：重新生成产物并检查是否与已提交快照一致。
3. **版本一致性检查**：确保各 target 的 manifest / docs / changelog 版本一致。

参考 `.github/workflows/build-targets.yml`。

### 4）发布阶段

建议发布策略：

- **按 target 打 tag**：例如 `plugin/vX.Y.Z`、`skills/vX.Y.Z`、`docs/vX.Y.Z`。
- **按 target 生成 release 资产**：将 `dist/<target>/` 目录打包并上传。

参考 `.github/workflows/release-targets.yml`。

### 5）回滚策略与兼容矩阵维护

- 为每个 target 保留不可变发布产物，便于快速回滚到最近稳定 tag。
- 在文档中维护兼容矩阵（工具/代理版本 × plugin/skills 版本 × 平台支持）。
- 回滚时必须在兼容矩阵与 changelog 中记录回滚原因、影响范围与恢复版本。
