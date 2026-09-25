# frontend-craft: Qoder

```bash
fec setup qoder
fec setup qoder --global
fec doctor qoder --local
fec doctor qoder --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install qoder --local` or `--global`.

Project base: `.qoder`; user base: `~/.qoder` (`QODER_CONFIG_DIR` override). Skills, agents and commands are installed in their named directories; project rules go in `rules/`. Hooks are merged into `settings.json`, with absolute global script paths and deduplicated entries. Invalid settings JSON stops installation. Known unchanged legacy relative global hooks are replaced. This adapter does not configure MCP.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://docs.qoder.com/cli/hooks) · [Compatibility and upgrade notes](compatibility.md)
