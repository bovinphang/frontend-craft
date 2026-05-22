---
name: fec-build-fix
description: 增量修复 lint、type-check、test、build 或 CI 失败，一次处理一类根因并重新验证。
---

按 `fec-validation-fix` 执行构建与验证失败修复。复杂失败可委托 **`frontend-build-fixer`**。

## 执行步骤

1. 读取 `package.json`，确认仓库实际验证命令。
2. 运行最小失败命令或分析用户提供的日志。
3. 按文件和根因分组错误。
4. 一次修复一类问题，避免扩大改动。
5. 每次修复后重新运行受影响命令。
6. 若同一错误多次修复仍失败，停止并报告阻塞。

## 输出要求

将命令状态、根因、修复说明、变更文件和剩余风险保存到 `reports/validation-fix-YYYY-MM-DD-HHmmss.md`。
