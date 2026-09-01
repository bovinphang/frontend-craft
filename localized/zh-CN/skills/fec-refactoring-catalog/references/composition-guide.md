# 重构组合指南

这里的关系都有前置条件，不是无条件 pipeline。每个中间状态都必须保持行为并立即验证。

## 相反方向 / 权衡
- `RF-EXTRACT-FUNCTION` ↔ `RF-INLINE-FUNCTION`：建立有意义边界，或移除已经没有价值的间接层。
- `RF-EXTRACT-VARIABLE` ↔ `RF-INLINE-VARIABLE`：为重要表达式命名，或移除反而遮蔽含义的中间名。
- `RF-PULL-UP-METHOD` ↔ `RF-PUSH-DOWN-METHOD`：把行为放到真正共享或真正专有的层级。
- `RF-PULL-UP-FIELD` ↔ `RF-PUSH-DOWN-FIELD`：把数据放到准确且尽量窄的继承层级。
- `RF-HIDE-DELEGATE` ↔ `RF-REMOVE-MIDDLE-MAN`：在客户端耦合与过度转发之间取舍。

## 常见有条件序列
### 提炼后再搬移
`RF-EXTRACT-FUNCTION` → `RF-MOVE-FUNCTION`

当大函数中只有一部分明显依恋另一个数据所有者时，先提炼成可独立验证的函数，再搬到更合适的位置。

### 查询化后更容易提炼
`RF-REPLACE-TEMP-WITH-QUERY` → `RF-EXTRACT-FUNCTION`

临时变量妨碍边界时使用；需要先确认查询可安全重复计算或有正确缓存。

### 类型拆分后再做变体分派
`RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES` → `RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM`

适用于真实 OO/domain hierarchy；现代前端可使用 discriminated union + strategy/component map 表达同一意图。

### 先聚拢再重新提炼
`RF-INLINE-FUNCTION` / `RF-INLINE-CLASS` → 聚拢分散逻辑 → `RF-EXTRACT-FUNCTION` / `RF-EXTRACT-CLASS`

适合由不合理小抽象造成的霰弹式修改。暂时变大的中间单元仍必须验证。

### 拆分流程并重新安置职责
`RF-SPLIT-PHASE` → `RF-EXTRACT-FUNCTION` → `RF-MOVE-FUNCTION`

流程存在独立阶段，且阶段提炼后拥有更清晰数据所有者时使用。

### 先控制共享变量再改结构
`RF-ENCAPSULATE-VARIABLE` → `RF-RENAME-VARIABLE` / `RF-MOVE-FUNCTION`

共享变量需要先形成访问边界，再进行命名或所有权调整时使用。

### 先封装记录再封装集合
`RF-ENCAPSULATE-RECORD` → `RF-ENCAPSULATE-COLLECTION`

当调用者同时直接操作记录字段和集合修改时使用。

## 停止条件
当前步骤验证失败、超出差异预算、意外改变公共契约，或下一步前置条件已不成立时，立即停止组合序列并重新评估。
