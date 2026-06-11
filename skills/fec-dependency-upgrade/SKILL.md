---
name: fec-dependency-upgrade
description: Use when planning, implementing, or reviewing frontend dependency upgrades, package migrations, lockfile changes, major framework version bumps, CVE remediation, peer dependency conflicts, ESM/CJS shifts, build-tool compatibility, or CI verification matrices; Chinese triggers include dependency upgrades, version upgrades, lockfile, peer dependency, CVE fixes, major version migrations.
---

# Dependency upgrade

Suitable for front-end dependency upgrades, bug fixes, major version migrations and lockfile risk reviews. Load [references/dependency-upgrade-workflow.md](references/dependency-upgrade-workflow.md) when you need specific processes and checklists.

## Purpose

Reduce disruptive changes, supply chain risks, and CI regressions by upgrading dependencies in a provenance-driven and small-batch verification manner.

## Procedure

1. Establish a baseline of truth: Read package manager, lockfile, Node version, workspace scope, CI commands, and current verification status.
2. Classified upgrade goals: security fixes, patch upgrades, minor version upgrades, major version migrations, framework migrations, build tool migrations, or dependency cleanup.
3. Verify sources: For version-sensitive libraries, read official release notes, migration guide, peer dependency, Node/browser support and deprecation items.
4. Split into smaller batches: Security patches can be processed centrally; large versions, build tools, frameworks and testing tools must be verified in separate batches.
5. Address compatibility boundaries: Check for ESM/CJS, TypeScript types, CSS handling, SSR/RSC, plugin APIs, peer dependencies, and polyfill changes.
6. Run the verification matrix: at least cover install, typecheck, unit/component tests, and build; for key applications, add E2E, Storybook, or manual smoke.
7. Synchronization documentation: Record upgrade reasons, versions, destructive changes, migration commands, rollback methods, and paths that still require manual verification.

## Constraints

- No more big version jumps without source and verification.
- Do not blindly upgrade critical runtime packages to eliminate audit warnings; first determine the exploitable paths and repair the impact.
- Avoid manual editing of lockfile to avoid dependency conflicts.
- Do not mix dependency upgrades and unrelated refactorings in one batch.
- Do not remove peer dependencies or build plugins unless proven not to be used by runtimes, subpackages or CIs.

## Expected Output

Output upgrade list, risk classification, source basis, batch strategy, modification scope, verification command, failure handling and rollback suggestions. After completion, the lockfile is consistent with the package manifest, key verification is passed, and destructive changes are recorded.
