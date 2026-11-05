---
name: fec-tdd-workflow
description: 用于实现新前端行为、修复 bug 或重构可先由测试描述预期行为的逻辑。适用于组件、hooks/composables、工具函数、API clients、路由守卫或用户工作流；中文触发词包括 TDD、测试驱动、先写测试、红绿重构、回归测试。
---

# 前端测试驱动开发

遵循[公共 TDD 方法](references/common/tdd.md)。新增行为使用 RED → GREEN → REFACTOR；纯重构使用 GREEN → REFACTOR → GREEN。

## 前端可观察契约

用户看到的 UI、组件 props/emits、hook/composable 返回值、路由守卫结果、API client 输出与错误状态，以及事件、副作用和异步状态。

## 前端测试选型

| 风险 | 优先验证 |
| --- | --- |
| utils、schema、状态计算 | 单元测试 |
| hooks/composables | 单元或轻量集成 |
| 组件 props、emits、交互及状态 | Testing Library / Vue Test Utils 组件测试 |
| Router、Provider、Store 协同 | 轻量集成 |
| 跨页面登录、支付、权限与 CRUD 旅程 | 已有 Playwright/Cypress E2E |

选择贴近实际风险的最小有效层，权限纯逻辑不因为名称而强制 E2E；不引入项目未采用的测试框架。报告按公共方法记录实际红绿证据和覆盖边界。
