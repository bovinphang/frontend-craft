# 61 项标准重构目录

本表用于快速导航。详细动机、前置条件、操作步骤、行为保持检查和前端适配请打开对应中文 Reference。

## 函数组织（第 6 章） — 11 项

| ID | 中文标准名 | 英文标准名 | 详细知识 |
| --- | --- | --- | --- |
| `RF-EXTRACT-FUNCTION` | 提炼函数 | Extract Function | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-INLINE-FUNCTION` | 内联函数 | Inline Function | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-EXTRACT-VARIABLE` | 提炼变量 | Extract Variable | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-INLINE-VARIABLE` | 内联变量 | Inline Variable | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-CHANGE-FUNCTION-DECLARATION` | 改变函数声明 | Change Function Declaration | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-ENCAPSULATE-VARIABLE` | 封装变量 | Encapsulate Variable | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-RENAME-VARIABLE` | 变量改名 | Rename Variable | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-INTRODUCE-PARAMETER-OBJECT` | 引入参数对象 | Introduce Parameter Object | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-COMBINE-FUNCTIONS-INTO-CLASS` | 函数组合成类 | Combine Functions into Class | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-COMBINE-FUNCTIONS-INTO-TRANSFORM` | 函数组合成变换 | Combine Functions into Transform | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |
| `RF-SPLIT-PHASE` | 拆分阶段 | Split Phase | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-functions/references/function-refactorings.md) |

## 封装（第 7 章） — 9 项

| ID | 中文标准名 | 英文标准名 | 详细知识 |
| --- | --- | --- | --- |
| `RF-ENCAPSULATE-RECORD` | 封装记录 | Encapsulate Record | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |
| `RF-ENCAPSULATE-COLLECTION` | 封装集合 | Encapsulate Collection | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |
| `RF-REPLACE-PRIMITIVE-WITH-OBJECT` | 以对象取代基本类型 | Replace Primitive with Object | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |
| `RF-REPLACE-TEMP-WITH-QUERY` | 以查询取代临时变量 | Replace Temp with Query | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |
| `RF-EXTRACT-CLASS` | 提炼类 | Extract Class | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |
| `RF-INLINE-CLASS` | 内联类 | Inline Class | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |
| `RF-HIDE-DELEGATE` | 隐藏委托关系 | Hide Delegate | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |
| `RF-REMOVE-MIDDLE-MAN` | 移除中间人 | Remove Middle Man | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |
| `RF-SUBSTITUTE-ALGORITHM` | 替换算法 | Substitute Algorithm | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-encapsulation/references/encapsulation-refactorings.md) |

## 搬移特性（第 8 章） — 9 项

| ID | 中文标准名 | 英文标准名 | 详细知识 |
| --- | --- | --- | --- |
| `RF-MOVE-FUNCTION` | 搬移函数 | Move Function | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |
| `RF-MOVE-FIELD` | 搬移字段 | Move Field | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |
| `RF-MOVE-STATEMENTS-INTO-FUNCTION` | 搬移语句到函数 | Move Statements into Function | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |
| `RF-MOVE-STATEMENTS-TO-CALLERS` | 搬移语句到调用者 | Move Statements to Callers | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |
| `RF-REPLACE-INLINE-CODE-WITH-FUNCTION-CALL` | 以函数调用取代内联代码 | Replace Inline Code with Function Call | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |
| `RF-SLIDE-STATEMENTS` | 移动语句 | Slide Statements | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |
| `RF-SPLIT-LOOP` | 拆分循环 | Split Loop | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |
| `RF-REPLACE-LOOP-WITH-PIPELINE` | 以管道取代循环 | Replace Loop with Pipeline | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |
| `RF-REMOVE-DEAD-CODE` | 移除死代码 | Remove Dead Code | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-move-features/references/moving-refactorings.md) |

## 重新组织数据（第 9 章） — 5 项

| ID | 中文标准名 | 英文标准名 | 详细知识 |
| --- | --- | --- | --- |
| `RF-SPLIT-VARIABLE` | 拆分变量 | Split Variable | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-data/references/data-refactorings.md) |
| `RF-RENAME-FIELD` | 字段改名 | Rename Field | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-data/references/data-refactorings.md) |
| `RF-REPLACE-DERIVED-VARIABLE-WITH-QUERY` | 以查询取代派生变量 | Replace Derived Variable with Query | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-data/references/data-refactorings.md) |
| `RF-CHANGE-REFERENCE-TO-VALUE` | 将引用对象改为值对象 | Change Reference to Value | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-data/references/data-refactorings.md) |
| `RF-CHANGE-VALUE-TO-REFERENCE` | 将值对象改为引用对象 | Change Value to Reference | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-data/references/data-refactorings.md) |

## 简化条件逻辑（第 10 章） — 6 项

| ID | 中文标准名 | 英文标准名 | 详细知识 |
| --- | --- | --- | --- |
| `RF-DECOMPOSE-CONDITIONAL` | 分解条件表达式 | Decompose Conditional | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-control/references/conditional-refactorings.md) |
| `RF-CONSOLIDATE-CONDITIONAL-EXPRESSION` | 合并条件表达式 | Consolidate Conditional Expression | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-control/references/conditional-refactorings.md) |
| `RF-REPLACE-NESTED-CONDITIONAL-WITH-GUARD-CLAUSES` | 以卫语句取代嵌套条件表达式 | Replace Nested Conditional with Guard Clauses | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-control/references/conditional-refactorings.md) |
| `RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM` | 以多态取代条件表达式 | Replace Conditional with Polymorphism | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-control/references/conditional-refactorings.md) |
| `RF-INTRODUCE-SPECIAL-CASE` | 引入特例 | Introduce Special Case | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-control/references/conditional-refactorings.md) |
| `RF-INTRODUCE-ASSERTION` | 引入断言 | Introduce Assertion | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-control/references/conditional-refactorings.md) |

## 重构 API（第 11 章） — 10 项

| ID | 中文标准名 | 英文标准名 | 详细知识 |
| --- | --- | --- | --- |
| `RF-SEPARATE-QUERY-FROM-MODIFIER` | 将查询函数和修改函数分离 | Separate Query from Modifier | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-PARAMETERIZE-FUNCTION` | 函数参数化 | Parameterize Function | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-REMOVE-FLAG-ARGUMENT` | 移除标记参数 | Remove Flag Argument | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-PRESERVE-WHOLE-OBJECT` | 保持对象完整 | Preserve Whole Object | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-REPLACE-PARAMETER-WITH-QUERY` | 以查询取代参数 | Replace Parameter with Query | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-REPLACE-QUERY-WITH-PARAMETER` | 以参数取代查询 | Replace Query with Parameter | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-REMOVE-SETTING-METHOD` | 移除设值函数 | Remove Setting Method | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-REPLACE-CONSTRUCTOR-WITH-FACTORY-FUNCTION` | 以工厂函数取代构造函数 | Replace Constructor with Factory Function | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-REPLACE-FUNCTION-WITH-COMMAND` | 以命令取代函数 | Replace Function with Command | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |
| `RF-REPLACE-COMMAND-WITH-FUNCTION` | 以函数取代命令 | Replace Command with Function | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-api/references/api-refactorings.md) |

## 处理继承关系（第 12 章） — 11 项

| ID | 中文标准名 | 英文标准名 | 详细知识 |
| --- | --- | --- | --- |
| `RF-PULL-UP-METHOD` | 函数上移 | Pull Up Method | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-PULL-UP-FIELD` | 字段上移 | Pull Up Field | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-PULL-UP-CONSTRUCTOR-BODY` | 构造函数本体上移 | Pull Up Constructor Body | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-PUSH-DOWN-METHOD` | 函数下移 | Push Down Method | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-PUSH-DOWN-FIELD` | 字段下移 | Push Down Field | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES` | 以子类取代类型码 | Replace Type Code with Subclasses | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-REMOVE-SUBCLASS` | 移除子类 | Remove Subclass | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-EXTRACT-SUPERCLASS` | 提炼超类 | Extract Superclass | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-COLLAPSE-HIERARCHY` | 折叠继承体系 | Collapse Hierarchy | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-REPLACE-SUBCLASS-WITH-DELEGATE` | 以委托取代子类 | Replace Subclass with Delegate | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |
| `RF-REPLACE-SUPERCLASS-WITH-DELEGATE` | 以委托取代超类 | Replace Superclass with Delegate | [查看 Reference](../../localized/zh-CN/skills/fec-refactoring-inheritance/references/inheritance-refactorings.md) |

## 完整性

- 总计：**61** 项。
- 分组数量：`11 / 9 / 9 / 5 / 6 / 10 / 11`。
- `RF-REMOVE-DEAD-CODE` 保留在目录中保证知识完整，但实际死代码发现与删除路由到 `fec-refactor-clean`。
