# 坏味道到重构手法映射

候选手法只用于辅助选择。必须结合实际成因、前置条件、风险和“最小安全变化”判断，不能按关键词机械套用。

## SMELL-MYSTERIOUS-NAME — 神秘命名（Mysterious Name）

**主要/辅助候选**
- `RF-CHANGE-FUNCTION-DECLARATION`
- `RF-RENAME-VARIABLE`
- `RF-RENAME-FIELD`

**选择提示**
- 先确认“神秘命名”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-DUPLICATED-CODE — 重复代码（Duplicated Code）

**主要/辅助候选**
- `RF-EXTRACT-FUNCTION`
- `RF-SLIDE-STATEMENTS`
- `RF-PULL-UP-METHOD`

**选择提示**
- 先确认“重复代码”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-LONG-FUNCTION — 过长函数（Long Function）

**主要/辅助候选**
- `RF-EXTRACT-FUNCTION`
- `RF-REPLACE-TEMP-WITH-QUERY`
- `RF-INTRODUCE-PARAMETER-OBJECT`
- `RF-PRESERVE-WHOLE-OBJECT`
- `RF-REPLACE-FUNCTION-WITH-COMMAND`
- `RF-DECOMPOSE-CONDITIONAL`
- `RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM`
- `RF-SPLIT-LOOP`

**选择提示**
- 先确认“过长函数”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-LONG-PARAMETER-LIST — 过长参数列表（Long Parameter List）

**主要/辅助候选**
- `RF-REPLACE-PARAMETER-WITH-QUERY`
- `RF-PRESERVE-WHOLE-OBJECT`
- `RF-INTRODUCE-PARAMETER-OBJECT`
- `RF-REMOVE-FLAG-ARGUMENT`
- `RF-COMBINE-FUNCTIONS-INTO-CLASS`

**选择提示**
- 先确认“过长参数列表”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-GLOBAL-DATA — 全局数据（Global Data）

**主要/辅助候选**
- `RF-ENCAPSULATE-VARIABLE`

**选择提示**
- 先确认“全局数据”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-MUTABLE-DATA — 可变数据（Mutable Data）

**主要/辅助候选**
- `RF-ENCAPSULATE-VARIABLE`
- `RF-SPLIT-VARIABLE`
- `RF-SLIDE-STATEMENTS`
- `RF-EXTRACT-FUNCTION`
- `RF-SEPARATE-QUERY-FROM-MODIFIER`
- `RF-REMOVE-SETTING-METHOD`
- `RF-REPLACE-DERIVED-VARIABLE-WITH-QUERY`
- `RF-COMBINE-FUNCTIONS-INTO-CLASS`
- `RF-COMBINE-FUNCTIONS-INTO-TRANSFORM`
- `RF-CHANGE-REFERENCE-TO-VALUE`

**选择提示**
- 先确认“可变数据”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-DIVERGENT-CHANGE — 发散式变化（Divergent Change）

**主要/辅助候选**
- `RF-SPLIT-PHASE`
- `RF-MOVE-FUNCTION`
- `RF-EXTRACT-FUNCTION`
- `RF-EXTRACT-CLASS`

**选择提示**
- 先确认“发散式变化”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-SHOTGUN-SURGERY — 霰弹式修改（Shotgun Surgery）

**主要/辅助候选**
- `RF-MOVE-FUNCTION`
- `RF-MOVE-FIELD`
- `RF-COMBINE-FUNCTIONS-INTO-CLASS`
- `RF-COMBINE-FUNCTIONS-INTO-TRANSFORM`
- `RF-SPLIT-PHASE`
- `RF-INLINE-FUNCTION`
- `RF-INLINE-CLASS`

**选择提示**
- 先确认“霰弹式修改”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-FEATURE-ENVY — 依恋情结（Feature Envy）

**主要/辅助候选**
- `RF-MOVE-FUNCTION`
- `RF-EXTRACT-FUNCTION`

**选择提示**
- 先确认“依恋情结”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-DATA-CLUMPS — 数据泥团（Data Clumps）

**主要/辅助候选**
- `RF-EXTRACT-CLASS`
- `RF-INTRODUCE-PARAMETER-OBJECT`
- `RF-PRESERVE-WHOLE-OBJECT`

**选择提示**
- 先确认“数据泥团”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-PRIMITIVE-OBSESSION — 基本类型偏执（Primitive Obsession）

**主要/辅助候选**
- `RF-REPLACE-PRIMITIVE-WITH-OBJECT`
- `RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES`
- `RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM`
- `RF-EXTRACT-CLASS`
- `RF-INTRODUCE-PARAMETER-OBJECT`

**选择提示**
- 先确认“基本类型偏执”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-REPEATED-SWITCHES — 重复的 switch（Repeated Switches）

**主要/辅助候选**
- `RF-REPLACE-CONDITIONAL-WITH-POLYMORPHISM`

**选择提示**
- 先确认“重复的 switch”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-LOOPS — 循环语句（Loops）

**主要/辅助候选**
- `RF-REPLACE-LOOP-WITH-PIPELINE`

**选择提示**
- 先确认“循环语句”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-LAZY-ELEMENT — 冗赘的元素（Lazy Element）

**主要/辅助候选**
- `RF-INLINE-FUNCTION`
- `RF-INLINE-CLASS`
- `RF-COLLAPSE-HIERARCHY`

**选择提示**
- 先确认“冗赘的元素”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-SPECULATIVE-GENERALITY — 夸夸其谈通用性（Speculative Generality）

**主要/辅助候选**
- `RF-COLLAPSE-HIERARCHY`
- `RF-INLINE-FUNCTION`
- `RF-INLINE-CLASS`
- `RF-CHANGE-FUNCTION-DECLARATION`
- `RF-REMOVE-DEAD-CODE`

**选择提示**
- 先确认“夸夸其谈通用性”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-TEMPORARY-FIELD — 临时字段（Temporary Field）

**主要/辅助候选**
- `RF-EXTRACT-CLASS`
- `RF-MOVE-FUNCTION`
- `RF-INTRODUCE-SPECIAL-CASE`

**选择提示**
- 先确认“临时字段”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-MESSAGE-CHAINS — 过长的消息链（Message Chains）

**主要/辅助候选**
- `RF-HIDE-DELEGATE`
- `RF-EXTRACT-FUNCTION`
- `RF-MOVE-FUNCTION`

**选择提示**
- 先确认“过长的消息链”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-MIDDLE-MAN — 中间人（Middle Man）

**主要/辅助候选**
- `RF-REMOVE-MIDDLE-MAN`
- `RF-INLINE-FUNCTION`
- `RF-REPLACE-SUPERCLASS-WITH-DELEGATE`
- `RF-REPLACE-SUBCLASS-WITH-DELEGATE`

**选择提示**
- 先确认“中间人”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-INSIDER-TRADING — 内幕交易（Insider Trading）

**主要/辅助候选**
- `RF-MOVE-FUNCTION`
- `RF-MOVE-FIELD`
- `RF-HIDE-DELEGATE`
- `RF-REPLACE-SUBCLASS-WITH-DELEGATE`
- `RF-REPLACE-SUPERCLASS-WITH-DELEGATE`

**选择提示**
- 先确认“内幕交易”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-LARGE-CLASS — 过大的类（Large Class）

**主要/辅助候选**
- `RF-EXTRACT-CLASS`
- `RF-EXTRACT-SUPERCLASS`
- `RF-REPLACE-TYPE-CODE-WITH-SUBCLASSES`

**选择提示**
- 先确认“过大的类”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-ALTERNATIVE-CLASSES-DIFFERENT-INTERFACES — 异曲同工的类（Alternative Classes with Different Interfaces）

**主要/辅助候选**
- `RF-CHANGE-FUNCTION-DECLARATION`
- `RF-MOVE-FUNCTION`
- `RF-EXTRACT-SUPERCLASS`

**选择提示**
- 先确认“异曲同工的类”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-DATA-CLASS — 纯数据类（Data Class）

**主要/辅助候选**
- `RF-ENCAPSULATE-RECORD`
- `RF-REMOVE-SETTING-METHOD`
- `RF-MOVE-FUNCTION`
- `RF-EXTRACT-FUNCTION`
- `RF-SPLIT-PHASE`

**选择提示**
- 先确认“纯数据类”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-REFUSED-BEQUEST — 被拒绝的遗赠（Refused Bequest）

**主要/辅助候选**
- `RF-PUSH-DOWN-METHOD`
- `RF-PUSH-DOWN-FIELD`
- `RF-REPLACE-SUBCLASS-WITH-DELEGATE`
- `RF-REPLACE-SUPERCLASS-WITH-DELEGATE`

**选择提示**
- 先确认“被拒绝的遗赠”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。

## SMELL-COMMENTS — 注释（Comments）

**主要/辅助候选**
- `RF-EXTRACT-FUNCTION`
- `RF-CHANGE-FUNCTION-DECLARATION`
- `RF-INTRODUCE-ASSERTION`

**选择提示**
- 先确认“注释”的真实成因，再从符合当前数据所有权、行为契约和前置条件的手法中选择最小安全变化。
