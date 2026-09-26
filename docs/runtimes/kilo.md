# frontend-craft: Kilo CLI

```bash
fec setup kilo
fec setup kilo --global
fec doctor kilo --local
fec doctor kilo --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install kilo --local` or `--global`.

This adapter targets the current Kilo CLI: project `.kilo`, user `$XDG_CONFIG_HOME/kilo` or `~/.config/kilo`, with `KILO_CONFIG_DIR` override. Skills use `skills/`, commands use canonical `commands/`. Official CLI source also discovers legacy singular directories and home `.kilo` / `.kilocode` roots. IDE-only installations can have different global discovery behavior; this is not a blanket IDE certification.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://github.com/Kilo-Org/kilocode/blob/main/packages/opencode/src/config/paths.ts) · [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
