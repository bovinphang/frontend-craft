# 审核范围与技术图交付

以下约定适用于各运行时安装的能力。通过自然语言选择审核模式，不使用安装器 CLI 参数选择模式。

## 审核范围

`fec-code-reviewer`、`fec-typescript-reviewer`、`fec-security-reviewer`、`fec-code-review`、`fec-security-review` 与 `/fec-review` 采用相同范围规则：

| 请求 | 审核范围 | 报告结论 |
| --- | --- | --- |
| 未指定范围，包括单独调用 `/fec-review` | 全项目，即使存在 Git 改动 | 风险评估 |
| 指定文件或目录 | 范围内全部现有代码，包括未改动代码 | 指定范围风险评估 |
| 明确要求最近改动、PR 或提交 | 指定差异及必要上下文 | 合并建议 |

全项目和指定范围审核不要求 Git 差异。明确增量审核但没有改动时，说明情况，不自动扩大范围。审核者保留前端、TypeScript 或安全专项职责，不宣称完成后端安全专项审核。

全项目先建立自有前端代码、相关测试、配置和依赖声明清单，再按模块分批审核。默认排除依赖、生成文件、构建产物、缓存与第三方代码。报告记录模式、目标范围、已审核范围、排除项、未覆盖模块及验证结果。未完成时标记部分完成，合并同根因发现。读取调用方或运行静态检查不计为相应文件的人工审核。默认只输出报告，明确要求修复时才修改代码。

示例：「审核整个项目」「审核 `src/features/` 的全部代码」「审核 `src/components/Button.tsx`」「仅审核最近改动」。修改后的自动审核必须明确传入本次改动范围。

## 技术图

时序图和流程图通过 `fec-image-generation` 优先使用本地 Mermaid；可编辑架构图使用 `fec-drawio-studio`。工具缺失时使用 JSON/HTML 渲染器。需要准确结构的技术关系与标签应保存在可编辑源文件中。

Mermaid 适配器仅使用已安装 CLI，不自动下载依赖。PNG 导出需要本地 Chromium 浏览器，可通过 `FEC_BROWSER_PATH` 指定可执行文件。缺少工具时明确报告，不宣称导出成功。

JSON/HTML 路线先渲染源文件，导出 PNG 与同比例的浏览器实测 manifest，再运行 QA 并检查最终图片：

```bash
node skills/fec-image-generation/scripts/tech-diagram-render.mjs --input skills/fec-image-generation/assets/quality-examples/workflow.json --type workflow --output workflow.html --manifest workflow.layout.json
node skills/fec-image-generation/scripts/export-diagram.mjs --input workflow.html --format png --output workflow.png --theme light --scale 2 --manifest workflow.layout.json --output-manifest workflow.actual.json
node skills/fec-image-generation/scripts/png-qa.mjs --png workflow.png --manifest workflow.actual.json --format json
```

保留完整 Unicode 标签、显式几何布局、连线方向、时序顺序与自调用；独立 SVG 应包含自身样式。几何 QA 和浏览器测量辅助视觉检查，不证明语义正确，也不等同于完成人工视觉审核。缺少测量或仅部分覆盖时必须说明。最多自动修复源文件两轮，之后报告未解决缺陷。

交付可编辑源文件、请求的导出文件和 QA/覆盖结果。参见[可复现样例](../../localized/zh-CN/skills/fec-image-generation/assets/quality-examples/README.md)、[图表工作流](../../localized/zh-CN/skills/fec-image-generation/references/diagram-workflows.md)及 [PNG QA](../../localized/zh-CN/skills/fec-image-generation/references/png-qa-autofix.md)。

[English](../review-and-diagram-workflows.md)
