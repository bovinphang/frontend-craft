# 安全策略

> **English:** [SECURITY.md](SECURITY.md)

感谢你愿意帮助保障 `frontend-craft` 及其用户的安全。

## 支持的版本

安全更新适用于 npm 上最新发布的版本以及本仓库默认分支。

## 报告漏洞

请勿通过公开的 GitHub Issue 报告安全漏洞。

在可用时，请使用 GitHub Security Advisories：

[https://github.com/bovinphang/frontend-craft/security/advisories/new](https://github.com/bovinphang/frontend-craft/security/advisories/new)

若无法使用 Advisories，请发邮件至 `package.json` 中列出的维护者。

请尽量包含：

- 受影响的版本或提交。
- 相关 runtime（如有）。
- 操作系统与 Node.js 版本。
- 复现步骤或概念验证。
- 潜在影响。
- 已知变通办法（如有）。

## 范围

以下领域属于安全敏感范围：

- CLI 安装行为与文件写入。
- Hook 脚本与命令执行。
- Runtime 模板生成。
- MCP 配置模板。
- 可能泄露密钥、凭据、路径或私有项目内容的任何行为。

## 响应预期

维护者力争在 **7 天内** 确认有效报告。修复时间取决于严重程度与维护者可用性；涉及安装安全、命令执行或密钥泄露的高影响问题将优先处理。

修复可用后，维护者可能发布补丁版本；除非报告人另有要求，否则将在致谢中列出贡献者。
