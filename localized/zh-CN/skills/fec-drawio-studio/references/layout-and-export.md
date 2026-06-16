# 布局与导出

## 自动布局

依赖图、代码结构图和超过约 15 个节点的图表使用 `layout-graph.mjs`。较小图表如果坐标、容器和边锚点可以直接审查，也可以手工编写 XML。

```bash
node skills/fec-drawio-studio/scripts/layout-graph.mjs graph.json --output diagram.drawio --manifest layout.json
```

输入 graph：

```json
{
  "direction": "TB",
  "nodes": [
    { "id": "client", "label": "Web Client", "group": "Client" },
    { "id": "api", "label": "API", "group": "Service" }
  ],
  "edges": [
    { "source": "client", "target": "api", "label": "HTTPS" }
  ]
}
```

Graphviz `dot` 是可选项。若缺失，可手动摆放图表，或交付 XML 加 diagrams.net URL。

## 手工布局

- 将可见顶点的 `x` 和 `y` 对齐到 10px 网格。
- 页面外边距至少保留 60px，并留出足够空间，避免连接线穿过标签。
- 同一行或同一列的同级节点使用一致尺寸和一致间距，除非内容明确需要不同尺寸。
- 显式标签换行使用 `&#xa;`；不要在 draw.io `value` 属性中写 literal `\n`。
- 标签包含 `whiteSpace=wrap;html=1`，默认使用 `fontSize=14`，12 是最小可读例外。
- 容器、侧边栏和泳道应按内容加均衡 padding 后收紧。最后一行不满时，将其居中或拆分分组，不要留下大面积空尾。

## 导出

预览：

```bash
node skills/fec-drawio-studio/scripts/drawio-export.mjs diagram.drawio --format png --output diagram.png --width 2000
```

最终可编辑 PNG：

```bash
node skills/fec-drawio-studio/scripts/drawio-export.mjs diagram.drawio --format png --output diagram.drawio.png --scale 2 --embed
node skills/fec-drawio-studio/scripts/png-embed-fix.mjs diagram.drawio.png
```

可在不实际调用 draw.io 导出的情况下检查命令：

```bash
node skills/fec-drawio-studio/scripts/drawio-export.mjs diagram.drawio --format png --output diagram.png --scale 2 --width 2000 --dry-run --json
```

兜底 URL：

```bash
node skills/fec-drawio-studio/scripts/diagram-url.mjs diagram.drawio --edit
```

为 XML、Mermaid 或 CSV 创建/导入 URL：

```bash
node skills/fec-drawio-studio/scripts/diagram-url.mjs diagram.drawio --create --type xml --json
node skills/fec-drawio-studio/scripts/diagram-url.mjs flow.mmd --create --type mermaid
node skills/fec-drawio-studio/scripts/diagram-url.mjs org.csv --create --type csv --lightbox
```

自托管 diagrams.net 端点使用 `--base-url`。通过 Windows shell 工具打开 URL 时，使用 `--shortcut` 或 JSON `windowsShortcut` 字段。
