# Process Flow Diagram Generator Absorption

## Reference System

Local reference: `D:\code\github\skill\images-generate\process-flow-diagram-generator`

The reference project demonstrates a useful workflow for turning plain-language process descriptions into polished single-file process flow diagrams. Its strongest ideas are process-specific semantics: ordered steps, actor labels, decision branches, loop-backs, exception paths, summary metadata, and browser-friendly handoff.

## Absorption Candidates

- **Accepted: process workflow semantics.** Reimplemented inside the existing `fec-image-generation` HTML technical diagram renderer as workflow node shapes, actor labels, numbered steps, decision diamonds, terminal states, summaries, and routed exception paths.
- **Accepted: browser-ready handoff.** Kept the target project's self-contained HTML route with SVG download, print/PDF, layout manifests, and PNG QA compatibility.
- **Accepted: explicit layout escape hatch.** Added workflow edge `waypoints` so rework, rejection, and cyclical paths can avoid labels and nodes without introducing a new layout engine.
- **Rejected: standalone process-flow skill.** A new skill would overlap with `fec-image-generation` and `fec-drawio-studio`.
- **Rejected: reference HTML template and visual system.** The target implementation keeps Frontend Craft's existing CSS-variable technical diagram styling.
- **Deferred: browser-side PNG/PDF capture buttons.** The reference uses browser capture libraries from CDNs. Frontend Craft keeps the offline route and existing QA/export workflow for this slice.

## Target Design

The target project keeps `fec-image-generation` as the entry point for generated visual artifacts:

- Use HTML `workflow` IR for process maps, approvals, automation flows, exception paths, cyclical loops, and runbooks that should open as a browser-ready single file.
- Use `fec-drawio-studio` when `.drawio` ownership, official diagrams.net shapes, or long-term manual editing is required.
- Use Mermaid or SVG when the diagram is small enough to remain primarily in Markdown.

The absorbed behavior is implemented as an enhancement to `tech-diagram-render.mjs`, preserving the existing `lanes`, `nodes`, and `edges` IR so old workflow diagrams continue to render.

## Originality and License Notes

The reference repository is MIT licensed. This absorption uses the reference as evidence for useful process-diagram behavior, but the code, renderer structure, HTML shell, CSS, examples, tests, and documentation are newly written for `frontend-craft`.

No non-trivial reference template, prompt text, example process, color system, or export script was copied. The target project also avoids introducing the reference project's CDN-based capture dependencies in order to preserve offline and cross-runtime behavior.

## Verification

- Existing workflow IR should still render and produce a PNG QA manifest.
- Process workflow IR should render start/end-style terminal nodes, decision diamonds, actor labels, step badges, summary cards, and waypoint-routed rejection or loop paths.
- Generated HTML should not include html2canvas, jsPDF, or CDN scripts.
- `npm run typecheck:skill-scripts` and the image-generation install tests should pass.
