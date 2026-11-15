# 配置与报告

[English](../configuration.md) · [文档索引](../README.zh-CN.md)

按当前宿主支持的能力配置资源。Claude、Qoder 的 CLI 适配器提供 Hook，OpenClaw 原生插件使用独立 typed hooks。Codex 的设计工具连接需在宿主中配置。

## 前置条件

- **Node.js 22+**
- **npm、pnpm 或 yarn**
- **Git Bash 或兼容 shell**（仅 Windows，当 AI 运行时需要调用 shell 命令时）

## MCP 设计工具令牌

根据团队使用的设计工具设置对应环境变量：

| 变量 | 配置用途 |
| --- | --- |
| `FIGMA_API_KEY` | Figma 与 Figma Desktop 配置的凭据占位符 |
| `SKETCH_API_KEY` | Sketch 服务凭据 |
| `MG_MCP_TOKEN` | MasterGo 服务的 token 参数 |
| `MODAO_TOKEN` | 墨刀服务凭据 |

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

配置中的环境变量映射以源码 `.mcp.json` 为准。Pixso 使用 HTTP 端点 `http://localhost:3667/mcp`。先启动对应设计工具服务，再在助手中确认连接可用。MCP 配置与令牌准备完成后，才执行依赖设计上下文的任务。

## 钩子（Hooks，事件驱动）

以下表格描述 Claude 事件。Qoder 使用适配器生成的事件映射，具体能力与安装路径见 [Runtime 指南](../runtimes/)。OpenClaw 的配置见[原生包指南](../../README.openclaw.zh-CN.md)。

钩子在 AI 助手事件触发时**自动执行**，无需手动调用。

| 事件                      | 行为                                         |
| ------------------------- | -------------------------------------------- |
| `SessionStart`            | 清理 Claude 缓存，然后自动检测项目框架和包管理器 |
| `PreToolUse(Bash)`        | 拦截危险命令（`rm -rf`、force push 等）      |
| `PostToolUse(Write/Edit)` | 对修改的文件自动执行 Prettier                |
| `Stop`                    | 会话结束时去重运行可用的校验脚本并报告失败；仅在配置阻断模式时阻断 |
| `Notification`            | 跨平台桌面通知（macOS / Linux / Windows）    |

Stop 校验默认只报告失败，不阻断会话。设置 `FRONTEND_CRAFT_VALIDATION_MODE=blocking` 后，失败将返回非零状态。包管理器优先采用 `package.json` 的 `packageManager`；若未声明，则采用唯一的锁文件；多个锁文件冲突时默认使用 npm。

## MCP 集成

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

## 项目模板（`/fec-init`）

在 Claude Code 中运行 `/fec-init`，准备下表的项目模板。其他宿主使用对应运行时的模板。

<details>
<summary>查看全部 22 个模板文件</summary>

| 文件                                     | 用途                                                                  |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `CLAUDE.md`                              | 项目说明、常用命令、工作原则、安全要求                                |
| `settings.json`                          | 权限白名单/黑名单、环境变量                                           |
| `rules/fec-vue.md`                       | Vue 3 组件规范与反模式                                                |
| `rules/fec-react.md`                     | React 组件规范与反模式                                                |
| `rules/fec-typescript.md` | TypeScript 类型、契约与安全约定 |
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

## 报告输出

评审和分析工作流按下表约定在 `reports/` 输出报告，记录发现、范围和验证结果，供后续审核。

<details>
<summary>查看全部 19 种报告类型</summary>

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
| 坏味道诊断     | `refactoring/smell-YYYY-MM-DD-HHmmss.md`     | `/fec-smell`、`fec-code-smells` |
| 重构计划       | `refactoring/plan-YYYY-MM-DD-HHmmss.md`      | `/fec-refactor-plan`、`fec-refactoring` |
| 重构执行       | `refactoring/refactoring-YYYY-MM-DD-HHmmss.md` | `/fec-refactor`、`fec-refactoring`、`fec-refactoring-expert` |
| E2E 运行摘要   | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `fec-e2e-runner`（可选）                                            |
| 迁移计划       | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                    |

</details>

> **建议：** 在 `.gitignore` 中添加 `reports/` 以避免将自动生成的报告提交到代码仓库，或保留提交以便团队查看历史审查记录。
