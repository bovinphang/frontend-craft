# Python project engineering

## Specialist checks

1. Read pyproject, lock/environment conventions, supported Python versions and current package layout. Do not mix new installers or replace the environment implicitly.

2. Keep pure domain computation independent from transport/database clients. Create external resources in application startup or explicit factories, not at import time.

3. Use repository typing conventions and explicit data boundaries. Validate external input before it reaches core calculations; preserve error causes without broad silent catches.

4. Define who closes files, sessions and clients; use the appropriate context manager and keep asynchronous lifetime rules in the async workflow.

5. Preserve tests and cover invalid input, decimal/rounding boundaries, partial failure and import safety. Fakes do not prove a real database transaction.

6. Run the configured Ruff/type/test commands in the existing environment. Missing modules remain missing; do not install packages or claim checks passed without execution.

<a id="scope"></a>
## Scope and examples

Use for:
- Organize a Python domain package under existing pyproject
- Remove import-time database side effects
- Review typing and dependency boundaries in Python
- Use existing Ruff mypy and pytest configuration

Focused event-loop cancellation or blocking-I/O problems belong to the async specialty.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://docs.python.org/3.14/library/asyncio-task.html) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
