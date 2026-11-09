---
practiceCards:
  - id: "cc-rust-async:cancellation"
    level: "conditional"
    sourceIds: ["tokio-join","rust-api"]
    caseIds: ["EP-RS-01","EP-GO-01"]
    evidence: "review-only"
  - id: "cc-rust-async:guard-lifetime"
    level: "recommended"
    sourceIds: ["tokio-join","rust-api"]
    caseIds: ["EP-RS-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-rust-async:cancellation"></a>
## 丢弃等待方不等于停止操作

级别: conditional

### 风险
超时可能丢弃所属任务的管理，或留下部分写流。

### 适用
适用于实际async工作及项目已安装运行时；安全同步代码无需Tokio。

### 决策
明确spawn/cancel/join方，保留句柄、限制接单，并读取操作取消安全契约；先停接单再排空/取消，依赖释放前确认完成。

### 例外
Tokio句柄drop会脱离管理；abort是请求，已运行阻塞工作可能不可停止；保留部分进度，报告未完成而非假装回滚。

### 正反示意
正例：等待所属任务退出，暴露部分写状态。反例：认为Arc加超时自动使脱离任务安全。

### 验证
在实际运行时用可控future/事件及短写注入；安全Result和Go例是关联证据，不是Rust-async执行结论。

### 来源
tokio-join, rust-api — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-RS-01, EP-GO-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-rust-async:guard-lifetime"></a>
## 限制临界区及阻塞工作

级别: recommended

### 风险
阻塞guard跨挂起可能阻碍进展，掩盖锁顺序死锁。

### 适用
future拥有锁、阻塞客户端或队列槽时适用，先查具体guard/操作类型。

### 决策
缩短持锁范围，复制必要已拥有状态，契约允许时在锁外await；不可避免阻塞放在既有有界运行时边界。

### 例外
不盲目把全部mutex换成async mutex；有意跨await保留guard时，证明调度/依赖假设并测试争用。

### 正反示意
正例：短元数据锁释放后等待I/O。反例：持锁await一个也需要此锁的任务。

### 验证
用确定性争用/关闭测试及调度测量；该建议不授权新运行时、edition或MSRV。

### 来源
tokio-join, rust-api — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-RS-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
