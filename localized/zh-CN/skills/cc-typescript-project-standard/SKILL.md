---
name: cc-typescript-project-standard
description: 用于TypeScript 工程配置、模块解析、公共类型、声明文件、包导出、类型收窄或泛型契约需要设计审查，适用于应用、SDK、CLI、桌面进程与库。
---

# TypeScript 项目规范

本入口面向库、CLI、桌面核心及服务中的语言工程；应用角色由实际子工程证据决定，不由前端/后端产品名决定。

## 用途

统一 TypeScript 层的工程配置、类型边界和发布产物规则。适用于前端应用、组件库、SDK、CLI、monorepo package 和纯 TypeScript 工具库，但不接管 React、Vue、Next.js、Nuxt 或 Vite 的框架架构职责。

## 流程

1. 识别 TypeScript 上下文
   - 应用项目：优先检查 `tsconfig` 分层、strictness、路径别名、类型检查脚本和框架生成类型。
   - 组件库或 SDK：优先检查 public API、声明文件、package exports、peer dependencies 类型边界和发布前 pack 校验。
   - CLI 或 Node 工具：优先检查 Node 目标版本、ESM/CJS 策略、`moduleResolution`、shebang 产物和 `process.env` 类型边界。
   - Monorepo package：优先检查 project references、composite build、包间导入边界和 workspace 路径别名是否泄漏到发布产物。
   - React、Vue、Next.js、Nuxt 等框架的组件架构、路由组织和状态管理归对应框架 skill；本流程只处理跨框架 TypeScript 契约和工程边界。

2. 收敛 `tsconfig`
   - 新代码优先 `strict` 并保留已有检查，不为掩盖缺陷关闭 `noImplicitAny` 或 `strictNullChecks`。`exactOptionalPropertyTypes` 是独立选项；有依据时以局部、兼容迁移引入更严格配置。
   - 按运行环境选择 `target`、`lib`、`module` 和 `moduleResolution`；浏览器应用、Node 脚本、库包不要共用一份含混配置。
   - 将基础配置、应用配置、测试配置和构建声明配置拆开，避免测试全局类型污染生产代码。
   - 路径别名必须同时被 TypeScript、bundler、test runner 和发布产物理解；库包不得发布无法解析的源码别名。

3. 设计类型边界
   - 外部输入、DTO、领域模型、UI view model、组件 props 和工具函数 API 分层命名。
   - public API 的参数和返回值显式标注，内部局部变量优先依赖推断。
   - 外部数据先以 `unknown` 接收，再通过 schema 或 type guard 收窄。
   - 复杂泛型、判别联合、DTO 映射、类型守卫和类型测试加载 [类型安全参考](references/type-safety.md)；需要高级模式时加载 [类型安全模式](references/type-safety-patterns.md)。

4. 固定发布与声明产物
   - 库包必须确认 `package.json` 的 `exports`、`types`、`files` 和实际构建产物一致。
   - 不默认双包发布；只有明确消费方需要时才同时产出 ESM/CJS，并验证类型入口不分叉。
   - 通过 `tsc --emitDeclarationOnly`、构建工具声明插件或 API extractor 产出 `.d.ts`，并在发布前检查声明文件可被消费方解析。
   - 不把测试、fixture、内部工具、未稳定类型或私有路径暴露到 package exports。

5. 验证 TypeScript 质量
   - 优先使用仓库已有脚本，如 `typecheck`、`build`、`test`、`lint` 和 package pack dry-run。
   - Vite、Next、Nuxt 等构建不等于完整类型检查；CI 必须有独立 typecheck 或等效验证。
   - 类型改动影响 public API 时补类型测试、编译期断言或消费方 fixture。

## 约束

- 不用 `any`、无守卫非空断言或宽泛 `as` 掩盖未经验证的边界。合理的 `skipLibCheck` 依赖政策与检查自身公共API有别，需记录其限制。
- 不在应用代码中依赖发布包私有深层路径。
- 不把框架目录结构、组件分层、路由组织或状态管理决策放进本流程；这些交给对应框架或专项流程。
- 不让生成类型、测试类型或 Node-only 类型污染浏览器运行代码。
- 不发布只能在源码仓库内解析的路径别名、ambient 声明或隐式全局类型。

## 预期输出

输出应包含 TypeScript 上下文判断、关键 `tsconfig`/package 类型入口建议、类型边界方案、声明文件或 public API 风险、验证命令。完成后项目应能独立 typecheck，公开类型可被消费方解析，类型安全问题有明确收窄或建模方案。

## 工程实践

按当前任务读取[本入口工程细则](references/engineering-practices.md)，再按链接选择公共原则。规则级别与例外以实际项目契约为准；不因产品前后端标签限制语言或职责。
