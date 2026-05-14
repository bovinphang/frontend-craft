---
name: fec-nuxt-project-standard
description: Nuxt 3 项目规范，涵盖目录结构、SSR/SSG、组合式 API、数据获取、路由、中间件、插件与模块。当用户在 Nuxt 3 项目中创建、修改页面或模块时自动激活。
version: 1.0.0
---

# Nuxt 3 项目规范

适用于使用 Nuxt 3 + Vue 3 + TypeScript 的仓库。

## 适用场景

- 新建或修改页面
- 配置 SSR / SSG（静态生成）
- 使用组合式 API、数据获取
- 路由、中间件、插件与模块

## 项目结构

```
├── app.vue                    # 根组件
├── nuxt.config.ts              # Nuxt 配置
│
├── pages/                     # 基于文件的路由
│   ├── index.vue               # /
│   ├── login.vue               # /login
│   ├── dashboard/
│   │   ├── index.vue           # /dashboard
│   │   └── users/
│   │       ├── index.vue       # /dashboard/users
│   │       └── [id].vue       # /dashboard/users/:id
│   └── [...slug].vue          # 捕获所有
│
├── layouts/                   # 布局
│   ├── default.vue
│   └── auth.vue
│
├── components/                # 自动导入组件
│   ├── Button/
│   │   └── Button.vue
│   └── AppHeader.vue
│
├── composables/               # 组合式函数（自动导入）
│   ├── useAuth.ts
│   └── useFetch.ts
│
├── server/                    # 服务端 API
│   ├── api/                   # API 路由
│   │   └── users/
│   │       └── index.get.ts
│   ├── middleware/            # 服务端中间件
│   └── utils/                 # 服务端工具
│
├── plugins/                   # 插件
│   └── i18n.client.ts
│
├── middleware/                # 路由中间件
│   └── auth.ts
│
├── public/                    # 静态资源
├── assets/                    # 需构建的资源
└── types/                     # 类型定义
```

## 渲染模式

| 模式 | 配置 | 说明 |
|------|------|------|
| **SSR** | 默认 | `ssr: true` |
| **SSG** | `nuxt generate` | 预渲染所有页面 |
| **SPA** | `ssr: false` | 纯客户端渲染 |

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,  // 或 false
})
```

## 数据获取

- `useFetch` / `useAsyncData`：服务端 + 客户端，自动去重
- `$fetch`：直接请求，适合服务端或一次性调用
- `useLazyAsyncData`：不阻塞导航，适合非首屏
- 避免在 `setup` 顶层混用同步/异步逻辑导致水合不匹配

## 路由与布局

- `pages/` 下文件自动生成路由
- 动态路由：`[id].vue`、`[...slug].vue`
- 布局：`layout` 选项或 `layouts/default.vue` 默认
- 嵌套路由：`pages/parent/child.vue` 需配合 `NuxtPage`

## 中间件

- `middleware/` 下文件自动注册
- 页面级：`definePageMeta({ middleware: ['auth'] })`
- 全局：`nuxt.config.ts` 的 `router.middleware`
- 服务端中间件：`server/middleware/`

## 插件与模块

- 插件：`plugins/*.ts`，支持 `.client`、`.server` 后缀
- 模块：`modules/` 或 `node_modules`，在 `nuxt.config` 中 `modules: []`

## 强约束

- 服务端可访问的代码不要依赖 `window`、`document`
- 使用 `useState` 共享状态时注意 SSR 序列化
- 图片使用 `NuxtImg`，链接使用 `NuxtLink`
- 避免在 `setup` 顶层使用 `await` 导致阻塞，优先用 `useAsyncData` / `useFetch`
