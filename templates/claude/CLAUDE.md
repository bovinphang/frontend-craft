# 项目说明

本仓库由前端团队维护。

核心要求：

- 在调整架构前，先理解现有代码
- 优先复用，而不是重复造轮子
- 保持改动小、清晰、便于评审
- 先遵循项目标准，再考虑通用模式

## 项目基础信息

<!-- 请根据项目实际情况修改以下配置 -->

- 语言：TypeScript
- 包管理器：pnpm
- 构建工具：Vite
- 测试工具: Vitest + Testing Library
- UI 体系：优先复用现有组件库和设计 Token
- 设计实现流程：如有条件，优先使用设计工具 MCP（Figma / MasterGo / Pixso / 墨刀 / Sketch）上下文

## 常用命令

优先使用仓库现有命令，不要自行发明替代命令。

<!-- 请根据项目实际情况修改 -->

- 安装：`pnpm install`
- 开发：`pnpm dev`
- Lint：`pnpm lint`
- 类型检查：`pnpm type-check`
- 测试：`pnpm test`
- 构建：`pnpm build`

如果命令缺失，先检查 `package.json`。

## 通用工作原则

改代码前：

1. 阅读目标模块及其周边模块
2. 搜索已有可复用组件或工具函数
3. 理解当前样式和 Token 约定
4. 如果仓库里已有一套模式，不要再引入第二套

实现时：

- 保持组件职责聚焦
- 将重复逻辑提取到 hooks / composables / utils
- 优先使用明确类型
- 优先使用可推导状态，避免重复维护状态
- 除非任务明确要求破坏性变更，否则保持向后兼容

完成后：

- 执行 lint
- 如有类型检查则执行 type check
- 如有测试则执行测试
- 总结改动文件、关键决策和剩余风险

## Git 规范

- 提交前必须通过 lint 和类型检查
- 未经我确认不要直接 commit
- 分支命名: feature/xxx, fix/xxx, refactor/xxx
- Commit 格式: 遵循 Conventional Commits（详见 rules/git-conventions.md）

## 设计稿实现工作流

当存在设计上下文时：

1. 先通过 MCP 读取设计上下文（Figma / MasterGo / Pixso / 墨刀 / Sketch，摹客则使用截图/标注）
2. 检查项目现有组件体系
3. 先产出简短实现计划
4. 分步骤实现
5. 执行校验命令
6. 总结偏差和风险

## 安全要求

不要主动暴露或打印任何密钥。
除非任务明确要求且权限允许，不要读取或修改敏感文件。
除非明确要求并获得批准，不要执行破坏性 shell 命令。

## 规则导入

<!-- 按项目技术栈选择性导入，删除不需要的行 -->

@./rules/vue.md
@./rules/react.md
@./rules/design-system.md
@./rules/testing.md
@./rules/git-conventions.md
@./rules/i18n.md
@./rules/performance.md
@./rules/api-layer.md
@./rules/state-management.md
@./rules/error-handling.md
@./rules/naming-conventions.md
@./rules/typescript.md
@./rules/code-comments.md
@./rules/ci-cd.md
@./rules/refactoring.md
