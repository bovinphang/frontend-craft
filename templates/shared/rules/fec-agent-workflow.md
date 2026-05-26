# 子代理协作规则

当前端任务涉及多视角分析、跨模块规划、专项质量审查或验证失败修复时，优先使用职责明确的子代理。

## 选择原则

- 架构、页面拆分、状态流、目录规划：`frontend-architect`
- 前端 PR 综合评审：`frontend-code-reviewer`
- TypeScript / JavaScript 语义与类型风险：`typescript-reviewer`
- 安全风险：`frontend-security-reviewer`
- 测试策略：`frontend-test-planner`
- E2E 编写与运行：`frontend-e2e-runner`
- 性能瓶颈：`performance-optimizer`
- UI 视觉与设计稿差异：`ui-checker`
- 设计稿实现：`figma-implementer`
- Token 映射：`design-token-mapper`
- 构建、类型、测试、CI 失败：`frontend-build-fixer`
- 死代码与无用依赖清理：`frontend-refactor-cleaner`
- README、runtime docs、能力表同步：`frontend-doc-updater`

## 协作约束

- 委托前先明确范围、输入和输出，不把模糊任务丢给子代理。
- 多个独立问题可以并行分析；彼此有依赖的任务按顺序推进。
- 子代理输出必须落到可验证结论：报告、文件路径、命令结果或具体风险。
- 子代理建议不自动等于实现决策；与仓库现有约定冲突时，优先遵循仓库约定。

## 反模式

- 为简单单文件修改创建过多代理。
- 让多个代理同时修改同一文件而没有边界。
- 用子代理替代本应先做的代码阅读。
- 只接收结论，不核对关键证据和验证命令。
