# Naming convention

## File and directory naming

| Type | Naming Style | Example |
|------|----------|------|
| Page component | PascalCase + `Page` suffix | `UserDetailPage.tsx` / `UserDetailPage.vue` |
| Layout component | PascalCase + `Layout` suffix | `MainLayout.tsx` / `MainLayout.vue` |
| Common components | PascalCase | `DataTable.tsx` / `AppButton.vue` |
| Hooks / Composables | camelCase + `use` prefix | `useAuth.ts`, `useDebounce.ts` |
| Store file | camelCase + `Store` suffix | `authStore.ts`, `uiStore.ts` |
| API documentation | camelCase | `api.ts` or by domain `userApi.ts` |
| Utility functions | camelCase | `format.ts`, `validators.ts` |
| Type files | camelCase | `types.ts`, `models.ts` |
| Constant files | camelCase | `constants.ts`, `config.ts` |
| Test file | Same name as source file + `.spec` / `.test` | `Button.spec.tsx`, `useAuth.spec.ts` |
| Style file | Component name + `.styles` + extension | `Button.styles.css`, `DataTable.styles.scss`; `ComponentName.styles.ts` when using styled-components |
| Language pack | Language code (BCP 47) | `zh-CN.json`, `en-US.json` |
| Directory name | PascalCase (component/page) or kebab-case (function module) | `UserDetail/`, `auth/`, `order/` |

## Component naming

### React

```tsx
//The file name is consistent with the component name
// src/components/DataTable/DataTable.tsx
export function DataTable({ data, columns }: DataTableProps) { ... }

//Add Page suffix to page component
// src/pages/UserDetail/UserDetailPage.tsx
export default function UserDetailPage() { ... }
```

### Vue

```vue
<!-- The file name is consistent with the component name -->
<!-- src/components/AppButton/AppButton.vue -->
<script setup lang="ts">
// No need for defineOptions, the file name is the component name
</script>
```

- Multi-word component names (to avoid conflicts with HTML native tags)
- Vue global components are recommended to use the `App` prefix (`AppButton`, `AppModal`)
- Use PascalCase reference in template: `<AppButton>` instead of `<app-button>`

## Variable and function naming

| Type | Naming Style | Example |
|------|----------|------|
| Ordinary variables | camelCase | `userName`, `isLoading`, `pageSize` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| Boolean value | `is` / `has` / `should` / `can` prefix | `isVisible`, `hasPermission`, `canEdit` |
| Event handling (inside component) | `handle` prefix | `handleClick`, `handleSubmit` |
| Callback Props | `on` prefix | `onClick`, `onSubmit`, `onChange` |
| Array | Plural noun | `users`, `orderItems`, `selectedIds` |
| Map / Record | `xxxMap` or `xxxByYyy` | `userMap`, `permissionsById` |
| Ref (Vue) | Without `Ref` suffix | `count` (without `countRef`) |
| Interface | PascalCase, without `I` prefix | `UserProfile` (without `IUserProfile`) |
| Props interface | component name + `Props` | `DataTableProps`, `UserFormProps` |
| Emits interface | component name + `Emits` | `UserFormEmits` |
| Enum | PascalCase, members use PascalCase | `OrderStatus.Pending` |
| Generic parameters | Single letter capitalization or semantic | `T`, `TData`, `TItem` |

## CSS class naming

- Aligned with project conventions (BEM/CSS Modules/Tailwind/Atomic CSS)
- If using CSS Modules, use camelCase for class names: `.headerTitle`, `.cardBody`
- If using BEM, follow the `block__element--modifier` format
- CSS variables use kebab-case: `--color-primary`, `--spacing-md`

## Route naming

| Type | Naming Style | Example |
|------|----------|------|
| routing path | kebab-case | `/user-detail`, `/order-list` |
| Route name | PascalCase | `UserDetail`, `OrderList` |
| Routing parameters | camelCase | `:userId`, `:orderId` |
| Query parameters | camelCase | `?pageSize=10&sortBy=name` |
| Path constants | UPPER_SNAKE_CASE | `ROUTE_USER_DETAIL = '/user-detail'` |

## API naming

| Type | Naming Style | Example |
|------|----------|------|
| GET list | `getXxxList` | `getUserList(params)` |
| GET single item | `getXxxDetail` / `getXxxById` | `getUserDetail(id)` |
| POST Create | `createXxx` | `createOrder(data)` |
| PUT update | `updateXxx` | `updateUser(id, data)` |
| DELETE delete | `deleteXxx` | `deleteOrder(id)` |
| DTO type | Verb + Noun + `DTO` | `CreateOrderDTO`, `UpdateUserDTO` |
| Response type | Noun | `User`, `Order`, `PageResult<User>` |

## i18n Key naming

- Use dotted namespace: `module.section.label`
- Examples: `user.form.username`, `common.button.submit`, `error.network.timeout`
- Do not use Chinese/Pinyin as key

## Anti-pattern

- File name and component name are inconsistent (`user-table.tsx` exports `DataGrid`)
- Mixing multiple naming styles (some kebab-case, some PascalCase) in the same project
- Use abbreviated or ambiguous names (`btn`, `usr`, `tmp`, `handleA`)
- Boolean values have no semantic prefix (`visible` → should be `isVisible`)
- Constants do not need to be capitalized (`maxRetry` → should be `MAX_RETRY`)
- CSS variables are hardcoded in components instead of using uniform variables

## Checklist

- [ ] The file name is consistent with the exported component/function name
- [ ] Page components have the `Page` suffix, and layout components have the `Layout` suffix.
- [ ] Boolean variables use `is` / `has` / `can` / `should` prefixes
- [ ] Event handling is prefixed with `handle`, callback Props are prefixed with `on`
- [ ] constant using UPPER_SNAKE_CASE
- [ ] Use kebab-case for the routing path and PascalCase for the routing name.
- [ ] API function naming is consistent with HTTP method semantics
- [ ] i18n key uses dotted namespace, no hardcoded copy
