# Documentation synchronization

Synchronize public documentation from implementation facts, not from the desired design.

1. Identify the repository stack, document entry points and requested scope. Include root READMEs, nested package/application/runtime READMEs and deployment guides; exclude dependencies, generated outputs and third-party directories.
2. Collect authoritative project sources: manifests/lockfiles, configuration, env examples, commands, schemas, public APIs, tests, CI, build and deployment files. Use sources for the actual stack rather than require a particular language's manifest.
3. Compare commands, environment variable names, paths, versions, API behavior, capabilities, setup and deployment instructions. Keep only stable public facts; do not present proposals or experimental designs as supported behavior.
4. Check every existing language entry. Public identifiers, commands, version constraints, support matrices, report paths and examples must agree. Translate prose according to the existing convention; explicitly report translations requiring human review.
5. Update affected README/docs/ADR/changelog and user-facing metadata together. An ADR records context, decision, alternatives, impact, verification and rollback clues; it is not a full review report.
6. Run the project's existing consistency checks, relevant type/tests/build or packaging checks and legacy-reference search. Record each checked document, source of truth, updated language, unchanged entry and unresolved uncertainty.

Do not invent commands or environment variables, overwrite private documents outside the requested scope, or replace a README with internal implementation details. A successful prose edit alone does not prove factual consistency.
