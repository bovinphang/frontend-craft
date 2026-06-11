# PNG 质检与自动修复

## 循环

1. 从可编辑源文件或图像工作流导出 PNG。
2. 目视检查 PNG。
3. 有 manifest 时，带 manifest 运行 `png-qa.mjs`。
4. 将每个问题转化为源文件、提示词或布局变更。
5. 默认重复 2 轮；用户要求更多修复尝试时最多 5 轮。

## 问题映射

| 问题 | 修复方式 |
| ----- | ------ |
| `blank-image` | 检查导出目标、渲染器错误、隐藏图层、透明填充或图像生成失败。 |
| `edge-clipping` | 增加画布留白、扩大 SVG viewBox、降低主体缩放，或导出更大的画幅。 |
| `box-overlap` | 增加间距、重排为网格/图层、拆分簇，或缩短标签。 |
| `box-out-of-bounds` | 将节点移入画布，或增大画布尺寸。 |
| `label-overflow` | 文本换行、加宽框体、减少文案，或同时增大字体/容器尺寸。 |
| `connector-through-label` | 在框体周围添加 waypoints、移动标签，或使用正交布线。 |
| `connector-stacking` | 偏移平行连接线，或用带标签的分组路径替代重复线条。 |
| `manifest-canvas-mismatch` | 根据最终导出尺寸重新生成 manifest。 |

## Manifest 质量

只有当 manifest 坐标与导出的 PNG 匹配时，辅助脚本才能判断重叠和连接线问题。若 manifest 过期，先修复 manifest，再重新运行 QA。

## 报告要求

报告 QA 轮数和最终问题列表。若由于源渲染器无法暴露布局坐标而仍有遗留问题，说明哪些检查只能基于图像，哪些需要人工视觉复核。
