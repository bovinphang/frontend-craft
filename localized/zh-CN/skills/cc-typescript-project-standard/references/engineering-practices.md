---
practiceCards:
  - id: "cc-typescript-project-standard:input-validation"
    level: "required"
    sourceIds: ["google-ts"]
    caseIds: ["EP-TS-01"]
    evidence: "case"
  - id: "cc-typescript-project-standard:async-errors"
    level: "required"
    sourceIds: ["google-ts","aws-idempotency"]
    caseIds: ["EP-TS-01","EP-UI-01"]
    evidence: "review-only"
  - id: "cc-typescript-project-standard:package-contract"
    level: "required"
    sourceIds: ["typescript-publishing","google-ts"]
    caseIds: ["EP-TS-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-typescript-project-standard:input-validation"></a>
## 副作用前校验外部数据

级别: required

### 风险
类型断言可能把非法JSON伪装为可信领域值。

### 适用
适用于网络、IPC、文件和插件输入；已有不变量的内部值不必重复建立schema。

### 决策
接收unknown，用已有schema/类型守卫收窄，协议值转换为领域类型后才产生副作用；明确金额单位、枚举和失败输出。

### 例外
生成客户端有用，但不能校验远端实际响应；刻意信任的边界须记录可信来源。

### 正反示意
正例：字符串金额被拒绝，零副作用。反例：as Payment使扣款回调接收坏输入。

### 验证
运行本地非法/成功配对；消费项目再补空响应、非法枚举等协议场景。

### 来源
google-ts — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-TS-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-typescript-project-standard:async-errors"></a>
## 经已负责的异步链传播失败

级别: required

### 风险
漂浮异步任务和吞拒绝可能过早发布成功。

### 适用
适用于本单元创建的Promise/回调，不向通用库强加UI hook。

### 决策
返回/await所属Promise，安全保留unknown错误上下文，显式表达待处理/失败/成功；脱离任务必须有刻意指定的生命周期拥有者。

### 例外
Abort仅说明调用方结束等待，不代表远端写回滚；不确定写先核对再重试，并沿用已有错误类型。

### 正反示意
正例：已提交写超时后进入待确认。反例：catch返回空成功值或悄悄重试扣款。

### 验证
在负责单元注入拒绝和迟到完成；本地TS例只覆盖校验，UI/服务ID指向独立证据。

### 来源
google-ts, aws-idempotency — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-TS-01, EP-UI-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-typescript-project-standard:package-contract"></a>
## 在真实消费者验证声明

级别: required

### 风险
工作区别名和未声明类型依赖可能在打包后消失。

### 适用
适用于库/SDK/CLI导出；仅应用内部模块不必变成发布包。

### 决策
exports、types、files、模块解析匹配已声明消费者，离开workspace验证tarball；沿用已有严格配置，改变时记录局部迁移。

### 例外
Google内部namespace/enum/断言风格有条件适用；skipLibCheck可作为依赖政策，但不能证明自身公共边界正确；exactOptionalPropertyTypes并非strict所包含。

### 正反示意
正例：归档消费者解析已声明类型依赖。反例：为了模仿指南更改所有包的模块模式。

### 验证
执行已有类型/构建及归档消费者检查；输入校验样例本身不证明声明兼容。

### 来源
typescript-publishing, google-ts — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-TS-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
