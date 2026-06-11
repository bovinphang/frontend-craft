# Working mode rules

Choose the appropriate working mode according to the task stage to avoid making major changes to the code while exploring.

## Research mode

It is suitable when the requirements are unclear, the current situation is complex, and it is necessary to compare plans or locate risks.

- Read the README, project rules, relevant source code and recent changes first.
- Use `rg` to find existing patterns, components, utility functions and tests.
- List findings first, then give suggestions.
- Do not draw firm conclusions when there is insufficient evidence.
- When version-sensitive frameworks, libraries, or platform behaviors are involved, check the facts within the project and official sources first.

## Planning mode

Suitable for complex features, architecture adjustments, cross-file refactoring, and high-risk fixes.

- Restate goals, success criteria, and what not to do.
- Map out scope of impact, file boundaries, dependencies, risks and verification methods.
- The plan should be able to be executed in batches, with verifiable results for each batch.
- Large-scale implementation will not be performed before the user confirms.

## Development mode

Suitable for implementations with clear goals and plans or a small scope.

- Prioritize reuse of existing patterns.
- Use TDD first for behavior changes: fail the test first, then implement the minimum, and then refactor.
- Run the latest verification command after every critical modification.
- Summarize changes, orders, and remaining risks upon completion.
- Behavior, interface, or performance assumptions must be supported by types, tests, builds, browser observations, or documentation sources.

## Review mode

Applies to PRs, recent changes, pre-merger checks, and ad hoc reviews.

- Read through the context first, then list the issues in order of severity.
- Prioritize reporting of issues that result in bugs, security risks, regressions, or significant increases in maintenance costs.
- Each issue gives the file location, impact, recommended fix and confidence level.
- Clear indication of remaining test gaps when no issues arise.

## Ending mode

Applies to pre-submission or delivery.

- Run commands related to changes in lint, type-check, test, and build.
- Check for debug code, temporary files, unsynced documentation, or unaccounted for risks.
- Don't commit or push without confirmation.
- Do not use "should be able" as the basis for delivery; report the actual run commands and results before delivery.
