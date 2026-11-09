---
practiceCards:
  - id: "cc-go-concurrency:shutdown-wait"
    level: "required"
    sourceIds: ["go-context","uber-go"]
    caseIds: ["EP-GO-01"]
    evidence: "review-only"
  - id: "cc-go-concurrency:channel-ownership"
    level: "conditional"
    sourceIds: ["uber-go","go-context"]
    caseIds: ["EP-GO-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-go-concurrency:shutdown-wait"></a>
## 关闭包含确认工作者退出

级别: required

### 风险
cancel即返回可能在goroutine仍访问时释放文件。

### 适用
适用于本组件启动的goroutine，应用角色不限；借用工作者保留原拥有方。

### 决策
保留完成计数，停接单，阻塞点传播取消，释放共享资源前等待；定义明确时限和未完成结果。

### 例外
缓冲改变容量，不改变所有权/退出；刻意脱离任务需应用级拥有者及有界错误报告。

### 正反示意
正例：本地流水线确认两个工作者退出。反例：调用cancel立即报告成功关闭。

### 验证
用启动/完成事件及饱和、消费者早退、重复关闭检查；本地watchdog只是失败上限，race另行检查。

### 来源
go-context, uber-go — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-GO-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-go-concurrency:channel-ownership"></a>
## 关闭是发送侧负责的协议

级别: conditional

### 风险
并发发送/关闭仍可能panic，即使单次访问看似受保护。

### 适用
消费者依赖channel关闭，或多个生产者共享channel时适用。

### 决策
指定一个关闭协调者，确认全部发送结束后再close，定义接收方行为；取消和完成应解除双向阻塞，不用recover伪装。

### 例外
并非所有通道都需关闭；若另有完成信号且无人range等close，保留该协议；容量不是普遍正确性规则。

### 正反示意
正例：生产协调者等待后只关闭一次。反例：每个接收者取消时关闭共享channel。

### 验证
确定性安排竞争发送/关闭及接收退出，另运行支持的race检查；流水线例不验证全部关闭拓扑。

### 来源
uber-go, go-context — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-GO-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
