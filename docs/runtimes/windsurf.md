# frontend-craft: Windsurf

```bash
fec setup windsurf
fec setup windsurf --global
fec doctor windsurf --local
fec doctor windsurf --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install windsurf --local` or `--global`.

Project skills/workflows: `.windsurf/skills` and `.windsurf/workflows`. User skills: `~/.codeium/windsurf/skills`; user workflows: `~/.codeium/windsurf/global_workflows` (base override: `WINDSURF_CONFIG_DIR`). Project rules retain the supported `.windsurf/rules` layout. Unchanged manifest-owned legacy global workflows are retired on update.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://docs.windsurf.com/windsurf/cascade/workflows) · [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
