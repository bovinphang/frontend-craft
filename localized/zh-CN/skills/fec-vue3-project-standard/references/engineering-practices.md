---
practiceCards:
  - id: "fec-vue3-project-standard:watcher-cleanup"
    level: "conditional"
    sourceIds: ["vue-watchers"]
    caseIds: ["EP-UI-01"]
    evidence: "review-only"
  - id: "fec-vue3-project-standard:stale-results"
    level: "conditional"
    sourceIds: ["vue-watchers","react-effects"]
    caseIds: ["EP-UI-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="fec-vue3-project-standard:watcher-cleanup"></a>
## 在真实watcher拥有者下登记清理

级别: conditional

### 风险
失效watcher可能保留旧任务，异步创建的watcher也可能超出组件寿命。

### 适用
watcher启动外部工作时适用，setup同步所属watcher与外部创建者有不同寿命。

### 决策
挂起前登记取消/清理，自动组件拥有不适用时保留stop责任；onCleanup/onWatcherCleanup匹配已安装Vue。

### 例外
onWatcherCleanup要求Vue3.5+且同步登记；较旧Vue3采用支持的回调清理，不为此升级项目。

### 正反示意
正例：失效时取消本watcher请求。反例：await旧任务后才登记，或认为外部watcher全自动停止。

### 验证
在消费项目用可控完成运行真实Vue watcher/卸载测试；React例是关联证据，不证明Vue运行时。

### 来源
vue-watchers — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="fec-vue3-project-standard:stale-results"></a>
## 阻止失效watcher发布旧结果

级别: conditional

### 风险
Abort可能被忽略，旧异步回调仍可能向新状态发布。

### 适用
适用于只取最新结果的响应视图，不应无差别丢弃独立mutation结果。

### 决策
成功/错误/finally围绕拥有者身份、寿命及当前响应输入检查，依赖明确，不依赖await后才发现依赖。

### 例外
共享query任务归query层，不由单组件停止全部消费者，也不把React hook语法套给Vue。

### 正反示意
正例：失效后A迟到仍保留B。反例：认为通用取消标志能停止任何底层操作。

### 验证
用真实Vue工具控制A/B、错误及卸载；结构卡和React测试不替代Vue执行。

### 来源
vue-watchers, react-effects — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
