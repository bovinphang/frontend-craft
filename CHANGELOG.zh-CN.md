# 变更日志

[English](CHANGELOG.md)

## 未发布

### 变更

- `fec list --json` 以 JSON 输出支持的宿主列表。`fec setup --json` 将安装诊断写入 stderr。
- `fec doctor` 在只传选项时仍默认检查 Claude，并在清理缓存前拒绝无效参数。
- 公共资源改用 `@bovinphang/craft-common@2.1.0`。从 2.0.0 升级前，请先用各已安装产品退出旧公共资源引用。参见[协调升级指南](docs/cli-management.zh-CN.md)。

## [3.0.0] - 2026-11-09

### 公共能力抽取

- 新增分层工程实践和独立的 React 状态示例。
- 通过精确依赖 `@bovinphang/craft-common@2.0.0` 交付 21 个公共入口和 53 个前端入口。公共入口包括 C/C++ 语言基础及 Tauri/Electron 专项。
- 增加共享所有权、版本/语言冲突保护、事务恢复及只读迁移检查。
- [迁移指南](docs/zh-CN/common-migration.md)说明旧入口处理与独立卸载规则。

### 破坏性变更与迁移

- 顶层 `fec update` / `upgrade` 改为通过原 npm/pnpm 及原 registry 升级全局 CLI，再用新版 CLI 刷新当前项目及用户全局的托管资源；不扫描其他项目，不管理 Marketplace 安装。
- 顶层 `fec uninstall` / `remove` 默认只卸载 CLI；`--purge` 先清理已发现的托管资源并保留用户修改，清理实际失败时保留 CLI。交互终端要求确认，非交互终端必须传入 `--yes`。
- 资源命令迁至 `fec runtime install/update/uninstall [runtime]`，保留 `runtime upgrade/remove` 别名及原资源选项。`setup` 保留，顶层 `install` 为弃用兼容入口。顶层 update/uninstall 在修改前拒绝旧 runtime 位置参数和资源选项，并输出迁移指引。
- 将 `fec update codex --global` 改为 `fec runtime update codex --global`，将 `fec uninstall --local` 改为 `fec runtime uninstall --local`。临时运行使用 `npx @bovinphang/frontend-craft@latest runtime update`；`runtime update` 仅使用当前运行的 CLI 包资源，不联网获取新 CLI 包。

### 新增

- 自升级会验证 npm/pnpm 安装归属，复用原包管理器，并支持只读 `--dry-run`。CLI 已是最新版时仍会刷新资源。CLI 升级失败会停止资源更新。部分资源更新失败时，已升级的 CLI 会保留，可用 `fec runtime update` 重试。
- 临时 npx 更新检查 registry `latest`，不创建全局安装；当前版本不匹配时提示最新版 runtime 命令。npx 不支持自身卸载。源码链接、项目依赖、未知来源及含其他包的 pnpm 共享安装组均在修改前拒绝自动自身管理。

## [2.9.0] - 2026-09-26

### 新增

- **技术图工具**：新增可选本地 Mermaid 适配器及可复现的时序图、流程图和架构图样例。
- **保持行为的重构子系统**：新增 `fec-refactoring-expert`、`/fec-smell`、`/fec-refactor-plan`、`/fec-refactor`，以及 11 个重构技能，将坏味道诊断、只读规划、受控执行、行为验证、目录选择和 7 类重构手法拆分为清晰能力。
- **完整重构知识覆盖**：以用户提供的《重构：改善既有代码的设计（第 2 版）》JavaScript 版材料为知识基线，归一化 24 种代码坏味道和第 6～12 章 61 个标准重构手法，建立稳定的 `SMELL-*` / `RF-*` 标识、选择指南、组合关系和渐进式 Reference。
- **前端专项适配**：补充 TypeScript、React、Vue、hooks/composables、状态管理、路由、异步/生命周期、公开 API、SSR/hydration 与动态引用场景，同时避免把现代前端机械改写为 class hierarchy。
- **简体中文重构镜像**：在 `localized/zh-CN` 和 `docs/refactoring` 中新增自然中文的 Agent、Command、Skill、目录、坏味道矩阵与导航文档。

### 变更

- **技术图质量**：通过内容驱动布局、避障连线、可见自调用和增强 QA 保留完整 Unicode 标签。
- 代码、TypeScript 和安全审核默认覆盖全项目，也支持指定文件或目录，以及针对明确改动、PR 或提交的增量审核。报告记录覆盖范围、排除项、未审核范围和部分完成状态。全项目和指定范围审核无需 Git 差异。
- **重构安全模型**：纯重构统一采用 `GREEN → REFACTOR → GREEN`，一次只做一个主要结构变换，每步验证；新增“先回滚再修复”、`SAFE/CAUTION/DANGER` 风险分级、差异预算，以及 `PASS/PARTIAL/NOT PROVEN` 行为保持证明等级。
- **工作流边界**：新增行为和行为变化型缺陷仍由 TDD 负责；原因未知的失败仍由调试框架负责；已证明的死代码仍由 `fec-refactor-clean` 负责；一般 PR 合并就绪性仍由代码评审负责。
- 本版本包含 14 个 Agent、56 个 Skill 和 11 个 Command。
- **验证 Hook**：根据项目声明和锁文件选择 npm、pnpm、yarn 或 bun，避免重复执行验证阶段。

### 修复

- **技术图导出**：修复独立 SVG 样式、真实浏览器 PNG 几何测量及与导出图片缩放一致的 manifest。
- **内容解析与转换**：修复 Agent/Command 的非法 YAML 和过时 reviewer 引用；转换器使用解码后的描述，并安全转义 Codex TOML 指令。同名原始技能继续优先于转换后的命令。
- **发布 CLI 启动**：内置 YAML 解析器及其 Node 模块桥接，确保隔离 npm 包无需仓库开发依赖即可安装 Codex 和 OpenClaw 内容。
- 修复重构目录中的失效链接，完善本地化技能摘要。
- **受管文件归属**：加强 manifest 路径校验，避免安装或更新操作将受管内容之外的路径纳入管理。

## [2.8.0] - 2026-06-25

### 新增

- **简体中文本地化内容包**：新增 `localized/zh-CN`，覆盖 agents、commands、skills、templates、metadata、relations、评测示例与随附 helper scripts，使安装时可选择本地化的 AI 面向内容，同时根目录继续保留权威英文内容。
- **安装器语言选择**：`fec install` / `fec setup` 现在支持 `--lang en|zh-CN`；交互式安装可选择语言，不支持的语言值会清晰报错，安装 manifest 会记录 `language`，并且 `update` 在未传入 `--lang` 时复用上次 manifest 中的语言。
- **`fec-image-generation` HTML 技术图**：新增浏览器可打开的单文件图表工作流，覆盖 architecture、process workflow、sequence、data-flow、lifecycle、state-machine、runbook、PII / data-lineage、agent runtime 与 memory diagrams，支持语义节点类型、按 flow 区分的箭头、主题样式、摘要卡片与 PNG QA 交付。
- **图片生成图表脚本**：新增 `tech-diagram-render.mjs`、`interactive-diagram-server.mjs`、`export-diagram.mjs` 与 `assets/interactive-diagram.html`，用于渲染 HTML/SVG 技术图、本地 live diagram session，以及从 HTML 或 SVG 源导出 SVG/PNG/JPG 产物。
- **交互式 live diagrams**：`fec-image-generation` 新增本地浏览器草图路线，支持按 session 隔离的增量 node / edge 命令、拖拽、重命名、删除、缩放、布局更新，以及 JSON / SVG / draw.io 导出交接。
- **`drawio-export.mjs`**：新增跨平台 draw.io desktop 导出 helper，支持 PATH / 默认安装位置探测、PNG/SVG/PDF 参数、dry-run JSON 输出，并在缺少 draw.io 时给出安装建议。

### 变更

- **`localized` 包内容**：`package.json` 现在将 `localized` 纳入发布文件集，使语言包随 npm 包一起发布。
- **根内容语言策略**：根目录下的 `agents`、`commands`、`skills` 与 `templates` 现在作为英文分发内容进行校验；简体中文 AI 面向内容集中在本地化内容包中。
- **`fec-image-generation` 路由**：图表指南现在区分 Mermaid / SVG / HTML、draw.io、位图优先图片生成、live sketch、process workflow 与主题化语义系统图，帮助用户按交付需求选择正确的 source-of-truth 格式。
- **`fec-drawio-studio` 质量工作流**：强化手写 draw.io XML 指南，覆盖网格对齐、标签换行、`&#xa;` 换行、可读字号、容器留白平衡，以及 flowchart、architecture、sequence、class、ERD、mindmap、network topology 等图表模式。
- **`diagram-lint` draw.io warning**：新增 literal `\n` 标签、缺少 wrapping/html 样式、字号过小、顶点未对齐网格、页面越界与重叠 warning，最终交付可用 `--strict` 作为更强质量门。
- **draw.io shape index 打包**：源 shape index 现在以格式化的 `shape-index.json` 保存，不再使用 gzip JSON；独立技能包在打包时会压缩 data JSON，从而保持发布产物体积紧凑。
- OpenClaw 分发包从 `@bovinphang/frontend-craft` 更名为 `frontend-craft`。

### 修复

- **OpenClaw README 语言链接**：修复 OpenClaw 文档链接，使英文与简体中文版本指向 `README.openclaw.md` 与 `README.openclaw.zh-CN.md`，不再跳到根 README。
- **本地化更新行为**：当用户未传入新的 `--lang` 选项时，更新流程会从 `frontend-craft.manifest.json` 保留此前安装的内容语言。

## [2.7.0] - 2026-06-10

### 新增

- **`fec-drawio-studio` 技能**：可编辑 draw.io / diagrams.net 技术图工作流，涵盖官方 shape 查询、品牌符号、Graphviz 自动布局、多语言代码结构映射（TS / JS / Go / Python / Rust）、校验、导出兜底，并支持 `XML / Mermaid / CSV` URL 交付（`diagram-url --create`），可使用自托管 `baseUrl`、lightbox、暗色主题与 Windows `.url` 快捷方式。
- **`fec-image-generation` 技能**：覆盖示意图、图表、海报、UI mockup、信息图与图像编辑流程，并提供 `scripts/png-qa.mjs` 进行有界自修复的 PNG 视觉 QA（已纳入 `typecheck:skill-scripts` 校验范围）。
- **`fec-backend-requirements-handoff` 技能**：前端→后端需求交接，描述 UI 数据需求、用户操作、状态、权限、业务规则、不确定点和需要后端澄清的问题，不规定实现方式。
- **`fec-web-video-presentation` 技能**：将文章、口播稿、课程和 demo 转为可录屏的 16:9 步进式网页演示，包含精简参考文档、starter theme 数据和跨平台 Vite/React 脚手架 helper。
- **参考文档模块化拆分**：将多个技能的单体参考文档拆分为聚焦模块——`fec-e2e-testing`（e2e-ci-reporting / e2e-special-scenarios / e2e-visual-regression）、`fec-legacy-to-modern-migration`（migration-execution-checklist / migration-strategy-and-mapping）、`fec-performance-optimization`（framework-performance-patterns）、`fec-react-project-standard`（react-project-structure / react-runtime-patterns / react-quality-patterns / react-performance-patterns）、`fec-vue3-project-standard`（vue3-project-structure / vue3-composables-routing / vue3-state-api-quality / vue3-performance-patterns）；各 `SKILL.md` 同步指向新的聚焦参考。

### 变更

- **破坏性变更。** `fec-typescript-type-safety` 更名为 `fec-typescript-project-standard`，覆盖 TypeScript 配置、公开 API 类型、声明、DTO 和泛型。请将自定义引用更新为新技能 ID。原类型安全指南位于新技能的 `references/type-safety.md`。
- 更名后的 TypeScript 技能归入 `project-standard` 分类。
- 技能目录从 41 项增至 45 项。
- `fec-ui-design` 新增产品上下文识别、视觉方向、设计拨盘、避免通用化 UI 的指导和视觉参考策略。设计拨盘包括 `visualTension`、`motionIntensity`、`informationDensity`、`mediaAuthenticity` 和 `contentPersuasion`。
- **`fec-motion-interaction` 增强**：新增 context-aware motion intensity 引导，与 `fec-ui-design` 设计拨盘对齐。
- **`fec-implement-from-design` 增强**：在原有 Figma / Sketch / MasterGo / Pixso / 墨刀 / 摹客 基础上，新增 screenshot / section-level 视觉参考输入。
- `diagram-lint` 拒绝 XML 注释、未转义的 `&` 和尖括号、自闭合边单元格，以及缺失的根或图层单元格。顶点标签缺少 `html=1` 时会给出警告。
- **`fec-legacy-to-modern-migration`、`fec-tailwind-design-system`、`fec-responsive-layout`**：补充 Playwright 等效的验证指引，要求迁移与视觉敏感类任务构建前后行为清单并按风险选择合适的验证层（Playwright / 视觉 diff / typecheck / 单测）。
- **Shared rules 精简**：`templates/shared/rules/fec-*.md` 收敛为项目常驻的硬约束；UI 设计、Tailwind 设计系统、响应式布局、TypeScript 建模、错误处理框架内部细节、渲染模式等产品化内容转由对应技能承载；`fec-i18n.md`、`fec-responsive-design.md`、`fec-typescript.md`、`fec-state-management.md`、`fec-design-system.md`、`fec-rendering-patterns.md`、`fec-error-handling.md`、`fec-ci-cd.md`、`fec-refactoring.md` 同步精简。

### 移除

- **`fec-typescript-type-safety` 技能目录**：原目录已移除；其内容迁移至 `fec-typescript-project-standard` 的 `references/type-safety.md`。如自定义规则、agent、skill 引用了旧 id，请同步更新。

## [2.6.0] - 2026-06-07

### 新增

- **`fec-alchemy` 技能**：新增「项目吸收与原创化融合」工作流，从参考系统提取可借鉴的设计并以项目原生方式重构为原创能力；随附 `SKILL.md`、intake / absorption-plan 模板，以及涵盖方法论、原创性、许可证的参考文档。
- **`fec setup all` 子命令**：一键为所有受支持的 runtime 安装 frontend-craft，默认安装到当前项目，除非显式传入 `--global`；帮助文本现在区分终端 `fec setup` 命令与 AI 助手内的 `/fec-init` 斜杠命令。
- **技能打包脚本压缩**：`pack-skills.ts` 与 `skill-packaging.ts` 在构建期通过 esbuild 压缩，输出到 `skill-packages/` 的独立技能包体积更小。
- **关键技能参考文档**：为 `fec-debug-framework`、`fec-performance-optimization`、`fec-refactor-clean`、`fec-validation-fix` 新增独立参考文档，从各 `SKILL.md` 本地化后的「详细参考」一节链接。

### 变更

- `fec-doc-sync` 新增环境说明、脚本、API 和路由说明以及部署文档的同步范围。
- 技能目录新增 `project-evolution` 分类，其中包含 `fec-alchemy`。
- 技能目录从 40 项增至 41 项。
- 终端项目初始化命令从 `fec init` / `frontend-craft init` 更名为 `fec setup` / `frontend-craft setup`。助手内的 `/fec-init` 命令继续可用。
- 脚本中可用 `install --all` 安装到所有宿主。传入 `--global` 可写入各宿主的全局配置。

### 修复

- npm 包名改为 `@bovinphang/frontend-craft`。请更新仍使用旧作用域的安装命令。

### 移除

- **CLI `init` 命令**：终端 CLI 不再接受 `init`，遇到时直接退出并提示「Unknown command: init」；本地项目 setup 请改用 `setup`。

## [2.5.0] - 2026-06-01

### 新增

- **`init` 别名与 `fec` 快捷命令**：新增 `init` 作为 `install --local` 的别名，默认执行本地安装；在 `package.json` 中将 `fec` 作为 `frontend-craft` 的额外 bin 命令暴露。
- **卸载/移除命令**：新增 `frontend-craft uninstall` 和 `frontend-craft remove`，用于移除 manifest 管理的文件；支持 `--force` 以包含用户已修改的文件；可跨 runtime 和安装范围发现已有的 manifest 安装。
- **无 runtime 更新**：`frontend-craft update` 现在支持不指定 runtime 运行，自动刷新所有已发现的安装。
- **Manifest 根提示**：manifest 文件跟踪新增根提示（baseDir/cwd/home），支持多位置文件管理。

### 修复

- **Runtime 安装源冲突**：新增检测与交互式解决机制，当同一 runtime 从不同来源（如 Marketplace 与 CLI）安装时，防止意外覆盖并引导用户完成冲突解决。

## [2.4.0] - 2026-05-29

### 新增

- 新增 `fec-performance-optimization`（Core Web Vitals、内存泄漏、性能预算）、`fec-source-driven-development`（证据驱动决策）、`fec-state-management`、`fec-typescript-project-standard`、`fec-dependency-upgrade`、`fec-responsive-layout` 和 `fec-tailwind-design-system`。
- **6 个新技能**：`fec-performance-optimization`（Core Web Vitals、内存泄漏、性能预算）、`fec-source-driven-development`（基于官方文档验证的证据驱动决策）、`fec-state-management`（状态架构模式）、`fec-typescript-project-standard`（TypeScript 项目规范与类型安全）、`fec-dependency-upgrade`（依赖升级规划）、`fec-responsive-layout`（响应式布局策略）和 `fec-tailwind-design-system`（基于 Tailwind 的设计系统实现）。
- **2 个新集成技能**：`fec-api-integration` 和 `fec-motion-interaction`。
- **UI 设计系统生成器**：新增 `design-system.mjs` 生成器，包含产品规则、风格原型、UX 质量和 Stack UI 规则数据包；支持 `--persist` 和 `--page` 标志生成 `MASTER.md` 和页面覆盖。

### 变更

- **Agent 重命名**：将 8 个 Agent 从 `fec-frontend-*` 重命名为更短的 `fec-*` 前缀；将 `fec-frontend-code-review` 技能替换为 `fec-code-review`。
- **技能合并**：将 `fec-interface-polish` 和 `fec-ui-design-direction` 合并为统一的 `fec-ui-design` 技能，同时覆盖产品级视觉方向和细节级打磨。
- **UI 设计增强**：为 `fec-ui-design` 新增设计系统生成、Master/Page 覆盖、图表 UX、色彩韵律、视觉纹理、反泛化打磨和视觉识别检查。
- 技能分类从四类扩展为七类。
- `/fec-plan` 现同时处理实施规划和测试策略，测试规划请从 `/fec-test-plan` 迁移到 `/fec-plan`。
- 共享规则模板统一采用 `fec-` 前缀。
- `fec-storybook-component-doc` 覆盖组件文档、设计系统展示和隔离状态预览。

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

### 变更

- **Doctor 命令**：扩展 `doctor` 报告，当 runtime 为 `claude` 时自动显示 Claude 缓存状态。
- CLI 安装和更新会拒绝 Marketplace 管理的 Claude 安装，传入 `--force` 时亦然。切换 CLI 的本地或全局安装范围时，可继续更新现有范围，或先卸载再切换。

## [2.3.0] - 2026-05-22

### 新增

- 新增工作流能力：`fec-tdd-workflow`、`fec-refactor-clean`、`fec-doc-sync`、`/fec-plan`、`/fec-tdd`、`/fec-build-fix`、`/fec-refactor-clean`、`/fec-doc-sync`，以及 `fec-build-fixer`、`fec-refactor-cleaner`、`fec-doc-updater`。
- 新增 agent workflow 与 working modes 共享规则，并扩展 testing、performance、refactoring、git、comment 规则，补充 TDD、增量验证、清理和文档同步指导。
- **更新/升级命令**：新增 `frontend-craft update` 和 `frontend-craft upgrade`，基于 manifest 文件保护机制，支持安全就地更新而不会覆盖用户已修改的文件。
- npm 包包含体积更小的编译后 JavaScript 产物。

### 变更

- 增强 `fec-validation-fix` 的增量 build-fix 行为，并在 Node 安全 hook 中加入跨平台长命令日志提示。
- npm 包现在从 `dist/` 交付打包后的 CLI 和编译后的 Hook，移除了 `dist/src/`。

### 修复

- **安装 mkdir**：目标目录已存在时跳过 `mkdir`，避免重复安装时产生不必要的错误。

## [2.2.1] - 2026-05-21

### 新增

- 新增 Qoder 支持，安装器现覆盖 15 个 AI 编程宿主。
- **测试策略工作流**：新增 `fec-test-planner`、`/fec-test-plan` 和 `fec-testing-strategy`，用于按风险规划前端测试层级，覆盖静态检查、单元、组件、集成、E2E、视觉、无障碍、安全与性能等维度。
- **新前端工作流技能**：新增 `fec-ui-design-direction`、`fec-interface-polish` 和 `fec-vite-project-standard`；原验证修复流程改为 `fec-validation-fix`。
- **独立 skill 发布管线**：新增 `scripts/pack-skills.ts`、`scripts/check-skills-publish.ts`、共享 skill 打包工具，以及 `npm run pack:skills`、`npm run check:skills-publish`、`npm run pack:all`，可为每个 skill 生成并校验独立可发布包。
- **CLI 诊断与 metadata 检查**：新增 `frontend-craft matrix`、`frontend-craft doctor <runtime>` 和 `frontend-craft sync-metadata --check`，用于查看 runtime 能力矩阵、安装健康状态与公开 metadata 一致性。

### 变更

- 技能目录采用 Agent Skills 布局和 `fec-*` 前缀。本版本包含 28 个技能。
- **Runtime 能力模型**：新增显式的 runtime 能力分层，覆盖 skills、agents、commands、hooks、rules、templates、MCP、reports 与 init 行为，使安装器输出和文档能准确反映不同 runtime 的支持范围。
- **发布产物布局**：`pack:skills` 现在将独立 skill 发布包写入根目录 `skill-packages/`，不再写入 `dist/skill-packages/`，让独立发布包与 TypeScript 构建产物分离。
- `npm run build` 在编译前清理 `dist/`，避免陈旧的 JavaScript 混入新包。

### 修复

- **根 npm 包内容**：收紧 npm `files` 清单，`npm pack` 只发布编译后的 `dist/` 运行时代码和插件资产，不再泄漏 `bin/`、`src/`、`scripts/` 下的 TypeScript 源码。

### 移除

- 迁移到 `fec-*` 布局后，移除旧的无前缀 skill 目录。

## [2.1.2] - 2026-05-20

### 变更

- OpenClaw 包从 `frontend-craft-openclaw` 更名为 `frontend-craft`。归档文件改为输出到 `npm-packages/openclaw/`。
- 交互式安装器将数字选项替换为方向键导航、空格切换、退格移除、搜索过滤及分页。

## [2.1.1] - 2026-05-19

### 新增

- **11 个新技能**：`fec-data-fetching`（TanStack Query）、`fec-form-handling`（React Hook Form + Zod）、`fec-browser-storage`（客户端持久化）、`fec-route-protection`（权限路由）、`fec-component-testing`（RTL / Vue Test Utils）、`fec-storybook-component-doc`（Storybook 文档）、`fec-list-virtualization`（react-window / TanStack Virtual）、`fec-pwa-implementation`（PWA）、`fec-web-workers`（Web Worker）、`fec-canvas-threejs`（Canvas/Three.js/R3F）、`fec-svg-animation`（SVG 动画）。
- **共享规则**：`responsive-design.md`、`rendering-patterns.md` — 通过 `/fec-init` 部署。

### 变更

- **Agent 行为（`fec-code-reviewer`）**：默认只输出评审报告，不再修改业务文件，除非用户明确要求。
- **Skill 结构**：React、Vue、Next.js、Nuxt、Monorepo、legacy-web、legacy-migration、implement-from-design 等技能统一为五段式结构：Purpose / When to Use / Procedure / Constraints / Expected Output。
- **脚手架模板**：修正 React CSS import（`import './<Name>.styles.css'` 替代模块化导入）；Vue 模板使用 `<slot />` 替代裸组件标签。
- 技能目录从 13 项增至 24 项。

## [2.0.1] - 2026-05-14

### 修复

- **Claude Code 插件 hooks：** `hooks/hooks.json` 中引用内置 `dist/scripts/*.js` 时使用 **`${CLAUDE_PLUGIN_ROOT}`**，以便在 Marketplace 与 **`--plugin-dir`** 加载时由 Claude Code 正确替换插件根路径。运行时**不会**替换 **`${FRONTEND_CRAFT_ROOT}`**，在 **Windows + Git Bash** 下可能导致 hook 解析到 Git 安装目录下的错误路径。

## [2.0.0] - 2026-05-14

### 新增

- **通用 CLI** `frontend-craft`：`install`、`list`、`version`、`uninstall`（卸载仅为提示）；支持 runtime：Claude Code、Codex、Cursor、Windsurf、OpenCode、Kilo、Gemini CLI、Copilot、Antigravity、Augment、Trae、CodeBuddy、Cline、OpenClaw（`src/install/`、`bin/frontend-craft.ts`）。在 TTY 下执行 `npx frontend-craft` / 无 runtime 的 `install` 可进入交互向导；支持 `--local` / `-l` 安装到当前项目。
- 根 npm 包要求 Node.js 22 或更高版本。
- **`templates/shared/rules`** 与 **`templates/claude/`** 布局；Codex 模板在 **`templates/codex/`**；OpenClaw 模板在 **`templates/openclaw/`**。
- OpenClaw 插件并入 `frontend-craft`。运行 `npm run build:openclaw` 构建插件，再运行 `npm run pack:openclaw` 在 `npm-packages/openclaw/` 生成 `frontend-craft-<version>.tgz`。
- **`LICENSE`**（MIT）。

### 变更

- 非交互模式下，缺省宿主和安装范围分别为 Claude 和全局安装。交互终端未指定 `--global` 或 `--local` 时会提示选择范围。`install --help`、`-h` 和 `help` 只显示用法。
- Hook 脚本路径改用 `${FRONTEND_CRAFT_ROOT}`。安装器仍会展开旧配置中的 `${CLAUDE_PLUGIN_ROOT}`。
- **斜杠命令** 采用防冲突的 **`/fec-*`** 前缀：`/fec-init`、`/fec-review`、`/fec-scaffold`。旧根命令（`/init`、`/review`、`/scaffold`）及 `/frontend-craft:*` 名称不再发布。
- `/fec-init` 改用新的模板路径。
- **`scripts/sync-codex-agents-toml.ts`** 需要 **`CODEX_AGENTS_DIR`**（默认不再写入本仓库）。

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
- 报告自动保存为 Markdown 至 `reports/` 目录
