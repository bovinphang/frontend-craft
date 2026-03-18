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
2. `.claude/rules/` — 删除不适用的规则文件（如纯 React 项目删除 `vue.md`，不需要 i18n 的项目删除 `i18n.md`）
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

✨ **完成！** 你现在可以使用 5 个代理、9 个技能和 3 个命令。

---

## 🌐 跨平台支持

此插件完全支持 **Windows、macOS 和 Linux**。所有钩子和脚本均使用 Node.js 实现，确保跨平台兼容。

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
|   └-- legacy-to-modern-migration/  # jQuery/MPA 迁移至 React/Vue 策略与流程
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

### Agents（子代理）

| Agent | 用途 | 输出报告 |
|-------|------|----------|
| `frontend-architect` | 页面拆分、组件架构、状态流设计、目录规划、大型重构 | `architecture-proposal-*.md` |
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
| 代码审查 | `code-review-YYYY-MM-DD-HHmmss.md` | `/review` 命令、`frontend-code-review` skill |
| 安全审查 | `security-review-YYYY-MM-DD-HHmmss.md` | `security-review` skill |
| 无障碍检查 | `accessibility-review-YYYY-MM-DD-HHmmss.md` | `accessibility-check` skill |
| 性能分析 | `performance-review-YYYY-MM-DD-HHmmss.md` | `performance-optimizer` agent |
| 架构方案 | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `frontend-architect` agent |
| 设计还原度 | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md` | `ui-checker` agent |
| 设计实现 | `design-implementation-YYYY-MM-DD-HHmmss.md` | `figma-implementer` agent |
| Token 映射 | `token-mapping-YYYY-MM-DD-HHmmss.md` | `design-token-mapper` agent |
| 设计计划 | `design-plan-YYYY-MM-DD-HHmmss.md` | `implement-from-design` skill |
| 测试修复 | `test-fix-YYYY-MM-DD-HHmmss.md` | `test-and-fix` skill |
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
