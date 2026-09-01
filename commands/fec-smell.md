---
name: fec-smell
description: Diagnose frontend code smells with evidence and candidate refactorings without changing business code.
---

Use this command for **DIAGNOSE ONLY** analysis. Do not modify business code.

## Workflow

1. Discover the requested scope, project/framework facts, and current diff.
2. Collect concrete evidence about ownership, duplication, change coupling, data flow, control flow, and public boundaries.
3. Match evidence against the 24-smell catalog and run false-positive checks.
4. For each finding report: `Location`, `Evidence`, `Impact`, `Smell`, `Confidence`, `Candidates`, `Priority`, and `False-positive check`.
5. LOW-confidence findings remain open questions and must not become automatic edits.
6. Save the result to `reports/refactoring/smell-YYYY-MM-DD-HHmmss.md`.

Metrics such as LOC or complexity may focus investigation but are not sufficient proof by themselves.
