---
name: fec-refactor-plan
description: Build an ordered behavior-preserving frontend refactoring plan from evidence without editing business code.
---

This command is **PLAN ONLY**. Do not edit business code.

## Workflow

1. Validate current project facts and any supplied smell diagnosis.
2. Record the observable behavior contract and available verification baseline.
3. Select the smallest candidate technique whose preconditions fit each diagnosed cause.
4. Order only necessary prerequisites and keep each step independently verifiable.
5. Classify every step `SAFE`, `CAUTION`, or `DANGER`.
6. For every step include: target, technique, intent, dependency/order reason, preconditions, risk, expected files/functions, expected observable behavior change (`NONE`), verification command/method, and rollback boundary.
7. Include a Diff Budget and stop conditions.
8. Save the result to `reports/refactoring/plan-YYYY-MM-DD-HHmmss.md`.
