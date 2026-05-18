# 渲染模式选型

当项目需要选择渲染策略或评估 SSR / CSR / SSG / ISR 时，参考本文件。

## 渲染模式概览

| 模式    | 全称                            | 生成时机                | 适用框架                 |
| ------- | ------------------------------- | ----------------------- | ------------------------ |
| **CSR** | Client-Side Rendering           | 运行时（浏览器）        | React SPA, Vue SPA, Vite |
| **SSR** | Server-Side Rendering           | 请求时（服务端）        | Next.js, Nuxt, Remix     |
| **SSG** | Static Site Generation          | 构建时                  | Next.js, Astro, Hugo     |
| **ISR** | Incremental Static Regeneration | 构建时 + 运行时按需更新 | Next.js, Nuxt            |
| **RSC** | React Server Components         | 请求时（服务端组件）    | Next.js App Router       |

## 选型决策矩阵

### 核心决策因素

| 因素                  | 权重 | 推荐模式                           |
| --------------------- | ---- | ---------------------------------- |
| **SEO 必须**          | 高   | SSR / SSG / ISR                    |
| **首屏速度必须 < 1s** | 高   | SSG / ISR                          |
| **内容实时性**        | 中   | SSR（实时）/ ISR（秒级延迟可接受） |
| **服务器成本敏感**    | 中   | SSG / CSR（无需 Node 服务）        |
| **交互复杂度**        | 中   | CSR / RSC                          |
| **页面数量 > 10000**  | 中   | SSR / ISR（SSG 构建时间过长）      |
| **纯后台管理系统**    | 低   | CSR                                |

### 场景推荐

```
目标场景是什么？
├── 营销官网 / 博客 / 文档站
│   ├── 内容更新频率低（天级）→ SSG
│   └── 内容更新频率高（小时级）→ ISR
│
├── 电商 / 社交网络 / 新闻门户
│   ├── 商品页（SEO + 可缓存）→ SSR + CDN 缓存
│   ├── 搜索结果（实时）→ SSR
│   └── 分类页（变化慢）→ ISR
│
├── SaaS Dashboard / 后台管理系统
│   ├── 登录后页面 → CSR
│   └── 登录/注册页（SEO）→ SSG
│
├── 混合场景（公开页 + 私有页）
│   └── 混合模式：公开页 SSR/SSG，私有页 CSR
│
└── 内容密集型（博客 + 商品 + Dashboard）
    └── RSC（Next.js App Router）
```

### 详细对比

| 维度           | CSR                      | SSR                   | SSG                   | ISR                     |
| -------------- | ------------------------ | --------------------- | --------------------- | ----------------------- |
| **SEO**        | ❌ 搜索引擎看到空壳 HTML | ✅ 完整 HTML          | ✅ 完整 HTML          | ✅ 完整 HTML            |
| **FCP**        | ⚠️ 慢（需下载执行 JS）   | ✅ 快（服务端已渲染） | ✅ 最快（纯静态文件） | ✅ 最快（同 SSG）       |
| **TTI**        | ⚠️ 慢（hydrate 后交互）  | ⚠️ 中（hydrate 开销） | ✅ 快                 | ✅ 快                   |
| **内容实时性** | ✅ 实时                  | ✅ 实时               | ❌ 构建时固定         | ⚠️ 可配置（秒/分钟级）  |
| **服务器成本** | ✅ 无需 Node 服务        | ❌ 需 Node 服务       | ✅ 仅需 CDN           | ⚠️ 需 Node 服务（按需） |
| **构建时间**   | ✅ 快                    | —                     | ⚠️ 页面多时慢         | ✅ 增量构建             |
| **缓存友好**   | ⚠️ API 级缓存            | ⚠️ 页面级缓存         | ✅ CDN 全量缓存       | ✅ CDN + 按需失效       |
| **复杂度**     | ✅ 低                    | ⚠️ 中                 | ✅ 低                 | ⚠️ 中                   |

## 各模式实施要点

### CSR（客户端渲染）

适用：后台管理系统、内部工具、登录后页面。

```tsx
// 纯 SPA 入口
import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
```

**SEO 补救**：对需要 SEO 的页面使用动态 import 加载预渲染版本，或使用 Prerender SPA Plugin。

### SSR（服务端渲染）

适用：电商、新闻、社交等 SEO 关键场景。

```tsx
// Next.js Pages Router
export async function getServerSideProps() {
  const data = await fetchProductData();
  return { props: { data } };
}

// Next.js App Router (RSC)
async function ProductPage() {
  const data = await fetchProductData(); // 服务端直接 await
  return <ProductLayout data={data} />;
}
```

**注意**：

- SSR 页面必须考虑服务端兼容性（无 window/document）
- Hydration 不匹配会导致客户端重新渲染（SSR 水合失败）
- 服务端数据获取必须有超时和错误降级

### SSG（静态站点生成）

适用：博客、文档、营销落地页。

```tsx
// Next.js 构建时生成
export async function getStaticProps() {
  const posts = await fetchPosts();
  return { props: { posts } };
}

export async function getStaticPaths() {
  const posts = await fetchPosts();
  return {
    paths: posts.map((p) => `/blog/${p.slug}`),
    fallback: false, // 未预渲染的 404
  };
}
```

### ISR（增量静态再生）

适用：页面数量多、内容更新频繁但非实时。

```tsx
export async function getStaticProps() {
  const product = await fetchProduct();
  return {
    props: { product },
    revalidate: 60, // 60 秒内返回缓存版本，后台异步更新
  };
}
```

## React Server Components（RSC）

Next.js App Router 的默认模式，服务端组件不发送 JS 到客户端：

```tsx
// 服务端组件（默认）— 可直接 await 数据库查询
async function ProductList() {
  const products = await db.products.findMany();
  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// 客户端组件 — 需要交互/状态时显式标记
("use client");

function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <button onClick={() => addToCart(productId)}>
      {loading ? "..." : "加入购物车"}
    </button>
  );
}
```

**RSC 优势**：

- 服务端组件的 JS 不发送到客户端，减小 bundle
- 直接 await 数据库/API 调用，无需 useEffect + loading 状态
- 服务端组件可嵌套客户端组件，按需选择

## 检查清单

- [ ] 明确哪些页面需要 SEO（公开页 vs 私有页）
- [ ] 明确哪些页面需要实时数据（SSR），哪些可接受延迟（ISR/SSG）
- [ ] 评估页面数量（> 10000 时 SSG 构建时间可能不可接受）
- [ ] 评估服务器成本（SSR 需 Node 服务，SSG 仅需 CDN）
- [ ] 确认 Hydration 一致性（SSR 页面首屏 HTML 与客户端渲染匹配）
- [ ] 为 SSR 页面设置合理的缓存策略（CDN 缓存 + revalidate）
