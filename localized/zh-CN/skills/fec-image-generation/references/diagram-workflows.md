# 图表工作流

## 事实源选择

| 图表类型 | 首选源 | QA 重点 |
| ------------ | ---------------- | -------- |
| ER 图 | Mermaid ER、DBML、Graphviz、SVG | 基数标签、表名、关键字段、交叉关系。 |
| UML 类图 | Mermaid class、PlantUML、Graphviz | 继承方向、方法/属性换行、包分组。 |
| 序列图 | Mermaid sequence、PlantUML | lifeline 顺序、activation 范围、异步/返回箭头、消息文本。 |
| 技术架构 | HTML `architecture` IR、Mermaid flowchart、C4/Structurizr、SVG/HTML、draw.io | 分层分组、信任边界、数据流方向、图例。 |
| Agent / memory 架构 | 带语义节点类型和 flow 连线的 HTML `architecture` IR、SVG/HTML、draw.io | read/write 路径分离、tool-call 回路、memory 分层、retrieval 标签、flow legend。 |
| ML / 深度学习 | SVG/HTML/canvas | tensor shape、层顺序、分支汇合、重复块、注释。 |
| 流程图 / 流程工作流 | HTML `workflow` IR、Mermaid flowchart、SVG、draw.io | 决策标签、终止状态、回环可读性、连接线间距、异常路径清晰度。 |
| 会话实时草图 | 本地交互式浏览器服务 | 增量呈现、session 隔离、拖拽后的标签可读性、导出交接。 |

## 交互式实时图表

当图表本身是对话的一部分，并且用户能从“边生成边看见结构出现”中受益时，使用实时路线。它适合流程草图、架构初稿、简短思维导图式拆解，以及需要先拖拽或改标签再导出的快速讲解图。

启动本地服务：

```bash
node skills/fec-image-generation/scripts/interactive-diagram-server.mjs --port 6100
```

打开 `http://127.0.0.1:6100/?s=meaningful-session-id`，再向 `/cmd?s=meaningful-session-id` 发送命令。每张图都必须使用唯一 session id。先发送 `init`，再添加节点，最后添加连线；每条命令尽量小，让浏览器能持续增量更新。

支持的命令包括 `init`、`node`、`edge`、`container`、`remove`、`clear`、`layout`、`title` 和 `export`。支持的节点类型包括 `terminal`、`terminal-end`、`process`、`decision`、`service`、`database`、`success`、`error` 和 `container`。

服务端导出可用 `/export?s=session-id&format=json`、`svg` 或 `drawio`。PNG 导出使用浏览器工具栏。如果本地服务无法启动，不要阻塞用户，改用 Mermaid、SVG 或 HTML technical diagrams。

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
- **箭头含义不清：** 添加 `flow` 和简短标签，不要只依赖颜色。

## 架构图

用户需要浏览器可打开的单文件、显式系统拓扑、分组、信任边界、数据流和 PNG QA 时，优先使用 HTML `architecture` IR。需要官方厂商图形、diagrams.net 编辑或长期人工维护时，使用 draw.io。希望图主要留在 Markdown 或纯文本技术文档中时，使用 Mermaid/C4。

Agent、memory、RAG、tool-call 或 multi-agent 图中，如果形状能帮助解释系统，优先使用语义 architecture 节点类型：`agent`、`model`、`memory`、`vectorstore`、`graphdb`、`tool`、`document`、`queue`、`browser`、`user`、`gateway`。使用 `flow` 值 `control`、`data`、`read`、`write`、`async`、`feedback` 区分读取路径、写入路径、事件和推理回路。先把结构画清楚，再添加 `visual.style`。

UML 覆盖优先走确定性源：class、ER、state-machine、activity 和 sequence 需求可使用 Mermaid、PlantUML、HTML technical diagrams、SVG 或 draw.io。需要后续人工编辑或官方记法库时优先 draw.io；需要浏览器可打开交付和 PNG QA 时优先 HTML/SVG。

## 流程工作流

用户需要浏览器可打开的流程地图、审批流、自动化 runbook、事故流程或循环运营流程，并且需要泳道、步骤编号、参与者、决策、异常路径和摘要卡片时，优先使用 HTML `workflow` IR。流程必须作为 `.drawio` 文件长期维护、需要 diagrams.net 编辑、官方形状库、手工泳道维护或交付后由利益相关方继续修改时，改用 `fec-drawio-studio`。

## 导出指引

位图 PNG 优先以 2x 倍率导出；只有在文字仍清晰时才下采样。凡是未来可能修改图表的地方，都应提交或附上可编辑源文件。
