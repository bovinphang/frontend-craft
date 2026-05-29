---
name: fec-doc-sync
description: 从代码和元数据同步 README、runtime docs、项目结构、能力表、命令清单和报告说明。
---

按 `fec-doc-sync` 同步前端工程文档。复杂多语言更新可委托 **`fec-doc-updater`**。

## 执行步骤

1. 读取事实来源：`package.json`、`skills/metadata.json`、`agents/`、`commands/`、`templates/shared/rules/`。
2. 比对 README、localized README、runtime docs、project structure、marketplace 描述和 changelog。
3. 更新数量、命令名、skill id、agent id、报告文件名和安装说明。
4. 多语言文档保持信息一致。
5. 运行元数据一致性、打包或相关测试。

## 输出要求

总结更新范围、事实来源、验证命令和仍需人工校对的翻译风险。
