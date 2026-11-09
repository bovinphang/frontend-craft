---
practiceCards:
  - id: "fec-react-project-standard:effect-cleanup"
    level: "required"
    sourceIds: ["react-effects","react-act"]
    caseIds: ["EP-UI-01"]
    evidence: "case"
  - id: "fec-react-project-standard:stale-results"
    level: "conditional"
    sourceIds: ["react-effects","react-act"]
    caseIds: ["EP-UI-01"]
    evidence: "case"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="fec-react-project-standard:effect-cleanup"></a>
## Effects release the resources they actually own

Level: required

### Risk
A removed component can leave requests, listeners or timers active.

### Applies
When the component itself starts an effect. Shared cache/client work retains its own owner; unsubscription is not authority to cancel every consumer.

### Decision
Pair setup with cleanup, forward cancellation to owned work, and make cleanup repeatable. Use actual installed React APIs and the existing component/query boundary.

### Exceptions
A development setup/cleanup cycle is not automatically a production bug. Abort indicates lost interest and cannot undo a committed server write.

### Examples
Better: cleanup aborts this component’s load and removes its listener. Worse: unmount clears a global client still used elsewhere.

### Verification
Run the local real React/DOM unmount test; add actual subscriptions/timers and Strict Mode behavior where the changed component owns them.

### Sources
react-effects, react-act — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="fec-react-project-standard:stale-results"></a>
## Only the current view request may publish its result

Level: conditional

### Risk
A late A success, error or finally can replace B’s current view state.

### Applies
For latest-result views; queued commands with independent outcomes require their own intent contract.

### Decision
Scope request identity/liveness to the owning view or query key and guard every state publication, including errors/loading. Cancellation and identity checks are complementary.

### Exceptions
Do not implement a global counter that invalidates unrelated components. Cancelling a submitted mutation does not establish rollback or permission to replay it.

### Examples
Better: B remains visible after A arrives late. Worse: only the success handler is guarded while old finally clears B’s loading state.

### Verification
The local controlled A/B Promise test renders real React. Add late-error/loading and shared-cache cases in the actual owner; DOM simulation is not browser E2E.

### Sources
react-effects, react-act — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.
