# Draw.io Flowchart Quality Absorption

## Reference System

Local reference: `D:\code\github\skill\images-generate\drawio-flowchart-skill`

The reference project focuses on making `.drawio` flowcharts readable by constraining canvas width, grouping stages with swimlanes, using orthogonal connectors, routing loop edges around margins, and checking typography and geometry before handoff.

## Absorption Candidates

- **Accepted: flowchart readability reference.** Recreated as `fec-drawio-studio` guidance so flowchart-specific constraints live beside the existing draw.io workflow.
- **Accepted: lint-backed quality gates.** Reimplemented as generic diagram warnings for oversized pages, fragile swimlane settings, non-orthogonal edges and weak flowchart text alignment.
- **Deferred: static XML template and demo images.** The target project already prefers reusable workflow guidance plus scripts. Copying a fixed template would create a second authoring style and increase originality risk.

## Target Design

The target project keeps `fec-drawio-studio` as the single draw.io entry point. Flowchart rules are added as a specialized reference file, while `diagram-lint.mjs` surfaces likely readability problems without making every non-flowchart diagram follow the same visual style.

## Originality Notes

This absorption uses the reference as evidence for useful flowchart quality concerns, but the resulting guidance, file layout and lint implementation are written for frontend-craft's existing skill structure and validation model. No reference templates, screenshots or `.drawio` examples were copied.

## Verification

- `diagram-lint.mjs` should warn when a diagram page is wider than the readable manual-flowchart range.
- `diagram-lint.mjs` should warn when swimlane containers remain connectable, collapsible, rounded or too small in title text.
- `diagram-lint.mjs` should warn on non-orthogonal flow edges and process labels that are not centered.
- Existing draw.io tests should continue to pass.
