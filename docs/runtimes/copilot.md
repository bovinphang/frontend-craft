# frontend-craft: GitHub Copilot

```bash
fec setup copilot
fec setup copilot --global
fec doctor copilot --local
fec doctor copilot --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install copilot --local` or `--global`.

Local installation targets repository customization: `.github/instructions/frontend-craft.instructions.md` with `applyTo: "**"` and `.github/prompts/fec-*.prompt.md`. Prompt files are supported by compatible IDE clients. Global installation targets Copilot CLI user instructions in `~/.copilot/copilot-instructions.md` (`COPILOT_CONFIG_DIR` override), preserving an existing file. Global IDE prompt installation is not provided; use `--local` for prompts.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://docs.github.com/en/copilot/reference/customization-cheat-sheet) · [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
