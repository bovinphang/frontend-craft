# frontend-craft: Gemini CLI

```bash
fec setup gemini
fec setup gemini --global
fec doctor gemini --local
fec doctor gemini --global
```

Without a global CLI installation, use `npx @bovinphang/frontend-craft install gemini --local` or `--global`.

Skills use `.gemini/skills` or `~/.gemini/skills` (`GEMINI_CONFIG_DIR` override). Rules are copied into `rules/` under that base. If absent, project `GEMINI.md` or user `~/.gemini/GEMINI.md` is created with resolvable rule imports. Existing context files are preserved; add the rule imports manually if you want them in an existing context. This installs native skills, not an incomplete extension.

The capability matrix describes what frontend-craft installs, not every feature offered by the host. `doctor` checks installation artifacts; it does not launch the host or certify a release version.

[Official reference](https://geminicli.com/docs/cli/skills/) · [Compatibility and upgrade notes](compatibility.md)
