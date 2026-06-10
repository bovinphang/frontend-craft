# CI/CD 规则

本文件约定持续集成与部署流水线的常驻结构与门禁。具体 GitHub Actions、GitLab CI、云平台或 monorepo pipeline 写法，应按项目现有 CI 模板实现，不在本规则中复制长 YAML。

## 流水线阶段

建议顺序：

1. **安装依赖**：使用锁文件安装，例如 `npm ci` 或 `pnpm install --frozen-lockfile`。
2. **Lint / Format 检查**：ESLint、Stylelint、Prettier check 或项目等价命令。
3. **类型检查**：`tsc --noEmit` 或项目 typecheck 脚本。
4. **单元 / 组件测试**：Jest、Vitest、Testing Library、Vue Test Utils 等。
5. **构建**：项目生产构建命令。
6. **专项质量门禁**：包体、Lighthouse、依赖安全、license、a11y、视觉回归、E2E，按风险启用。
7. **部署**：仅在前序门禁通过后上传产物或触发部署。

任一必需阶段失败都应中止后续步骤。

## 环境变量与密钥

- 敏感信息使用 CI 平台 Secrets，不写入仓库、日志或构建产物。
- 只允许公开前缀的环境变量进入客户端 bundle，例如 `VITE_*`、`NEXT_PUBLIC_*` 等；服务端密钥不得使用公开前缀。
- E2E 的 baseURL、测试账号、第三方 token 等从 Secrets 或受控测试环境读取。
- CI 日志要避免打印完整环境变量、请求 header、token 或私密配置。

## 产物与证据

- 上传或保留测试报告、覆盖率、E2E trace、截图、构建产物、包体报告和性能预算结果。
- CI 失败时保留足够日志定位根因，不只返回“命令失败”。
- 发布前确认版本、变更说明、迁移事项、回滚路径和影响范围。
- 依赖升级 PR 保留 lockfile diff、关键包版本、release notes 摘要和验证矩阵。
- Monorepo affected 快速验证可以用于 PR 反馈，但 release 或主干合并前应保留全量验证入口。

## 强约束

- 使用并提交锁文件，禁止无锁安装。
- 构建产物不提交到源码仓库，由 CI 生成并上传。
- 部署前必须通过项目定义的 lint、typecheck、test、build。
- 不跳过失败门禁直接部署，除非有明确风险接受、审批记录和回滚方案。
- CI 配置应复用项目已有命令，不在流水线里发明与本地不同的替代命令。
