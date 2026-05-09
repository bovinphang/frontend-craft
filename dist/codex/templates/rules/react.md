# React 规则

当仓库或目标模块使用 React 时，应用本文件。

## 技术栈

<!-- 请根据项目实际情况修改 -->

- 框架: React + TypeScript
- 样式: Tailwind CSS + CSS Modules
- 状态管理: Zustand / Redux Toolkit / Jotai（按项目实际选择）
- UI 组件库: 按项目实际选择（如 Ant Design、Material UI 或内部 Design System）
- 版本与依赖：新建模块、补充 `package.json` 或更新本节前，优先采用彼此兼容的主流稳定版本（对齐官方文档、脚手架默认值或包管理器推荐），避免混用已停止维护或与仓库主线 major 不匹配的依赖。

## React 组件规范

- 使用**函数组件**、Hooks 与 TypeScript；**不要**新增类组件（含手写 Error Boundary，统一用 `react-error-boundary` 等库）
- 保持组件小而可组合
- 将可复用逻辑提取到 hooks
- props 保持明确且类型清晰
- 保持可访问性与键盘交互
- 优先使用可推导状态，避免重复维护 state
- 在创建新基础组件前，先复用现有设计系统
- 禁止使用 any，优先使用 unknown
- CSS 命名遵循 BEM（CSS Modules 场景）

## 模式与最佳实践（React）

- **组合**：用小组件 + `children`/props 拼装；避免宽布尔 props 与假「继承」。
- **复合组件**：根组件用 Context 向子组件暴露状态；子组件在缺少 Context 时明确报错。
- **Render Props**：仅在需要封装数据态并把渲染交给上层时考虑；多数场景优先自定义 Hook + 普通组件。
- **Context + useReducer**：中等复杂度的多子树客户端状态；勿把高频变化大对象放在顶层 Context；服务端数据用 React Query / SWR。
- **表单**：中大型表单优先 React Hook Form + Zod；避免单文件巨型受控 state。
- **Error Boundary**：关键模块用 **`react-error-boundary`**（或团队统一的同类库）在模块边界兜底；业务组件一律函数式，不手写类组件 Error Boundary。
- **性能**：`useMemo`/`useCallback`/`React.memo` 按需使用；长列表用虚拟列表（如 TanStack Virtual、react-window）；昂贵计算注意不可变派生（勿原地 `sort` 原数组）。
- **动效**：Framer Motion 或 CSS transition；尊重 `prefers-reduced-motion`。
- **无障碍**：复合控件补齐 `role`/`aria-*` 与键盘操作；弹窗管理焦点落入与关闭后恢复。
- **Next.js**：App Router 与 Server Components 相关约定以项目 Next 规则为准。

## React 实现指导

创建新组件前：

1. 先搜索是否已存在等价组件
2. 判断逻辑是否应该放入自定义 hook
3. 与项目当前样式方案保持一致

编辑 React 组件时：

- 避免在同一个文件里混合数据请求、重业务逻辑和展示逻辑
- 避免设计过宽或语义不清的 props API
- 对局部问题避免滥用 context
- 保持条件渲染可读，必要时提取重复分支

## React 文件组织

优先遵循仓库已有约定。
常见输出可能包括：

- `Component.tsx`
- `Component.types.ts`
- `hooks/useComponentLogic.ts`
- `ComponentName.styles.css`（普通 CSS / CSS Modules；使用 styled-components 时为 `ComponentName.styles.ts`）
- 如果仓库采用就近测试，则补充测试文件，如：`__tests__/Component.spec.tsx`

## 组件文件规模

- 单个组件文件保持**职责单一**、语义清晰、易于维护。
- **行数参考**：优先将单文件控制在约 **300 行**以内；超过 **500 行**应视为**强烈拆分信号**。
- **未到 500 行也应拆分**的情形：同时存在**复杂状态交织**、**过多副作用**、**JSX 嵌套过深**、**密集条件分支**、数据获取与 UI 长期混在同一文件等，使单文件难以一眼把握时，应拆为**子组件**、**自定义 Hooks**、**工具函数**、**常量**与**类型定义**等独立单元（目录与命名仍遵循上文「React 文件组织」）。

## React 反模式

避免：

- 新建**类组件**或手写类式 Error Boundary（应使用函数组件 + `react-error-boundary` 等）
- 对可推导值使用多余 state
- 大段 JSX 不拆成子组件
- 单文件堆叠过多职责与行数，**逾 500 行或复杂度已高**仍拒不拆分（参见上文「组件文件规模」）
- 使用不稳定 key
- 在 props 和 hooks 中无理由使用 `any`
- 没有充分理由时引入第二套样式体系
