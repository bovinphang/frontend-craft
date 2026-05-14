---
name: fec-init
description: 将 frontend-craft 的项目模板（CLAUDE.md、settings.json、rules）初始化到当前项目的 .claude 目录中。
---

将 frontend-craft 提供的项目模板复制到当前项目的 `.claude/` 目录中。

## 执行步骤

1. 检查当前项目根目录下是否已存在 `.claude/` 目录。

2. 如果 `.claude/CLAUDE.md` 已存在，提示用户确认是否覆盖。不要在未确认的情况下覆盖现有文件。

3. 将以下模板文件从插件的 `${FRONTEND_CRAFT_ROOT}/templates/claude/` 与 `${FRONTEND_CRAFT_ROOT}/templates/shared/rules/` 复制到项目根目录的 `.claude/`：
   - `templates/claude/CLAUDE.md` → `.claude/CLAUDE.md`
   - `templates/claude/settings.json` → `.claude/settings.json`
   - `templates/shared/rules/vue.md` → `.claude/rules/vue.md`
   - `templates/shared/rules/react.md` → `.claude/rules/react.md`
   - `templates/shared/rules/design-system.md` → `.claude/rules/design-system.md`
   - `templates/shared/rules/testing.md` → `.claude/rules/testing.md`
   - `templates/shared/rules/git-conventions.md` → `.claude/rules/git-conventions.md`
   - `templates/shared/rules/i18n.md` → `.claude/rules/i18n.md`
   - `templates/shared/rules/performance.md` → `.claude/rules/performance.md`
   - `templates/shared/rules/api-layer.md` → `.claude/rules/api-layer.md`
   - `templates/shared/rules/state-management.md` → `.claude/rules/state-management.md`
   - `templates/shared/rules/error-handling.md` → `.claude/rules/error-handling.md`
   - `templates/shared/rules/naming-conventions.md` → `.claude/rules/naming-conventions.md`
   - `templates/shared/rules/typescript.md` → `.claude/rules/typescript.md`
   - `templates/shared/rules/code-comments.md` → `.claude/rules/code-comments.md`
   - `templates/shared/rules/ci-cd.md` → `.claude/rules/ci-cd.md`
   - `templates/shared/rules/refactoring.md` → `.claude/rules/refactoring.md`

4. 复制完成后，不要只输出提醒。先检查项目根目录中的 `package.json`、常见框架配置文件和 `.github/workflows/`，推断适用规则，然后向用户提供初始化后配置选项：
   - 推荐：自动检测并裁剪规则（默认推荐项）。根据检测结果展示建议保留和建议移除的规则，用户确认后再修改 `.claude/CLAUDE.md` 底部的规则导入部分。
   - 手动选择要保留的规则。列出已复制的规则文件，让用户选择要保留的规则，再按选择更新 `.claude/CLAUDE.md`。
   - 暂不调整，仅输出清单。保持复制结果不变，只输出初始化完成信息、文件清单和后续建议。

   推荐项的判断应保持保守：只自动建议移除明显不匹配的规则，例如纯 React 项目移除 `@./rules/vue.md`、纯 Vue 项目移除 `@./rules/react.md`、无 TypeScript/JavaScript 源码时移除 `@./rules/typescript.md`。对 `@./rules/i18n.md`、`@./rules/ci-cd.md`、`@./rules/refactoring.md` 这类依赖项目上下文的规则，优先展示为建议项并说明依据；无法确定时默认保留。

   如果当前运行环境支持结构化提问工具，使用选择题形式提问，并明确标注推荐项；否则使用编号选项。用户选择并确认前，不要修改 `.claude/CLAUDE.md` 的规则导入部分。完成裁剪或用户选择暂不调整后，再提醒用户根据项目实际情况修改 `CLAUDE.md` 的项目基础信息、常用命令、`rules/react.md` 或 `rules/vue.md` 中的技术栈配置，并检查 `settings.json` 中的权限列表是否符合项目需求。

5. 输出初始化完成的确认信息和文件清单。
