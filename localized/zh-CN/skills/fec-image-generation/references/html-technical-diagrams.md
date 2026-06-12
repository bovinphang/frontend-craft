# HTML 技术图

当技术图需要单文件浏览器打开、便于分享、支持暗/亮主题，并且导出 PNG 后要做视觉 QA 时，使用这一路线。

这一路线补充但不替代其他图表源：

| 需求 | 优先选择 |
| ---- | -------- |
| 小型 Markdown 维护图 | Mermaid、Graphviz 或 SVG |
| 后续人工编辑的图源 | `fec-drawio-studio` 和 `.drawio` |
| 浏览器可打开的主题化技术图 | HTML 技术图路线 |
| 位图优先的视觉概念、海报、产品图或图片编辑 | 图片生成或编辑路线 |

## 支持的图表意图

- `architecture`：系统拓扑、云区域、信任边界、客户端、网关、服务、数据存储、事件总线、认证流和基础设施总览。
- `workflow`：职责泳道、审批门禁、runbook、CI/CD、事故响应、工具调用和请求生命周期。
- `sequence`：参与者随时间交互、API 调用链、缓存回退、鉴权检查、异步链路和返回消息。
- `dataflow`：来源、采集、处理、存储、消费者、PII 边界、治理、分析和血缘。
- `lifecycle`：对象状态、终止状态、重试、等待、取消、超时、部署或订单状态流转。

浏览器可交付的架构总览优先用 `architecture` 模式。需要 `.drawio` 源、官方厂商图标、diagrams.net 手工编辑或复杂自动布局时，改用 `fec-drawio-studio`。

## JSON IR

所有模式都需要：

```json
{
  "schema_version": 1,
  "diagram_type": "architecture",
  "meta": {
    "title": "SaaS Architecture",
    "subtitle": "Browser-ready infrastructure overview"
  }
}
```

各模式最小字段：

- `architecture`：`nodes`、`connections`；可选 `groups`、`legend`、`summary`。
- `workflow`：`lanes`、`nodes`、`edges`。
- `sequence`：`participants`、`messages`。
- `dataflow`：`stages`、`nodes`、`flows`。
- `lifecycle`：`lanes`、`states`、`transitions`。

ID 必须以字母开头，只使用字母、数字、`_` 和 `-`。节点标签保持短小；较长说明放到图外文字或摘要卡片。

## Architecture IR

架构图使用显式坐标，因为系统图通常需要刻意安排位置、边界和信任区域：

```json
{
  "schema_version": 1,
  "diagram_type": "architecture",
  "meta": {
    "title": "SaaS Architecture",
    "subtitle": "Browser-ready infrastructure overview"
  },
  "groups": [
    { "id": "cloud", "label": "Cloud region", "type": "cloud", "x": 170, "y": 50, "width": 620, "height": 280 }
  ],
  "nodes": [
    { "id": "web", "label": "Web App", "type": "frontend", "x": 48, "y": 160, "sublabel": "React" },
    { "id": "api", "label": "API Gateway", "type": "cloud", "x": 230, "y": 160, "group": "cloud" },
    { "id": "svc", "label": "App Service", "type": "backend", "x": 420, "y": 160, "group": "cloud" },
    { "id": "db", "label": "PostgreSQL", "type": "database", "x": 620, "y": 160, "group": "cloud" }
  ],
  "connections": [
    { "from": "web", "to": "api", "label": "HTTPS", "variant": "emphasis" },
    { "from": "api", "to": "svc", "label": "REST" },
    { "from": "svc", "to": "db", "label": "SQL" }
  ],
  "summary": [
    { "title": "Runtime", "type": "backend", "items": ["API and worker services", "Managed relational data"] }
  ]
}
```

节点和分组类型支持 `frontend`、`backend`、`database`、`cloud`、`security`、`messagebus` 和 `external`。连接支持 `default`、`emphasis`、`security`、`dashed` 和 `return`。当连线需要绕开边界或标签时，添加 `waypoints`，格式为 `[[x, y], ...]`。

架构图默认根据节点类型生成图例；设置 `legend: false` 可关闭。自定义图例使用 `{ "label": "...", "type": "..." }`。`summary` 最多渲染 3 张图下摘要卡片，不进入 layout manifest，PNG QA 聚焦主图。

## 架构图布局规则

- 分组用于表达云区域、集群、信任边界或安全域，不作为装饰面板。
- 图例放在所有边界之外或下方；空间不足时增大坐标和画布，不压缩文字。
- 事件总线用 `messagebus` 节点，放在服务之间的空隙。
- 鉴权、令牌、策略或信任边界流使用 `security` 连接。
- 网关扇出到多个服务时，优先用 `waypoints` 控制路径，避免密集交叉线。
- 如果总览图需要多个密集簇，或必须缩小文字才放得下，应拆成总览图加细节图。

## 渲染命令

```bash
node skills/fec-image-generation/scripts/tech-diagram-render.mjs \
  --input diagram.json \
  --output diagram.html \
  --type architecture \
  --manifest diagram.layout.json
```

生成的 HTML 是自包含文件，包含：

- Inline SVG。
- CSS 变量暗/亮主题。
- 浏览器内主题切换、SVG 下载、打印/PDF 控制。
- 可选 layout manifest，用于 PNG QA。

## QA 和修复

导出 PNG 后运行：

```bash
node skills/fec-image-generation/scripts/png-qa.mjs \
  --png diagram.png \
  --manifest diagram.layout.json \
  --format markdown
```

修复应回到 JSON 源或渲染尺寸：

- 重叠：拆分密集分组，或增加节点/分组间距。
- 标签截断：缩短标签、添加 `sublabel` 或加宽节点。
- 连线穿过标签：减少边标签，添加 `waypoints`，或移动节点。
- 流向过密：拆成总览图和细节图。
- 边缘裁剪：增加输出空间或简化路径。

## 交付说明

交付 `.html` 源和用户要求的 PNG/SVG。说明使用的路线、源文件、导出文件、QA 结果，以及仍需人工确认的命名或领域假设。
