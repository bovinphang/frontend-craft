---
name: fec-storybook-component-doc
description: Storybook 组件文档化规范，涵盖安装配置、Story 编写、Addon 集成、MDX 文档、交互测试、视觉回归、CI 集成与组件隔离模式。当用户提到 Storybook、组件文档、Design System、视觉测试、组件隔离开发时自动激活。
version: 1.0.0
---

# Storybook 组件文档化

在隔离环境中开发、测试和记录 UI 组件，形成可交互的活文档。

## Purpose

为 UI 组件建立隔离开发与可视化文档环境，让每个组件状态都可预览、可测试、可追溯，支撑 Design System 的持续演进。

## When to Use

- 构建或维护 Design System / 组件库
- 需要可视化测试组件各状态（loading / error / disabled / edge cases）
- 与设计师协作评审组件视觉稿
- 为新成员提供组件使用文档
- 需要隔离开发组件（无需启动完整应用）

## Procedure

### 1. 安装与初始化

```bash
npx storybook@latest init
```

初始化会自动检测框架（React / Vue / Svelte 等）并生成 `.storybook/` 配置目录。

```text
.storybook/
├── main.ts          # Storybook 配置（stories 路径、addons、框架）
└── preview.ts       # 全局装饰器、参数、全局样式
```

关键配置（`main.ts`）：

```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials", // Controls, Actions, Docs, Viewport 等
    "@storybook/addon-interactions", // 交互测试
    "@storybook/addon-a11y", // 无障碍检查
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag", // 按 tag 自动生成文档页
  },
};

export default config;
```

### 2. 编写 Story

Story 是组件某一状态的快照。每个组件的 Story 文件与组件同目录。

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button", // 侧边栏分类路径
  component: Button,
  tags: ["autodocs"], // 自动生成文档页
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    onClick: { action: "clicked" }, // 点击时记录到 Actions 面板
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary — 主要变体
export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Primary Button",
    disabled: false,
  },
};

// Secondary
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

// Disabled — 边缘状态
export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
  },
};

// Loading
export const Loading: Story = {
  args: {
    ...Primary.args,
    loading: true,
    children: "提交中...",
  },
};
```

**关键约定：**

- 每个组件至少覆盖：默认态、主要变体、disabled、loading、error 等边缘态
- `title` 按 `域/分类/组件名` 层级组织（如 `Forms/Input`、`DataDisplay/Table`）
- `argTypes` 为复杂 prop 配置 UI 控件，让设计师可在面板中调参

### 3. 处理全局依赖（Decorators）

组件依赖全局 Provider（路由、状态管理、主题、i18n）时，用 Decorator 包裹：

```ts
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/app/providers';
import { MemoryRouter } from 'react-router-dom';

const preview: Preview = {
  decorators: [
    // 提供主题上下文
    (Story) => <ThemeProvider>{Story()}</ThemeProvider>,
    // 提供路由上下文
    (Story) => <MemoryRouter initialEntries={['/']}>{Story()}</MemoryRouter>,
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },  // 自动绑定 onXxx 为 action
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

也可在单个 Story 中覆盖：

```tsx
export const WithAuth: Story = {
  decorators: [
    (Story) => (
      <AuthProvider value={{ user: mockUser }}>{Story()}</AuthProvider>
    ),
  ],
};
```

### 4. MDX 文档

对于复杂组件，用 MDX 编写富文档，结合 Markdown 说明与可交互 Story：

```mdx
<!-- Input.mdx -->

import { Meta, Story, Canvas, Controls, Source } from "@storybook/blocks";
import * as InputStories from "./Input.stories";

<Meta of={InputStories} />

# Input 输入框

用于用户文本输入，支持校验提示、前后缀图标、字数统计等。

## 何时使用

- 单行文本输入（姓名、邮箱、搜索）
- 需要实时校验反馈的表单字段
- **不用于**多行文本（用 Textarea）

<Canvas of={InputStories.Default} />

## 属性

<Controls />

## 校验状态

<Canvas of={InputStories.WithError} />
<Canvas of={InputStories.WithSuccess} />

## 源码

<Source of={InputStories.Default} />
```

### 5. 交互测试

在 Storybook 内直接测试用户交互流程（点击、输入、断言）：

```tsx
import { expect } from "@storybook/test";
import { userEvent, within } from "@storybook/test";

export const FormSubmission: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 模拟用户操作
    await userEvent.type(canvas.getByLabelText("用户名"), "admin");
    await userEvent.type(canvas.getByLabelText("密码"), "password123");
    await userEvent.click(canvas.getByRole("button", { name: /登录/ }));

    // 断言结果
    const toast = await canvas.findByText("登录成功");
    expect(toast).toBeInTheDocument();
  },
};
```

### 6. 视觉回归测试（可选）

集成 Chromatic 或 Storybook Test Runner 进行自动化视觉对比：

```bash
# Chromatic（云端视觉回归）
npx chromatic --project-token=<token>

# Storybook Test Runner（交互 + 视觉）
npx test-storybook
```

## Constraints

- **维护成本**: Story 需随组件 prop 变更同步更新，过期 Story 会误导使用者
- **全局依赖**: 依赖 Provider（Redux/Router/i18n）的组件必须配置 Decorator，否则渲染异常
- **SEO 无关**: Storybook 仅用于开发和文档，不应用于 SEO 内容
- **构建产物**: Storybook 构建产物（`storybook-static/`）不应提交到 Git，通过 CI 部署到静态托管
- **性能**: 大量 Story（500+）可能导致启动慢，可通过 `stories` glob 按需加载优化

## Expected Output

- 可交互的组件文档站点，每个组件状态都有可视化预览
- 自动生成的 Props 表格（通过 autodocs + TypeScript 类型推导）
- 边缘状态全覆盖的 Story 集合（默认态、变体、disabled、loading、error）
- 可选的交互测试用例和视觉回归基线

## Related Agent

- [frontend-architect](../../agents/frontend-architect.md) — 组件拆分与 Design System 架构设计
- [figma-implementer](../../agents/figma-implementer.md) — 从设计稿实现组件后，在 Storybook 中验证还原度
