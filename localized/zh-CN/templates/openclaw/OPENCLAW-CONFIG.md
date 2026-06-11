# OpenClaw 配置说明（替代原 Claude Code settings.json）

本插件不再提供 `settings.json`（Claude Code 专用）。在 OpenClaw 中请使用网关配置文件，例如：

- 用户级：`~/.openclaw/openclaw.json`（或你的 profile 路径）
- 工作区：按 `openclaw configure` / 文档约定

常用关注点：

- **沙箱与执行策略**：参见官方文档 [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) 中的 `agents.defaults.sandbox` 等键
- **插件开关**：`plugins.entries.frontend-craft` 下可覆盖本插件 `configSchema` 中的布尔项（如 `formatAfterWrite`、`notifyOnAgentEnd`）
- **MCP**：原生插件不会自动合并仓库根目录的 `.mcp.json`；请将其中 `mcpServers` 合并到你的 embedded Pi / 网关 MCP 配置（见主 README 的 MCP 章节）
