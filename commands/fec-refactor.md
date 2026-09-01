---
name: fec-refactor
description: Execute controlled behavior-preserving frontend refactoring with small steps, verification, rollback, and proof reporting.
---

Execute a pure structural refactoring under a recorded behavior contract.

## Workflow

1. Classify the request and redirect feature work, unknown bugs, migrations, dead-code cleanup, or general review when they own the task.
2. Discover project facts and establish the existing validation baseline.
3. If no plan is supplied, diagnose evidence and build an ordered plan first. If a plan is supplied, revalidate it against the current code.
4. Record risk and Diff Budget. `DANGER` stops for explicit approval unless the specific compatibility plan is already authorized.
5. Execute **one refactoring step** with one primary structural intent.
6. Immediately run the narrowest sufficient verification and inspect actual scope.
7. If the step causes a new regression, revert that step before attempting a smaller or different transformation.
8. Repeat only after the current step is green and within budget.
9. Run final broad validation and save `reports/refactoring/refactoring-YYYY-MM-DD-HHmmss.md` with a `PASS`, `PARTIAL`, or `NOT PROVEN` behavior-preservation verdict.
