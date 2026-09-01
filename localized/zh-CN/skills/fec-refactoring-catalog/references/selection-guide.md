# 重构选择指南

必须按真实成因选择，同一种坏味道可能需要不同手法。

## 过长函数（Long Function）
- 多个可命名意图混在一起 → `RF-EXTRACT-FUNCTION`。
- 临时变量阻碍提炼 → `RF-REPLACE-TEMP-WITH-QUERY`，但需检查重复计算和副作用。
- 多个输入总是共同出现 → `RF-INTRODUCE-PARAMETER-OBJECT` 或 `RF-PRESERVE-WHOLE-OBJECT`。
- 按类型/变体存在大型条件 → 先考虑 `RF-DECOMPOSE-CONDITIONAL`；只有重复变体行为确实需要分派时再考虑 `RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM`。
- 单个循环承担多个目的 → 在顺序和性能允许时使用 `RF-SPLIT-LOOP`。

## 过长参数列表（Long Parameter List）
- 参数可由其他稳定输入查询得到 → `RF-REPLACE-PARAMETER-WITH-QUERY`。
- 调用者从一个现有对象拆出大量字段 → `RF-PRESERVE-WHOLE-OBJECT`。
- 一组值反复共同出现 → `RF-INTRODUCE-PARAMETER-OBJECT`。
- boolean/enum 用于选择行为 → `RF-REMOVE-FLAG-ARGUMENT`；普通领域数据不属于这种情况。
- 多个函数共享同一数据上下文 → `RF-COMBINE-FUNCTIONS-INTO-CLASS`，前端可对应 module/hook/composable/service，并不强制 class。

## 可变数据（Mutable Data）
- 共享写入无边界 → `RF-ENCAPSULATE-VARIABLE`。
- 一个变量承担多个含义 → `RF-SPLIT-VARIABLE`。
- 查询同时修改状态 → `RF-SEPARATE-QUERY-FROM-MODIFIER`。
- 派生值被存储后容易漂移 → `RF-REPLACE-DERIVED-VARIABLE-WITH-QUERY`，同时评估计算成本与 memoization。
- React/Vue 的引用身份、响应式、订阅和持久化都属于行为验证范围。

## 发散式变化（Divergent Change）
- 一个流程包含可分阶段关注点 → `RF-SPLIT-PHASE` 或 `RF-EXTRACT-FUNCTION`。
- 行为主要依赖另一数据所有者 → `RF-MOVE-FUNCTION`。
- 一组状态和规则构成独立职责 → `RF-EXTRACT-CLASS`，在前端可落为 module/service/hook/composable。

## 霰弹式修改（Shotgun Surgery）
- 应共同变化的行为/数据散落各处 → `RF-MOVE-FUNCTION` / `RF-MOVE-FIELD`。
- 多个函数共享同一上下文 → `RF-COMBINE-FUNCTIONS-INTO-CLASS` / `RF-COMBINE-FUNCTIONS-INTO-TRANSFORM`。
- 流程阶段可分离 → `RF-SPLIT-PHASE`。
- 过早的小抽象造成分散 → 可先 `RF-INLINE-FUNCTION` / `RF-INLINE-CLASS` 聚拢，再重新提炼；每个中间状态都必须验证。

## 基本类型偏执（Primitive Obsession）
- 基本类型承载不变量、格式化或领域行为 → `RF-REPLACE-PRIMITIVE-WITH-OBJECT`；仅 TypeScript type alias 不等于运行时封装。
- 类型码驱动重复变体行为 → `RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES` 或更适合前端的 discriminated union/strategy。
- 真正问题是重复条件分派 → `RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM`，选择最符合项目范式的分派方式。
- 多个基本值共同构成概念 → `RF-EXTRACT-CLASS` 或 `RF-INTRODUCE-PARAMETER-OBJECT`。
