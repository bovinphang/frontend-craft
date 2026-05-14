---
name: fec-implement-from-design
description: 基于 Figma、Sketch、MasterGo、Pixso、墨刀或摹客的设计上下文实现页面或组件，强调复用、设计 Token 映射以及面向生产的前端实现方式，并将实现计划保存为 Markdown 文件。当用户提供设计稿链接、设计选区、截图或要求按设计稿实现组件/页面时自动激活。
version: 1.1.0
---

# 按设计稿实现

在以下场景使用该 Skill：

- 用户希望根据 Figma、Sketch、MasterGo、Pixso、墨刀或摹客设计实现页面、组件、弹窗、表单、表格、卡片、仪表盘、设置页或业务流程界面
- 仓库中已经存在组件库、设计 Token 或应优先复用的 UI 模式
- 任务要求在编码前通过 MCP 读取设计上下文

## 支持的设计工具


| 工具       | MCP 集成                    | 获取设计数据方式                |
| -------- | ------------------------- | ----------------------- |
| Figma    | `figma` / `figma-desktop` | API 获取设计结构、变量定义         |
| Sketch   | `sketch`                  | MCP 获取设计选区截图            |
| MasterGo | `mastergo`                | API 获取 DSL 结构数据         |
| Pixso    | `pixso`                   | 本地 MCP 获取帧数据和代码         |
| 墨刀       | `modao`                   | MCP 获取原型数据、生成设计描述       |
| 摹客       | 无 MCP                     | 通过用户提供的截图、标注或导出的 CSS 获取 |


## 目标

- 尽量高还原地实现设计稿
- 在创建新组件前优先复用现有项目组件
- 尽可能把设计变量映射到现有 Token
- 保持实现结果可维护、类型明确、可测试且具备可访问性
- 避免引入重复的基础组件或并行设计系统

## 必需工作流

1. 先识别可用的设计来源（按优先级）：
  - `figma` — Figma API 集成
  - `figma-desktop` — Figma 桌面端集成
  - `mastergo` — MasterGo DSL 数据
  - `pixso` — Pixso 本地 MCP
  - `modao` — 墨刀原型数据
  - `sketch` — Sketch 选区截图
  - 如以上 MCP 均不可用，请求用户提供设计截图或标注（适用于摹客等无 MCP 工具）
2. 先通过 MCP 或用户提供的设计数据读取设计上下文。
  - 检查布局结构
  - 检查间距、字体、颜色、变量、状态、图标和组件层级
  - 如果 MCP 提供了资源文件或 SVG / 图片源，直接使用
  - 如果 MCP 已提供真实资源，不要自行造占位资源
  - 如果用户提供截图而非 MCP 数据，从截图中推断布局、颜色、字体等视觉信息
3. 在创建新组件前先搜索代码库中的可复用组件。
  重点检查：
  - Button
  - Input / Select / Checkbox / Radio / Switch
  - Modal / Drawer / Dialog
  - Table / List / Card
  - Tabs / Breadcrumb / Pagination
  - 页面容器 / 区块容器 / 空状态 / Loading 状态
4. 在改文件前先产出一份简短实现计划。
  计划必须包含：
  - 需要改动的文件列表
  - 组件拆分方案
  - 状态 / 数据流
  - 响应式行为
  - 复用还是新建的决策
  - 设计缺口或歧义点
5. 按仓库当前使用的前端框架进行实现。
  - 严格遵循仓库现有约定
  - 优先使用明确类型的 props 和 interfaces/types
  - 保持组件小而可组合
  - 将重复逻辑提取为 hooks / composables / utilities
6. 设计 Token 规则：
  - 优先使用现有 design token、CSS 变量、主题变量或工具类
  - 除非确实没有对应 Token，否则不要硬编码颜色、圆角和间距
  - 如果设计使用了新 Token，要明确指出，不要悄悄到处硬编码
7. 可访问性规则：
  - 优先使用语义化 HTML
  - 确保交互控件具有可访问名称
  - 保留可见的焦点样式
  - 检查对话框、菜单、标签页、表单控件的键盘可操作性
8. 编码后验证：
  - 如有 lint，执行 lint
  - 如有测试，执行测试
  - 如果缺少测试，说明建议补充的最小测试范围

## 输出格式

```
# 设计实现计划

> 生成时间: YYYY-MM-DD HH:mm
> 评审工具: frontend-craft
> 设计工具: Figma / Sketch / MasterGo / Pixso / 墨刀 / 摹客

## 实现概要
- 设计稿来源: ...
- 目标页面/组件: ...

## 复用的组件
- ...

## 新建的组件
- ...

## 组件拆分方案
- ...

## 状态/数据流
- ...

## 与设计稿的偏差
- ...

## 缺失的资源 / Token / 交互细节
- ...

## 变更文件清单
- ...
```

## 报告文件输出

实现计划确定后，必须将计划内容使用 Write 工具保存为 Markdown 文件：

- 目录：项目根目录下的 `reports/`（如不存在则创建）
- 文件名：`design-plan-YYYY-MM-DD-HHmmss.md`（使用当前时间戳）
- 保存后告知用户报告文件路径

## 强约束

- 如果已有设计上下文（MCP 或截图），不要靠猜来实现 UI
- 如果项目已有 UI 体系，不要再引入一套新的 UI Kit
- 除非有合理理由，不要用硬编码替代已 Token 化的样式
- 不要忽略 hover、active、disabled、loading、empty、error 等状态
- 摹客等无 MCP 工具场景下，主动向用户索要关键截图和标注信息，不要凭空编造视觉数据
