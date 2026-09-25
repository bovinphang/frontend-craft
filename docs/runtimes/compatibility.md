# Runtime compatibility and upgrades

The adapters install different capability subsets. Run `fec matrix` for the project-level inventory and read the runtime-specific page for global differences. A successful install or doctor result proves the expected artifacts exist, not that every host feature is integrated or a particular release was tested interactively.

## Updating existing installations

Use `fec update <runtime> --local` or `--global` with the new CLI. Updates preserve manifest-tracked files changed by the user. Fresh installs retain existing Codex configuration and context files. Merge any missing rule imports into existing Gemini context files manually.

Unchanged manifest-owned legacy command paths are retired when replacements are installed for OpenCode, Kilo, Copilot, Gemini, OpenClaw and global Windsurf. Unknown or edited old files are preserved. Files that remain in old directories stay tracked for a later uninstall. Claude CLI hooks now live in settings.json; the original native Marketplace packaging stays unchanged.

Antigravity and Cline global defaults changed. Run `fec setup antigravity --global` / `fec setup cline --global` to copy manifest-tracked files to the current destination before updating; user edits and old originals are preserved. `fec update --global` also discovers these legacy installations. For product-specific or redirected directories, use the documented runtime configuration-directory environment variable. It is an installer override; configure the host consistently too.

Shared Claude/Qoder settings are never owned as a whole file. The manifest records installed hook entries, so uninstall removes only exact matching entries and preserves other settings. A user-modified hook entry is preserved; remove it manually if it still refers to a script you uninstall. Malformed settings stop the operation rather than being replaced. Keep the install manifest for safe updates and uninstall.

## Scope differences

- Copilot project installs provide IDE prompt files and path-specific instructions. Global installs provide CLI user instructions, not IDE global prompts.
- Kilo targets the current CLI discovery contract. Antigravity defaults to its IDE/2.0 global directory; its CLI uses a different override.
- OpenClaw project installs require the agent workspace as the working directory. Native plugin packaging is separate from the universal installer.
- Cursor, Augment and CodeBuddy keep their existing supported capability subsets. New host features are not automatically installed.
- Codex agents inherit the selected model and reasoning effort. Older manually edited TOML files remain untouched by update; remove their model overrides yourself if you want inheritance.

## Verification

Regression tests exercise artifact discovery paths, metadata, existing settings, repeated installation and uninstall behavior. `npm test` runs the package's build, type checks and test suite. `npm run typecheck:openclaw` and `npm run pack:openclaw` verify the separate native package. Full host-session tests require the corresponding installed product and account.
