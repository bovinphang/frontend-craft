---
name: fec-doc-sync
description: Use when synchronizing frontend project documentation with source-of-truth files such as package.json, lockfiles, config, env examples, routes, API clients or server routes, schemas, components, tests, CI, build/deploy config, ADRs, changelogs, or migration notes. Do not use for general prose polishing only; Chinese triggers include 文档同步, 更新 README, docs sync, 环境变量文档, 命令清单, API 文档同步.
---

# 文档同步

## Purpose

从代码、配置、测试、类型、脚本和运行时模板同步前端项目文档，避免 README、docs、环境变量说明、API/路由说明、架构决策和迁移说明与实际项目行为漂移。

## Procedure

1. 识别项目栈、文档入口和本次需要同步的范围。
2. 收集事实来源：`package.json`、lockfile、框架和构建配置、`.env.example`、路由、API clients 或 server routes、types/schemas、组件、测试、CI、build/deploy config。
3. 比对 README、docs、ADR、changelog、example prompts、setup/deploy/env docs 中的命令、环境变量、路由、API 行为、部署步骤和支持矩阵。
4. 只更新稳定的公共约定；不要把临时调试结论、一次性报告或未落地设计写入长期文档。
5. 若仓库已有多语言文档，同步关键事实、命令名、环境变量、路由/API 名称和版本约束。
6. 当目标仓库本身是 skill/agent/command 分发仓库时，再同步能力表、metadata、runtime docs 和 marketplace 描述。
7. 运行相关文档一致性、类型检查、测试、构建或打包检查。

## Constraints

- 不把 README 变成完整实现细节；公开文档保留高信号摘要。
- 不引入与事实来源不一致的命令、路径、环境变量、API 行为或能力名称。
- 不把未确认的 TODO、草案或实验能力写成已支持行为。
- 不修改用户项目私有文档，除非用户明确指定。
- 多语言文档若无法完整翻译，至少保持命令名、环境变量、路由/API 名称、版本约束和报告格式一致。
- 不把 ADR 当作长篇复盘；只记录背景、决策、取舍、影响范围、验证和回滚线索。

## Expected Output

- 列出已同步的 README/docs/ADR/changelog/env/setup/deploy 文档。
- 总结使用的事实来源、更新范围、验证命令和未覆盖风险。
- 标出仍需人工确认的产品文案、翻译、外部服务配置或发布说明。
