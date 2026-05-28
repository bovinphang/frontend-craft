# UI/UX 交付前检查

## Critical

- 文本对比度：正文至少 4.5:1，大字号至少 3:1。
- 键盘可达：菜单、弹窗、标签页、抽屉和自定义控件都能键盘操作。
- 焦点可见：focus ring 不能被全局样式移除。
- 图标按钮：必须有可访问名称。
- 触摸目标：移动端主要交互至少 44x44px；空间允许时使用 48px。

## High

- 首屏：工具型界面直接展示核心工作区，不用营销 hero 替代功能。
- 响应式：375px、768px、1024px、1440px 无水平溢出、遮挡或文本截断。
- 性能：图片有尺寸或 aspect-ratio；非首屏图片懒加载；列表过大时虚拟化。
- 动效：只动画 transform/opacity，尊重 `prefers-reduced-motion`。
- 状态：loading、empty、error、disabled、hover、focus、selected 都有设计。

## Medium

- 字体：正文不小于 16px；数字列、金额、计时器使用 tabular nums。
- 颜色：错误、成功、警告不只靠颜色表达。
- 表单：label 常驻，错误靠近字段，提交后有 loading/success/error。
- 导航：当前路由可识别，返回行为可预测，深层页面仍能回到主路径。
- 图表：有标题、单位、图例、tooltip 或明细表替代，色彩不依赖红绿区分。

## Anti-Patterns

- 用装饰光斑、紫色渐变、卡片堆叠掩盖信息结构不足。
- hover 导致布局位移。
- `transition: all`、`will-change: all`。
- 低对比灰字、无意义透明度、单一色相界面。
- 空状态只有“暂无数据”，没有下一步动作。
