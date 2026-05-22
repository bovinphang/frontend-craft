---
name: fec-tdd
description: 使用前端 TDD 工作流实现功能、修复 Bug 或重构逻辑：先写失败测试，再实现最小代码，再重构。
---

按 `fec-tdd-workflow` 执行测试驱动开发。

## 执行步骤

1. 明确要验证的前端行为。
2. 选择最近风险的测试层：单元、组件、轻量集成或 E2E。
3. 写最小失败测试并运行，确认失败原因正确。
4. 写最小实现让测试通过。
5. 保持测试通过后再重构。
6. 总结测试命令、覆盖行为和剩余风险。

## 分流

- 组件和 hook 测试：`fec-component-testing`
- 跨页浏览器流程：`fec-e2e-testing`
- 测试分层策略：`fec-testing-strategy`
