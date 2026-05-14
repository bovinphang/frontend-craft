# frontend-craft-openclaw

[![Stars](https://img.shields.io/github/stars/bovinphang/frontend-craft?style=flat)](https://github.com/bovinphang/frontend-craft/stargazers)
[![CI](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml/badge.svg)](https://github.com/bovinphang/frontend-craft/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)

---

<div align="center">

**Language / 语言**

[English](README.md) | [**简体中文**](README.zh-CN.md)

</div>

---

**面向 OpenClaw 的 frontend-craft 原生插件包。**

`frontend-craft-openclaw` 是 [frontend-craft](https://github.com/bovinphang/frontend-craft) 的 OpenClaw 原生打包产物，包含工作流技能、Markdown 命令、OpenClaw 工作区模板、typed hooks、设计工具 MCP 参考配置，以及可选的 `frontend_craft_init_workspace` 初始化工具。

**环境要求：** Node.js **>= 22**，OpenClaw plugin API **>= 2026.4.20**。

---

## 快速开始

### 1. 安装

从 ClawHub 安装（发布后推荐）：

```bash
openclaw plugins install clawhub:frontend-craft
```

从 npm 安装：

```bash
openclaw plugins install frontend-craft-openclaw
```

从主仓库构建出的本地 tarball 安装：

```bash
npm install
npm run pack:openclaw
openclaw plugins install ./frontend-craft-openclaw-<version>.tgz
```

本地开发时可链接包目录：

```bash
openclaw plugins install -l /path/to/frontend-craft/npm-packages/openclaw
```

### 2. 启用插件

npm 包名是 `frontend-craft-openclaw`，但 OpenClaw 插件 id 是 `frontend-craft`。

```json5
{
  plugins: {
    allow: ["frontend-craft"],
    entries: {
      "frontend-craft": {
        enabled: true,
        config: {
          // 可选，字段见 openclaw.plugin.json：
          // formatAfterWrite: true,
          // notifyOnAgentEnd: true,
        },
      },
    },
  },
}
```

调整插件配置后重启网关：

```bash
openclaw gateway restart
openclaw plugins inspect frontend-craft
```

### 3. 初始化 OpenClaw 工作区

OpenClaw 通常从代理工作区加载上下文，例如 `~/.openclaw/workspace`。可使用可选工具 `frontend_craft_init_workspace`，参数为：

- `workspaceDir`：工作区根目录的绝对路径
- `overwriteAgents`：仅在需要覆盖已有 `AGENTS.md` 时设为 `true`

该工具会复制：

- `templates/openclaw/AGENTS.md` -> 工作区 `AGENTS.md`
- `templates/shared/rules/*.md` -> 工作区 `skills/frontend-craft-rules/`

你也可以手工复制这些文件。OpenClaw 配置说明见 `templates/openclaw/OPENCLAW-CONFIG.md`。

### 4. 配置设计工具 MCP

包内 `.mcp.json` 是 Figma、Sketch、MasterGo、Pixso、墨刀的参考配置。OpenClaw 原生插件不会自动合并 MCP 配置，请将其中的 `mcpServers` 拷贝到 embedded Pi / 网关 MCP 配置中。

常见环境变量：

| 变量 | 工具 |
| --- | --- |
| `FIGMA_API_KEY` | Figma / Desktop |
| `SKETCH_API_KEY` | Sketch |
| `MG_MCP_TOKEN` | MasterGo |
| `MODAO_TOKEN` | 墨刀 |

Pixso 使用 `.mcp.json` 中的本地 MCP URL。摹客暂无 MCP 集成，请使用截图或导出标注。

---

## 包结构

```text
frontend-craft-openclaw/
|-- dist/                  # 打包后的 OpenClaw 插件入口
|-- skills/                # 工作流技能
|-- commands/              # 作为技能加载的 Markdown 命令说明
|-- templates/openclaw/    # OpenClaw AGENTS.md 与配置说明
|-- templates/shared/      # 共享前端规则
|-- .mcp.json              # 设计工具 MCP 参考配置
|-- openclaw.plugin.json   # 插件元数据与配置 schema
|-- package.json
```

---

## 功能概览

### 命令

| 文件 | 用途 |
| --- | --- |
| `commands/fec-init.md` | 初始化 frontend-craft 工作区模板 |
| `commands/fec-review.md` | 引导式前端代码评审 |
| `commands/fec-scaffold.md` | 页面 / 功能 / 组件脚手架指南 |

### 技能

| 技能 | 用途 |
| --- | --- |
| `fec-frontend-code-review` | 架构、类型安全、渲染、样式、可访问性、测试、安全评审 |
| `fec-security-review` | XSS、CSRF、敏感数据泄露、不安全输入处理 |
| `fec-accessibility-check` | 面向 WCAG 的语义结构、键盘支持、焦点、标签检查 |
| `fec-react-project-standard` | React + TypeScript 项目规范 |
| `fec-vue3-project-standard` | Vue 3 + TypeScript 项目规范 |
| `fec-implement-from-design` | 基于 Figma、Sketch、MasterGo、Pixso、墨刀或截图实现 UI |
| `fec-test-and-fix` | 执行校验命令、分析失败并安全修复 |
| `fec-legacy-web-standard` | JavaScript + jQuery + HTML/CSS 传统前端规范 |
| `fec-legacy-to-modern-migration` | jQuery / MPA 迁移到 React 或 Vue + TypeScript 的策略 |
| `fec-e2e-testing` | Playwright / Cypress E2E 结构、产物、CI 与不稳定用例治理 |
| `fec-nextjs-project-standard` | Next.js App Router、SSR/SSG、路由、元数据、中间件 |
| `fec-nuxt-project-standard` | Nuxt 3 SSR/SSG、组合式函数、路由、中间件 |
| `fec-monorepo-project-standard` | pnpm workspace、Turborepo、Nx 结构与任务编排 |

### 技能使用：场景与示例

技能定义在 `skills/<id>/SKILL.md`。本插件在 `openclaw.plugin.json` 中将 `skills` 与 `commands` 注册为技能根。运行时一般会按各技能前置元数据里的 **description** 与当前任务做 **自动匹配**；具体行为取决于你的 OpenClaw / Agent 配置。**普通用户不必知道内部技能 id**，用自然语言说明目标即可；熟悉仓库的人若知道 id 也可以显式写出。

**使用建议**

- 评审或重构时尽量带上 **文件路径、目录或组件名**。
- 设计还原请提供 **Figma 链接 / 节点 id、截图**，或说明已配置的设计 MCP。
- lint、类型检查、测试或构建失败时，请写明你实际执行的 **命令**（若与常见脚本不一致）。

**常见场景与示例话术**

| 场景 | 技能（供查阅） | 示例话术（不出现技能名） |
| --- | --- | --- |
| 合并前做 PR / 分支评审 | `fec-frontend-code-review` | 「合并前请评审 `src/features/checkout/`：架构、类型、无障碍和测试；把 Markdown 报告写到 `reports/`。」 |
| 聚焦 XSS、密钥、危险 DOM | `fec-security-review` | 「请审计 `src/lib/auth.ts` 以及所有渲染或存储用户 HTML 的代码，按严重程度列出 XSS 与密钥泄露风险及修复建议。」 |
| 新弹窗 / 表单 — 键盘与 ARIA | `fec-accessibility-check` | 「检查 `src/components/ConfirmDialog.tsx` 的键盘陷阱、焦点顺序、标签与 ARIA，并给出可落地的修改建议。」 |
| 对齐 React 工程约定 | `fec-react-project-standard` | 「我们使用 React 18 和 TanStack Query，请对照成熟 React + TS 实践评审 `src/pages/Dashboard/`，并贴合现有抽象。」 |
| 对齐 Vue 工程约定 | `fec-vue3-project-standard` | 「请评审 `src/views/Settings.vue` 及相关 composables，是否符合 Vue 3 + TS 惯例并与项目其余部分一致。」 |
| 按设计稿 / 截图实现 UI | `fec-implement-from-design` | 「请按 Figma 节点 `123:456` 实现该界面：间距与设计 Token 对齐，复用现有 `Button`，并说明假设条件。」 |
| CI 或本地脚本失败 | `fec-test-and-fix` | 「`pnpm lint` 和 `pnpm test` 都挂了，请定位根因并修复，不要放宽类型或跳过检查。」 |
| 维护 jQuery / MPA 老页面 | `fec-legacy-web-standard` | 「`public/js/legacy/*.js` 仍在生产使用，请在保持行为的前提下给出可维护性改进与模式建议。」 |
| 规划 jQuery → React/Vue 迁移 | `fec-legacy-to-modern-migration` | 「我们有 `static/app.js` 的 jQuery + 多页应用，请输出迁到 React + TypeScript 的分阶段方案、风险与里程碑。」 |
| 补充或稳定 E2E | `fec-e2e-testing` | 「请用 Playwright 给登录流程加冒烟用例：目录清晰、使用 Page Object，并说明如何在 CI 里跑。」 |
| Next.js App Router 功能 | `fec-nextjs-project-standard` | 「请评审 `app/(dashboard)/reports/page.tsx` 及相关 server actions 是否符合 Next.js App Router 最佳实践（数据获取、错误、元数据等）。」 |
| Nuxt 3 页面或布局 | `fec-nuxt-project-standard` | 「请评审 `pages/admin/*.vue` 与 `composables/useApi.ts` 是否符合 Nuxt 3 的 SSR、数据与组合式用法惯例。」 |
| Monorepo 边界与任务编排 | `fec-monorepo-project-standard` | 「`apps/web` 依赖 `packages/ui`，请检查包边界、workspace 配置和 Turborepo 任务图是否有问题。」 |

**斜杠命令（`commands/` 下的 Markdown）**

作为**固定步骤**的命令说明加载。对话里用自然语言描述要做的事即可，代理可按对应命令文档执行，**无需**说出命令文件名。

| 命令文档 | 适用时机 | 示例（自然语言） |
| --- | --- | --- |
| `fec-init.md` | 在**业务仓库**里初始化 **Claude 风格** 的 `.claude/` 模板（文档内路径针对 `.claude/`）。 | 「请在本仓库初始化 `.claude/`，按插件提供的模板与规则复制；若已有文件请先问我是否覆盖。」 |
| `fec-review.md` | 引导式评审并保存 `reports/code-review-*.md`。 | 「请评审我上一次提交里改动的文件，并写一份结构化 Markdown 报告到 `reports/`。」 |
| `fec-scaffold.md` | 页面 / 功能 / 组件目录脚手架。 | 「请为 React 项目脚手架一个新页面 UserDetail：放在 `src/pages/...`，并带上空的 `components/` 与 `hooks/` 目录。」 |

### Hooks

| Hook | 行为 |
| --- | --- |
| `before_tool_call` | 拦截危险 shell / exec 类命令 |
| `after_tool_call` | 可选地对 write/edit 目标运行 Prettier（`formatAfterWrite`，默认开启） |
| `before_prompt_build` | 每个会话追加一次框架与包管理器提示 |
| `agent_end` | 运行成功时输出完成提示音 / 日志行（`notifyOnAgentEnd`，默认开启） |

### 插件配置

| 键 | 类型 | 默认 | 含义 |
| --- | --- | --- | --- |
| `formatAfterWrite` | boolean | `true` | write/edit 工具调用后运行 Prettier |
| `notifyOnAgentEnd` | boolean | `true` | agent 运行成功时输出完成提示音 / 日志行 |

---

## 从源码构建

在主 `frontend-craft` 仓库中执行：

```bash
npm install
npm run typecheck:openclaw
npm run pack:openclaw
```

`npm run pack:openclaw` 会构建并校验 OpenClaw bundle，刷新 `npm-packages/openclaw`，并在仓库根目录写出 `frontend-craft-openclaw-<version>.tgz`。

---

## License

MIT
