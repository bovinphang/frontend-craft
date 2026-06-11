---
name: fec-tdd
description: Use front-end TDD workflow to implement functions, fix bugs, or refactor logic: first write failing tests, then implement minimal code, and then refactor.
---

Perform test-driven development as per `fec-tdd-workflow`.

## Execution steps

1. Identify the front-end behavior to be verified.
2. Select the test layer for the nearest risk: Unit, Component, Lightweight Integration, or E2E.
3. Write a minimum failure test and run it to confirm that the failure reason is correct.
4. Write the minimum implementation to make the test pass.
5. Keep the tests passed before refactoring.
6. Summarize test orders, coverage actions, and remaining risks.

## Diversion

- Component and hook testing: `fec-component-testing`
- Cross-page browser process: `fec-e2e-testing`
- Test layering strategy: `fec-testing-strategy`