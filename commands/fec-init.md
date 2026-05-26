---
name: fec-init
description: 按当前 AI runtime 初始化 frontend-craft 项目模板、rules 或降级说明。
---

将 frontend-craft 提供的项目模板复制到当前项目对应 runtime 的配置目录中。优先根据当前目录已有配置判断 runtime；无法判断时，按用户正在使用的工具选择。

## 执行步骤

1. 检测 runtime：
   - 存在 `.claude/` 或 Claude Code 插件环境 → `claude`
   - 存在 `.codex/` 或 `AGENTS.md` → `codex`
   - 存在 `.openclaw/`、`OPENCLAW-CONFIG.md` 或 `openclaw.plugin.json` → `openclaw`
   - 存在 `.qoder/`、`.qoder/settings.json`、`.qoder/rules/` 或 `.qoder/skills/` → `qoder`
   - 存在 `.cursor/` → `cursor`
   - 存在 `.windsurf/` → `windsurf`
   - 存在 `.opencode/` → `opencode`
   - 存在 `.kilo/` → `kilo`
   - 存在 `.gemini/` 或 `GEMINI.md` → `gemini`
   - 存在 `.github/copilot-instructions.md` 或 `.github/instructions/` → `copilot`
   - 存在 `.trae/`、`.augment/`、`.codebuddy/`、`.clinerules` 时按对应 runtime 处理
   - 仍无法判断时，询问用户当前要初始化的 runtime。

2. 按 runtime 初始化，不要在未确认时覆盖已有文件：
   - `claude`：复制 Claude 模板、hooks、commands、agents、skills 与 shared rules 到 `.claude/`；如 `.claude/CLAUDE.md` 已存在，先确认。
   - `codex`：复制 `templates/codex/AGENTS.md` 到项目根目录（如不存在）、`templates/codex/config.toml` 到 `.codex/config.toml`、shared rules 到 `.codex/rules/`；skills/agents 应由 CLI 安装流程负责。
   - `openclaw`：复制 `templates/openclaw/*.md` 到项目根目录、commands/skills 到 `.openclaw/`；如文件已存在，先确认。
   - `qoder`：复制 skills 到 `.qoder/skills/`、commands 到 `.qoder/commands/`、agents 到 `.qoder/agents/`、shared rules 到 `.qoder/rules/`、hook scripts 到 `.qoder/hooks/`，并生成或合并 `.qoder/settings.json` 的 hooks 配置。
   - `cursor`：复制 shared rules 到 `.cursor/rules/*.mdc`，保留 `fec-` skills 目录；说明 Cursor 不支持本插件 hooks。
   - `windsurf`：复制 commands 到 `.windsurf/workflows/`、shared rules 到 `.windsurf/rules/`、skills 到 `.windsurf/skills/`。
   - `opencode` / `kilo`：复制 commands 到 `.opencode/command/` 或 `.kilo/command/`，skills 到对应 `skills/`；OpenCode 可补 `.opencode/opencode.jsonc`。
   - `gemini`：复制 skills 到 `.gemini/extensions/frontend-craft/skills/`，如无 `GEMINI.md` 则由 Claude 模板改写生成。
   - `copilot`：合并 shared rules 到 `.github/instructions/frontend-craft.instructions.md`，commands 到 `.github/prompts/`。
   - `trae` / `cline`：只写入规则 bundle，并明确这是 rules-only 降级模式。
   - `antigravity` / `augment` / `codebuddy`：只安装 skills；输出“此 runtime 当前无 commands/hooks 原生适配”。

3. Claude runtime 下，将以下模板文件从插件的 `${FRONTEND_CRAFT_ROOT}/templates/claude/` 与 `${FRONTEND_CRAFT_ROOT}/templates/shared/rules/` 复制到项目根目录的 `.claude/`：
   - `templates/claude/CLAUDE.md` → `.claude/CLAUDE.md`
   - `templates/claude/settings.json` → `.claude/settings.json`
   - `templates/shared/rules/fec-vue.md` → `.claude/rules/fec-vue.md`
   - `templates/shared/rules/fec-react.md` → `.claude/rules/fec-react.md`
   - `templates/shared/rules/fec-design-system.md` → `.claude/rules/fec-design-system.md`
   - `templates/shared/rules/fec-testing.md` → `.claude/rules/fec-testing.md`
   - `templates/shared/rules/fec-git-conventions.md` → `.claude/rules/fec-git-conventions.md`
   - `templates/shared/rules/fec-i18n.md` → `.claude/rules/fec-i18n.md`
   - `templates/shared/rules/fec-performance.md` → `.claude/rules/fec-performance.md`
   - `templates/shared/rules/fec-responsive-design.md` → `.claude/rules/fec-responsive-design.md`
   - `templates/shared/rules/fec-rendering-patterns.md` → `.claude/rules/fec-rendering-patterns.md`
   - `templates/shared/rules/fec-api-layer.md` → `.claude/rules/fec-api-layer.md`
   - `templates/shared/rules/fec-state-management.md` → `.claude/rules/fec-state-management.md`
   - `templates/shared/rules/fec-error-handling.md` → `.claude/rules/fec-error-handling.md`
   - `templates/shared/rules/fec-naming-conventions.md` → `.claude/rules/fec-naming-conventions.md`
   - `templates/shared/rules/fec-typescript.md` → `.claude/rules/fec-typescript.md`
   - `templates/shared/rules/fec-code-comments.md` → `.claude/rules/fec-code-comments.md`
   - `templates/shared/rules/fec-ci-cd.md` → `.claude/rules/fec-ci-cd.md`
   - `templates/shared/rules/fec-refactoring.md` → `.claude/rules/fec-refactoring.md`
   - `templates/shared/rules/fec-agent-workflow.md` → `.claude/rules/fec-agent-workflow.md`
   - `templates/shared/rules/fec-working-modes.md` → `.claude/rules/fec-working-modes.md`

4. 复制完成后，不要只输出提醒。先检查项目根目录中的 `package.json`、常见框架配置文件和 `.github/workflows/`，推断适用规则，然后向用户提供初始化后配置选项：
   - 推荐：自动检测并裁剪规则（默认推荐项）。根据检测结果展示建议保留和建议移除的规则，用户确认后再修改 `.claude/CLAUDE.md` 底部的规则导入部分。
   - 手动选择要保留的规则。列出已复制的规则文件，让用户选择要保留的规则，再按选择更新 `.claude/CLAUDE.md`。
   - 暂不调整，仅输出清单。保持复制结果不变，只输出初始化完成信息、文件清单和后续建议。

   推荐项的判断应保持保守：只自动建议移除明显不匹配的规则，例如纯 React 项目移除 `@./rules/fec-vue.md`、纯 Vue 项目移除 `@./rules/fec-react.md`、无 TypeScript/JavaScript 源码时移除 `@./rules/fec-typescript.md`。对 `@./rules/fec-i18n.md`、`@./rules/fec-ci-cd.md`、`@./rules/fec-refactoring.md` 这类依赖项目上下文的规则，优先展示为建议项并说明依据；无法确定时默认保留。

   如果当前运行环境支持结构化提问工具，使用选择题形式提问，并明确标注推荐项；否则使用编号选项。用户选择并确认前，不要修改 `.claude/CLAUDE.md` 的规则导入部分。完成裁剪或用户选择暂不调整后，再提醒用户根据项目实际情况修改 `CLAUDE.md` 的项目基础信息、常用命令、`rules/fec-react.md` 或 `rules/fec-vue.md` 中的技术栈配置，并检查 `settings.json` 中的权限列表是否符合项目需求。

5. 输出初始化完成的确认信息和文件清单。
