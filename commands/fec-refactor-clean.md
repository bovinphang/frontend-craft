---
name: fec-refactor-clean
description: Identify and clean up front-end dead code, unused exports, outdated components, styles and dependencies under validation protection.
---

Press `fec-refactor-clean` to perform a safe clean. Complex cleanup can be delegated to **`fec-refactor-cleaner`**.

## Execution steps

1. Establish the current verification baseline.
2. Use existing tools in the warehouse or `rg` to collect unused candidates.
3. Check dynamic references, routing, barrel export, Storybook, test and style entry.
4. Divide the candidates into SAFE, CAUTION, and DANGER.
5. Only clean SAFE items; other items output suggestions and evidence.
6. Rerun the affected verification commands after each batch cleanup.

## Output requirements

Save the clean report to `reports/refactor-clean-YYYY-MM-DD-HHmmss.md`.