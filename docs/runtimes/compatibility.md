# Runtime compatibility and upgrades

The adapters install different capability subsets. Run `fec matrix` for the project-level inventory and read the runtime-specific page for global differences. A successful install or doctor result proves the expected artifacts exist, not that every host feature is integrated or a particular release was tested interactively.

## CLI 3.0 command migration

Use `fec runtime install/update/uninstall [runtime]` for managed resources, including npx examples (`npx @bovinphang/frontend-craft@latest runtime update`). Resource flags and the `runtime upgrade/remove` aliases remain available; `setup` remains supported and top-level `install` is deprecated.

Top-level `fec update/upgrade` now upgrades a verified npm/pnpm global CLI to registry `latest`, then refreshes resources in the current project and user-global scope with the new version. Top-level `fec uninstall/remove` removes only the CLI; `--purge` first cleans managed resources while preserving user edits. It requires terminal confirmation or non-interactive `--yes`. `--dry-run` is read-only. Old runtime arguments and resource flags on these top-level commands are rejected before changes.

`runtime update` uses the running CLI package without fetching a new one. Temporary npx runs never create a global install and cannot self-uninstall; use the latest-package runtime command when an npx update reports a version mismatch. CLI upgrade failure stops refresh; partial resource failure is reported without CLI rollback. Other projects and Marketplace installs are not scanned or managed. Source links, project dependencies, unknown sources and pnpm groups shared with other packages are refused for automatic self-management.

## Updating existing installations

Use `fec runtime update <runtime> --local` or `--global` with the new CLI. Updates preserve manifest-tracked files changed by the user. Fresh installs retain existing Codex configuration and context files. Merge any missing rule imports into existing Gemini context files manually.

Unchanged manifest-owned legacy command paths are retired when replacements are installed for OpenCode, Kilo, Copilot, Gemini, OpenClaw and global Windsurf. Unknown or edited old files are preserved. Files that remain in old directories stay tracked for a later uninstall. Claude CLI hooks now live in settings.json; the original native Marketplace packaging stays unchanged.

Antigravity and Cline global defaults changed. Run `fec setup antigravity --global` / `fec setup cline --global` to copy manifest-tracked files to the current destination before updating; user edits and old originals are preserved. `fec runtime update --global` also discovers these legacy installations. For product-specific or redirected directories, use the documented runtime configuration-directory environment variable. It is an installer override; configure the host consistently too.

Shared Claude/Qoder settings are never owned as a whole file. The manifest records installed hook entries, so uninstall removes only exact matching entries and preserves other settings. A user-modified hook entry is preserved; remove it manually if it still refers to a script you uninstall. Malformed settings stop the operation rather than being replaced. Keep the install manifest for safe updates and uninstall.

## Scope differences

- Copilot project installs provide IDE prompt files and path-specific instructions. Global installs provide CLI user instructions, not IDE global prompts.
- Kilo targets the current CLI discovery contract. Antigravity defaults to its IDE/2.0 global directory; its CLI uses a different override.
- OpenClaw project installs require the agent workspace as the working directory. Native plugin packaging is separate from the universal installer.
- Cursor, Augment and CodeBuddy keep their existing supported capability subsets. New host features are not automatically installed.
- Codex agents inherit the selected model and reasoning effort. Older manually edited TOML files remain untouched by update; remove their model overrides yourself if you want inheritance.

## Verification

Regression tests exercise artifact discovery paths, metadata, existing settings, repeated installation and uninstall behavior. `pnpm test` runs the package's build, type checks and test suite. `pnpm run typecheck:openclaw` and `pnpm run pack:openclaw` verify the separate native package. Full host-session tests require the corresponding installed product and account.

Review scope and diagram delivery rules are shared across adapters; installed artifacts do not guarantee that local Mermaid or a Chromium browser is available. See [review scope and technical diagram delivery](../review-and-diagram-workflows.md).
# 3.0 公共能力说明

公共 Skill 使用 `cc-*`，由固定版本的 craft-common 随产品提供。CLI 按实际 Skill 目录记录公共所有权，而不是按配置目录猜测：Codex 使用项目或用户目录下的 `.agents/skills`；OpenClaw 本地使用项目 `skills`；其他支持标准 Skill 的适配器使用其现有 Skill 目标。

同一真实目标的消费者必须使用一致的公共版本、语言与内容摘要。公共账本位于目标父目录的 `craft-manifests/<目标摘要>/`；产品清单保存依赖指针并继续独立管理 `fec-*` 文件。卸载一个产品保留其他消费者引用，最后退出时也只回收未修改的公共文件。`doctor` 的 `common` 行检查公共依赖和资源状态。

Copilot、Trae、Cline 延续现有规则/命令降级，不宣称新增标准 Skill 支持。原生插件渠道本期保证单产品快照完整，双产品原生去重需另外验证。迁移步骤见 [迁移指南](../common-migration.md)。
