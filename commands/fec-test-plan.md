---
name: fec-test-plan
description: 为前端功能、PR 或里程碑制定测试分层计划，输出风险到测试层的覆盖矩阵。
---

为当前功能或变更制定前端测试策略。若需要独立规划，可委托 **`frontend-test-planner`** 子代理；若用户已经明确要求写具体测试，则直接分流到 `fec-component-testing`、`fec-e2e-testing` 或 `fec-storybook-component-doc`。

## 执行步骤

1. 确定范围：
   - 用户指定功能、PR、文件或业务流程时，以该范围为准。
   - 用户未指定时，查看最近变更并推断主要风险面。

2. 使用 `fec-testing-strategy` Skill 建立测试分层矩阵：
   - 静态检查
   - 单元测试
   - 组件测试
   - 轻量集成测试
   - E2E 测试
   - 视觉 / Storybook / interaction
   - a11y / 安全 / 性能等专项质量验证

3. 对每个风险给出建议测试层、优先级、建议命令和责任 skill。

4. 将计划保存到 `reports/test-plan-YYYY-MM-DD-HHmmss.md`：

   ```markdown
   # 前端测试计划

   > 生成时间: YYYY-MM-DD HH:mm
   > 范围: ...

   ## 风险概览

   | Risk | Impact | Suggested Layer | Priority |
   | ---- | ------ | --------------- | -------- |

   ## 覆盖矩阵

   | Layer | What to Cover | Tooling / Command | Skill |
   | ----- | ------------- | ----------------- | ----- |

   ## 执行顺序

   ## 不覆盖项与原因
   ```

5. 若用户要求继续实现测试，按矩阵分流到对应专项 skill 或 agent。
