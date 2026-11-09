---
practiceCards:
  - id: "cc-c-project-standard:allocation-size"
    level: "required"
    sourceIds: ["cert-c","ms-sal"]
    caseIds: ["EP-C-01"]
    evidence: "case"
  - id: "cc-c-project-standard:partial-cleanup"
    level: "required"
    sourceIds: ["cert-c"]
    caseIds: ["EP-C-01"]
    evidence: "case"
  - id: "cc-c-project-standard:c-abi"
    level: "required"
    sourceIds: ["cert-c","ms-sal"]
    caseIds: ["EP-C-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-c-project-standard:allocation-size"></a>
## Check sizes before allocation and conversion

Level: required

### Risk
Defined unsigned wrap can still allocate a buffer smaller than the promised payload.

### Applies
For count/size arithmetic at C allocation and foreign-input boundaries; a valid pointer’s accessibility remains a caller/API precondition.

### Decision
Define byte/element units and zero behavior; reject invalid signed input before conversion, guard multiplication/addition before allocation, and initialize valid output slots on failure.

### Exceptions
SAL can express supported MSVC contracts but is not a portable requirement. Pure C stays pure C; do not add C++ machinery to express a size check.

### Examples
Better: count > SIZE_MAX / width is rejected before allocation. Worse: multiply first, then trust the wrapped total or a type cast.

### Verification
The local test observes zero allocations for overflow, invalid outputs and a successful payload; add target-width/alignment checks where the ABI needs them.

### Sources
cert-c, ms-sal — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-C-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-c-project-standard:partial-cleanup"></a>
## Acquisition order defines cleanup responsibility

Level: required

### Risk
A second allocation failure can leak the first; shared cleanup can free borrowed input.

### Applies
For functions acquiring multiple resources or transferring an output; no need for a custom framework around a pure scalar function.

### Decision
Initialize local ownership state, use one auditable cleanup discipline, and release only successfully acquired resources with their matching allocator. Transfer output ownership only after complete success.

### Exceptions
A documented externally retained resource needs an explicit owner and lifetime. Returning an error does not itself clean earlier acquisitions.

### Examples
Better: second allocation fails and first header is released. Worse: only the success path reaches free or caller buffers join the cleanup list.

### Verification
Inject each acquisition failure and inspect live allocations/output state. Always-active checks must survive NDEBUG; stable counters complement later sanitizer runs.

### Sources
cert-c — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-C-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-c-project-standard:c-abi"></a>
## Document caller validity and allocator pairs

Level: required

### Risk
A non-null foreign pointer proves neither length nor ownership; cross-module frees may use a different allocator.

### Applies
For C headers, plugin boundaries and native APIs; no C++ migration is implied.

### Decision
Keep ABI-compatible widths/layout/calling convention and documented borrow duration. Expose the matching release function/context for owned outputs, and keep errors/output states stable.

### Exceptions
An annotation or null check cannot prove arbitrary memory validity. SAL is conditional on supported analysis; use portable documentation/checks elsewhere.

### Examples
Better: caller retains borrowed storage, plugin releases its own allocation through its exported pair. Worse: host free is used on every non-null returned pointer.

### Verification
Use an actual C consumer, platform/layout checks and failure injection as appropriate. The local allocation sample is not cross-DLL ABI validation.

### Sources
cert-c, ms-sal — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-C-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
