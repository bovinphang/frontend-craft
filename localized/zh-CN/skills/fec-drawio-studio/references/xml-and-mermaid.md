# XML 与 Mermaid

使用本参考选择最轻量、且仍满足用户维护性和保真需求的可编辑图表源。

## 路线选择

- 对会保存在 Markdown 中的常见流程图、序列图、类图、状态图、ERD、时间线、思维导图和其他文本优先图表，使用 Mermaid。
- 当图表需要精确形状、供应商符号、嵌套容器、图层、标签、元数据、自定义颜色或持久 `.drawio` 源文件时，使用 draw.io XML。
- CSV 只作为组织结构图或简单关系图等表格结构的短导入路径；尽可能保存生成后的可编辑源文件。
- URL 创建用于预览和交接，不要作为重要图表的唯一产物。

## XML 结构

- 每个图表都包含根单元 `id="0"` 和 `id="1"`。
- 为每个可见顶点和边提供稳定唯一 id。
- 将子节点放入视觉容器内：把 `parent` 设为容器 id，并使用相对该容器的坐标。
- 跨容器边界的边放在 `parent="1"` 下，避免被泳道或分组裁剪。
- 每条边都必须包含 `<mxGeometry relative="1" as="geometry"/>`；不要使用自闭合边单元。

## 容器与流程布局

- actor、tier 或 bounded context 分组使用带标题的泳道。
- region、VPC、availability zone 和 workload 等真实层级使用嵌套泳道。
- 当 actor 行和阶段列都重要时，跨职能流程使用表格布局。
- 仅在不需要视觉边界且分组不应捕获连接线时，使用普通分组。

## 图层、标签与元数据

- 逻辑视图、物理视图、注释或迁移阶段等主要可见性集合使用图层。
- critical、deprecated、external、v2 或 owner 名称等横切过滤条件使用标签。
- 当图形表示带有 owner、status、IP、service tier 或 version 等字段的记录时，使用对象元数据和占位符。
- 可见标签保持简洁；如果次要事实会让图表难以扫读，将它们放入元数据或备注。

## 标签与暗色模式

- 图表标签语言应与用户语言一致。
- 标签包含 HTML 标记或转义 `<br>` 格式时，添加 `html=1`。
- 转义 XML 属性值：`&`、`<`、`>` 和 `"` 必须写成实体。
- 优先使用自适应颜色和简单色板；仅当自动反色导致标签或形状不清晰时，才指定暗色模式覆盖。

## Mermaid 导入说明

- 有意识地选择 Mermaid header：`flowchart`、`sequenceDiagram`、`classDiagram`、`stateDiagram-v2`、`erDiagram`、`timeline`、`mindmap`、`gantt`、`C4Context` 等 header 会选择不同解析器。
- 包含标点、空格、括号或非 ASCII 文本的标签需要加引号。
- 节点 id 保持简单，将展示文本放在 label 中。
- 对大型、高度样式化或供应商专属图表，最终交付前转为 XML。

## XML 良构性

- 不要包含 XML 注释。
- 不要在属性值中留下未经转义的 `&` 或尖括号。
- 不要使用重复 id。
- 不要留下指向缺失 source 或 target 单元的边。
- 最终交接前运行 `diagram-lint.mjs`。
