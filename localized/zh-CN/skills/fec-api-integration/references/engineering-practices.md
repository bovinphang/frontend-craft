---
practiceCards:
  - id: "fec-api-integration:retry-safety"
    level: "conditional"
    sourceIds: ["aws-retry","aws-idempotency"]
    caseIds: ["EP-UI-01","EP-SVC-01"]
    evidence: "review-only"
  - id: "fec-api-integration:consumer-contract"
    level: "required"
    sourceIds: ["typescript-publishing","google-review"]
    caseIds: ["EP-TS-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="fec-api-integration:retry-safety"></a>
## 可恢复错误不等于可重复写

级别: conditional

### 风险
超时、断网或5xx可能发生在写已提交之后。

### 适用
客户端负责重试/恢复时适用，先检查真实操作语义及库配置。

### 决策
区分读与副作用，允许的重试保留同一意图/键，要求服务端幂等或核对契约；在一层限制次数、总时限及取消，安全可重放前提内才遵守Retry-After。

### 例外
无契约时保持待确认，提供状态/核对或支持路径；禁按钮、换新键、Abort都不是服务端保证。

### 正反示意
正例：同键同意图复用已提交结果。反例：任何429/5xx/断网自动重试付款三次。

### 验证
注入提交后响应失败、意图冲突及有界恢复；服务案例仅证明本地HTTP契约，不是分布式付款保证。

### 来源
aws-retry, aws-idempotency — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01, EP-SVC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="fec-api-integration:consumer-contract"></a>
## 在真实API边界校验及转换

级别: required

### 风险
生成类型或响应断言可能掩盖坏载荷及含混空值/错误状态。

### 适用
适用于前端API客户端和领域适配，不授权重设计后端端点。

### 决策
依据真实契约明确请求/响应、状态、空体、单位及兼容行为，用既有工具校验unknown后转换为领域/UI状态。

### 例外
不强制新生成器或校验包；缺少行为/权限时先沟通需求，不假定服务端实现/字段名。

### 正反示意
正例：坏数据在领域副作用前失败，UI可恢复。反例：把requestJson<T>当运行时校验。

### 验证
用现有客户端/消费者检查畸形、空值、有效和失败结果，通用TS输入证据不覆盖所有HTTP协议。

### 来源
typescript-publishing, google-review — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-TS-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
