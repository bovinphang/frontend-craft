# 图表工作流

## 事实源选择

| 图表类型 | 首选源 | QA 重点 |
| ------------ | ---------------- | -------- |
| ER 图 | Mermaid ER、DBML、Graphviz、SVG | 基数标签、表名、关键字段、交叉关系。 |
| UML 类图 | Mermaid class、PlantUML、Graphviz | 继承方向、方法/属性换行、包分组。 |
| 序列图 | Mermaid sequence、PlantUML | lifeline 顺序、activation 范围、异步/返回箭头、消息文本。 |
| 技术架构 | HTML `architecture` IR、Mermaid flowchart、C4/Structurizr、SVG/HTML、draw.io | 分层分组、信任边界、数据流方向、图例。 |
| ML / 深度学习 | SVG/HTML/canvas | tensor shape、层顺序、分支汇合、重复块、注释。 |
| 流程图 | Mermaid flowchart、SVG | 决策标签、终止状态、回环可读性、连接线间距。 |

## 最小源清单

渲染路径允许时，在 PNG 旁保存布局 manifest：

```json
{
  "canvas": { "width": 1280, "height": 720 },
  "boxes": [
    { "id": "api", "x": 80, "y": 120, "width": 220, "height": 96, "label": "API Gateway" }
  ],
  "connectors": [
    { "id": "api-db", "from": "api", "to": "db", "points": [[300, 168], [560, 168]] }
  ]
}
```

坐标是导出后的 PNG 像素坐标。boxes 应覆盖可见标签/节点边界，而不仅是中心点。

## 图表修复手册

- **节点重叠：** 增加 rank/列间距、拆分簇，或将低优先级注释移入图例。
- **标签截断：** 加宽节点、添加手动换行、缩短标签，或提高导出倍率。
- **连接线穿过标签：** 添加 waypoints、沿框体周围正交布线，或将标签移到线段上方。
- **连接线堆叠：** 用不同 waypoints 分离平行边，或用带共享标签的 bus 汇总。
- **边缘裁剪：** 增加外边距，或扩大导出 viewBox/canvas 尺寸。
- **密集图不可读：** 拆成总览图加细节图，不要整体缩小。

## 架构图

用户需要浏览器可打开的单文件、显式系统拓扑、分组、信任边界、数据流和 PNG QA 时，优先使用 HTML `architecture` IR。需要官方厂商图形、diagrams.net 编辑或长期人工维护时，使用 draw.io。希望图主要留在 Markdown 或纯文本技术文档中时，使用 Mermaid/C4。

## 导出指引

位图 PNG 优先以 2x 倍率导出；只有在文字仍清晰时才下采样。凡是未来可能修改图表的地方，都应提交或附上可编辑源文件。
