# Layout And Export

## Auto Layout

Use `layout-graph.mjs` for dependency graphs, code structure maps and diagrams with more than about 15 nodes. For smaller diagrams, manual XML is acceptable when the coordinates, containers and edge anchors can be reviewed directly.

```bash
node skills/fec-drawio-studio/scripts/layout-graph.mjs graph.json --output diagram.drawio --manifest layout.json
```

Input graph:

```json
{
  "direction": "TB",
  "nodes": [
    { "id": "client", "label": "Web Client", "group": "Client" },
    { "id": "api", "label": "API", "group": "Service" }
  ],
  "edges": [
    { "source": "client", "target": "api", "label": "HTTPS" }
  ]
}
```

Graphviz `dot` is optional. If it is missing, hand-place the diagram or deliver XML plus a diagrams.net URL.

## Manual Layout

- Align visible vertex `x` and `y` values to the 10px grid.
- Keep at least 60px outer page margin and enough space that connectors do not cross labels.
- Use equal sizes and equal gaps for sibling nodes in the same row or column unless content requires a different size.
- Encode explicit label breaks as `&#xa;`; do not put literal `\n` in draw.io `value` attributes.
- Include `whiteSpace=wrap;html=1` on labels and use `fontSize=14` by default, with 12 as the smallest readable exception.
- Size containers, sidebars and swimlanes to their content plus balanced padding. If a final row is incomplete, center it or split the group instead of leaving a large empty tail.

## Export

Preview:

```bash
node skills/fec-drawio-studio/scripts/drawio-export.mjs diagram.drawio --format png --output diagram.png --width 2000
```

Final editable PNG:

```bash
node skills/fec-drawio-studio/scripts/drawio-export.mjs diagram.drawio --format png --output diagram.drawio.png --scale 2 --embed
node skills/fec-drawio-studio/scripts/png-embed-fix.mjs diagram.drawio.png
```

Preview export can be checked without draw.io side effects:

```bash
node skills/fec-drawio-studio/scripts/drawio-export.mjs diagram.drawio --format png --output diagram.png --scale 2 --width 2000 --dry-run --json
```

Fallback URL:

```bash
node skills/fec-drawio-studio/scripts/diagram-url.mjs diagram.drawio --edit
```

Create/import URL for XML, Mermaid or CSV:

```bash
node skills/fec-drawio-studio/scripts/diagram-url.mjs diagram.drawio --create --type xml --json
node skills/fec-drawio-studio/scripts/diagram-url.mjs flow.mmd --create --type mermaid
node skills/fec-drawio-studio/scripts/diagram-url.mjs org.csv --create --type csv --lightbox
```

Use `--base-url` for a self-hosted diagrams.net endpoint. Use `--shortcut` or the JSON `windowsShortcut` field when opening the URL through Windows shell tooling.
