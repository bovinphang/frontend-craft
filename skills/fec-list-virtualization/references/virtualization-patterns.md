# 虚拟列表模式

## 固定高度列表

```tsx
import { FixedSizeList as List } from "react-window";

const Row = ({ index, style, data }: { index: number; style: React.CSSProperties; data: User[] }) => (
  <div style={style}>{data[index].name}</div>
);

export const UserList = ({ users }: { users: User[] }) => (
  <List height={500} itemCount={users.length} itemSize={48} width="100%" itemData={users}>
    {Row}
  </List>
);
```

## 可变高度

```tsx
import { VariableSizeList as List } from "react-window";

const getItemSize = (index: number) => (items[index].hasSummary ? 120 : 60);

<List height={600} itemCount={items.length} itemSize={getItemSize} width="100%">
  {CardRow}
</List>;
```

## 动态高度

```tsx
const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 60,
  overscan: 5,
});
```

动态内容需要测量元素并处理 ResizeObserver。

## 无限滚动

- `count` 包含 loader 占位项。
- 最后一个虚拟项进入视口时调用 `fetchNextPage()`。
- 不要在 render 中无条件触发请求，使用 effect 或明确状态保护。

## 网格虚拟化

二维网格使用 `FixedSizeGrid` 或 TanStack Virtual 的 row/column 双轴方案，确保单元格 style 透传。
