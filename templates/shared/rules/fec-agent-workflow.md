# Subagent collaboration rules

When front-end tasks involve multi-perspective analysis, cross-module planning, dedicated quality reviews, or verification failure repairs, give priority to using subagents with clear responsibilities.

## Selection principle

- Architecture, page splitting, state flow, directory planning: `fec-architect`
- Front-end PR comprehensive review: `fec-code-reviewer`
- TypeScript/JavaScript semantics and type risks: `fec-typescript-reviewer`
- Security risk: `fec-security-reviewer`
- Test strategy: `fec-test-planner`
- E2E writing and running: `fec-e2e-runner`
- Performance bottleneck: `fec-performance-optimizer`
- Source/version sensitive decision-making: Prioritize the agent to check the project facts and official sources, and then hand it over to the special agent for implementation
- Differences between UI visual and design draft: `fec-ui-checker`
- Design draft implementation: `fec-figma-implementer`
- Token mapping: `fec-design-token-mapper`
- Build, type, test, CI failed: `fec-build-fixer`
- Dead code and useless dependency cleaning: `fec-refactor-cleaner`
- README, runtime docs, capability table synchronization: `fec-doc-updater`

## Multi-agent review orchestration

Complex PRs can be reviewed in parallel along quality dimensions, but a lead agent must be responsible for merging conclusions.

| Change Type | Recommended Combination | Master Consolidator |
| --- | --- | --- |
| UI feature | `fec-code-reviewer` + `fec-typescript-reviewer` + `fec-test-planner` | `fec-code-reviewer` |
| Authentication / Upload / Rich Text | `fec-security-reviewer` + `fec-code-reviewer` | `fec-security-reviewer` |
| Big List / Charts / 3D / Performance Issues | `fec-performance-optimizer` + `fec-code-reviewer` | `fec-performance-optimizer` |
| Design draft landing | `fec-figma-implementer` + `fec-ui-checker` + `fec-code-reviewer` | `fec-figma-implementer` |
| Large refactoring | `fec-architect` + `fec-refactor-cleaner` + `fec-test-planner` | `fec-architect` |

Merge rules:

- Problems with the same file, same line number, and same root cause are merged into one, and the highest severity level is retained.
- When the same root cause is distributed in multiple places, it is written as a pattern-level discovery. The representative positions are listed and the screen is not refreshed line by line.
- When conclusions conflict, go back to the project facts, test results and user impact first, and do not use an agent's identity to decide who is right.
- The main agent outputs the final Verdict and lists the coverage and non-coverage ranges of each special agent.

## Collaboration constraints

- Clarify the scope, input and output before delegating, and do not leave ambiguous tasks to sub-agents.
- Multiple independent problems can be analyzed in parallel; tasks that depend on each other are advanced in sequence.
- Subagent output must lead to verifiable conclusions: reports, file paths, command results, or specific risks.
- Subagent suggestions do not automatically equal implementation decisions; when they conflict with the existing contracts of the warehouse, the warehouse contracts take precedence.
- The primary agent must review key evidence, verify orders, and change boundaries, and cannot just relay the subagent's conclusions.

## Anti-pattern

- Too many proxies were created for simple single file modifications.
- Let multiple agents modify the same file simultaneously without boundaries.
- Use subagent instead of code reading that should be done first.
- Only conclusions are received, key evidence and verification orders are not checked.
