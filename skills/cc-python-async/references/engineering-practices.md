---
practiceCards:
  - id: "cc-python-async:cancellation"
    level: "conditional"
    sourceIds: ["python-asyncio","google-python"]
    caseIds: ["EP-PY-01"]
    evidence: "review-only"
  - id: "cc-python-async:blocking-io"
    level: "conditional"
    sourceIds: ["python-asyncio"]
    caseIds: ["EP-PY-01","EP-GO-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-python-async:cancellation"></a>
## Cleanup preserves cancellation semantics

Level: conditional

### Risk
Broad exception recovery can swallow cancellation or free a resource still used by underlying work.

### Applies
For event-loop tasks the unit owns; a synchronous library need not become asyncio-based.

### Decision
Keep task ownership and finally/async cleanup explicit, propagate cancellation after appropriate cleanup and await completion of owned tasks. Match TaskGroup/timeout APIs to the supported interpreter.

### Exceptions
Cancelling an awaiter does not stop every thread or I/O operation. Use an explicit incomplete outcome where the underlying work cannot be stopped safely.

### Examples
Better: stop new work and await cleanup under the actual runtime policy. Worse: return a success fallback from cancelled initialization.

### Verification
Use controllable await points and real loop execution; the synchronous Python resource case does not establish async cancellation behavior.

### Sources
python-asyncio, google-python — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-PY-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-python-async:blocking-io"></a>
## Offload blocking work without losing its owner

Level: conditional

### Risk
An executor hides loop blocking but can create unbounded work or premature slot release.

### Applies
When measured/known blocking clients run in an async path.

### Decision
Use the project’s existing async client or bounded executor, limit queued and active work, and keep resource/slot ownership until the underlying operation actually ends.

### Exceptions
Do not add an executor to pure non-blocking code. Cancelling a future is not proof a running thread stopped; shutdown policy must account for that.

### Examples
Better: a worker releases its own connection and capacity after completion. Worse: the cancelled waiter immediately returns a pool slot still in use.

### Verification
Inject blocking completion and cancellation with events, observing task/slot counts and shutdown. Profiling and real driver behavior need separate evidence.

### Sources
python-asyncio — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-PY-01, EP-GO-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
