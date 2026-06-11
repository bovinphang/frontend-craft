# 数据驻留

当图表包含私有架构、未发布产品细节、客户数据或受监管信息时，使用此清单。

## 本地优先

- 写入 workspace 的 `.drawio` 文件是最安全的默认产物，因为它可以本地检查、版本化和打开。
- 安装 CLI 后，draw.io Desktop 导出会在本机运行。若缺少 CLI，保留源文件并提供 URL 兜底，而不是将图表发送到云端转换器。
- `diagram-lint.mjs`、`diagram-url.mjs`、`layout-graph.mjs`、`png-embed-fix.mjs` 和代码扫描器都在本地运行。Graphviz 是可选项；安装后也在本地运行。

## URL 模式

- viewer/editor `#R` URL 和 `#create=` URL 会把压缩后的图表内容放在 URL fragment 中。
- URL fragment 不会作为请求路径发送给普通 HTTP 服务器，但浏览器仍会从所选 diagrams.net host 加载应用代码。
- 超大型图表可能超过浏览器实际可用的 URL 长度限制。URL 变得难以处理时，回退到本地 `.drawio` 文件。
- 在 Windows 上，通过 `.url` 快捷方式文件打开长图表 URL，或使用 `diagram-url.mjs` 输出的 JSON `windowsShortcut`；直接通过 `cmd start` 传递 URL 可能丢失 fragment。

## 外部请求

- 品牌 CDN 符号在渲染时需要网络访问，除非已嵌入为 data URI。
- diagrams.net web editor/viewer 会从配置的 host 加载编辑器代码和资源。
- 当环境要求受控端点时，可通过 `--base-url` 传入自托管 diagrams.net base URL。
- 现有 draw.io MCP App 或 Tool server 可作为预览界面使用，但它们是可选项，并受用户配置的 host 和模型提供方约束。

## 交接规则

对于敏感图表，优先交付本地 `.drawio` 源文件和 lint 结果。仅当用户明确需要且数据边界可接受时，再补充 PNG/SVG/PDF 或 URL 输出。
