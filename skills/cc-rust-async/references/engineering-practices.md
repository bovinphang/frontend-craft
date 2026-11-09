---
practiceCards:
  - id: "cc-rust-async:cancellation"
    level: "conditional"
    sourceIds: ["tokio-join","rust-api"]
    caseIds: ["EP-RS-01","EP-GO-01"]
    evidence: "review-only"
  - id: "cc-rust-async:guard-lifetime"
    level: "recommended"
    sourceIds: ["tokio-join","rust-api"]
    caseIds: ["EP-RS-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-rust-async:cancellation"></a>
## A dropped waiter is not a stopped operation

Level: conditional

### Risk
A timeout may detach owned work or leave a partially written stream.

### Applies
For actual async work and the project’s installed runtime; safe synchronous code does not require Tokio.

### Decision
Name the spawn/cancel/join owner, keep handles, bound admission and read the operation’s cancellation-safety contract. Stop admission before drain/cancel and observe completion before freeing dependencies.

### Exceptions
Tokio handle drop detaches; abort is a request and running blocking work may not be stoppable. Preserve partial progress and report incomplete shutdown instead of pretending rollback.

### Examples
Better: await owned task termination and expose partial-write state. Worse: Arc plus a timeout is assumed to make detached work safe.

### Verification
Use controlled futures/events and short-write failure injection in the actual runtime. The safe Result and Go examples are related evidence, not a Rust-async execution claim.

### Sources
tokio-join, rust-api — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-RS-01, EP-GO-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-rust-async:guard-lifetime"></a>
## Keep critical sections and blocking work bounded

Level: recommended

### Risk
A blocking guard across suspension can block progress or hide lock-order deadlocks.

### Applies
When a future owns locks, blocking clients or queue slots; inspect concrete guard/operation types first.

### Decision
Reduce the guarded scope, copy necessary owned state, then await outside the critical section where the contract permits. Put unavoidable blocking work behind the existing bounded runtime boundary.

### Exceptions
Do not replace every mutex with an async mutex blindly. If retaining a guard across await is intentional, prove scheduling/dependency assumptions and test contention.

### Examples
Better: release a short metadata lock before waiting for I/O. Worse: hold it while awaiting another task that needs the same lock.

### Verification
Use deterministic contention/close tests and measured scheduling evidence. No new runtime, edition or MSRV is authorized by this advice.

### Sources
tokio-join, rust-api — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-RS-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
