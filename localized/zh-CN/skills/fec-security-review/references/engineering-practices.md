---
practiceCards:
  - id: "fec-security-review:input-trust"
    level: "required"
    sourceIds: ["electron-security","tauri-permissions"]
    caseIds: ["EP-IPC-01","EP-TS-01"]
    evidence: "review-only"
  - id: "fec-security-review:secret-boundary"
    level: "required"
    sourceIds: ["electron-security","google-review"]
    caseIds: ["EP-IPC-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="fec-security-review:input-trust"></a>
## UI不是特权操作授权方

级别: required

### 风险
隐藏控件或渲染端自报角色可能掩盖缺失的可信授权边界。

### 适用
API/IPC/外部数据影响特权行为时适用，按真实应用角色和平台。

### 决策
定位权威身份/权限拥有者，副作用前校验操作输入，仅暴露所需能力；UI可见性与可信执行分开。

### 例外
受限本地工具不凭空加入网络认证；Electron/Tauri具体授权机制不同，读取相应平台入口。

### 正反示意
正例：可信main/server在副作用前检查调用方及范围。反例：handler信任渲染端admin=true。

### 验证
检查允许/拒绝/畸形输入及拒绝零副作用；handler/输入样例不证明所有项目认证。

### 来源
electron-security, tauri-permissions — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-IPC-01, EP-TS-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="fec-security-review:secret-boundary"></a>
## 仅获准公开数据进入客户端

级别: required

### 风险
过宽bridge、bundle或错误可能泄露仅server/main可见的数据。

### 适用
适用于客户端/renderer配置、诊断及载荷，保留项目已有敏感数据政策。

### 决策
评审获准配置名称、构建归档和边界DTO，不打印凭据；私钥、原始环境及内部异常细节不进入公开载荷/日志。

### 例外
变量前缀或隐藏UI不形成保密边界；仅获准任务真实需要时读取敏感值，不贴入评审输出。

### 正反示意
正例：main返回受限公开结果。反例：bridge暴露process.env或完整内部堆栈。

### 验证
用合成数据检查真实获准归档/边界及脱敏路径；这是参考边界思想的项目政策，不冒称全部企业指南同一秘密规则。

### 来源
electron-security, google-review — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-IPC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
