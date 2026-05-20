---
name: fec-browser-storage
description: Use when choosing, implementing, or reviewing browser storage such as localStorage, sessionStorage, IndexedDB, cookies, client persistence, offline data, secure storage, or cleanup strategy; Chinese triggers include 浏览器存储, 客户端持久化.
---

# 浏览器存储

根据数据大小、安全要求和生命周期选择合适的客户端存储方案。

## Purpose

在客户端持久化数据，减少不必要的网络请求，支持离线场景，提升用户体验。

## When to Use

- 用户偏好设置（主题、语言、侧边栏折叠）
- 表单草稿自动保存
- 离线数据缓存
- 认证 Token 存储
- 大数据量本地缓存（避免重复 API 请求）

## Procedure

### 1. 存储方案选型

| 存储               | 容量   | API 同步/异步      | 是否发送服务端      | 适用场景                   | 安全性             |
| ------------------ | ------ | ------------------ | ------------------- | -------------------------- | ------------------ |
| **LocalStorage**   | ~5MB   | 同步（阻塞主线程） | ❌                  | 用户偏好、非敏感持久数据   | ⚠️ XSS 可读取      |
| **SessionStorage** | ~5MB   | 同步               | ❌                  | Tab 级临时数据（表单草稿） | ⚠️ XSS 可读取      |
| **IndexedDB**      | >500MB | 异步（不阻塞）     | ❌                  | 大数据、文件、离线缓存     | ⚠️ XSS 可读取      |
| **Cookie**         | ~4KB   | 同步               | ✅ 每次请求自动携带 | 认证 Token（HttpOnly）     | ✅ HttpOnly 防 XSS |

**决策流程**：

```
需要存储什么数据？
├── 认证 Token
│   └── Cookie（HttpOnly + Secure + SameSite）
│
├── 用户偏好 / 小量数据（< 5MB）
│   ├── 需要跨 Tab 共享 → LocalStorage
│   └── 仅当前 Tab → SessionStorage
│
├── 大量数据 / 结构化数据 / 文件
│   └── IndexedDB
│
└── 需要发送服务端的数据
    └── Cookie
```

### 2. LocalStorage / SessionStorage 封装

```ts
// utils/storage.ts
const STORAGE_PREFIX = "app:"; // 避免 key 冲突

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      // QuotaExceededError — 存储满了
      console.warn("LocalStorage quota exceeded", e);
      // 清理过期数据后重试
      cleanupExpired();
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    }
  },

  remove(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },

  clear(): void {
    // 仅清理带前缀的数据，不影响其他库的存储
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  },
};

function cleanupExpired() {
  const now = Date.now();
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_PREFIX))
    .forEach((k) => {
      try {
        const item = JSON.parse(localStorage.getItem(k)!);
        if (item._expires && item._expires < now) {
          localStorage.removeItem(k);
        }
      } catch {
        /* skip invalid items */
      }
    });
}

// 带过期的存储
export function setWithExpiry<T>(key: string, value: T, ttlMs: number) {
  storage.set(key, { ...value, _expires: Date.now() + ttlMs });
}
```

使用：

```ts
storage.set("theme", "dark");
const theme = storage.get<string>("theme");

// 带过期
setWithExpiry("searchHistory", ["react", "vue"], 7 * 24 * 60 * 60 * 1000);
```

### 3. IndexedDB（idb 库）

```bash
npm install idb
```

```ts
// db/offline.ts
import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "app-offline-db";
const DB_VERSION = 1;

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // 缓存离线请求
      if (!db.objectStoreNames.contains("requests")) {
        const store = db.createObjectStore("requests", { keyPath: "id" });
        store.createIndex("timestamp", "timestamp");
      }
      // 缓存离线文件
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "path" });
      }
    },
  });
}

// 存储离线请求
export async function saveOfflineRequest(request: OfflineRequest) {
  const db = await getDB();
  await db.put("requests", {
    ...request,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  });
}

// 网络恢复后同步
export async function syncOfflineRequests() {
  const db = await getDB();
  const requests = await db.getAll("requests");

  for (const req of requests) {
    try {
      await fetch(req.url, { method: req.method, body: req.body });
      await db.delete("requests", req.id);
    } catch {
      // 同步失败，保留数据下次重试
      break;
    }
  }
}
```

### 4. Cookie 安全操作

```ts
// utils/cookie.ts
export const cookie = {
  set(name: string, value: string, options: CookieOptions = {}): void {
    const {
      maxAge = 3600,
      path = "/",
      secure = true,
      sameSite = "Lax",
      httpOnly = false, // httpOnly 只能由服务端设置
    } = options;

    let cookieStr = `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}`;
    if (secure) cookieStr += "; Secure";
    if (sameSite) cookieStr += `; SameSite=${sameSite}`;

    document.cookie = cookieStr;
  },

  get(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  },

  remove(name: string, path = "/"): void {
    document.cookie = `${name}=; path=${path}; max-age=0`;
  },
};

interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  httpOnly?: boolean;
}
```

### 5. 安全存储指南

```
敏感数据存储规则：
├── 认证 Token → Cookie（HttpOnly + Secure + SameSite=Strict）
├── 刷新 Token → Cookie（HttpOnly + Secure + SameSite=Strict, 长过期）
├── Session ID → Cookie（HttpOnly + Secure）
├── 用户偏好 → LocalStorage（不敏感）
├── 表单草稿 → SessionStorage（Tab 级，关闭即清除）
└── 离线数据 → IndexedDB（不敏感数据）
```

**禁止**：

- LocalStorage / IndexedDB 存储明文 Token、密码、信用卡信息（XSS 可读取）
- URL 中传递 Token（日志、Referer 会泄漏）
- 在 Cookie 中存储未加密的敏感信息（除非 HttpOnly）

## Constraints

- **LocalStorage 同步阻塞**: read/write 阻塞主线程，大数据量操作会卡顿。> 100KB 数据建议用 IndexedDB
- **5MB 限制**: LocalStorage/SessionStorage 有配额限制，超出抛 QuotaExceededError
- **XSS 风险**: 所有客户端存储（除 HttpOnly Cookie）都可被 XSS 读取，不可存储敏感数据
- **Cookie 每次请求携带**: 增大请求体积，不适合大数据。4KB 限制
- **Quota 差异**: 各浏览器 IndexedDB 配额不同，通常在磁盘空间的 50-80%
- **隐私模式**: 无痕模式下部分浏览器禁用 IndexedDB 或清除 LocalStorage

## Expected Output

- 统一的存储封装（storage / cookie / db 工具模块）
- 带前缀的 key 管理，避免冲突
- 过期自动清理机制
- 敏感数据仅存储在 HttpOnly Cookie 中
