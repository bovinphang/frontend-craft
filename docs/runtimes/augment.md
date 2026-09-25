# frontend-craft: Augment

```bash
fec setup augment
fec setup augment --global
fec doctor augment --local
fec doctor augment --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install augment --local` or `--global`.

Skills use `.augment/skills` or `~/.augment/skills` (`AUGMENT_CONFIG_DIR` override). The adapter currently installs skills only. Native agents, rules, hooks and MCP support in Augment do not imply that this adapter installs those capabilities.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://docs.augmentcode.com/cli/skills) · [Compatibility and upgrade notes](compatibility.md)
