# frontend-craft: Antigravity

```bash
fec setup antigravity
fec setup antigravity --global
fec doctor antigravity --local
fec doctor antigravity --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install antigravity --local` or `--global`.

Project skills retain backward-compatible `.agent/skills`; the current IDE/2.0 user base is `~/.gemini/config`, so skills go in `~/.gemini/config/skills`. For Antigravity CLI set `ANTIGRAVITY_CONFIG_DIR` to `~/.gemini/antigravity-cli` before global installation. The override selects one product scope; this adapter does not install plugins or hooks. After upgrading an old default global install, run `fec setup antigravity --global`; the old `~/.gemini/antigravity` files are preserved.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://antigravity.google/docs/skills) · [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
