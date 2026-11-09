---
practiceCards:
  - id: "fec-testing-strategy:risk-layer"
    level: "recommended"
    sourceIds: ["ms-playbook","ms-faults"]
    caseIds: ["EP-UI-01"]
    evidence: "review-only"
  - id: "fec-testing-strategy:real-boundary"
    level: "required"
    sourceIds: ["ms-faults","react-act"]
    caseIds: ["EP-UI-01","EP-IPC-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="fec-testing-strategy:risk-layer"></a>
## 选择能观察风险的最小层

级别: recommended

### 风险
宽泛昂贵套件可能漏掉实际故障，微小文本变化检测又制造噪音。

### 适用
适用于新增行为、有意义回归和发布风险；可逆文案/间距不自动需要新测试。

### 决策
用已有工具把风险对应静态、单元、组件、集成或E2E，断言用户状态/真实边界效果，不断言辅助实现或mock存在。

### 例外
控制器单测有用但不是React渲染测试，不因playbook更换仓库测试框架。

### 正反示意
正例：控制A/B Promise并检查真实DOM。反例：断言源码有guard，或只数mock调用而无边界效果。

### 验证
证明测试能因目标bug失败、修复后通过；仅有新风险、失败或未解关注才扩大。

### 来源
ms-playbook, ms-faults — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="fec-testing-strategy:real-boundary"></a>
## 准确报告实际执行边界

级别: required

### 风险
缺工具、零用例或静态manifest可能被误报运行时成功。

### 适用
适用于组件、原生桌面和服务边界的验证/交付结论。

### 决策
准备与行为分开，缺陷/受保护使用固定断言，记录名称、数量、命令及MISSING/NOT RUN；声称React行为时实际act/DOM更新。

### 例外
JSDOM不是浏览器E2E，Node handler不是Electron GUI，真实HTTP进程不是活DB/分布式保证。

### 正反示意
正例：命名行为断言失败，同组修复后通过。反例：加载失败或全跳过后搜索PASS。

### 验证
检查原始日志和归档/输入hash，确认非零真实测试，分平台记录；不能为宣称提升制造旧模型失败。

### 来源
ms-faults, react-act — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01, EP-IPC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
