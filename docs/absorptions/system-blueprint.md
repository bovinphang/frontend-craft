# System Blueprint Absorption

## Reference System

Local reference: `D:\code\github\skill\images-generate\system-blueprint`

The reference project demonstrates a useful agent workflow for turning codebase or system descriptions into shareable technical blueprints. Its strongest ideas are presentation-ready architecture diagrams, self-contained HTML/SVG delivery, README-friendly SVG handoff, optional raster export, and model-first diagram authoring.

## Absorption Candidates

- **Accepted: system blueprint intent.** Integrated system blueprint, deployment topology, agent runtime, memory flow, and before/after architecture language into `fec-image-generation`.
- **Accepted: model-first architecture extraction.** Reframed as a target-native checklist for entry surfaces, application services, data stores, external dependencies, identity boundaries, and key flows before rendering.
- **Accepted: source-first delivery contract.** Kept JSON IR and generated HTML/SVG as the source of truth, with SVG/PNG/JPG exports as artifacts.
- **Accepted: dependency-light raster handoff.** Added a Node script that extracts inline SVG and uses an already-installed Chromium browser for raster export when available.
- **Rejected: standalone `system-blueprint` skill.** A new skill would overlap with `fec-image-generation` and `fec-drawio-studio`.
- **Rejected: reference template, Python script, and example SVGs.** The target implementation keeps Frontend Craft's existing renderer, visual system, QA flow, and Node script packaging model.

## Target Design

The target project keeps `fec-image-generation` as the single entry point for generated diagrams and visual assets:

- Use HTML `architecture` IR for browser-ready system blueprints, deployment views, trust-boundary maps, and before/after topology summaries.
- Use HTML `workflow`, `sequence`, `dataflow`, or `lifecycle` IR when the primary story is process, calls over time, lineage, or state transitions.
- Use `fec-drawio-studio` when the priority is `.drawio` source, official diagrams.net shapes, or long-term manual editing.
- Use `export-diagram.mjs` to extract README-friendly SVG or to produce PNG/JPG artifacts when a local Chromium browser is available.

## Originality and License Notes

The reference repository presents itself as an open skill package, but this absorption does not depend on copying its implementation. The wording, script structure, tests, documentation, and target integration are newly written for `frontend-craft`.

No non-trivial reference code, HTML template, example diagram, prompt text, image asset, or Python export implementation was copied. The absorbed ideas are common workflow capabilities redesigned around Frontend Craft's existing HTML technical diagram route and packaging constraints.

## Verification

- `fec-image-generation` should trigger for system blueprint, deployment topology, agent runtime, memory flow, and before/after architecture requests.
- HTML technical diagrams should document the model-first system blueprint workflow and keep the existing architecture JSON IR.
- `export-diagram.mjs` should extract SVG from both `.html` and `.svg` inputs, default output paths correctly, and fail clearly for raster export when no compatible browser is available.
- `npm run typecheck:skill-scripts` and `node --import tsx --test tests/install/image-generation-skill.test.ts` should pass.
