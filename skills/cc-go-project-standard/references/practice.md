# Go project engineering

## Specialist checks

1. Locate go.work and the nearest go.mod; preserve module import paths and dependency versions. Do not run a root-level go get simply because the task is in a submodule.

2. Create dependencies at an explicit entry point and inject narrow interfaces into consumers. The creator owns closing pools, clients and background workers.

3. Return actionable errors, preserve causes with wrapping, and use errors.Is/As where appropriate. Map errors at transport boundaries without leaking internals.

4. Pass context through operations that can block, keep cancellation ownership explicit, and avoid storing request context in global state.

5. Put behavior tests near packages; cover cancellation, empty results and downstream failures. Scope integration and race checks to the changed module.

6. Check formatting without writing, run available vet and tests, and record unavailable dependencies/toolchains. Build success alone does not demonstrate test execution.

<a id="scope"></a>
## Scope and examples

Use for:
- Organize internal packages in a Go module
- Review errors and context boundaries in a Go service
- Add a repository adapter without global database state
- Validate one module inside go.work

A focused goroutine/channel lifecycle defect belongs to the concurrency specialty.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://go.dev/doc/effective_go) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
