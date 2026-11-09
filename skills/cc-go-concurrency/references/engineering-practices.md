---
practiceCards:
  - id: "cc-go-concurrency:shutdown-wait"
    level: "required"
    sourceIds: ["go-context","uber-go"]
    caseIds: ["EP-GO-01"]
    evidence: "review-only"
  - id: "cc-go-concurrency:channel-ownership"
    level: "conditional"
    sourceIds: ["uber-go","go-context"]
    caseIds: ["EP-GO-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-go-concurrency:shutdown-wait"></a>
## Shutdown includes confirmation of worker exit

Level: required

### Risk
Cancel-and-return can release files while goroutines still access them.

### Applies
For goroutines this component starts in any application role; borrowed workers stay with their declared owner.

### Decision
Keep completion accounting, stop admission, propagate cancellation at blocking points and wait before releasing shared resources. Define an explicit deadline and incomplete outcome.

### Exceptions
A buffered channel may change capacity, not ownership or termination. Fire-and-forget requires an application lifetime owner and bounded error reporting.

### Examples
Better: the local pipeline observes both workers exiting. Worse: cancel is called and a successful shutdown is reported immediately.

### Verification
Use start/finish events and saturation, early-consumer-exit and repeated-stop cases. The local watchdog is a failure bound; race checking is additional.

### Sources
go-context, uber-go — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-GO-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-go-concurrency:channel-ownership"></a>
## Closing is a protocol owned by the sender side

Level: conditional

### Risk
Concurrent send and close can panic even when individual accesses look guarded.

### Applies
When consumers depend on channel closure or multiple producers share a channel.

### Decision
Assign one closing coordinator, confirm all sends ended before close, and define receiver behavior. Cancellation and completion must unblock both directions without a recover-based disguise.

### Exceptions
Not every channel needs closing; if completion is signaled elsewhere and nobody ranges until close, preserve that protocol. Channel capacity is not a universal correctness rule.

### Examples
Better: producer coordinator waits then closes once. Worse: each receiver closes the shared channel on cancellation.

### Verification
Arrange competing send/close and receiver-exit events deterministically; separately run supported race checks. The pipeline case validates cancellation, not every closing topology.

### Sources
uber-go, go-context — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-GO-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
