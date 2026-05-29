# 项目结构

`frontend-craft` 的详细目录布局。

## 仓库布局

```text
frontend-craft/
|-- .claude-plugin/   # Claude Code 插件与 marketplace 清单
|   |-- plugin.json         # 插件元数据
|   |-- marketplace.json    # Marketplace 目录元数据
|
|-- agents/           # 用于委托的专业子代理
|   |-- fec-architect.md    # 页面拆分、组件架构、状态流
|   |-- fec-code-reviewer.md # 前端专项代码评审（质量、安全、无障碍）
|   |-- fec-security-reviewer.md # 前端攻击面：XSS、密钥、CSP、依赖
|   |-- fec-test-planner.md # 测试策略、风险矩阵、覆盖规划
|   |-- fec-build-fixer.md # 增量修复 lint/typecheck/test/build/CI 失败
|   |-- fec-refactor-cleaner.md # 死代码和未使用依赖清理
|   |-- fec-doc-updater.md # README/runtime 文档/能力表同步
|   |-- fec-e2e-runner.md     # E2E 编写、执行、flaky 治理、产物、CI
|   |-- fec-typescript-reviewer.md    # TS/JS 类型安全、异步、报告式评审
|   |-- fec-performance-optimizer.md # 性能瓶颈分析与优化
|   |-- fec-ui-checker.md            # UI 视觉问题与设计还原度评估
|   |-- fec-figma-implementer.md     # 从设计稿精确实现 UI
|   |-- fec-design-token-mapper.md   # 将设计变量映射到 Design Tokens
|
|-- skills/           # 工作流定义和领域知识
|   |-- fec-code-review/    # 架构、类型、渲染、样式、无障碍
|   |-- fec-security-review/     # XSS、CSRF、敏感数据、输入校验
|   |-- fec-accessibility-check/     # WCAG 2.2、键盘、焦点和屏幕阅读器无障碍检查
|   |-- fec-react-project-standard/  # React + TypeScript 项目规范
|   |-- fec-vue3-project-standard/   # Vue 3 + TypeScript 项目规范
|   |-- fec-implement-from-design/   # 从设计文件实现 UI
|   |-- fec-validation-fix/            # lint、type-check、test、build 与修复
|   |-- fec-performance-optimization/  # Core Web Vitals、包体、渲染、网络、内存
|   |-- fec-source-driven-development/ # 官方来源、项目事实、版本敏感决策
|   |-- fec-typescript-type-safety/   # 类型契约、DTO 映射、类型守卫和泛型
|   |-- fec-state-management/         # 状态归属、store 选型、URL/服务端/表单/本地边界
|   |-- fec-tailwind-design-system/   # Tailwind token、组件变体、暗色模式和 class 治理
|   |-- fec-responsive-layout/        # 移动优先布局、容器查询和触摸友好的响应式 UI
|   |-- fec-dependency-upgrade/       # 依赖升级、lockfile 风险和 CVE 修复
|   |-- fec-tdd-workflow/              # 测试先行的前端实现工作流
|   |-- fec-refactor-clean/            # 安全清理死代码和未使用依赖
|   |-- fec-doc-sync/                  # 公开文档和 metadata 同步
|   |-- fec-legacy-web-standard/     # JS + jQuery + HTML 遗留项目规范
|   |-- fec-legacy-to-modern-migration/ # jQuery/MPA 迁移到 React/Vue 的策略和工作流
|   |-- fec-testing-strategy/          # 测试分层选择和覆盖矩阵
|   |-- fec-e2e-testing/                # Playwright/Cypress E2E 测试规范
|   |-- fec-nextjs-project-standard/    # Next.js 14+ App Router、SSR/SSG 规范
|   |-- fec-nuxt-project-standard/      # Nuxt 3 SSR/SSG、composables 规范
|   |-- fec-monorepo-project-standard/  # pnpm workspace、Turborepo、Nx 规范
|   |-- fec-data-fetching/              # TanStack Query 和服务端状态工作流
|   |-- fec-api-integration/            # 类型化 API client、鉴权刷新、上传、实时集成
|   |-- fec-form-handling/              # React Hook Form + Zod 表单工作流
|   |-- fec-route-protection/           # 鉴权路由和权限路由
|   |-- fec-component-testing/          # RTL / Vue Test Utils 组件测试
|   |-- fec-pwa-implementation/         # PWA manifest、service worker、离线能力
|   |-- fec-web-workers/                # Worker 集成和后台计算
|   |-- fec-canvas-threejs/             # Canvas、Three.js、React Three Fiber
|   |-- fec-svg-animation/              # SVG 动效和 reduced-motion 降级
|   |-- fec-browser-storage/            # localStorage/sessionStorage/IndexedDB/Cookies 选型与安全客户端持久化
|   |-- fec-list-virtualization/        # react-window / TanStack Virtual 大列表窗口化与测量策略
|   |-- fec-storybook-component-doc/    # Storybook 组件文档、addon、MDX、交互和视觉测试集成
|   |-- fec-ui-design/                  # UI 方向、视觉识别、打磨、状态、视觉 QA
|   |-- fec-motion-interaction/         # 交互动效、页面转场、滚动动画、reduced motion
|   |-- fec-vite-project-standard/      # Vite 配置、环境变量安全、HMR、代理、构建与 library mode
|
|-- commands/         # 快速执行的斜杠命令
|   |-- fec-init.md     # /fec-init - 初始化项目模板
|   |-- fec-review.md   # /fec-review - 代码评审
|   |-- fec-scaffold.md # /fec-scaffold - 创建 page/feature/component
|   |-- fec-plan.md     # /fec-plan - 前端变更前的实施规划
|   |-- fec-tdd.md      # /fec-tdd - 测试驱动的前端实现
|   |-- fec-build-fix.md # /fec-build-fix - 增量修复验证失败
|   |-- fec-refactor-clean.md # /fec-refactor-clean - 安全清理死代码
|   |-- fec-doc-sync.md # /fec-doc-sync - 公开文档和 metadata 同步
|
|-- hooks/            # 事件驱动自动化
|   |-- hooks.json     # PreToolUse、PostToolUse、Stop、Notification 等
|
|-- src/              # 发布运行时代码的 TypeScript 源码
|   |-- hooks/         # 打包到 dist/hooks 的运行时 hook 脚本
|   |-- security-check.ts      # 拦截危险命令
|   |-- format-changed-file.ts # 自动执行 Prettier 格式化
|   |-- run-tests.ts           # 会话结束时运行检查
|   |-- session-start.ts       # 会话开始时检测框架
|   |-- notify.ts              # 跨平台桌面通知
|   |-- install/       # 安装器核心（CLI、交互向导、运行时转换器）
|   |-- openclaw/      # OpenClaw 运行时 TypeScript 源码
|
|-- scripts/          # 仓库维护脚本源码，不发布到 npm runtime
|
|-- templates/        # 运行时专用项目模板
|   |-- claude/        # CLAUDE.md 和 settings.json
|   |-- codex/         # AGENTS.md 和 config.toml
|   |-- openclaw/      # AGENTS.md 和 OPENCLAW-CONFIG.md
|   |-- shared/rules/  # vue、react、design-system、testing、source-driven development、agent workflow、working modes 等
|
|-- .mcp.json         # MCP server 配置（Figma、Sketch、MasterGo、Pixso、墨刀）
└-- README.md
```

## 目录职责

| 目录            | 职责                                                                               |
| --------------- | ---------------------------------------------------------------------------------- |
| `agents/`       | 专业子代理定义（Markdown + YAML frontmatter）                                      |
| `bin/`          | CLI 入口（`frontend-craft.ts`）                                                    |
| `commands/`     | 自定义斜杠命令（`fec-init`、`fec-review`、`fec-scaffold` 和工作流命令）            |
| `docs/`         | 运行时安装文档和本地化 README                                                      |
| `hooks/`        | Hook 配置（`hooks.json`）                                                          |
| `scripts/`      | 仓库维护脚本源码（构建、打包、发布检查、metadata 同步），不包含在 npm 运行时输出中 |
| `skills/`       | Skill 定义（`SKILL.md`、`metadata.json`）                                          |
| `src/hooks/`    | 打包到 `dist/hooks/` 的运行时 hook 源码，供 Claude/Qoder 执行                      |
| `src/install/`  | 安装器核心（CLI、交互向导、运行时转换器）                                          |
| `src/openclaw/` | OpenClaw 运行时 TypeScript 源码                                                    |
| `templates/`    | 运行时专用项目模板（Claude/Codex/OpenClaw 配置 + shared rules）                    |
| `tests/`        | 测试套件（转换器测试、安装器测试）                                                 |
