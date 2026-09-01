# frontend-craft 重构子系统

本目录是重构子系统的人类导航入口。详细可执行知识位于 `skills/` 与 `localized/zh-CN/skills/`，这里不重复完整操作步骤。

## 能力入口

| 入口 | 模式 | 用途 |
| --- | --- | --- |
| `/fec-smell` | 只读诊断 | 基于证据识别代码坏味道，检查误判并给出候选重构手法 |
| `/fec-refactor-plan` | 只读规划 | 把诊断结果组织为有依赖顺序、可验证、可回滚的小步重构计划 |
| `/fec-refactor` | 受控执行 | 在保持既有可观察行为的前提下，一次执行一个主要重构并逐步验证 |

## 核心安全模型

纯重构遵循 `GREEN → REFACTOR → GREEN`：先记录可用的绿色基线，再做结构变化，再回到同一行为基线。新增行为或行为变化型缺陷修复仍属于 TDD 的 `RED → GREEN → REFACTOR`。

风险统一分为：

- `SAFE`：局部、私有、易回滚且验证充分；
- `CAUTION`：跨模块、状态归属、组件边界或动态引用等需要额外证据；
- `DANGER`：公开 API、路由、持久化、网络协议、权限、SSR/hydration、关键业务计算等高风险边界，默认先规划并明确确认。

每个执行步骤还要记录**差异预算（Diff Budget）**：预期文件数、函数/组件数、公开 API 变化数和行为变化数。实际范围明显超出预算时停止并重新评估。

## 与相邻工作流的边界

- 已证明未使用的代码、导出、样式、路由或依赖：使用 `fec-refactor-clean`；
- 新增行为或行为变化型 bug 修复：使用 `fec-tdd-workflow`；
- 原因未知的构建、运行时、UI 或 API 故障：使用 `fec-debug-framework`；
- 已知的 lint/typecheck/test/build 失败修复：使用 `fec-validation-fix`；
- PR 合并就绪性评审：使用 `fec-code-review`；
- 框架、依赖、状态库迁移或大范围架构替换：进入对应 migration/architecture 工作流，而不是当作普通重构。

## 知识范围

本子系统覆盖：

- 第 3 章的 24 种代码坏味道；
- 第 6～12 章的 61 个标准重构手法；
- 坏味道到候选手法的多对多关系；
- 手法的前置条件、组合关系、风险和行为保持检查；
- TypeScript、React、Vue、现代函数式/组合式前端的项目原生适配。

查看 [61 项重构目录](catalog.md) 与 [坏味道—重构矩阵](smell-refactoring-matrix.md)。

## 来源与内容转换原则

知识基线来自用户提供的《重构：改善既有代码的设计（第 2 版）》JavaScript 版 Markdown/PDF，尤其是第 2～12 章、重构列表以及坏味道与重构手法速查材料。frontend-craft 保留标准术语、目录完整性和来源支持的关系，但不会复制长段正文或完整案例。

`Frontend-Craft 前端适配`、AI Agent 风险门禁、差异预算、报告格式、React/Vue/TypeScript 示例等属于本项目重新编写的工程增强，用于把经典重构思想转换为可执行的前端智能体工作流。
