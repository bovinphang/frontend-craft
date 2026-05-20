---
name: fec-pwa-implementation
description: Use when adding or reviewing Progressive Web App features such as web app manifest, Service Worker, Workbox caching, offline fallback, install prompt, maskable icons, iOS compatibility, or update flow; Chinese triggers include PWA, 离线, Service Worker.
---

# PWA 实现

将 Web 应用升级为可安装、支持离线、具有原生体验的渐进式 Web 应用。

## Purpose

为 Web 应用增加安装能力、离线可用性和原生应用般的体验，在不开发独立原生 App 的前提下覆盖移动端和桌面端用户。

## When to Use

- 需要移动端存在但不想维护独立原生 App
- 提升用户参与度（"添加到主屏幕"推送）
- 需要在弱网/离线场景下保持基本可用
- 提升加载性能（Service Worker 缓存关键资源）

**不适用**：

- 纯内部后台系统（无安装需求）
- 依赖实时 WebSocket 或大量流媒体的应用（PWA 缓存收益低）

## Procedure

### 1. Manifest 配置

`public/manifest.json` — 描述应用元信息：

```json
{
  "name": "我的应用",
  "short_name": "应用",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0052cc",
  "description": "应用描述",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["productivity", "utilities"],
  "screenshots": [
    {
      "src": "/screenshot-desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

在 `index.html` 中引用：

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#0052cc" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

**关键字段**：

- `display: "standalone"` — 隐藏浏览器地址栏，呈现原生 App 感
- `purpose: "any maskable"` — Android 自适应图标，避免图标被裁剪
- `start_url` — 从主屏幕启动时的入口路径
- `screenshots` — 安装对话框中展示的应用预览图

### 2. Service Worker 注册

在应用入口注册 Service Worker：

```ts
// registerSW.ts
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.warn("浏览器不支持 Service Worker");
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/", // 控制范围，默认与 sw.js 所在路径一致
      });

      // 检测更新
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // 新版本已缓存，提示用户刷新
            showUpdatePrompt();
          }
        });
      });
    } catch (error) {
      console.error("Service Worker 注册失败:", error);
    }
  });
}

function showUpdatePrompt() {
  const confirmed = confirm("新版本已就绪，是否刷新页面？");
  if (confirmed) window.location.reload();
}
```

### 3. Service Worker 实现（Workbox）

使用 Workbox 生成生产级 Service Worker，而非手写缓存逻辑。

**安装**：

```bash
npm install workbox-core workbox-precaching workbox-routing workbox-strategies
```

**`public/sw.js`**：

```js
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

// 清理旧版本缓存
cleanupOutdatedCaches();

// 预缓存构建产物（由 workbox injectManifest 注入 __WB_MANIFEST）
precacheAndRoute(self.__WB_MANIFEST);

// 页面导航 — 网络优先（离线时 fallback 到缓存的 index.html）
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: "pages",
      networkTimeoutSeconds: 3,
    }),
  ),
);

// API 请求 — 网络优先
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 分钟
      }),
    ],
  }),
);

// 静态资源 — 缓存优先（图片、字体、CSS、JS）
registerRoute(
  ({ request }) =>
    ["image", "style", "script", "font"].includes(request.destination),
  new CacheFirst({
    cacheName: "static-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
      }),
    ],
  }),
);

// Google Fonts — StaleWhileRevalidate
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  }),
);
```

**缓存策略选择**：

| 策略                     | 适用                   | 说明                         |
| ------------------------ | ---------------------- | ---------------------------- |
| **CacheFirst**           | 图片、字体、CSS/JS     | 命中缓存直接返回，性能最优   |
| **NetworkFirst**         | 页面导航、API          | 优先请求网络，失败时降级缓存 |
| **StaleWhileRevalidate** | 字体、头像             | 立即返回缓存，后台异步更新   |
| **NetworkOnly**          | 敏感操作（支付、登录） | 不走缓存                     |

### 4. 构建集成（Vite 示例）

使用 `vite-plugin-pwa` 自动生成 manifest 注入和 Service Worker：

```bash
npm install vite-plugin-pwa -D
```

```ts
// vite.config.ts
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "prompt", // 新版本时弹出提示
      injectRegister: "auto",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      manifest: {
        name: "我的应用",
        short_name: "应用",
        theme_color: "#0052cc",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
```

### 5. 安装提示

自定义安装提示 UI（而非依赖浏览器默认）：

```tsx
// InstallPrompt.tsx
import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!promptEvent) return null;

  const handleInstall = async () => {
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      console.log("用户已安装 PWA");
    }
    setPromptEvent(null);
  };

  return (
    <button onClick={handleInstall} aria-label="安装应用到桌面">
      安装应用
    </button>
  );
}

// 类型声明
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
```

### 6. 离线 Fallback 页面

为离线未缓存的页面提供友好提示：

```js
// sw.js 中添加
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("offline-v1").then((cache) => cache.add(OFFLINE_URL)),
  );
});

// 在 NavigationRoute 的 fallback 中使用
import { offlineFallback } from "workbox-recipes";
offlineFallback({ pageFallback: OFFLINE_URL });
```

## Constraints

- **HTTPS 必须**: Service Worker 仅在 HTTPS 下工作（localhost 除外）
- **iOS 限制**: Safari 的 PWA 支持弱于 Android — 推送通知支持有限，安装流程需用户手动操作，Service Worker 生命周期管理也不同
- **存储配额**: 浏览器缓存有上限（通常 50-100MB 保证，可申请更多），超出时浏览器自动清理最旧缓存
- **更新延迟**: Service Worker 更新需用户关闭所有标签页后才激活新版本，使用 `skipWaiting()` + 用户提示可缓解
- **调试**: `chrome://serviceworker-internals/` 用于调试，开发时可在 DevTools → Application 中勾选 "Bypass for network"
- **缓存失效**: 必须设计合理的缓存过期策略，否则用户可能长期看到旧版本内容

## Expected Output

- 可安装的 Web 应用（桌面/移动端主屏幕有图标）
- 离线时基本功能可用（缓存命中 + 友好 offline 页面）
- Lighthouse PWA 评分 ≥ 90
- 应用更新时用户可见的刷新提示

## Related Agent

- [frontend-architect](../../agents/frontend-architect.md) — PWA 架构设计与 Service Worker 策略选型
- [performance-optimizer](../../agents/performance-optimizer.md) — PWA 缓存策略性能验证
