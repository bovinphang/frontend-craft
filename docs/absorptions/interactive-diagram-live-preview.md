# Interactive Diagram Live Preview Absorption

## Reference System

Local reference: `D:\code\github\skill\images-generate\interactive-diagram`

The reference project demonstrates a useful diagram workflow where an assistant streams small graph commands to a local browser, so users can watch a diagram appear incrementally and adjust it before export.

## Absorption Candidates

- **Accepted: live incremental preview.** Reimplemented as a Node 22 standard-library server in `fec-image-generation` so it fits the existing script-based skill packaging model.
- **Accepted: session isolation.** Added session-scoped state and export endpoints so several diagrams can coexist during one assistant session.
- **Accepted: browser-side editing and export.** Recreated with a lightweight SVG renderer that supports drag, relabel, delete, zoom, JSON/SVG/PNG export, and server-side JSON/SVG/draw.io handoff.
- **Deferred: full diagram editor parity.** Advanced graph editor behavior, complex routing, undo stacks, and third-party canvas engines are intentionally outside the first slice.

## Target Design

The target project keeps `fec-image-generation` as the single entry point for generated visual artifacts. The live route complements the existing deterministic HTML diagram renderer and the draw.io studio workflow:

- Use live interactive diagrams for conversational sketching and incremental preview.
- Use HTML technical diagrams for polished browser-ready deliverables with layout manifests and PNG QA.
- Use draw.io studio when `.drawio` ownership, official shapes, or long-term manual editing is required.

## Originality Notes

The implementation is inspired by the reference workflow, but the server, renderer, command handling, layout, documentation, and tests are newly written for `frontend-craft`. It uses Node 22 stdlib and a custom SVG renderer rather than the reference Python service and AntV X6 browser template.

The reference repository is MIT licensed. No non-trivial reference code, HTML template, or prompt wording was copied.

## Verification

- The server should start on a requested port and fall back when the default port is occupied.
- Session `a` and session `b` should keep independent command histories.
- Invalid JSON should return a clear `400` response.
- The browser page should restore session state and connect to session-scoped SSE.
- JSON export should expose commands plus the computed graph model.
