# frontend-craft: Cursor

```bash
fec setup cursor
fec setup cursor --global
fec doctor cursor --local
fec doctor cursor --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install cursor --local` or `--global`.

Project skills: `.cursor/skills`; user skills: `~/.cursor/skills` (or `CURSOR_CONFIG_DIR/skills`). Project rules use `.cursor/rules/*.mdc`. This adapter installs skills and project rules; it does not install native agents, hooks, commands or MCP configuration.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://cursor.com/docs/skills) · [Compatibility and upgrade notes](compatibility.md)
