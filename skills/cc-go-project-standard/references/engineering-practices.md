---
practiceCards:
  - id: "cc-go-project-standard:package-interfaces"
    level: "recommended"
    sourceIds: ["uber-go"]
    caseIds: ["EP-GO-01"]
    evidence: "review-only"
  - id: "cc-go-project-standard:error-boundaries"
    level: "required"
    sourceIds: ["uber-go","aws-idempotency"]
    caseIds: ["EP-GO-01","EP-SVC-01"]
    evidence: "review-only"
  - id: "cc-go-project-standard:context-ownership"
    level: "conditional"
    sourceIds: ["go-context","uber-go"]
    caseIds: ["EP-GO-01"]
    evidence: "case"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-go-project-standard:package-interfaces"></a>
## Define dependencies where they are consumed

Level: recommended

### Risk
A large provider interface couples callers to unrelated operations.

### Applies
When a package consumes replaceable behavior; small concrete internal values do not need an interface automatically.

### Decision
Locate nearest go.mod/go.work, keep import paths stable and inject the narrow behavior the consumer uses. Construct long-lived dependencies at an explicit composition entry.

### Exceptions
Keep an existing well-bounded interface if changing it brings no task benefit. Do not introduce an Uber dependency or root go get because a style guide uses one.

### Examples
Better: a library accepts its needed reader. Worse: give every type a mirror interface or require HTTP layers for a desktop module.

### Verification
Compile/test the changed module and an actual consuming package; inspect exported compatibility separately from worker-lifetime evidence.

### Sources
uber-go — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-GO-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-go-project-standard:error-boundaries"></a>
## Errors retain identity and operation context

Level: required

### Risk
String-only errors and blind retries can hide a partially committed effect.

### Applies
For errors crossing package or transport boundaries; avoid wrapping every internal line without useful context.

### Decision
Use the current error taxonomy, errors.Is/As and appropriate wrapping to preserve identity; translate at the owning boundary and redact diagnostics. Distinguish cancellation and uncertain commit.

### Exceptions
Do not promise exactly-once from an error type. A write retry needs stable intent and a server-side idempotency contract, not just a retryable status.

### Examples
Better: caller can detect the original failure and reconcile an unknown commit. Worse: log-and-ignore then return nil.

### Verification
Inject a failure and inspect caller-visible cause/state; HTTP replay is covered by a separate service case, not the pipeline test.

### Sources
uber-go, aws-idempotency — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-GO-01, EP-SVC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-go-project-standard:context-ownership"></a>
## Propagate cancellation and wait for owned work

Level: conditional

### Risk
A blocked send/receive can survive cancel; cancellation alone is not joining.

### Applies
For blocking I/O or goroutines this unit owns, across library/CLI/desktop/service roles.

### Decision
Pass context through cancellable calls, select cancellation at blocking channel boundaries and retain a completion/wait mechanism. The creator owns cancel and joining its workers.

### Exceptions
A deliberate app-lifetime task needs its own explicit owner; do not retain a request context globally or close a channel from arbitrary receivers.

### Examples
Better: stop admission, cancel and wait for both workers. Worse: increase channel capacity to hide an abandoned goroutine.

### Verification
Use the local event-driven test; its watchdog bounds a missing completion, not a sleep-based ordering assumption. Race/all-schedule coverage remains separate.

### Sources
go-context, uber-go — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-GO-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.
