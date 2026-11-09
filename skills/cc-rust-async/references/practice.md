# Rust async lifecycle

## Specialist checks

1. Identify runtime/version and every suspension point, resource owner and cancellation boundary. Check the actual future documentation before assuming cancellation safety.

2. Separate cancelling a waiter from stopping an operation. A timed-out write may already have changed the stream; specify recovery for partial progress.

3. Own spawned task handles, bound queue and in-flight work, and propagate errors. Detached unbounded work is not a shutdown strategy.

4. Move unavoidable blocking work to an appropriate bounded boundary; check that cancellation also respects the underlying operation lifetime.

5. Stop accepting work before draining/cancelling owned tasks; define deadlines and cleanup completion. Avoid assuming select provides business idempotency.

6. Use controllable scheduling, short writes, cancellation and backpressure tests. Report which runtime/error paths actually ran.

<a id="scope"></a>
## Scope and examples

Use for:
- Fix partial writes cancelled by Tokio select
- Bound spawned Rust tasks and own JoinHandle cleanup
- Design Rust async shutdown and cancellation
- Keep blocking I/O outside async executor paths

Use the project standard for crate layout; only apply Tokio-specific behavior when Tokio and its actual version are present.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://docs.rs/tokio/latest/tokio/macro.select.html) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
