---
practiceCards:
  - id: "fec-data-fetching:mutation-retry"
    level: "conditional"
    sourceIds: ["aws-idempotency","aws-retry"]
    caseIds: ["EP-UI-01","EP-SVC-01"]
    evidence: "review-only"
  - id: "fec-data-fetching:query-order"
    level: "required"
    sourceIds: ["react-effects","vue-watchers"]
    caseIds: ["EP-UI-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="fec-data-fetching:mutation-retry"></a>
## Mutation recovery follows commit semantics

Level: conditional

### Risk
Query defaults copied to mutations can repeat effects or create optimistic state that cannot be reconciled.

### Applies
When configuring mutation/query retries or optimistic recovery; read the installed library’s real defaults.

### Decision
Configure reads and writes deliberately; safe write replay needs a stable intent/key and matching server contract. Invalidate/refetch or reconcile authoritative state after uncertain outcomes instead of inventing a rollback.

### Exceptions
Cancellation of a waiter does not mean server rollback. Avoid layered request/hook retries and retry budgets that multiply.

### Examples
Better: a timed-out mutation remains pending confirmation until reconciled. Worse: every failed mutation is blindly replayed with a fresh key.

### Verification
Control post-commit failure and retry/cancel paths in the owning query layer. No default count or cross-system guarantee is inferred from the related sample.

### Sources
aws-idempotency, aws-retry — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01, EP-SVC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="fec-data-fetching:query-order"></a>
## Identity belongs to a logical query and its consumers

Level: required

### Risk
An incomplete key can mix filters/principals; a global cancellation can disrupt unrelated subscribers.

### Applies
For cached server state and latest-result views, not ordinary local form state.

### Decision
Include the logical inputs and permitted scope in the query identity, keep secrets out of keys, and publish only to matching active consumers. Unsubscribe rather than freeing work another consumer owns.

### Exceptions
Use the existing cache/query ownership model; do not duplicate server state in a second global store or replace it with a one-size-fits-all request counter.

### Examples
Better: filterB remains current when filterA completes late. Worse: one component unmount aborts every shared query.

### Verification
Exercise changed-key ordering, errors, multiple subscribers and logout/scope transitions where applicable. The React sample covers its own current view only.

### Sources
react-effects, vue-watchers — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
