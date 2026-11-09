---
practiceCards:
  - id: "cc-java-runtime:executor-lifecycle"
    level: "conditional"
    sourceIds: ["java-executor","oracle-resources"]
    caseIds: ["EP-JAVA-01"]
    evidence: "review-only"
  - id: "cc-java-runtime:diagnostic-bounds"
    level: "recommended"
    sourceIds: ["google-review","java-executor"]
    caseIds: ["EP-JAVA-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-java-runtime:executor-lifecycle"></a>
## Executors have a shutdown and completion owner

Level: conditional

### Risk
Stopping admission does not prove running tasks released their dependencies.

### Applies
When the project owns executor threads or background tasks; caller-owned pools must not be closed by a library.

### Decision
Record creation, queue limits, shutdown initiator and await/termination policy. Preserve interruption and incomplete termination explicitly before releasing shared resources.

### Exceptions
shutdownNow only attempts interruption; task cooperation matters. Newer JDK/virtual-thread APIs are conditional, not an automatic migration.

### Examples
Better: application waits for owned workers and reports timeout. Worse: a library closes a borrowed global executor or claims shutdown after requesting it.

### Verification
Test actual task start/cancel/termination with synchronization events in the supported JDK. The local lease test is not executor termination evidence.

### Sources
java-executor, oracle-resources — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-JAVA-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-java-runtime:diagnostic-bounds"></a>
## Diagnostics answer a measured runtime question

Level: recommended

### Risk
Unscoped profiling or raw dumps can add load and expose sensitive state without explaining the incident.

### Applies
For an evidenced pool, latency, memory or GC issue; ordinary code review does not require production profiling.

### Decision
Choose a bounded observation for the hypothesis, correlate error/operation identity safely and record JDK, workload and collection scope. Preserve raw evidence with appropriate access.

### Exceptions
Do not prescribe GC flags or upgrade a JDK from a guide alone. Missing production access is a limit, not a license to fabricate a capture.

### Examples
Better: compare measured blocked-task evidence against the owning pool contract. Worse: paste a full private heap dump into a public report.

### Verification
Use an approved representative environment and report collection overhead/unrun conditions. The unit resource case proves no load or GC characteristic.

### Sources
google-review, java-executor — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-JAVA-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
