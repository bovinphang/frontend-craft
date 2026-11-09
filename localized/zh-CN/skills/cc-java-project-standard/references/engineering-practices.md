---
practiceCards:
  - id: "cc-java-project-standard:module-contract"
    level: "required"
    sourceIds: ["google-java","google-review"]
    caseIds: ["EP-JAVA-01"]
    evidence: "review-only"
  - id: "cc-java-project-standard:exception-causes"
    level: "required"
    sourceIds: ["oracle-resources"]
    caseIds: ["EP-JAVA-01"]
    evidence: "case"
  - id: "cc-java-project-standard:resource-lifecycle"
    level: "required"
    sourceIds: ["oracle-resources"]
    caseIds: ["EP-JAVA-01"]
    evidence: "case"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-java-project-standard:module-contract"></a>
## 库契约不等于Web架构

级别: required

### 风险
协议假设可能使可复用库变成不可用服务组件。

### 适用
适用于Java公共模块、CLI及Swing/JavaFX核心；仅实际存在服务应用时采用服务分层。

### 决策
读取JDK、wrapper和依赖平台，明确公开类型、空值/失败状态及模块可见性，HTTP/UI转换归适配边界。

### 例外
本地格式/目录约定优先企业空格偏好；不为指南加controller/repository或升级JDK。

### 正反示意
正例：库向桌面调用方返回有意义结果。反例：加载库即退出进程或启动服务。

### 验证
检查消费模块及已有构建/测试；资源样例不证明JPMS或GUI兼容。

### 来源
google-java, google-review — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-JAVA-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-java-project-standard:exception-causes"></a>
## 保留主要失败与清理失败

级别: required

### 风险
全捕获兜底可能丢cause，把损坏实例当可用。

### 适用
初始化/领域工作可失败时适用；预期缺失可显式返回可选值。

### 决策
沿用checked/unchecked政策，保留cause及suppressed清理异常；边界转换不能失败后称成功，实际捕获中断时尊重中断语义。

### 例外
安全公共消息可隐去内部细节，但保留诊断关联；不对无关异常盲目重设中断。

### 正反示意
正例：BoundaryFailure包装原始IOException。反例：catch Exception返回空ready对象。

### 验证
本地失败例观察真实cause；若更改suppressed关闭/中断契约，补对应实际测试。

### 来源
oracle-resources — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-JAVA-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-java-project-standard:resource-lifecycle"></a>
## 仅关闭已取得且拥有的资源

级别: required

### 风险
第二步失败可能泄漏第一个文件/客户端，或关闭借用依赖。

### 适用
适用于本单元取得的AutoCloseable资源，包括CLI/桌面启动。

### 决策
用try-with-resources或既有拥有者，定义成功转移及部分获取清理；借用资源仍由创建方关闭。

### 例外
长寿命执行器/GUI资源另有完成及线程规则；关闭句柄不证明所有后台工作停止。

### 正反示意
正例：初始化失败关闭lease一次并保留cause。反例：只在成功时关闭，或关闭调用方共享客户端。

### 验证
运行本地关闭/cause配对，实际每个获取边界补失败；原生驱动及应用关闭需独立环境证据。

### 来源
oracle-resources — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-JAVA-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
