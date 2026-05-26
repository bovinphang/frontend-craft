---
name: fec-data-fetching
description: Use when implementing or reviewing TanStack Query/React Query server-state flows: typed queries, query keys, caching, invalidation, mutations, optimistic updates, infinite queries, prefetch, SSR hydration, or API-layer integration. Do not use for local UI state or Service Worker caching; Chinese triggers include 数据获取, 缓存, 乐观更新.
---

# TanStack Query 数据获取

## Purpose

用声明式 server state 管理替代手写 `useEffect + loading`。

## Procedure

1. 判断状态来源：来自服务端且需要缓存、去重、刷新、分页或 mutation 时使用 TanStack Query；纯本地 UI 状态用 `useState`/store。
2. 建立 `QueryClientProvider`，按业务数据新鲜度设置 `staleTime`、`gcTime`、retry 和窗口聚焦刷新。
3. 设计稳定 query key：数组结构包含实体、动作和所有影响结果的参数。
4. API 函数保持纯请求函数，Query hook 负责缓存、select、loading/error/empty 状态。
5. mutation 成功后 invalidation；需要即时反馈时使用 optimistic update 并在 `onError` 回滚。

## Quick Start

```tsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function UserList({ keyword }: { keyword: string }) {
  const query = useQuery({
    queryKey: ["users", "list", { keyword }],
    queryFn: () => getUserList({ keyword, page: 1, pageSize: 20 }),
    select: (response) => response.list,
  });

  if (query.isLoading) return <Skeleton />;
  if (query.isError) return <ErrorFallback onRetry={() => query.refetch()} />;
  if (!query.data?.length) return <EmptyState />;

  return query.data.map((user) => <UserRow key={user.id} user={user} />);
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
```

## Detailed References

Load [references/query-patterns.md](references/query-patterns.md) for QueryClient defaults, optimistic update, infinite queries, prefetching, SSR hydration, and API-layer integration.

## Constraints

- 相同数据必须复用相同 query key；参数缺失会造成缓存串读。
- `staleTime` 过长会显示旧数据，过短会造成频繁请求。
- TanStack Query 不管理本地 UI 状态；不要把 modal、输入框值放进 query cache。
- 乐观更新必须保存快照并在 `onError` 回滚。
- Next.js App Router SSR 需要 `dehydrate` / `HydrationBoundary`。

## Expected Output

数据获取层具备 loading/error/empty/data 状态，重复请求自动去重，mutation 后缓存正确失效或回滚，API 层与 UI 层边界清晰。

