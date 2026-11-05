---
name: fec-tdd-workflow
description: Use when implementing new observable frontend behavior or fixing a behavior-changing bug where a failing test can describe the missing or incorrect behavior first. Apply to components, hooks/composables, utilities, API clients, route guards, or user workflows; pure behavior-preserving refactoring uses an already-green contract instead.
---

# Frontend test-driven development

Follow the [common TDD method](references/common/tdd.md). Use RED → GREEN → REFACTOR for new behavior and GREEN → REFACTOR → GREEN for pure structural refactoring.

## Frontend observable contracts

User-visible UI, component props/emits, hook/composable return values, route guards, API client output/errors, events, side effects and asynchronous states.

## Frontend test selection

| Risk | Preferred validation |
| --- | --- |
| utils, schemas, state calculations | Unit tests |
| hooks/composables | Unit or lightweight integration |
| Component props, emits, interactions and states | Existing Testing Library / Vue Test Utils component tests |
| Router, Provider and Store collaboration | Lightweight integration |
| Cross-page login, payment, permission and CRUD journeys | Existing Playwright/Cypress E2E |

Select the closest meaningful layer: pure permission logic does not require E2E merely because it is permission-related. Keep existing frameworks and report observed red/green evidence and coverage boundaries through the common method.
