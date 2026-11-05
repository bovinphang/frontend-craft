# Common capability migration in frontend-craft 3.0

The 3.x series has not been released. Version 3.0 uses `cc-*` common entries immediately. The exact `@bovinphang/craft-common@1.0.0` dependency is delivered with the product; users do not install a third plugin manually.

| Previous entry | Version 3.0 |
| --- | --- |
| fec-drawio-studio | cc-drawio-studio |
| fec-source-driven-development | cc-source-driven-development; frontend domain rule filenames retain their fec names |
| fec-image-generation | cc-technical-diagrams for technical diagrams; keep the frontend entry for UI/product imagery and editing |
| fec-doc-sync | Keep frontend documentation workflow; use cc-doc-sync-core for the shared method |
| fec-debug-framework | Keep frontend diagnosis; use cc-debug-methodology for the shared method |
| fec-refactoring | Keep frontend refactoring and its subsystem; use cc-refactoring-core for the shared method |
| fec-tdd-workflow | Keep frontend test selection; use cc-tdd-methodology for the shared method |

Run the read-only check before updating references:

```sh
fec runtime check-migration codex --local
fec runtime check-migration codex --local --json
fec runtime check-migration codex --global --json
```

Omit the runtime to inspect all supported runtimes. Exit codes: 0 no pending items; 1 references or legacy installations need review; 2 argument, read or manifest errors. Checks never rewrite user files or echo complete matching lines. Secrets, dependencies, build outputs, binary files and symlinks are excluded; text files larger than 2 MiB are skipped. Global checks inspect managed files and legacy common skill directories, not the whole home directory.

Text findings are suggestions. Migration tables, historical records and same-named domain rules may legitimately retain old names. Frontend entries that remain supported are not mechanically renamed; split suggestions depend on same-line task context and require review.

Then install or refresh runtime resources:

```sh
fec runtime install codex --local
fec runtime update codex --local
```

An unchanged legacy common entry owned by the old frontend manifest is retired in the same transaction as the new installation. Modified, unknown, symlinked or unowned legacy entries block migration. Back up and review customizations, then manually integrate or move the legacy entry before retrying; never clear an entire runtime directory.

Consumers sharing the same actual skill directory must agree on exact common version, content digest and language. Conflicts fail before writes. Removing one consumer preserves common files used by others. Partial frontend uninstall retains the common reference while modified frontend files remain. The last consumer removes only unchanged owned files; edited files retain their ownership record.

After interruption, rerun with the same product, scope and directories. Recoverable local transactions are repaired; uncertain locks or path boundaries preserve the evidence and fail safely.

The same product manifest path cannot change runtime, local/global scope or common target; uninstall the original identity first. Migration from an old global configuration also checks legacy common files before writing and preserves the original directory. Recovery covers local process interruption, without power-loss durability or multi-host shared-filesystem coordination guarantees.

Dual-consumer CLI installation is verified. Claude/OpenClaw native packages include complete common snapshots; cross-product native-plugin deduplication is outside this release's guarantee. Public registry publication remains a separate release step and is not performed automatically during development.
