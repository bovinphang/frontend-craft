---
practiceCards:
  - id: "fec-data-fetching:mutation-retry"
    level: "conditional"
    sourceIds: ["aws-idempotency","aws-retry"]
    caseIds: ["EP-UI-01","EP-SVC-01"]
    evidence: "review-only"
  - id: "fec-data-fetching:query-order"
    level: "required"
    sourceIds: ["react-effects","vue-watchers"]
    caseIds: ["EP-UI-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="fec-data-fetching:mutation-retry"></a>
## Mutation恢复遵循提交语义

级别: conditional

### 风险
把query默认重试套给mutation，可能重复副作用或产生无法核对的乐观状态。

### 适用
配置mutation/query重试和乐观恢复时适用，读取已安装库真实默认值。

### 决策
刻意配置读/写，安全写重放需稳定意图/键及对应服务端契约；未知结果后失效重取或核对权威状态，不虚构回滚。

### 例外
等待方取消不等于服务端回滚，避免请求/hook叠加重试及预算倍增。

### 正反示意
正例：超时mutation保持待确认直到核对。反例：所有失败mutation换新键重放。

### 验证
在负责query层控制提交后失败和重试/取消，相关样例不证明默认次数或跨系统保证。

### 来源
aws-idempotency, aws-retry — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01, EP-SVC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="fec-data-fetching:query-order"></a>
## 身份归属逻辑query及其消费者

级别: required

### 风险
不完整key可能混淆过滤条件/身份，全局取消可能中断无关订阅者。

### 适用
适用于缓存服务端状态及最新结果视图，不是普通本地表单状态。

### 决策
query身份包含逻辑输入及允许范围，不含秘密；仅向匹配活跃消费者发布，别的消费者仍拥有工作时只取消订阅。

### 例外
沿用已有缓存/query所有权，不在第二个全局store重复服务端状态，也不换成万能请求计数器。

### 正反示意
正例：过滤B当前时，A迟到不覆盖。反例：一组件卸载取消全部共享query。

### 验证
相关时检查换key乱序、错误、多订阅者及登出/范围切换；React样例只覆盖其当前视图。

### 来源
react-effects, vue-watchers — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
