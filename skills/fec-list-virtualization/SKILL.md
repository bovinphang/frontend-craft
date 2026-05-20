---
name: fec-list-virtualization
description: Use when optimizing or reviewing large lists, virtual scrolling, windowing, react-window, TanStack Virtual, variable-height rows, dynamic measurement, infinite scroll, grid virtualization, or scroll performance; Chinese triggers include 虚拟列表, 大列表优化, 滚动性能.
---

# 列表虚拟化优化

仅渲染可视区域内的列表项，在大数据量下保持 60fps 滚动流畅度。

## Purpose

解决大列表（1000+ 项）全量渲染导致的 DOM 节点过多、内存占用高、滚动卡顿问题，通过窗口化技术只渲染可视区域及缓冲区的元素。

## When to Use

- 数据表格 / 列表有 500+ 条记录
- 无限滚动 Feed（社交动态、聊天消息、日志）
- 长下拉选择框（城市列表、SKU 选择）
- 虚拟树形组件（文件目录、组织架构）
- 滚动时出现明显卡顿或 Chrome DevTools Memory 飙升

**不适用**：

- 列表 < 100 项（全量渲染无性能问题）
- 需要 SEO 索引的内容（虚拟项不在 DOM 中）
- 需要浏览器原生 Ctrl+F 全文搜索

## Procedure

### 1. 库选型

| 库                    | 适用场景            | 体积  | 特点                                     |
| --------------------- | ------------------- | ----- | ---------------------------------------- |
| **react-window**      | 推荐，基础场景      | ~3KB  | 轻量，固定/可变高度，API 简洁            |
| **TanStack Virtual**  | 框架无关 / 高级场景 | ~7KB  | 支持 React/Vue/Solid，动态测量，无限滚动 |
| **react-virtualized** | 遗留维护            | ~16KB | 功能最全但体积大，新项目不推荐           |

```bash
npm install react-window
# 或
npm install @tanstack/react-virtual
```

### 2. 固定高度列表（react-window）

适用于所有项高度一致的场景（如联系人列表、日志行）。

```tsx
import { FixedSizeList as List } from "react-window";

interface RowData {
  items: User[];
}

const Row = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: RowData;
}) => (
  <div style={style}>
    {/* style 包含 position: absolute / top / height，必须透传 */}
    {data.items[index].name}
  </div>
);

const UserList = ({ users }: { users: User[] }) => (
  <List
    height={500} // 可视区域高度（px）
    itemCount={users.length}
    itemSize={48} // 每项固定高度（px）
    width="100%"
    itemData={{ items: users }}
  >
    {Row}
  </List>
);
```

**关键点**：

- `style` 属性必须透传到 Row 根元素，否则定位失效
- 通过 `itemData` 传递外部数据，避免 Row 组件闭包捕获导致不必要的重渲染

### 3. 可变高度列表

适用于项高度不一致但可预先计算的场景（如带摘要的卡片列表）。

```tsx
import { VariableSizeList as List } from "react-window";

// 根据 index 返回高度 — 必须同步返回
const getItemSize = (index: number) => {
  // 例如：有摘要的卡片 120px，普通卡片 60px
  return items[index].hasSummary ? 120 : 60;
};

const CardList = ({ items }: { items: Card[] }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={getItemSize}
    width="100%"
  >
    {CardRow}
  </List>
);
```

### 4. 动态高度列表（TanStack Virtual）

适用于高度无法预先计算、需运行时测量的场景（如聊天消息、富文本列表）。

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

const ChatList = ({ messages }: { messages: Message[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // 预估高度，用于初始布局
    overscan: 5, // 缓冲区项数（上下各 5 项）
  });

  return (
    <div ref={parentRef} style={{ height: "500px", overflow: "auto" }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {/* 实际内容 — 高度会被自动测量并修正 */}
            <MessageItem message={messages[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 5. 无限滚动

结合数据分页与虚拟列表，实现滚动加载：

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";

const InfiniteFeed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam }) => fetchFeedPage(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  const allItems = data?.pages.flatMap((p) => p.items) ?? [];
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length, // +1 用于占位加载项
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });

  // 滚动到底部时自动加载
  const lastItem = virtualizer.getVirtualItems().at(-1);
  if (
    lastItem &&
    lastItem.index >= allItems.length &&
    hasNextPage &&
    !isFetchingNextPage
  ) {
    fetchNextPage();
  }

  return (
    <div ref={parentRef} style={{ height: "100vh", overflow: "auto" }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const item = allItems[row.index];
          if (!item) return <LoadingPlaceholder key="loader" style={row} />;
          return <FeedItem key={item.id} item={item} style={row} />;
        })}
      </div>
    </div>
  );
};
```

### 6. 网格虚拟化

二维网格（如图片墙、数据透视表）：

```tsx
import { FixedSizeGrid as Grid } from "react-window";

const Cell = ({
  columnIndex,
  rowIndex,
  style,
}: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
}) => (
  <div style={style}>
    Row {rowIndex}, Col {columnIndex}
  </div>
);

const DataGrid = () => (
  <Grid
    columnCount={50}
    columnWidth={150}
    height={500}
    rowCount={1000}
    rowHeight={40}
    width={800}
  >
    {Cell}
  </Grid>
);
```

## Constraints

- **SEO**: 虚拟项不在 DOM 中直到被滚动到，搜索引擎无法索引。SEO 关键内容用服务端渲染或"加载更多"按钮替代
- **Ctrl+F**: 浏览器原生搜索无法找到不在 DOM 中的项。如需搜索，提供独立的搜索输入框
- **动态高度性能**: `VariableSizeList` 的 `getItemSize` 必须同步返回，不可包含异步计算或 DOM 测量
- **overscan 权衡**: 缓冲区过大浪费内存，过小导致滚动白屏。推荐 `overscan: 3-5`
- **子元素定位**: Row 组件内部不能使用 `position: sticky` 或 `overflow: auto`，会破坏虚拟滚动布局
- **ResizeObserver**: 动态高度列表需监听容器尺寸变化，旧浏览器需 polyfill

## Expected Output

- 滚动 10000+ 项列表保持 60fps 流畅度
- DOM 节点数稳定在可视区域的 2-3 倍（而非全量渲染）
- 内存占用从 O(n) 降至 O(visible)

## Related Agent

- [performance-optimizer](../../agents/performance-optimizer.md) — 性能分析与优化，可通过 Profiler 验证虚拟化效果
