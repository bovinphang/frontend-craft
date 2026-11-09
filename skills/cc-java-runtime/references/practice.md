# Java runtime diagnosis

## Specialist checks

1. Align throughput, latency percentiles, errors, queue waits, CPU, allocation/GC and downstream timings on the same interval.

2. Collect bounded approved JFR and repeated thread samples when available; choose observations that can distinguish competing explanations.

3. Inspect queue bounds, rejection, operation deadlines, pool ownership and blocking calls before increasing capacity.

4. Change one evidenced constraint at a time and compare equivalent load. Heap or thread increases can move pressure downstream.

5. Define rollback thresholds for errors, latency and resource saturation; exercise overload and recovery in a controlled environment.

6. Report observed facts, hypotheses and unmeasured effects separately. Do not claim a root cause or p99 improvement from a single local timing.

<a id="scope"></a>
## Scope and examples

Use for:
- Diagnose Java p99 and thread pool queue growth
- Use bounded JFR and thread samples for a JVM incident
- Compare JVM heap or pool changes with baseline evidence
- Investigate Java blocking contention and downstream waits

Application package design uses the Java project standard; tuning without runtime evidence is not an optimization result.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://docs.oracle.com/en/java/javase/21/troubleshoot/) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
