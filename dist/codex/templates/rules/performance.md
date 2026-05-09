# 前端性能规则

凡是新增页面、组件、资源加载或数据请求时，都应用本文件。

## 核心原则

- 默认懒加载，按需加载
- 减少首屏关键资源
- 避免不必要的重渲染
- 关注 Core Web Vitals

## 代码分割与懒加载

### 路由级分割

```tsx
// React
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Vue
const Dashboard = () => import('./pages/Dashboard.vue');
```

### 组件级分割

仅在以下场景使用组件级懒加载：

- 重型第三方库（图表、编辑器、地图）
- 条件渲染的大型模块（如设置面板、高级筛选）
- 不在首屏可视区域的内容

## 渲染性能

### React

- 合理使用 `React.memo` 避免不必要的重渲染
- `useMemo` / `useCallback` 仅在依赖稳定且子组件使用 memo 时才有意义
- 列表渲染必须使用稳定的 `key`
- 避免在渲染函数内创建新对象、数组或函数

### Vue

- 使用 `computed` 而非 `watch` + 手动赋值
- 大列表使用虚拟滚动
- 避免在 `v-for` 中使用 `v-if`
- 使用 `shallowRef` / `shallowReactive` 优化大型对象

## 资源优化

- 图片使用 WebP/AVIF 格式，提供适当尺寸
- 图标优先使用 SVG sprite 或 icon font，避免大量独立图片请求
- 字体按需加载，使用 `font-display: swap`
- 第三方依赖按需导入（如 `import { Button } from 'antd'` 而非 `import antd from 'antd'`）

## 数据请求

- 避免瀑布式请求（串行依赖），尽可能并行
- 合理使用缓存策略（SWR / React Query / VueQuery）
- 分页加载或虚拟滚动处理大数据集
- 防抖/节流处理高频触发的请求（搜索、滚动）

## 检查清单

- [ ] 路由是否按需加载
- [ ] 重型组件是否懒加载
- [ ] 大列表是否使用虚拟滚动或分页
- [ ] 图片是否使用现代格式和合理尺寸
- [ ] 第三方库是否按需导入
- [ ] 是否存在不必要的重渲染

## 反模式

- 将所有路由打包在一个 chunk 中
- 在首屏加载整个图表库或编辑器
- 在组件内重复创建相同的 API 请求
- 大列表不做虚拟化直接渲染数千行 DOM
- 频繁操作（如输入、滚动）不做防抖/节流
