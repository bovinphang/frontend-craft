# HTML Technical Diagrams

Use this route when a technical diagram should be easy to open in a browser, share as one file, switch dark/light themes, and export from the browser after visual QA.

This route complements, but does not replace, other diagram sources:

| Need | Prefer |
| ---- | ------ |
| Small markdown-maintained diagram | Mermaid, Graphviz, or SVG |
| Editable source for future manual changes | `fec-drawio-studio` and `.drawio` |
| Browser-ready themed technical diagram | HTML technical diagram route |
| Raster-first visual, poster, concept art, or image edit | Image generation or editing route |

## Supported Diagram Intents

- `workflow`: ownership lanes, approval gates, runbooks, CI/CD, incident response, tool calls, and request lifecycles.
- `sequence`: participants over time, API call chains, cache fallback, auth checks, async traces, and return messages.
- `dataflow`: sources, ingest, processing, storage, consumers, PII boundaries, governance, analytics, and lineage.
- `lifecycle`: object states, terminal states, retries, waits, cancellation, timeout, deployment or order status transitions.

Architecture diagrams can use this route when they can be expressed as one of the structured modes above. For freeform infrastructure placement, use SVG/HTML manually or draw.io instead of forcing the IR.

## JSON IR

All modes require:

```json
{
  "schema_version": 1,
  "diagram_type": "workflow",
  "meta": {
    "title": "Release Workflow",
    "subtitle": "PR to production"
  }
}
```

Mode-specific minimum fields:

- `workflow`: `lanes`, `nodes`, `edges`.
- `sequence`: `participants`, `messages`.
- `dataflow`: `stages`, `nodes`, `flows`.
- `lifecycle`: `lanes`, `states`, `transitions`.

IDs must start with a letter and use only letters, numbers, `_`, and `-`. Keep labels short enough to read inside nodes; put long explanation in surrounding prose instead of the diagram.

## Render Command

```bash
node skills/fec-image-generation/scripts/tech-diagram-render.mjs \
  --input diagram.json \
  --output diagram.html \
  --type workflow \
  --manifest diagram.layout.json
```

The generated HTML is self-contained and includes:

- Inline SVG.
- CSS-variable dark/light theme.
- Browser controls for theme toggle, SVG download, and print/PDF.
- Optional layout manifest for PNG QA.

## QA and Repair

After exporting a PNG from the browser, run:

```bash
node skills/fec-image-generation/scripts/png-qa.mjs \
  --png diagram.png \
  --manifest diagram.layout.json \
  --format markdown
```

Repair the source JSON or rendering dimensions rather than editing pixels:

- Overlap: split dense lanes or add rows/lanes/stages.
- Truncated label: shorten labels, add `sublabel`, or widen nodes.
- Connector through label: reduce edge labels or separate nearby nodes.
- Dense flow: split into overview and detail diagrams.
- Edge clipping: increase output space or simplify the path.

## Delivery Notes

Deliver the `.html` source together with any exported PNG/SVG requested by the user. Report the route used, source file, exported file, QA result, and any naming or domain assumptions that still need human confirmation.
