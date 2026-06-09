# 变更日志

> **English:** [CHANGELOG.md](CHANGELOG.md)

本文件为 [CHANGELOG.md](CHANGELOG.md) 的简体中文镜像，便于中文读者阅读；版本与条目与英文版保持一致。

格式参考 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

自 **2.0.0** 起，面向发布的说明以英文 `CHANGELOG.md` 为权威来源；历史条目可能保留最初撰写语言。



## [2.6.0] - 2026-06-07

### 新增

- **`fec-alchemy` 技能**：新增「项目吸收与原创化融合」工作流，从参考系统提取可借鉴的设计并以项目原生方式重构为原创能力；随附 `SKILL.md`、intake / absorption-plan 模板，以及涵盖方法论、原创性、许可证的参考文档。
- **`fec setup all` 子命令**：一键为所有受支持的 runtime 安装 frontend-craft，默认安装到当前项目，除非显式传入 `--global`；帮助文本现在区分终端 `fec setup` 命令与 AI 助手内的 `/fec-init` 斜杠命令。
- **README 技能表补全 `fec-debug-framework`**：该技能此前已在 `skills/` 中提供，现统一收录到各语言 README 技能表与 marketplace 元数据中。
- **`scripts/sync-version.ts`**：将 `package.json` 的版本号同步到 `.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json`（包含 npm source 钉版）、`openclaw.plugin.json`，以及 `skills/metadata.json` 的每条技能记录。可通过 `npm run sync:version` 执行；已接入 `version` 生命周期脚本。
- **技能打包脚本压缩**：`pack-skills.ts` 与 `skill-packaging.ts` 在构建期通过 esbuild 压缩，输出到 `skill-packages/` 的独立技能包体积更小。
- **关键技能参考文档**：为 `fec-debug-framework`、`fec-performance-optimization`、`fec-refactor-clean`、`fec-validation-fix` 新增独立参考文档，从各 `SKILL.md` 本地化后的「详细参考」一节链接。

### 变更

- **`fec-doc-sync` 同步范围扩展**：文档同步工作流与技能描述现在覆盖环境变量说明、脚本、接口/路由说明与部署文档，不再局限于面向用户的文档；示例提示词、`/fec-doc-sync` 命令文档以及 `skills/metadata.json` 同步更新。
- **技能分类新增 `project-evolution`**：在原 `implementation-capability` / `testing` / `review-quality` / `design-ui` / `legacy-migration` / `maintenance-docs` 之外新增 `project-evolution`，`fec-alchemy` 归入此类；各语言 README 技能表、marketplace 关键词以及 `tests/install/metadata-consistency.test.ts` 白名单同步更新。
- **技能数量**：40 → 41，已同步到各语言 README 与 `skills/metadata.json`。
- **README 安装章节重构**：en / zh-CN / zh-TW / ja-JP / ko-KR 五种语言的 README 重新组织为 3 个安装选项（从 4 个收敛），步骤编号 1–6，并补充 `--local` / `--global` 两种场景下的 `install --all` 示例，新增「Preview / query」步骤展示 `dry-run` 与 `fec list`。「选项 1」改为「全局安装 fec CLI」，使 `npm install -g` 步骤不再有歧义；Claude Code Marketplace 下移至「选项 3」。
- **CLI setup 帮助文本**：明确说明 `npm install -g` 仅安装终端 `fec` 命令，若要写入 AI 工具的全局配置需额外传 `--global`；脚本化的全 runtime 安装必须使用 `install --all`，不能使用 `install all`。
- **`SKILL.md` References 本地化**：每份 `SKILL.md` 的「References」章节标题统一为「详细参考」，与既有中文优先的文档约定一致。
- **`pnpm-lock.yaml` 纳入版本控制**：pnpm 已成为仓库规范化的包管理器。
- **Marketplace 插件 source 钉版**：`marketplace.json` 的 source 字段现由 `sync-version.ts` 与 `package.json` 保持一致，无需手工修改。
- **CLI 项目 setup 命令重命名**：终端里的项目初始化快捷命令从 `fec init` / `frontend-craft init` 重命名为 `fec setup` / `frontend-craft setup`；AI 助手内的 `/fec-init` 斜杠命令保持不变。`src/install/cli.ts` 的帮助文本、命令分发与默认安装位置同步更新；`tests/install/cli.test.ts` 已断言新 `setup` 命令并校验旧 `init` 会被拒绝。

### 修复

- **插件安装命令作用域**：README、runtime 文档与 marketplace 描述现在统一引用 `@bovinphang/frontend-craft` npm 作用域；先前未带作用域的 `@frontend-craft` 引用已修正。

### 移除

- **CLI `init` 命令**：终端 CLI 不再接受 `init`，遇到时直接退出并提示「Unknown command: init」；本地项目 setup 请改用 `setup`。

### 工程

- **`SKILL.md` BOM 清理**：从 23 份 `SKILL.md` 的首行移除 UTF-8 字节顺序标记（BOM, U+FEFF），避免部分编辑器与工具把首字符渲染为不可识别字形。
- **JSON 元数据格式统一**：`sync-version.ts` 迁移后，统一 `marketplace.json` 与 `skills/metadata.json` 的缩进与末尾换行规范。
- **`CONTRIBUTING` 贡献指南**：补充分场景的检查指引（技能编写、安装器变更、runtime 模板变更、OpenClaw 打包），让贡献者在提 PR 前明确应执行哪些命令。
- **Runtime 文档**：在 `docs/runtimes/` 的各 runtime 安装文档中补充构建与 Marketplace 排错说明。
- **npm 包作用域迁移**：发布包更名为 `@bovinphang/frontend-craft`；安装命令、`pack:skills` 输出路径、README 徽标与 OpenClaw staging 路径同步刷新。


## [2.5.0] - 2026-06-01

### 新增

- **`init` 别名与 `fec` 快捷命令**：新增 `init` 作为 `install --local` 的别名，默认执行本地安装；在 `package.json` 中将 `fec` 作为 `frontend-craft` 的额外 bin 命令暴露。
- **卸载/移除命令**：新增 `frontend-craft uninstall` 和 `frontend-craft remove`，用于移除 manifest 管理的文件；支持 `--force` 以包含用户已修改的文件；可跨 runtime 和安装范围发现已有的 manifest 安装。
- **无 runtime 更新**：`frontend-craft update` 现在支持不指定 runtime 运行，自动刷新所有已发现的安装。
- **Manifest 根提示**：manifest 文件跟踪新增根提示（baseDir/cwd/home），支持多位置文件管理。

### 修复

- **Runtime 安装源冲突**：新增检测与交互式解决机制，当同一 runtime 从不同来源（如 Marketplace 与 CLI）安装时，防止意外覆盖并引导用户完成冲突解决。

### 变更

- **安装文档**：更新所有 5 种语言的 README 安装章节，补充 runtime 选择选项、卸载/移除命令文档和源冲突指引。
- **README 同步**：同步所有 README 翻译中的 Agent 名称、设计工具、规则文件数量、徽章和措辞。

### 工程

- **类型安全**：为 `design-system.mjs` 补充 JSDoc 类型注解，并扩展 `typecheck` 脚本以覆盖 skill 脚本。
- **元数据格式**：统一 marketplace 和 skills 元数据文件的 JSON 格式。

## [2.4.0] - 2026-05-29

### 新增

- **调试工作流**：新增 `/fec-debug` 斜杠命令（按类型自动路由）、`fec-debugger` agent（复杂诊断场景）和 `fec-debug-framework` skill（5 步诊断方法论）。
- **6 个新技能**：`fec-performance-optimization`（Core Web Vitals、内存泄漏、性能预算）、`fec-source-driven-development`（基于官方文档验证的证据驱动决策）、`fec-state-management`（状态架构模式）、`fec-typescript-project-standard`（TypeScript 项目规范与类型安全）、`fec-dependency-upgrade`（依赖升级规划）、`fec-responsive-layout`（响应式布局策略）和 `fec-tailwind-design-system`（基于 Tailwind 的设计系统实现）。
- **2 个新集成技能**：`fec-api-integration` 和 `fec-motion-interaction`。
- **示例提示库**：新增 `docs/example-prompts.md` 和 `docs/zh-CN/example-prompts.md`，涵盖技能、Agent、命令、设计工作流、测试、维护和运行时配置等场景化提示目录；已在所有 README 变体中添加链接。
- **UI 设计系统生成器**：新增 `design-system.mjs` 生成器，包含产品规则、风格原型、UX 质量和 Stack UI 规则数据包；支持 `--persist` 和 `--page` 标志生成 `MASTER.md` 和页面覆盖。

### 变更

- **Agent 重命名**：将 8 个 Agent 从 `fec-frontend-*` 重命名为更短的 `fec-*` 前缀；将 `fec-frontend-code-review` 技能替换为 `fec-code-review`。
- **技能合并**：将 `fec-interface-polish` 和 `fec-ui-design-direction` 合并为统一的 `fec-ui-design` 技能，同时覆盖产品级视觉方向和细节级打磨。
- **UI 设计增强**：为 `fec-ui-design` 新增设计系统生成、Master/Page 覆盖、图表 UX、色彩韵律、视觉纹理、反泛化打磨和视觉识别检查。
- **技能分类**：从 4 个类别细化为 7 个——`implementation-capability`、`testing`、`review-quality`、`design-ui`、`legacy-migration`、`maintenance-docs`；已同步更新 5 种语言的 README 表格。
- **统一规划入口**：将 `/fec-test-plan` 合并到 `/fec-plan`，根据用户意图自动分流到实施规划或测试策略规划；已更新所有 README 变体、openclaw 文档、示例提示、项目结构和 Marketplace 元数据（9 → 8 个命令）。
- **规则命名**：所有模板共享规则统一添加 `fec-` 前缀；已更新 README、CHANGELOG、Agent、命令、技能、安装器和测试。
- **技能描述**：优化技能描述、提示示例和 README 排版；明确 `fec-storybook-component-doc` 的范围为组件文档、设计系统展示和隔离状态预览。

### 修复

- **技能关系**：将技能关系与 Agent 导航解耦，防止错误的交叉引用。

### 移除

- `/fec-build-fix` 斜杠命令和 `fec-build-fixer` Agent——已被新的调试工作流取代。
- `/fec-test-plan` 斜杠命令——测试规划意图现由 `/fec-plan` 统一处理。
- `fec-interface-polish` 和 `fec-ui-design-direction` 技能——已合并到 `fec-ui-design`。

## [2.3.1] - 2026-05-25

### 新增

- **Claude 缓存清理 hook**：新增 `fec-cleanup-claude-cache` hook，用于在会话启动时自动管理 Claude 缓存。
- **缓存诊断**：为 `frontend-craft doctor claude` 新增 `--fix-cache` 和 `--dry-run` 参数，用于检查和清理过期缓存条目。
- **新模块**：`src/install/claude-cache.ts`，提供缓存报告生成、清理逻辑和结果渲染。
- **Hook 注册**：在 `hooks/hooks.json` 和 `scripts/build-dist.ts` 中注册 `fec-cleanup-claude-cache`。

### 变更

- **Doctor 命令**：扩展 `doctor` 报告，当 runtime 为 `claude` 时自动显示 Claude 缓存状态。
- **安装文档**：明确 Claude Code Marketplace 作为 Claude Code 用户的首选单一安装来源；记录 CLI install/update 即使带 `--force` 也会拒绝 Marketplace 管理的 Claude 安装，并说明 CLI local/global 冲突需保持已安装来源更新，或先卸载再切换。
- **测试覆盖**：新增 `tests/install/claude-cache.test.ts`；扩展 end-to-end、metadata 一致性及 update 测试覆盖。

## [2.3.0] - 2026-05-22

### 新增

- 新增工作流能力：`fec-tdd-workflow`、`fec-refactor-clean`、`fec-doc-sync`、`/fec-plan`、`/fec-tdd`、`/fec-build-fix`、`/fec-refactor-clean`、`/fec-doc-sync`，以及 `fec-build-fixer`、`fec-refactor-cleaner`、`fec-doc-updater`。
- 新增 agent workflow 与 working modes 共享规则，并扩展 testing、performance、refactoring、git、comment 规则，补充 TDD、增量验证、清理和文档同步指导。
- **更新/升级命令**：新增 `frontend-craft update` 和 `frontend-craft upgrade`，基于 manifest 文件保护机制，支持安全就地更新而不会覆盖用户已修改的文件。
- **esbuild 压缩**：在构建流水线中新增 esbuild 压缩步骤，使 `dist/` 编译产物更小。
- **版本同步脚本**：新增 `scripts/sync-version.ts`，在 `package.json`、`openclaw.json` 及 skill manifest 之间自动传播版本号，保持各元数据文件一致。

### 变更

- 增强 `fec-validation-fix` 的增量 build-fix 行为，并在 Node 安全 hook 中加入跨平台长命令日志提示。
- **构建流水线重构**：将 hook 脚本从 `hooks/` 迁移至 `src/hooks/`，构建流水线切换为 tsx 编译，CLI 入口打包至 `dist/bin/`，npm 发布包不再包含 `dist/src/`。
- **安装模块类型注解**：为安装模块补充完整的 TypeScript 类型标注，提升类型安全与编辑器体验。
- **README 布局**：将详细目录树替换为简要摘要与完整项目结构文档的链接。
- **CONTRIBUTING 文档**：更新 `CONTRIBUTING.md` 与 `CONTRIBUTING.zh-CN.md`，反映 tsx 构建流水线及 hook 脚本迁移至 `src/hooks/` 的变更。

### 修复

- **安装 mkdir**：目标目录已存在时跳过 `mkdir`，避免重复安装时产生不必要的错误。

## [2.2.1] - 2026-05-21

### 新增

- **Qoder runtime 支持**：新增 `qoder` 安装器、runtime 文档、能力元数据、README 说明和 Marketplace 关键词。通用安装器现在记录并支持 15 个 AI coding runtime。
- **测试策略工作流**：新增 `fec-test-planner`、`/fec-test-plan` 和 `fec-testing-strategy`，用于按风险规划前端测试层级，覆盖静态检查、单元、组件、集成、E2E、视觉、无障碍、安全与性能等维度。
- **新前端工作流技能**：新增 `fec-ui-design-direction`、`fec-interface-polish` 和 `fec-vite-project-standard`；原验证修复流程改为 `fec-validation-fix`。
- **独立 skill 发布管线**：新增 `scripts/pack-skills.ts`、`scripts/check-skills-publish.ts`、共享 skill 打包工具，以及 `npm run pack:skills`、`npm run check:skills-publish`、`npm run pack:all`，可为每个 skill 生成并校验独立可发布包。
- **CLI 诊断与 metadata 检查**：新增 `frontend-craft matrix`、`frontend-craft doctor <runtime>` 和 `frontend-craft sync-metadata --check`，用于查看 runtime 能力矩阵、安装健康状态与公开 metadata 一致性。
- **Skill 评估数据集**：新增 `skills/eval_queries.json`，用于验证 skill 发现与路由质量。

### 变更

- **TypeScript 迁移**：将通用 CLI、安装器、runtime 转换器、hook 脚本、OpenClaw 打包脚本和测试从 `.mjs` 迁移到 TypeScript，并通过 `dist/` 下的编译产物作为运行入口。
- **Agentskills 兼容的 skill 布局**：所有 skill 目录统一为 `fec-*` 命名，补充 frontmatter 与 references 文件结构，将 `skills/metadata.json` 扩展至 28 个 skills，并同步英文、简体中文、繁体中文、日文和韩文 README 的技能目录树。
- **Runtime 能力模型**：新增显式的 runtime 能力分层，覆盖 skills、agents、commands、hooks、rules、templates、MCP、reports 与 init 行为，使安装器输出和文档能准确反映不同 runtime 的支持范围。
- **Claude/OpenClaw 打包元数据**：刷新插件描述、支持的 runtime 关键词与 hook 命令示例，使其匹配 TypeScript 构建产物以及当前 10 agents / 28 skills / 4 commands 的能力范围。
- **发布产物布局**：`pack:skills` 现在将独立 skill 发布包写入根目录 `skill-packages/`，不再写入 `dist/skill-packages/`，让独立发布包与 TypeScript 构建产物分离。
- **干净的 TypeScript 构建**：`npm run build` 现在会在编译前清理 `dist/`，避免历史生成的 JavaScript 文件混入后续打包产物。

### 修复

- **根 npm 包内容**：收紧 npm `files` 清单，`npm pack` 只发布编译后的 `dist/` 运行时代码和插件资产，不再泄漏 `bin/`、`src/`、`scripts/` 下的 TypeScript 源码。
- **打包回归测试**：新增 npm pack 校验，防止 TypeScript 源码泄漏、无对应源码的陈旧编译文件残留，以及根 npm 包误包含独立 `skill-packages/`。

### 移除

- 迁移到 `fec-*` 布局后，移除旧的无前缀 skill 目录。
- 移除已不匹配当前包结构的旧迁移文档与 skills fusion 评估文档。

## [2.1.2] - 2026-05-20

### 变更

- **CONTRIBUTING 文档**：完善 `CONTRIBUTING.md` 与 `CONTRIBUTING.zh-CN.md`，新增项目结构概览、本地开发与调试指南、测试说明（Node.js `node:test`、单文件运行、通过 `FRONTEND_CRAFT_FORCE_INTERACTIVE=1` 测试交互模式）、OpenClaw 构建管线（`build`/`typecheck`/`pack`）、`scripts/` 目录参考表，以及安装器架构关系图。

- **OpenClaw 包重命名**：`frontend-craft-openclaw` → `frontend-craft`。npm 包名、tarball 文件名及 README 引用全部更新。打包产物改写入 `npm-packages/openclaw/` 而非仓库根目录。影响 `scripts/openclaw/pack-openclaw.ts`、`README.md`、`README.zh-CN.md`、`README.openclaw.md`、`README.openclaw.zh-CN.md` 及 `docs/MIGRATION-FROM-LEGACY-REPOS.md`。CHANGELOG 中 2.0.0/2.0.1 历史条目也已同步修正。

- **交互式安装向导**：将数字选择提示升级为 TTY 交互式可选 prompt 系统，支持 ↑↓ 导航、Space 切换、Backspace 删除、搜索过滤和分页。影响 `src/install/interactive.ts`，并在 `tests/install/cli.test.ts` 中新增测试覆盖。

## [2.1.1] - 2026-05-19

### 新增

- **11 个新技能**：`fec-data-fetching`（TanStack Query）、`fec-form-handling`（React Hook Form + Zod）、`fec-browser-storage`（客户端持久化）、`fec-route-protection`（权限路由）、`fec-component-testing`（RTL / Vue Test Utils）、`fec-storybook-component-doc`（Storybook 文档）、`fec-list-virtualization`（react-window / TanStack Virtual）、`fec-pwa-implementation`（PWA）、`fec-web-workers`（Web Worker）、`fec-canvas-threejs`（Canvas/Three.js/R3F）、`fec-svg-animation`（SVG 动画）。
- **共享规则**：`responsive-design.md`、`rendering-patterns.md` — 通过 `/fec-init` 部署。
- **metadata 一致性测试**：`tests/install/metadata-consistency.test.ts` 校验 `skills/metadata.json`、README 表格与 Marketplace 描述保持同步。

### 变更

- **Agent 行为（`fec-code-reviewer`）**：默认只输出评审报告，不再修改业务文件，除非用户明确要求。
- **Skill 结构**：React、Vue、Next.js、Nuxt、Monorepo、legacy-web、legacy-migration、implement-from-design 等技能统一为五段式结构：Purpose / When to Use / Procedure / Constraints / Expected Output。
- **脚手架模板**：修正 React CSS import（`import './<Name>.styles.css'` 替代模块化导入）；Vue 模板使用 `<slot />` 替代裸组件标签。
- **Marketplace 描述**：skills 数量从 13 → 24，补充新能力（组件测试、路由保护、PWA、Web Workers、Canvas/Three.js、SVG 动画）。
- **Skills 融合评估报告**（`docs/skills-fusion-assessment.md`）：从 399 行精简为 64 行结论版，附覆盖矩阵。

## [2.0.1] - 2026-05-14

### 修复

- **Claude Code 插件 hooks：** `hooks/hooks.json` 中引用内置 `dist/scripts/*.js` 时使用 **`${CLAUDE_PLUGIN_ROOT}`**，以便在 Marketplace 与 **`--plugin-dir`** 加载时由 Claude Code 正确替换插件根路径。运行时**不会**替换 **`${FRONTEND_CRAFT_ROOT}`**，在 **Windows + Git Bash** 下可能导致 hook 解析到 Git 安装目录下的错误路径。

### 变更

- **版本号：** 根 npm 包、`.claude-plugin` 清单、`openclaw.plugin.json` 以及 `npm-packages/openclaw/` 中的 **`frontend-craft`** 暂存包均升至 **2.0.1**。

## [2.0.0] - 2026-05-14

### 新增

- **通用 CLI** `frontend-craft`：`install`、`list`、`version`、`uninstall`（卸载仅为提示）；支持 runtime：Claude Code、Codex、Cursor、Windsurf、OpenCode、Kilo、Gemini CLI、Copilot、Antigravity、Augment、Trae、CodeBuddy、Cline、OpenClaw（`src/install/`、`bin/frontend-craft.ts`）。在 TTY 下执行 `npx frontend-craft` / 无 runtime 的 `install` 可进入交互向导；支持 `--local` / `-l` 安装到当前项目。
- **根目录 `package.json`**：Node 22+ `engines`、npm `files` 清单、通过 `node --test` 运行的测试。
- **`templates/shared/rules`** 与 **`templates/claude/`** 布局；Codex 模板在 **`templates/codex/`**；OpenClaw 模板在 **`templates/openclaw/`**。
- **`openclaw.plugin.json`** 与 **`src/openclaw/`** TypeScript 插件（由原 `frontend-craft-openclaw` 合并）；`npm run build:openclaw` 构建，`npm run pack:openclaw` 在 **`npm-packages/openclaw/`** 生成 **`frontend-craft-<version>.tgz`**（打包过程会暂存至 `npm-packages/openclaw/`）。
- **`docs/runtimes/*.md`** 各 runtime 安装摘要（含非交互场景下 `--local` / `--global` 提示）。
- **`LICENSE`**（MIT）。
- **开源治理**：英文 `CONTRIBUTING.md`、简体中文 **CONTRIBUTING.zh-CN.md**、`SECURITY.md` / **SECURITY.zh-CN.md**、`CODE_OF_CONDUCT.md` / **CODE_OF_CONDUCT.zh-CN.md**、**CHANGELOG.zh-CN.md**、GitHub Issue 模板、PR 模板与 CI 工作流。

### 变更

- **CLI 安装体验：** 非交互终端在缺少 runtime 或缺少安装范围时，默认 **全局 `claude`** 并打印提示；TTY 下可询问 Global / Local，除非已传入 `--global` / `--local`；`install` 参数中的 `--help` / `-h` / `help` 仅打印帮助，不执行安装。
- **Hooks** 与文档中的脚本路径改用 **`${FRONTEND_CRAFT_ROOT}`**（安装器仍会将旧占位符 `${CLAUDE_PLUGIN_ROOT}` 展开以兼容）。
- **斜杠命令** 采用防冲突的 **`/fec-*`** 前缀：`/fec-init`、`/fec-review`、`/fec-scaffold`。旧根命令（`/init`、`/review`、`/scaffold`）及 `/frontend-craft:*` 名称不再发布。
- **`commands/fec-init.md`** 已按新模板路径更新。
- **`scripts/sync-codex-agents-toml.ts`** 需要 **`CODEX_AGENTS_DIR`**（默认不再写入本仓库）。
- **README** 已补充贡献、安全、行为准则与 CI 状态链接，便于国际贡献者。

### 移除

- 顶层 **`templates/rules/`**（迁至 `templates/shared/rules/`）；**`templates/CLAUDE.md`** / **`templates/settings.json`** 迁至 **`templates/claude/`**。

## [1.1.0] - 2026-03-18

### 新增

- `fec-legacy-to-modern-migration` skill — jQuery/MPA 迁移至 React/Vue 3 + TS 的策略与流程
- `fec-e2e-testing` skill — Playwright/Cypress E2E 测试规范
- `fec-nextjs-project-standard` skill — Next.js 项目规范（App Router、SSR/SSG）
- `fec-nuxt-project-standard` skill — Nuxt 3 项目规范（SSR/SSG）
- `fec-monorepo-project-standard` skill — Monorepo 项目规范
- `rules/fec-ci-cd.md` 模板 — CI/CD 流水线规范
- `rules/fec-refactoring.md` 模板 — 重构项目约束（图片、样式、功能等价）
- CONTRIBUTING.md — 贡献指南
- CHANGELOG.md — 版本变更记录

### 变更

- `testing.md` — 补充 E2E 测试规则
- `fec-architect` agent — 增加 `fec-legacy-to-modern-migration` skill 引用
- `fec-legacy-to-modern-migration` skill — 新增重构实施要求：图片（使用原项目资源、禁止内联 SVG）、样式（参考效果不照搬 CSS、优先 flex、禁止内联样式）、目标（视觉交互一致、功能等价、代码更简洁易维护）

---

## [1.0.0] - 2026-03-18

### 新增

- 初始发布
- 5 个 Agents：fec-architect、performance-optimizer、ui-checker、figma-implementer、design-token-mapper
- 9 个 Skills：fec-code-review、fec-security-review、fec-accessibility-check、fec-react-project-standard、fec-vue3-project-standard、fec-implement-from-design、fec-test-and-fix、fec-legacy-web-standard、fec-legacy-to-modern-migration
- 3 个 Commands：init、review、scaffold
- Hooks：SessionStart、PreToolUse、PostToolUse、Stop、Notification
- 11 个规则模板：CLAUDE.md、settings.json、vue、react、design-system、testing、git-conventions、i18n、performance、api-layer、state-management、error-handling、naming-conventions
- MCP 集成：Figma、Sketch、MasterGo、Pixso、墨刀
- 多语言 README：English、简体中文、繁體中文、日本語、한국어
- 报告自动保存为 Markdown 至 `reports/` 目录
