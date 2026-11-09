---
practiceCards:
  - id: "cc-electron-project-standard:ipc-trust"
    level: "required"
    sourceIds: ["electron-security"]
    caseIds: ["EP-IPC-01"]
    evidence: "case"
  - id: "cc-electron-project-standard:cancellation-cleanup"
    level: "conditional"
    sourceIds: ["electron-security","aws-idempotency"]
    caseIds: ["EP-IPC-01"]
    evidence: "case"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-electron-project-standard:ipc-trust"></a>
## 信任由main拥有的操作边界

级别: required

### 风险
渲染端自报角色/通道，或只查origin，可能暴露特权工作。

### 适用
适用于实际main/preload/renderer权限，遵循已安装Electron版本。

### 决策
窄bridge暴露单项操作，核验WebContents、主frame及精确可信文档，再在副作用前校验有界输入。

### 例外
file URL不能只查泛origin；可信发送者仍需操作授权，合成角色头不是身份。

### 正反示意
正例：main校验单项set-title。反例：preload暴露ipcRenderer或任意文件调用。

### 验证
运行handler允许/拒绝输入及已有接线检查；这些不激活sandbox/isolation，也不运行Electron GUI。

### 来源
electron-security — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-IPC-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-electron-project-standard:cancellation-cleanup"></a>
## 异步准备后复核拥有状态

级别: conditional

### 风险
曾可信的发送者可能在延迟提交前关闭或失去信任。

### 适用
IPC handler等待无特权准备、随后执行同步特权副作用时适用。

### 决策
负责abort及监听清理，await后重查寿命、取消和发送者信任，之后才commit；handler移除/close连接真实窗口生命周期。

### 例外
Abort不能撤销已提交外部写，异步commit、原生工作者及并发顺序需另建契约，样例不声称覆盖。

### 正反示意
正例：关闭/取消后迟到准备不产生commit。反例：只在入口校验，窗口关闭仍改变特权状态。

### 验证
运行可控Promise关闭/取消/允许/拒绝案例；真实进程/GUI/签名包另测，不能以Node handler测试冒称。

### 来源
electron-security, aws-idempotency — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-IPC-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
