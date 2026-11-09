---
practiceCards:
  - id: "cc-tauri-project-standard:ipc-validation"
    level: "required"
    sourceIds: ["tauri-permissions"]
    caseIds: ["EP-TS-01","EP-IPC-01"]
    evidence: "review-only"
  - id: "cc-tauri-project-standard:cancellation-cleanup"
    level: "conditional"
    sourceIds: ["tokio-join","tauri-permissions"]
    caseIds: ["EP-RS-01","EP-IPC-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-tauri-project-standard:ipc-validation"></a>
## Command registration does not grant safe authority

Level: required

### Risk
A capability file can exist while the selected command/window grants remain wrong.

### Applies
For actual Tauri2 commands/plugins; inspect the installed minor and selected app configuration.

### Decision
Check invoke registration, generated app-command permissions, selected/overlapping capabilities, window labels and allowed remote origins. Validate bounded typed input and business permission in Rust before effects.

### Exceptions
The app owns trusted roots/paths, not the renderer. Canonicalize-then-open alone does not defeat adversarial ancestor replacement. Do not transplant Electron APIs.

### Examples
Better: one scoped command validates paths under an application-owned root. Worse: renderer supplies an unrestricted root and registration is treated as authorization.

### Verification
Run the existing Rust core tests and inspect actual generated/configured grants; runtime permission activation and GUI remain separate NOT RUN evidence.

### Sources
tauri-permissions — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-TS-01, EP-IPC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-tauri-project-standard:cancellation-cleanup"></a>
## Window shutdown coordinates core tasks and resources

Level: conditional

### Risk
A closed window can leave Rust work or sidecar resources active.

### Applies
When commands spawn work or retain files/pools/sidecars beyond invocation.

### Decision
Name the app/core task owner, stop admission, request cancel/drain and await completion before releasing dependencies. Keep blocking work and guards outside UI-critical suspension where possible.

### Exceptions
Caller cancellation may not stop a native write; represent incomplete/partially committed work explicitly. Do not force a runtime/dependency upgrade.

### Examples
Better: core reports completed or incomplete shutdown to the app. Worse: dropping a UI waiter is treated as proof all native work stopped.

### Verification
Use actual core/runtime event tests and target-specific process checks. Existing path tests and Node IPC evidence do not prove Tauri shutdown or signed bundles.

### Sources
tokio-join, tauri-permissions — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-RS-01, EP-IPC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
