# TypeScript / JavaScript 规则

编写、修改或评审 `.ts`、`.tsx`、`.js`、`.jsx` 时应用本文件。本文只保留项目常驻硬约束；复杂类型建模、`tsconfig` 分层、声明产物、DTO / view model 边界、类型测试与发布入口设计，交给 `fec-typescript-project-standard` skill 或专项评审处理。注释风格另见 `fec-code-comments.md`；E2E 与校验流程另见 `fec-testing.md`。

## 类型与接口

用类型让对外 API、共享模型与组件 props 显式、可读、可复用。

### 对外导出的 API

- 对**导出**的函数、共享工具函数、公开类方法，写明参数与返回值类型。
- **局部**变量在类型显而易见时交给 TypeScript 推断，不为显而易见的中间变量重复标注。
- 重复出现的内联对象形状抽成具名 `interface` 或 `type`，避免同一契约散落在多个签名中。
- 外部数据、API DTO、路由参数、表单值与组件 props 的边界要显式命名；复杂建模分流到 `fec-typescript-project-standard`。

### `interface` 与 `type`

- 可能被扩展或 `implements` 的**对象形状**优先用 `interface`。
- **联合、交叉、元组、映射类型、工具类型组合**用 `type`。
- 状态、类型、角色等有限业务取值优先用字符串字面量联合；仅在互操作或团队统一要求时使用 `enum`。

### 函数参数：复杂类型宜具名

- 参数上的**复杂联合**、**内联对象类型**、**较复杂的回调签名**等，应优先提取为具名 `type` / `interface`，再在函数签名中引用。
- 仅当类型简单、短小、一眼可读，且明显无复用价值时，允许在参数位置内联。
- 回调参数与返回值必须表达清楚；不要用 `Function`、宽泛对象或隐式 `any` 承接业务契约。

### 避免 `any`

- 业务代码中避免 `any`；已有遗留 `any` 不随手扩散。
- 外部或不可信数据用 `unknown`，通过 `typeof`、`in`、`instanceof`、schema parse 或自定义 predicate 安全收窄。
- 类型随调用方变化时用泛型，但不要为简单场景引入难以理解的泛型层。
- `as` 类型断言只用于明确的边界互操作或已验证收窄后的补充表达，不用于压制类型错误。

### React 组件 Props

- 用具名 `interface` 或 `type` 定义 props，复杂公共 props 分流到类型模块。
- 回调 props 写清参数与返回值；事件 payload 不用裸对象长期内联。
- 无特殊理由不使用 `React.FC`，避免隐式 `children` 等差异。
- TSX 泛型、复杂组件 props 或外部 DTO 映射问题，交给 React 规则与 `fec-typescript-project-standard` 共同收敛。

## 单文件规模与模块拆分

- `.ts` / `.tsx` / `.js` / `.jsx` 单文件建议控制在**约 300 行以内**。该阈值是可维护性与评审效率的经验上限，不是机械硬限制。
- 当文件明显超过该规模且承担多重职责时，应优先按职责拆分：数据访问、业务规则、视图渲染、适配层、常量与映射、类型定义。
- 超阈值优先提取纯函数、子组件、自定义 Hook、`*.types.ts` 类型模块、常量表；不要仅为压行数做无意义切分。
- 可接受例外：生成代码、极薄的 re-export 聚合文件、经团队评审确认的高内聚模块；例外建议在文件头简短注明原因。

### 仍为 JavaScript 的文件

- 在 `.js` / `.jsx` 中，若短期无法迁 TS，可用 JSDoc 补类型，并与运行时行为一致。
- 不为迁移方便引入新的隐式全局、宽松对象或未验证外部输入。

## 禁止 Magic Number / Magic String

- **业务代码中禁止**使用**无语义**的硬编码数字或字符串直接表示状态、类型、标识或业务含义，包括 `if` / `switch` / 赋值 / API 字段映射。
- 固定且有限的取值范围须在单一真源处定义，并在全仓引用名称，避免裸值散落。
- 前端主路径优先使用 `as const` 常量对象配合字面量联合；与后端协议或团队约定强绑定时可使用 `enum`。
- 不属本条的典型例外仍应保持可读：纯算法下标、明显的 `0` / `1` 长度判断、与业务无关的 UI 刻度；视觉值若已有设计 Token，应改走 `fec-design-system.md`。

## 不可变更新

- 优先返回新对象或新数组，避免直接改写入参、props、store 快照或缓存对象。
- 对不应被修改的数据优先建模为 `readonly` / `Readonly<T>`。
- 大型嵌套更新应使用项目既有状态方案或清晰的 reducer / helper，不在组件中堆叠临时可变逻辑。

## 异步与错误处理

- 使用 `async` / `await` 与明确的错误边界；不要吞掉 promise rejection。
- `catch` 中将错误视为 `unknown` 再收窄，统一映射为用户可见错误、日志错误或调用方可处理的领域错误。
- API、认证、上传、支付等跨边界错误遵循 `fec-api-layer.md`、`fec-error-handling.md` 和安全规则，不在业务组件中散落裸处理。

## 输入校验

- 外部输入（表单、API、URL 参数、localStorage、postMessage、第三方 SDK 回调等）必须在边界处校验或收窄。
- 可使用 Zod、Valibot、Yup 或项目选用的同类 schema 工具；不要把具体库作为无条件新依赖引入。
- schema 推导类型可作为输入类型单一真源；复杂 DTO、领域模型与 UI view model 的分层交给 `fec-typescript-project-standard`。

## 类型资产分层与命名

- 模块或特性专属类型使用 `*.types.ts`，并与实现文件同目录或同 feature 目录放置。
- 全局与环境相关声明放在 `global.d.ts`、`env.d.ts` 或 `types/*.d.ts`，仅用于真全局或 ambient 声明，不将可模块化类型放入全局。
- 仅用于类型的导入导出优先使用 `import type` 与 `export type`，减少值空间歧义并提升编译语义清晰度。
- 与 API DTO 同源的类型，放在对应 feature 或 API 子目录，避免在页面或组件实现内散落大型匿名类型。
- `index.ts` 聚合导出应保持浅层且按 feature 边界组织，避免深层 barrel 引发循环依赖与不必要耦合。

## 工程化与惯用法补充

- 需要同时满足字面量保留与结构校验时优先使用 `satisfies`，再考虑类型断言。
- 使用判别式联合表达清晰状态；关键分支需要穷尽性时用 `never` 检查。
- 新业务代码默认采用 ES Module；`namespace` 与三斜线指令仅用于声明合并或遗留互操作场景。
- 扩展第三方类型时使用独立声明文件并通过局部 `declare module` 扩展，避免污染全局实现文件。
- `tsconfig`、package exports、声明文件、路径别名和 public API 类型属于 TypeScript 项目规范深水区，不在本规则内展开。

## 日志与 `console.log`

- 生产路径避免遗留 `console.log`；使用项目统一的日志方案。
- 调试日志提交前应删除，或按团队工具链通过 lint / hook / CI 提示。

## 密钥与敏感配置

- **禁止**在源码中硬编码密钥、Token、私钥或真实凭证示例。
- 必须通过环境变量或构建期注入读取配置，并在缺失时显式失败或提供清晰降级策略。
- 涉及认证、支付、上传、第三方脚本或敏感数据处理时，结合项目安全规范做专项评审。

## 与测试规则的关系

类型改动影响 public API、DTO、外部输入收窄或关键业务分支时，应补充 typecheck、类型测试、组件测试或消费方 fixture。关键用户路径的端到端覆盖方式（Playwright、Cypress、Page Object 等）以 `fec-testing.md` 为准；本文件不重复展开 E2E 细则。

## 与 `typescript-reviewer` 子代理

对 **`.ts` / `.tsx` / `.js` / `.jsx`** 进行专项评审（先跑 typecheck / eslint、PR 合并就绪检查、分级结论）时，可委托插件内置的 **`typescript-reviewer`** 子代理；其报告默认写入 `reports/typescript-review-YYYY-MM-DD-HHmmss.md`，规则底线仍以本文件与项目 `CLAUDE.md` 为准。
