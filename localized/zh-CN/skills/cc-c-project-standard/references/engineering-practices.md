---
practiceCards:
  - id: "cc-c-project-standard:allocation-size"
    level: "required"
    sourceIds: ["cert-c","ms-sal"]
    caseIds: ["EP-C-01"]
    evidence: "case"
  - id: "cc-c-project-standard:partial-cleanup"
    level: "required"
    sourceIds: ["cert-c"]
    caseIds: ["EP-C-01"]
    evidence: "case"
  - id: "cc-c-project-standard:c-abi"
    level: "required"
    sourceIds: ["cert-c","ms-sal"]
    caseIds: ["EP-C-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-c-project-standard:allocation-size"></a>
## 转换及分配前检查大小

级别: required

### 风险
无符号回绕即使有定义，仍可能分配比承诺载荷更小的缓冲区。

### 适用
适用于C分配及外部输入的数量/大小运算；有效指针可访问范围仍是调用/API前提。

### 决策
明确字节/元素单位及零值行为，先拒绝非法有符号值再转换，分配前检查乘加，失败初始化有效输出槽。

### 例外
SAL可表达支持的MSVC契约，但不是可移植强制项；纯C保持纯C，不为大小检查引入C++机制。

### 正反示意
正例：count > SIZE_MAX / width时在分配前拒绝。反例：先乘法再信任回绕值/类型转换。

### 验证
本地观察溢出零分配、非法输出及成功载荷；ABI需要时补目标位宽和对齐检查。

### 来源
cert-c, ms-sal — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-C-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-c-project-standard:partial-cleanup"></a>
## 按获取顺序明确清理责任

级别: required

### 风险
第二次分配失败可能泄漏第一次，共用清理还可能释放借用输入。

### 适用
适用于获取多资源或转移输出的函数，纯标量函数无需自定义资源框架。

### 决策
初始化本地拥有状态，用可审计的一致清理方式，只以匹配分配器释放已取得资源；完整成功后才转移输出。

### 例外
外部刻意保留资源需明确拥有方/寿命，返回错误本身不会清理先前获取。

### 正反示意
正例：第二次分配失败释放第一个header。反例：只有成功路径free，或把调用方缓冲加入清理表。

### 验证
逐个获取点失败注入，检查存活分配及输出；断言不因NDEBUG失效，稳定计数可补充后续sanitizer。

### 来源
cert-c — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-C-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-c-project-standard:c-abi"></a>
## 记录调用有效性与分配器配对

级别: required

### 风险
外部指针非空不证明长度和所有权，跨模块释放可能使用不同分配器。

### 适用
适用于C头文件、插件及原生API，不隐含迁为C++。

### 决策
保持ABI位宽/布局/调用约定兼容，记录借用期限；拥有输出暴露匹配释放函数/上下文，错误及输出状态保持稳定。

### 例外
注解或判空无法证明任意内存有效；SAL限支持分析环境，其他环境用可移植文档/检查。

### 正反示意
正例：调用方保留借用存储，插件经导出配对函数释放自身分配。反例：对所有非空返回指针使用宿主free。

### 验证
适当使用真实C消费者、平台/布局检查和失败注入；本地分配样例不证明跨DLL ABI。

### 来源
cert-c, ms-sal — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-C-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
