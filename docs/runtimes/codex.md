# frontend-craft: Codex

```bash
fec setup codex
fec setup codex --global
fec doctor codex --local
fec doctor codex --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install codex --local` or `--global`.

Project skills: `.agents/skills`; user skills: `~/.agents/skills`. Agents: `.codex/agents/*.toml` or `$CODEX_HOME/agents`. Existing `config.toml` is preserved. New agents inherit the session model and reasoning effort; edited agent files are preserved by `fec update`. Hooks and active MCP configuration are not installed by this adapter.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://learn.chatgpt.com/docs/agent-configuration/subagents) · [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
