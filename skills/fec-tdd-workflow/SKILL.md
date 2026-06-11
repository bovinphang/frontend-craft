---
name: fec-tdd-workflow
description: Use when implementing new frontend behavior, fixing bugs, or refactoring logic where tests can describe the expected behavior first. Apply to components, hooks/composables, utilities, API clients, route guards, or user workflows; Chinese triggers include TDD, test-driven, write tests first, red-green refactoring, regression testing.
---

# Front-end TDD workflow

## Purpose

Use the rhythm of "write failing tests first, then implement the minimum code, and then refactor" to deliver front-end functions to avoid supplementing coverage only after implementation.

## Procedure

1. Identify observable behaviors: UI, component contracts, hook/composable return values, route guard results, API client output or error status that users can see.
2. First write a minimum failure test:
   - Pure logic first unit testing.
   - Prioritize component interaction Testing Library / Vue Test Utils.
   - Prioritize critical processes across pages Playwright/Cypress.
3. Run the test and confirm that the failure reason is correct and should come from behavior that has not yet been implemented, rather than a syntax, import, or test environment error.
4. Write the minimum implementation that can just pass the test, and do not expand the scope easily.
5. Rerun the test and confirm it turns green.
6. Refactor naming, boundaries and duplication logic while keeping tests passing.
7. Fix bugs and retain regression tests that can reproduce the problem.
8. Only one observable behavior is expanded in each round; new requirements, new boundaries and new abnormal paths enter the next round respectively.

## Prove-It Pattern

When fixing a defect, make the test fail first, then make it pass. If it cannot fail first, it means that the test does not cover the original problem, and the input, assertion or test level needs to be narrowed.

## Frontend Test Selection

| Risk | Preferred Test |
| ---- | -------------- |
| utils, schema, status calculation | unit testing |
| hooks / composables | unit or lightweight integration testing |
| Component props, emits, interactions, status | Component testing |
| Router, Provider, Store collaboration | Lightweight integration testing |
| Login, payment, permissions, key CRUD | E2E testing |

## Constraints

- Do not introduce new testing frameworks for the sake of TDD that are not used by the project and whose benefits are not clear.
- Does not test implementation details, private state, or fragile DOM structures.
- Don’t treat E2E as the default answer for all risks; prioritize the test layer closest to the risk.
- If the existing warehouse does not have testing infrastructure, output the minimum test implementation suggestions first, and then ask the user to confirm whether to introduce it.
- Do not refactor at the same time during the red light stage; prove the problem first, then make minimal repairs, and then organize the structure.

## Expected Output

- At least one fail-then-pass test covering the new or fixed behavior.
- Implementation is kept to a minimum scope and refactoring is done only after the tests pass.
- Summarize the test commands run, behaviors covered, and risks not covered.
