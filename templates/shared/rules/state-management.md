# 状态管理规范

## 状态分类

| 类型         | 示例                             | 存放位置            |
| ------------ | -------------------------------- | ------------------- |
| 组件 UI 状态 | modal 开关、tab 索引、hover 状态 | 组件内 state        |
| 表单状态     | 输入值、校验错误                 | 表单库或组件 state  |
| 服务端数据   | 用户列表、订单详情               | 数据请求库缓存      |
| 全局业务状态 | 当前用户、权限、主题             | 全局 Store          |
| URL 状态     | 当前页码、筛选条件、排序         | 路由参数 / 搜索参数 |

## 核心原则

- **就近管理**: 状态放在需要它的最近公共祖先
- **单一数据源**: 同一份数据只在一个地方维护
- **派生优于同步**: 可计算的值用 computed / useMemo，而不是手动同步多个 state
- **最小状态**: 不存储可以从已有状态推导的值

## React 状态管理

### 本地状态

```tsx
// 简单值 - useState
const [count, setCount] = useState(0);

// 复杂逻辑 - useReducer
const [state, dispatch] = useReducer(formReducer, initialState);
```

### 全局状态（Zustand 示例）

<!-- 请根据项目实际选型调整：Redux Toolkit / Zustand / Jotai -->

```tsx
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (credentials) => {
    const user = await authApi.login(credentials);
    set({ user });
  },
  logout: () => set({ user: null }),
}));
```

### 服务端状态

<!-- 请根据项目实际选型调整：React Query / SWR -->

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["users", params],
  queryFn: () => fetchUsers(params),
  staleTime: 5 * 60 * 1000,
});
```

## Vue 状态管理

### 本地状态

```typescript
const count = ref(0);
const form = reactive({ name: "", email: "" });
```

### 全局状态（Pinia）

```typescript
export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  async function login(credentials: LoginParams) {
    user.value = await authApi.login(credentials);
  }

  function logout() {
    user.value = null;
  }

  const isLoggedIn = computed(() => user.value !== null);

  return { user: readonly(user), isLoggedIn, login, logout };
});
```

### 服务端状态

<!-- 请根据项目实际选型调整：VueQuery / 自定义 composable -->

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["users", params],
  queryFn: () => fetchUsers(toValue(params)),
});
```

## 选型决策矩阵

### React 全局状态管理选型

| 维度           | Context API                            | Zustand                                | Redux Toolkit                   | Jotai               |
| -------------- | -------------------------------------- | -------------------------------------- | ------------------------------- | ------------------- |
| **适用场景**   | 全局常量（主题、语言、用户信息）       | 复杂业务状态（购物车、Dashboard 筛选） | 大型应用，需要严格的状态流控制  | 细粒度原子状态      |
| **重渲染性能** | ❌ 任何 value 变化导致所有消费者重渲染 | ✅ 通过 selector 精确订阅              | ✅ connect/useSelector 精确订阅 | ✅ 原子级订阅       |
| **样板代码**   | 少（Provider + createContext）         | 极少（一个 create 调用）               | 多（slice / action / selector） | 极少（atom）        |
| **DevTools**   | ❌ 无                                  | ✅ Redux DevTools（中间件）            | ✅ Redux DevTools               | ✅ 专用 DevTools    |
| **TypeScript** | ⚠️ 需手动类型标注                      | ✅ 自动推导                            | ✅ 自动推导                     | ✅ 自动推导         |
| **中间件**     | ❌                                     | ✅（persist / devtools / immer）       | ✅（thunk / listener）          | ✅                  |
| **Provider**   | ✅ 必须包裹                            | ❌ 不需要（外部 store）                | ✅ Provider                     | ❌（可选 Provider） |

**推荐决策流程**：

```
状态是否跨组件共享？
├── 否 → useState / useReducer（本地状态）
└── 是
    ├── 值是否几乎不变？（主题、语言、配置）
    │   └── 是 → Context API
    │
    ├── 是否需要严格状态流 + 时间旅行调试？
    │   └── 是 → Redux Toolkit
    │
    ├── 状态是否高度关联、需要集中管理？
    │   └── 是 → Zustand
    │
    └── 状态是否独立、需要细粒度订阅？
        └── 是 → Jotai
```

### Vue 全局状态管理选型

| 维度           | provide/inject                     | Pinia            |
| -------------- | ---------------------------------- | ---------------- |
| **适用场景**   | 局部跨层级传递（主题、表单上下文） | 全局业务状态     |
| **响应式**     | ✅（传入 reactive/ref）            | ✅               |
| **DevTools**   | ❌                                 | ✅ Vue DevTools  |
| **TypeScript** | ⚠️ 需 InjectionKey                 | ✅ 自动推导      |
| **SSR 安全**   | ⚠️ 需注意作用域                    | ✅ 内置 SSR 支持 |

**Vue 选型结论**：Pinia 是 Vue 3 官方推荐，新项目直接使用。provide/inject 仅用于局部上下文传递。

---

## 反模式

- 将所有状态都放进全局 store（应优先本地状态）
- 在 store 中存放 UI 临时状态（modal 开关、表单输入等）
- 手动同步多份相同数据而不是用计算属性
- 在组件中直接修改 store 的内部数据（应通过 action / mutation）
- 将服务端响应原封不动存入全局 store 而不用请求缓存库
- 过度使用 Context / provide 替代 props 传递
- 用 Context 管理频繁更新的状态（导致全量消费者重渲染，应改用 Zustand/Pinia）

## 检查清单

- [ ] 每个状态都有明确的归属（本地 / 全局 / URL / 服务端缓存）
- [ ] 可派生的值没有被存为独立 state
- [ ] 全局 store 仅包含真正需要跨组件共享的数据
- [ ] 服务端数据通过请求库管理，而非手动存入 store
- [ ] URL 状态（搜索、分页、筛选）与路由参数同步
- [ ] Context 仅用于低频变更的全局值（主题、语言、用户信息）
