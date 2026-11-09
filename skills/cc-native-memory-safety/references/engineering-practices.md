---
practiceCards:
  - id: "cc-native-memory-safety:allocator-pairs"
    level: "required"
    sourceIds: ["cert-c","cpp-core"]
    caseIds: ["EP-C-01","EP-CPP-01"]
    evidence: "review-only"
  - id: "cc-native-memory-safety:teardown-races"
    level: "conditional"
    sourceIds: ["cpp-core","cert-c"]
    caseIds: ["EP-CPP-01","EP-IPC-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-native-memory-safety:allocator-pairs"></a>
## Allocation and release form one explicit contract

Level: required

### Risk
Foreign ownership and allocator mismatch can cause corruption despite non-null pointers.

### Applies
For actual C/C++/Rust/native or plugin ownership transfers, not every application variable.

### Decision
Record validity, borrow duration, transfer point and matching allocator/release context. Each early failure releases only what this operation actually acquired.

### Exceptions
A managed wrapper or smart pointer must preserve the native release contract. Do not infer ownership from nullability or destroy caller-borrowed memory.

### Examples
Better: plugin exports the release pair for owned output. Worse: generic host delete is used for every foreign buffer.

### Verification
Use allocation/failure counters and real native consumers. C/C++ sample evidence is scoped; unsafe Rust/FFI, architecture and sanitizer checks remain separate.

### Sources
cert-c, cpp-core — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-C-01, EP-CPP-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-native-memory-safety:teardown-races"></a>
## Release follows confirmed quiescence

Level: conditional

### Risk
Resetting one handle does not end concurrent access through another alias or callback.

### Applies
For callbacks/threads/device buffers that may outlive a native owner.

### Decision
Stop new access, coordinate cancellation/drain, wait for actual users and then release/unload in dependency order. Define repeated-close and failed-shutdown behavior.

### Exceptions
A reference count is not an alias or lifetime proof. A forced exit may abandon work; expose that state rather than marking graceful completion.

### Examples
Better: callback completion is observed before unloading its code. Worse: free a buffer when the waiting coroutine times out while native work continues.

### Verification
Arrange teardown interleavings and failures with events and native tooling; handler/partial-construction cases do not prove all concurrent schedules.

### Sources
cpp-core, cert-c — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-CPP-01, EP-IPC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
