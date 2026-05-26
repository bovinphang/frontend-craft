# 响应式设计规则

凡是任务涉及移动端适配、响应式布局、多端兼容时，都应用本文件。

## 核心原则

- **移动优先**: 从小屏幕开始设计，逐步增强到大屏幕
- **内容优先**: 移动端优先展示核心内容，次要内容折叠或延后
- **触摸友好**: 所有交互元素必须适配手指操作
- **性能优先**: 移动端网络和设备性能较弱，需优化加载

## 断点策略

| 断点        | 宽度   | 设备            | Tailwind | 说明                 |
| ----------- | ------ | --------------- | -------- | -------------------- |
| **Mobile**  | 375px  | 手机竖屏        | （默认） | 基础样式，无媒体查询 |
| **Tablet**  | 768px  | 平板 / 手机横屏 | `md:`    | 两列布局起点         |
| **Desktop** | 1024px | 笔记本          | `lg:`    | 完整布局             |
| **Large**   | 1280px | 桌面显示器      | `xl:`    | 宽屏优化             |
| **XLarge**  | 1536px | 超宽屏          | `2xl:`   | 最大内容宽度         |

### 移动优先 CSS

```css
/* 基础样式 — 移动端 */
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Tablet — 768px+ */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    flex-direction: row;
    gap: 24px;
  }
}

/* Desktop — 1024px+ */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
    margin: 0 auto;
    padding: 32px;
  }
}
```

### Tailwind 移动优先

Tailwind 默认移动优先，无前缀类作用于所有屏幕，前缀仅覆盖更大断点：

```html
<!-- 移动端: 单列, 小间距 | Tablet: 双列 | Desktop: 三列 -->
<div
  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
>
  <!-- 卡片: 移动端小字, Desktop 大字 -->
  <div class="p-4 md:p-6 text-sm md:text-base">...</div>
</div>

<!-- 导航: 移动端隐藏, Desktop 显示 -->
<nav class="hidden md:flex">...</nav>

<!-- 移动端汉堡菜单, Desktop 隐藏 -->
<button class="md:hidden" aria-label="菜单">☰</button>
```

**关键约定**：

- 始终使用 `min-width` 媒体查询（mobile-first），不用 `max-width`
- Tailwind 前缀从小到大：`sm:` → `md:` → `lg:` → `xl:`
- 不要在桌面端写默认样式然后用 `max-width` 覆盖移动端

## 触摸目标

| 元素        | 最小尺寸  | 说明                        |
| ----------- | --------- | --------------------------- |
| 按钮        | 44×44px   | WCAG 2.1 触摸目标要求       |
| 链接        | 44×44px   | 可通过 padding 扩大点击区域 |
| 表单输入    | 44px 高度 | 避免 iOS 自动缩放           |
| 复选框/单选 | 24×24px   | 最小可见尺寸                |
| 关闭按钮    | 44×44px   | 模态框、Toast 的关闭按钮    |

```css
/* 扩大点击区域（视觉尺寸不变） */
.icon-button {
  width: 24px;
  height: 24px;
  padding: 10px; /* 实际点击区域 44×44 */
}

/* 表单输入 — 避免 iOS 缩放 */
input,
select,
textarea {
  font-size: 16px; /* < 16px 时 iOS Safari 会自动缩放页面 */
}
```

## 布局模式

### Stack → Row

移动端纵向堆叠，桌面端横向排列：

```html
<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1">主内容</div>
  <div class="md:w-64 md:flex-shrink-0">侧边栏</div>
</div>
```

### 响应式表格

```html
<!-- 小屏横向滚动 -->
<div class="overflow-x-auto">
  <table class="min-w-full">
    ...
  </table>
</div>

<!-- 或：移动端卡片式布局 -->
<div class="hidden md:block">
  <table>
    ...
  </table>
</div>
<div class="md:hidden">
  <!-- 每行变为卡片 -->
</div>
```

### 响应式图片

```html
<!-- srcset 按设备像素比加载 -->
<img
  src="/img/hero-800.jpg"
  srcset="
    /img/hero-400.jpg   400w,
    /img/hero-800.jpg   800w,
    /img/hero-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 800px"
  alt="描述"
  loading="lazy"
/>

<!-- picture 元素按断点切换 -->
<picture>
  <source
    media="(min-width: 1024px)"
    srcset="/img/hero-desktop.webp"
    type="image/webp"
  />
  <source
    media="(min-width: 768px)"
    srcset="/img/hero-tablet.webp"
    type="image/webp"
  />
  <img src="/img/hero-mobile.webp" alt="描述" loading="lazy" />
</picture>
```

## 移动端交互注意

- **悬停不可靠**: 移动端无 hover 状态，不要将关键功能隐藏在 hover 中（如 tooltip 改为点击触发）
- **键盘弹出**: 移动端虚拟键盘会缩小可视区域，固定定位元素需注意位置调整
- **滚动性能**: 使用 `-webkit-overflow-scrolling: touch`（iOS）或 `overscroll-behavior` 优化滚动体验
- **安全区域**: 适配 iPhone 刘海/底部横条，使用 `env(safe-area-inset-*)`：

```css
.app-content {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

## 测试策略

- 使用 Chrome DevTools Device Mode 测试主流设备
- 优先在真实设备上测试（iOS Safari / Android Chrome）
- 测试方向切换（横屏 / 竖屏）
- 测试不同网络条件（3G / 4G / 弱网）
- 不要假设桌面端是"默认"，移动端优先验证

## 检查清单

- [ ] 375px 宽度下布局正常，无水平溢出
- [ ] 所有交互元素 ≥ 44×44px（触摸目标）
- [ ] 输入框 font-size ≥ 16px（避免 iOS 缩放）
- [ ] 无 hover 依赖的关键功能
- [ ] 图片使用 srcset / picture 按设备加载
- [ ] iPhone 安全区域适配（safe-area-inset）
- [ ] 内容在断点间平滑过渡，无突变
