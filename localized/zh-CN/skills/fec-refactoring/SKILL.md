---
name: fec-refactoring
description: 用于在不改变可观察行为的前提下重组既有前端代码，包括职责提炼、模块搬移、条件逻辑简化、API 整理和数据组织。不要用于新增功能、改变行为的缺陷修复、依赖或框架迁移，以及已经证实的死代码清理。
---

# 前端行为保持重构

执行[公共重构方法](references/common/refactoring.md)，保持 GREEN → REFACTOR → GREEN。公共方法规定行为保持、绿色基线、单步变换、立即验证、回归时只撤回当前步骤，以及差异预算。

## 前端观察边界

明确 props/emits/slots、hooks/composables、DOM、loading/error/empty、焦点和键盘、路由与 URL、状态归属和对象身份、请求、缓存、生命周期、SSR/hydration、导出及动态注册。

## 前端风险与范围

认证、权限、路由、存储、SSR/hydration、网络协议和全局状态搬移按实际影响评估。不要把重构手法名称当作 SAFE 的证明。

## 专业参考

- [领域证据和观察契约](references/principles.md)
- [前端验证阶梯](references/workflow.md)
- [何时重构](references/when-to-refactor.md)
- [与行为变更的边界](references/refactoring-vs-feature-change.md)

交付公共方法定义的 PASS、PARTIAL 或 NOT PROVEN、每步差异预算、实际校验和剩余风险。
