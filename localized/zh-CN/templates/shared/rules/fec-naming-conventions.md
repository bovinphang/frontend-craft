# 命名规范

## 文件与目录命名

| 类型 | 命名风格 | 示例 |
|------|----------|------|
| 页面组件 | PascalCase + `Page` 后缀 | `UserDetailPage.tsx` / `UserDetailPage.vue` |
| 布局组件 | PascalCase + `Layout` 后缀 | `MainLayout.tsx` / `MainLayout.vue` |
| 通用组件 | PascalCase | `DataTable.tsx` / `AppButton.vue` |
| Hooks / Composables | camelCase + `use` 前缀 | `useAuth.ts`、`useDebounce.ts` |
| Store 文件 | camelCase + `Store` 后缀 | `authStore.ts`、`uiStore.ts` |
| API 文件 | camelCase | `api.ts` 或按领域命名 `userApi.ts` |
| 工具函数 | camelCase | `format.ts`、`validators.ts` |
| 类型文件 | camelCase | `types.ts`、`models.ts` |
| 常量文件 | camelCase | `constants.ts`、`config.ts` |
| 测试文件 | 与源文件同名 + `.spec` / `.test` | `Button.spec.tsx`、`useAuth.spec.ts` |
| 样式文件 | 组件名 + `.styles` + 扩展名 | `Button.styles.css`、`DataTable.styles.scss`；使用 styled-components 时为 `ComponentName.styles.ts` |
| 语言包 | 语言代码（BCP 47） | `zh-CN.json`、`en-US.json` |
| 目录名 | PascalCase（组件/页面）或 kebab-case（功能模块） | `UserDetail/`、`auth/`、`order/` |

## 组件命名

### React

```tsx
// 文件名与组件名一致
// src/components/DataTable/DataTable.tsx
export function DataTable({ data, columns }: DataTableProps) { ... }

// 页面组件加 Page 后缀
// src/pages/UserDetail/UserDetailPage.tsx
export default function UserDetailPage() { ... }
```

### Vue

```vue
<!-- 文件名与组件名一致 -->
<!-- src/components/AppButton/AppButton.vue -->
<script setup lang="ts">
// 无需 defineOptions，文件名即组件名
</script>
```

- 多词组件名（避免与 HTML 原生标签冲突）
- Vue 全局组件推荐使用 `App` 前缀（`AppButton`、`AppModal`）
- 模板中使用 PascalCase 引用：`<AppButton>` 而非 `<app-button>`

## 变量与函数命名

| 类型 | 命名风格 | 示例 |
|------|----------|------|
| 普通变量 | camelCase | `userName`、`isLoading`、`pageSize` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`、`DEFAULT_PAGE_SIZE` |
| 布尔值 | `is` / `has` / `should` / `can` 前缀 | `isVisible`、`hasPermission`、`canEdit` |
| 事件处理（组件内） | `handle` 前缀 | `handleClick`、`handleSubmit` |
| 回调 Props | `on` 前缀 | `onClick`、`onSubmit`、`onChange` |
| 数组 | 复数名词 | `users`、`orderItems`、`selectedIds` |
| Map / Record | `xxxMap` 或 `xxxByYyy` | `userMap`、`permissionsById` |
| Ref (Vue) | 不加 `Ref` 后缀 | `count`（不用 `countRef`） |
| 接口 | PascalCase，不加 `I` 前缀 | `UserProfile`（不用 `IUserProfile`） |
| Props 接口 | 组件名 + `Props` | `DataTableProps`、`UserFormProps` |
| Emits 接口 | 组件名 + `Emits` | `UserFormEmits` |
| 枚举 | PascalCase，成员用 PascalCase | `OrderStatus.Pending` |
| 泛型参数 | 单字母大写或语义化 | `T`、`TData`、`TItem` |

## CSS 类命名

- 与项目约定保持一致（BEM / CSS Modules / Tailwind / Atomic CSS）
- 如果使用 CSS Modules，类名用 camelCase：`.headerTitle`、`.cardBody`
- 如果使用 BEM，遵循 `block__element--modifier` 格式
- CSS 变量使用 kebab-case：`--color-primary`、`--spacing-md`

## 路由命名

| 类型 | 命名风格 | 示例 |
|------|----------|------|
| 路由路径 | kebab-case | `/user-detail`、`/order-list` |
| 路由名称 | PascalCase | `UserDetail`、`OrderList` |
| 路由参数 | camelCase | `:userId`、`:orderId` |
| 查询参数 | camelCase | `?pageSize=10&sortBy=name` |
| 路径常量 | UPPER_SNAKE_CASE | `ROUTE_USER_DETAIL = '/user-detail'` |

## API 命名

| 类型 | 命名风格 | 示例 |
|------|----------|------|
| GET 列表 | `getXxxList` | `getUserList(params)` |
| GET 单条 | `getXxxDetail` / `getXxxById` | `getUserDetail(id)` |
| POST 创建 | `createXxx` | `createOrder(data)` |
| PUT 更新 | `updateXxx` | `updateUser(id, data)` |
| DELETE 删除 | `deleteXxx` | `deleteOrder(id)` |
| DTO 类型 | 动词 + 名词 + `DTO` | `CreateOrderDTO`、`UpdateUserDTO` |
| 响应类型 | 名词 | `User`、`Order`、`PageResult<User>` |

## i18n Key 命名

- 使用点分命名空间：`module.section.label`
- 示例：`user.form.username`、`common.button.submit`、`error.network.timeout`
- 不使用中文 / 拼音作为 key

## 反模式

- 文件名和组件名不一致（`user-table.tsx` 导出 `DataGrid`）
- 同一项目混用多种命名风格（有的 kebab-case 有的 PascalCase）
- 使用缩写或不明确的名称（`btn`、`usr`、`tmp`、`handleA`）
- 布尔值没有语义前缀（`visible` → 应为 `isVisible`）
- 常量不用大写（`maxRetry` → 应为 `MAX_RETRY`）
- CSS 变量硬编码在组件中而非使用统一变量

## 检查清单

- [ ] 文件名与导出的组件/函数名一致
- [ ] 页面组件有 `Page` 后缀，布局组件有 `Layout` 后缀
- [ ] 布尔变量使用 `is` / `has` / `can` / `should` 前缀
- [ ] 事件处理用 `handle` 前缀，回调 Props 用 `on` 前缀
- [ ] 常量使用 UPPER_SNAKE_CASE
- [ ] 路由路径使用 kebab-case，路由名使用 PascalCase
- [ ] API 函数命名与 HTTP 方法语义一致
- [ ] i18n key 使用点分命名空间，无硬编码文案
