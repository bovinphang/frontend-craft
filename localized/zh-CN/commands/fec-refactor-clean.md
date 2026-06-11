---
name: fec-refactor-clean
description: 在验证保护下识别并清理前端死代码、未使用导出、过期组件、样式和依赖。
---

按 `fec-refactor-clean` 执行安全清理。复杂清理可委托 **`fec-refactor-cleaner`**。

## 执行步骤

1. 建立当前验证基线。
2. 使用仓库已有工具或 `rg` 收集未使用候选项。
3. 检查动态引用、路由、barrel export、Storybook、测试和样式入口。
4. 将候选项分为 SAFE、CAUTION、DANGER。
5. 仅清理 SAFE 项；其他项输出建议和证据。
6. 每批清理后重新运行受影响验证命令。

## 输出要求

将清理报告保存到 `reports/refactor-clean-YYYY-MM-DD-HHmmss.md`。
