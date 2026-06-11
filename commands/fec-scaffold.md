---
name: fec-scaffold
description: Create a standard directory structure and template files for pages, features, or components according to project specifications. Usage: /fec-scaffold <type> <Name>, such as /fec-scaffold page UserDetail
---

Create new pages, features or components according to the directory structure agreed upon by the project.

## Dependencies and versions

If this scaffolding involves adding or recommending `package.json` dependencies, follow the "version and dependency" conventions in the project `.claude/rules/fec-react.md` or `.claude/rules/fec-vue.md`; if there is no corresponding rule in the project, priority will be given to mainstream stable versions that are compatible with each other (align with official documents, scaffolding default values or package manager recommendations).

## Parameter analysis

Parse two arguments from `$ARGUMENTS`:
- **type**: `page` | `feature` | `component` (required)
- **name**: module name, using PascalCase (required)

If a parameter is missing, a usage example is prompted and the user is asked to add:
```
Usage: /fec-scaffold <type> <Name>
Example:
  /fec-scaffold page UserDetail
  /fec-scaffold feature payment
  /fec-scaffold component DataTable
```

## Execution steps

### 1. Detection project framework

Check `package.json` for `dependencies`:
- Contains `react` → React project
- Contains `vue` → Vue project
- None → Prompt user to specify manually

### 2. Detect project conventions and determine target paths

Check `src/`, `app/`, `pages/`, `features/`, `components/`, `__tests__/`, `tests/`, `vitest.config.*`, `jest.config.*`, `playwright.config.*` and existing component naming. Give priority to reusing existing directories of the project; only use the default path when there is no existing agreement:
- page → `src/pages/<Name>/`
- feature → `src/features/<name>/` (name is converted to kebab-case)
- component → `src/components/<Name>/`

If the target directory already exists, the user is prompted to confirm whether to continue.

### 3. Create directories and files

Depending on the frame and type, create the following structures:

#### React page

```
src/pages/<Name>/
├── <Name>Page.tsx
├── components/
│ └── .gitkeep
└── hooks/
    └── .gitkeep
```

`<Name>Page.tsx` Content:

```tsx
export default function <Name>Page() {
    return (
        <div>
            <h1><Name></h1>
        </div>
    );
}
```

#### React feature

```
src/features/<name>/
├── components/
│ └── .gitkeep
├── hooks/
│ └── .gitkeep
├── api.ts
├── types.ts
├── constants.ts
└── index.ts
```

`index.ts` content:

```typescript
export * from './types';
export * from './constants';
```

`api.ts` content (only import the corresponding client when the project already has `src/services/request.*`, `src/lib/request.*`, `src/api/client.*` or a similar API client; otherwise, keep the empty export to avoid creating non-existent alias dependencies):

```typescript
export {};
```

`types.ts` and `constants.ts` are created as empty files or minimally empty exports.

#### React component

```
src/components/<Name>/
├── <Name>.tsx
├── <Name>.styles.css
└── __tests__/
    └── <Name>.spec.tsx
```

`<Name>.tsx` Content:

```tsx
import './<Name>.styles.css';

interface <Name>Props {
    children?: React.ReactNode;
}

export function <Name>({ children }: <Name>Props) {
    return (
        <div className="<name>">
            {children}
        </div>
    );
}
```

#### Vue page

```
src/pages/<Name>/
├── <Name>Page.vue
├── components/
│ └── .gitkeep
└── composables/
    └── .gitkeep
```

`<Name>Page.vue` Content:

```vue
<script setup lang="ts">
</script>

<template>
    <div>
        <h1><Name></h1>
    </div>
</template>

<style scoped>
</style>
```

#### Vue feature

```
src/features/<name>/
├── components/
│ └── .gitkeep
├── composables/
│ └── .gitkeep
├── api.ts
├── types.ts
├── constants.ts
└── index.ts
```

`index.ts` content is the same as React.

#### Vue component

```
src/components/<Name>/
├── <Name>.vue
└── __tests__/
    └── <Name>.spec.ts
```

`<Name>.vue` Content:

```vue
<script setup lang="ts">
interface Props {
}

const props = defineProps<Props>();
</script>

<template>
    <div>
        <slot />
    </div>
</template>

<style scoped>
</style>
```

### 4. Output confirmation

After creation is completed, output:
- List of files created
- Next step suggestions (such as "Register new page in routing configuration", "Export public API in index.ts")