# frontend-craft: OpenCode

```bash
fec setup opencode
fec setup opencode --global
fec doctor opencode --local
fec doctor opencode --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install opencode --local` or `--global`.

Project base: `.opencode`; user base: `~/.config/opencode` (`XDG_CONFIG_HOME` / `OPENCODE_CONFIG_DIR` supported). Skills use `skills/`; commands use `commands/`. The generated `opencode.jsonc` uses `permission`, not `permissions`. The exact old generated template is repaired; custom JSONC is preserved. Unchanged manifest-owned `command/` files migrate to `commands/`.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://opencode.ai/docs/config/) · [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
