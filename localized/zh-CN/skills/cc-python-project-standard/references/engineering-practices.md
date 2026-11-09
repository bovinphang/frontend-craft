---
practiceCards:
  - id: "cc-python-project-standard:import-safety"
    level: "required"
    sourceIds: ["google-python"]
    caseIds: ["EP-PY-01"]
    evidence: "case"
  - id: "cc-python-project-standard:external-data"
    level: "required"
    sourceIds: ["google-python"]
    caseIds: ["EP-PY-01"]
    evidence: "review-only"
  - id: "cc-python-project-standard:context-cleanup"
    level: "required"
    sourceIds: ["google-python","oracle-resources"]
    caseIds: ["EP-PY-01"]
    evidence: "case"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-python-project-standard:import-safety"></a>
## 导入描述库，启动获取资源

级别: required

### 风险
导入即连接会让元数据、测试及CLI帮助依赖外部系统。

### 适用
适用于复用包及其CLI/桌面调用方，不禁止模块常量/定义。

### 决策
外部资源转移到调用方拥有的显式工厂/生命周期，纯计算注入协作者；导入及读取版本应可离线。

### 例外
已记录的可执行入口可在参数/权限检查后初始化应用状态；不向库强套controller/service/repository。

### 正反示意
正例：显式启动阶段连接。反例：导入包时打开远端客户端。

### 验证
本地测试以新解释器观察临时外部标记，真实服务连通性明确未测。

### 来源
google-python — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-PY-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-python-project-standard:external-data"></a>
## 注解不校验外部实际值

级别: required

### 风险
类型提示可能掩盖运行时外部形状及单位错误。

### 适用
适用于文件、反序列化、IPC和插件输入，可信内部值无需第二个校验库。

### 决策
用当前解析/校验工具在领域副作用前建立形状、范围、单位和失败行为，协议值与领域计算分离。

### 例外
不因指南替换Ruff/mypy/pytest或添加Web schema包，采用当前支持Python语法。

### 正反示意
正例：状态变化前明确拒绝非法金额。反例：认为dict注解使不可信JSON自动安全。

### 验证
在实际外部数据消费处补非法/边界/成功测试；本地导入/资源例不证明全部校验规则。

### 来源
google-python — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-PY-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-python-project-standard:context-cleanup"></a>
## 上下文管理器覆盖部分获取

级别: required

### 风险
后续失败可能跳过先前关闭，或覆盖原始原因。

### 适用
本单元获取文件/客户端/上下文时适用，借用协作者保留原生命周期方。

### 决策
复用上下文管理模式，变长获取序列用ExitStack；保留异常链，仅关闭本操作成功取得的资源。

### 例外
异步取消需专门清理/传播，不在宽泛兜底中吞掉，也不引入项目版本不支持的新特性。

### 正反示意
正例：第二阶段失败回收先前lease。反例：仅在两次获取均成功后关闭。

### 验证
运行部分失败、导入及逆序关闭成功测试；相关时补实际关闭失败/驱动测试。

### 来源
google-python, oracle-resources — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-PY-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
