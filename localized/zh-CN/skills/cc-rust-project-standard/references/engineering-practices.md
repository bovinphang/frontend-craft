---
practiceCards:
  - id: "cc-rust-project-standard:ownership-api"
    level: "required"
    sourceIds: ["rust-api","cpp-core"]
    caseIds: ["EP-RS-01"]
    evidence: "review-only"
  - id: "cc-rust-project-standard:result-boundaries"
    level: "required"
    sourceIds: ["rust-api"]
    caseIds: ["EP-RS-01"]
    evidence: "case"
  - id: "cc-rust-project-standard:unsafe-ffi"
    level: "conditional"
    sourceIds: ["rust-api","cert-c"]
    caseIds: ["EP-RS-01","EP-C-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-rust-project-standard:ownership-api"></a>
## 先明确借用，再考虑共享拥有

级别: required

### 风险
复制拥有关系可能掩盖资源超出调用方寿命。

### 适用
适用于crate公共API、原生库和桌面核心，无需服务分层。

### 决策
明确句柄拥有方、借用期限及转移；调用方保留所有权时使用借用，Arc必须有真实共享寿命需求。

### 例外
有意隔离时可克隆已拥有数据，这是成本/契约选择，不是全面禁克隆；保留edition/MSRV。

### 正反示意
正例：借用输入，拥有新获取lease。反例：以Arc替代关闭协调。

### 验证
评审公共签名及转移/借用示意；本地Drop测试不能证明所有别名或异步交互。

### 来源
rust-api, cpp-core — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-RS-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-rust-project-standard:result-boundaries"></a>
## Result保留原因及清理

级别: required

### 风险
抹去原因或Err时遗忘资源会隐藏操作失败。

### 适用
适用于可失败库/API；已记录不可能不变量可使用项目允许的断言。

### 决策
返回项目Result分类，保留Error::source，以RAII覆盖提前返回；错误在应用边缘转换，不在crate内部打印秘密。

### 例外
受控测试中的unwrap与不可信运行时输入有别，不必替换所有测试断言。

### 正反示意
正例：Err保留I/O原因并释放lease。反例：失败路径mem::forget或返回空成功。

### 验证
以缺陷开关1/0运行相同两个cargo测试，检查cause与Drop次数；offline/locked准备单独进行。

### 来源
rust-api — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-RS-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-rust-project-standard:unsafe-ffi"></a>
## unsafe与FFI需明确有效性契约

级别: conditional

### 风险
Rust类型不能证明外部指针长度、寿命及分配器。

### 适用
仅实际unsafe/FFI/原生边界适用，安全Rust无需新增unsafe包装。

### 决策
记录指针有效性、对齐、长度、所有权及panic政策，将unsafe缩小在已检查接口后；分配器及释放方配对。

### 例外
没有当前edition/工具链事实，不采用新unsafe属性或ABI假设；捕获边界应尊重unwind/abort政策。

### 正反示意
正例：校验外部借用缓冲区，由原拥有者释放。反例：把任意非空指针转为拥有关系。

### 验证
用实际原生工具评审安全前提及失败/销毁测试；安全Rust样例不验证unsafe健全性。

### 来源
rust-api, cert-c — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-RS-01, EP-C-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
