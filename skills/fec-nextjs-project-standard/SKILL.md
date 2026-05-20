---
name: fec-nextjs-project-standard
description: Use when creating or reviewing Next.js 14+ App Router projects, routes, layouts, server/client component boundaries, SSR/SSG/ISR, streaming, metadata, middleware, or Next.js data fetching; Chinese triggers include Next.js, App Router.
---

# Next.js 项目规范

适用于使用 Next.js 14+ 与 App Router 的仓库。

## Purpose

规范 Next.js 14+ 项目中 App Router、SSR/SSG/ISR 渲染模式、数据获取、路由布局、中间件和 SEO 元数据的工程实践，确保服务端优先、性能优化和可维护性。

## When to Use

- 新建或修改 App Router 页面
- 配置 SSR / SSG / ISR 渲染模式
- 使用流式渲染、Suspense
- 数据获取、缓存、中间件
- 元数据与 SEO 优化

## 项目结构

```
src/
├── app/                        # App Router
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   ├── loading.tsx              # 全局 loading UI
│   ├── error.tsx                # 全局错误边界
│   ├── not-found.tsx           # 404
│   ├── globals.css
│   │
│   ├── (auth)/                 # 路由组
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/            # 仪表盘路由组
│   │   ├── layout.tsx          # 共享布局
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── users/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   │
│   └── api/                    # API Routes
│       └── users/
│           └── route.ts
│
├── components/                 # 共享组件
├── lib/                        # 工具、配置
├── hooks/
├── services/
└── types/
```

## 渲染模式

| 模式    | 使用场景         | 实现方式                                        |
| ------- | ---------------- | ----------------------------------------------- |
| **SSR** | 动态、需实时数据 | 默认，`fetch` 不缓存或 `cache: 'no-store'`      |
| **SSG** | 静态内容         | `generateStaticParams` + 静态 `fetch`           |
| **ISR** | 定期更新         | `revalidate` 或 `revalidatePath`                |
| **CSR** | 客户端交互       | `'use client'` + `useEffect` 或 SWR/React Query |

## 数据获取

- 服务端组件：直接 `async` 或 `fetch`，不暴露 `useEffect`
- 客户端组件：`useEffect` + `useState`，或 SWR / React Query
- 优先在服务端获取数据，减少客户端水合
- 使用 `loading.tsx` 和 Suspense 包裹异步区块，提供流式体验

## 路由与布局

- 路由组 `(auth)` 不改变 URL，只影响布局
- 动态路由 `[id]` 配合 `generateStaticParams` 做 SSG
- `layout.tsx` 包裹子路由，共享 UI 与布局
- `page.tsx` 为叶子路由，不可嵌套

## 中间件

- 放在 `middleware.ts` 根目录
- 用于鉴权、重定向、rewrite、Header 修改
- 尽量短小，避免阻塞请求

## 元数据与 SEO

- 使用 `metadata` 或 `generateMetadata` 导出
- 支持 `title`、`description`、`openGraph`、`twitter` 等
- 动态路由用 `generateMetadata(params)` 生成

## Constraints

- 服务端组件默认，仅在需要客户端交互时加 `'use client'`
- 不在服务端组件中直接使用 `useState`、`useEffect`、浏览器 API
- 敏感逻辑（如鉴权）放在服务端或 API Route，不暴露在客户端
- 图片使用 `next/image`，字体使用 `next/font`

## 与客户端 UI 模式的分工

- **服务端**：渲染模式、数据获取与缓存、`loading.tsx` / `error.tsx`、路由与布局等以本 skill 为准。
- **`'use client'` 组件**：组合与复合组件、表单、客户端状态、列表虚拟化、动效与键盘/焦点等，与纯 React 项目一致，遵循 **`fec-react-project-standard`** skill 及项目中的 React 规则（如 `.claude/rules/react.md`）。

## Expected Output

- 页面组件按 App Router 约定组织（`app/` 目录、`page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`）
- 渲染模式选择正确（SSR/SSG/ISR/CSR），数据获取路径清晰
- 元数据和 SEO 配置完整（title、description、openGraph）
- 敏感逻辑在服务端，客户端组件仅处理交互
