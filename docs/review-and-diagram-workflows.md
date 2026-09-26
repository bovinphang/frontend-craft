# Review scope and technical diagram delivery

These conventions apply to the installed capabilities across runtimes. Use natural-language requests; review modes are not installer CLI flags.

## Review scope

`fec-code-reviewer`, `fec-typescript-reviewer`, `fec-security-reviewer`, `fec-code-review`, `fec-security-review`, and `/fec-review` follow the same scope rules:

| Request | Scope | Report conclusion |
| --- | --- | --- |
| No scope, including bare `/fec-review` | Entire project, even when Git changes exist | Risk assessment |
| A file or directory | All existing code in that scope, including unchanged code | Scope risk assessment |
| Explicit recent changes, PR, or commit | Requested diff and necessary context | Merge recommendation |

Full and targeted reviews do not require a Git diff. An explicit incremental review with no changes reports that fact without expanding its scope. Reviewers keep their frontend, TypeScript, or security specialty; this does not certify a backend security audit.

For project reviews, inventory owned frontend code, related tests, configuration, and dependency declarations, then review modules in batches. Exclude dependencies, generated files, build outputs, caches, and third-party code by default. Reports record mode, target scope, reviewed scope, exclusions, uncovered modules, and validation results. Mark incomplete reviews as partial and merge findings with the same root cause. Reading callers or running static checks does not count as manually reviewing those files. Report only unless fixes are explicitly requested.

Examples: “Review the project”; “Review all code in `src/features/`”; “Review `src/components/Button.tsx`”; “Review only the recent changes.” Automatic review after edits must explicitly pass the current change scope.

## Technical diagrams

Use `fec-image-generation` for sequence diagrams and workflows with local Mermaid where available; use `fec-drawio-studio` for editable architecture diagrams. Use the JSON/HTML renderer when these tools are unavailable. Keep technical relationships and labels in editable source rather than relying on raster image generation for exact structure.

The Mermaid adapter uses an installed CLI only; it does not download packages. PNG export requires a local Chromium browser, with `FEC_BROWSER_PATH` available for an explicit executable. Missing tools must be reported rather than claimed as successful exports.

For the JSON/HTML route, render the source, export PNG with a browser-measured manifest at the same scale, run QA, and inspect the final image:

```bash
node skills/fec-image-generation/scripts/tech-diagram-render.mjs --input skills/fec-image-generation/assets/quality-examples/workflow.json --type workflow --output workflow.html --manifest workflow.layout.json
node skills/fec-image-generation/scripts/export-diagram.mjs --input workflow.html --format png --output workflow.png --theme light --scale 2 --manifest workflow.layout.json --output-manifest workflow.actual.json
node skills/fec-image-generation/scripts/png-qa.mjs --png workflow.png --manifest workflow.actual.json --format json
```

Preserve complete Unicode labels, explicit geometry, edge direction, sequence order, and self calls. Keep exported SVG styles self-contained. Geometry QA and browser measurement support visual inspection; neither proves semantic correctness nor completes a human visual review. Missing measurements or partial coverage must be disclosed. Repair the editable source for at most two automatic rounds, then report unresolved defects.

Deliver editable source, the requested export, and QA/coverage results. See [reproducible examples](../skills/fec-image-generation/assets/quality-examples/README.md), [diagram workflows](../skills/fec-image-generation/references/diagram-workflows.md), and [PNG QA](../skills/fec-image-generation/references/png-qa-autofix.md).

[简体中文](zh-CN/review-and-diagram-workflows.md)
