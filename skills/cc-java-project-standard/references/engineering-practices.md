---
practiceCards:
  - id: "cc-java-project-standard:module-contract"
    level: "required"
    sourceIds: ["google-java","google-review"]
    caseIds: ["EP-JAVA-01"]
    evidence: "review-only"
  - id: "cc-java-project-standard:exception-causes"
    level: "required"
    sourceIds: ["oracle-resources"]
    caseIds: ["EP-JAVA-01"]
    evidence: "case"
  - id: "cc-java-project-standard:resource-lifecycle"
    level: "required"
    sourceIds: ["oracle-resources"]
    caseIds: ["EP-JAVA-01"]
    evidence: "case"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-java-project-standard:module-contract"></a>
## Library contracts do not imply a Web architecture

Level: required

### Risk
Transport assumptions can turn a usable library into an unusable service component.

### Applies
For public Java modules, CLI and Swing/JavaFX cores; service layers apply only where that application actually exists.

### Decision
Read declared JDK, wrapper and dependency platform. Keep public types, nullability/failure states and module visibility explicit; adapters own HTTP/UI translation.

### Exceptions
Local source layout/formatter wins over corporate whitespace preferences. Do not add controller/repository layers or upgrade JDK to satisfy a public style page.

### Examples
Better: library returns a meaningful result to a desktop caller. Worse: library exits the process or starts a server when loaded.

### Verification
Check a consuming module and existing build/test scripts; the resource sample is not a JPMS or GUI compatibility test.

### Sources
google-java, google-review — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-JAVA-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-java-project-standard:exception-causes"></a>
## Preserve primary and cleanup failures

Level: required

### Risk
Catch-all fallback can erase cause and report a broken instance as usable.

### Applies
When initialization or domain work can fail; expected absence may use an explicit optional result.

### Decision
Use existing checked/unchecked policy, retain cause, and preserve suppressed cleanup errors. Boundary mapping must not claim success after failure. Respect interruption where actually caught.

### Exceptions
A safe public message may omit internal details while retaining a diagnostic correlation. Do not indiscriminately reset interruption for unrelated exceptions.

### Examples
Better: BoundaryFailure wraps the original IOException. Worse: catch Exception returns an empty ready object.

### Verification
The local failure test observes the actual cause; add a real suppressed-close/interruption test if those contracts change.

### Sources
oracle-resources — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-JAVA-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-java-project-standard:resource-lifecycle"></a>
## Close only acquired, owned resources

Level: required

### Risk
A failed second step can leak the first file/client or close a borrowed dependency.

### Applies
For AutoCloseable resources acquired by this unit, including CLI/desktop startup.

### Decision
Use try-with-resources or the established owner; define successful transfer and partial acquisition cleanup. Keep borrowed resource shutdown with its creator.

### Exceptions
Long-lived executors/GUI resources have additional completion/thread rules; closing a handle is not proof all background work stopped.

### Examples
Better: failed initialization closes its lease once and keeps cause. Worse: only close on success or close the caller’s shared client.

### Verification
Run the local close/cause pair and add failure at each actual acquisition boundary; native drivers and application shutdown need their own environment evidence.

### Sources
oracle-resources — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-JAVA-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.
