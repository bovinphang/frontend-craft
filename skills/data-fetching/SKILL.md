---
name: fec-data-fetching
description: TanStack Query 数据获取规范，涵盖 useQuery/useMutation、缓存策略、query invalidation、乐观更新、无限滚动、与服务端状态管理集成。当用户提到 TanStack Query、React Query、数据获取、缓存、乐观更新时自动激活。
version: 1.0.0
---

# TanStack Query 数据获取

用声明式方式管理服务端状态（获取、缓存、同步、更新），替代手动 useEffect + loading state 模式。

## Purpose

统一管理 API 数据的获取、缓存、同步和失效，自动处理 loading/error 状态、重复请求去重、后台静默刷新，大幅减少数据获取相关的样板代码。

## When to Use

- 从 REST / GraphQL API 获取数据
- 需要缓存、请求去重、后台更新
- 需要乐观更新（Optimistic Update）
- 无限滚动 / 分页加载
- 多组件共享同一份服务端数据

**不适用**：

- 本地同步状态（用 useState / Zustand）
- 一次性不需要缓存的数据获取

## Procedure

### 1. 安装与配置

```bash
npm install @tanstack/react-query
```

```tsx
// app/providers.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分钟内数据视为新鲜
      gcTime: 30 * 60 * 1000, // 30 分钟后回收缓存（旧称 cacheTime）
      retry: 2, // 失败重试 2 次
      refetchOnWindowFocus: true, // 切回窗口时自动刷新
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 2. useQuery — 数据获取

```tsx
import { useQuery } from "@tanstack/react-query";
import {
  getUserList,
  type GetUserListParams,
  type User,
} from "@/api/modules/user";

const UserList = ({ keyword }: { keyword: string }) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["users", { keyword }], // 缓存 key，keyword 变化时自动重新获取
    queryFn: () => getUserList({ page: 1, pageSize: 20, keyword }),
    select: (response) => response.list, // 可选：从响应中提取需要的数据
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorFallback onRetry={refetch} />;
  if (!data?.length) return <EmptyState />;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

**缓存 Key 约定**：

- 使用数组形式：`['entity', 'action', { params }]`
- 示例：`['users', 'list', { page: 1, status: 'active' }]`
- 包含所有影响请求结果的参数，确保缓存命中准确

**状态区分**：
| 状态 | 含义 | 用途 |
|------|------|------|
| `isLoading` | 首次请求，无缓存数据 | 显示全局 Skeleton |
| `isFetching` | 后台刷新中（有缓存） | 显示右上角刷新指示器 |
| `isPending` | 同 isLoading（v5 别名） | — |
| `isError` | 请求失败 | 显示错误提示 |

### 3. useMutation — 数据变更

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/api/modules/user";

const CreateUserForm = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 创建成功后，使用户列表缓存失效并自动重新获取
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });

  const handleSubmit = (data: CreateUserParams) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(formData);
      }}
    >
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "创建中..." : "创建用户"}
      </button>
      {mutation.isError && <p role="alert">{mutation.error.message}</p>}
    </form>
  );
};
```

### 4. 乐观更新（Optimistic Update）

在请求完成前立即更新 UI，请求失败时回滚：

```tsx
const LikeButton = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => api.likePost(postId),
    // 1. 突变前：保存当前缓存快照
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      const previousPost = queryClient.getQueryData(["post", postId]);

      // 2. 立即乐观更新
      queryClient.setQueryData(["post", postId], (old: Post) => ({
        ...old,
        likes: old.likes + 1,
        liked: true,
      }));

      return { previousPost };
    },
    // 3. 失败时回滚
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["post", postId], context?.previousPost);
    },
    // 4. 成功后刷新确保数据一致
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  return (
    <button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      点赞
    </button>
  );
};
```

### 5. 无限滚动（Infinite Query）

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Feed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam = 1 }) =>
        api.fetchFeed({ page: pageParam, limit: 20 }),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.hasMore ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  // 滚动到底部自动加载
  useEffect(() => {
    const handler = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div>
      {allPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Skeleton count={5} />}
      {!hasNextPage && allPosts.length > 0 && <p>已加载全部</p>}
    </div>
  );
};
```

### 6. 预获取（Prefetch）

在用户悬停或导航前预先加载数据：

```tsx
const UserLink = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["user", userId],
      queryFn: () => api.getUser(userId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return (
    <a href={`/users/${userId}`} onMouseEnter={prefetch}>
      查看详情
    </a>
  );
};
```

### 7. 与 API 层集成

遵循 `templates/shared/rules/api-layer.md`，API 函数保持纯函数（返回 Promise），TanStack Query 负责缓存和状态：

```ts
// api/modules/user.ts — 纯 API 定义，不包含 UI 逻辑
export async function getUserList(
  params: GetUserListParams,
): Promise<GetUserListResponse> {
  return request.get("/api/users", { params });
}

// hooks/useUsers.ts — 数据获取层，封装 Query
export function useUsers(params: GetUserListParams) {
  return useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => getUserList(params),
    select: (res) => res.list,
  });
}
```

## Constraints

- **queryKey 一致性**: 相同数据的查询必须使用相同的 queryKey，否则缓存无法命中
- **staleTime 设置**: 过长导致用户看到旧数据，过短导致频繁请求。根据数据更新频率调整
- **不用于本地状态**: TanStack Query 管理服务端状态。本地 UI 状态用 useState/Zustand
- **mutation 回滚**: 乐观更新必须在 onError 中回滚，否则失败后 UI 与服务器数据不一致
- **gcTime**: v5 中 cacheTime 改名为 gcTime（garbage collection time），控制缓存回收时间
- **SSR**: Next.js App Router 中用 `HydrationBoundary` / `dehydrate` 在服务端预填充缓存

## Expected Output

- 数据获取层自动处理 loading/error/empty 三态
- 重复请求自动去重，窗口聚焦时自动刷新
- mutation 后自动 invalidation 相关查询缓存
- 相比 useEffect 手动模式减少 60%+ 样板代码

## Related Agent

- [frontend-architect](../../agents/frontend-architect.md) — API 层与数据获取架构设计
