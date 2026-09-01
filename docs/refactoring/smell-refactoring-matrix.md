# 24 种代码坏味道与重构手法速查矩阵

本矩阵基于已归一化的第 3 章坏味道关系。候选手法不是机械映射；实际选择还必须检查成因、前置条件、风险、行为契约和差异预算。

| 坏味道 | 主要/辅助候选 | 选择提示 |
| --- | --- | --- |
| `SMELL-MYSTERIOUS-NAME`<br>神秘命名（Mysterious Name） | `RF-CHANGE-FUNCTION-DECLARATION`<br>`RF-RENAME-VARIABLE`<br>`RF-RENAME-FIELD` | 先确认“神秘命名”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-DUPLICATED-CODE`<br>重复代码（Duplicated Code） | `RF-EXTRACT-FUNCTION`<br>`RF-SLIDE-STATEMENTS`<br>`RF-PULL-UP-METHOD` | 先确认“重复代码”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-LONG-FUNCTION`<br>过长函数（Long Function） | `RF-EXTRACT-FUNCTION`<br>`RF-REPLACE-TEMP-WITH-QUERY`<br>`RF-INTRODUCE-PARAMETER-OBJECT`<br>`RF-PRESERVE-WHOLE-OBJECT`<br>`RF-REPLACE-FUNCTION-WITH-COMMAND`<br>`RF-DECOMPOSE-CONDITIONAL`<br>`RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM`<br>`RF-SPLIT-LOOP` | 先确认“过长函数”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-LONG-PARAMETER-LIST`<br>过长参数列表（Long Parameter List） | `RF-REPLACE-PARAMETER-WITH-QUERY`<br>`RF-PRESERVE-WHOLE-OBJECT`<br>`RF-INTRODUCE-PARAMETER-OBJECT`<br>`RF-REMOVE-FLAG-ARGUMENT`<br>`RF-COMBINE-FUNCTIONS-INTO-CLASS` | 先确认“过长参数列表”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-GLOBAL-DATA`<br>全局数据（Global Data） | `RF-ENCAPSULATE-VARIABLE` | 先确认“全局数据”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-MUTABLE-DATA`<br>可变数据（Mutable Data） | `RF-ENCAPSULATE-VARIABLE`<br>`RF-SPLIT-VARIABLE`<br>`RF-SLIDE-STATEMENTS`<br>`RF-EXTRACT-FUNCTION`<br>`RF-SEPARATE-QUERY-FROM-MODIFIER`<br>`RF-REMOVE-SETTING-METHOD`<br>`RF-REPLACE-DERIVED-VARIABLE-WITH-QUERY`<br>`RF-COMBINE-FUNCTIONS-INTO-CLASS`<br>`RF-COMBINE-FUNCTIONS-INTO-TRANSFORM`<br>`RF-CHANGE-REFERENCE-TO-VALUE` | 先确认“可变数据”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-DIVERGENT-CHANGE`<br>发散式变化（Divergent Change） | `RF-SPLIT-PHASE`<br>`RF-MOVE-FUNCTION`<br>`RF-EXTRACT-FUNCTION`<br>`RF-EXTRACT-CLASS` | 先确认“发散式变化”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-SHOTGUN-SURGERY`<br>霰弹式修改（Shotgun Surgery） | `RF-MOVE-FUNCTION`<br>`RF-MOVE-FIELD`<br>`RF-COMBINE-FUNCTIONS-INTO-CLASS`<br>`RF-COMBINE-FUNCTIONS-INTO-TRANSFORM`<br>`RF-SPLIT-PHASE`<br>`RF-INLINE-FUNCTION`<br>`RF-INLINE-CLASS` | 先确认“霰弹式修改”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-FEATURE-ENVY`<br>依恋情结（Feature Envy） | `RF-MOVE-FUNCTION`<br>`RF-EXTRACT-FUNCTION` | 先确认“依恋情结”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-DATA-CLUMPS`<br>数据泥团（Data Clumps） | `RF-EXTRACT-CLASS`<br>`RF-INTRODUCE-PARAMETER-OBJECT`<br>`RF-PRESERVE-WHOLE-OBJECT` | 先确认“数据泥团”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-PRIMITIVE-OBSESSION`<br>基本类型偏执（Primitive Obsession） | `RF-REPLACE-PRIMITIVE-WITH-OBJECT`<br>`RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES`<br>`RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM`<br>`RF-EXTRACT-CLASS`<br>`RF-INTRODUCE-PARAMETER-OBJECT` | 先确认“基本类型偏执”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-REPEATED-SWITCHES`<br>重复的 switch（Repeated Switches） | `RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM` | 先确认“重复的 switch”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-LOOPS`<br>循环语句（Loops） | `RF-REPLACE-LOOP-WITH-PIPELINE` | 先确认“循环语句”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-LAZY-ELEMENT`<br>冗赘的元素（Lazy Element） | `RF-INLINE-FUNCTION`<br>`RF-INLINE-CLASS`<br>`RF-COLLAPSE-HIERARCHY` | 先确认“冗赘的元素”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-SPECULATIVE-GENERALITY`<br>夸夸其谈通用性（Speculative Generality） | `RF-COLLAPSE-HIERARCHY`<br>`RF-INLINE-FUNCTION`<br>`RF-INLINE-CLASS`<br>`RF-CHANGE-FUNCTION-DECLARATION`<br>`RF-REMOVE-DEAD-CODE` | 先确认“夸夸其谈通用性”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-TEMPORARY-FIELD`<br>临时字段（Temporary Field） | `RF-EXTRACT-CLASS`<br>`RF-MOVE-FUNCTION`<br>`RF-INTRODUCE-SPECIAL-CASE` | 先确认“临时字段”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-MESSAGE-CHAINS`<br>过长的消息链（Message Chains） | `RF-HIDE-DELEGATE`<br>`RF-EXTRACT-FUNCTION`<br>`RF-MOVE-FUNCTION` | 先确认“过长的消息链”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-MIDDLE-MAN`<br>中间人（Middle Man） | `RF-REMOVE-MIDDLE-MAN`<br>`RF-INLINE-FUNCTION`<br>`RF-REPLACE-SUPERCLASS-WITH-DELEGATE`<br>`RF-REPLACE-SUBCLASS-WITH-DELEGATE` | 先确认“中间人”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-INSIDER-TRADING`<br>内幕交易（Insider Trading） | `RF-MOVE-FUNCTION`<br>`RF-MOVE-FIELD`<br>`RF-HIDE-DELEGATE`<br>`RF-REPLACE-SUBCLASS-WITH-DELEGATE`<br>`RF-REPLACE-SUPERCLASS-WITH-DELEGATE` | 先确认“内幕交易”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-LARGE-CLASS`<br>过大的类（Large Class） | `RF-EXTRACT-CLASS`<br>`RF-EXTRACT-SUPERCLASS`<br>`RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES` | 先确认“过大的类”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-ALTERNATIVE-CLASSES-DIFFERENT-INTERFACES`<br>异曲同工的类（Alternative Classes with Different Interfaces） | `RF-CHANGE-FUNCTION-DECLARATION`<br>`RF-MOVE-FUNCTION`<br>`RF-EXTRACT-SUPERCLASS` | 先确认“异曲同工的类”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-DATA-CLASS`<br>纯数据类（Data Class） | `RF-ENCAPSULATE-RECORD`<br>`RF-REMOVE-SETTING-METHOD`<br>`RF-MOVE-FUNCTION`<br>`RF-EXTRACT-FUNCTION`<br>`RF-SPLIT-PHASE` | 先确认“纯数据类”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-REFUSED-BEQUEST`<br>被拒绝的遗赠（Refused Bequest） | `RF-PUSH-DOWN-METHOD`<br>`RF-PUSH-DOWN-FIELD`<br>`RF-REPLACE-SUBCLASS-WITH-DELEGATE`<br>`RF-REPLACE-SUPERCLASS-WITH-DELEGATE` | 先确认“被拒绝的遗赠”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |
| `SMELL-COMMENTS`<br>注释（Comments） | `RF-EXTRACT-FUNCTION`<br>`RF-CHANGE-FUNCTION-DECLARATION`<br>`RF-INTRODUCE-ASSERTION` | 先确认“注释”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。 |

## 误判保护

- 行数本身不能证明“过长函数”或“过大的类”；
- 单个 `switch` 不能证明“重复的 switch”；
- `filter().map().reduce()` 之类数据管道不自动等同于“过长的消息链”；
- 注释本身不是缺陷，不能仅因 `Comments` 是坏味道类别就删除注释；
- 不可变 DTO/中转数据可以合理保持为数据型结构；
- React/Vue 声明式组合不自动等同于“中间人”或“过长的消息链”。

详细诊断规则见 [`fec-code-smells`](../../localized/zh-CN/skills/fec-code-smells/references/detection-guide.md)。
