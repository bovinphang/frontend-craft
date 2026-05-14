---
name: fec-review
description: 对指定文件或最近变更的前端代码进行规范化评审，输出分级评审报告并保存为 Markdown 文件。
---

对前端代码进行全面评审。若需要**结合 git diff、按严重级别（CRITICAL→LOW）降噪输出、并显式给出 Approve/Warning/Block 结论**，可委托 **`frontend-code-reviewer`** 子代理执行；若变更以 **`.ts` / `.tsx` / `.js` / `.jsx`** 为主且需先跑 **typecheck/eslint**、PR 合并就绪检查与 TS/JS 惯用法专项结论，可委托 **`typescript-reviewer`**（报告为 `typescript-review-*.md`）。否则继续按本命令与 `fec-frontend-code-review` Skill 流程即可。

## 执行步骤

1. 确定评审范围：

   - 如果用户指定了文件路径，评审指定文件
   - 如果用户没有指定文件，运行 `git diff --name-only HEAD` 获取最近变更的文件列表
   - 如果没有 git 变更记录，提示用户指定需要评审的文件或目录

2. 过滤只保留前端相关文件（`.ts`, `.tsx`, `.vue`, `.js`, `.jsx`, `.css`, `.scss`, `.less`, `.html`）

3. 使用 `fec-frontend-code-review` Skill 的评审维度逐项检查：

   - 架构（组件边界、职责分离）
   - 类型安全（any 使用、props 类型）
   - 渲染与状态（重复渲染、key 稳定性）
   - 样式（Token 使用、响应式）
   - 可访问性（语义化、ARIA、键盘操作）
   - 可维护性（文件体积、命名、重复逻辑）
   - 测试（关键覆盖、测试模式）
   - 安全（XSS、敏感信息、输入校验）

4. 按以下格式输出评审报告：

   ```
   # 代码审查报告

   > 生成时间: YYYY-MM-DD HH:mm
   > 评审工具: frontend-craft

   **评审范围**: N 个文件

   ## 🔴 必须修改 (N项)
   - **[文件:行号]** 问题描述 → 建议修改

   ## 🟡 建议优化 (N项)
   - **[文件:行号]** 问题描述 → 建议修改

   ## 🔵 可选优化项 (N项)
   - **[文件:行号]** 问题描述

   ## 🟢 做得好的地方
   - ...

   ## 风险等级：低 / 中 / 高

   **总体评价**: 可合并 / 待修改后合并 / 需要重构
   ```

5. 将报告内容使用 Write 工具保存为 Markdown 文件：
   - 目录：项目根目录下的 `reports/`（如不存在则创建）
   - 文件名：`code-review-YYYY-MM-DD-HHmmss.md`（使用当前时间戳）
   - 保存后告知用户报告文件路径

6. 如果用户同意修改，直接修复"必须修改"中可以自动修复的项目。
