# 从独立仓库迁移到本仓库

原先 **`frontend-craft-codex`** 与 **`frontend-craft-openclaw`** 已合并到 **`frontend-craft`** 单一仓库维护。

## Codex 用户

使用本仓库 CLI 安装到当前项目：

```bash
npx frontend-craft@latest install --local codex
```

或继续通过 git 引用本仓库后手动对齐 `.codex/` 与 `.agents/skills/`（不推荐）。

**脚本 / CI：** 请为 `install` 显式加上 `--local` 或 `--global`，以免在无 TTY 环境下依赖默认策略；未指定 runtime 时，非 TTY 会默认全局安装 `claude`。

## OpenClaw 用户

1. 使用本仓库打出的 **`frontend-craft-openclaw`** npm 包：执行 `npm run pack:openclaw` 后，在**仓库根目录**取得 `frontend-craft-openclaw-<version>.tgz` 再安装（例如 `npm install ./frontend-craft-openclaw-2.0.1.tgz`）。
2. 或安装主包 **`frontend-craft`** 后按 OpenClaw 文档配置 `extensions` 指向 `node_modules/frontend-craft/dist/openclaw/index.js`（若发布中包含该路径）。

## 归档旧仓库

建议在 **`frontend-craft-codex`** / **`frontend-craft-openclaw`** 的 README **最顶部**加入：

```markdown
> **Archived:** 内容已合并至 [frontend-craft](https://github.com/bovinphang/frontend-craft)。请使用主仓库与 `npx frontend-craft install <runtime>`（脚本或 CI 请加 `--local` 或 `--global`），详见仓库 README **Universal Install**。
```
