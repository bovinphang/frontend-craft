---
name: fec-refactoring
description: Use when restructuring existing frontend code while preserving observable behavior, including responsibility extraction, module movement, conditional simplification, API cleanup, or data organization. Do not use for new feature behavior, behavior-changing bug fixes, dependency or framework migrations, or proven dead-code cleanup.
---

# Frontend behavior-preserving refactoring

Follow the [common refactoring method](references/common/refactoring.md): GREEN → REFACTOR → GREEN. Its shared contract defines Behavior Preservation, Green Baseline First, One Refactoring at a Time, Verify Every Step, Revert Before Repairing, and the Diff Budget.

## Frontend observable boundaries

Identify props/emits/slots, hooks/composables, DOM, loading/error/empty states, focus/keyboard behavior, routes/URLs, state ownership and object identity, requests, caches, lifecycles, SSR/hydration, exports and dynamic registration.

## Frontend risk and scope

Assess authentication, permissions, routing, storage, SSR/hydration, network contracts and architecture-wide state movement by their actual effects. A technique name does not establish SAFE risk.

## Domain references

- [Domain evidence and observable contracts](references/principles.md)
- [Frontend validation ladder](references/workflow.md)
- [When to refactor](references/when-to-refactor.md)
- [Boundary with behavior changes](references/refactoring-vs-feature-change.md)

Deliver the common method's PASS, PARTIAL or NOT PROVEN verdict, per-step Diff Budget, executed verification and residual risk.
