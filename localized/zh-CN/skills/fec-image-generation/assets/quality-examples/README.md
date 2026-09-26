# 技术图质量样例

JSON 样例覆盖时序自调用、流程决策回环、架构分组和双向连接。Mermaid 源用于标准时序与流程图；修改布局时保留全部文字和连接关系。

```sh
node skills/fec-image-generation/scripts/tech-diagram-render.mjs --input skills/fec-image-generation/assets/quality-examples/workflow.json --type workflow --output workflow.html --manifest workflow.layout.json
node skills/fec-image-generation/scripts/export-diagram.mjs --input workflow.html --format png --output workflow.png --theme light --scale 2 --manifest workflow.layout.json --output-manifest workflow.actual.json
node skills/fec-image-generation/scripts/png-qa.mjs --png workflow.png --manifest workflow.actual.json --format json
node skills/fec-image-generation/scripts/mermaid-render.mjs --input skills/fec-image-generation/assets/quality-examples/sequence.mmd --output sequence.svg --report sequence.render.json
```

PNG 需要本地 Chromium，可用 FEC_BROWSER_PATH 指定路径。Mermaid 需要已安装的 mmdc，不自动安装或使用 CDN；缺失时明确记录并使用 JSON/HTML。需要手工编辑的架构图复用 fec-drawio-studio，大型拓扑可选 Graphviz。

按交付阅读尺寸检查 1x 和 2x 图片，检查形状内部文字、标签和箭头、分支返回、回环、分组及明暗主题对比。几何 QA 不能替代看图。显式尺寸不足或 waypoints 受阻时报告问题，在源级修复且保留意图。默认最多修复两轮，用户要求时最多五轮，未解决则报告部分验收。
