---
name: react-project-standard
description: React + TypeScript 项目的完整工程规范，涵盖项目结构、组件设计、Hooks、路由、状态管理、API 层、错误处理、测试和性能优化。当用户在 React 项目中创建、修改组件或模块，涉及架构设计、代码编写时自动激活。
version: 2.0.0
---

# React 项目规范

适用于 React + TypeScript 仓库中的中大型模块建设、页面重构和工程结构设计。

## 使用说明

本 skill 提供 React 工程化任务的推荐流程、目录结构、实现模式和检查清单。

使用前提：

- 默认遵守仓库现有全局规则和 React rule
- 若仓库已有明确目录结构、样式体系、状态管理或请求封装，优先沿用仓库约定
- 本 skill 主要解决“如何设计和落地”问题，而不是重复声明基础编码底线

---

## 任务触发场景

以下场景适合自动激活或显式调用本 skill：

- 新建页面、功能模块或业务域
- 组件拆分与目录重构
- React + TypeScript 工程结构梳理
- 页面 / 模块 / 通用组件边界设计
- hooks、API 层、状态管理分层设计
- 为现有 React 项目补齐错误处理、测试、性能优化方案

---

## 工作流程

处理 React 工程化任务时，建议按以下顺序执行：

1. 识别仓库已有约定
   - 目录组织方式
   - 样式体系
   - 状态管理方案
   - 请求封装方式
   - 测试框架
   - UI 组件库 / 设计系统

2. 判断目标属于哪一层
   - 路由页面
   - 页面私有组件
   - feature 业务模块
   - 全局通用组件
   - hooks / services / stores / utils

3. 设计边界后再落代码
   - 哪些逻辑属于页面编排
   - 哪些逻辑属于 feature
   - 哪些逻辑应下沉为通用能力
   - 哪些状态应本地管理，哪些应交给 store / query / URL

4. 输出时补齐关键质量项
   - loading / error / empty / data 状态
   - 错误处理与重试
   - 类型约束
   - 关键测试
   - 必要的性能优化

---

## 项目结构（推荐参考）

以下为中大型 React 项目的业界最佳实践结构，按项目实际情况裁剪：

```text
src/
├── app/                        # 应用入口与全局配置
│   ├── App.tsx                 # 根组件（Provider 组合）
│   ├── routes.tsx              # 路由配置
│   └── providers.tsx           # 全局 Provider 组装
│
├── pages/                      # 页面组件（与路由一一对应）
│   ├── Dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── components/         # 页面私有组件
│   │   └── hooks/              # 页面私有 hooks
│   ├── UserList/
│   └── Settings/
│
├── layouts/                    # 布局组件
│   ├── MainLayout.tsx          # 主布局（侧边栏 + 顶栏 + 内容区）
│   ├── AuthLayout.tsx          # 登录/注册页布局
│   └── BlankLayout.tsx         # 空白布局（错误页等）
│
├── features/                   # 功能模块（按业务领域划分）
│   ├── auth/
│   │   ├── components/         # 模块组件
│   │   ├── hooks/              # 模块 hooks
│   │   ├── api.ts              # 模块 API 调用
│   │   ├── types.ts            # 模块类型定义
│   │   ├── constants.ts        # 模块常量
│   │   └── index.ts            # 模块公开导出
│   └── order/
│
├── components/                 # 全局共享 UI 组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.css
│   │   └── __tests__/
│   ├── Modal/
│   ├── Form/
│   └── ErrorBoundary/
│
├── hooks/                      # 全局共享 hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
│
├── services/                   # API 基础层
│   ├── request.ts              # Axios/fetch 实例与拦截器
│   └── endpoints/              # API 端点定义（如按领域拆分）
│
├── stores/                     # 全局状态管理
│   ├── authStore.ts
│   └── uiStore.ts
│
├── locales/                    # 国际化语言包
│   ├── zh-CN.json              # 中文
│   ├── en-US.json              # 英文
│   └── index.ts                # i18n 实例初始化（i18next / react-intl）
│
├── assets/                     # 静态资源
│   ├── images/                 # 图片（PNG、JPG、WebP）
│   ├── icons/                  # SVG 图标
│   └── fonts/                  # 自定义字体
│
├── config/                     # 应用配置
│   ├── env.ts                  # 环境变量类型化封装
│   └── features.ts             # Feature Flags 管理
│
├── types/                      # 全局共享类型
│   ├── api.ts                  # API 响应/请求通用类型
│   ├── models.ts               # 业务实体类型
│   └── global.d.ts             # 全局类型扩展（图片模块声明等）
│
├── utils/                      # 纯工具函数
│   ├── format.ts               # 日期、数字、货币格式化
│   ├── validators.ts           # 表单校验规则
│   └── storage.ts              # LocalStorage / SessionStorage 封装
│
├── styles/                     # 全局样式与主题
│   ├── global.css              # 全局基础样式（reset / normalize）
│   ├── variables.css           # CSS 变量（颜色、间距、字号）
│   ├── breakpoints.ts          # 响应式断点常量
│   └── themes/                 # 主题定义
│       ├── light.css           # 亮色主题变量
│       ├── dark.css            # 暗色主题变量
│       └── index.ts            # 主题切换逻辑
│
└── constants/                  # 全局常量
    ├── routes.ts               # 路由路径常量
    └── config.ts               # 业务常量（分页大小、超时时间等）
```

### 关键原则

- `pages/` 做路由映射和页面编排，不承载大块可复用业务逻辑
- `layouts/` 负责页面骨架和布局容器，由路由配置引用
- `features/` 按业务领域划分，模块内尽量自包含
- `components/` 仅放跨页面、跨模块复用的通用组件
- `hooks/` 仅放全局通用 hooks；业务 hooks 优先放回对应 feature 或 page
- `locales/` 存放语言包 JSON 文件，组件中使用 `t('key')` 而非硬编码文案
- `assets/` 存放静态资源，图标优先使用 SVG，图片优先使用 WebP/AVIF
- `services/` 负责请求基础设施，不堆叠业务细节
- `config/` 统一封装环境变量和特性开关，禁止组件中直接读取 `import.meta.env`
- `styles/` 和主题变量统一管理，避免颜色和尺寸散落在业务代码中
- 每个模块通过 `index.ts` 管控对外公开 API，避免深层路径导入

---

## 组件与模块分层

推荐分层：

```text
页面组件 (Pages)        → 路由映射、布局组合、页面编排
  └── 容器/编排层        → 数据获取、状态组织、事件编排
       └── 业务组件      → 领域逻辑展示
            └── 通用组件 → 无业务耦合、可跨模块复用
```

### 什么时候放到 `pages/`

适合放：

- 路由入口组件
- 页面级布局组合
- 页面私有的轻量编排逻辑

不适合放：

- 大量领域逻辑
- 可复用于多个页面的复杂业务块
- 与某个业务域强绑定的 API / hooks / types

### 什么时候放到 `features/`

适合放：

- 某个业务域的组件、hooks、api、types
- 可被多个页面共享但带业务语义的逻辑
- 一个完整业务单元的自包含实现

### 什么时候放到 `components/`

适合放：

- 按钮、弹窗、表单项、表格壳子、空态、错误态等通用 UI
- 与具体业务无关、可跨模块复用的组件

---

## 组件设计规范

- 使用函数组件和 TypeScript
- 保持组件职责单一、可组合
- 将可复用逻辑提取到 hooks
- 在合适场景优先使用受控组件 API
- props 定义清晰且类型明确
- 优先复用现有设计系统组件
- 保持可访问性与键盘交互
- 避免过深的 JSX 嵌套和重复分支
- 对可推导的值不要额外存 state

---

## 组件目录建议

当组件复杂度较低时，可只保留一个文件。  
当组件包含样式、子组件、hooks、测试时，推荐使用如下结构：

```text
ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.styles.css
├── hooks/
│   └── useComponentLogic.ts
├── components/
│   └── SubComponent.tsx
└── __tests__/
    └── ComponentName.spec.tsx
```

说明：

- 类型复杂时再拆 `ComponentName.types.ts`
- 存在局部逻辑复用时再拆 `hooks/`
- 子组件仅在当前组件内部使用时，放到当前目录 `components/`
- 测试是否就近放置，应遵循仓库现有约定

---

## Hooks 设计模式

### 适合抽为自定义 Hook 的场景

- 数据获取与三态管理
- 表单状态逻辑
- 分页、筛选、排序编排
- 事件监听与副作用清理
- 可在多个组件复用的交互逻辑

### 推荐原则

- 统一使用 `use` 前缀命名
- 返回对象而非数组，方便按需解构，增强可读性和扩展性
- 状态和行为封装在一起
- Hook 内部处理 `loading / error / data`
- 对外暴露清晰的最小接口，不泄漏无关内部细节

### 示例

```tsx
function useUserList(params: QueryParams) {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserList(params);
      setData(res.list);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
```

### Hook 使用原则

- `useEffect` 必须有正确依赖和清理逻辑
- `useMemo` / `useCallback` 不要滥用，只有在稳定引用确实重要时再加
- 不在条件分支或循环中调用 hooks
- 已引入 React Query / SWR 时，数据请求优先走这些库，而不是自己重复造一套缓存层

---

## 路由组织

### 推荐方式

- 路由配置集中管理
- 路径常量化
- 页面组件按需懒加载
- 权限控制放在 guard 层，而不是散落在页面组件内
- 分页、筛选、排序等 URL 驱动状态优先与地址栏同步

### 示例

```tsx
const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "users", element: <UserListPage /> },
      { path: "users/:id", element: <UserDetailPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> },
];
```

```tsx
const UserListPage = lazy(() => import("@/pages/UserList/UserListPage"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

---

## 状态管理选型

| 状态类型           | 推荐方案                                          |
| ------------------ | ------------------------------------------------- |
| 组件内临时 UI 状态 | `useState` / `useReducer`                         |
| 跨组件共享业务状态 | Zustand / Redux Toolkit / Jotai（按仓库实际选择） |
| 服务端数据缓存     | React Query / SWR                                 |
| URL 驱动状态       | 路由参数 / `useSearchParams`                      |
| 表单状态           | React Hook Form / Formik                          |

### 核心原则

- 就近管理：状态尽量放在最近的公共祖先
- 单一数据源：同一份数据不要维护多份
- 派生优于同步：可计算值优先在渲染期计算
- 服务端数据优先交给请求库管理，不手动塞进全局 store
- 不要因为“以后可能会用到”就把局部状态提前升级为全局状态

---

## API 层规范

### 设计原则

- 请求基础设施集中在 `services/`
- 业务 API 按 feature 拆分，而不是全部堆在一个文件
- 请求参数和响应结果都应有明确类型
- 认证、错误格式化、通用拦截放在请求层统一处理
- 页面和组件不要直接散落拼接请求细节

### 示例

```ts
// services/request.ts
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

request.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(normalizeError(error));
  },
);
```

```ts
// features/user/api.ts
export function getUserList(
  params: UserQueryParams,
): Promise<PageResult<User>> {
  return request.get("/users", { params });
}

export function updateUser(id: string, data: UpdateUserDTO): Promise<User> {
  return request.put(`/users/${id}`, data);
}
```

---

## 错误处理

### 必须覆盖的状态

- Loading
- Error
- Empty
- Data

### 推荐做法

- 关键功能模块使用 Error Boundary 包裹，避免局部异常导致全页白屏
- 异步请求失败时必须给用户可见反馈
- 重要操作提供重试能力
- 不要吞错，不写空 `catch`

### 示例

```tsx
<ErrorBoundary fallback={<ModuleErrorFallback />}>
  <UserDashboard />
</ErrorBoundary>
```

---

## Suspense 与懒加载

适用场景：

- 路由级页面
- 图表、富文本编辑器、地图、重型表格等大体积组件
- 初始化成本较高的模块

示例：

```tsx
const HeavyChart = lazy(() => import("./components/HeavyChart"));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={chartData} />
    </Suspense>
  );
}
```

建议：

- 路由级优先 `lazy + Suspense`
- `fallback` 优先使用 Skeleton 或更贴近内容的占位态，而不是纯 spinner

---

## 样式接入

本 skill 不强制具体样式方案，默认遵循仓库现状。

适配时注意：

- Tailwind 项目继续使用 Tailwind
- CSS Modules 项目保持命名与文件组织一致
- styled-components 项目继续沿用其模式
- 主题、颜色、字号、间距等优先复用仓库 token / CSS 变量
- 避免在组件内硬编码大量视觉常量
- 禁止内联样式（除动态值外）
- 响应式处理需与项目断点约定一致

---

## TypeScript 规范

- Props interface 命名: `ComponentNameProps`
- 事件处理函数: `handle` 前缀（如 `handleClick`）
- 回调 Props: `on` 前缀（如 `onChange`、`onSubmit`）
- 禁止使用 `any`，优先使用 `unknown` 或精确类型
- 泛型组件使用 `<T>` 约束，保持类型推导

```tsx
interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
}
```

---

## 测试规范

### 应优先覆盖的内容

- 核心交互行为（点击、输入、提交）
- 条件渲染（loading / error / empty / data）
- 关键 hooks 的返回值和副作用
- API 调用 mock 与模块级集成测试

### 推荐风格

- 测试用户行为，而不是实现细节
- 优先使用 `screen.getByRole`、`getByLabelText`
- 避免围绕内部 state 写脆弱测试
- 只测关键行为，不机械追求覆盖率数字

### 示例

```tsx
describe("UserForm", () => {
  it("should submit with valid data", async () => {
    const onSubmit = vi.fn();
    render(<UserForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("用户名"), "test");
    await userEvent.click(screen.getByRole("button", { name: "提交" }));

    expect(onSubmit).toHaveBeenCalledWith({ username: "test" });
  });

  it("should show error on invalid input", async () => {
    render(<UserForm onSubmit={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "提交" }));
    expect(screen.getByText("用户名不能为空")).toBeInTheDocument();
  });
});
```

---

## 性能优化

在以下场景考虑性能优化：

- 大列表 / 大表格
- 高频重渲染组件
- 大量 props 传递的复杂树
- 重型第三方组件
- 高频变化 context

### 推荐手段

- 合理使用 `React.memo`
- 只在必要时使用 `useMemo` / `useCallback`
- 列表使用稳定 `key`
- 大列表使用虚拟滚动
- 路由级做 code splitting
- 避免将高频变化值放进顶层 context
- 避免在 render 中无意义创建大量新对象 / 新函数 / 新数组

---

## 常见反模式

避免：

- prop drilling 过深却不考虑组合或局部封装
- 对局部问题过度使用 context
- 把数据请求、视图渲染、命令式 DOM 操作全塞进一个文件
- 在 useEffect 中做可以在事件处理函数中完成的事
- 用 `useEffect + setState` 模拟本可直接计算的派生值
- 将所有状态都推进全局 store
- 在 `components/` 中放业务耦合组件
- 直接绕过模块出口，从 feature 深层路径导入
- 没有明显收益却提前做复杂优化

---

## 输出检查清单

输出 React 代码或方案时，至少检查：

- [ ] 是否先对齐了仓库现有约定
- [ ] 页面 / feature / 通用组件边界是否清晰
- [ ] 目录结构是否与模块复杂度匹配
- [ ] Props 类型完整且明确
- [ ] 可复用逻辑是否已提取为 hooks
- [ ] loading / error / empty / data 状态是否齐全
- [ ] API 层是否具备类型约束和统一错误处理
- [ ] 状态管理是否符合就近原则
- [ ] 路由级或重型模块是否考虑懒加载
- [ ] 样式方案是否与仓库保持一致
- [ ] 关键行为是否有测试覆盖
- [ ] Error Boundary 已包裹关键模块
- [ ] 是否引入了不必要的新依赖或新范式

---

## 输出要求

在生成方案、代码或重构建议时：

- 先尊重仓库现状，再给推荐结构
- 给出必要的文件划分建议
- 必要时说明为什么这样分层
- 对新增模块，优先输出最小可落地结构，而不是一次性过度设计
- 对重构任务，优先保证可迁移性和风险可控
