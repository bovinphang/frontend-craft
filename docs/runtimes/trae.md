# frontend-craft: Trae

```bash
fec setup trae
fec setup trae --global
fec doctor trae --local
fec doctor trae --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install trae --local` or `--global`.

Project rules: `.trae/rules/frontend-craft.md`; user rules: `~/.trae/user_rules/frontend-craft.md` (`TRAE_CONFIG_DIR` base override). Both include explicit `alwaysApply: true` metadata. This adapter installs rules, not native skills, agents or MCP configuration.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://docs.trae.ai/ide/rules) · [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
