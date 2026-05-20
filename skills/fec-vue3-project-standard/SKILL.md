---
name: fec-vue3-project-standard
description: Use when creating, modifying, or reviewing Vue 3 + TypeScript components, composables, routes, Pinia stores, API layers, error handling, directives, styling, tests, accessibility, or performance patterns; Chinese triggers include Vue 3 项目规范, Vue 组件.
---

# Vue 3 项目规范

适用于使用 Vue 3 + TypeScript 的仓库。

## Purpose

为 Vue 3 + TypeScript 项目提供完整的工程规范，涵盖项目结构、组件设计、Composables、路由、Pinia 状态管理、API 层、错误处理、测试和性能优化，确保约定式开发和类型安全。

## When to Use

- 新建或修改 Vue 3 页面、功能模块或组件
- 设计 Composables、Pinia Store 或 API 层
- 配置路由、状态管理、错误处理
- 为现有 Vue 3 项目补齐测试、性能优化方案

## Detailed References

Load [references/vue3-project-details.md](references/vue3-project-details.md) when the task needs concrete Vue 3 project structure, component patterns, Composables, slots, Provide/Inject, routing, Pinia, API layer, error handling, directives, styling, TypeScript, testing, performance, or review checklists.

## Constraints

- 使用 `<script setup lang="ts">`，禁止使用 Options API 新增组件
- 组件文件规模宜约 **300 行**内；逾 **500 行**或复杂度过高须拆子组件与 Composables
- Props / Emits 必须使用 TypeScript interface 定义，禁止使用 `any`
- Composable 返回 `readonly` 引用，防止外部意外修改
- 不要在 store 中存放 UI 临时状态（modal 开关、表单输入等）
- 服务端数据优先用请求库管理，而非手动存入 Pinia
- 避免在 `v-for` 中使用 `v-if`（提取为 computed 过滤）
- 禁止直接从 feature 内部深层路径导入，绕过 `index.ts`

## Expected Output

- 组件使用 `<script setup lang="ts">`，Props / Emits 类型完整
- 可复用逻辑已提取到 composable，返回 `readonly` 引用
- Loading / Error / Empty / Data 状态均已处理
- 路由组件使用动态 import 加载，状态管理符合就近原则
- API 调用有类型约束和统一错误处理
- 样式使用 scoped 隔离，关键行为有测试覆盖
- 文件结构与项目约定一致（pages / features / components 分离）
