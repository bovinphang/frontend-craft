# Diagram Workflows

## Source selection

| Diagram type | Preferred source | QA focus |
| ------------ | ---------------- | -------- |
| ER diagram | Mermaid ER, DBML, Graphviz, SVG | Cardinality labels, table names, key fields, crossing relations. |
| UML class | Mermaid class, PlantUML, Graphviz | Inheritance direction, method/property wrapping, package grouping. |
| Sequence | Mermaid sequence, PlantUML | Lifeline order, activation spans, async/return arrows, message text. |
| Technical architecture | HTML `architecture` IR, Mermaid flowchart, C4/Structurizr, SVG/HTML, draw.io | Layer grouping, trust boundaries, data flow direction, legends. |
| ML / deep learning | SVG/HTML/canvas | Tensor shapes, layer order, branch joins, repeated blocks, annotations. |
| Flowchart | Mermaid flowchart, SVG | Decision labels, terminal states, loop-back readability, connector spacing. |

## Minimum source manifest

When the rendering path allows it, save a layout manifest next to the PNG:

```json
{
  "canvas": { "width": 1280, "height": 720 },
  "boxes": [
    { "id": "api", "x": 80, "y": 120, "width": 220, "height": 96, "label": "API Gateway" }
  ],
  "connectors": [
    { "id": "api-db", "from": "api", "to": "db", "points": [[300, 168], [560, 168]] }
  ]
}
```

Coordinates are PNG pixel coordinates after export. Boxes should cover visible label/node bounds, not just the center point.

## Diagram repair playbook

- **Overlapping nodes:** increase rank/column spacing, split clusters, or move low-priority annotations into a legend.
- **Truncated labels:** widen the node, add manual line breaks, reduce label length, or increase export scale.
- **Connector through labels:** add waypoints, route orthogonally around boxes, or move labels above the segment.
- **Connector stacking:** separate parallel edges with different waypoints or bundle them with a shared labeled bus.
- **Edge clipping:** increase outer padding or export viewBox/canvas size.
- **Unreadable dense graph:** split into overview plus detail diagrams instead of shrinking everything.

## Architecture diagrams

Use HTML `architecture` IR when the user wants a browser-ready single file with explicit system topology, groups, trust boundaries, data flows, and PNG QA. Use draw.io when the diagram must preserve official vendor shapes, diagrams.net editing, or long-term manual ownership. Use Mermaid/C4 when the diagram should live primarily in Markdown or text documentation.

## Export guidance

Prefer exporting at 2x scale for raster PNGs, then downsample only if text remains crisp. Keep the editable source committed or attached wherever future diagram changes are expected.
