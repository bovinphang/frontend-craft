# 示例提示词

安装 `frontend-craft` 后，可以在任意受支持的运行时中使用这些提示词。普通用户不需要记住内部 skill、command 或 agent 名称；只要说明目标，并补充文件路径、框架、失败命令、设计链接或验收标准即可。

每条示例都使用同一结构：

- **场景**：什么时候使用。
- **提示词**：可直接复制或按需调整。
- **适用能力**：最可能触发的 `frontend-craft` 能力。
- **预期产物**：助手应该输出什么。
- **补充说明**：能提升结果质量的上下文。

## 开始使用

| 场景             | 提示词                                                                                                                | 适用能力                     | 预期产物                                         | 补充说明                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------ | -------------------------- |
| 初始化项目规则   | 「请用 frontend-craft 为当前运行时初始化这个仓库的项目模板；如果已有文件，覆盖前先询问我。」                          | `/fec-init`                  | 安装运行时配置、规则和项目说明，或给出覆盖方案。 | 最好在业务仓库根目录执行。 |
| 选择安装位置     | 「我想在这台机器上同时给 Codex 和 Claude Code 使用 frontend-craft。请说明应该本地安装还是全局安装，并给出准确命令。」 | runtime docs                 | 简短建议和安装命令。                             | 说明个人使用还是团队共享。 |
| 学会怎么提问     | 「请根据这个仓库给我 5 条 frontend-craft 提示词，分别用于评审、开发、测试、排查构建失败和设计稿实现。」               | 文档指引                     | 贴合当前项目的提示词集合。                       | 安装后第一次使用很适合。   |
| 确认能力是否可用 | 「请检查这个仓库，并总结当前可用的 frontend-craft commands、skills、agents、hooks 和 MCP 模板。」                     | runtime docs                 | 基于已安装文件的能力摘要。                       | 升级后很有用。             |

## 评审与质量

| 场景                | 提示词                                                                                                                           | 适用能力                                                    | 预期产物                                               | 补充说明                                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------- |
| 评审最近改动        | 「合并前请评审我最近的改动。重点看架构、类型安全、渲染行为、样式、无障碍和缺失测试；先列问题。」                                 | `fec-code-review`、`fec-code-reviewer`、`/fec-review`       | 按严重级别排序的评审，带文件引用和测试缺口。           | 可补充分支名或 diff 范围。                   |
| PR 合并准备         | 「请把 `src/features/checkout/` 当作 PR 评审，指出阻塞项、风险假设，以及合并前必须补的测试。」                                   | `fec-code-reviewer`                                         | 合并准备度判断和结构化报告。                           | 若运行时可访问 PR，可贴 PR 链接。            |
| TypeScript 专项评审 | 「请审计本次改动中的 `.ts` 和 `.tsx`：不安全类型、异步问题、过宽接口、陈旧派生状态、React/TypeScript 惯用法。」                  | `fec-typescript-reviewer`                                   | TypeScript 专项问题清单，通常只报告不修改。            | JS/TS 改动占主要部分时最适合。               |
| 类型契约评审        | 「请评审 `src/features/billing/` 的 API DTO、组件 props、泛型工具和类型守卫，找出不安全断言、过宽类型和缺失的运行时收窄。」      | `fec-typescript-project-standard`、`fec-typescript-reviewer`     | 类型边界问题、更安全的建模建议和类型测试建议。         | 适合 SDK、设计系统或 API 密集改动。          |
| 安全审查            | 「请审计 `src/lib/auth.ts`、API client 和所有渲染用户 HTML 的代码，关注 XSS、token 泄露、不安全存储、CSRF 假设和危险 DOM API。」 | `fec-security-review`、`fec-security-reviewer`              | 按严重程度排序的安全问题和修复建议。                   | 补充鉴权模型和存储约束。                     |
| 无障碍检查          | 「请检查 `src/components/ConfirmDialog.tsx` 的焦点陷阱、键盘流程、标签、ARIA、读屏行为、触摸目标和 WCAG 2.2 AA 问题。」          | `fec-accessibility-check`                                   | 无障碍问题和可落地修改建议。                           | 视觉焦点问题最好附截图。                     |
| 性能审查            | 「请基于证据分析 dashboard 性能：Core Web Vitals、包体积、渲染热点、数据瀑布流、内存泄漏和合理性能预算。」                       | `fec-performance-optimization`、`fec-performance-optimizer` | 性能报告，包含基线证据、优先级、验证命令和针对性修复。 | 有 Lighthouse、trace、profile 或慢路径更好。 |
| UI 还原度评审       | 「请对比设置页实现与截图/设计链接，列出布局、间距、字体、状态和响应式差异。」                                                    | `fec-ui-checker`                                            | UI 还原度报告和修复建议。                              | 提供截图或设计来源。                         |

## 规划与架构

| 场景         | 提示词                                                                                                                   | 适用能力                                                | 预期产物                                                     | 补充说明                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------- |
| 功能规划     | 「先不要写代码，请规划账号账单功能：路由结构、组件边界、数据流、状态归属、校验流程和上线风险。」                         | `/fec-plan`、`fec-architect`                            | 架构方案和实施计划。                                         | 补充验收标准和限制。              |
| 拆分复杂页面 | 「请先在方案层面重构 `src/pages/Dashboard.tsx`：组件边界、hooks、状态归属和安全迁移步骤。」                              | `fec-architect`、`fec-refactor-clean`                   | 重构计划和风险控制。                                         | 如果只要计划，请明确不要改代码。  |
| 测试策略     | 「针对 checkout 重写，请把风险映射到静态检查、单元测试、组件测试、E2E、视觉检查、无障碍和安全覆盖。」                    | `/fec-plan`、`fec-testing-strategy`、`fec-test-planner` | 测试矩阵和优先级。                                           | 大改动前很适合。                  |
| 来源驱动决策 | 「修改 Next.js 缓存方案前，请先核对当前项目代码和官方文档，总结版本假设、推荐模式、迁移影响和需要补的测试。」            | `fec-source-driven-development`                         | 基于来源的决策摘要，包含项目事实、官方依据、假设和验证步骤。 | 适合可能随版本变化的框架/库行为。 |
| 遗留迁移     | 「我们有一个 jQuery 多页应用在 `public/js/legacy/`。请制定分阶段迁移到 React + TypeScript 的方案，同时不阻塞日常需求。」 | `fec-legacy-to-modern-migration`                        | 迁移计划、风险、里程碑和兼容策略。                           | 补充发布节奏和遗留约束。          |

## 功能实现

| 场景               | 提示词                                                                                                                                      | 适用能力                                                     | 预期产物                                           | 补充说明                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------- | ------------------------------------- |
| React 功能         | 「请构建一个 React + TypeScript 用户详情页，遵循本仓库的组件、hook、路由、状态和 API 模式。」                                               | `fec-react-project-standard`                                 | 符合本地 React 约定的代码。                        | 补充目标路由和 API 形状。             |
| Vue 3 功能         | 「请用 Vue 3 + TypeScript 实现 `Settings.vue`，使用 Composition API，必要时用 Pinia，并复用现有 composables。」                             | `fec-vue3-project-standard`                                  | 符合项目约定的 Vue 代码。                          | 若有 SSR/client-only 约束请说明。     |
| Next.js App Router | 「请评审并改进 `app/(dashboard)/reports/page.tsx`：App Router 数据获取、metadata、loading/error 状态、server/client 边界和 actions。」      | `fec-nextjs-project-standard`                                | Next.js 专项问题或代码修改。                       | 补充路由分组行为。                    |
| Nuxt 3 页面        | 「请在 Nuxt 3 中构建 admin reports 页面，处理 SSR 行为、`useFetch`/composables、中间件和类型化 server routes。」                            | `fec-nuxt-project-standard`                                  | 符合 Nuxt 约定的实现。                             | 说明该路由是 SSR、SSG 还是 SPA。      |
| Vite 配置          | 「请审计 `vite.config.ts`：HMR、环境变量暴露、开发代理、构建产物、依赖预构建和插件顺序。」                                                  | `fec-vite-project-standard`                                  | Vite 配置问题和安全修改。                          | 补充构建或 dev server 症状。          |
| 官方文档核对       | 「请确认当前 Vite 版本是否还需要这个依赖预构建 workaround。先看项目配置和官方文档，再建议是否删除。」                                       | `fec-source-driven-development`、`fec-vite-project-standard` | 版本感知的建议，包含来源说明、回退和验证计划。     | 适合删除兼容代码前使用。              |
| Monorepo 边界      | 「请检查 `apps/web` 和 `packages/ui` 的包边界、workspace 依赖、构建脚本和 Turborepo/Nx 任务图。」                                           | `fec-monorepo-project-standard`                              | 边界与任务编排评审。                               | 补充包管理器和 workspace 文件。       |
| 依赖升级           | 「为这个仓库规划 Vite 和 Storybook 升级：查 release notes，识别 breaking changes，评审 lockfile 与 peer dependency 风险，并提出验证矩阵。」 | `fec-dependency-upgrade`、`fec-source-driven-development`    | 升级批次、来源依据、影响范围、验证命令和回滚说明。 | 大版本升级不要和无关重构混在一起。    |
| 服务端状态         | 「请评审 `src/queries/useReports.ts`：query key、缓存时间、失效策略、乐观更新、错误状态和 suspense/loading 行为。」                         | `fec-data-fetching`                                          | TanStack Query / 服务端状态建议或实现。            | 补充 API 变化频率和 UX 预期。         |
| 状态归属           | 「请审计 dashboard 的状态归属：哪些属于 URL 参数、TanStack Query、本地组件 state、浏览器持久化或全局 store，并给出安全迁移方案。」          | `fec-state-management`                                       | 状态清单、归属决策、store 边界和验证步骤。         | 适合 store 重构或清理重复状态前使用。 |
| 后端需求交接       | 「请为订单详情页写一份前端到后端的需求交接：需要展示的数据、用户动作、UI 状态、权限规则、不确定点和后端问题清单。」                       | `fec-backend-requirements-handoff`                           | 面向后端的需求说明，聚焦 UI 需要什么和待确认问题。 | 后端拥有实现方案、接口形状前使用。    |
| API 集成           | 「请为 checkout 设计类型化 API 集成层：client 边界、错误映射、鉴权刷新、上传策略，以及订单更新用 polling、SSE 还是 WebSocket。」            | `fec-api-integration`                                        | API client 策略或实现，包含失败状态和联调检查。    | 补充后端归属、鉴权模型和接口契约。    |
| 复杂表单           | 「请用 React Hook Form + Zod 构建多步注册表单，包含文件上传、条件字段、异步校验和可访问错误提示。」                                         | `fec-form-handling`                                          | 类型化表单实现，必要时包含测试。                   | 补充最终提交 payload。                |
| 路由保护           | 「请为 `/admin` 添加基于角色的保护：匿名用户重定向，未授权角色拒绝访问，保留 return URL，并避免受保护内容闪现。」                           | `fec-route-protection`                                       | Auth guard / middleware 实现。                     | 说明鉴权来源和角色模型。              |
| 浏览器存储         | 「请为 checkout 草稿选择并实现安全的客户端持久化。比较 localStorage、sessionStorage、IndexedDB 和 cookies 是否适合。」                      | `fec-browser-storage`                                        | 存储方案建议和实现。                               | 说明敏感字段和保留时长。              |
| 大列表虚拟化       | 「`ProductList` 渲染 20,000 行很卡。请加入虚拟滚动，同时保持键盘导航和动态行高可用。」                                                      | `fec-list-virtualization`                                    | 虚拟滚动实现和性能说明。                           | 补充 UI 库限制。                      |
| PWA                | 「请把这个应用做成可安装 PWA：manifest、图标、service worker、离线兜底、缓存策略和更新提示。」                                              | `fec-pwa-implementation`                                     | PWA 实现和验证步骤。                               | 说明鉴权/支付路由是否必须走网络。     |
| Web Worker         | 「请用 Web Worker 和 Comlink 把图片处理移出主线程，支持进度更新和取消。」                                                                   | `fec-web-workers`                                            | Worker 集成和类型化通信。                          | 补充浏览器支持和文件大小限制。        |
| Canvas / Three.js  | 「请添加 WebGL shader 背景或 Three.js 产品展示器：响应式尺寸、WebGL2/shader 错误检查、可访问降级、性能保护，并验证 canvas 确实渲染。」      | `fec-canvas-threejs`                                         | 3D/canvas/shader 实现和视觉验证。                  | 补充资源、shader 要求和交互约束。     |
| SVG 动效           | 「请用项目已有动画库为 hero SVG 添加微交互，并为 reduced-motion 用户提供静态降级。」                                                        | `fec-svg-animation`                                          | SVG 动效和降级行为。                               | 补充动效约束和目标浏览器。            |

## UI 与设计

| 场景                  | 提示词                                                                                                                                                   | 适用能力                                             | 预期产物                                             | 补充说明                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| 设计稿实现            | 「请按 Figma 节点 `123:456` 实现 UI。复用现有 design token 和组件，匹配间距与响应式状态，并说明假设。」                                                  | `fec-implement-from-design`、`fec-figma-implementer` | UI 代码和设计实现说明/报告。                         | 配好 MCP 凭据效果最好。                              |
| 截图到 UI 打磨        | 「请打磨这个 dashboard，让它像生产级 SaaS 工具：信息密度、层级、空/加载/错误状态、响应式布局和交互状态。」                                               | `fec-ui-design`                                      | UI 改进和视觉 QA 说明。                              | 可提供截图或本地 URL。                               |
| 图片与图表生成        | 「请生成可编辑技术架构图和 PNG，然后自检重叠、标签截断、连线堆叠，并最多修复两轮源文件。」                                                          | `fec-image-generation`、`fec-ui-design`              | 可编辑源、导出 PNG、QA 报告和修复说明。               | 渲染器能暴露布局框时附带 manifest 坐标。             |
| 网页视频演示 | 「把这篇文章转成可录屏的 16:9 网页视频演示：生成口播稿和 outline，创建 Vite/React 舞台，并定义章节 step 方便录屏。」 | `fec-web-video-presentation`、`fec-ui-design` | 口播稿/outline、步进演示脚手架、主题说明和录屏清单。 | 适合技术分享、课程、产品 demo 和口播讲解。 |
| 响应式布局            | 「修复这个后台表格在 375px、768px、1440px 下的问题：决定移动端列优先级、容器查询、触摸目标、安全区域和溢出规则。」                                       | `fec-responsive-layout`、`fec-ui-checker`            | 响应式策略、布局修改、视口检查和剩余风险。           | 最好提供截图或本地路由。                             |
| Tailwind 设计系统     | 「把这些 Tailwind 组件重构成语义 token 和 variants：theme 扩展、暗色模式、class 组合、动态 class 安全和 Storybook 状态覆盖。」                           | `fec-tailwind-design-system`、`fec-ui-design`        | token/variant 方案或实现、class 治理和暗色模式检查。 | 适合共享 UI 包变复杂前使用。                         |
| 产品化设计方向        | 「请为 healthcare analytics dashboard 制定贴合产品的设计方向：核心用户任务、视觉锚点、信息密度、图表语言、色彩角色、字体气质和必须避免的反模式。」       | `fec-ui-design`、`fec-performance-optimizer`         | 设计方向、dashboard 结构、图表 UX 建议和 QA 重点。   | 补充受众、数据类型，以及是否实时刷新。               |
| 设计系统生成          | 「请为高端预约类应用生成设计系统方向：语义色角色、字号层级、间距/圆角规则、组件语气、动效原则，以及哪些做法要刻意避开。」                                | `fec-ui-design`、`fec-design-token-mapper`           | 贴合产品的设计系统方案和 token 建议。                | 补充产品类别、品牌语气和目标技术栈。                 |
| Master/Page overrides | 「打磨 checkout 前，请先读取 `design-system/Acme/MASTER.md`，再检查是否有 `design-system/Acme/pages/checkout.md`；页面规则只覆盖与 Master 不同的部分。」 | `fec-ui-design`                                      | 遵循长期设计系统规则的页面级打磨。                   | 适用于把设计决策沉淀在仓库文档里的项目。             |
| 落地页方向            | 「请为 B2B developer tool 设计落地页方向：首屏层级、可信证据、产品展示、CTA 位置、响应式区块，以及不要落入通用渐变 hero 的视觉锚点。」                   | `fec-ui-design`                                      | 落地页结构、视觉层级、转化路径和反模板建议。         | 补充具体 offer、受众和转化目标。                     |
| 数据看板 UX           | 「请优化这个 operations dashboard，让用户在高压场景下也能快速扫描：表格/图表平衡、实时状态、告警优先级、下钻路径、空/错误状态和响应式密度。」            | `fec-ui-design`、`fec-accessibility-check`           | Dashboard UX 建议或 UI 修改，并覆盖关键状态。        | 提供截图、样例数据或本地路由。                       |
| 移动电商 UI           | 「请设计移动端电商商品浏览流程：安全触控区域、底部导航、筛选/排序体验、商品媒体、加载/空状态，以及进入 checkout 的路径。」                               | `fec-ui-design`、`fec-accessibility-check`           | 移动 UI 方向、交互状态和响应式约束。                 | 说明这是移动 Web 还是类原生 Web UI。                 |
| 金融界面打磨          | 「请打磨这个 banking 界面，让它显得可信、克制、清晰：余额可见性、交易层级、风险状态、对比度、focus 行为和节制动效。」                                    | `fec-ui-design`、`fec-security-review`               | 适合金融场景的 UI 打磨和风险状态建议。               | 如有合规或脱敏要求请说明。                           |
| 作品集视觉识别        | 「请为设计师/开发者 portfolio 制定有辨识度的视觉方向：项目叙事、导航节奏、case study 布局、媒体呈现、字体性格和 reduced-motion 降级。」                  | `fec-ui-design`、`fec-svg-animation`                 | Portfolio UI 方向和交互建议。                        | 提供个人品牌语气和代表项目。                         |
| 交互动效              | 「请为这个产品页规划动效系统：Framer Motion 和 GSAP 如何选、页面转场、滚动动画、reduced-motion 降级、懒加载和性能预算。」                                | `fec-motion-interaction`、`fec-ui-design`            | 动效方向、工具选择、可访问降级和验证清单。           | 补充品牌语气、设备限制，以及动效是装饰还是功能反馈。 |
| 反模板 UI 评审        | 「请评审这个页面是否有泛化 AI 应用痕迹：过度使用紫色渐变、堆叠卡片、空泛 hero 文案、产品证据不足、单一色相和缺少交互状态。」                             | `fec-ui-design`                                      | 反模式问题和具体替代方向。                           | 配合截图或本地 URL 效果更好。                        |
| 交付前 UI QA          | 「请做一轮交付前 UI QA，覆盖 375px、768px、1440px：文本溢出、focus ring、hover/active/disabled、reduced motion、加载/空/错误状态和视觉一致性。」         | `fec-ui-design`、`fec-accessibility-check`           | UI QA 清单、问题和修复建议。                         | 适合实现收尾阶段。                                   |
| Design Token 映射     | 「请把 Figma 变量中的颜色、字体、间距、圆角和阴影映射到本仓库 design token 结构，不破坏现有组件。」                                                      | `fec-design-token-mapper`                            | Token 映射方案或代码修改。                           | 补充 token 命名规则。                                |
| Storybook 文档        | 「请为 `packages/ui/Button` 和 `Dialog` 搭建 Storybook 文档：MDX、状态、无障碍 addon、交互测试和视觉基线。」                                             | `fec-storybook-component-doc`                        | Storybook stories/docs 和测试建议。                  | 说明当前 Storybook 状态。                            |

## 测试

| 场景           | 提示词                                                                                                                | 适用能力                            | 预期产物                       | 补充说明                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------ | ------------------------------- |
| TDD 实现       | 「请用 TDD 给 checkout 添加优惠码校验：先写失败测试，再最小实现，最后重构，并保持测试清单可见。」                     | `/fec-tdd`、`fec-tdd-workflow`      | 红绿重构循环、测试和代码。     | 适合边界清晰的小功能。          |
| 组件测试       | 「请为 `UserCard` 写 React Testing Library 测试：渲染、加载/错误状态、user-event 交互、无障碍断言和回归用例。」       | `fec-component-testing`             | 符合本地约定的组件测试。       | Vue 项目可要求 Vue Test Utils。 |
| E2E 冒烟测试   | 「请为登录和 checkout 添加 Playwright 冒烟测试。使用 Page Object、稳定选择器、CI 友好的重试，并在失败时保留 trace。」 | `fec-e2e-testing`、`fec-e2e-runner` | E2E 测试、运行说明和摘要报告。 | 补充测试账号或 mock 策略。      |
| flaky E2E 排查 | 「checkout E2E 在 CI 中不稳定。请分析 timing、网络、存储和选择器问题，然后稳定它，不要隐藏真实失败。」                | `fec-e2e-testing`、`fec-e2e-runner` | 根因分析和针对性修复。         | 提供 CI 日志或 trace。          |

## 维护

| 场景         | 提示词                                                                                                                    | 适用能力                                                                  | 预期产物                                     | 补充说明                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------- |
| 修复构建失败 | 「`pnpm lint`、`pnpm typecheck` 和 `pnpm test` 都失败了。请逐步修复，不要放宽规则或跳过测试。」                           | `/fec-build-fix`、`fec-validation-fix`、`fec-build-fixer`                 | 最小修复和验证报告。                         | 粘贴准确失败命令。                 |
| 清理死代码   | 「请查找并安全移除未使用导出、死路由、过期样式和未使用依赖。保持 public API，并写报告。」                                 | `/fec-refactor-clean`、`fec-refactor-clean`、`fec-refactor-cleaner`       | 清理计划/变更和报告。                        | 发布前很适合。                     |
| 文档同步     | 「请更新 README 和 docs，让安装步骤、脚本、环境变量、API 路由、UI 路由和部署说明与当前前端代码和配置一致。」             | `/fec-doc-sync`、`fec-doc-sync`、`fec-doc-updater`                        | 同步后的文档和验证说明。                     | 不要把临时报告复制进公开文档。     |
| 能力文档同步 | 「这个仓库发布 skills 和 commands。请同步能力表、metadata、runtime docs 和 package 文件，使其匹配已安装内容。」          | `/fec-doc-sync`、`fec-doc-sync`、`fec-doc-updater`                        | 基于已安装文件的分发文档。                   | 用于 skill/agent/command 仓库。     |
| 来源驱动升级 | 「请规划 React Router/TanStack Query/Vite 的安全升级。核对官方迁移说明、当前项目用法、破坏性变更，并给出验证步骤。」      | `fec-dependency-upgrade`、`fec-source-driven-development`、`fec-doc-sync` | 升级决策说明、影响文件、迁移风险和验证清单。 | 如果公开指南变化，再配合文档同步。 |
| 遗留项目维护 | 「请改进 `public/js/legacy/cart.js`，保持当前 jQuery/MPA 技术栈，降低风险、改善结构，但暂时不要重写成 React。」           | `fec-legacy-web-standard`                                                 | 安全的遗留维护变更或建议。                   | 补充浏览器兼容限制。               |

## 高级用户提示词

如果你已经知道要用哪个内部入口，可以这样写。

| 场景             | 提示词                                                                                                | 适用能力              | 预期产物                        | 补充说明                              |
| ---------------- | ----------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ------------------------------------- |
| 斜杠命令评审     | 「`/fec-review` 请评审上一次提交，并写入 `reports/code-review-*.md`，包含严重级别、证据和合并建议。」 | `/fec-review`         | 结构化代码评审报告。            | Claude 风格运行时可直接使用斜杠命令。 |
| 斜杠命令规划     | 「`/fec-plan` 请先规划 dashboard analytics 功能：组件边界、数据流、状态归属、落地步骤和实现风险。」   | `/fec-plan`           | 架构方案。                      | 复杂工作开始前使用。                  |
| 斜杠命令脚手架   | 「`/fec-scaffold page UserDetail` 请按本仓库约定创建用户详情页标准结构。」                            | `/fec-scaffold`       | page/feature/component 脚手架。 | 如已有文件，确认覆盖行为。            |
| 斜杠命令测试计划 | 「`/fec-plan` 请为 billing 重构制定基于风险的测试计划。」                                             | `/fec-plan`           | 测试矩阵和优先级。              | 可以只输出报告。                      |
| 斜杠命令 TDD     | 「`/fec-tdd` 请用失败测试优先的方式添加密码强度校验。」                                               | `/fec-tdd`            | TDD 循环和已验证改动。          | 保持范围小。                          |
| 斜杠命令构建修复 | 「`/fec-build-fix` 请根据这段日志修复验证失败：<粘贴日志>。」                                         | `/fec-build-fix`      | 增量验证修复。                  | 粘贴准确日志。                        |
| 斜杠命令清理     | 「`/fec-refactor-clean` 请安全移除这个包里的未使用导出和依赖。」                                      | `/fec-refactor-clean` | 清理报告和安全修改。            | 修改后运行测试。                      |
| 斜杠命令文档同步 | 「`/fec-doc-sync` 请同步 README、docs、env examples、脚本、API/路由说明和部署文档，使其匹配当前项目。」 | `/fec-doc-sync`       | 文档更新和验证说明。            | 发布前使用。                          |
| 显式代理         | 「请委托 `fec-code-reviewer` 对 `src/features/payments/` 做 PR 风格评审，然后先总结阻塞项。」         | agent dispatch        | 专项代理报告和摘要。            | 适合专家评审。                        |
