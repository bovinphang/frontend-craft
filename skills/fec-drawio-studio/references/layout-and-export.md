# Layout And Export

## Auto Layout

Use `layout-graph.mjs` for dependency graphs, code structure maps and diagrams with more than about 15 nodes.

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

## Export

Preview:

```bash
drawio -x -f png --width 2000 -o diagram.png diagram.drawio
```

Final editable PNG:

```bash
drawio -x -f png -e -s 2 -o diagram.drawio.png diagram.drawio
node skills/fec-drawio-studio/scripts/png-embed-fix.mjs diagram.drawio.png
```

Fallback URL:

```bash
node skills/fec-drawio-studio/scripts/diagram-url.mjs diagram.drawio --edit
```
