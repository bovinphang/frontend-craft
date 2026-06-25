---
name: fec-image-generation
description: 用于生成或编辑图表、图形资产、海报、UI 样机、产品图、信息图、学术图、漫画、头像、分镜、品牌板或图像编辑工作流，尤其是导出 PNG 需要视觉质检和有限自动修复时。文字密集图表优先使用确定性的 Mermaid/SVG/HTML/canvas 源；浏览器可打开的技术图优先使用 HTML technical diagrams，覆盖系统蓝图、架构图、部署拓扑、Agent runtime、memory flow、before-after architecture、流程、序列、数据流、生命周期、runbook、PII/数据血缘和状态机；不要用于不涉及生成图像的普通 UI 打磨。中文触发词包括 图片生成、图像编辑、图表生成、架构图、系统蓝图、部署拓扑、Agent runtime、memory flow、before-after architecture、工作流图、数据流、生命周期图、状态机、ER 图、UML、序列图、海报、UI 样机、产品图、信息图、学术图、漫画、头像、分镜、品牌板、PNG 自检、自动修复。
---

# 图片生成与图表工作流

## 用途

生成或编辑图表、视觉资产和图片工作流，并对导出的 PNG 做可复查的自检与修复迭代。

## 流程

1. 判断产物类型
   - 文本、结构和连线准确性优先时，用 Mermaid、SVG、HTML/CSS、canvas 或图表库生成可编辑源，再导出 PNG。
   - 需要单文件浏览器打开、暗/亮主题和结构化 QA 的系统蓝图、架构图、部署拓扑、Agent runtime、memory flow、before-after architecture、流程、序列、数据流、生命周期、runbook、状态机或 PII/数据血缘图时，使用 HTML technical diagrams。
   - 流程地图、审批流、自动化运行、异常路径和循环运营流需要清晰的起止节点、决策、参与者、步骤编号和摘要，但不需要 diagrams.net 时，使用 HTML `workflow` 路线。
   - 系统、Agent、memory、数据或 tool-call 图需要语义节点形状、有含义的连线和可浏览器打开、可导出、可 QA 的源文件时，使用主题化 HTML technical diagrams。
   - 用户需要在本地浏览器里看到节点和连线实时出现，或需要在会话中拖拽、改标签、删除、缩放并快速导出草图时，使用交互式实时图表路线。
   - 审美、质感、照片、插画、漫画、产品图或品牌氛围优先时，用图片生成或编辑工具，再把最终资产保存到项目或报告目录。

2. 明确输入与约束
   - 收集受众、用途、尺寸、语言、必须出现的文本、品牌限制、可编辑源格式、导出格式和禁用元素。
   - 对海报、UI 样机、品牌板和产品图，先写出一行视觉读取：目标用户、场景、可信感来源、主视觉锚点。

3. 选择生成路线
   - ER 图、UML 类图、序列图、技术架构图、ML/深度学习、流程图等，优先按 [diagram-workflows.md](references/diagram-workflows.md) 建立结构化源。
   - 浏览器可打开的系统蓝图、架构、流程、序列、数据流和生命周期图，先读 [html-technical-diagrams.md](references/html-technical-diagrams.md)，再用 [tech-diagram-render.mjs](scripts/tech-diagram-render.mjs) 渲染 JSON IR。流程工作流用 `lanes` 表达参与方，用 `nodes` 表达有序动作，用 `edges` 表达异常或回环路径，并可添加 `waypoints`：
     ```bash
     node skills/fec-image-generation/scripts/tech-diagram-render.mjs --input diagram.json --output diagram.html --type architecture --manifest diagram.layout.json
     ```
   - Agent 和 memory 图优先使用 `architecture` IR，并使用 `agent`、`model`、`memory`、`vectorstore`、`graphdb`、`tool`、`document`、`queue`、`browser`、`user`、`gateway` 等语义节点类型。连线含义重要时添加 `flow`：`control`、`data`、`read`、`write`、`async`、`feedback`；出现两种以上 flow 时自动生成 flow legend。
   - 需要源文件级主题方向时可添加 `visual.style`：`default`、`terminal`、`blueprint`、`minimal`、`glass`、`warm`、`openai` 或 `editorial-dark`。这些是交付主题，不等同于品牌规范承诺。
   - 需要从生成好的 HTML/SVG 源导出适合 README 的 SVG、PNG、JPG 或 JPEG 交付物时，使用 [export-diagram.mjs](scripts/export-diagram.mjs)：
     ```bash
     node skills/fec-image-generation/scripts/export-diagram.mjs --input diagram.html --format svg
     node skills/fec-image-generation/scripts/export-diagram.mjs --input diagram.html --format png --output diagram.png --scale 2
     ```
   - 实时交互草图使用 [interactive-diagram-server.mjs](scripts/interactive-diagram-server.mjs)，打开服务提供的 [interactive-diagram.html](assets/interactive-diagram.html) 页面并带上唯一 `?s=session-id`，再向 `/cmd?s=session-id` 发送小 JSON 命令：
     ```bash
     node skills/fec-image-generation/scripts/interactive-diagram-server.mjs --port 6100
     curl -s "http://127.0.0.1:6100/cmd?s=checkout-flow" -d '{"cmd":"init","title":"Checkout Flow","direction":"TB"}'
     curl -s "http://127.0.0.1:6100/cmd?s=checkout-flow" -d '{"cmd":"node","id":"cart","label":"Review cart","type":"process"}'
     ```
   - 海报、UI 样机、产品图、信息图、学术图、漫画、头像、分镜、品牌板和图像编辑，按 [artifact-routing.md](references/artifact-routing.md) 选择生成、编辑或混合路线。

4. 导出并自检 PNG
   - 每次交付前都读取导出的 PNG，检查主体是否真实渲染、文字是否截断、连线是否堆叠、节点是否重叠。
   - 有布局 manifest 时运行：
     ```bash
     node skills/fec-image-generation/scripts/png-qa.mjs --png output.png --manifest layout.json --format markdown
     ```
   - 没有 manifest 时仍运行 PNG 基础检查：
     ```bash
     node skills/fec-image-generation/scripts/png-qa.mjs --png output.png --format json
     ```

5. 自动修复循环
   - 默认最多 2 轮；用户明确要求时可提高到 5 轮软上限。
   - 修复对象是源文件、prompt、布局参数或导出尺寸，不直接破坏性修改 PNG 像素。
   - 按 [png-qa-autofix.md](references/png-qa-autofix.md) 把问题转成具体修复：增大画布、换行、移动节点、分层连线、调整 padding 或重导出。

6. 交付记录
   - 说明最终源文件、PNG 路径、生成路线、QA 轮次、发现并修复的问题、仍需人工确认的文字或品牌风险。

## 约束

- 文本密集图不要只靠位图模型生成；必须保留可编辑结构化源。
- HTML 技术图必须保留 JSON 源和生成的 HTML；PNG/SVG/JPG 是交付产物，不是事实源。需要官方厂商图标或长期手工编辑时，改用 `.drawio` 路线。
- 主题化语义图由 Frontend Craft 渲染器实现。不要把 Python、shell、cairosvg、rsvg-convert、Puppeteer、CDN 截图库、复制来的 SVG 模板或外部图标包作为这一路线的必需依赖。
- 交互式实时图表是会话期预览；当图表成为交付物时要保存 JSON/SVG/PNG 导出，需要长期维护事实源时改用 HTML technical diagrams 或 `.drawio`。
- 不把截图、假数据或占位图当成最终产品图，除非用户明确要求概念稿。
- 不直接覆盖原图；编辑工作流默认输出新文件。
- 不为追求美观牺牲可读标签、连线归属、图例、坐标轴和可访问替代说明。
- PNG helper 只做检测和建议；修复必须回到源、prompt 或布局参数。
- 自检结果不能替代人工确认专有名词、公式、论文图注、品牌规范和合规信息。

## 预期输出

产出可编辑源、最终 PNG 或编辑后图片，并附带生成路线与 QA 结果。图表应结构清晰、标签不截断、连线不混乱；视觉资产应匹配用途、尺寸、品牌语气和交付路径。
