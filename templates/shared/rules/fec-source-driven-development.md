# Source-driven development rules

When an implementation relies on a framework, library, browser, runtime, build tool, or platform behavior, confirm the source of truth before writing code or reviewing conclusions.

## Fact source priority

1. README, configuration, testing, templates and existing implementations within the project.
2. Official documents, source code, type definitions, release notes, migration guide.
3. Web standards, browser compatibility data, and platform documentation.
4. Issues, discussions, blogs and third-party articles are only used as clues.

## Usage scenarios

- New versions of frameworks, routing, rendering modes, caching, build configurations, browser APIs.
- Public interfaces, component APIs, design system tokens, CLI commands, and plugin metadata.
- Dependency upgrade, migration, obsolete API replacement, cross-runtime compatibility.
- Version-sensitive judgments related to security, performance, and accessibility.

## Output requirements

- Write down the source, version or project facts, decision conclusion, scope of influence and verification method.
- If the current status of the project conflicts with official recommendations, explain the cause of the conflict and the gradual migration strategy.
- Do not copy long external documents; only keep necessary conclusions, links or file paths within the project.
- Mark uncertainties and matters requiring confirmation from the user/team when they cannot be verified.

## Anti-pattern

- Use version-sensitive APIs from memory.
- Replace official documentation with outdated tutorials.
- Overturn the stable project agreement in order to pursue new projects.
- Scatter external library behavior assumptions throughout components instead of centralizing them in the adaptation layer.
