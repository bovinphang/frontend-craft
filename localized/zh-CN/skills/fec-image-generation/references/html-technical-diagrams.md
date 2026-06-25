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

- `architecture`：系统拓扑、系统蓝图、部署拓扑、云区域、信任边界、客户端、网关、服务、数据存储、事件总线、认证流、Agent runtime 图、memory/recall 总览、before/after 架构对比和基础设施总览。
- `workflow`：职责泳道、流程地图、审批门禁、自动化运行、异常路径、循环流程、runbook、CI/CD、事故响应、工具调用和请求生命周期。
- `sequence`：参与者随时间交互、API 调用链、缓存回退、鉴权检查、异步链路和返回消息。
- `dataflow`：来源、采集、处理、存储、消费者、PII 边界、治理、分析和血缘。
- `lifecycle`：对象状态、终止状态、重试、等待、取消、超时、部署或订单状态流转。

浏览器可交付的架构总览优先用 `architecture` 模式。需要 `.drawio` 源、官方厂商图标、diagrams.net 手工编辑或复杂自动布局时，改用 `fec-drawio-studio`。

## 主题化语义图

同一份 JSON 源需要更明确的交付语气时，可以使用 `visual.style`：`default`、`terminal`、`blueprint`、`minimal`、`glass`、`warm`、`openai` 或 `editorial-dark`。

Agent、memory 和 AI 工作流图优先在 architecture 节点上使用语义 `type`：

- 参与者和入口：`user`、`browser`、`gateway`。
- 智能与编排：`agent`、`model`、`tool`。
- 记忆与知识：`memory`、`vectorstore`、`graphdb`、`document`。
- 运行时流动：`queue`、`messagebus`、`backend`、`external`。

连线不仅表达方向，还需要表达含义时使用 `flow`：

- `control`：编排、策略、触发或命令。
- `data`：请求载荷、文档、embedding、事实或响应。
- `read`：从 memory 或存储中读取。
- `write`：持久化、索引、笔记或 memory 更新。
- `async`：事件或队列工作。
- `feedback`：循环、重试、细化或推理回路。

出现两种以上 flow 时，渲染器会自动输出 flow legend。连线标签保持简短，密集分组、标题标签和节点内部区域用 `waypoints` 绕开。

## 系统蓝图工作流

生成展示级系统蓝图、部署拓扑、集成关系图、Agent runtime 视图、memory/recall 图或 before/after 架构对比时，使用 architecture 路线。先抽取紧凑的系统模型，再绘图：

- 入口层：浏览器、移动端、CLI、webhook、调度器或 agent/session 入口。
- 应用层：网关、前端应用、后端服务、worker、编排层、运行时宿主和工具适配器。
- 数据层：数据库、对象存储、缓存、向量库、队列、事件总线、日志和分析存储。
- 外部依赖：身份提供方、AI 模型、支付/邮件服务、SaaS API、云服务、设计工具或运行时连接器。
- 身份与信任边界：认证、权限、PII 区域、租户边界、私有网络、密钥存储和策略检查。
- 关键流：请求/控制流、数据流、事件流、部署流、recall/memory flow 或 before/after 迁移流。

第一版蓝图保持可读：

- 展示 4-10 个主节点，把低价值文件、类或端点折叠成分组节点。
- 使用 1-3 个分组边界表达层级、信任区、运行环境或所有权域。
- 标题和副标题要足够清楚，文件脱离原会话也能分享。
- 用图例或最多 3 张摘要卡片说明 runtime、data、trust、risks、inputs 或 outcomes。
- 优先使用语义配色，不做装饰性堆砌；当连线或标签变密时拆成多张图。

面向 README 或干系人交付时，保留 JSON IR 和 HTML 作为可编辑事实源，再导出 SVG/PNG/JPG 产物：

```bash
node skills/fec-image-generation/scripts/export-diagram.mjs --input docs/architecture/system-blueprint.html --format svg
node skills/fec-image-generation/scripts/export-diagram.mjs --input docs/architecture/system-blueprint.html --format png --scale 2
```

位图导出会优先使用本机已有的 Chromium 系浏览器。环境无法栅格化 SVG 时，交付生成的 HTML/SVG，并说明 PNG/JPG 导出需要本地浏览器。

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
- `workflow`：`lanes`、`nodes`、`edges`；可选 `summary`。
- `sequence`：`participants`、`messages`。
- `dataflow`：`stages`、`nodes`、`flows`。
- `lifecycle`：`lanes`、`states`、`transitions`。

ID 必须以字母开头，只使用字母、数字、`_` 和 `-`。节点标签保持短小；较长说明放到图外文字或摘要卡片。

## 流程工作流 IR

`workflow` 模式适合有明确顺序的流程：它更关注职责、决策、分支和回环，而不是精确的基础设施拓扑。用 `lanes` 表示参与者或系统，用 `nodes` 表示步骤，用 `edges` 表示流转结果。节点仍使用显式 `col` 控制阅读顺序，不依赖隐藏的自动布局引擎。

```json
{
  "schema_version": 1,
  "diagram_type": "workflow",
  "meta": {
    "title": "Procurement Approval",
    "subtitle": "Request to payment"
  },
  "lanes": [
    { "id": "requester", "label": "Requester" },
    { "id": "system", "label": "System" },
    { "id": "manager", "label": "Manager" }
  ],
  "nodes": [
    { "id": "start", "lane": "requester", "col": 0, "type": "start", "label": "Submit Request", "actor": "Employee" },
    { "id": "classify", "lane": "system", "col": 1, "type": "active", "label": "Classify Spend", "actor": "Policy Engine", "sublabel": "auto rules" },
    { "id": "review", "lane": "manager", "col": 2, "type": "decision", "label": "Approved?", "step": "A" },
    { "id": "pay", "lane": "system", "col": 3, "type": "success", "label": "Issue Payment" },
    { "id": "reject", "lane": "requester", "col": 3, "type": "failure", "label": "Return Request" }
  ],
  "edges": [
    { "from": "start", "to": "classify", "label": "intake", "variant": "emphasis" },
    { "from": "classify", "to": "review", "label": "policy result" },
    { "from": "review", "to": "pay", "label": "yes", "variant": "emphasis" },
    { "from": "review", "to": "reject", "label": "no", "variant": "return", "waypoints": [[650, 396], [520, 396]] }
  ],
  "summary": [
    { "title": "Inputs", "type": "active", "items": ["Purchase request", "Policy threshold"] },
    { "title": "Outcomes", "type": "success", "items": ["Payment issued", "Requester notified"] }
  ]
}
```

Workflow 节点字段：

- `type`：流程语义使用 `start`、`active`、`waiting`、`decision`、`success`、`failure` 或 `external`。
- `actor`：可选，显示在节点上方的简短负责人或系统标签。
- `step`：可选，显示的步骤标记。未提供时，workflow 节点会自动获得顺序编号。
- `sublabel`、`width`、`height` 和 `yOffset`：可选，用于提升密集泳道中的可读性。

Workflow 连线字段：

- `variant`：主路径使用 `emphasis`，回环和返工使用 `return` 或 `dashed`，只有信任或策略检查才使用 `security`。
- `waypoints`：可选 `[x, y]` 点，用于异常路径、跨行连接或需要避开标签和节点的回环。

`summary` 用于简短记录前置条件、输入/输出或工具等流程元信息。长说明放在 SVG 外，避免节点标签不可读。

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
  "visual": {
    "style": "blueprint"
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

节点和分组类型支持 `frontend`、`backend`、`database`、`cloud`、`security`、`messagebus`、`external`、`agent`、`model`、`memory`、`vectorstore`、`graphdb`、`tool`、`document`、`queue`、`browser`、`user` 和 `gateway`。连接支持 `default`、`emphasis`、`security`、`dashed` 和 `return`；architecture 连接还可以添加 `flow`。当连线需要绕开边界或标签时，添加 `waypoints`，格式为 `[[x, y], ...]`。

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

交付 `.html` 源和用户要求的 SVG/PNG/JPG。说明使用的路线、源文件、导出文件、QA 结果，以及仍需人工确认的命名或领域假设。
