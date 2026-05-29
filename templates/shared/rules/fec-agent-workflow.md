# 子代理协作规则

当前端任务涉及多视角分析、跨模块规划、专项质量审查或验证失败修复时，优先使用职责明确的子代理。

## 选择原则

- 架构、页面拆分、状态流、目录规划：`fec-architect`
- 前端 PR 综合评审：`fec-code-reviewer`
- TypeScript / JavaScript 语义与类型风险：`fec-typescript-reviewer`
- 安全风险：`fec-security-reviewer`
- 测试策略：`fec-test-planner`
- E2E 编写与运行：`fec-e2e-runner`
- 性能瓶颈：`fec-performance-optimizer`
- 来源/版本敏感决策：优先由主代理查项目事实和官方来源，再交给专项代理落地
- UI 视觉与设计稿差异：`fec-ui-checker`
- 设计稿实现：`fec-figma-implementer`
- Token 映射：`fec-design-token-mapper`
- 构建、类型、测试、CI 失败：`fec-build-fixer`
- 死代码与无用依赖清理：`fec-refactor-cleaner`
- README、runtime docs、能力表同步：`fec-doc-updater`

## 多代理评审编排

复杂 PR 可按质量维度并行评审，但必须有主代理负责合并结论。

| 变更类型 | 建议组合 | 主合并者 |
| --- | --- | --- |
| UI feature | `fec-code-reviewer` + `fec-typescript-reviewer` + `fec-test-planner` | `fec-code-reviewer` |
| 鉴权 / 上传 / 富文本 | `fec-security-reviewer` + `fec-code-reviewer` | `fec-security-reviewer` |
| 大列表 / 图表 / 3D / 性能问题 | `fec-performance-optimizer` + `fec-code-reviewer` | `fec-performance-optimizer` |
| 设计稿落地 | `fec-figma-implementer` + `fec-ui-checker` + `fec-code-reviewer` | `fec-figma-implementer` |
| 大型重构 | `fec-architect` + `fec-refactor-cleaner` + `fec-test-planner` | `fec-architect` |

合并规则：

- 相同文件、相同行号、相同根因的问题合并为一条，保留最高严重级别。
- 相同根因分布在多处时写成模式级发现，列代表性位置，不逐行刷屏。
- 结论冲突时先回到项目事实、测试结果和用户影响，不用代理身份决定谁对。
- 主代理输出最终 Verdict，并列出各专项代理覆盖的范围和未覆盖范围。

## 协作约束

- 委托前先明确范围、输入和输出，不把模糊任务丢给子代理。
- 多个独立问题可以并行分析；彼此有依赖的任务按顺序推进。
- 子代理输出必须落到可验证结论：报告、文件路径、命令结果或具体风险。
- 子代理建议不自动等于实现决策；与仓库现有约定冲突时，优先遵循仓库约定。
- 主代理必须复核关键证据、验证命令和改动边界，不能只转述子代理结论。

## 反模式

- 为简单单文件修改创建过多代理。
- 让多个代理同时修改同一文件而没有边界。
- 用子代理替代本应先做的代码阅读。
- 只接收结论，不核对关键证据和验证命令。
