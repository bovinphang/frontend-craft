---
name: fec-react-project-standard
description: Use when creating, modifying, or reviewing React + TypeScript components, modules, hooks, routing, state management, API layers, error handling, styling, tests, accessibility, or performance patterns; Chinese triggers include React 项目规范, React 组件.
---

# React 项目规范

适用于 React + TypeScript 仓库中的中大型模块建设、页面重构和工程结构设计。

## Purpose

为 React + TypeScript 项目提供完整的工程规范，涵盖项目结构、组件设计、Hooks、状态管理、API 层、错误处理、测试和性能优化，确保架构清晰、代码可维护。

## When to Use

- 新建页面、功能模块或业务域
- 组件拆分与目录重构
- React + TypeScript 工程结构梳理
- 页面 / 模块 / 通用组件边界设计
- hooks、API 层、状态管理分层设计
- 为现有 React 项目补齐错误处理、测试、性能优化方案
- 组合/复合组件、Render Props、Context + Reducer、列表虚拟化、表单与动效等模式选型

## 使用说明

本 skill 提供 React 工程化任务的推荐流程、目录结构、实现模式和检查清单。

使用前提：

- 默认遵守仓库现有全局规则和 React rule
- 若仓库已有明确目录结构、样式体系、状态管理或请求封装，优先沿用仓库约定
- 本 skill 主要解决”如何设计和落地”问题，而不是重复声明基础编码底线

---

## 工作流程

处理 React 工程化任务时，建议按以下顺序执行：

1. 识别仓库已有约定
   - 目录组织方式
   - 样式体系
   - 状态管理方案
   - 请求封装方式
   - 测试框架
   - UI 组件库 / 设计系统

2. 判断目标属于哪一层
   - 路由页面
   - 页面私有组件
   - feature 业务模块
   - 全局通用组件
   - hooks / services / stores / utils

3. 设计边界后再落代码
   - 哪些逻辑属于页面编排
   - 哪些逻辑属于 feature
   - 哪些逻辑应下沉为通用能力
   - 哪些状态应本地管理，哪些应交给 store / query / URL

4. 输出时补齐关键质量项
   - loading / error / empty / data 状态
   - 错误处理与重试
   - 类型约束
   - 关键测试
   - 必要的性能优化

---

## Detailed References

Load [references/react-project-details.md](references/react-project-details.md) when the task needs concrete React project structure, component patterns, Hooks, routing, state, API layer, error handling, styling, TypeScript, testing, performance, or review checklists.

## Constraints

- 默认遵守仓库现有全局规则和 React rule
- 若仓库已有明确目录结构、样式体系、状态管理或请求封装，优先沿用仓库约定
- 组件文件规模宜约 **300 行**内；逾 **500 行**或复杂度过高须拆分子组件、Hooks、utils、类型
- 禁止新增类组件（Error Boundary 用 `react-error-boundary` 等库）
- 禁止绕过模块出口，从 feature 深层路径导入
- 不要用 `useEffect + setState` 模拟本可直接计算的派生值
- 避免 prop drilling 过深却不考虑组合或局部封装

## Expected Output

- 组件边界清晰，pages/features/components 分层明确
- Props 类型完整且明确，无 `any` 滥用
- 可复用逻辑已提取为 hooks，loading/error/empty/data 状态齐全
- API 层具备类型约束和统一错误处理，状态管理符合就近原则
- 关键行为有测试覆盖，关键模块已用 `react-error-boundary` 包裹
- 超长列表已评估虚拟化，弹窗/复合组件具备键盘与焦点支持

---

## 输出要求

在生成方案、代码或重构建议时：

- 先尊重仓库现状，再给推荐结构
- 给出必要的文件划分建议
- 必要时说明为什么这样分层
- 对新增模块，优先输出最小可落地结构，而不是一次性过度设计
- 对重构任务，优先保证可迁移性和风险可控
