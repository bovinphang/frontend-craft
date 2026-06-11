# OpenClaw configuration instructions (replacing the original Claude Code settings.json)

This plugin no longer provides `settings.json` (Claude Code only). In OpenClaw please use a gateway configuration file, for example:

- User level: `~/.openclaw/openclaw.json` (or your profile path)
- workspace: as per `openclaw configure`/documentation convention

Common concerns:

- **Sandbox and execution strategy**: See the `agents.defaults.sandbox` and other keys in the official document [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing)
- **Plug-in switch**: `plugins.entries.frontend-craft` can override the Boolean items in the `configSchema` of this plugin (such as `formatAfterWrite`, `notifyOnAgentEnd`)
- **MCP**: The native plug-in will not automatically merge `.mcp.json` in the warehouse root directory; please merge `mcpServers` into your embedded Pi/gateway MCP configuration (see the MCP chapter of the main README)
