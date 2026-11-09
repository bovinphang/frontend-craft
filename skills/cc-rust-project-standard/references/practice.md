# Rust project engineering

## Specialist checks

1. Read Cargo.toml, workspace membership, edition, MSRV and existing aliases before proposing modules or dependencies. Work in the owning crate rather than upgrading the entire workspace.

2. Assign ownership at API boundaries. Prefer borrowing when the caller retains lifetime responsibility; shared ownership needs an actual shared-lifetime reason.

3. Use the repository error taxonomy and Result propagation. Preserve causes, map failures at the application boundary, and keep secrets out of public diagnostics.

4. Keep core logic independent of optional I/O, persistence and transport adapters. Check guard lifetime and avoid holding a blocking mutex across suspension.

5. For resource-changing operations, test malformed input, partial progress, recovery and ownership transfer alongside success. Use temporary resources and deterministic failure injection.

6. Run available fmt checks, clippy and targeted Cargo tests with the existing lock/toolchain. Missing Rust tooling is an unverified result, not a passing check.

<a id="scope"></a>
## Scope and examples

Use for:
- Organize crates in an existing Cargo workspace
- Review Rust public API ownership and Result boundaries
- Keep the current Rust edition while adding a storage module
- Select Cargo checks for a Rust library

Existing Tokio cancellation or scheduling defects belong to the async specialty; unrelated frontend structure is outside this scope.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
