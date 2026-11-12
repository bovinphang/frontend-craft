# CLI management

Both products use craft-common's command dispatcher, interactive prompts, npm/pnpm installation detection and CLI lifecycle. Replace bec with fec for frontend-craft.

`bec setup [runtime]` and `bec setup all` connect the current project locally. `--global/-g` overrides this. Ordinary `bec`, `bec install` or `bec runtime install` prompts for runtime(s), language and location in a terminal; without a terminal it defaults to Claude, global and English. This changes backend-craft's former default local installation. Use `--local/-l` explicitly in existing scripts. Use `--lang en|zh-CN` or `--lang=zh-CN`.

`bec update` / `bec upgrade` updates the CLI using its verified original npm/pnpm installation, then refreshes current-project and global managed resources with the new CLI. An already-current CLI still refreshes resources. Unknown/local development sources and shared pnpm groups are refused. Temporary npx runs must already be latest and cannot uninstall themselves.

`bec uninstall` / `bec remove` removes the CLI and retains resources. Add `--purge` to clean this product's discovered resources first. Noninteractive uninstall requires `--yes/-y`. Modified resources remain protected; a cleanup error retains the CLI.

`bec runtime update|upgrade [runtime]` uses the installed package content; omit runtime to refresh discovered local and global installations. `bec runtime uninstall|remove [runtime]` removes discovered manifest-owned resources; `--force` permits removal of modified product-owned files, never another product's resources. Filter with `--local` or `--global`. Updates preserve each installation's language unless overridden. `--all` supports bulk operations.

Use `--dry-run` to preview resource changes and self-management without mutation. CLI update may query its registry during preview. `list` enumerates supported runtimes; `matrix` describes capabilities; `doctor [runtime]` defaults to Claude. `doctor claude --fix-cache [--dry-run]` only considers this product's stale Claude cache, protects current installs and refuses deletion without reliable native metadata. CLI and native Marketplace sources remain mutually exclusive. `sync-metadata --check` checks metadata consistency without editing it.

`validate` and `runtime list` are backend CLI commands. For commands with JSON output, stdout contains a single JSON value and diagnostics go to stderr.

## Project inspection

From a mixed project’s root, run the following commands. The first returns project-level recommendations. The second adds an IPC task and a path relative to the project root. Use an existing path in your project.

```bash
fec project inspect . --json
fec project inspect . --task-path apps/desktop/src-tauri/src/lib.rs --task-kind ipc --json
```

Inspection reads project evidence and recommends skills available in the product. It evaluates application roles, languages and frameworks separately. The command runs without building the project or installing tools.

## Coordinated common upgrade

The shared resource ledger still requires an exact common version, language and digest. Existing 2.0.0 consumers must exit using their old product CLIs before matching 2.1.0 product builds install resources. Updating only one product can therefore leave its new CLI ready while resource refresh reports a compatibility conflict; follow the existing common migration procedure and retry. Do not use force to take over another consumer.
