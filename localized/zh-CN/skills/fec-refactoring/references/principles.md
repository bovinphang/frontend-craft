# 前端重构观察契约

通用行为保持原则、基线、风险和差异预算遵循[公共方法](common/refactoring.md)。

前端需要额外确认：

- props、emits、slots、hooks/composables 的返回值、身份及生命周期。
- DOM、loading/error/empty 状态、焦点、键盘与可访问性。
- 路由、URL、懒加载、SSR/hydration、动态注册。
- 请求、认证、取消、重试、缓存标识、乐观更新和状态归属。
- 导出、i18n 键、Storybook、生成模板及 Tailwind 动态 class。

从调用点、依赖方向、数据所有权和实际验证取得证据，不用代码行数独自证明结构问题。
