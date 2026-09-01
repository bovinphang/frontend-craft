# 继承关系类重构

这些卡片以用户提供的标准重构目录为知识基线，转换为面向前端 Agent 的操作指南。保留标准 ID/中英文名称，框架适配和示例为项目原创内容。

## RF-PULL-UP-METHOD — 函数上移（Pull Up Method）

### 意图
当兄弟子类真正共享同一行为时，把等价方法上移到超类。

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
- `SMELL-DUPLICATED-CODE`

### 常见组合
- `RF-PUSH-DOWN-METHOD`：仅当下一手法自身前置条件也成立时组合。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Pull Up Method”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-PULL-UP-FIELD — 字段上移（Pull Up Field）

### 意图
当兄弟子类真正拥有同一数据概念时，把重复字段上移到超类。

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
- `RF-PUSH-DOWN-FIELD`：仅当下一手法自身前置条件也成立时组合。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Pull Up Field”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-PULL-UP-CONSTRUCTOR-BODY — 构造函数本体上移（Pull Up Constructor Body）

### 意图
把子类构造函数中重复且安全的公共初始化上移到超类。

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
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Pull Up Constructor Body”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-PUSH-DOWN-METHOD — 函数下移（Push Down Method）

### 意图
当超类方法只对部分子类有意义时，把它下移到真正需要的子类。

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
- `SMELL-REFUSED-BEQUEST`

### 常见组合
- `RF-PULL-UP-METHOD`：仅当下一手法自身前置条件也成立时组合。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Push Down Method”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-PUSH-DOWN-FIELD — 字段下移（Push Down Field）

### 意图
当超类字段只属于部分子类时，把它下移到真正的数据所有者。

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
- `SMELL-REFUSED-BEQUEST`

### 常见组合
- `RF-PULL-UP-FIELD`：仅当下一手法自身前置条件也成立时组合。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Push Down Field”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES — 以子类取代类型码（Replace Type Code with Subclasses）

### 意图
让稳定变体拥有自己的行为边界；现代前端优先考虑 discriminated union/strategy dispatch，不机械建立继承树。

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
- `SMELL-PRIMITIVE-OBSESSION`
- `SMELL-LARGE-CLASS`

### 常见组合
- 以多态取代条件表达式（Replace Conditional with Polymorphism）：仅当下一手法自身前置条件也成立时组合。
- `RF-REMOVE-SUBCLASS`：仅当下一手法自身前置条件也成立时组合。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 编辑器 mode string 驱动多个 switch 时，现代前端可用 discriminated union + strategy registry；只有真实 OO 模型才使用子类。

## RF-REMOVE-SUBCLASS — 移除子类（Remove Subclass）

### 意图
当子类差异已经没有独立类型价值时，将差异收回数据或更简单的行为表示并移除子类。

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
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Remove Subclass”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-EXTRACT-SUPERCLASS — 提炼超类（Extract Superclass）

### 意图
当多个类真正共享职责且替换关系有价值时，提炼共同抽象；仅为去重几行代码不值得建立继承。

### 典型信号
- 当前结构出现与本手法目标一致的重复、耦合、命名、职责、数据所有权或控制流问题，并有具体代码证据。

### 不适用条件
- 仅为了消除几行重复、但不存在真实替换关系时，优先组合或共享函数。

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
- `SMELL-LARGE-CLASS`
- `SMELL-ALTERNATIVE-CLASSES-DIFFERENT-INTERFACES`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Extract Superclass”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-COLLAPSE-HIERARCHY — 折叠继承体系（Collapse Hierarchy）

### 意图
当某个继承层级已没有有意义差异时合并层级，减少无价值类型间接层。

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
- `SMELL-LAZY-ELEMENT`
- `SMELL-SPECULATIVE-GENERALITY`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Collapse Hierarchy”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REPLACE-SUBCLASS-WITH-DELEGATE — 以委托取代子类（Replace Subclass with Delegate）

### 意图
把一个变化维度从继承转为委托/策略，使对象能更灵活地组合行为。

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
- `SMELL-MIDDLE-MAN`
- `SMELL-INSIDER-TRADING`
- `SMELL-REFUSED-BEQUEST`

### 常见组合
- `RF-REPLACE-SUPERCLASS-WITH-DELEGATE`：仅当下一手法自身前置条件也成立时组合。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 把“Replace Subclass with Delegate”应用到一个局部组件/Hook/Composable/Service 范围内，先记录行为契约，只迁移一个职责片段，并立即验证输出、事件与状态变化保持不变。

## RF-REPLACE-SUPERCLASS-WITH-DELEGATE — 以委托取代超类（Replace Superclass with Delegate）

### 意图
当继承只是为了复用实现而不满足真实替换关系时，改为持有并委托所需能力。

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
- `SMELL-MIDDLE-MAN`
- `SMELL-INSIDER-TRADING`
- `SMELL-REFUSED-BEQUEST`

### 常见组合
- 不建立固定流水线；下一步必须重新依据证据选择。

### JavaScript 注意事项
- legacy OO 中保持原型行为、构造顺序、`instanceof`、方法绑定和 `super` 调用。

### TypeScript 注意事项
- 检查结构类型、discriminated union、abstract contract、可见性和公共 subtype API。

### React 注意事项
- React 组件通常优先 composition、Hook、render props 或 delegate，而不是类继承。

### Vue 注意事项
- Vue 组件通常优先 composition、composable、slot 和 delegation，而不是继承。

### Frontend-Craft 前端适配
- 这些手法主要服务真实的 legacy OO JS/TS、domain model、SDK、editor engine；组合优先的前端代码应转换其设计意图而不是照搬继承。

### 原创前端变换示例
- 编辑器仅为了复用集合实现而 extends Collection，可改为持有 collection delegate，只暴露编辑器真正需要的能力。
