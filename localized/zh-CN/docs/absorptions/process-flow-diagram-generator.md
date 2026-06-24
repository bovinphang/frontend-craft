# Process Flow Diagram Generator 吸收记录

## 参考系统

本地参考：`D:\code\github\skill\images-generate\process-flow-diagram-generator`

参考项目展示了一条有价值的工作流：将自然语言流程描述转成浏览器可打开的单文件流程图。它最值得吸收的是流程图专属语义：有序步骤、参与者标签、决策分支、回环、异常路径、摘要元信息和浏览器交付体验。

## 吸收候选

- **接受：流程工作流语义。** 重新实现到现有 `fec-image-generation` HTML 技术图渲染器中，支持 workflow 节点形状、参与者标签、步骤编号、决策菱形、终止状态、摘要和可路由异常路径。
- **接受：浏览器可交付路线。** 保留目标项目已有的自包含 HTML 路线，继续支持 SVG 下载、打印/PDF、layout manifest 和 PNG QA。
- **接受：显式布局逃逸口。** 为 workflow edge 添加 `waypoints`，让返工、拒绝和循环路径能避开标签与节点，而不引入新的布局引擎。
- **拒绝：独立 process-flow skill。** 新技能会与 `fec-image-generation` 和 `fec-drawio-studio` 重叠。
- **拒绝：参考 HTML 模板和视觉系统。** 目标实现继续使用 Frontend Craft 现有 CSS 变量技术图样式。
- **延后：浏览器端 PNG/PDF 捕获按钮。** 参考项目使用 CDN 浏览器捕获库；本次切片保持离线路线和现有 QA/导出工作流。

## 目标设计

目标项目仍以 `fec-image-generation` 作为生成类视觉资产入口：

- 流程地图、审批流、自动化流程、异常路径、循环流程和 runbook 需要浏览器可打开单文件时，使用 HTML `workflow` IR。
- 需要 `.drawio` 所有权、diagrams.net 官方形状或长期手工编辑时，使用 `fec-drawio-studio`。
- 图足够小并主要维护在 Markdown 中时，使用 Mermaid 或 SVG。

吸收后的能力作为 `tech-diagram-render.mjs` 的增强实现，保留现有 `lanes`、`nodes` 和 `edges` IR，旧 workflow 图继续可渲染。

## 原创性和许可说明

参考仓库为 MIT 许可证。本次吸收只将参考项目作为流程图行为需求的证据；代码、渲染结构、HTML 外壳、CSS、示例、测试和文档均按 `frontend-craft` 约定重新编写。

没有复制参考项目的非平凡模板、提示词、示例流程、配色系统或导出脚本。目标项目也不引入参考项目的 CDN 捕获依赖，以保持离线和跨运行时行为。

## 验证

- 现有 workflow IR 应继续渲染并生成 PNG QA manifest。
- process workflow IR 应渲染起止/终止节点、决策菱形、参与者标签、步骤徽标、摘要卡片和通过 waypoints 路由的拒绝或回环路径。
- 生成的 HTML 不应包含 html2canvas、jsPDF 或 CDN 脚本。
- `npm run typecheck:skill-scripts` 和 image-generation 安装测试应通过。
