---
practiceCards:
  - id: "cc-native-memory-safety:allocator-pairs"
    level: "required"
    sourceIds: ["cert-c","cpp-core"]
    caseIds: ["EP-C-01","EP-CPP-01"]
    evidence: "review-only"
  - id: "cc-native-memory-safety:teardown-races"
    level: "conditional"
    sourceIds: ["cpp-core","cert-c"]
    caseIds: ["EP-CPP-01","EP-IPC-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-native-memory-safety:allocator-pairs"></a>
## 分配与释放构成明确配对契约

级别: required

### 风险
外部所有权和分配器错配可能在指针非空时仍破坏内存。

### 适用
实际C/C++/Rust/原生或插件所有权转移适用，并非每个应用变量。

### 决策
记录有效性、借用期限、转移点及匹配分配器/释放上下文；提前失败只释放本操作真实取得部分。

### 例外
托管包装/智能指针需保留原生释放契约，不从空值性推断拥有，不销毁调用方借用内存。

### 正反示意
正例：插件为拥有输出导出释放配对。反例：全部外部缓冲都用宿主delete。

### 验证
使用分配/失败计数及真实原生消费者；C/C++例有界，unsafe Rust/FFI、架构和sanitizer检查另列。

### 来源
cert-c, cpp-core — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-C-01, EP-CPP-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-native-memory-safety:teardown-races"></a>
## 确认静止后再释放

级别: conditional

### 风险
重置一个句柄并不终止其他别名/回调并发访问。

### 适用
回调、线程、设备缓冲可能超出原生拥有者寿命时适用。

### 决策
停止新访问，协调取消/排空，等待真实使用方，再按依赖顺序释放/卸载；定义重复关闭及关闭失败行为。

### 例外
引用计数不是全部别名/寿命证明；强制退出可能遗弃工作，应暴露状态而非标优雅完成。

### 正反示意
正例：确认回调完成后卸载代码。反例：协程等待超时，原生仍运行却释放缓冲。

### 验证
用事件及原生工具安排销毁交错/失败，handler/部分构造例不证明全部并发调度。

### 来源
cpp-core, cert-c — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-CPP-01, EP-IPC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
