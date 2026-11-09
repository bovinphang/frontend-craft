---
practiceCards:
  - id: "cc-java-runtime:executor-lifecycle"
    level: "conditional"
    sourceIds: ["java-executor","oracle-resources"]
    caseIds: ["EP-JAVA-01"]
    evidence: "review-only"
  - id: "cc-java-runtime:diagnostic-bounds"
    level: "recommended"
    sourceIds: ["google-review","java-executor"]
    caseIds: ["EP-JAVA-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-java-runtime:executor-lifecycle"></a>
## 执行器有关闭及完成责任方

级别: conditional

### 风险
停止接单不证明运行任务已释放依赖。

### 适用
项目拥有执行器线程/后台任务时适用，库不得关闭调用方借用池。

### 决策
记录创建、队列上限、关闭发起者及等待/终止政策，释放共享资源前明确中断和未完成终止状态。

### 例外
shutdownNow只是尝试中断，依赖任务配合；新JDK/虚拟线程API仅条件适用，不自动迁移。

### 正反示意
正例：应用等待所属工作者并报告超时。反例：库关闭借用全局执行器，或请求关闭后即称完成。

### 验证
在支持JDK用同步事件检查真实启动/取消/结束；本地lease例不证明执行器退出。

### 来源
java-executor, oracle-resources — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-JAVA-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-java-runtime:diagnostic-bounds"></a>
## 诊断回答有测量依据的运行时问题

级别: recommended

### 风险
无范围profiling或原始dump可能增载、暴露敏感状态，却不解释故障。

### 适用
适用于有证据的池、延迟、内存或GC问题，普通评审不必生产profiling。

### 决策
围绕假设选择有界观测，安全关联错误/操作标识，记录JDK、负载及采集范围，按合适访问权限保留原始证据。

### 例外
不因指南直接改GC标志或升级JDK，缺生产访问是限制，不能伪造采集。

### 正反示意
正例：把阻塞任务测量与所属池契约对照。反例：将完整私密heap dump贴入公开报告。

### 验证
用获准代表环境，报告采集开销/未执行条件；单元资源例不证明负载或GC特征。

### 来源
google-review, java-executor — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-JAVA-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
