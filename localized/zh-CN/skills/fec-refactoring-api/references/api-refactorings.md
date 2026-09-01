# API 类重构

这些卡片以用户提供的标准重构目录为知识基线，转换为面向前端 Agent 的操作指南。保留标准 ID/中英文名称，框架适配和示例为项目原创内容。

## RF-SEPARATE-QUERY-FROM-MODIFIER — 将查询函数和修改函数分离（Separate Query from Modifier）

### 意图
把“获取信息”和“修改状态”拆开，让读取不再隐式触发副作用。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 当前结构已经清晰，或该变换会制造更强耦合、隐藏依赖、破坏公共契约且没有兼容方案时，不使用。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- `SMELL-MUTABLE-DATA`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Separate Query from Modifier”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-PARAMETERIZE-FUNCTION — 函数参数化（Parameterize Function）

### 意图
把仅在某个显式值上不同的重复函数合成一个参数化函数。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 当前结构已经清晰，或该变换会制造更强耦合、隐藏依赖、破坏公共契约且没有兼容方案时，不使用。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- 不要求先存在某一种固定坏味道；以具体结构证据为准。

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Parameterize Function”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REMOVE-FLAG-ARGUMENT — 移除标记参数（Remove Flag Argument）

### 意图
把用于选择行为的 flag 参数替换为意图明确的操作；普通领域 boolean 不属于行为 flag。

### 典型信号
- boolean/enum 参数并非普通数据，而是在指挥函数选择不同业务行为。

### 不适用条件
- 参数只是领域数据，而不是选择函数行为的控制指令时，不应机械拆 API。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- `SMELL-LONG-PARAMETER-LIST`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Remove Flag Argument”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-PRESERVE-WHOLE-OBJECT — 保持对象完整（Preserve Whole Object）

### 意图
当多个参数本就来自同一对象时，传递对象或窄接口，而不是先拆字段再传入。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 当前结构已经清晰，或该变换会制造更强耦合、隐藏依赖、破坏公共契约且没有兼容方案时，不使用。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- `SMELL-LONG-FUNCTION`
- `SMELL-LONG-PARAMETER-LIST`
- `SMELL-DATA-CLUMPS`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Preserve Whole Object”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REPLACE-PARAMETER-WITH-QUERY — 以查询取代参数（Replace Parameter with Query）

### 意图
当函数可以从恰当且稳定的来源获得同一值时，去掉冗余参数。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 当前结构已经清晰，或该变换会制造更强耦合、隐藏依赖、破坏公共契约且没有兼容方案时，不使用。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- `SMELL-LONG-PARAMETER-LIST`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Replace Parameter with Query”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REPLACE-QUERY-WITH-PARAMETER — 以参数取代查询（Replace Query with Parameter）

### 意图
把隐藏查询依赖变为显式参数，提高纯度、可复用性和可测试性。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 当前结构已经清晰，或该变换会制造更强耦合、隐藏依赖、破坏公共契约且没有兼容方案时，不使用。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- 不要求先存在某一种固定坏味道；以具体结构证据为准。

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Replace Query with Parameter”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REMOVE-SETTING-METHOD — 移除设值函数（Remove Setting Method）

### 意图
对于创建后不应再改变的状态，移除 setter 并把初始化放到构造/工厂阶段。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 当前结构已经清晰，或该变换会制造更强耦合、隐藏依赖、破坏公共契约且没有兼容方案时，不使用。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- `SMELL-MUTABLE-DATA`
- `SMELL-DATA-CLASS`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Remove Setting Method”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REPLACE-CONSTRUCTOR-WITH-FACTORY-FUNCTION — 以工厂函数取代构造函数（Replace Constructor with Factory Function）

### 意图
当创建过程包含选择、规范化、缓存或需要更明确名称时，用工厂函数表达创建策略。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 当前结构已经清晰，或该变换会制造更强耦合、隐藏依赖、破坏公共契约且没有兼容方案时，不使用。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- 不要求先存在某一种固定坏味道；以具体结构证据为准。

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Replace Constructor with Factory Function”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REPLACE-FUNCTION-WITH-COMMAND — 以命令取代函数（Replace Function with Command）

### 意图
只有当操作确实需要状态、undo、queue、retry、audit 或复杂生命周期时，才把函数提升为命令/执行上下文。

### 典型信号
- 一个操作确实需要持有跨步骤状态，或需要 undo、queue、retry、audit、取消/进度等生命周期。

### 不适用条件
- 简单纯函数没有状态或生命周期价值时，不引入命令对象。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- `SMELL-LONG-FUNCTION`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 复杂上传流程包含 retry、progress、cancel、audit 时，可由上传命令/会话对象持有生命周期状态。

## RF-REPLACE-COMMAND-WITH-FUNCTION — 以函数取代命令（Replace Command with Function）

### 意图
当命令对象已经没有值得保留的状态或生命周期时，将其收敛为普通函数。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 当前结构已经清晰，或该变换会制造更强耦合、隐藏依赖、破坏公共契约且没有兼容方案时，不使用。

### 前置条件
- 已明确当前可观察行为、受影响调用者和公共契约。
- 目标位于声明的差异预算内，并且这个单一主要变换完成后能够立即验证。

### 操作步骤
1. 确认当前行为、调用者和边界，并锁定本步骤只处理这一项主要结构意图。
2. 创建最小的新结构/位置/接口，让旧行为可以逐步迁移而不是一次性大改。
3. 一次迁移一个调用点或职责片段，并保持兼容边界。
4. 运行窄范围验证；若变红，先回滚本步骤，再缩小变换。

### 行为保持检查点
- 对比输入、输出、异常、副作用、执行顺序和公共契约。
- 前端还要核对 UI 状态、事件、焦点、网络请求、生命周期/状态迁移，以及相关对象身份语义。

### 相关坏味道
- 不要求先存在某一种固定坏味道；以具体结构证据为准。

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持回调 arity、`this`、默认值、异常和副作用时序。

### TypeScript 注意事项
- 导出函数签名、泛型、overload、DTO 和公共类型都属于兼容契约。

### React 注意事项
- Props/callback、Hook、loader/action、router 和 context API 可能是公共边界。

### Vue 注意事项
- props/emits、composable 返回、Pinia action、route contract 和 injection key 可能是公共边界。

### Frontend-Craft 前端适配
- 优先显式、可测试依赖；Command 只有在 undo/queue/retry/audit/复杂生命周期有价值时才值得引入。

### 原创前端变换示例
- 把“Replace Command with Function”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。
