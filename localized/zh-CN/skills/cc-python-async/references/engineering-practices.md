---
practiceCards:
  - id: "cc-python-async:cancellation"
    level: "conditional"
    sourceIds: ["python-asyncio","google-python"]
    caseIds: ["EP-PY-01"]
    evidence: "review-only"
  - id: "cc-python-async:blocking-io"
    level: "conditional"
    sourceIds: ["python-asyncio"]
    caseIds: ["EP-PY-01","EP-GO-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-python-async:cancellation"></a>
## 清理保留取消语义

级别: conditional

### 风险
宽泛恢复可能吞掉取消，或释放底层任务仍在使用的资源。

### 适用
适用于单元负责的事件循环任务，同步库不必改asyncio。

### 决策
明确任务拥有者及finally/异步清理，恰当清理后传播取消，等待所属任务完成；TaskGroup/timeout API匹配支持解释器。

### 例外
取消等待方不停止所有线程/I/O，底层不能安全停止时明确报告未完成。

### 正反示意
正例：停止新工作并按真实运行时政策等待清理。反例：初始化取消后返回成功兜底。

### 验证
用受控await点及真实事件循环检查；同步Python资源案例不证明async取消行为。

### 来源
python-asyncio, google-python — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-PY-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-python-async:blocking-io"></a>
## 卸载阻塞工作仍保留拥有者

级别: conditional

### 风险
执行器隐藏事件循环阻塞，却可能导致无界工作或过早还槽。

### 适用
已知/测量证实阻塞客户端处于异步路径时适用。

### 决策
复用已有异步客户端或有界执行器，限制排队及活跃数，直到底层操作真实结束才释放资源/容量所有权。

### 例外
纯非阻塞代码无需执行器；取消future不证明运行线程停止，关闭政策需纳入此事实。

### 正反示意
正例：工作者完成后释放自己的连接和槽。反例：取消的等待方立即归还仍被使用的池槽。

### 验证
以事件注入阻塞完成/取消，观察任务/容量及关闭；profiling和真实驱动行为另需证据。

### 来源
python-asyncio — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-PY-01, EP-GO-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
