---
name: fec-accessibility-check
description: Use when reviewing or improving frontend accessibility, semantic structure, keyboard support, focus management, ARIA labels, or WCAG-related UI issues; Chinese triggers include 无障碍, accessibility, a11y, WCAG.
---

# 无障碍实现规范（WCAG 2.1 AA）

## Purpose

确保前端 UI 对残障用户可访问，满足 WCAG 2.1 AA 标准，涵盖语义结构、键盘支持、焦点管理和 ARIA 规范。

## When to Use

- 实现或评审表单、对话框、菜单、表格、标签页、树、抽屉和自定义组件
- 将设计稿转换为代码
- 页面上线前做 QA 或发布前检查

## 必须项

- 所有图片必须有有意义的 `alt` 文字
- 交互元素必须可键盘访问（Tab、Enter、Space、Escape）
- 表单元素必须有关联 `<label>`
- 模态框必须捕获焦点并支持 Esc 关闭

## ARIA 使用原则

- 优先使用语义化 HTML，而非 ARIA
- `role` 属性不覆盖原生语义
- 动态内容更新使用 `aria-live`

# 可访问性检查

在以下场景使用该 Skill：

- 实现或评审表单、对话框、菜单、表格、标签页、树、抽屉和自定义组件
- 将设计稿转换为代码
- 页面上线前做 QA 或发布前检查

## 检查清单

- 语义地标和标题层级
- 表单标签与描述
- 按钮和链接命名
- 键盘导航顺序
- 焦点环是否可见
- 对话框焦点锁定与关闭后焦点恢复
- 在需要时正确使用 aria-expanded / aria-controls / aria-selected
- 表格语义是否正确
- 是否存在明显的颜色对比度风险
- 纯图标控件是否具备可访问名称
- 在需要时是否对 loading、empty、error 状态进行了提示

## 输出格式

```
# 无障碍检查报告

> 生成时间: YYYY-MM-DD HH:mm
> 评审工具: frontend-craft
> 标准: WCAG 2.1 AA

## 🔴 必须修复 (N项)
- **[文件:行号]** 问题描述 → 建议修改

## 🟡 建议改进 (N项)
- **[文件:行号]** 问题描述 → 建议修改

## ✅ 已通过项
- ...

## 建议的代码修改
- ...
```

## 报告文件输出

检查完成后，必须将报告内容使用 Write 工具保存为 Markdown 文件：

- 目录：项目根目录下的 `reports/`（如不存在则创建）
- 文件名：`accessibility-review-YYYY-MM-DD-HHmmss.md`（使用当前时间戳）
- 保存后告知用户报告文件路径

务求实用。优先使用原生语义，不要过度依赖 ARIA。

## Expected Output

- 所有交互元素可键盘访问（Tab/Enter/Space/Esc）
- 语义化 HTML 结构（正确的标题层级、landmark、label）
- ARIA 属性仅在原生语义不足时使用
- 无障碍检查报告保存为 `reports/accessibility-review-YYYY-MM-DD-HHmmss.md`
