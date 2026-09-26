# frontend-craft: OpenClaw

```bash
fec setup openclaw
fec setup openclaw --global
fec doctor openclaw --local
fec doctor openclaw --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install openclaw --local` or `--global`.

Universal CLI: run from the agent workspace; project skills go into `<workspace>/skills`, with the install manifest in `.openclaw`. User skills go into `$OPENCLAW_STATE_DIR/skills` or `~/.openclaw/skills`; `OPENCLAW_CONFIG_DIR` remains a fallback alias. Commands are converted to named skill directories with `SKILL.md`. Global setup does not write project context files. The separately packed native plugin includes hook handlers and an optional workspace initialization tool; `npm run pack:openclaw` generates its command skills.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://docs.openclaw.ai/skills) · [Compatibility and upgrade notes](compatibility.md)

Review defaults to the full project; a file/directory request includes unchanged code, while incremental review requires an explicit changes/PR/commit request. Technical diagrams use structured sources; PNG export requires a local browser and disclosed QA coverage. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
