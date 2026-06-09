# Artifact Routing

## Route by output

| Output | Preferred route | Notes |
| ------ | --------------- | ----- |
| Poster / ad creative | Image generation, then optional layout polish in HTML/SVG or design tool | Lock exact copy before generation; recompose text outside the bitmap when accuracy matters. |
| UI mockup | HTML/CSS or design-tool mockup first; raster generation only for mood or hero references | Keep controls readable and avoid fake product states in final handoff. |
| Product image | Image generation or edit with reference constraints | Preserve brand, perspective, material, and lighting; do not overwrite original assets. |
| Infographic | Structured SVG/HTML/canvas for text and charts; generated illustrations only as supporting media | Export PNG after layout QA. |
| Academic figure | Deterministic plotting, SVG, Mermaid, LaTeX, or canvas | Accuracy beats style; keep source reproducible. |
| Comic / storyboard | Image generation with panel manifest | Track panel count, exact captions, characters, scene continuity, and reading order. |
| Avatar | Image generation or edit | Ask only when identity, style, or usage rights are ambiguous. |
| Brand board | Mixed route: generated imagery, palette/type/layout board in HTML/SVG | Record palette roles, typography mood, imagery rules, and avoid-list. |
| Image edit | Edit target plus explicit invariants | Preserve requested identity, composition, text, object, lighting, or background constraints. |

## Prompt contract

Use this compact structure when calling an image tool:

```text
Asset type:
Use:
Canvas / aspect ratio:
Audience:
Required text:
Subject:
Composition:
Style / brand tone:
Must preserve:
Avoid:
Output:
```

For exact text, prefer adding text in SVG/HTML/design source after image generation. If text must be inside generated imagery, keep it short and verify manually.

## Handoff checklist

- Final image path is inside the workspace when the asset is project-bound.
- Source or prompt is saved when future edits are likely.
- Exact text, diagram labels, chart values, citations, and brand marks are manually checked.
- Generated variants that were rejected are not referenced by code or docs.
