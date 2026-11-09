---
practiceCards:
  - id: "fec-api-integration:retry-safety"
    level: "conditional"
    sourceIds: ["aws-retry","aws-idempotency"]
    caseIds: ["EP-UI-01","EP-SVC-01"]
    evidence: "review-only"
  - id: "fec-api-integration:consumer-contract"
    level: "required"
    sourceIds: ["typescript-publishing","google-review"]
    caseIds: ["EP-TS-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="fec-api-integration:retry-safety"></a>
## A retryable failure is not permission to repeat a write

Level: conditional

### Risk
Timeout, network failure or5xx can follow an already committed write.

### Applies
Where the client owns retries or recovery; inspect actual operation semantics and current library configuration.

### Decision
Separate reads from side effects, preserve one intent/key across allowed retries, and require a server-side idempotency/reconciliation contract. Bound attempts, total time and cancellation at one layer; honor Retry-After only within safe replay.

### Exceptions
Without that contract, retain pending confirmation and offer status/reconciliation or support. A disabled button, new key or abort signal is not a server-side guarantee.

### Examples
Better: same key/intent retrieves the committed result. Worse: any429/5xx/network error automatically retries payment three times.

### Verification
Inject post-commit response failure, intent mismatch and bounded recovery. The service case proves a local HTTP contract, not a distributed payment guarantee.

### Sources
aws-retry, aws-idempotency — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01, EP-SVC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="fec-api-integration:consumer-contract"></a>
## Validate and map at the real API boundary

Level: required

### Risk
Generated types or a response cast can conceal invalid payloads and ambiguous empty/error states.

### Applies
For frontend API clients and domain adapters, not a mandate to redesign backend endpoints.

### Decision
Establish request/response, status, empty-body, units and compatibility behavior with the actual contract. Validate unknown values then map protocol data into domain/UI state using existing tools.

### Exceptions
Do not force a new generator or validation package. Communicate missing behavior/permission needs before assuming server implementation or field names.

### Examples
Better: invalid data fails before a domain effect and the UI can recover. Worse: requestJson<T> alone is treated as runtime validation.

### Verification
Run the existing client/consumer checks for malformed, empty, valid and failure results; generic TS input evidence does not cover every HTTP protocol.

### Sources
typescript-publishing, google-review — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-TS-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
