# TRAE-Skills 前端能力融合评估

> 评估日期：2026-05-18  
> 当前仓库：`D:\code\frontend-craft`  
> 参考仓库：`D:\code\skill\TRAE-Skills`

## 结论

`frontend-craft` 已从参考仓库吸收并重写了主要前端能力，当前定位是多 runtime 前端插件，不是 Markdown skill 原文集合。融合策略必须保持平台中立、MIT 许可边界清晰、可被 agents / commands / hooks / converters 使用。

当前插件包含：

| 类型 | 数量 | 说明 |
| --- | ---: | --- |
| Skills | 24 | 前端规范、工程工作流、测试、安全、性能、设计实现 |
| Agents | 9 | 架构、评审、安全、E2E、性能、UI、设计实现、Token 映射 |
| Commands | 3 | `/fec-init`、`/fec-review`、`/fec-scaffold` |
| Hooks | 5 | 命令安全检查、格式化、会话启动、停止校验、通知 |
| Shared rules | 17 | React/Vue/TS/API/状态/性能/响应式/渲染模式等 |
| Runtime | 14 | Claude Code、Codex、Cursor、OpenCode、Gemini CLI、Windsurf、Copilot、OpenClaw、Cline、Kilo、CodeBuddy、Trae、Antigravity、Augment |

## 前端 Skill 覆盖

| TRAE-Skills 前端主题 | frontend-craft 覆盖方式 | 状态 |
| --- | --- | --- |
| Accessibility Audit | `fec-accessibility-check` | 已覆盖 |
| API Data Fetching TanStack | `fec-data-fetching` | 已覆盖 |
| Browser Storage | `fec-browser-storage` | 已覆盖 |
| Canvas / Three.js | `fec-canvas-threejs` | 已覆盖 |
| CSS Grid vs Flexbox | `responsive-design.md` | 已吸收为规则 |
| Custom React Hook Creation | `fec-react-project-standard` | 已吸收 |
| Dark Mode Implementation | `design-system.md` | 已吸收 |
| Form Handling React Hook Form | `fec-form-handling` | 已覆盖 |
| Frontend Error Boundary | `error-handling.md`、React/Vue standards | 已吸收 |
| Global State Management Redux | `state-management.md` | 已吸收 |
| Handling Large Lists Virtualization | `fec-list-virtualization` | 已覆盖 |
| Internationalization i18n | `i18n.md` | 已吸收为规则 |
| Mobile First Design | `responsive-design.md` | 已吸收为规则 |
| Next.js App Router | `fec-nextjs-project-standard` | 已覆盖 |
| PWA Implementation | `fec-pwa-implementation` | 已覆盖 |
| React Component Optimization | `performance.md`、`fec-react-project-standard` | 已吸收 |
| React Context vs Zustand | `state-management.md` | 已吸收 |
| React Testing Library | `fec-component-testing` | 已覆盖 |
| Responsive UI Design Tailwind | `responsive-design.md` | 已吸收为规则 |
| Route Protection React Router | `fec-route-protection` | 已覆盖 |
| Storybook Component Documentation | `fec-storybook-component-doc` | 已覆盖 |
| SVG Animation Techniques | `fec-svg-animation` | 已覆盖 |
| Web Vitals Optimization | `performance.md`、`performance-optimizer` | 已吸收 |
| Web Workers | `fec-web-workers` | 已覆盖 |

## 仍建议完善

- 将间接覆盖的主题继续提升为更强的执行指南：Core Web Vitals、CSS Grid/Flexbox、React Hooks、Redux Toolkit、Error Boundary。
- 增加 skill 发现与一致性测试，确保 `skills/metadata.json`、README、Marketplace 描述与真实目录同步。
- 继续把旧 skill 统一到五段式结构：Purpose / When to Use / Procedure / Constraints / Expected Output。
- 保持分类稳定：`framework`、`frontend`、`ui-design`、`quality`、`performance`、`security`、`architecture`、`testing`、`documentation`。
- 不吸收 backend/mobile/devops 全量内容；只在前端直接相关的 API 边界、安全、测试、CI 规则中借鉴思路。

## 合规要求

- 不复制参考仓库原文、示例代码或 metadata；所有内容都必须按本插件语境重写。
- 不引入参考仓库的平台绑定表达。
- 新增 skill 必须同步：`skills/<name>/SKILL.md`、`skills/metadata.json`、README/中文 README、必要时 runtime 文档或 command 说明。
- 每次新增或重命名 skill 后运行 `npm test`。
