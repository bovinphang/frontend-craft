---
name: cc-technical-diagrams
description: 用于创建或导出结构化技术图表，包括架构图、流程图、序列图、数据流、生命周期、Agent 与记忆流、局部交互预览和 PNG 质检。需要长期手工编辑或厂商图形时使用可编辑 draw.io 源。不要用于 UI 样机、产品视觉、海报或位图编辑。
---

# 技术图表

从可编辑的结构化源创建完整、清晰的技术图表，适用于前端、后端、基础设施和 Agent 系统。

## 选择源格式

读取[图表工作流](references/diagram-workflows.md)。标准序列图和流程图优先使用本地已有 Mermaid；自包含浏览器交付、语义架构图及 Agent/记忆流使用 HTML 技术图，读取 [HTML 技术图说明](references/html-technical-diagrams.md)。需要官方厂商形状或长期手工编辑时选择可编辑 draw.io。

增量讲解可使用本地交互预览；交付时保留 JSON/SVG/PNG 导出。服务使用 [interactive-diagram-server.mjs](scripts/interactive-diagram-server.mjs)，页面使用 [interactive-diagram.html](assets/interactive-diagram.html)。

## 渲染和导出

保留所有节点、关系、完整标签和显式几何。渲染器支持 workflow、sequence、dataflow、lifecycle、architecture。不得静默简化高级序列语义；激活与 alt/loop/par 片段优先使用 Mermaid。

```sh
node skills/cc-technical-diagrams/scripts/tech-diagram-render.mjs --input diagram.json --type architecture --output diagram.html --manifest diagram.layout.json
node skills/cc-technical-diagrams/scripts/export-diagram.mjs --input diagram.html --format png --output diagram.png --theme light --scale 2 --manifest diagram.layout.json --output-manifest diagram.actual.json
node skills/cc-technical-diagrams/scripts/png-qa.mjs --png diagram.png --manifest diagram.actual.json --format json
```

标准 Mermaid 使用 [mermaid-render.mjs](scripts/mermaid-render.mjs)。复用 [diagram-layout.mjs](scripts/diagram-layout.mjs) 和 [diagram-browser.mjs](scripts/diagram-browser.mjs)，不另造渲染器，不增加必需的浏览器库、远程脚本或下载图标包。

## 验证与交付

检查实际导出图像中的裁切、文字截断、标签穿线、重叠和内容遗漏。PNG QA 使用实际缩放后的导出清单，不使用源文件的估算坐标。导出成功不代表视觉验收通过。读取 [PNG 修复指导](references/png-qa-autofix.md)，修复源文件或布局，不直接修改输出像素；默认最多两轮修复，并报告未解决问题。

交付 JSON/Mermaid 源、适用的 HTML、导出文件和 QA 证据。记录工具版本、主题、比例、修复轮次和部分验收状态。可选 Mermaid/Graphviz/浏览器工具缺失时明确报错或采用现有降级，不自动安装，也不宣称缺失的导出成功。保留完整标签，不用更高分辨率掩盖溢出。

示例：[质量样例](assets/quality-examples/README.md)、[序列 JSON](assets/quality-examples/sequence.json)、[流程 JSON](assets/quality-examples/workflow.json)、[架构 JSON](assets/quality-examples/architecture.json)、[无效显式几何](assets/quality-examples/invalid-explicit.json)。
