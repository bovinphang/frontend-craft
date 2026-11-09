# Python async lifecycle

## Specialist checks

1. Map event-loop work, blocking clients, task ownership and resource acquisition. Confirm interpreter/runtime features before choosing task-group APIs.

2. Offload unavoidable blocking operations to a bounded executor or use the existing async client boundary. Bound waiting as well as active work.

3. Cancellation of an awaiting coroutine does not necessarily stop an underlying thread or I/O operation. Keep resource ownership with the actual operation.

4. Use appropriate async cleanup/finally paths and preserve cancellation semantics. Do not release a pool slot while the underlying operation still uses it.

5. Define stop-accepting, drain/cancel and completion deadlines; propagate task errors to an owner rather than losing background exceptions.

6. Test cancellation before/after acquisition, driver timeouts, saturated pools and shutdown. Report uninterruptible drivers as a limitation.

<a id="scope"></a>
## Scope and examples

Use for:
- Remove blocking client calls from an async Python handler
- Return pooled resources correctly after asyncio cancellation
- Bound Python thread offloading and task concurrency
- Test async Python shutdown and timeout cleanup

General Python package/typing conventions use the project standard; do not create an event loop per request as a generic fix.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://docs.python.org/3.14/library/asyncio-task.html) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
