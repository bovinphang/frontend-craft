# Test-driven development

For new behavior and behavior-changing defect fixes use RED → GREEN → REFACTOR. The test describes an observable contract, not private implementation structure.

1. Identify one behavior: inputs, output/error, state transition or externally observable side effect. Choose the closest meaningful test level using existing project tooling.
2. Write the smallest test that distinguishes the missing or wrong behavior. Run it first and observe failure for the expected behavior, not a syntax, import or environment problem. For a defect, the test must fail against the original defect.
3. Implement only enough to pass that test. Do not refactor during the red phase or add unrelated features.
4. Run the test and relevant surrounding tests, then improve naming and structure while preserving green. New requirements enter the next cycle.
5. Report the observed red/green commands, covered behavior and untested boundaries. Do not infer success from a diff or unexecuted tests.

Pure structural refactoring has a different contract: establish current behavior through existing or characterization coverage and keep GREEN → REFACTOR → GREEN. Do not invent a failure merely to satisfy a ritual.

Test logic close to the risk; use integration tests for real boundaries and end-to-end tests for journeys that need them. Do not make E2E the default or assert fragile private state. Do not introduce a new testing framework merely for TDD. If infrastructure is absent, explain the minimum test setup and obtain a decision before introducing it; use the actual stack rather than require frontend tools.
