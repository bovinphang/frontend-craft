# frontend-craft: CodeBuddy

```bash
fec setup codebuddy
fec setup codebuddy --global
fec doctor codebuddy --local
fec doctor codebuddy --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install codebuddy --local` or `--global`.

Skills use `.codebuddy/skills` or `~/.codebuddy/skills` (`CODEBUDDY_CONFIG_DIR` override). This adapter installs skills only; commands, agents, hooks and MCP supported by the product are separate integration opportunities.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://www.codebuddy.ai/docs/cli/skills) · [Compatibility and upgrade notes](compatibility.md)
