# 贡献指南

> **English:** [CONTRIBUTING.md](CONTRIBUTING.md)

感谢你对 `frontend-craft` 的关注。欢迎通过 Issue、Pull Request、文档修正、runtime 适配、示例补充等方式参与贡献。

## 开发环境

- Node.js >= 22，用于通用安装器与 OpenClaw 包构建。
- Git。
- 本地开发前运行 `npm install`。

常用校验：

```bash
npm test
npm run typecheck:openclaw
```

## 项目结构

```
├── agents/          # Agent 定义（Markdown + YAML frontmatter）
├── bin/             # CLI 入口 (frontend-craft.ts)
├── commands/        # 自定义命令定义 (fec-init, fec-review, fec-scaffold)
├── docs/            # 各 runtime 安装文档与多语言 README
├── hooks/           # Hook 配置 (hooks.json)
├── scripts/         # 辅助脚本（格式化、通知、安全检查、测试运行等）
├── skills/          # Skill 定义 (SKILL.md + metadata.json)
├── src/             # 源代码
│   ├── install/     # 安装器核心 (CLI、交互式向导、各 runtime 转换器)
│   └── openclaw/    # OpenClaw runtime TypeScript 源码
├── templates/       # 模板文件 (Claude/Codex/OpenClaw 配置 + 共享规则)
├── tests/           # 测试用例
│   ├── converters/  # 转换器测试
│   └── install/     # 安装器测试 (CLI、端到端、全 runtime dry-run)
└── package.json     # 项目配置与脚本
```

## 本地开发与调试

```bash
# 1. 安装依赖
npm install

# 2. 本地安装到指定 runtime（如 claude）
node dist/bin/frontend-craft.js install claude --local --dry-run  # 先 dry-run 预览
node dist/bin/frontend-craft.js install claude --local            # 实际安装

# 3. 安装到所有 runtime
node dist/bin/frontend-craft.js install --all --dry-run

# 4. 列出所有支持的 runtime
node dist/bin/frontend-craft.js list
```

## 测试指南

测试使用 Node.js 内置 `node:test` + `assert/strict`。

```bash
# 运行所有测试
npm test

# 运行单个测试文件
node --test dist/tests/install/cli.test.js

# 运行安装器相关测试
node --test dist/tests/install/*.js

# 运行转换器相关测试
node --test dist/tests/converters/*.js

# 运行全 runtime dry-run 测试
node --test dist/tests/install/all-runtimes-dry.test.js
```

测试交互式安装向导时，设置 `FRONTEND_CRAFT_FORCE_INTERACTIVE=1` 环境变量：

```bash
FRONTEND_CRAFT_FORCE_INTERACTIVE=1 node --test dist/tests/install/cli.test.js
```

## OpenClaw 构建流程

OpenClaw runtime 有独立的构建管线：

```bash
npm run build:openclaw          # 使用 esbuild 将 TypeScript 打包到 dist/openclaw/
npm run typecheck:openclaw      # TypeScript 类型检查
npm run check:openclaw-dist     # 验证 dist 完整性
npm run pack:openclaw           # 完整构建 + 验证 + 打包
```

源码路径：`src/openclaw/`（TypeScript）→ `dist/openclaw/index.js`（打包后的 ESM）。
TypeScript 配置：`tsconfig.openclaw.json`。

## Scripts 目录说明

| 脚本                                        | 用途                      |
| ------------------------------------------- | ------------------------- |
| `scripts/run-tests.ts`                     | 测试运行辅助              |
| `scripts/format-changed-file.ts`           | 格式化变更文件            |
| `scripts/security-check.ts`                | 安全检查                  |
| `scripts/notify.ts`                        | 通知脚本                  |
| `scripts/session-start.ts`                 | 会话初始化                |
| `scripts/sync-codex-agents-toml.ts`        | 同步 Codex agents 配置    |
| `scripts/openclaw/build.ts`                | OpenClaw esbuild 打包     |
| `scripts/openclaw/pack-openclaw.ts`        | OpenClaw 打包             |
| `scripts/openclaw/verify-openclaw-dist.ts` | 验证 OpenClaw dist 完整性 |

## 架构概览

通用安装器的架构如下：

```
bin/frontend-craft.ts
  └─ src/install/cli.ts              # CLI 入口（解析命令：install/list/version/uninstall）
       ├─ src/install/registry.ts    # runtime 注册表（名称 + 安装器映射）
       ├─ src/install/converters/     # 各 runtime 适配器（claude, codex, cursor, copilot 等）
       ├─ src/install/interactive.ts # 交互式安装向导（runtime/位置选择）
       ├─ src/install/runtime-homes.ts # 全局/本地目录约定
       └─ src/install/types.ts       # 共享 TypeScript 类型
```

`src/install/converters/` 下的每个 runtime 转换器都实现了 `types.ts` 中定义的 `InstallContext` 接口，将 skills、agents、commands、hooks 和模板写入目标 runtime 的配置目录。

## 分支策略

- `main` — 稳定发布分支。
- `develop` — 开发分支（如使用）。
- `feature/<name>` — 新功能。
- `fix/<name>` — Bug 修复。
- `docs/<name>` — 文档更新。

## 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```text
<type>(<scope>): <description>

[optional body]
[optional footer]
```

常见类型：

| Type       | 含义             |
| ---------- | ---------------- |
| `feat`     | 新功能           |
| `fix`      | Bug 修复         |
| `docs`     | 文档             |
| `refactor` | 重构             |
| `test`     | 测试             |
| `chore`    | 构建、工具或维护 |

示例：

```text
feat(skills): add e2e testing skill
fix(hooks): resolve Windows path handling
docs(readme): update installation steps
```

## 语言与文档策略

英文是公开项目治理、runtime 文档、发布说明和 GitHub 协作模板的**源语言**。多语言 README 应聚焦用户向摘要，并在贡献者或维护者细节上链接回英文文档。

当 Pull Request 修改公共行为、安装步骤、runtime、agent、skill、command 或 hook 时：

- 优先更新 `README.md` 与 `CHANGELOG.md`（及对应的 [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md) 若需同步中文读者）。
- 若影响用户，需同步 `README.zh-CN.md`、`docs/zh-TW/README.md`、`docs/ja-JP/README.md` 和 `docs/ko-KR/README.md` 中的用户向摘要。
- Claude Code Marketplace 的安装与更新说明以 [`docs/runtimes/claude.md`](docs/runtimes/claude.md) 与 [`docs/runtimes/claude.zh-CN.md`](docs/runtimes/claude.zh-CN.md) 为准；修改该流程时请更新这两份文件（根 README 与各语言 README 仅链向它们）。
- 若同一 PR 无法完成翻译，请创建或链接后续 Issue，并在 PR 描述中说明。
- 各语言版本中的代码示例、runtime 名称、命令名、文件路径和包名应保持一致。

Issue 与 PR 使用英文最便于全球社区检索与 Review。若你更习惯中文，也欢迎提交；维护者可协助翻译标题和摘要。

## 如何添加 Skill

1. 在 `skills/` 下创建目录，例如 `skills/fec-my-skill/`。
2. 创建 `SKILL.md`，包含 YAML frontmatter 与简洁说明：

```markdown
---
name: fec-my-skill
description: Use when the user needs ...
---

# Skill Title

## When to Use

- ...

## Core Rules

- ...
```

3. 在 `README.md` 的 Skills 表格中新增一行。
4. 若可见目录结构变化，同步 `README.md` 与各语言 README 的目录树。

## 如何添加 Agent

1. 创建 `agents/my-agent.md`。
2. 定义 YAML frontmatter：

```markdown
---
name: my-agent
description: Use this agent when ...
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
skills:
  - relevant-skill
---
```

3. 在 `README.md` 的 Agents 表格中新增一行。
4. 当数量或用户向描述变化时，同步 `README.zh-CN.md`、`docs/*/README.md` 与 `.claude-plugin/marketplace.json`。

## 如何添加 Command

1. 创建 `commands/my-command.md`。
2. 使用 YAML frontmatter 与 Markdown 描述执行步骤。
3. 在 `README.md` 的 Commands 表格中新增一行，并按需同步多语言用户向摘要。

## 如何添加 Rule 模板

1. 在 `templates/shared/rules/` 下创建 `my-rule.md`。
2. 在 `commands/fec-init.md` 的复制清单中新增该文件。
3. 在 `templates/claude/CLAUDE.md` 的规则导入示例中补充（如适用）。

## 多工具安装器

- 入口：`bin/frontend-craft.ts`。
- 实现目录：`src/install/`（安装器、注册表、路径辅助）。
- 交互向导与输入解析：`src/install/interactive.ts`（测试可将 `FRONTEND_CRAFT_FORCE_INTERACTIVE` 设为 `1` 以模拟管道输入下的问答）。
- 新增 runtime 时，在 `src/install/registry.ts` 注册。
- 在 `src/install/converters/` 下添加 runtime 安装器。
- 参考 `src/install/runtime-homes.ts` 中的全局目录约定。
- 在 `tests/install/` 中新增或更新测试。

## 如何添加 Hook

1. 更新 `hooks/hooks.json`。
2. 如需脚本，放在 `scripts/` 下，并优先使用跨平台 Node.js。
3. 在 `hooks/hooks.json` 中，引用内置 `scripts/` 入口请使用 **`${CLAUDE_PLUGIN_ROOT}`**（Claude Code 会在运行时替换；见官方 [Plugins reference](https://code.claude.com/docs/en/plugins-reference)）。本仓库的 Claude 安装器在将 `hooks.json` 写入 `.claude/` 时，也会把 **`${CLAUDE_PLUGIN_ROOT}`** 及旧占位符 **`${FRONTEND_CRAFT_ROOT}`** 展开为绝对路径。
4. 更新 `README.md` 的 Hooks 表格。

## Pull Request 自检

提交 PR 前请确认：

- [ ] 变更范围清晰，描述明确。
- [ ] `npm test` 通过。
- [ ] 修改 OpenClaw 代码或模板时，`npm run typecheck:openclaw` 通过。
- [ ] 用户可见行为变化已更新 `README.md` 与 `CHANGELOG.md`（及 [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md) 如适用）。
- [ ] 多语言 README 已同步，或已链接后续翻译 Issue。
- [ ] 新增 runtime、agent、skill、command、hook 或模板时，包含相关测试或 dry-run 覆盖。
- [ ] 涉及安全敏感逻辑时，已按 [SECURITY.zh-CN.md](SECURITY.zh-CN.md) / [SECURITY.md](SECURITY.md) 检查。

## 代码风格

- Markdown 使用稳定标题和清晰表格。
- Skill 与 Agent 描述保持简洁，因为模型路由依赖这些描述。
- 自动化脚本优先使用跨平台 Node.js。
- 除非特定 runtime 明确需要，否则避免依赖某个 shell 的特性。

## 问题反馈

使用 [GitHub Issues](https://github.com/bovinphang/frontend-craft/issues) 提交 Bug 或功能建议。请尽量包含 runtime、操作系统、Node.js 版本、执行命令、预期行为和实际行为。

**安全敏感漏洞**不要提交公开 Issue，请按 [SECURITY.zh-CN.md](SECURITY.zh-CN.md)（或 [SECURITY.md](SECURITY.md)）处理。
