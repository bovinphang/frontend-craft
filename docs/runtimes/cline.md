# frontend-craft: Cline

```bash
fec setup cline
fec setup cline --global
fec doctor cline --local
fec doctor cline --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install cline --local` or `--global`.

Project rules: `.clinerules/frontend-craft.md`, preserving other files in the directory. An existing legacy `.clinerules` file is backed up as `.clinerules.frontend-craft-backup` and copied into `.clinerules/legacy.md` before installing the new bundle. An existing backup stops migration to avoid overwriting it. Global rules: `~/Documents/Cline/Rules/frontend-craft.md`. Set `CLINE_CONFIG_DIR` to the parent of your actual `Rules` directory when Documents is redirected or Cline uses a different location. Manifest-tracked old default `~/.cline` installs are copied to the new location on install/update; originals and user edits are preserved.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://docs.cline.bot/customization/cline-rules) 路 [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
