# 故障排查

## 缺少 draw.io CLI

生成 `.drawio` 文件，并使用 `diagram-url.mjs --edit` 在浏览器中打开 diagrams.net。

## 缺少 Graphviz

`layout-graph.mjs` 会输出清晰的 Graphviz 提示并退出。保留 graph JSON，然后安装 Graphviz，或手动摆放较小的图表。

## 供应商图形为空

运行 `shape-query.mjs` 并使用返回的 style 字符串。猜测的 `shape=mxgraph.*` 经常会渲染成通用方框。

## 品牌图标未渲染

引用 CDN 的符号在渲染时需要网络访问。需要可移植性时，使用 `brand-symbols.mjs --embed` 生成自包含 data URI。

## 嵌入 PNG 看起来损坏

最终执行 `drawio -e` 导出 PNG 后，运行 `png-embed-fix.mjs`。该命令是幂等的。

## Windows 上浏览器 URL 打开为空白

使用 `diagram-url.mjs --json`，并将输出的 `windowsShortcut` 内容作为 `.url` 文件打开；或运行 `diagram-url.mjs --shortcut`。这样可以保留携带压缩图表的 `#R` 或 `#create=` fragment。

## Mermaid 或 CSV URL 失败

Mermaid 和 CSV 必须使用 `diagram-url.mjs --create --type mermaid|csv`。旧的 viewer/editor `#R` 模式仅适用于 XML。
