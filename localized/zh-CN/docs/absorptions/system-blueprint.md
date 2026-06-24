# System Blueprint 吸收记录

## 参考系统

本地参考：`D:\code\github\skill\images-generate\system-blueprint`

该参考项目展示了一种有价值的 Agent 工作流：把代码仓库或系统描述转成可分享的技术蓝图。它最有价值的部分是展示级架构图、自包含 HTML/SVG 交付、README 友好的 SVG 输出、可选位图导出，以及先建模再绘图的流程。

## 吸收候选

- **接受：系统蓝图意图。** 将系统蓝图、部署拓扑、Agent runtime、memory flow 和 before/after architecture 语义整合进 `fec-image-generation`。
- **接受：先建模再绘图。** 重写为符合本项目的检查清单：入口层、应用服务、数据存储、外部依赖、身份/信任边界和关键流。
- **接受：源优先交付契约。** 保持 JSON IR 和生成 HTML/SVG 作为事实源，SVG/PNG/JPG 作为导出产物。
- **接受：轻依赖位图交付。** 新增 Node 脚本，从 HTML 内联 SVG 或 SVG 源提取图形；需要位图时使用本机已有 Chromium 浏览器。
- **拒绝：独立 `system-blueprint` skill。** 新增技能会与 `fec-image-generation` 和 `fec-drawio-studio` 重叠。
- **拒绝：参考模板、Python 脚本和示例 SVG。** 目标实现继续使用 Frontend Craft 既有渲染器、视觉体系、QA 流程和 Node 脚本打包模型。

## 目标设计

目标项目继续把 `fec-image-generation` 作为图表和视觉资产的统一入口：

- 浏览器可打开的系统蓝图、部署视图、信任边界图和 before/after 拓扑总结，使用 HTML `architecture` IR。
- 当主要叙事是流程、时序调用、数据血缘或状态流转时，使用 HTML `workflow`、`sequence`、`dataflow` 或 `lifecycle` IR。
- 需要 `.drawio` 源、diagrams.net 官方形状或长期手工编辑时，使用 `fec-drawio-studio`。
- 需要 README 友好的 SVG，或本机可用浏览器环境下的 PNG/JPG 产物时，使用 `export-diagram.mjs`。

## 原创性与许可说明

参考仓库以开放 skill 包形式呈现，但本次吸收不依赖复制其实现。文案、脚本结构、测试、文档和目标项目集成均为 `frontend-craft` 重新设计。

未复制参考项目的非平凡代码、HTML 模板、示例图、提示词、图片资产或 Python 导出实现。吸收的是通用工作流能力，并围绕 Frontend Craft 既有 HTML 技术图路线和打包约束重新实现。

## 验证

- `fec-image-generation` 应能覆盖系统蓝图、部署拓扑、Agent runtime、memory flow 和 before/after architecture 请求。
- HTML 技术图文档应说明先建模再绘图的系统蓝图工作流，并保留既有 architecture JSON IR。
- `export-diagram.mjs` 应能从 `.html` 和 `.svg` 输入提取 SVG，正确处理默认输出路径，并在无法位图导出时给出清晰错误。
- `npm run typecheck:skill-scripts` 和 `node --import tsx --test tests/install/image-generation-skill.test.ts` 应通过。
