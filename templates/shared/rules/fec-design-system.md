# 设计系统规则

凡是任务涉及 UI 实现、设计稿转代码、样式、设计 Token 或组件复用时，都应用本文件。

## 核心优先级

按以下顺序优先处理：

1. 复用已有组件
2. 在已有组件上扩展
3. 创建新的叶子组件
4. 只有在理由非常充分时，才创建新的共享基础组件

## 产品化设计方向

开始 UI 实现前，先明确界面语气：

- 工具型页面、SaaS 后台、CRM、运营台：优先安静、密集、可扫描，首屏直接呈现核心工作区
- 品牌页、作品集、发布页：可以更有表现力，但 H1 应是品牌/产品/对象/品类，说明文案放在副标题
- 可视化、游戏、创作工具：可以使用更强视觉资产和动效，但必须保持交互可控、状态清晰
- 每个重要界面都应有一个贴合业务的视觉锚点：真实媒体、数据形态、行业材质、字体性格、空间组织或交互节奏
- 大胆设计必须服务场景；高频工具重效率和稳定，展示型页面重主体识别和记忆点

避免：

- 把日常高频工具做成营销落地页
- 默认使用紫色渐变、装饰光斑、堆叠卡片或空泛 hero
- 使用无语境默认字体、平均分布的弱对比配色、模板化双栏 hero 或重复圆角卡片作为通用答案
- 页面区块大面积卡片化，尤其是卡片套卡片
- 用可见说明文字解释常见控件本该表达的功能
- 让整个界面只由一个色相的深浅变化组成

### 视觉语言基线

- 字体：优先复用项目字体体系；新建方向时，标题和正文应形成性格与可读性的分工
- 色彩：区分主色、强调色、状态色和中性色，关键动作与风险状态不能只靠透明度表达
- 动效：只为入场、层级展开、状态确认、错误反馈和重点引导编排节奏，并尊重 `prefers-reduced-motion`
- 空间：根据任务选择高密度、留白、非对称、分栏、画布式或编辑器式布局，不套用固定卡片模板
- 质感：背景、纹理、阴影和透明度应解释层级或语境，不作为无内容装饰

### 设计系统生成与覆盖

- 项目缺少设计方向时，可先生成轻量设计系统建议，再根据真实业务、组件库和数据校正
- `design-system/<project>/MASTER.md` 记录跨页面共享的产品类型、视觉语言、token 方向、动效、图表和 QA 规则
- `design-system/<project>/pages/<page>.md` 只记录页面差异：首屏结构、组件密度、图表选择、状态覆盖和局部 token 调整
- 构建页面或检查 UI 时，先读取页面 override，再读取 Master；页面规则不能复制全量 Master
- 产品类型推理要落到界面决策：行业风险、用户频率、数据密度、触摸/鼠标场景、图表任务和转化路径
- 交付前 QA 至少覆盖可访问性、交互反馈、布局溢出、字体色彩、动效降级、表单、导航和图表可读性

## 设计稿转代码规则

当存在设计上下文时：

- 先通过 MCP 读取设计上下文（Figma / MasterGo / Pixso / 墨刀 / Sketch，摹客则使用截图/标注）
- 设计稿中的颜色/间距 token 必须从 design token 文件中引用
- 如果已有设计上下文，不要靠猜测来决定布局、间距、字体、颜色或状态
- 在创建新组件前，先检查现有组件，优先复用现有组件库中的组件
- 响应式断点: mobile(375px) / tablet(768px) / desktop(1440px)
- 像素还原精度要求: ≥ 95%
- 在改文件前先给出简短实现计划

始终要考虑：

- loading 状态
- empty 状态
- error 状态
- disabled 状态
- hover 状态
- focus 状态
- 在相关场景下的 selected 状态
- 响应式行为

## 设计 Token 规则

- 优先使用已有 design token、CSS 变量或主题变量
- 当已有 Token 可用时，不要硬编码颜色、圆角、间距、阴影和字体取值
- 如果缺少所需 Token，要明确指出，不要悄悄到处硬编码
- Token 使用方式要与周边模块保持一致
- Tailwind 项目中，token 应通过语义化 `theme.extend`、CSS 变量或组件 variant 承接；不要把 `blue-600`、`rounded-xl` 等具体值复制成事实标准
- 组件 variant 应区分语义 tone、尺寸 size、密度 density 和状态 state；不要让一个字符串参数承载多种业务含义
- 动态 Tailwind class 必须可被构建扫描识别；复杂映射使用显式对象、variant 工具或 safelist

## 样式规则

- 优先使用局部、受控的样式，而不是大范围全局覆盖
- 保持当前断点下的响应式行为
- 与项目现有样式体系保持一致
- 检查 hover、active、focus、disabled、selected 等状态
- 除非没有合适 Token 或刻度值，否则不要使用 magic number

### 界面质感基线

- 嵌套圆角保持光学关系：外层圆角约等于内层圆角 + 间距
- 图标按钮、箭头、播放三角等非对称图形按视觉中心微调
- 小控件命中区域至少 40x40px，空间允许时优先 44x44px
- 标题和短文本可用 `text-wrap: balance`，短中正文可用 `text-wrap: pretty`
- 计数器、价格、时间、表格数字使用 `font-variant-numeric: tabular-nums`
- 图片在浅/深色背景上边缘不清时，使用中性 alpha 内描边，不使用品牌色描边
- 动效只声明实际变化属性，禁止 `transition: all` 和 `will-change: all`
- 进入/退出动效要克制，并尊重 `prefers-reduced-motion`

## 暗色模式

提供与系统主题同步的手动切换能力，减少视觉疲劳并满足可访问性要求。

### CSS 变量方案

```css
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #666666;
  --color-border: #e0e0e0;
}

[data-theme="dark"] {
  --color-bg-primary: #1a1a1a;
  --color-bg-secondary: #2a2a2a;
  --color-text-primary: #f0f0f0;
  --color-text-secondary: #a0a0a0;
  --color-border: #404040;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

### Tailwind 方案

```js
// tailwind.config.js
module.exports = {
  darkMode: "class", // 通过 .dark 类控制，而非 prefers-color-scheme
};
```

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <!-- 内容 -->
</div>
```

### 主题切换 Hook

```tsx
import { useState, useEffect } from "react";

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 1. 优先读取用户保存的偏好
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      return;
    }
    // 2. 回退到系统偏好
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return { theme, toggle };
}
```

### FOUC 防护（主题闪烁）

在 `<head>` 中同步执行主题初始化脚本（阻塞渲染），避免首次加载时出现错误的主题色：

```html
<head>
  <script>
    // 同步执行 — 在 body 渲染前确定主题
    (function () {
      const theme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    })();
  </script>
</head>
```

### 暗色模式注意事项

- **图片**: 亮色图片在暗色模式下刺眼，使用 `filter: brightness(0.8)` 降低亮度
- **阴影**: 暗色模式下阴影不明显，改用 `box-shadow: 0 0 15px rgba(255,255,255,0.05)` 或边框替代
- **颜色对比度**: 确保暗色模式下文本与背景的对比度 ≥ 4.5:1（WCAG AA）
- **表单控件**: 输入框、下拉框、开关等原生控件在暗色模式下需要自定义样式
- **第三方组件**: 检查 UI 组件库是否支持暗色模式，必要时用 CSS 变量覆盖
- **Tailwind 组件**: 暗色模式下需复核 focus、disabled、selected、invalid、skeleton、chart 和阴影层级，不只补 `dark:` 背景色

---

## 可访问性基线

优先使用语义化 HTML。

确保：

- 表单控件具备标签
- 纯图标按钮具有可访问名称
- 菜单、标签页、对话框和自定义控件支持键盘操作
- 焦点样式可见
- 编辑页面时标题层级正确
- 真实表格数据使用正确表格语义

## UI 任务的输出要求

对于较复杂的设计类任务，开始时先给出：

- 复用的组件
- 新建的组件
- 可能改动的文件
- 响应式策略
- Token 映射或样式策略

实现完成后，需要说明：

- 复用了什么
- 新建了什么
- 与设计稿有哪些偏差
- 缺少哪些 Token、资源或交互细节
