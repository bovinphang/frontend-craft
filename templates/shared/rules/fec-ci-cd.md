# CI/CD 规则

本文件约定持续集成与部署流水线的结构与行为。

## 流水线阶段

建议顺序：

1. **安装依赖** — `npm ci` 或 `pnpm install --frozen-lockfile`
2. **Lint** — ESLint、Stylelint
3. **类型检查** — `tsc --noEmit`
4. **单元测试** — Jest / Vitest
5. **构建** — `npm run build` 或 `pnpm build`
6. **包体/性能预算**（可选）— size-limit、Lighthouse CI、bundle analyzer
7. **E2E 测试**（可选）— Playwright / Cypress
8. **部署** — 构建产物上传或触发部署服务

任一阶段失败则中止后续步骤。

## GitHub Actions 示例

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run typecheck
      - run: pnpm run test
      - run: pnpm run build

      - name: Upload build
        if: success() && github.ref == 'refs/heads/main'
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

## GitLab CI 示例

```yaml
stages:
  - install
  - lint
  - test
  - build
  - deploy

variables:
  PNPM_VERSION: "8"

install:
  stage: install
  script:
    - corepack enable pnpm
    - pnpm install --frozen-lockfile
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
      - .pnpm-store/

lint:
  stage: lint
  script:
    - pnpm run lint
    - pnpm run typecheck
  needs: [install]

test:
  stage: test
  script:
    - pnpm run test
  needs: [install]

build:
  stage: build
  script:
    - pnpm run build
  artifacts:
    paths:
      - dist/
  needs: [lint, test]
```

## 环境变量与密钥

- 敏感信息使用 CI 平台的 Secrets，不写入仓库
- 构建时注入 `VITE_*` / `NEXT_PUBLIC_*` 等前端环境变量
- E2E 的 baseURL、测试账号等从 Secrets 读取
- 只允许公开前缀的环境变量进入客户端 bundle；服务端密钥不得使用 `VITE_*` / `NEXT_PUBLIC_*`

## 产物与证据

- 上传测试报告、覆盖率、E2E trace、截图、构建产物和性能预算结果。
- CI 失败时保留足够日志定位根因，不只返回“命令失败”。
- 发布前确认版本、变更说明、迁移事项和回滚路径。

## 强约束

- 使用锁文件（`package-lock.json`、`pnpm-lock.yaml`），禁止 `npm install` 无锁安装
- 构建产物不提交到仓库，由 CI 生成并上传
- 部署前必须通过 lint、typecheck、test、build
- 不跳过失败门禁直接部署，除非有明确风险接受和回滚方案
