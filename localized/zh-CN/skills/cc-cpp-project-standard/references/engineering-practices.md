---
practiceCards:
  - id: "cc-cpp-project-standard:raii-borrowing"
    level: "required"
    sourceIds: ["cpp-core"]
    caseIds: ["EP-CPP-01"]
    evidence: "case"
  - id: "cc-cpp-project-standard:exception-abi"
    level: "conditional"
    sourceIds: ["cpp-core","google-cpp","cert-c"]
    caseIds: ["EP-CPP-01","EP-C-01"]
    evidence: "review-only"
  - id: "cc-cpp-project-standard:teardown-lifetime"
    level: "conditional"
    sourceIds: ["cpp-core","cert-c"]
    caseIds: ["EP-CPP-01","EP-IPC-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-cpp-project-standard:raii-borrowing"></a>
## RAII拥有已获取资源，不接管全部指针

级别: required

### 风险
用默认拥有删除器包装借用指针，可能释放别人的对象。

### 适用
适用于C++所有权API、构造及错误路径，先区分拥有、借用及共享寿命。

### 决策
本单元取得资源用RAII，借用值保留非拥有表示；unique_ptr表达独占拥有，shared_ptr需要真实共享寿命契约。

### 例外
自定义拥有者须配对分配器/删除器；智能指针不使悬挂借用安全，也不消除外部寿命前提。

### 正反示意
正例：本地unique_ptr拥有新lease，输入仍借用。反例：把所有raw输入转为shared_ptr。

### 验证
运行借用/部分构造断言；缺陷测试使用调用方堆对象并避免第二次delete，不靠不稳定UB崩溃。

### 来源
cpp-core — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-CPP-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-cpp-project-standard:exception-abi"></a>
## 遵循所属项目异常与ABI政策

级别: conditional

### 风险
全局启用异常或跨外部ABI展开可能破坏已有有效契约。

### 适用
实际存在异常/FFI边界时适用，Google等项目有意采用不同政策。

### 决策
先读编译标志和边界契约，启异常时保证部分构造安全；禁异常时沿用显式失败路径；保持C ABI错误/输出契约。

### 例外
noexcept不会把抛异常分配转成错误码；本地启异常样例只是独立目标，不授权改变用户标志或标准。

### 正反示意
正例：保留项目错误政策及分配器清理。反例：因指南偏好而启异常或把C迁为C++。

### 验证
按实际项目政策编译，检查失败转换/清理；样例只证明自己的C++边界，未验证跨ABI展开。

### 来源
cpp-core, google-cpp, cert-c — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-CPP-01, EP-C-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-cpp-project-standard:teardown-lifetime"></a>
## 先停止使用方，再释放共享依赖

级别: conditional

### 风险
即使一个拥有者重置句柄，回调仍可能超出原生对象或插件代码寿命。

### 适用
适用于并发回调、原生插件和桌面关闭，顺序局部RAII无需引入调度器。

### 决策
先停新调用，取消/排空并确认所属任务结束，再释放缓冲、回调目标或卸载代码；明确每个join和最终释放方。

### 例外
引用计数只保护正确建模的所有权，不能防止所有悬挂别名或证明回调静止；强制关闭须明确未完成政策。

### 正反示意
正例：确认回调结束再卸载插件。反例：重置一个shared_ptr就认为所有借用指针安全失效。

### 验证
以受控销毁交错及实际原生工具检查，本地部分构造不证明race自由、GUI退出或代码卸载安全。

### 来源
cpp-core, cert-c — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-CPP-01, EP-IPC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
