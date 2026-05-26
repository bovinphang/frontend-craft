# frontend-craft：Claude（Claude Code）

大多数 Claude Code 用户推荐走 **Claude Code Marketplace**，让 Claude Code 原生插件系统作为唯一加载来源。

仅当你需要跨运行时安装、离线/脚本化复制文件，或处在非 Marketplace 环境时，再使用 CLI：

```bash
npx frontend-craft@latest install --local claude
# 或
npx frontend-craft@latest install --global claude
```

> **非交互场景：** 请加上 `--local` 或 `--global`，避免询问安装位置。交互与脚本行为说明见根目录 README **通用安装**。

同一个 Claude 作用域请只选择一个激活来源：Marketplace/原生插件、CLI 安装或 `--plugin-dir`。它们技术上可以共存，但不推荐在同一个 Claude 会话里同时启用多份完整插件，否则 commands、skills、agents 与 hooks 可能重复。

---

## Claude Code Marketplace

仍可将 `frontend-craft` 作为 Claude Code 的 Marketplace 插件安装，由 Claude Code 原生加载插件。

---

## Marketplace 安装后的快速开始

### 第一步：安装插件

```bash
# 添加市场
/plugin marketplace add bovinphang/frontend-craft

# 安装插件
/plugin install frontend-craft@bovinphang-frontend-craft

# 激活
/reload-plugins
```

### 第二步：初始化项目配置（推荐）

```bash
# 将项目模板复制到当前项目的 .claude/ 目录
/fec-init
```

初始化后请根据项目实际情况修改：

1. `.claude/CLAUDE.md` — 修改项目基础信息、包管理器、常用命令（仓库内模板位于 `templates/claude/`，`/fec-init` 会复制到 `.claude/`）
2. `.claude/rules/` — 删除不适用的规则文件（如纯 React 项目删除 `vue.md`，不需要 i18n 的项目删除 `i18n.md`）
3. `.claude/settings.json` — 调整权限白名单

> **为什么需要这一步？** 插件提供可复用的 Skills、Agents 和 Hooks；CLAUDE.md 与 rules 属于项目级配置，须位于项目根目录的 `.claude/` 下才能被 Claude Code 识别。`/fec-init` 用于快速完成该步骤。
>
> `/fec-init` 是项目配置初始化，不是第二次安装插件本体。插件本体请交给 Marketplace、CLI 或 `--plugin-dir` 其中之一管理。

### 第三步：开始使用

```bash
# 代码评审（输出到 reports/code-review-*.md）
/fec-review

# 按规范创建页面/功能/组件
/fec-scaffold page UserDetail
/fec-scaffold component DataTable

# 查看可用命令
/plugin list frontend-craft@bovinphang-frontend-craft
```

具体 agents、skills、commands 清单见根目录 README **功能概览**。

---

## 其他安装方式（仅 Claude Code）

> **要求：** Claude Code v1.0.33+，Node.js 22+，npm/pnpm/yarn。

### 选项 1：作为插件安装（推荐）

与上文 **「Marketplace 安装后的快速开始」** 中 **第一步：安装插件** 相同（添加市场、安装插件、`/reload-plugins`）。亦可不在对话里执行命令，直接写入 `~/.claude/settings.json` 或项目 `.claude/settings.json`：

```json
{
  "extraKnownMarketplaces": {
    "frontend-craft": {
      "source": {
        "source": "github",
        "repo": "bovinphang/frontend-craft"
      }
    }
  }
}
```

### 选项 2：团队项目级自动安装

在项目根目录的 `.claude/settings.json` 中添加上述 `extraKnownMarketplaces` 配置，团队成员 trust 项目目录后会收到安装提示。

### 选项 3：本地开发 / 测试

克隆仓库后使用 `--plugin-dir` 加载（无需安装，适合开发调试）：

```bash
git clone https://github.com/bovinphang/frontend-craft.git
claude --plugin-dir ./frontend-craft
```

使用 `--plugin-dir` 做开发调试时，请避免在同一会话里同时启用 Marketplace 版本，这样才能确定当前运行的是哪一份代码。

### 选项 4：Git Submodule（项目内共享）

```bash
# 在项目根目录添加 submodule
git submodule add https://github.com/bovinphang/frontend-craft.git .claude/plugins/frontend-craft

git add .gitmodules .claude/plugins/frontend-craft
git commit -m "feat: add frontend-craft as shared Claude Code plugin"
```

团队成员克隆后执行：

```bash
git submodule update --init --recursive
```

再使用 `--plugin-dir` 加载：

```bash
claude --plugin-dir .claude/plugins/frontend-craft
```

---

## 更新（Marketplace 与 submodule）

通过 Marketplace 安装的插件，在 Claude Code 中执行：

```text
/plugin marketplace update bovinphang-frontend-craft
```

或开启自动更新，每次启动 Claude Code 时拉取最新版本：

1. 在 Claude Code 中执行 `/plugin` 打开插件管理器
2. 切换到 **Marketplaces** 标签页
3. 选中 `bovinphang-frontend-craft`
4. 选择 **Enable auto-update**

> 第三方 Marketplace 默认不开启自动更新。启用后，Claude Code 每次启动时会刷新 Marketplace 数据并更新已安装插件。

若使用 Git submodule 安装：

```bash
git submodule update --remote .claude/plugins/frontend-craft
```

**CLI 安装：** 对同一作用域重新执行 `npx frontend-craft@latest install --local claude` 或 `... --global claude`，版本说明见 [CHANGELOG.zh-CN.md](../../CHANGELOG.zh-CN.md) 或 [CHANGELOG.md](../../CHANGELOG.md)。如果已经检测到 Claude Code Marketplace 安装，CLI 会提示冲突，并要求显式传入 `--force` 才继续写入另一份激活副本。

强制继续 CLI 安装时，请使用完整命令；`--force` 必须跟在 `install claude` 后面：

```bash
npx frontend-craft@latest install claude --global --force
npx frontend-craft@latest install claude --local --force
```

---

**English:** [claude.md](claude.md)
