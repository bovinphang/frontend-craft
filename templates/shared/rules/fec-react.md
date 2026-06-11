# React rules

This file applies when the repository or target module uses React.

## Technology stack

<!-- Please modify according to the actual situation of the project -->

- Framework: React + TypeScript
- Style: Tailwind CSS + CSS Modules
- Status management: Zustand / Redux Toolkit / Jotai (select according to the actual project)
- UI component library: actual selection by project (such as Ant Design, Material UI or internal Design System)
- Versions and dependencies: Before creating a new module, supplementing `package.json` or updating this section, give priority to using mainstream stable versions that are compatible with each other (align with official documents, scaffolding defaults or package manager recommendations) to avoid mixing dependencies that have stopped maintaining or do not match the major of the mainline of the warehouse.

## React component specification

- Use **Function Components**, Hooks and TypeScript; **Do not** add new class components (including handwritten Error Boundary, use `react-error-boundary` and other libraries)
- Keep components small and composable
- Extract reusable logic into hooks
- Keep props explicit and clearly typed
- Maintain accessibility with keyboard interaction
- Prioritize the use of deducible state to avoid repeated state maintenance
- Reuse existing design systems before creating new base components
- It is forbidden to use any, prefer unknown
- CSS naming follows BEM (CSS Modules scenario)

## Patterns and Best Practices (React)

- **Composition**: Use widgets + `children`/props to assemble; avoid wide boolean props and fake "inheritance".
- **Composite component**: The root component uses Context to expose state to sub-components; sub-components explicitly report an error when Context is missing.
- **Render Props**: Only considered when it is necessary to encapsulate the data state and hand over the rendering to the upper layer; in most scenarios, custom Hook + ordinary components are given priority.
- **Context + useReducer**: Medium complexity multi-subtree client state; do not put high-frequency changing large objects in the top-level Context; use React Query / SWR for server-side data.
- **Form**: Prioritize medium and large forms with React Hook Form + Zod; avoid single-file giant controlled state.
- **Error Boundary**: Key modules use **`react-error-boundary`** (or a similar library unified by the team) to cover the module boundaries; business components must be functional, and no handwritten class components Error Boundary.
- **Performance**: Use `useMemo`/`useCallback`/`React.memo` on demand; use virtual lists for long lists (such as TanStack Virtual, react-window); pay attention to immutable derivation for expensive calculations (do not `sort` the original array in place).
- **Motion**: Framer Motion or CSS transition; respect `prefers-reduced-motion`.
- **Accessibility**: Compound controls complement `role`/`aria-*` and keyboard operations; pop-up window management focus is dropped and restored after closing.
- **Next.js**: The relevant agreements between App Router and Server Components are subject to the project Next rules.

## React Implementation Guide

Before creating a new component:

1. First search whether equivalent components already exist
2. Determine whether the logic should be put into a custom hook
3. Be consistent with the current style scheme of the project

When editing a React component:

- Avoid mixing data requests, heavy business logic and presentation logic in the same file
- Avoid designing props APIs that are too broad or have unclear semantics
- Avoid abusing context for local problems
- Keep conditional rendering readable and extract duplicate branches if necessary

## React file organization

Priority is given to following existing agreements in the warehouse.
Common output may include:

- `Component.tsx`
- `Component.types.ts`
- `hooks/useComponentLogic.ts`
- `ComponentName.styles.css` (plain CSS / CSS Modules; `ComponentName.styles.ts` when using styled-components)
- If the warehouse uses nearby testing, add test files, such as: `__tests__/Component.spec.tsx`

## Component file size

- A single component file maintains a single responsibility, clear semantics, and is easy to maintain.
- **Line number reference**: Prioritize the single file to be controlled within about **300 lines**; more than **500 lines** should be regarded as a **strong splitting signal**.
- **Situations that should be split even if it is less than 500 lines**: There are **complex state interleaving**, **too many side effects**, **JSX too deep nesting**, **dense conditional branches**, data acquisition and UI are mixed in the same file for a long time, etc., making it difficult to grasp a single file at a glance. It should be split into independent units such as **subcomponents**, **custom Hooks**, **tool functions**, **constants** and **type definitions** (the directory and naming still follow the "React file organization" above).

## React anti-patterns

Avoid:

- Create a new **class component** or handwritten class Error Boundary (function component + `react-error-boundary`, etc. should be used)
- Use redundant state for derivable values
- Large sections of JSX are not broken into subcomponents
- A single file is stacked with too many responsibilities and lines. It exceeds 500 lines or has high complexity and still refuses to be split (see "Component file size" above)
- Use unstable keys
- Use `any` in props and hooks without reason
- Introduce a second style system when there is no good reason
