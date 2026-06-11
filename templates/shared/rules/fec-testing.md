# Testing and verification rules

This document should be used whenever code is added, modified, refactored, or reviewed.

## Verification sequence

Prioritize execution in the following order:

1. lint
2. type check
3. unit test
4. build

Priority is given to using existing scripts in the warehouse.
If the command is uncertain, check `package.json` first.

## Change the verification principle

- Fix the smallest and correct issues first
- Re-execute affected commands after each critical fix
- Don’t blindly suppress error reporting or closing rules
- Don't compromise type safety to pass checks
- Don't rewrite unrelated modules just because a local test fails

## Testing requirements

When adding or modifying behaviors, consider whether you need to override the following:

- Component rendering
- interactive behavior
- Status switching
- Border scenes
- loading / empty / error status
- Key interactions related to accessibility

If there is no supplementary test, the reason needs to be explained.

## Fixture and Mock

- Fixture expresses business scenarios without using random, meaningless or data that is meaningful only to the test author
- Complex objects use builder to fill in default values, and each test only covers fields related to the current scenario.
- No mutable global state, fake timers, stores or mock server handlers are shared between tests
- Network mocks should simulate public contracts and user-visible errors and not replicate backend internal implementations

## TDD and regression testing

When adding new behaviors, fixing bugs, or refactoring key logic, TDD is preferred:

1. Start by writing failing tests that describe the desired behavior.
2. Run the test and confirm that the failure reason is correct.
3. Write the minimum implementation to make the test pass.
4. Refactor after the test remains passed.

Bug fixes should prioritize keeping regression tests that reproduce the problem. If the existing project lacks testing infrastructure, do not blindly introduce a new framework; first provide minimum test implementation suggestions and explain maintenance costs.

## Code review output style

When reviewing code, return:

- Overall assessment
- Required questions
- Suggestions for optimization
- Optional optimization items
- Risk level

Conclusions should be specific and actionable.

## E2E test rules

When using Playwright or Cypress:

- Follow **Page Object**, do not write naked selectors in spec; give priority to **`data-testid`**, followed by **`role` / `label`**
- Use **`test.describe` + `beforeEach`** to organize scenarios. A single use case can run independently and does not depend on the execution sequence.
- It is forbidden to use fixed **`sleep`** as the main synchronization method; use **Locator to automatically wait**, `expect`, `waitForResponse`, etc.
- Playwright: Configure `baseURL` in **`playwright.config.ts`**, `retries`/`workers`, `trace`/`screenshot`/`video`, **`webServer`** and many **`projects` (including mobile)** under CI
- Key processes cover at least desktop, tablet, and mobile viewports (or equivalent device projects)
- **Unstable use case**: `test.fixme` / `test.skip` needs to write the reason and issue; use `--repeat-each` to assist in locating flaky
- Keep **Screenshots, Traces, Videos** in case of failure, CI uses **artifact** to upload HTML reports and products
- High-risk/funding processes: **Do not run real E2E in production**; staging or mock, if necessary `test.skip`
- Test data is repeatable: priority is seed, test account or mock service; random values must be uniquely prefixed and cleaned in teardown

For detailed modes and examples, see the plug-in **`fec-e2e-testing`** skill.

## Refactoring rules

When refactoring:

- Maintain consistent behavior unless the task specifically requires a change in behavior
- Describe possible migration risks
- Prioritize incremental changes over extensive rewrites
- Summarize changed files, executed commands and remaining risks

## Verification failure handling

- Group errors by file and root cause to fix one type of problems at a time.
- Rerun the most recent failed command after each fix.
- Don't remove failing tests, don't close rules, don't reduce type safety in exchange for passing.
- When the same error is repaired multiple times and still fails, the expansion of changes will be stopped and a blockage will be reported.
