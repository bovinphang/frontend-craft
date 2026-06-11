# Vue 3 性能模式

本文件保留轻量级 Vue 项目规范性能指导。当任务需要指标、trace、profile、包体分析、网络证据或正式性能报告时，使用前端性能工作流。

## 性能

- 使用 `shallowRef` / `shallowReactive` 优化大型对象
- 大列表使用虚拟滚动
- 避免在 `v-for` 中使用 `v-if`（提取为 computed 过滤）
- 使用 `defineAsyncComponent` 懒加载重型组件
- `v-for` 必须有稳定的 `:key`
- 路由组件使用动态 `import()` 按需加载

