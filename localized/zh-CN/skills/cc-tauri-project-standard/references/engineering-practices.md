---
practiceCards:
  - id: "cc-tauri-project-standard:ipc-validation"
    level: "required"
    sourceIds: ["tauri-permissions"]
    caseIds: ["EP-TS-01","EP-IPC-01"]
    evidence: "review-only"
  - id: "cc-tauri-project-standard:cancellation-cleanup"
    level: "conditional"
    sourceIds: ["tokio-join","tauri-permissions"]
    caseIds: ["EP-RS-01","EP-IPC-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="cc-tauri-project-standard:ipc-validation"></a>
## 注册命令不等于安全授权

级别: required

### 风险
存在capability文件时，实际选中的命令/窗口授权仍可能错误。

### 适用
适用于真实Tauri2命令/插件，检查已安装minor及选中应用配置。

### 决策
核对invoke注册、生成的应用命令权限、已选/重叠capability、窗口标签及远端来源；Rust副作用前校验有界类型输入和业务权限。

### 例外
可信根路径由应用拥有，不由渲染端提供；仅canonicalize后open不能防对手替换祖先；不套Electron API。

### 正反示意
正例：受限命令校验应用拥有根下路径。反例：渲染端提供任意根，把注册当授权。

### 验证
运行已有Rust core测试并检查真实生成/选中授权；运行时权限激活和GUI需独立NOT RUN记录。

### 来源
tauri-permissions — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-TS-01, EP-IPC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="cc-tauri-project-standard:cancellation-cleanup"></a>
## 窗口关闭协调核心任务及资源

级别: conditional

### 风险
窗口关闭后Rust任务或sidecar资源可能继续活动。

### 适用
命令启动工作，或调用外仍持有文件/池/sidecar时适用。

### 决策
明确应用/核心任务拥有者，停接单、取消/排空并等待完成，再释放依赖；尽量把阻塞及guard移出UI关键挂起区。

### 例外
调用方取消可能不停止原生写，应显式表示未完成/部分提交，不强制升级运行时或依赖。

### 正反示意
正例：核心向应用报告完成/未完成关闭。反例：丢弃UI等待方就认为原生工作全停。

### 验证
用实际核心/运行时事件及目标进程检查；已有路径测试和Node IPC证据不证明Tauri关闭或签名包。

### 来源
tokio-join, tauri-permissions — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-RS-01, EP-IPC-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
