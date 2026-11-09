---
practiceCards:
  - id: "cc-rust-project-standard:ownership-api"
    level: "required"
    sourceIds: ["rust-api","cpp-core"]
    caseIds: ["EP-RS-01"]
    evidence: "review-only"
  - id: "cc-rust-project-standard:result-boundaries"
    level: "required"
    sourceIds: ["rust-api"]
    caseIds: ["EP-RS-01"]
    evidence: "case"
  - id: "cc-rust-project-standard:unsafe-ffi"
    level: "conditional"
    sourceIds: ["rust-api","cert-c"]
    caseIds: ["EP-RS-01","EP-C-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-rust-project-standard:ownership-api"></a>
## Borrow before inventing shared ownership

Level: required

### Risk
Cloning ownership can conceal a resource that outlives its caller.

### Applies
For crate public APIs, native libraries and desktop cores; no service layering is required.

### Decision
State who owns each handle, how long a borrow lasts and whether transfer occurs. Choose a borrow when the caller retains ownership; Arc requires a real shared-lifetime need.

### Exceptions
Clone owned data when isolation is intentional; this is a cost/contract choice, not a blanket cloning ban. Preserve edition/MSRV.

### Examples
Better: borrow input and own a newly acquired lease. Worse: Arc is used as a substitute for shutdown coordination.

### Verification
Review public signatures and transfer/borrow examples. Local Drop tests do not establish every alias or async interaction.

### Sources
rust-api, cpp-core — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-RS-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-rust-project-standard:result-boundaries"></a>
## Result preserves cause and cleanup

Level: required

### Risk
Erasing the cause or forgetting a resource on Err hides a failed operation.

### Applies
For fallible library/API work; a documented impossible invariant may use a project-approved assertion.

### Decision
Return the project Result taxonomy, preserve Error::source and let RAII cover early returns. Map errors at the application edge rather than printing secrets inside a crate.

### Exceptions
unwrap in a controlled test is distinct from untrusted runtime input; no reason to replace every test assertion.

### Examples
Better: Err retains the I/O cause and drops the lease. Worse: mem::forget on the failure path or empty successful recovery.

### Verification
Run the same two cargo tests with defect=1/0, checking cause and Drop count; use offline/locked preparation separately.

### Sources
rust-api — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-RS-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-rust-project-standard:unsafe-ffi"></a>
## Unsafe and FFI require explicit validity contracts

Level: conditional

### Risk
Rust types cannot prove a foreign pointer’s length, lifetime or allocator.

### Applies
Only when actual unsafe/FFI/native boundaries exist; safe Rust need not acquire unsafe wrappers.

### Decision
Document pointer validity, alignment, length, ownership and panic policy, then keep unsafe operations small behind checked interfaces. Match allocator and release owner.

### Exceptions
Do not adopt newer unsafe attributes or ABI assumptions without the current edition/toolchain facts. A catch boundary must respect unwind/abort policy.

### Examples
Better: validate a borrowed foreign buffer and leave release to its owner. Worse: construct ownership from any non-null pointer.

### Verification
Review safety preconditions and failure/teardown tests using actual native tooling. The safe Rust sample does not validate unsafe soundness.

### Sources
rust-api, cert-c — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-RS-01, EP-C-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
