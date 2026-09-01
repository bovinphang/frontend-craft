# 条件控制类重构

这些卡片以用户提供的标准重构目录为知识基线，转换为面向前端 Agent 的操作指南。保留标准 ID/中英文名称，框架适配和示例为项目原创内容。

## RF-DECOMPOSE-CONDITIONAL — 分解条件表达式（Decompose Conditional）

### 意图
把复杂条件、then/else 分支提炼为命名明确的判断和操作。

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

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持短路求值、异常时机、副作用顺序和 default/fallthrough 行为。

### TypeScript 注意事项
- discriminated union 与 `never` 可用于清晰表达穷尽性；assertion 不替代运行时校验。

### React 注意事项
- 卫语句不能跳过 loading 清理/effect teardown；变体渲染通常更适合 strategy/component registry。

### Vue 注意事项
- 保持 `finally`、pending/error 状态、watch/effect 行为和组件分支生命周期。

### Frontend-Craft 前端适配
- “多态”包含 strategy、discriminated-union dispatch、handler/component registry 和 delegation；class hierarchy 只是可选形式。

### 原创前端变换示例
- 把“Decompose Conditional”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-CONSOLIDATE-CONDITIONAL-EXPRESSION — 合并条件表达式（Consolidate Conditional Expression）

### 意图
把产生相同结果的一组条件合并成一个概念清晰的判断。

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
- 保持短路求值、异常时机、副作用顺序和 default/fallthrough 行为。

### TypeScript 注意事项
- discriminated union 与 `never` 可用于清晰表达穷尽性；assertion 不替代运行时校验。

### React 注意事项
- 卫语句不能跳过 loading 清理/effect teardown；变体渲染通常更适合 strategy/component registry。

### Vue 注意事项
- 保持 `finally`、pending/error 状态、watch/effect 行为和组件分支生命周期。

### Frontend-Craft 前端适配
- “多态”包含 strategy、discriminated-union dispatch、handler/component registry 和 delegation；class hierarchy 只是可选形式。

### 原创前端变换示例
- 把“Consolidate Conditional Expression”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REPLACE-NESTED-CONDITIONAL-WITH-GUARD-CLAUSES — 以卫语句取代嵌套条件表达式（Replace Nested Conditional with Guard Clauses）

### 意图
用卫语句处理特殊/异常路径，突出正常主流程，同时保证 cleanup/finally/loading 不被跳过。

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
- 保持短路求值、异常时机、副作用顺序和 default/fallthrough 行为。

### TypeScript 注意事项
- discriminated union 与 `never` 可用于清晰表达穷尽性；assertion 不替代运行时校验。

### React 注意事项
- 卫语句不能跳过 loading 清理/effect teardown；变体渲染通常更适合 strategy/component registry。

### Vue 注意事项
- 保持 `finally`、pending/error 状态、watch/effect 行为和组件分支生命周期。

### Frontend-Craft 前端适配
- “多态”包含 strategy、discriminated-union dispatch、handler/component registry 和 delegation；class hierarchy 只是可选形式。

### 原创前端变换示例
- 提交逻辑从多层 auth/draft/recipient 嵌套改为卫语句，但必须保留 `finally` 中 loading 复位。

## RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM — 以多态取代条件表达式（Replace Conditional with Polymorphism）

### 意图
把重复的变体行为放入分派边界；前端可用 discriminated union、strategy map、handler/component registry、delegation，而非强制类继承。

### 典型信号
- 同一 type/status/variant 在多个位置重复驱动不同处理方式。

### 不适用条件
- 只有一个清晰条件分支时，不为了“多态”强行引入 class hierarchy。

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
- `SMELL-PRIMITIVE-OBSESSION`
- `SMELL-REPEATED-SWITCHES`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持短路求值、异常时机、副作用顺序和 default/fallthrough 行为。

### TypeScript 注意事项
- discriminated union 与 `never` 可用于清晰表达穷尽性；assertion 不替代运行时校验。

### React 注意事项
- 卫语句不能跳过 loading 清理/effect teardown；变体渲染通常更适合 strategy/component registry。

### Vue 注意事项
- 保持 `finally`、pending/error 状态、watch/effect 行为和组件分支生命周期。

### Frontend-Craft 前端适配
- “多态”包含 strategy、discriminated-union dispatch、handler/component registry 和 delegation；class hierarchy 只是可选形式。

### 原创前端变换示例
- 邮件类型在渲染和操作中反复 switch，可改为类型安全的 handler/component registry 或 discriminated union 分派。

## RF-INTRODUCE-SPECIAL-CASE — 引入特例（Introduce Special Case）

### 意图
为反复出现的 null/unknown/sentinel 情况建立统一特例表示，减少散落检查。

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
- `SMELL-TEMPORARY-FIELD`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持短路求值、异常时机、副作用顺序和 default/fallthrough 行为。

### TypeScript 注意事项
- discriminated union 与 `never` 可用于清晰表达穷尽性；assertion 不替代运行时校验。

### React 注意事项
- 卫语句不能跳过 loading 清理/effect teardown；变体渲染通常更适合 strategy/component registry。

### Vue 注意事项
- 保持 `finally`、pending/error 状态、watch/effect 行为和组件分支生命周期。

### Frontend-Craft 前端适配
- “多态”包含 strategy、discriminated-union dispatch、handler/component registry 和 delegation；class hierarchy 只是可选形式。

### 原创前端变换示例
- 把“Introduce Special Case”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-INTRODUCE-ASSERTION — 引入断言（Introduce Assertion）

### 意图
把只应在程序错误时被违反的内部不变量显式化；不能替代用户输入校验和正常错误处理。

### 典型信号
- 内部流程依赖一个“若违反即代表程序错误”的不变量，但代码未显式表达。

### 不适用条件
- 输入无效、网络失败、权限不足等预期错误不能用 assertion 代替正常校验和错误处理。

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
- `SMELL-COMMENTS`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- 保持短路求值、异常时机、副作用顺序和 default/fallthrough 行为。

### TypeScript 注意事项
- discriminated union 与 `never` 可用于清晰表达穷尽性；assertion 不替代运行时校验。

### React 注意事项
- 卫语句不能跳过 loading 清理/effect teardown；变体渲染通常更适合 strategy/component registry。

### Vue 注意事项
- 保持 `finally`、pending/error 状态、watch/effect 行为和组件分支生命周期。

### Frontend-Craft 前端适配
- “多态”包含 strategy、discriminated-union dispatch、handler/component registry 和 delegation；class hierarchy 只是可选形式。

### 原创前端变换示例
- 把“Introduce Assertion”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。
