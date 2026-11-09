---
practiceCards:
  - id: "fec-dependency-upgrade:compatibility"
    level: "recommended"
    sourceIds: ["google-review","typescript-publishing"]
    caseIds: ["EP-TS-01"]
    evidence: "review-only"
  - id: "fec-dependency-upgrade:artifact-consumer"
    level: "required"
    sourceIds: ["typescript-publishing","ms-playbook"]
    caseIds: ["EP-TS-01","EP-UI-01"]
    evidence: "review-only"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="fec-dependency-upgrade:compatibility"></a>
## 按有证据的兼容需求升级

级别: recommended

### 风险
孤立指南偏好版本可能把小任务扩大为破坏性工具链迁移。

### 适用
适用于有实际项目需要的依赖/框架升级及安全修复。

### 决策
读取清单/锁、peer、engine及迁移说明，选择局部兼容改动，保留回退，记录行为/类型/构建影响。

### 例外
文档显示新版本不等于授权升级；样例依赖与CLI/产品运行时隔离。

### 正反示意
正例：在独立样例锁定兼容DOM环境。反例：只为样例升级项目Node/React/构建工具。

### 验证
现有lint/类型/构建/测试配合受影响消费者及实际归档检查，不隐藏未支持环境。

### 来源
google-review, typescript-publishing — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-TS-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="fec-dependency-upgrade:artifact-consumer"></a>
## 打包依赖才是交付契约

级别: required

### 风险
workspace可用可能掩盖缺声明、样例、锁或运行时文件。

### 适用
交付包及升级改变消费面时适用。

### 决策
检查真实tarball、精确版本/完整性，离开相邻源码安装并验证支持消费者；公共内容保持唯一源并协调两产品。

### 例外
不以同版本不同字节覆盖已消费/已发布归档，不放松所有权检查强行升级；未发布候选只提供本地证据，不称公开可下载。

### 正反示意
正例：两产品消费同一不可变common归档/SRI。反例：file/link相邻路径悄悄补齐缺内容。

### 验证
运行真实打包/消费、对照源字节并在迁移中保护用户编辑；React样例通过不证明全部分发形式。

### 来源
typescript-publishing, ms-playbook — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-TS-01, EP-UI-01; review-only.  执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
