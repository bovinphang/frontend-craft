# Go concurrency lifecycle

## Specialist checks

1. List goroutine starters, stop signals, blocking operations and the party that waits for completion. A caller completion does not prove worker exit.

2. Use context-aware blocking points and bounded concurrency. A sender must have a path out when the receiver leaves.

3. Give channel closure to a clear owner; for multiple senders coordinate completion before close. Do not use recover to conceal send/close races.

4. Choose synchronization from shared-state invariants and happens-before needs. Locks, channels and atomics have different correctness responsibilities.

5. Cover cancellation, early consumer exit, queue saturation and concurrent shutdown with barriers or controllable events.

6. Run available race tests and inspect repeated-run worker/stack evidence. Passing a finite test cannot prove all interleavings safe.

<a id="scope"></a>
## Scope and examples

Use for:
- Stop Go workers blocked on channel sends
- Define who closes a shared Go channel
- Bound goroutines and propagate request cancellation
- Reproduce and test a Go data race

Use broader Go engineering guidance for module/package organization; buffering alone does not establish a safe lifecycle.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://go.dev/ref/mem) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
