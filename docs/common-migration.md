# Common capability migration in frontend-craft3.0

The exact common dependency is`@bovinphang/craft-common@2.0.0`: a final version number prepared but not published. Frontend3.0.0 and backend 1.0.0 remain unreleased with unchanged product versions. Paths, explicit planning sessions, ownership, locks and recovery are shared; products retain conversion and their CLI/native-channel policies.

Version 3.0 delivers 53 frontend and 21 common entries, 74 in total. Version 2.0.0 retains 1.0.1 recovery repairs. Do not mix 1.x or development snapshots with 2.0.0: exit all old shared consumers using the old product CLIs and resolve retained edits before installing matching products. Public installation awaits actual common/product publication and the existing supply-chain policy window.

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

## 2026-11-08 coordinated2.0.0 upgrade / 当前协调升级

Current source: common 2.0.0 (release prepared, unpublished), frontend 3.0.0/backend 1.0.0 (unchanged, unreleased). 2.0.0同样要求版本、语言和摘要一致；不自动升级另一个产品。

1. Back up user edits and inspect local/global/runtime identity. 备份修改，确认安装范围。
2. With each OLD product CLI, uninstall its runtime resources and resolve preserved edits until both old common consumers exit. 使用各旧 CLI 退出旧公共引用，不用新 CLI 越权接管。
3. Install both matching product builds using verified artifacts; public clean install must wait for common publication. 安装新匹配产品前执行 runtime check-migration。
4. Managed unchanged legacy language entries retire in the same transaction as new cc deployment. Unknown files, edits, links or invalid ownership block the whole install; dry-run writes nothing. 原领域入口不建立假别名。

Rename: fec-typescript-project-standard → cc-typescript-project-standard; bec-{rust,go,java,python,c,cpp}-project-standard → cc-*-project-standard; bec-{rust-async,go-concurrency,python-async,java-runtime,native-memory-safety} → cc-* equivalents. Frontend retains its earlier drawio/source-driven rename policy.

Checks return 0 (nothing found), 1 (reviewable references/owned retired entries), 2 (invalid arguments, scan failure or retirement conflict). Reports show paths, IDs and line numbers, never full source lines. No-Skill hosts receive reference material rather than a fabricated native Skill alias. 双原生产品去重仍不在保证范围。

<!-- engineering-practices-20261108 -->

本轮2.0.0包含工程实践内容，仍要求两产品版本、语言和内容摘要精确一致。新内容不放宽旧消费者冲突；退出旧引用并处理保留编辑后，再安装两份匹配产品。Cline/Trae/Copilot的私有reference-skills包含新增三公共资源与本地卡，不宣称原生Skill支持，也不登记common consumer。
