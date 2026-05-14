---
name: fec-vue3-project-standard
description: Vue 3 + TypeScript 项目的完整工程规范，涵盖项目结构、组件设计、Composables、路由、Pinia 状态管理、API 层、错误处理、测试和性能优化。当用户在 Vue 项目中创建、修改组件或模块，涉及架构设计、代码编写时自动激活。
version: 2.0.0
---

# Vue 3 项目规范

适用于使用 Vue 3 + TypeScript 的仓库。

## 项目结构

以下为中大型 Vue 3 项目的业界最佳实践结构，按项目实际情况裁剪：

```
src/
├── app/                        # 应用入口与全局配置
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 应用启动入口
│   └── router.ts               # 路由实例与配置
│
├── pages/                      # 页面组件（与路由一一对应）
│   ├── Dashboard/
│   │   ├── DashboardPage.vue
│   │   ├── components/         # 页面私有组件
│   │   └── composables/        # 页面私有 composables
│   ├── UserList/
│   └── Settings/
│
├── layouts/                    # 布局组件
│   ├── MainLayout.vue          # 主布局（侧边栏 + 顶栏 + 内容区）
│   ├── AuthLayout.vue          # 登录/注册页布局
│   └── BlankLayout.vue         # 空白布局（错误页等）
│
├── features/                   # 功能模块（按业务领域划分）
│   ├── auth/
│   │   ├── components/         # 模块组件
│   │   ├── composables/        # 模块 composables
│   │   ├── api.ts              # 模块 API 调用
│   │   ├── types.ts            # 模块类型定义
│   │   ├── constants.ts        # 模块常量
│   │   └── index.ts            # 模块公开导出
│   └── order/
│
├── components/                 # 全局共享 UI 组件
│   ├── AppButton/
│   │   ├── AppButton.vue
│   │   └── __tests__/
│   ├── AppModal/
│   ├── AppForm/
│   └── AppErrorBoundary/
│
├── composables/                # 全局共享 composables
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
│
├── services/                   # API 基础层
│   ├── request.ts              # Axios/fetch 实例与拦截器
│   └── endpoints/              # API 端点定义（如按领域拆分）
│
├── stores/                     # Pinia 状态管理
│   ├── authStore.ts
│   └── uiStore.ts
│
├── locales/                    # 国际化语言包
│   ├── zh-CN.json              # 中文
│   ├── en-US.json              # 英文
│   └── index.ts                # i18n 实例初始化（vue-i18n）
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
│   └── global.d.ts             # 全局类型扩展（组件类型、模块声明等）
│
├── utils/                      # 纯工具函数
│   ├── format.ts               # 日期、数字、货币格式化
│   ├── validators.ts           # 表单校验规则
│   └── storage.ts              # LocalStorage / SessionStorage 封装
│
├── directives/                 # 自定义指令
│   ├── vPermission.ts          # 权限指令
│   └── vClickOutside.ts        # 点击外部关闭
│
├── plugins/                    # Vue 插件注册
│   ├── i18n.ts                 # vue-i18n 插件配置
│   └── index.ts                # 插件统一注册入口
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

- `pages/` 做路由映射和布局组合，不放业务逻辑
- `layouts/` 定义页面骨架（侧边栏、顶栏、面包屑），由路由配置的 `component` 引用
- `features/` 按业务领域划分，模块内自包含（components + composables + api + types）
- `components/` 仅放无业务耦合的通用组件，可跨项目复用
- `composables/` 仅放通用逻辑（防抖、媒体查询等），业务 composables 放到对应 feature 中
- `locales/` 存放语言包 JSON 文件，模板中使用 `$t('key')` 而非硬编码文案
- `assets/` 存放静态资源，图标优先使用 SVG，图片优先使用 WebP/AVIF
- `config/` 封装环境变量和 Feature Flags，禁止组件中直接读取 `import.meta.env`
- `styles/themes/` 通过 CSS 变量实现主题切换，组件中引用变量而非硬编码颜色
- 每个模块通过 `index.ts` 管控公开 API，避免深层路径导入

## 组件设计规范

- 使用 `<script setup lang="ts">`
- 明确使用 `defineProps` / `defineEmits` 并附带类型
- 可复用逻辑优先提取到 composables
- 保持 template 可读，避免过深条件嵌套
- 优先使用计算属性，而不是重复维护状态
- 避免构建大型单体组件；**单文件规模**见 `templates/rules/vue.md`「**组件文件规模**」（约 300 行内为佳，逾 500 行或复杂度过高拆子组件与 Composables）
- 优先使用强类型的 props、emits 和暴露方法
- 遵循仓库的文件与目录命名规范
- 优先复用现有 UI 组件和 Token

### 组件分层

```
页面组件 (Pages)          → 路由映射、布局组合
  └── 容器组件 (Containers)  → 数据获取、状态编排
       └── 业务组件 (Features) → 领域逻辑展示
            └── 通用组件 (UI)   → 纯展示，无业务耦合
```

## 注释规范

- **优先使用中文**：解释「为什么这样做」、业务约束、边界情况、非显而易见的权衡时，优先用中文撰写注释，便于团队与业务方阅读。
- **与代码语言一致时的例外**：对接第三方协议字段名、HTTP 头、规范中的英文术语时，注释里可保留英文专有名词，必要时中英文并列说明。
- **少而精**：能通过清晰命名与类型表达清楚的逻辑不写废话注释；复杂分支、临时兼容、性能取舍必须写清意图。
- **公开 API**：composable 或模块的对外契约可用 JSDoc（`@param` / `@returns` / `@example`），说明用中文即可，除非仓库统一要求英文。

## TypeScript 规范

通用 TypeScript / JavaScript 约定见插件模板 **`templates/rules/typescript.md`**（初始化到项目后为 `.claude/rules/typescript.md`）。

### Vue 3 项目补充约定

```vue
<script setup lang="ts">
interface Props {
    title: string;
    items: Item[];
    loading?: boolean;
}

interface Emits {
    (e: 'select', item: Item): void;
    (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const emit = defineEmits<Emits>();
</script>
```

- Props 和 Emits 使用 TypeScript interface 定义
- 使用 `withDefaults` 设置默认值
- 禁止使用 `any`，优先使用精确类型
- `defineExpose` 暴露的方法需有类型约束

## Composables 规范

### 设计原则

- 以 `use` 前缀命名
- 返回值使用对象，明确标注类型
- 内部处理 loading / error / data 三态
- 支持参数响应式（接受 `Ref` 或 getter）

```typescript
export function useUserList(params: MaybeRef<QueryParams>) {
    const data = ref<User[]>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    async function fetch() {
        loading.value = true;
        error.value = null;
        try {
            const res = await getUserList(toValue(params));
            data.value = res.list;
        } catch (e) {
            error.value = e as Error;
        } finally {
            loading.value = false;
        }
    }

    watchEffect(() => { fetch(); });

    return { data: readonly(data), loading: readonly(loading), error: readonly(error), refetch: fetch };
}
```

### Composable 使用原则

- 返回 `readonly` 引用防止外部意外修改
- 数据请求场景优先使用 VueQuery / VueUse 等库（如项目已引入）
- `onUnmounted` 中清理定时器、事件监听等副作用
- 避免在 composable 中直接操作 DOM

## Slots 与 Provide/Inject

### Slots

- 用 `<slot>` 实现组件组合，而非过多 props
- 具名 slot 用于明确的布局区域
- 作用域 slot 传递数据给父组件自定义渲染

```vue
<template>
    <div class="card">
        <div class="card-header">
            <slot name="header">{{ title }}</slot>
        </div>
        <div class="card-body">
            <slot :data="processedData" :loading="loading" />
        </div>
    </div>
</template>
```

### Provide/Inject

- 用于跨多层级的上下文共享（主题、配置、权限）
- 提供 InjectionKey 保证类型安全
- 不要用 provide/inject 替代 props 传递直接父子数据

```typescript
// keys.ts
export const ThemeKey: InjectionKey<Ref<Theme>> = Symbol('theme');

// Provider.vue
provide(ThemeKey, theme);

// Consumer.vue
const theme = inject(ThemeKey);
```

## 路由规范

### 路由组织

```typescript
// app/router.ts
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'Dashboard', component: () => import('@/pages/Dashboard/DashboardPage.vue') },
            { path: 'users', name: 'UserList', component: () => import('@/pages/UserList/UserListPage.vue') },
            { path: 'users/:id', name: 'UserDetail', component: () => import('@/pages/UserDetail/UserDetailPage.vue') },
            { path: 'settings', name: 'Settings', component: () => import('@/pages/Settings/SettingsPage.vue') },
        ],
    },
    { path: '/login', name: 'Login', component: () => import('@/pages/Login/LoginPage.vue') },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/NotFound.vue') },
];
```

### 路由原则

- 路由配置集中管理，每个路由必须有 `name`
- 页面组件使用动态 `import()` 按需加载
- 权限控制使用路由守卫（`beforeEach`），而非在每个页面内判断
- URL 参数（分页、筛选、排序）与路由状态同步

```typescript
// 导航守卫
router.beforeEach((to) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        return { name: 'Login', query: { redirect: to.fullPath } };
    }
});
```

## 状态管理（Pinia）

| 状态类型 | 推荐方案 |
|----------|----------|
| 组件内临时 UI 状态 | `ref` / `reactive` |
| 跨组件共享业务状态 | Pinia store |
| 服务端数据缓存 | VueQuery / 自定义 composable |
| URL 驱动状态 | 路由参数 / `useRoute().query` |
| 表单状态 | VeeValidate / FormKit |

### Pinia Store 规范

使用 Composition API 风格（`setup store`）：

```typescript
// stores/authStore.ts
export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem('token'));

    const isLoggedIn = computed(() => !!token.value);

    async function login(credentials: LoginParams) {
        const res = await authApi.login(credentials);
        user.value = res.user;
        token.value = res.token;
        localStorage.setItem('token', res.token);
    }

    function logout() {
        user.value = null;
        token.value = null;
        localStorage.removeItem('token');
    }

    return { user: readonly(user), isLoggedIn, login, logout };
});
```

### Store 原则

- 每个 store 职责单一，按领域拆分
- 对外暴露 `readonly` 的状态，通过 action 修改
- 不要在 store 中存放 UI 临时状态（modal 开关、表单输入等）
- 服务端数据优先用请求库管理，而非手动存入 store

## API 层规范

### 请求实例

```typescript
// services/request.ts
const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
});

request.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
});

request.interceptors.response.use(
    (res) => res.data,
    (error) => {
        if (error.response?.status === 401) {
            const authStore = useAuthStore();
            authStore.logout();
            router.push({ name: 'Login' });
        }
        return Promise.reject(normalizeError(error));
    },
);
```

### API 函数

```typescript
// features/user/api.ts
export function getUserList(params: UserQueryParams): Promise<PageResult<User>> {
    return request.get('/users', { params });
}

export function updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    return request.put(`/users/${id}`, data);
}
```

- API 函数按 feature 组织，而非全部堆在一个文件
- 请求参数和响应都有类型约束
- 拦截器统一处理认证、错误格式化

## 错误处理

### 全局错误捕获

```typescript
// main.ts
app.config.errorHandler = (err, instance, info) => {
    reportError(err, { component: instance?.$options.name, info });
};
```

### 组件级错误

- 使用 `onErrorCaptured` 在父组件中捕获子组件错误
- 数据请求失败需有用户可见的提示和重试机制
- 不要吞掉错误（空 catch 块）

## 自定义指令

```typescript
// directives/vPermission.ts
export const vPermission: Directive<HTMLElement, string> = {
    mounted(el, binding) {
        const authStore = useAuthStore();
        if (!authStore.hasPermission(binding.value)) {
            el.parentNode?.removeChild(el);
        }
    },
};
```

- 指令只处理 DOM 层面的操作
- 业务逻辑不要放在指令中
- 需要响应式更新时实现 `updated` 钩子

## 样式规范

- 使用 `<style scoped>` 隔离样式
- 深度选择器使用 `:deep()` 而非已废弃的 `::v-deep`
- 与项目现有样式体系保持一致
- 动态样式优先使用 `:class` / `:style` 绑定
- 复杂主题切换使用 CSS 变量
- 主题/全局变量通过 CSS 变量或 Token 管理

## 测试规范

### 必须测试

- 核心交互行为（点击、输入、提交）
- 条件渲染（loading / error / empty / data）
- Emits 的触发和 payload
- 关键 composables 的返回值
- Pinia store 的 action 和 getter

### 测试风格

```typescript
describe('UserForm', () => {
    it('should emit submit with valid data', async () => {
        const wrapper = mount(UserForm);

        await wrapper.find('[data-testid="username"]').setValue('test');
        await wrapper.find('form').trigger('submit');

        expect(wrapper.emitted('submit')?.[0]).toEqual([{ username: 'test' }]);
    });

    it('should show validation error on empty submit', async () => {
        const wrapper = mount(UserForm);
        await wrapper.find('form').trigger('submit');
        expect(wrapper.text()).toContain('用户名不能为空');
    });
});
```

### Store 测试

```typescript
describe('authStore', () => {
    beforeEach(() => setActivePinia(createPinia()));

    it('should login and set user', async () => {
        const store = useAuthStore();
        await store.login({ username: 'admin', password: 'pass' });
        expect(store.isLoggedIn).toBe(true);
    });
});
```

## 性能

- 使用 `shallowRef` / `shallowReactive` 优化大型对象
- 大列表使用虚拟滚动
- 避免在 `v-for` 中使用 `v-if`（提取为 computed 过滤）
- 使用 `defineAsyncComponent` 懒加载重型组件
- `v-for` 必须有稳定的 `:key`
- 路由组件使用动态 `import()` 按需加载

## 反模式

- 在模板驱动组件中内联大段业务逻辑
- 本该用 computed 却使用大范围 watcher
- 事件 payload 不明确
- 在纯展示组件中直接混入原始 API 调用
- ref 和 props 没有类型约束
- 用 `watch` + 手动赋值模拟 computed
- 在一个组件中混入无关职责
- 用大范围全局样式覆盖去解决局部 UI 问题
- 将所有状态推入 Pinia store，而非就近管理
- 在 `components/` 中放业务耦合组件
- 直接从 feature 内部深层路径导入，绕过 `index.ts`

## 输出检查清单

- [ ] 文件结构与项目约定一致（pages / features / components 分离）
- [ ] 使用 `<script setup lang="ts">`
- [ ] Props / Emits 类型完整
- [ ] 解释性注释是否优先使用中文且点到要害
- [ ] 可复用逻辑已提取到 composable
- [ ] Loading / Error / Empty 状态均已处理
- [ ] 路由组件使用动态 import 加载
- [ ] 状态管理方案合理（就近原则）
- [ ] API 调用有类型约束和统一错误处理
- [ ] 样式使用 scoped 隔离
- [ ] 关键行为有测试覆盖
