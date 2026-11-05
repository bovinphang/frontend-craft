# Behavior-preserving refactoring

Refactoring changes internal organization while preserving the observable contract. Use GREEN → REFACTOR → GREEN; do not manufacture a failing behavioral requirement for a structural change.

1. Classify whether this is structural work, a new behavior, a defect fix, or a dependency migration. Keep behavior changes in a separate workflow.
2. Read affected implementation, callers, exports, registration, persistence and tests. Define observable results, errors, side effects and ordering, state transitions, public names and protocols before editing.
3. Establish the green baseline or record existing failures. If a relevant behavior lacks coverage, add characterization tests that describe current behavior; these may start green.
4. Diagnose structural evidence and check false positives. Line count and complexity metrics alone do not justify a rewrite. Prefer the smallest safe, reversible transformation.
5. Plan prerequisite steps. Each records target, structural intent, technique, risk, expected files/functions, expected public API/behavior changes (zero for pure refactoring), verification and rollback boundary.
6. Change one primary structural concern, then run the nearest meaningful check and inspect the diff. Stop and reassess if the actual scope exceeds the planned diff budget.
7. A new regression invalidates the current step: restore only that step, verify the previous baseline and shrink or reorder the transformation before retrying. Do not revert unrelated user edits or spread repairs across unrelated modules.
8. Broaden verification as the changed contract requires: local/static checks, unit/integration, full lint/types/tests, build and relevant specialty checks. Use existing project tools rather than impose a framework.

Risk is contextual: SAFE for local/private changes with strong evidence; CAUTION for cross-module/shared-state/lifecycle changes; DANGER for public APIs, schemas, persistence, authentication, permission, protocols or architecture-wide changes. A technique name alone never makes a change safe.

Deliver a proof verdict: PASS when the relevant behavior is adequately covered and checks pass; PARTIAL when checks pass but coverage has important gaps; NOT PROVEN when evidence or environment prevents a credible preservation claim. Include executed commands, rollback decisions and remaining risks.
