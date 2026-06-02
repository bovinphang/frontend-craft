# 贡献指南

> **English:** [CONTRIBUTING.md](CONTRIBUTING.md)

感谢你对 `frontend-craft` 的关注。欢迎通过 Issue、Pull Request、文档修正、runtime 适配、示例补充等方式参与贡献。

## 开发环境

- Node.js >= 22，用于通用安装器与 OpenClaw 包构建。
- Git。
- 本地开发前运行 `npm install`。

仅修改文档时，重点阅读语言与文档策略以及 Pull Request 自检。修改 skill 或 OpenClaw 时，请在提交 PR 前参考下方对应章节。

快速自检（最小推荐）：

```bash
npm test                         # 通用校验
npm run pack:skills              # Skill 变更
npm run check:skills-publish     # Skill 变更
npm run typecheck:openclaw       # OpenClaw 变更
```

完整的场景化命令请见后文 npm scripts 与 Pull Request 自检。

## 项目结构

```
├── agents/          # Agent 定义（Markdown + YAML frontmatter）
├── bin/             # CLI 入口 (frontend-craft.ts)
├── commands/        # 自定义命令定义 (fec-init, fec-review, fec-scaffold)
├── docs/            # 各 runtime 安装文档与多语言 README
├── hooks/           # Hook 配置 (hooks.json)
├── scripts/         # 源码运行的维护脚本（构建、打包、发布校验）
├── skills/          # Skill 定义 (SKILL.md + metadata.json)
├── src/             # 源代码
│   ├── hooks/       # runtime hook 源码，打包到 dist/hooks/
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

# 2. 构建 dist/bin 与 dist/hooks
npm run build

# 3. 本地安装到指定 runtime（如 claude）
node dist/bin/frontend-craft.js install claude --local --dry-run  # 先 dry-run 预览
node dist/bin/frontend-craft.js install claude --local            # 实际安装

# 4. 安装到所有 runtime
node dist/bin/frontend-craft.js install --all --dry-run

# 5. 列出所有支持的 runtime
node dist/bin/frontend-craft.js list
```

`npm run build` 会依次运行 `clean`、`typecheck` 和 `scripts/build-dist.ts`。本地使用 `dist/bin/frontend-craft.js` 或打包后的 hook 脚本前，请先运行它。

## 测试指南

测试使用 Node.js 内置 `node:test` + `assert/strict`。

```bash
# 运行所有测试
npm test

# 运行单个测试文件
node --import tsx --test tests/install/cli.test.ts

# 运行安装器相关测试
node --import tsx --test tests/install/*.test.ts

# 运行转换器相关测试
node --import tsx --test tests/converters/*.test.ts

# 运行全 runtime dry-run 测试
node --import tsx --test tests/install/all-runtimes-dry.test.ts
```

测试交互式安装向导时，设置 `FRONTEND_CRAFT_FORCE_INTERACTIVE=1` 环境变量：

```bash
FRONTEND_CRAFT_FORCE_INTERACTIVE=1 node --import tsx --test tests/install/cli.test.ts
```

`npm test` 会先运行 `npm run build`，再通过 `tsx` 执行 `tests/` 下精选的 converter 与 installer 测试。

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

## 独立 Skill 发布包

Skill 的权威源文件位于 `skills/<skill-id>/`。不要手动修改 `skill-packages/` 下的生成产物。

```bash
npm run pack:skills            # 为每个 skill 生成独立发布包
npm run check:skills-publish   # 校验包元数据、索引和引用文件
npm run pack:all               # 构建 + 测试 + OpenClaw 包 + 独立 skill 包
```

`npm run pack:skills` 会生成 `skill-packages/<skill-id>/`，其中包含 `SKILL.md`、该 skill 实际引用的 `references/` 文件、`metadata.json`、`package.json`、`README.md` 和 `LICENSE`。同时会生成 `skill-packages/index.json`，供平台索引或发布自动化使用。

修改 skill 时，请保持这些源文件一致：

- `skills/<skill-id>/SKILL.md` — runtime 使用的权威说明。
- `skills/metadata.json` — 发布元数据、分类、标签、关键词、目标平台和包版本。
- `skills/eval_queries.json` — 用于路由质量检查的正向/负向触发样例。
- 当公开 skill 列表或用户可见行为变化时，同步 `README.md` 和各语言 README 摘要。

## npm scripts

请把 `package.json` scripts 作为公开的开发入口。

| Script                         | 用途                                                                       |
| ------------------------------ | -------------------------------------------------------------------------- |
| `npm run clean`                | 删除 `dist/`。                                                             |
| `npm run typecheck`            | 运行主项目 TypeScript 检查，并检查 skill 辅助脚本。                        |
| `npm run build`                | 运行 `clean`、`typecheck`，并通过 `scripts/build-dist.ts` 打包 CLI/hooks。 |
| `npm test`                     | 先构建，再通过 `tsx` 运行精选的 `node:test` 测试集。                       |
| `npm run build:openclaw`       | 构建主项目，然后打包 OpenClaw runtime 输出。                               |
| `npm run audit:skills`         | 构建后输出 skill 说明长度与描述重叠度信号。                                |
| `npm run typecheck:openclaw`   | 使用 `tsconfig.openclaw.json` 检查 OpenClaw 类型。                         |
| `npm run check:openclaw-dist`  | 校验生成的 OpenClaw dist 输出。                                            |
| `npm run pack:openclaw`        | 构建、校验并打包 OpenClaw 插件。                                           |
| `npm run pack:skills`          | 先构建，再在 `skill-packages/` 下生成独立 skill 包。                       |
| `npm run check:skills-publish` | 先构建，再校验独立 skill 包元数据与复制文件。                              |
| `npm run pack:all`             | 构建、运行测试、打包 OpenClaw、打包 skills，并校验 skill 产物。             |
| `npm run sync:version`         | 同步发布清单中的 package 版本元数据。                                      |
| `npm run version`              | 运行 `sync:version`，并为 npm version 工作流暂存版本清单。                 |
| `npm run prepack`              | 在 `npm pack` 前构建。                                                     |
| `npm run prepublishOnly`       | 在 npm publish 前同步版本并运行测试。                                      |

常见变更类型建议：

- Skill 变更：运行 `npm test`、`npm run audit:skills`、`npm run pack:skills` 和 `npm run check:skills-publish`。
- OpenClaw 变更：运行 `npm run typecheck:openclaw` 和 `npm run pack:openclaw`。
- 发布打包：运行 `npm run pack:all`；`prepublishOnly` 也会在发布前执行版本同步和测试。

## 源码维护脚本

维护脚本位于 `scripts/`，通过 `tsx` 直接运行源码；它们不会以 `dist/scripts` 形式发布。

| 文件                                       | 用途                           |
| ------------------------------------------ | ------------------------------ |
| `scripts/audit-skills.ts`                  | Skill 大小与触发描述重叠度审计 |
| `scripts/build-dist.ts`                    | CLI 与 runtime hook 打包       |
| `scripts/clean-dist.mjs`                   | 删除生成的 `dist/` 输出        |
| `scripts/sync-codex-agents-toml.ts`        | 同步 Codex agents 配置         |
| `scripts/sync-version.ts`                  | 同步发布版本元数据             |
| `scripts/pack-skills.ts`                   | 独立 skill 包构建              |
| `scripts/check-skills-publish.ts`          | 独立 skill 包校验              |
| `scripts/skill-packaging.ts`               | skill 打包共享辅助函数         |
| `scripts/openclaw/build.ts`                | OpenClaw esbuild 打包          |
| `scripts/openclaw/pack-openclaw.ts`        | OpenClaw 打包                  |
| `scripts/openclaw/verify-openclaw-dist.ts` | 验证 OpenClaw dist 完整性      |

## Runtime Hook 脚本

Hook 脚本位于 `src/hooks/`，发布时会打包到 `dist/hooks/` 供 runtime 使用。维护脚本位于 `scripts/`，通过 `tsx` 直接运行源码，不再发布为 `dist/scripts`。

| 源文件                             | 打包输出                            | 用途           |
| ---------------------------------- | ----------------------------------- | -------------- |
| `src/hooks/run-tests.ts`           | `dist/hooks/run-tests.js`           | 测试运行辅助   |
| `src/hooks/format-changed-file.ts` | `dist/hooks/format-changed-file.js` | 格式化变更文件 |
| `src/hooks/security-check.ts`      | `dist/hooks/security-check.js`      | 安全检查       |
| `src/hooks/notify.ts`              | `dist/hooks/notify.js`              | 通知脚本       |
| `src/hooks/session-start.ts`       | `dist/hooks/session-start.js`       | 会话初始化     |

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

3. 在 `skills/metadata.json` 中新增条目，包括 `id`、展示名称 `name`、分类 `category`、`tags`、`summary`、发布元数据、`keywords` 和 `platforms`。其中 `version`、`license`、`homepage`、`repository` 应与 `package.json` 保持一致。
4. 在 `skills/eval_queries.json` 中补充正向和负向触发样例。
5. 在 `README.md` 的 Skills 表格中新增一行。
6. 若可见目录结构变化，同步 `README.md` 与各语言 README 的目录树。
7. 运行 `npm test`、`npm run pack:skills` 和 `npm run check:skills-publish`。

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
2. 如需 runtime hook 脚本，放在 `src/hooks/` 下，并优先使用跨平台 Node.js。
3. 在 `scripts/build-dist.ts` 中新增对应入口，确保 `npm run build` 会将其打包到 `dist/hooks/`。
4. 在 `hooks/hooks.json` 中，引用内置 hook 入口请使用 **`${CLAUDE_PLUGIN_ROOT}/dist/hooks/<script>.js`**（Claude Code 会在运行时替换根路径；见官方 [Plugins reference](https://code.claude.com/docs/en/plugins-reference)）。本仓库的 Claude 安装器在将 `hooks.json` 写入 `.claude/` 时，也会把 **`${CLAUDE_PLUGIN_ROOT}`** 及旧占位符 **`${FRONTEND_CRAFT_ROOT}`** 展开为绝对路径。
5. 仓库维护脚本继续放在 `scripts/`，不要在 runtime hook 配置中直接引用它们。
6. 更新 `README.md` 的 Hooks 表格。

## Pull Request 自检

提交 PR 前请确认：

- [ ] 变更范围清晰，描述明确。
- [ ] `npm test` 通过。
- [ ] 修改 skill 时，`npm run audit:skills`、`npm run pack:skills` 与 `npm run check:skills-publish` 通过。
- [ ] 修改 OpenClaw 代码或模板时，`npm run typecheck:openclaw` 与 `npm run pack:openclaw` 通过。
- [ ] 用户可见行为变化已更新 `README.md` 与 `CHANGELOG.md`（及 [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md) 如适用）。
- [ ] 多语言 README 已同步，或已链接后续翻译 Issue。
- [ ] 新增 runtime、agent、skill、command、hook 或模板时，包含相关测试或 dry-run 覆盖。
- [ ] 发布打包相关变更已通过 `npm run pack:all`，或已由 `prepublishOnly` 发布门禁覆盖。
- [ ] 涉及安全敏感逻辑时，已按 [SECURITY.zh-CN.md](SECURITY.zh-CN.md) / [SECURITY.md](SECURITY.md) 检查。

## 代码风格

- Markdown 使用稳定标题和清晰表格。
- Skill 与 Agent 描述保持简洁，因为模型路由依赖这些描述。
- 自动化脚本优先使用跨平台 Node.js。
- 除非特定 runtime 明确需要，否则避免依赖某个 shell 的特性。

## 问题反馈

使用 [GitHub Issues](https://github.com/bovinphang/frontend-craft/issues) 提交 Bug 或功能建议。请尽量包含 runtime、操作系统、Node.js 版本、执行命令、预期行为和实际行为。

**安全敏感漏洞**不要提交公开 Issue，请按 [SECURITY.zh-CN.md](SECURITY.zh-CN.md)（或 [SECURITY.md](SECURITY.md)）处理。
