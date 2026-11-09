---
practiceCards:
  - id: "cc-typescript-project-standard:input-validation"
    level: "required"
    sourceIds: ["google-ts"]
    caseIds: ["EP-TS-01"]
    evidence: "case"
  - id: "cc-typescript-project-standard:async-errors"
    level: "required"
    sourceIds: ["google-ts","aws-idempotency"]
    caseIds: ["EP-TS-01","EP-UI-01"]
    evidence: "review-only"
  - id: "cc-typescript-project-standard:package-contract"
    level: "required"
    sourceIds: ["typescript-publishing","google-ts"]
    caseIds: ["EP-TS-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-typescript-project-standard:input-validation"></a>
## Validate external data before effects

Level: required

### Risk
A cast can move invalid JSON into a trusted domain value.

### Applies
At network, IPC, file or plugin input; internal values with an established invariant need no duplicate schema.

### Decision
Accept unknown, narrow using existing schema/type guards, then map protocol values to domain types before an effect. State amount units, enum handling and failure output.

### Exceptions
A typed/generated client is useful but does not validate a remote response. A deliberately trusted boundary needs documented provenance.

### Examples
Better: reject a string amount with zero effects. Worse: as Payment makes a charge callback accept malformed input.

### Verification
Run the local invalid/success pair; add protocol-specific empty-body/enum tests in the consuming project.

### Sources
google-ts — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-TS-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-typescript-project-standard:async-errors"></a>
## Propagate failure through owned async work

Level: required

### Risk
Floating work and swallowed rejection can publish success too early.

### Applies
For promises and callbacks this unit creates; do not impose a UI hook on a generic library.

### Decision
Return/await the owning promise, preserve unknown error context safely and expose explicit pending/failed/succeeded states. Handle detached work only through an intentional lifecycle owner.

### Exceptions
Abort indicates caller interest ended, not that a remote write rolled back. Reconcile uncertain writes before retry; honor existing error types.

### Examples
Better: pending confirmation after a committed-write timeout. Worse: catch returns an empty success value or silently retries a charge.

### Verification
Inject rejection and late completion in the owning unit. The local TS case covers validation only; UI and service IDs denote separate evidence.

### Sources
google-ts, aws-idempotency — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-TS-01, EP-UI-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-typescript-project-standard:package-contract"></a>
## Verify declarations in the real consumer

Level: required

### Risk
Workspace aliases or undeclared type dependencies can disappear after pack.

### Applies
For libraries/SDKs/CLI exports; ordinary app-only modules need not become published packages.

### Decision
Match exports, types, files and module resolution to declared consumers; test the tarball outside the workspace. Prefer existing strict settings, recording a scoped migration if changing them.

### Exceptions
Google internal namespace/enum/assertion style is conditional. skipLibCheck may be a deliberate dependency policy; it cannot validate your own public boundary. exactOptionalPropertyTypes is separate from strict.

### Examples
Better: a packed consumer resolves its declared type dependencies. Worse: switch every package to a new module mode to imitate a guide.

### Verification
Run the existing type/build and artifact-consumer checks; validation sample evidence alone does not prove declaration compatibility.

### Sources
typescript-publishing, google-ts — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-TS-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
