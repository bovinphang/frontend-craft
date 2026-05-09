# API 层规范

凡是涉及 HTTP 请求、接口调用、数据获取或错误处理时，都应用本文件。

## 核心原则

- 请求和响应必须有类型定义
- 统一错误处理，不在每个组件中重复 try-catch
- API 层与 UI 层分离
- 敏感操作（删除、支付）必须有二次确认

## 目录结构

<!-- 请根据项目实际情况调整 -->

```
src/
├── api/                    # API 定义层
│   ├── modules/
│   │   ├── user.ts         # 用户相关接口
│   │   ├── order.ts        # 订单相关接口
│   │   └── ...
│   ├── types/              # 请求/响应类型
│   │   ├── user.types.ts
│   │   └── order.types.ts
│   └── request.ts          # 统一请求封装
```

## 类型规范

```typescript
// 请求参数类型
interface GetUserListParams {
    page: number;
    pageSize: number;
    keyword?: string;
    status?: UserStatus;
}

// 响应数据类型
interface GetUserListResponse {
    list: User[];
    total: number;
    page: number;
    pageSize: number;
}

// API 函数签名
export function getUserList(params: GetUserListParams): Promise<GetUserListResponse>;
```

要求：

- 禁止使用 `any` 作为请求参数或响应类型
- 枚举值使用 TypeScript enum 或 union type
- 分页参数和响应格式保持统一

## 错误处理

### 统一拦截器

在请求封装层统一处理：

- 401: 跳转登录或刷新 token
- 403: 提示无权限
- 500: 显示通用错误提示
- 网络错误: 显示网络异常提示

### 业务错误

- 业务错误码与 HTTP 状态码分离
- 业务错误信息使用 i18n key（如支持国际化）
- 需要用户操作的错误（如表单校验失败）由调用方处理

## Loading / Error / Empty 状态

每个数据请求场景都需要考虑：

- **Loading**: 首次加载 skeleton/spinner，后续刷新不阻断 UI
- **Error**: 显示错误信息 + 重试按钮
- **Empty**: 显示空状态占位 + 引导操作

## 检查清单

- [ ] 请求参数和响应有明确类型
- [ ] 错误处理不依赖每个组件各自 try-catch
- [ ] Loading / Error / Empty 三态均已处理
- [ ] 敏感操作有二次确认
- [ ] Token / 鉴权信息不在请求 URL 中明文传递
- [ ] 大数据量使用分页或流式加载

## 反模式

- 在组件中直接使用 `fetch` / `axios` 而不经过统一封装
- 请求参数或响应使用 `any`
- 忽略错误处理，只处理成功场景
- 将 token 拼接在 URL 中
- 在 GET 请求中传递敏感数据
- 同一个接口在多个文件中重复定义
