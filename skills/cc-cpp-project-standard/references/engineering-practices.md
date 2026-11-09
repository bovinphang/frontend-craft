---
practiceCards:
  - id: "cc-cpp-project-standard:raii-borrowing"
    level: "required"
    sourceIds: ["cpp-core"]
    caseIds: ["EP-CPP-01"]
    evidence: "case"
  - id: "cc-cpp-project-standard:exception-abi"
    level: "conditional"
    sourceIds: ["cpp-core","google-cpp","cert-c"]
    caseIds: ["EP-CPP-01","EP-C-01"]
    evidence: "review-only"
  - id: "cc-cpp-project-standard:teardown-lifetime"
    level: "conditional"
    sourceIds: ["cpp-core","cert-c"]
    caseIds: ["EP-CPP-01","EP-IPC-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-cpp-project-standard:raii-borrowing"></a>
## RAII owns acquired resources, not every pointer

Level: required

### Risk
Wrapping a borrowed pointer with a default owning deleter can free someone else’s object.

### Applies
For C++ ownership-facing APIs, constructors and error paths; distinguish own, borrow and shared lifetime first.

### Decision
Use RAII for resources this unit acquires; preserve a non-owning representation for borrowed values. unique_ptr expresses exclusive ownership, shared_ptr needs a real shared-lifetime contract.

### Exceptions
A custom owner must match its allocator/deleter. Smart pointers do not make a dangling borrow safe or remove external lifetime preconditions.

### Examples
Better: local unique_ptr owns a newly acquired lease while the input remains borrowed. Worse: make shared_ptr from every raw input pointer.

### Verification
Run local borrow/partial-construction assertions. The defective test uses a heap-owned caller object and guards against a second delete, not an unstable UB crash.

### Sources
cpp-core — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-CPP-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-cpp-project-standard:exception-abi"></a>
## Respect the owning project exception and ABI policy

Level: conditional

### Risk
Enabling exceptions globally or unwinding across a foreign ABI can break a valid existing contract.

### Applies
When exceptions or FFI boundaries actually exist; Google and other projects intentionally choose different policies.

### Decision
Read compiler flags and boundary contracts first. In exception-enabled code make partial construction exception-safe; with disabled exceptions use the existing explicit-failure path. Keep C ABI failure/output contracts stable.

### Exceptions
noexcept is not a converter from throwing allocation to error codes. The local exception-enabled example is one isolated target, not authority to change user flags or standards.

### Examples
Better: preserve the project’s error policy and allocator cleanup. Worse: enable exceptions or migrate C just because a guideline prefers a pattern.

### Verification
Compile with the actual project policy and test failure translation/cleanup. The sample proves its own C++ boundary only; no cross-ABI unwind has been verified.

### Sources
cpp-core, google-cpp, cert-c — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-CPP-01, EP-C-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-cpp-project-standard:teardown-lifetime"></a>
## Stop users before releasing shared dependencies

Level: conditional

### Risk
A callback can outlive a native object or plugin code even after one owner resets its handle.

### Applies
For concurrent callbacks, native plugins and desktop shutdown; a sequential local RAII scope need not acquire a scheduler.

### Decision
Stop new calls, cancel/drain owned work and observe completion before releasing buffers, callback targets or unloading code. Name the owner of each join and final release.

### Exceptions
Reference counting protects only correctly modeled ownership; it does not prevent every dangling alias or prove callback quiescence. Forced shutdown needs an explicit incomplete-state policy.

### Examples
Better: confirm callbacks have ended before unloading a plugin. Worse: reset one shared_ptr and assume all borrowed pointers are invalidated safely.

### Verification
Use controlled teardown interleavings and actual native tools; local partial-construction tests do not establish race freedom, GUI exit or code-unload safety.

### Sources
cpp-core, cert-c — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-CPP-01, EP-IPC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
