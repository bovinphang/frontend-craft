---
practiceCards:
  - id: "cc-go-project-standard:package-interfaces"
    level: "recommended"
    sourceIds: ["uber-go"]
    caseIds: ["EP-GO-01"]
    evidence: "review-only"
  - id: "cc-go-project-standard:error-boundaries"
    level: "required"
    sourceIds: ["uber-go","aws-idempotency"]
    caseIds: ["EP-GO-01","EP-SVC-01"]
    evidence: "review-only"
  - id: "cc-go-project-standard:context-ownership"
    level: "conditional"
    sourceIds: ["go-context","uber-go"]
    caseIds: ["EP-GO-01"]
    evidence: "case"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-go-project-standard:package-interfaces"></a>
## 在消费方定义所需依赖

级别: recommended

### 风险
庞大的提供方接口会耦合无关操作。

### 适用
包消费可替换行为时适用；小型具体内部值不必自动抽接口。

### 决策
定位最近go.mod/go.work，保持import路径，在消费处注入所需窄行为；长寿命依赖在明确组合入口创建。

### 例外
已有边界清晰接口且修改无任务收益时保留；不因指南示例引入Uber依赖或执行根go get。

### 正反示意
正例：库只接收所需reader。反例：每个类型建立镜像接口，或给桌面模块强套HTTP分层。

### 验证
编译/测试变更模块及实际消费包；导出兼容评审与工作者寿命证据分开。

### 来源
uber-go — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-GO-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-go-project-standard:error-boundaries"></a>
## 错误保留身份与操作上下文

级别: required

### 风险
只保留字符串的错误及盲目重试会掩盖部分提交。

### 适用
适用于跨包/协议错误；无需无意义地逐行包装。

### 决策
沿用错误分类，以errors.Is/As及恰当包装保留身份，在负责边界转换并脱敏诊断；区分取消与提交未知。

### 例外
错误类型不提供exactly-once；写重试需要稳定意图及服务端幂等契约，不能只看状态码。

### 正反示意
正例：调用方识别原始错误，核对未知提交。反例：记录后忽略并返回nil。

### 验证
注入失败，检查调用方原因/状态；HTTP重放另有服务案例，流水线测试不覆盖它。

### 来源
uber-go, aws-idempotency — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-GO-01, EP-SVC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-go-project-standard:context-ownership"></a>
## 传播取消并等待所属任务

级别: conditional

### 风险
阻塞发送/接收可能在cancel后存活；取消通知不是等待完成。

### 适用
适用于本单元负责的阻塞I/O或goroutine，库/CLI/桌面/服务均可使用。

### 决策
沿可取消调用传context，阻塞通道边界监听取消，保留完成/等待机制；创建方负责cancel及等待自己工作者。

### 例外
应用级任务需独立明确拥有者，不在全局保存请求context，不由任意接收者关闭channel。

### 正反示意
正例：停止接单、取消、等待两个工作者。反例：增加容量掩盖失管goroutine。

### 验证
运行本地事件驱动测试，watchdog限制未完成故障，不靠sleep推断顺序；race/全部调度覆盖另列。

### 来源
go-context, uber-go — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-GO-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
