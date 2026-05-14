# 错误处理规范

## 错误分层

| 层级 | 错误类型 | 处理方式 |
|------|----------|----------|
| 全局 | 未捕获异常、Promise rejection | 全局捕获 + 上报 + 降级 UI |
| 路由/页面 | 页面级组件渲染错误 | Error Boundary + 页面级降级 |
| 模块 | 功能模块内的运行时错误 | Error Boundary + 模块级降级 |
| 组件 | 数据请求失败、操作失败 | 用户提示 + 重试机制 |
| 表单 | 校验失败 | 字段级错误提示 |

## 全局错误捕获

### React

```tsx
// main.tsx — 未捕获的 Promise
window.addEventListener("unhandledrejection", (event) => {
  reportError(event.reason);
});

// 推荐：react-error-boundary，业务侧保持函数组件 + FallbackComponent
import { ErrorBoundary } from "react-error-boundary";

function GlobalErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>页面出现异常</p>
      <button type="button" onClick={resetErrorBoundary}>
        重试
      </button>
    </div>
  );
}

// 根节点包裹示例（root 来自 createRoot(document.getElementById("root")!) 等）
root.render(
  <ErrorBoundary
    FallbackComponent={GlobalErrorFallback}
    onError={(error, info) => {
      reportError(error, { componentStack: info.componentStack });
    }}
  >
    <App />
  </ErrorBoundary>,
);
```

### Vue

```typescript
// main.ts
app.config.errorHandler = (err, instance, info) => {
    reportError(err, {
        component: instance?.$options.name,
        lifecycleHook: info,
    });
};

window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason);
});
```

## Error Boundary 策略

```
App (GlobalErrorBoundary)
├── Header
├── Main
│   ├── Sidebar (ErrorBoundary)
│   └── Content
│       ├── Dashboard (ErrorBoundary)
│       └── UserList (ErrorBoundary)
└── Footer
```

- 每个独立功能模块用 Error Boundary 包裹
- 模块崩溃不应导致整个页面白屏
- 降级 UI 应提供"重试"操作

## API 错误处理

### 统一错误格式

```typescript
interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}
```

### 错误分级处理

```typescript
function handleApiError(error: ApiError) {
    switch (error.code) {
        case 'UNAUTHORIZED':
            redirectToLogin();
            break;
        case 'FORBIDDEN':
            showToast('无权限执行此操作');
            break;
        case 'VALIDATION_ERROR':
            return error.details; // 返回给表单显示字段级错误
        case 'NETWORK_ERROR':
            showToast('网络异常，请检查网络连接');
            break;
        default:
            showToast(error.message || '操作失败，请稍后重试');
            reportError(error);
    }
}
```

### 请求拦截器

在 axios / fetch 封装层统一处理：

- 401 → 跳转登录（或刷新 token）
- 403 → 权限不足提示
- 500 → 通用错误提示 + 上报
- 网络超时 → 超时提示 + 可选重试

## 用户体验

### 错误状态 UI

每个数据展示区域应处理四种状态：

1. **Loading** — 骨架屏或 spinner
2. **Error** — 错误描述 + 重试按钮
3. **Empty** — 空状态引导
4. **Success** — 正常数据展示

### 降级 UI 设计

- 全局级：显示友好的错误页面，提供"返回首页"和"重试"
- 模块级：显示该模块的占位错误卡片，页面其他部分正常
- 操作级：Toast 提示 + 具体的下一步指引

### 重试策略

- 用户手动重试（按钮）
- 自动重试（指数退避，最多 3 次）
- 数据请求库的内置重试（React Query retries 等）

## 错误上报

<!-- 请根据项目实际的错误监控平台调整：Sentry / 自建 / 其他 -->

上报内容应包含：

- 错误堆栈
- 用户 ID / 会话 ID
- 当前页面 URL
- 浏览器/设备信息
- 复现上下文（操作步骤、请求参数）

## 反模式

- 空 catch 块吞掉错误
- 所有错误统一用 `alert()` 提示
- 接口失败时 UI 无任何反馈
- Error Boundary 没有重试机制，用户只能刷新页面
- 在组件中到处写重复的 try/catch 而不是统一封装
- 不上报错误，依赖用户反馈来发现问题

## 检查清单

- [ ] 全局有未捕获异常和 Promise rejection 的监听
- [ ] 关键功能模块有 Error Boundary（React）或 onErrorCaptured（Vue）包裹
- [ ] API 请求有统一的错误拦截和分级处理
- [ ] 所有数据展示区域处理了 Loading / Error / Empty / Success 四种状态
- [ ] 降级 UI 提供了"重试"操作
- [ ] 错误信息上报到监控平台
