---
name: fec-plan
description: Unified front-end planning entrance - implementation/architecture plan or testing strategy. The implementation path is taken by default; when the user clearly wants test plan, coverage matrix, test layering, risk-to-test, etc., the complete test strategy is output.
---

Create a front-end plan before changing the code. Automatically divert traffic to implementation planning or test planning based on user intent.

## Intent recognition

- **Implementation Planning** (default): Users need to dismantle components, design data flows, arrange directory structures, migration steps, and architecture plans.
- **Test Planning**: The user clearly states "test plan", "test strategy", "coverage matrix", "test layering", "what to test", "risk-to-test", etc.
- **Mixed**: Users have both implementation and testing requirements.

If the intention is unclear, first ask the user if they want to see the implementation plan or test strategy.

## Implementation planning path

1. Restate user goals, success criteria, and out-of-scope content.
2. Read relevant codes, templates, rules, configurations, tests and existing implementations to avoid deviating from the current status of the project.
3. If it involves page splitting, state flow, directory structure, data flow or large-scale reconstruction, entrust **`fec-architect`**.
4. Output plan:
   - Scope of influence
   - Key files or modules
   - Architecture and module boundaries
   - Data flow/state flow/API interaction
   - Implementation phase
   - Rollback or gradual migration strategy
   - Risks and Mitigation
   - Minimal verification access (lint, type-check, test, build, E2E or manual acceptance)
5. For decisions related to version sensitivity, dependency upgrades or external libraries, list the source of fact, version range, migration impact and documents that need to be verified.
6. Implementation is not performed until user confirmation.

The implementation plan is saved to `reports/architecture-proposal-YYYY-MM-DD-HHmmss.md`.

## Test planning path

1. Determine the scope:
   - When users specify functions, PRs, files or business processes, this scope shall prevail.
   - When not specified by the user, view recent changes and infer the main risk areas.
   - If the user wants module splitting, state flow, directory structure or migration steps, return to the implementation planning path.

2. Use the `fec-testing-strategy` Skill to create a test layering matrix:
   - Static checking
   - unit testing
   - Component testing
   - Lightweight integration testing
   - E2E testing
   - Visual/Storybook/interaction
   - a11y / safety / performance and other special quality verification

3. Provide recommended test layers, priorities, recommended commands, responsibility skills and failure location evidence for each risk.

4. Indicate which risks only need to be covered by existing access control, which ones need new testing, and which ones are not covered yet and explain the reasons.

5. Delegate the **`fec-test-planner`** subagent to generate independent test plans when necessary.

6. Save the plan to `reports/test-plan-YYYY-MM-DD-HHmmss.md`:

   ```markdown
   # Front-end test plan

   > Generation time: YYYY-MM-DD HH:mm
   > Scope: ...

   ## Risk Overview

   | Risk | Impact | Suggested Layer | Priority | Evidence |
   | ---- | ------ | --------------- | -------- | -------- |

   ## Covering matrix

   | Layer | What to Cover | Tooling / Command | Skill |
   | ----- | ------------- | ------------------ | ----- |

   ## Execution order

   ## Items not covered and reasons
   ```

7. If the user requires to continue to implement the test, it will be diverted to the corresponding special skill or agent according to the matrix.

## Mixed paths

When users need to implement plans and test strategies at the same time:

1. First output the complete implementation plan.
2. Add a "Testing Strategy" chapter to the end of the implementation plan to list the testing levels and verification access controls corresponding to key risks.
3. Additional `test-plan-*` independent reports will only be generated if the user explicitly requests complete coverage matrix.

## Boundary

- Do not write code directly in the planning stage unless the user explicitly requests to continue implementation.
- It is not required by default to complete the complete test pyramid, and coverage is only selected based on risk and maintenance cost.
- Not responsible for large-scale writing of test files; when users clearly require implementation, they will be diverted to special testing skills.