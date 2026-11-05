# Frontend refactoring validation

Execution order, rollback and proof verdicts follow the [common method](common/refactoring.md).

Choose checks by risk: nearest types/static checks → utilities/hooks/components → Router/Provider/Store integration → full lint/types/tests → build and affected SSR, E2E, accessibility, visual or performance checks.

Record actual project commands, UI/state/network observations, baseline failures, per-step changes and rollback boundaries. Pure structural refactoring does not invent new behavioral failures or revert unrelated user work.
