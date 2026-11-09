---
practiceCards:
  - id: "fec-code-review:evidence-severity"
    level: "required"
    sourceIds: ["google-review"]
    caseIds: ["EP-UI-01","EP-TS-01"]
    evidence: "review-only"
  - id: "fec-code-review:review-scope"
    level: "recommended"
    sourceIds: ["google-review","ms-playbook"]
    caseIds: ["EP-TS-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="fec-code-review:evidence-severity"></a>
## 严重度依据已证实的用户影响

级别: required

### 风险
个人偏好可能变成误阻断，未测运行时风险反而被忽略。

### 适用
适用于真实代码/内容评审，纯评审不隐含修改业务代码授权。

### 决策
指出具体触发、位置、已观察/可信影响及最小有效修复，按项目契约评估影响/可能性，区分事实与假设。

### 例外
有依据的项目约定可优先于企业风格；无证据应标不确定，不能虚构复现或测试通过。

### 正反示意
正例：说明A迟到覆盖B的路径及缺失guard。反例：仅因别家公司格式不同阻断。

### 验证
运行可用定向检查或明确未执行，相关案例仅示范证据质量，不构成任意代码评审。

### 来源
google-review — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01, EP-TS-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="fec-code-review:review-scope"></a>
## 评审真实任务基线及消费者

级别: recommended

### 风险
只看HEAD可能漏掉原有未提交改动、新文件和生成分发。

### 适用
适用于有明确任务边界的多仓/部分提交工作。

### 决策
冻结真实起点，识别本任务改动和相关消费者，再看源、生成声明及真实归档；保留无关编辑并记录覆盖空白。

### 例外
遵循已选评审流程，共享语言规则不要求每个入口再派评审；跳过平台路径不标已验证。

### 正反示意
正例：对照已记录任务基线，包含新文件。反例：认定HEAD~1就是全部改动。

### 验证
核对基线/diff完整并按风险验证，独立最终评审与作者自审分开。

### 来源
google-review, ms-playbook — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-TS-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
