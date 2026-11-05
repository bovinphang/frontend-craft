# Frontend refactoring contracts

Shared behavior preservation, baseline, risk and diff-budget rules live in the [common method](common/refactoring.md).

Additional frontend evidence covers:

- Props, emits, slots, hooks/composables, identity and lifecycle.
- DOM, loading/error/empty states, focus, keyboard and accessibility.
- Routes, URLs, lazy loading, SSR/hydration and dynamic registration.
- Requests, authentication, cancellation, retries, cache keys, optimistic updates and state ownership.
- Exports, i18n keys, Storybook, generated templates and dynamic Tailwind classes.

Use callers, dependency direction, data ownership and actual verification as evidence; line count alone does not establish a structural problem.
