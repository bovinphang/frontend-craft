---
practiceCards:
  - id: "fec-react-project-standard:effect-cleanup"
    level: "required"
    sourceIds: ["react-effects","react-act"]
    caseIds: ["EP-UI-01"]
    evidence: "case"
  - id: "fec-react-project-standard:stale-results"
    level: "conditional"
    sourceIds: ["react-effects","react-act"]
    caseIds: ["EP-UI-01"]
    evidence: "case"
---

# 本入口工程决策

先定位项目角色、工具链及已有约定，再按需读取[公共原则](common/engineering-practices.md)。下列条件仅约束当前语言/场景；结构检查不证明全部语义或实际运行。

<a id="fec-react-project-standard:effect-cleanup"></a>
## Effect清理自己真实拥有的资源

级别: required

### 风险
组件移除后，请求、监听或定时器可能继续活动。

### 适用
组件自己启动effect时适用；共享缓存/客户端任务保留原拥有者，取消订阅不授权取消全部消费者。

### 决策
setup与cleanup配对，向所属任务传播取消，清理可重复；使用已安装React API及已有组件/query边界。

### 例外
开发环境setup/cleanup循环不自动等于生产缺陷；Abort表示结束关注，不能撤销已提交服务端写。

### 正反示意
正例：清理取消本组件load并移除监听。反例：卸载时清空其他组件仍使用的全局客户端。

### 验证
运行本地真实React/DOM卸载测试；变更组件实际拥有订阅/定时器或Strict Mode行为时补对应检查。

### 来源
react-effects, react-act — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。

<a id="fec-react-project-standard:stale-results"></a>
## 仅当前视图请求可发布结果

级别: conditional

### 风险
迟到的A成功、错误或finally可能覆盖B当前状态。

### 适用
适用于只展示最新结果的视图；各有独立结果的排队命令需自己的意图契约。

### 决策
按所属视图/query key限定请求身份及寿命，成功、错误和loading等所有状态发布都检查；取消与身份校验互补。

### 例外
不使用使无关组件失效的全局计数；取消已提交mutation不证明回滚，也不授权重放。

### 正反示意
正例：A迟到仍展示B。反例：只保护成功回调，旧finally却清掉B的loading。

### 验证
本地可控A/B Promise测试实际渲染React；实际拥有者再补迟到错误/loading及共享缓存，不把DOM模拟称浏览器E2E。

### 来源
react-effects, react-act — [来源与适用限制](common/engineering-practices.sources.json).

证据标识: EP-UI-01; case. [本入口可运行案例](../examples/engineering/README.md)。 执行状态及覆盖范围见实际记录；关联ID不证明该卡全部语义。
