# Source-driven development

Use project facts, authoritative sources and version-specific evidence to make engineering decisions.

1. Establish the question, affected version and local contract. Read the project's manifests, configuration, implementation, callers and tests before proposing changes. Stable local transformations can rely on those facts; changing runtime, package or public API assumptions need authoritative verification.
2. Collect official documentation, source, type definitions, release notes, specifications and migration guides for the actual version. Third-party discussions provide clues, not the final basis. Record source paths/URLs, versions, dates and relevant conclusions.
3. Compare recommendations with the running project. State compatibility, maintenance cost, migration scope and rollback. Isolate unstable external assumptions behind a small boundary; do not overturn stable conventions just to use a newer pattern.
4. Prove key assumptions using the project's existing checks or a minimal reproduction. Select checks for the actual stack. Record commands and observed outcomes; if verification is unavailable, report the uncertainty rather than claim support.
5. Update a lightweight ADR, migration record or factual documentation when public interfaces, dependencies or team conventions change. Do not copy long external documents.

## Local knowledge requests

When a user restricts evidence to a local repository or knowledge directory, search that source first and do not fill gaps with online guesses. Use the explicit path, otherwise check whether `knowledge/` exists. If absent, identify the missing source instead of inventing one.

Read `data_structure.md` navigation where available, choose relevant branches, and search progressively instead of loading the entire corpus. Default to at most five keyword refinement rounds. Record file paths, sections/pages/sheets, version range and evidence gaps. For PDF or spreadsheets choose an appropriate extraction tool before reading large content. Use external sources only when the user's scope permits them.

## Evidence priority and delivery

Project implementation/configuration/tests establish the local contract; official versioned documentation/source establishes external behavior; specifications establish platform constraints; issues and articles only supplement these. Deliver the decision, sources, implementation impact, verification results and remaining uncertainty. "Checked the docs" without traceable evidence is insufficient.
