---
name: scaffold
description: 按项目规范创建 page、feature 或 component 的标准目录结构和样板文件。用法：/scaffold <type> <Name>，如 /scaffold page UserDetail
---

按项目约定的目录结构创建新的 page、feature 或 component。

## 依赖与版本

若本次脚手架涉及新增或建议 `package.json` 依赖，遵循项目 `.claude/rules/react.md` 或 `.claude/rules/vue.md` 中「版本与依赖」约定；项目中尚无对应规则时，优先采用彼此兼容的主流稳定版本（对齐官方文档、脚手架默认值或包管理器推荐）。

## 参数解析

从 `$ARGUMENTS` 中解析两个参数：
- **type**: `page` | `feature` | `component`（必填）
- **name**: 模块名称，使用 PascalCase（必填）

如果参数缺失，提示用法示例并要求用户补充：
```
用法：/frontend-craft:scaffold <type> <Name>
示例：
  /frontend-craft:scaffold page UserDetail
  /frontend-craft:scaffold feature payment
  /frontend-craft:scaffold component DataTable
```

## 执行步骤

### 1. 检测项目框架

检查 `package.json` 的 `dependencies`：
- 包含 `react` → React 项目
- 包含 `vue` → Vue 项目
- 都不包含 → 提示用户手动指定

### 2. 确定目标路径

检查 `src/` 目录是否存在，确定基础路径：
- page → `src/pages/<Name>/`
- feature → `src/features/<name>/`（name 转为 kebab-case）
- component → `src/components/<Name>/`

如果目标目录已存在，提示用户确认是否继续。

### 3. 创建目录和文件

根据框架和类型，创建以下结构：

#### React page

```
src/pages/<Name>/
├── <Name>Page.tsx
├── components/
│   └── .gitkeep
└── hooks/
    └── .gitkeep
```

`<Name>Page.tsx` 内容：

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
│   └── .gitkeep
├── hooks/
│   └── .gitkeep
├── api.ts
├── types.ts
├── constants.ts
└── index.ts
```

`index.ts` 内容：

```typescript
export * from './types';
export * from './constants';
```

`api.ts` 内容：

```typescript
import { request } from '@/services/request';
```

`types.ts` 和 `constants.ts` 创建为空文件（仅有注释说明用途）。

#### React component

```
src/components/<Name>/
├── <Name>.tsx
├── <Name>.styles.css
└── __tests__/
    └── <Name>.spec.tsx
```

`<Name>.tsx` 内容：

```tsx
import styles from './<Name>.styles.css';

interface <Name>Props {
    // TODO: 定义 props
}

export function <Name>({ }: <Name>Props) {
    return (
        <div className={styles.root}>
            <Name>
        </div>
    );
}
```

#### Vue page

```
src/pages/<Name>/
├── <Name>Page.vue
├── components/
│   └── .gitkeep
└── composables/
    └── .gitkeep
```

`<Name>Page.vue` 内容：

```vue
<script setup lang="ts">
// TODO: 页面逻辑
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
│   └── .gitkeep
├── composables/
│   └── .gitkeep
├── api.ts
├── types.ts
├── constants.ts
└── index.ts
```

`index.ts` 内容与 React 相同。

#### Vue component

```
src/components/<Name>/
├── <Name>.vue
└── __tests__/
    └── <Name>.spec.ts
```

`<Name>.vue` 内容：

```vue
<script setup lang="ts">
interface Props {
    // TODO: 定义 props
}

const props = defineProps<Props>();
</script>

<template>
    <div>
        <Name>
    </div>
</template>

<style scoped>
</style>
```

### 4. 输出确认

创建完成后，输出：
- 创建的文件清单
- 下一步建议（如"在路由配置中注册新页面"、"在 index.ts 中导出公开 API"）
