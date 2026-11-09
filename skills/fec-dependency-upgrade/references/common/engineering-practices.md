# Engineering practices

Read project contracts first, then only the relevant core sections and local language/scenario cards. These are project-native decisions informed by the linked primary sources, not certification by those organizations. `required` protects stated correctness/safety contracts; `recommended` is a default with reasoned alternatives; `conditional` activates only when its stated predicate holds. Project safety/compatibility and actual toolchain facts take priority over corporate style.

<a id="ENG-CONTRACT"></a>
## ENG-CONTRACT — Contracts before representation

Level: required

### Risk
An accepted input can still violate the caller’s operation or output contract.

### Applies
Applies at public APIs, files, IPC and serialized input. Internal trusted values can rely on a proven invariant; rechecking everything is not the goal.

### Decision
Name the caller, accepted values, units, failure/output state and compatibility promise. Validate unknown data once at the boundary before effects; keep protocol mapping outside pure domain logic.

### Exceptions
If a trusted upstream validator owns the invariant, record its scope instead of adding a second schema. Type assertions and generated types alone provide no runtime guarantee.

### Examples
Better: reject a malformed amount before charging. Worse: cast JSON and let a partial effect reveal invalid input.

### Verification
Check invalid, boundary and successful inputs, plus effects/output state; exercise a real packed consumer when shipping a package.

### Sources
- [Publishing declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) (typescript-publishing)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/) (rust-api)

Case evidence IDs: EP-TS-01, EP-SVC-01. Identifiers are not cross-entry file dependencies; consult local examples and the coverage report for execution status.

<a id="ENG-ERROR"></a>
## ENG-ERROR — Observable failure

Level: required

### Risk
A fallback can erase the cause or report success after partial work.

### Applies
Applies when a failure crosses an abstraction or process boundary. Expected absence may use an explicit optional result rather than an exception.

### Decision
Preserve the cause and operation context, return a typed/declared failure, and let the owning boundary choose recovery. Cleanup failure must not silently replace the primary failure.

### Exceptions
Translate sensitive internal details into a safe public error while preserving a correlation path in permitted diagnostics. Do not log credentials or raw private payloads.

### Examples
Better: failure plus original cause and released owned resources. Worse: catch everything and return an empty successful object.

### Verification
Inject a downstream failure; assert the caller observes failure, its cause and the agreed cleanup outcome.

### Sources
- [Try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) (oracle-resources)
- [Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md) (uber-go)

Case evidence IDs: EP-RS-01, EP-JAVA-01. Identifiers are not cross-entry file dependencies; consult local examples and the coverage report for execution status.

<a id="ENG-RESOURCE"></a>
## ENG-RESOURCE — Own the full lifecycle

Level: required

### Risk
Partial acquisition, borrowed handles and teardown create leaks or double release.

### Applies
Applies when code acquires files, allocations, tasks, subscriptions or external handles. Pure value transformations need no invented resource manager.

### Decision
Identify acquire/use/transfer/release owners. Release acquired resources on every exit, in dependency order; borrowed values stay with their owner. Importing a library should not acquire unrelated external resources.

### Exceptions
A documented transfer or process-lifetime resource needs an explicit recipient or lifetime contract. Finalizers and process exit alone do not prove orderly shutdown.

### Examples
Better: fail the second allocation and release only the first owned allocation. Worse: free the caller’s borrowed buffer.

### Verification
Count acquisitions/releases under each failure point and successful transfer. Record untested drivers, GUI shutdown and sanitizer coverage separately.

### Sources
- [MEM00-C allocation and release](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/recommendations/memory-management-mem/mem00-c/) (cert-c)
- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) (cpp-core)

Case evidence IDs: EP-C-01, EP-CPP-01, EP-PY-01. Identifiers are not cross-entry file dependencies; consult local examples and the coverage report for execution status.

<a id="ENG-CONCURRENCY"></a>
## ENG-CONCURRENCY — Cancellation and completion differ

Level: conditional

### Risk
Detached work can outlive owners; an old result may overwrite current state.

### Applies
Applies if the unit starts concurrent work or receives asynchronous results. Sequential pure code need not gain a scheduler.

### Decision
Keep completion handles, cancellation ownership and bounded in-flight work. Stop accepting work, request cancellation/drain, then observe termination. Check request identity/liveness before publishing results.

### Exceptions
Some blocking operations ignore cancellation; expose incomplete shutdown or a caller-owned forced-exit policy. Arc, channel capacity and an abort request are not completion evidence.

### Examples
Better: controlled B-before-A responses keep B visible. Worse: a timed-out caller frees resources while workers still use them.

### Verification
Use barriers/events and controlled futures for cancellation, saturation and late results; arbitrary sleeps are not ordering proof.

### Sources
- [context package](https://pkg.go.dev/context) (go-context)
- [JoinHandle](https://docs.rs/tokio/latest/tokio/task/struct.JoinHandle.html) (tokio-join)
- [Coroutines and tasks](https://docs.python.org/3/library/asyncio-task.html) (python-asyncio)

Case evidence IDs: EP-GO-01, EP-IPC-01, EP-UI-01. Identifiers are not cross-entry file dependencies; consult local examples and the coverage report for execution status.

<a id="ENG-BOUNDARY"></a>
## ENG-BOUNDARY — Trust is established at an actual boundary

Level: required

### Risk
A frontend/backend label can hide privileged operations or untrusted callers.

### Applies
Applies to external input, authorization and privilege changes across UI, IPC, library and service roles. A private pure helper is not a new authentication layer.

### Decision
Verify sender/identity through the actual trusted mechanism, validate operation-specific data and scope permissions. A renderer-provided role or hidden button is not authority.

### Exceptions
Offline/local-only tools still have a caller and data boundary. Do not add network authentication where the contract needs only a constrained local capability.

### Examples
Better: expose one validated IPC operation with sender checks. Worse: expose arbitrary filesystem methods to a renderer.

### Verification
Exercise denied and allowed calls and zero effects after rejection. Native permission activation/signing needs its own actual environment evidence.

### Sources
- [Security](https://www.electronjs.org/docs/latest/tutorial/security) (electron-security)
- [Permissions](https://v2.tauri.app/security/permissions/) (tauri-permissions)

Case evidence IDs: EP-TS-01, EP-IPC-01. Identifiers are not cross-entry file dependencies; consult local examples and the coverage report for execution status.

<a id="ENG-DEPENDENCY"></a>
## ENG-DEPENDENCY — Ship a usable consumer contract

Level: recommended

### Risk
Working inside a repository can conceal undeclared dependencies or incompatible artifacts.

### Applies
Applies when publishing, upgrading dependencies or changing exported APIs. A content-only note does not require changing every tool version.

### Decision
Read manifests, locks, supported targets and exports first. Keep dependencies explicit, changes scoped and migration reversible; validate the artifact from an independent consumer.

### Exceptions
Adopt a dependency or compiler change only for an evidenced need and compatible policy. A corporate guide’s preferred build system is not such evidence.

### Examples
Better: declarations resolve with the packed files and declared dependencies. Worse: publish types that only resolve through adjacent source aliases.

### Verification
Inspect real archive bytes, install away from sibling sources and run supported consumer checks; record the exact version/integrity and untested platforms.

### Sources
- [Publishing declaration files](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) (typescript-publishing)
- [Code review standard](https://google.github.io/eng-practices/review/reviewer/standard.html) (google-review)

Case evidence IDs: EP-TS-01. Identifiers are not cross-entry file dependencies; consult local examples and the coverage report for execution status.

<a id="ENG-VERIFICATION"></a>
## ENG-VERIFICATION — Evidence matches the claimed behavior

Level: required

### Risk
A green structural check or missing tool can be mistaken for behavioral proof.

### Applies
Applies to implementation, review and delivery claims. Read-only advice can state proposed checks without pretending execution.

### Decision
Choose tests by risk and observable boundaries. Separate environment preparation from execution; keep fixed assertions for faulty/fixed variants and report actual commands, counts and limitations.

### Exceptions
When tools are absent, report MISSING; when intentionally unexecuted, NOT RUN. Compile errors and zero/all-skipped suites do not prove business RED/GREEN.

### Examples
Better: failure injection breaks a named effect assertion, then the fixed version passes it. Worse: only grep for a PASS string.

### Verification
Retain raw output, input/tool hashes and scope. Structure, native behavior and model-task decisions are distinct evidence.

### Sources
- [Test planning](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/test-planning/) (ms-playbook)
- [Fault injection testing](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/fault-injection-testing/) (ms-faults)
- [Code review standard](https://google.github.io/eng-practices/review/reviewer/standard.html) (google-review)

Case evidence IDs: EP-TS-01, EP-C-01, EP-SVC-01. Identifiers are not cross-entry file dependencies; consult local examples and the coverage report for execution status.

<a id="ENG-OPERABILITY"></a>
## ENG-OPERABILITY — Make recovery explicit and bounded

Level: conditional

### Risk
Partial failure, retry amplification and unsafe diagnostics can worsen an incident.

### Applies
Applies where this unit owns an external operation, background lifecycle or recovery decision. Libraries should expose signals, not force service dashboards or HTTP layers.

### Decision
Classify failure and commit uncertainty; make operation intent, total timeout/retry budget and recovery owner explicit. Use a stable idempotency contract for writes before replay. Emit safe correlation and actionable failure state.

### Exceptions
Without server-side safety, leave a write pending confirmation and offer reconciliation. A timeout/cancel is not proof that no effect occurred; 429/5xx alone do not authorize replay.

### Examples
Better: repeat the same key/intent and reuse the committed result. Worse: generate a new key after a payment timeout.

### Verification
Inject failure after commit but before response, replay concurrently and reject a changed intent; separate process-local tests from database or distributed guarantees.

### Sources
- [Timeouts, retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) (aws-retry)
- [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) (aws-idempotency)

Case evidence IDs: EP-SVC-01, EP-UI-01. Identifiers are not cross-entry file dependencies; consult local examples and the coverage report for execution status.
