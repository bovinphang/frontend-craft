---
name: fec-smell
description: 只诊断前端代码坏味道，基于证据给出候选重构手法，不修改业务代码。
---

本命令是 **DIAGNOSE ONLY（只诊断）**。不要修改业务代码。

1. 发现分析范围、项目/框架事实和当前 diff。
2. 收集所有权、重复、变化耦合、数据流、控制流和公共边界证据。
3. 对照 24 种坏味道并执行误判检查。
4. 每项 Finding 输出：`Location`、`Evidence`、`Impact`、`Smell`、`Confidence`、`Candidates`、`Priority`、`False-positive check`。
5. LOW 置信度只能作为开放问题，不能直接驱动自动修改。
6. 保存到 `reports/refactoring/smell-YYYY-MM-DD-HHmmss.md`。
