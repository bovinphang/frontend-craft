---
practiceCards:
  - id: "cc-electron-project-standard:ipc-trust"
    level: "required"
    sourceIds: ["electron-security"]
    caseIds: ["EP-IPC-01"]
    evidence: "case"
  - id: "cc-electron-project-standard:cancellation-cleanup"
    level: "conditional"
    sourceIds: ["electron-security","aws-idempotency"]
    caseIds: ["EP-IPC-01"]
    evidence: "case"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-electron-project-standard:ipc-trust"></a>
## Trust the main-owned operation boundary

Level: required

### Risk
A renderer-supplied role/channel or origin-only check can expose privileged work.

### Applies
For actual main/preload/renderer authority; follow the installed Electron version.

### Decision
Expose a single operation through a narrow bridge; verify WebContents identity, main-frame identity and exact trusted document, then validate bounded input before effects.

### Exceptions
file URLs need more than a generic origin check. A valid sender still needs operation authorization; synthetic role headers are not identity.

### Examples
Better: main validates one set-title operation. Worse: preload exposes ipcRenderer or arbitrary filesystem calls.

### Verification
Run the handler’s valid/denied input tests and existing wiring checks. These do not activate sandbox/isolation or run an Electron GUI.

### Sources
electron-security — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-IPC-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-electron-project-standard:cancellation-cleanup"></a>
## Recheck ownership after async preparation

Level: conditional

### Risk
A once-valid sender may close or lose trust before a delayed operation commits.

### Applies
When an IPC handler awaits non-privileged preparation before a synchronous privileged effect.

### Decision
Own abort/listener cleanup, recheck liveness, cancellation and sender trust after await, and only then commit. Tie handler removal/close to the real window lifecycle.

### Exceptions
Abort cannot undo an already committed external write. Async commit, native workers and concurrent ordering need their own contracts; the sample does not claim them.

### Examples
Better: late preparation after close/cancel produces no commit effect. Worse: validation at entry is the only check and a closed window still changes privileged state.

### Verification
Run the deferred-promise close/cancel/valid/denied cases. Test actual process/GUI/signed packaging separately; do not label Node handler tests as those checks.

### Sources
electron-security, aws-idempotency — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-IPC-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.
