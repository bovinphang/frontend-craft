# 布局与导出

## 自动布局

依赖图、代码结构图和超过约 15 个节点的图表使用 `layout-graph.mjs`。

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

## 导出

预览：

```bash
drawio -x -f png --width 2000 -o diagram.png diagram.drawio
```

最终可编辑 PNG：

```bash
drawio -x -f png -e -s 2 -o diagram.drawio.png diagram.drawio
node skills/fec-drawio-studio/scripts/png-embed-fix.mjs diagram.drawio.png
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
