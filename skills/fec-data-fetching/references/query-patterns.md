# TanStack Query 进阶模式

## QueryClient 默认配置

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: true,
    },
  },
});
```

## Query Key

- 推荐：`["users", "list", { page, status }]`
- 详情：`["users", "detail", userId]`
- 所有影响请求结果的参数都必须进入 key。

## 乐观更新

```tsx
const mutation = useMutation({
  mutationFn: () => api.likePost(postId),
  onMutate: async () => {
    await queryClient.cancelQueries({ queryKey: ["post", postId] });
    const previousPost = queryClient.getQueryData(["post", postId]);
    queryClient.setQueryData(["post", postId], (old: Post) => ({
      ...old,
      likes: old.likes + 1,
      liked: true,
    }));
    return { previousPost };
  },
  onError: (_error, _variables, context) => {
    queryClient.setQueryData(["post", postId], context?.previousPost);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["post", postId] });
  },
});
```

## Infinite Query

```tsx
const feed = useInfiniteQuery({
  queryKey: ["feed"],
  queryFn: ({ pageParam = 1 }) => api.fetchFeed({ page: pageParam, limit: 20 }),
  getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
  initialPageParam: 1,
});
```

虚拟列表场景将数据分页与 DOM 虚拟化分开设计。

## API 层整合

```ts
export async function getUserList(params: GetUserListParams): Promise<GetUserListResponse> {
  return request.get("/api/users", { params });
}

export function useUsers(params: GetUserListParams) {
  return useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => getUserList(params),
    select: (response) => response.list,
  });
}
```

API 函数不包含 UI toast、loading 或缓存逻辑。
