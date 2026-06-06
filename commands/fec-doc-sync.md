---
name: fec-doc-sync
description: 从代码和项目事实源同步 README、docs、环境变量、脚本、API/路由/组件说明和部署说明。
---

按 `fec-doc-sync` 同步前端工程文档。复杂多语言更新可委托 **`fec-doc-updater`**。

## 执行步骤

1. 读取事实来源：`package.json`、lockfile、config、`.env.example`、路由、API clients/server routes、types/schemas、组件、测试、CI、build/deploy config。
2. 比对 README、docs、ADR、changelog、example prompts、setup/deploy/env docs。
3. 更新稳定的命令、环境变量、路由/API 行为、组件说明、部署步骤、版本约束和迁移说明。
4. 多语言文档保持关键信息一致。
5. 当目标仓库本身是 skill/agent/command 分发仓库时，也同步能力表、metadata、runtime docs 和 marketplace 描述。
6. 运行文档一致性、typecheck、测试、构建或相关打包检查。

## 输出要求

总结更新范围、事实来源、验证命令和仍需人工校对的翻译风险。
