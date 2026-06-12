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

- `architecture`: system topology, cloud regions, trust boundaries, clients, gateways, services, data stores, event buses, auth flows, and infrastructure overview diagrams.
- `workflow`: ownership lanes, approval gates, runbooks, CI/CD, incident response, tool calls, and request lifecycles.
- `sequence`: participants over time, API call chains, cache fallback, auth checks, async traces, and return messages.
- `dataflow`: sources, ingest, processing, storage, consumers, PII boundaries, governance, analytics, and lineage.
- `lifecycle`: object states, terminal states, retries, waits, cancellation, timeout, deployment or order status transitions.

Use the `architecture` mode for browser-ready overview diagrams with explicit coordinates. Use `fec-drawio-studio` instead when the priority is `.drawio` source, official vendor icons, diagrams.net manual editing, or complex auto-layout.

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

- `architecture`: `nodes`, `connections`; optional `groups`, `legend`, and `summary`.
- `workflow`: `lanes`, `nodes`, `edges`.
- `sequence`: `participants`, `messages`.
- `dataflow`: `stages`, `nodes`, `flows`.
- `lifecycle`: `lanes`, `states`, `transitions`.

IDs must start with a letter and use only letters, numbers, `_`, and `-`. Keep labels short enough to read inside nodes; put long explanation in surrounding prose instead of the diagram.

## Architecture IR

Architecture mode uses explicit coordinates because system diagrams often need intentional placement, boundaries, and trust zones:

```json
{
  "schema_version": 1,
  "diagram_type": "architecture",
  "meta": {
    "title": "SaaS Architecture",
    "subtitle": "Browser-ready infrastructure overview"
  },
  "groups": [
    { "id": "cloud", "label": "Cloud region", "type": "cloud", "x": 170, "y": 50, "width": 620, "height": 280 }
  ],
  "nodes": [
    { "id": "web", "label": "Web App", "type": "frontend", "x": 48, "y": 160, "sublabel": "React" },
    { "id": "api", "label": "API Gateway", "type": "cloud", "x": 230, "y": 160, "group": "cloud" },
    { "id": "svc", "label": "App Service", "type": "backend", "x": 420, "y": 160, "group": "cloud" },
    { "id": "db", "label": "PostgreSQL", "type": "database", "x": 620, "y": 160, "group": "cloud" }
  ],
  "connections": [
    { "from": "web", "to": "api", "label": "HTTPS", "variant": "emphasis" },
    { "from": "api", "to": "svc", "label": "REST" },
    { "from": "svc", "to": "db", "label": "SQL" }
  ],
  "summary": [
    { "title": "Runtime", "type": "backend", "items": ["API and worker services", "Managed relational data"] }
  ]
}
```

Supported node and group types are `frontend`, `backend`, `database`, `cloud`, `security`, `messagebus`, and `external`. Connections support the standard variants `default`, `emphasis`, `security`, `dashed`, and `return`. Add `waypoints` as `[[x, y], ...]` when a connection needs to route around boundaries or labels.

Architecture output includes an automatic legend unless `legend` is set to `false`. A custom legend can be supplied as `{ "label": "...", "type": "..." }` items. `summary` renders up to three cards below the SVG and is not included in the layout manifest, so PNG QA focuses on the diagram itself.

## Architecture Layout Rules

- Draw groups as broad boundaries around components, not as decorative panels.
- Keep legends below or outside all boundaries; increase the coordinates and view area rather than squeezing content.
- Use `messagebus` nodes for event buses and place them in the gap between services.
- Use `security` connections for auth, token, policy, or trust-boundary flows.
- Prefer `waypoints` over dense crossing lines when gateways fan out to several services.
- Split the diagram when the overview needs more than one dense cluster or when label readability depends on shrinking text.

## Render Command

```bash
node skills/fec-image-generation/scripts/tech-diagram-render.mjs \
  --input diagram.json \
  --output diagram.html \
  --type architecture \
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
