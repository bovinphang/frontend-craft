# 参考仓库能力融合评估报告

> **评估日期**: 2026-05-18
> **当前仓库**: `D:\code\frontend-craft` (v2.0.1)
> **参考仓库**: `D:\code\skill\TRAE-Skills` (cb278fa → 6fbc165)

---

## 一、当前仓库能力概览

frontend-craft 是一个**工程化完备的多平台前端插件**，具备以下能力体系:

| 能力维度     | 数量 | 关键内容                                                                                                                          |
| ------------ | ---- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Skills**   | 13   | 代码审查、安全审查、无障碍、E2E、设计稿实现、React/Vue/Next/Nuxt/Monorepo 规范、遗留迁移                                          |
| **Agents**   | 9    | 前端架构师、代码评审、TS评审、安全评审、E2E执行器、性能优化、设计稿实现、Token映射、UI检查                                        |
| **Commands** | 3    | `/fec-init` 初始化、`/fec-review` 评审、`/fec-scaffold` 脚手架                                                                    |
| **Hooks**    | 5    | 安全检查(PreToolUse)、格式化(PostToolUse)、会话启动、停止时测试、通知                                                             |
| **Rules**    | 15   | TypeScript、错误处理、命名、i18n、CI/CD、状态管理、API层、React/Vue、测试、性能、设计系统、Git、重构、注释                        |
| **MCP**      | 6    | Figma、Figma Desktop、Sketch、MasterGo、Pixso、墨刀                                                                               |
| **平台支持** | 14   | Claude Code、Codex、Cursor、OpenCode、Gemini CLI、Windsurf、Copilot、OpenClaw、Cline、Kilo、Codebuddy、Trae、Antigravity、Augment |
| **模板**     | 6    | Claude/Codex/OpenClaw/Cursor/Gemini/Windsurf 平台模板                                                                             |
| **工程化**   | 完整 | npm包、esbuild构建、TypeScript、多平台转换器、OpenClaw运行时                                                                      |

**核心优势**:

1. 多平台统一架构，一套 Skills/Agents 通过 converter 转换为各平台格式
2. Agent-Skill 关联机制，Agent 负责执行流程，Skill 提供规范细则
3. 设计工具生态全覆盖(6种 MCP)
4. 报告落盘体系(带时间戳的 Markdown 报告)
5. OpenClaw 插件市场发布就绪

**覆盖盲区**:

- 缺少前端技术选型决策矩阵(如 SSR vs CSR、Context vs Zustand 等)
- 缺少 PWA、Web Workers、Canvas/Three.js、SVG动画等进阶前端主题
- 缺少 Storybook 组件文档化规范
- 缺少虚拟列表/大列表优化专题
- 缺少暗色模式实现专题
- 缺少视觉回归测试专题
- 技能格式为自由文本，无统一模板结构

---

## 二、参考仓库能力概览

参考仓库是一个**纯 Markdown 的 Skill 知识库**，包含 117 个技术指导卡片:

| 分类                | 数量 | 说明                                                                                                         |
| ------------------- | ---- | ------------------------------------------------------------------------------------------------------------ |
| **Frontend**        | 22   | React/Next.js/状态管理/表单/布局/PWA/性能/无障碍/i18n/暗色模式/虚拟化/Web Workers/Three.js/SVG动画/Storybook |
| **Backend**         | 32   | Node.js/Express/NestJS/数据库/认证/缓存/消息队列/GraphQL/微服务                                              |
| **Mobile**          | 10   | React Native/Flutter/移动端优化                                                                              |
| **Architecture**    | 16   | SSR vs CSR/BFF/REST vs GraphQL/前端后端通信/设计模式                                                         |
| **AI Engineering**  | 28   | LLM 集成/RAG/Agent/Prompt Engineering                                                                        |
| **Testing**         | 12   | E2E/组件测试/视觉回归/axe-core                                                                               |
| **Security**        | 14   | XSS/CSP/CSRF/CORS/认证/加密                                                                                  |
| **DevOps**          | 20   | CI/CD/Docker/K8s/Terraform                                                                                   |
| **Documentation**   | 14   | Storybook/ADR/API文档                                                                                        |
| **Code Management** | 10   | ESLint/Monorepo/Husky                                                                                        |

**核心特点**:

1. **统一五段式模板**: Purpose / When to Use / Procedure / Constraints / Expected Output
2. **纯文档无构建**: 零依赖、零配置、Git 分发
3. **metadata.json 索引**: 117 个 skill 的元数据注册表，支持按 tag 检索
4. **技术选型丰富**: 每个主题含框架对比和选型决策矩阵
5. **代码示例密集**: 每个 skill 的 Procedure 节含完整可运行代码片段

---

## 三、两个仓库差异对比表

| 维度                | frontend-craft (当前)       | TRAE-Skills (参考)                     |
| ------------------- | --------------------------- | -------------------------------------- |
| **本质**            | 工程化插件包(npm + CLI)     | 纯 Markdown 知识库                     |
| **Skill 数量**      | 13                          | 117                                    |
| **前端 Skill 数量** | 10(前端相关)                | 22(前端直接)+ 20+(跨分类)              |
| **Skill 格式**      | 自由文本，各 skill 格式不一 | 统一五段式模板                         |
| **Agent 系统**      | 9 个专业 Agent              | 无                                     |
| **Command 系统**    | 3 个斜杠命令                | 无                                     |
| **Hook 系统**       | 5 个生命周期钩子            | 无                                     |
| **MCP 集成**        | 6 个设计工具                | 无                                     |
| **平台支持**        | 14 个 AI 工具平台           | 仅 TRAE IDE                            |
| **构建系统**        | esbuild + TypeScript        | 无                                     |
| **分发方式**        | npm 包 + OpenClaw 市场      | Git 仓库                               |
| **规则体系**        | 15 个共享规则文件           | 无独立规则体系                         |
| **测试**            | 有测试框架                  | 无                                     |
| **许可证**          | MIT                         | 自定义许可证(有署名要求，禁止原样重发) |
| **前端技术覆盖**    | 规范/评审/设计稿/迁移       | 技术选型/实现指南/代码示例             |
| **设计工具集成**    | 强(6种 MCP)                 | 无                                     |
| **决策矩阵**        | 弱                          | 强(SSR vs CSR、Context vs Zustand 等)  |

---

## 四、参考仓库优秀设计清单

### 4.1 Skill 模板标准化

五段式结构非常清晰:

- **Purpose**: 一句话说明这个 skill 解决什么问题
- **When to Use**: 明确的触发条件和使用场景
- **Procedure**: 分步骤实现指南，含完整代码示例
- **Constraints**: 边界条件、注意事项、反模式
- **Expected Output**: 明确产出物

**价值**: 当前仓库的 skill 格式不统一，标准化后提升可维护性和 AI 理解度。

### 4.2 metadata.json 索引机制

117 个 skill 的 JSON 索引，支持按 category/tag 快速检索。

**价值**: 当前仓库缺少 skill 元数据索引，添加后可支持智能推荐和 skill 发现。

### 4.3 前端技术选型决策矩阵

在多个关键决策点提供了清晰的选型对比:

- SSR vs CSR vs SSG 决策矩阵
- Context vs Zustand vs Redux 选型指南
- REST vs GraphQL 选型对比
- CSS Grid vs Flexbox 选择指南

**价值**: 当前仓库偏重规范，缺少选型指导，补充后可覆盖从"决策→规范→实现"的全链路。

### 4.4 代码示例密度

每个 skill 的 Procedure 节包含大量可直接使用的代码片段，而非仅概念描述。

**价值**: 当前仓库部分 skill 偏"原则性指导"，增加代码示例可提升实操性。

### 4.5 进阶前端主题覆盖

覆盖了当前仓库缺失的多个进阶主题:

- PWA 实现(Manifest + Service Worker + Maskable Icons)
- Web Workers(后台线程 + Vite 集成 + Transferable Objects)
- Canvas/Three.js 基础(+ React Three Fiber 集成)
- SVG 动画技术(CSS stroke-dasharray/SMIL/GSAP/Framer Motion)
- 虚拟列表优化(react-window + VariableSizeList)
- 暗色模式实现(CSS 变量 + Tailwind + FOUC 防护)
- Storybook 组件文档化(Meta/StoryObj/Controls/Actions/MDX)
- 视觉回归测试(Playwright 快照 + mask 动态内容)

---

## 五、可迁移功能清单

### A 类: 强烈建议迁移(价值高，风险低)

| #   | 来源                                    | 迁移内容                   | 目标位置                                             | 说明                                                                |
| --- | --------------------------------------- | -------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| A1  | Storybook_Component_Documentation.md    | Storybook 组件文档化 Skill | skills/fec-storybook-component-doc.md                | 填补文档化空白，与 figma-implementer Agent 形成"设计→实现→文档"闭环 |
| A2  | Handling_Large_Lists_Virtualization.md  | 虚拟列表优化 Skill         | skills/fec-list-virtualization.md                    | 与 performance-optimizer Agent 关联，补充性能优化实操指南           |
| A3  | Web_Vitals_Optimization.md              | Web Vitals 优化 Skill      | 合并到 skills/fec-react-project-standard.md 或独立   | 与 performance-optimizer Agent 直接关联                             |
| A4  | PWA_Implementation.md                   | PWA 实现 Skill             | skills/fec-pwa-implementation.md                     | 填补渐进式 Web 应用规范空白                                         |
| A5  | Web_Workers.md                          | Web Workers Skill          | skills/fec-web-workers.md                            | 后台线程处理规范，填补计算密集型场景空白                            |
| A6  | Dark_Mode_Implementation.md             | 暗色模式实现 Skill         | 合并到 design-system.md 规则或独立 skill             | 补充设计系统实现细节                                                |
| A7  | React_Context_vs_Zustand.md             | 状态管理选型 Skill         | templates/shared/rules/state-management.md 扩充      | 当前 rules 有状态管理规范，但缺少选型决策矩阵                       |
| A8  | SSR_vs_CSR_Decision_Matrix.md           | 渲染模式选型 Skill         | templates/shared/rules/ 下新增 rendering-patterns.md | 补充架构决策层指导                                                  |
| A9  | Visual_Regression_Testing_Playwright.md | 视觉回归测试 Skill         | 合并到 fec-e2e-testing.md 或独立                     | 补充 E2E 视觉测试维度，与 ui-checker Agent 关联                     |
| A10 | Form_Handling_ReactHookForm.md          | 表单处理 Skill             | skills/fec-form-handling.md                          | 填补表单工程规范空白(React Hook Form + Zod)                         |
| A11 | XSS_Prevention_Guide.md + CSP           | XSS/CSP 深度指南           | 合并到 fec-security-review.md                        | 当前安全 skill 有 XSS 检查但无深度防护指南                          |
| A12 | 五段式模板结构                          | Skill 内容标准化           | 所有现有 skills 逐步重构                             | 统一 skill 格式，提升 AI 理解和可维护性                             |

### B 类: 建议迁移，但需要适配

| #   | 来源                             | 迁移内容              | 目标位置                                 | 适配要点                                              |
| --- | -------------------------------- | --------------------- | ---------------------------------------- | ----------------------------------------------------- |
| B1  | Canvas_Threejs_Basics.md         | Canvas/Three.js Skill | skills/fec-canvas-threejs.md             | 需移除平台特定引用，补充 React Three Fiber 最佳实践   |
| B2  | SVG_Animation_Techniques.md      | SVG 动画 Skill        | skills/fec-svg-animation.md              | 需整合 GSAP/Framer Motion 与项目已有动画方案的适配    |
| B3  | API_Data_Fetching_TanStack.md    | 数据获取 Skill        | skills/fec-data-fetching.md              | 需补充与项目 API 层规则的衔接                         |
| B4  | Browser_Storage.md               | 浏览器存储 Skill      | skills/fec-browser-storage.md            | 需补充安全存储规范(敏感数据加密等)                    |
| B5  | Responsive_UI_Design_Tailwind.md | 响应式设计 Skill      | templates/shared/rules/ 或独立 skill     | 需与现有 design-system.md 整合                        |
| B6  | Mobile_First_Design.md           | 移动优先设计 Skill    | 合并到响应式 skill 中                    | 与响应式设计合并，避免重复                            |
| B7  | Internationalization_i18n.md     | i18n 实现指南         | templates/shared/rules/i18n.md 扩充      | 当前有 i18n 规则，补充实操代码示例                    |
| B8  | Accessibility_Audit.md           | 无障碍实现指南        | 合并到 fec-accessibility-check.md        | 当前无障碍 skill 偏检查，补充实现指南                 |
| B9  | Monorepo_Setup_Turborepo.md      | Monorepo 配置详解     | fec-monorepo-project-standard.md 扩充    | 当前 monorepo skill 已有，补充 Turborepo 缓存管道细节 |
| B10 | ESLint_Prettier_Setup.md         | ESLint/Prettier 配置  | templates/shared/rules/ 或新增           | 作为工程配置规范补充                                  |
| B11 | BFF_Pattern_Implementation.md    | BFF 模式              | templates/shared/rules/api-layer.md 扩充 | 补充 BFF 层架构指导                                   |
| B12 | metadata.json 概念               | Skills 元数据索引     | skills/metadata.json                     | 需重新设计 schema，适配当前仓库的 skill 体系          |

### C 类: 只借鉴思路，不直接迁移

| #   | 来源                         | 借鉴内容       | 理由                                                      |
| --- | ---------------------------- | -------------- | --------------------------------------------------------- |
| C1  | 所有 Backend Skills          | 后端架构思路   | 当前仓库定位前端，后端内容不直接相关，但可借鉴架构思维    |
| C2  | 所有 Mobile Skills           | 移动端优化思路 | 非 RN/Flutter 专项，但移动 Web 优化思路可吸收             |
| C3  | 大部分 DevOps Skills         | CI/CD 思路     | 当前仓库已有 ci-cd.md 规则覆盖                            |
| C4  | 大部分 AI Engineering Skills | AI 工程思路    | 非前端核心，但 Agent/Prompt 思路可借鉴优化现有 Agent 定义 |
| C5  | 大部分 Documentation Skills  | 文档化思路     | 除 Storybook 外，其他文档主题已由现有规则覆盖             |

### D 类: 不建议迁移

| #   | 来源          | 不建议迁移内容   | 原因                                                  |
| --- | ------------- | ---------------- | ----------------------------------------------------- |
| D1  | 全部 Skills   | 原始文件直接复制 | 许可证限制禁止原样重新发布；且格式/平台引用需彻底重构 |
| D2  | metadata.json | 原始 JSON 文件   | schema 设计完全不同，且包含平台特定字段               |
| D3  | README.md     | 原始文档结构     | 仓库定位和分发方式完全不同                            |
| D4  | 代码示例      | 直接复制代码片段 | 需要重写以匹配当前仓库的技术栈约定和编码规范          |
| D5  | LICENSE       | 自定义许可证     | 当前仓库使用 MIT，不引入额外许可证约束                |

---

## 六、不建议迁移内容及原因

### 不建议迁移的核心原因

1. **许可证约束**: 参考仓库使用自定义许可证，明确禁止"原样重新发布 Agent 集合"并要求署名。因此任何迁移都必须**重写而非复制**。

2. **平台差异**: 参考仓库纯为特定 IDE 设计，而 frontend-craft 支持 14 个平台。直接复制会导致平台特定引用污染。

3. **格式不兼容**: 五段式模板与当前仓库的 skill 格式完全不同，需要系统性重构。

4. **定位差异**: 参考仓库是"知识卡片"(What/How)，frontend-craft 是"可执行插件"(Agent + Skill + Hook + Command)。迁移时需要保持可执行性。

---

## 七、安全风险检查结果

### 7.1 许可证风险 — 中风险

| 风险项       | 详情                                 | 缓解措施                                     |
| ------------ | ------------------------------------ | -------------------------------------------- |
| 原样复制禁止 | 参考仓库许可证禁止未经改动的重新发布 | 所有内容必须重写，不可直接复制               |
| 署名要求     | 需在文档中注明参考来源               | 在 CHANGELOG.md 或 CREDITS.md 中注明灵感来源 |
| 品牌限制     | 禁止使用特定品牌名称                 | 确保不出现任何参考平台相关字样               |

### 7.2 代码安全风险 — 低风险

- 参考仓库无执行代码，纯 Markdown，无供应链风险
- 迁移时需注意: 代码示例中的第三方库版本需与当前仓库依赖对齐

### 7.3 内容安全风险 — 低风险

- 无敏感信息、无密钥、无内部 API 地址
- 需确保重写后的示例代码不包含硬编码凭证

### 7.4 平台污染风险 — 中风险

| 风险项       | 详情                   | 缓解措施                   |
| ------------ | ---------------------- | -------------------------- |
| 品牌词泄漏   | 重写后残留参考平台字样 | CI lint 检查 + 人工 review |
| 平台特定引用 | 示例中包含特定 IDE API | 重写为平台中立表述         |

---

## 八、推荐迁移优先级

### Phase 1: 基础补齐(高价值，零风险) — 优先执行

| 优先级 | 编号 | 内容                       | 工作量 | 收益                     |
| ------ | ---- | -------------------------- | ------ | ------------------------ |
| P0     | A12  | Skill 模板标准化(五段式)   | 中     | 高 — 统一所有 skill 格式 |
| P1     | A1   | Storybook 组件文档化 Skill | 低     | 高 — 填补文档化空白      |
| P1     | A2   | 虚拟列表优化 Skill         | 低     | 高 — 补充性能优化实操    |
| P1     | A10  | 表单处理 Skill             | 低     | 高 — 填补表单工程空白    |
| P1     | A7   | 状态管理选型决策矩阵       | 低     | 高 — 补充选型指导        |

### Phase 2: 进阶主题(高价值，需适配)

| 优先级 | 编号 | 内容                      | 工作量 | 收益 |
| ------ | ---- | ------------------------- | ------ | ---- |
| P2     | A4   | PWA 实现 Skill            | 中     | 高   |
| P2     | A5   | Web Workers Skill         | 中     | 高   |
| P2     | A6   | 暗色模式实现              | 低     | 中   |
| P2     | A8   | 渲染模式选型(SSR/CSR/SSG) | 中     | 高   |
| P2     | A9   | 视觉回归测试              | 中     | 高   |
| P2     | A11  | XSS/CSP 深度指南          | 低     | 中   |

### Phase 3: 生态扩展(中价值，需适配)

| 优先级 | 编号  | 内容                    | 工作量 | 收益             |
| ------ | ----- | ----------------------- | ------ | ---------------- |
| P3     | A3    | Web Vitals 优化         | 低     | 中(与 A2 合并)   |
| P3     | B1    | Canvas/Three.js         | 中     | 中               |
| P3     | B3    | TanStack Query 数据获取 | 中     | 中               |
| P3     | B4    | 浏览器存储              | 低     | 中               |
| P3     | B5+B6 | 响应式+移动优先(合并)   | 中     | 中               |
| P3     | B12   | Skills 元数据索引       | 中     | 中(支持智能推荐) |

### Phase 4: 存量优化(现有内容升级)

| 优先级 | 编号   | 内容                         | 工作量 | 收益         |
| ------ | ------ | ---------------------------- | ------ | ------------ |
| P4     | B7-B11 | 现有 skill/rule 扩充         | 中     | 中           |
| P4     | —      | 现有 13 个 skills 格式标准化 | 高     | 高(长期价值) |

---

## 九、分阶段实施计划

### Phase 1: 基础设施(1-2 天)

```
目标: 建立标准化 skill 模板 + 首批高价值 skills
```

1. 定义标准化 Skill 模板(Purpose/When to Use/Procedure/Constraints/Expected Output)
2. 创建 Storybook 组件文档化 Skill
3. 创建虚拟列表优化 Skill
4. 创建表单处理 Skill
5. 扩充 state-management.md 为选型决策矩阵
6. 更新 skill-authoring 内部文档

### Phase 2: 进阶主题(2-3 天)

```
目标: 补充前端进阶能力，形成完整技能矩阵
```

1. 创建 PWA 实现 Skill
2. 创建 Web Workers Skill
3. 创建渲染模式选型规则
4. 合并视觉回归测试到 E2E Skill
5. 创建暗色模式实现 Skill
6. 扩充安全 Skill(XSS/CSP 深度指南)

### Phase 3: 生态扩展(2-3 天)

```
目标: 补充数据层、视觉层、存储层能力
```

1. 创建 TanStack Query 数据获取 Skill
2. 创建浏览器存储 Skill
3. 创建响应式设计规则(合并移动优先)
4. 创建 Canvas/Three.js Skill
5. 创建 Skills 元数据索引(metadata.json)
6. 创建 skill 发现/推荐机制

### Phase 4: 存量升级(持续)

```
目标: 现有 13 个 skills 逐步标准化
```

1. 按优先级逐个重构现有 skill 为五段式格式
2. 补充代码示例密度
3. 补充 Expected Output 节
4. 统一触发条件表述(与 Agent 关联对齐)

---

## 十、TODO Checklist

### Phase 1: 基础设施

- [ ] **P0-1**: 创建标准 Skill 模板文件 `skills/TEMPLATE.md`，定义五段式结构规范
- [ ] **P1-1**: 重写 Storybook 组件文档化 Skill → `skills/fec-storybook-component-doc.md`
- [ ] **P1-2**: 重写虚拟列表优化 Skill → `skills/fec-list-virtualization.md`
- [ ] **P1-3**: 重写表单处理 Skill → `skills/fec-form-handling.md`
- [ ] **P1-4**: 扩充 `templates/shared/rules/state-management.md`，新增 Context/Zustand/Redux 选型决策矩阵
- [ ] **P1-5**: 为新增 Skills 创建对应的 Agent 关联(如需)
- [ ] **P1-6**: 更新 `.claude-plugin/plugin.json` 注册新 Skills

### Phase 2: 进阶主题

- [ ] **P2-1**: 重写 PWA 实现 Skill → `skills/fec-pwa-implementation.md`
- [ ] **P2-2**: 重写 Web Workers Skill → `skills/fec-web-workers.md`
- [ ] **P2-3**: 创建渲染模式选型规则 → `templates/shared/rules/rendering-patterns.md`
- [ ] **P2-4**: 合并视觉回归测试到 `skills/fec-e2e-testing.md`
- [ ] **P2-5**: 创建暗色模式实现 → 合并到 `templates/shared/rules/design-system.md`
- [ ] **P2-6**: 扩充 `skills/fec-security-review.md`，新增 XSS/CSP 深度防护章节

### Phase 3: 生态扩展

- [ ] **P3-1**: 重写 TanStack Query 数据获取 Skill → `skills/fec-data-fetching.md`
- [ ] **P3-2**: 重写浏览器存储 Skill → `skills/fec-browser-storage.md`
- [ ] **P3-3**: 合并响应式+移动优先 → `templates/shared/rules/responsive-design.md`
- [ ] **P3-4**: 重写 Canvas/Three.js Skill → `skills/fec-canvas-threejs.md`
- [ ] **P3-5**: 创建 `skills/metadata.json` 索引文件
- [ ] **P3-6**: 在 `/fec-init` 命令中增加 skills 发现/推荐能力

### Phase 4: 存量升级(持续迭代)

- [ ] **P4-1**: 重构 `fec-react-project-standard.md` 为五段式
- [ ] **P4-2**: 重构 `fec-vue3-project-standard.md` 为五段式
- [ ] **P4-3**: 重构 `fec-nextjs-project-standard.md` 为五段式
- [ ] **P4-4**: 重构 `fec-nuxt-project-standard.md` 为五段式
- [ ] **P4-5**: 重构 `fec-monorepo-project-standard.md` 为五段式
- [ ] **P4-6**: 重构 `fec-accessibility-check.md` 为五段式
- [ ] **P4-7**: 重构 `fec-e2e-testing.md` 为五段式
- [ ] **P4-8**: 重构 `fec-legacy-to-modern-migration.md` 为五段式
- [ ] **P4-9**: 重构 `fec-implement-from-design.md` 为五段式
- [ ] **P4-10**: 重构 `fec-security-review.md` 为五段式
- [ ] **P4-11**: 重构 `fec-test-and-fix.md` 为五段式
- [ ] **P4-12**: 重构 `fec-frontend-code-review.md` 为五段式
- [ ] **P4-13**: 重构 `fec-legacy-web-standard.md` 为五段式

### 合规检查(每个 Phase 完成后)

- [ ] 确认无任何参考平台品牌字样
- [ ] 确认所有内容为重写而非复制
- [ ] 确认示例代码无硬编码凭证/内部地址
- [ ] 确认新增内容已注册到 plugin.json
- [ ] 确认 Agent-Skill 关联关系正确
- [ ] 运行 `npm test` 验证无回归
