---
name: fec-drawio-studio
description: Use when creating editable technical diagrams with draw.io / diagrams.net sources, including architecture diagrams, ERD, UML, sequence diagrams, flowcharts, ML model diagrams, official shape lookup, brand symbols, Graphviz auto-layout, codebase structure maps, .drawio validation, or draw.io CLI export fallback. Do not use for ordinary raster image generation, freehand sketches, interactive canvas/Three.js scenes, or decorative SVG animation. Chinese triggers include draw.io, diagrams.net, 可编辑架构图, .drawio, ER 图, UML, 序列图, 自动布局, 形状检索, 代码结构图.
---

# 可编辑技术图表工作流

## Purpose

生成、校验和导出可继续编辑的 draw.io / diagrams.net 技术图表。

## Procedure

1. 判断图表路线
   - 需要长期维护在 Markdown 中的简单图，优先 Mermaid。
   - 需要官方图标、泳道、复杂布局、可编辑 PNG/SVG/PDF 或 `.drawio` 源时，使用本工作流。
   - 需要照片、海报、视觉概念或位图编辑时，走图片生成路线。

2. 建立图表规格
   - 明确图表类型、受众、输出格式、节点清单、关系、层级分组和保存位置。
   - 用户指定 ERD、UML、Sequence、Architecture、ML/DL 或 Flowchart 时，读取 [diagram-patterns.md](references/diagram-patterns.md)。
   - 需要特定厂商/云/网络/流程图形状时，运行 [shape-query.mjs](scripts/shape-query.mjs)；需要 AI、数据库或基础设施品牌符号时，运行 [brand-symbols.mjs](scripts/brand-symbols.mjs)。

3. 生成 `.drawio` 源
   - 小图可手工生成 draw.io XML，保持节点坐标、尺寸和连线清晰。
   - 超过约 15 个节点、依赖图或代码结构图时，先生成 graph JSON，再用 [layout-graph.mjs](scripts/layout-graph.mjs) 自动布局。
   - 代码结构图可先用 [scan-js-modules.mjs](scripts/scan-js-modules.mjs)、[scan-ts-modules.mjs](scripts/scan-ts-modules.mjs)、[scan-python-modules.mjs](scripts/scan-python-modules.mjs)、[scan-go-packages.mjs](scripts/scan-go-packages.mjs)、[scan-rust-modules.mjs](scripts/scan-rust-modules.mjs) 或 [scan-python-classes.mjs](scripts/scan-python-classes.mjs) 生成 graph JSON。

4. 校验和预览
   - 每次生成 `.drawio` 后运行：
     ```bash
     node skills/fec-drawio-studio/scripts/diagram-lint.mjs diagram.drawio --format markdown
     ```
   - 若本机有 draw.io desktop CLI，导出预览 PNG 时不要嵌入 XML，并控制宽度：
     ```bash
     drawio -x -f png --width 2000 -o diagram.png diagram.drawio
     ```
   - 若 CLI 不可用，用 [diagram-url.mjs](scripts/diagram-url.mjs) 生成 diagrams.net viewer/editor URL。

5. 交付最终产物
   - 保存 `.drawio` 源文件和用户需要的 PNG/SVG/PDF/JPG。
   - 最终 PNG 若使用 draw.io `-e` 嵌入 XML，导出后运行：
     ```bash
     node skills/fec-drawio-studio/scripts/png-embed-fix.mjs diagram.drawio.png
     ```
   - 报告源文件、导出文件、校验结果和无法自动验证的外部依赖。

## Tool Resources

工具脚本共享 [studio-core.mjs](scripts/studio-core.mjs)。离线查询使用 [shape-index.json.gz](data/shape-index.json.gz) 与 [brand-icons.json](data/brand-icons.json)，样式预设资源包括 [schema.json](styles/schema.json)、[default.json](styles/built-in/default.json)、[corporate.json](styles/built-in/corporate.json) 和 [handdrawn.json](styles/built-in/handdrawn.json)。

## Constraints

- 不把 draw.io 用作普通图片模型；文本密集或结构化图必须保留可编辑源。
- 不猜测复杂 `shape=mxgraph.*` 样式；优先用形状查询工具获取官方样式。
- 不在预览 PNG 中嵌入 XML；嵌入只用于最终交付。
- Graphviz、draw.io desktop 和联网品牌图标都是可选外部能力；缺失时必须降级而不是反复重试。
- 品牌图标和第三方形状索引遵循 [THIRD_PARTY_NOTICES.md](data/THIRD_PARTY_NOTICES.md) 中的来源与许可说明。

## Expected Output

交付可编辑 `.drawio` 源和所需导出格式，并给出结构校验结果。图表应节点完整、连线可追踪、标签不截断、布局不重叠，外部工具缺失时提供可打开的 diagrams.net fallback。
