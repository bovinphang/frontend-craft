# Vue rules

This file applies when the repository or target module uses Vue.

## Technology stack

<!-- Please modify according to the actual situation of the project -->

- Framework: Vue 3 + TypeScript
- Status management: Pinia
- UI component library: Actual selection by project (e.g. Element Plus, Naive UI, Vant or in-house Design System)
- Versions and dependencies: Before creating a new module, supplementing `package.json` or updating this section, give priority to using mainstream stable versions that are compatible with each other (align with official documents, scaffolding defaults or package manager recommendations) to avoid mixing dependencies that have stopped maintaining or do not match the major of the mainline of the warehouse.

## Vue component specification

- Use `<script setup lang="ts">`
- Explicit use of `defineProps` and `defineEmits`
- Keep template logic simple and readable
- Extract reusable logic into composables
- Prefer computed over large-scale watchers
- Keep component responsibilities focused and avoid god components
- Try to use strong types for props, emits, refs and expose methods

## Vue Implementation Guide

Before creating a new component:

1. First search whether there are reusable components in the project
2. Determine whether the logic is suitable for extraction into composable
3. Check whether the style should inherit surrounding existing patterns

When editing a Vue component:

- Where possible, don’t put API calls directly into purely presentational components
- Do not inline large sections of business logic in component files
- Don't repeatedly maintain state that can be derived from props or stores
- Event payload should be clear and type-constrained

## Vue file organization

Prioritize compliance with existing project agreements.
Common output may include:

- `ComponentName.vue`
- `types.ts`
- `useXxx.ts`
- Add local style files only if they conform to the warehouse mode

## Component file size

- A single `.vue` file or the same component module maintains a single responsibility, clear semantics, and easy maintenance.
- **Row number reference**: Prioritize control within about **300 lines**; more than **500 lines** should be regarded as a **strong split signal**.
- **Situations that should be split even if it is less than 500 lines**: if there are **complex responsive states**, **too many side effects/watch**, **templates nested too deeply**, **`<script setup>` internal logic is too long**, dense conditional branches, etc., they should be split into **subcomponents**, **Composables**, **tool modules**, **constants** and **type definitions**, etc. (consistent with the "Vue component specification" and "Vue file organization" above).

## Vue anti-patterns

Avoid:

- Used wide range watcher instead of computed
- Use `any` for props, emits or refs without reason
- The template branch level is too deep but not extracted
- Mixing unrelated responsibilities into a component
- A single `.vue` **exceeds 500 lines or is too complex** and still refuses to be split (see "Component file size" above)
- Use large-scale global style coverage to solve local UI problems
