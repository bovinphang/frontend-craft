---
name: init
description: 将 frontend-craft 的项目模板（CLAUDE.md、settings.json、rules）初始化到当前项目的 .claude 目录中。
---

将 frontend-craft 提供的项目模板复制到当前项目的 `.claude/` 目录中。

## 执行步骤

1. 检查当前项目根目录下是否已存在 `.claude/` 目录。

2. 如果 `.claude/CLAUDE.md` 已存在，提示用户确认是否覆盖。不要在未确认的情况下覆盖现有文件。

3. 将以下模板文件从插件的 `${CLAUDE_PLUGIN_ROOT}/templates/` 复制到项目根目录的 `.claude/`：
   - `templates/CLAUDE.md` → `.claude/CLAUDE.md`
   - `templates/settings.json` → `.claude/settings.json`
   - `templates/rules/vue.md` → `.claude/rules/vue.md`
   - `templates/rules/react.md` → `.claude/rules/react.md`
   - `templates/rules/design-system.md` → `.claude/rules/design-system.md`
   - `templates/rules/testing.md` → `.claude/rules/testing.md`
   - `templates/rules/git-conventions.md` → `.claude/rules/git-conventions.md`
   - `templates/rules/i18n.md` → `.claude/rules/i18n.md`
   - `templates/rules/performance.md` → `.claude/rules/performance.md`
   - `templates/rules/api-layer.md` → `.claude/rules/api-layer.md`
   - `templates/rules/state-management.md` → `.claude/rules/state-management.md`
   - `templates/rules/error-handling.md` → `.claude/rules/error-handling.md`
   - `templates/rules/naming-conventions.md` → `.claude/rules/naming-conventions.md`
   - `templates/rules/typescript.md` → `.claude/rules/typescript.md`
   - `templates/rules/code-comments.md` → `.claude/rules/code-comments.md`
   - `templates/rules/ci-cd.md` → `.claude/rules/ci-cd.md`
   - `templates/rules/refactoring.md` → `.claude/rules/refactoring.md`

4. 复制完成后，提醒用户：
   - 根据项目实际技术栈修改 `CLAUDE.md` 中的项目基础信息和常用命令
   - 在 `CLAUDE.md` 底部的规则导入部分，删除项目不使用的规则（如纯 React 项目删除 `@./rules/vue.md`，不需要 i18n 的项目删除 `@./rules/i18n.md`，无 TypeScript/JavaScript 源码时可删除 `@./rules/typescript.md`）；若项目有 CI/CD 流水线可保留 `@./rules/ci-cd.md`，若涉及从现有项目重构可保留 `@./rules/refactoring.md`
   - 根据项目实际情况修改 `rules/react.md` 或 `rules/vue.md` 中的技术栈配置；填写或更新 `package.json`、文档化依赖版本时，遵循其中「版本与依赖」条目（彼此兼容的主流稳定版本，对齐官方文档、脚手架默认值或包管理器推荐）
   - 检查 `settings.json` 中的权限列表是否符合项目需求

5. 输出初始化完成的确认信息和文件清单。
