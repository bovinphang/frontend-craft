---
name: fec-image-generation
description: Use when generating or editing diagrams, charts, visual assets, posters, UI mockups, product images, infographics, academic figures, comics, avatars, storyboards, brand boards, or image-edit workflows, especially when exported PNGs need visual QA and bounded self-repair. Prefer deterministic Mermaid/SVG/HTML/canvas sources for text-heavy diagrams; use HTML technical diagrams for themed browser-ready architecture, workflow, sequence, data-flow, lifecycle, runbook, PII/data-lineage, and state-machine diagrams; do not use for ordinary UI polish without generated imagery. Chinese triggers include Picture generation, image editing, diagram generation, architecture diagram, workflow diagram, data flow, lifecycle diagram, state machine, ER diagram, UML, sequence diagram, poster, UI mockup, product diagram, information diagram, academic diagram, comics, avatar, storyboard, brand board, PNG self-inspection, automatic repair.
---

# Image generation and chart workflow

## Purpose

Generate or edit diagrams, visual assets, and image workflows, and perform reviewable self-checks and repair iterations on exported PNGs.

## Procedure

1. Determine product type
   - When accuracy of text, structure, and connections is a priority, use Mermaid, SVG, HTML/CSS, canvas, or a graphics library to generate editable sources and then export as PNG.
   - Use HTML technical diagrams when the user needs a browser-ready single file with dark/light theme support for architecture, workflow, sequence, data-flow, lifecycle, runbook, state-machine, or PII/data-lineage diagrams.
   - Use the interactive live diagram route when the user benefits from watching nodes and edges appear incrementally in a local browser, or when they want to drag, relabel, remove, zoom, and export a quick diagram during the session.
   - When aesthetics, texture, photos, illustrations, comics, product images or brand atmosphere are priorities, use image generation or editing tools, and then save the final assets to the project or report directory.

2. Clarify inputs and constraints
   - Collect audience, purpose, dimensions, language, required text, branding restrictions, editable source format, export format, and disabled elements.
   - For posters, UI mockups, brand boards and product images, first write a line of visual reading: target users, scenarios, sources of credibility, and main visual anchors.

3. Select Generate Route
   - ER diagrams, UML class diagrams, sequence diagrams, technical architecture diagrams, ML/deep learning, flow charts, etc., give priority to creating structured sources according to [diagram-workflows.md](references/diagram-workflows.md).
   - For themed browser-ready architecture, workflow, sequence, data-flow and lifecycle diagrams, read [html-technical-diagrams.md](references/html-technical-diagrams.md), then render JSON IR with [tech-diagram-render.mjs](scripts/tech-diagram-render.mjs):
     ```bash
     node skills/fec-image-generation/scripts/tech-diagram-render.mjs --input diagram.json --output diagram.html --type architecture --manifest diagram.layout.json
     ```
   - For live interactive sketches, start [interactive-diagram-server.mjs](scripts/interactive-diagram-server.mjs), open the served [interactive-diagram.html](assets/interactive-diagram.html) page with a unique `?s=session-id`, then POST small JSON commands to `/cmd?s=session-id`:
     ```bash
     node skills/fec-image-generation/scripts/interactive-diagram-server.mjs --port 6100
     curl -s "http://127.0.0.1:6100/cmd?s=checkout-flow" -d '{"cmd":"init","title":"Checkout Flow","direction":"TB"}'
     curl -s "http://127.0.0.1:6100/cmd?s=checkout-flow" -d '{"cmd":"node","id":"cart","label":"Review cart","type":"process"}'
     ```
   - Use the draw.io studio workflow instead when the priority is editable `.drawio` source, official diagrams.net shapes, or long-term manual editing.
   - Posters, UI mockups, product graphics, infographics, academic graphics, comics, avatars, storyboards, brand boards and image editing, press [artifact-routing.md](references/artifact-routing.md) to choose generate, edit or hybrid routing.

4. Export and self-check PNG
   - Read the exported PNG before each delivery to check whether the main body is truly rendered, whether the text is truncated, whether the connections are stacked, and whether the nodes overlap.
   - Run when there is a layout manifest:
     ```bash
     node skills/fec-image-generation/scripts/png-qa.mjs --png output.png --manifest layout.json --format markdown
     ```
   - Still running PNG basic checks without manifest:
     ```bash
     node skills/fec-image-generation/scripts/png-qa.mjs --png output.png --format json
     ```

5. Automatic repair loop
   - Default maximum of 2 rounds; can be increased to a soft cap of 5 rounds when explicitly requested by the user.
   - The repair object is the source file, prompt, layout parameter or export size, and does not directly destructively modify PNG pixels.
   - Click [png-qa-autofix.md](references/png-qa-autofix.md) to turn the problem into a specific fix: increase the canvas, wrap lines, move nodes, layer connections, adjust padding or re-export.

6. Delivery records
   - Describe final source files, PNG paths, build routes, QA rounds, issues found and fixed, text or branding risks that still require manual confirmation.

## Constraints

- Text-intensive images should not be generated solely from bitmap models; editable structured sources must be retained.
- HTML technical diagrams must keep the JSON source and generated HTML; exported PNG/SVG files are delivery artifacts, not the source of truth. Use `.drawio` instead when official vendor icons or long-term manual editing are the priority.
- Interactive live diagrams are session-time previews. Save JSON/SVG/PNG exports when the diagram becomes a deliverable, and switch to HTML technical diagrams or `.drawio` when long-term source ownership matters.
- Do not treat screenshots, fake data, or placeholder images as final product images unless the user explicitly requests a concept draft.
- The original image is not directly overwritten; the editing workflow outputs a new file by default.
- Readable labels, line attributions, legends, axes, and accessible alternative descriptions are not sacrificed for aesthetics.
- PNG helper only does detection and suggestions; fixes must go back to source, prompt, or layout parameters.
- Self-check results cannot replace manual confirmation of proper nouns, formulas, paper illustrations, brand specifications and compliance information.

## Expected Output

Produce editable source, final PNG or edited image with generated routes and QA results. Diagrams should be clearly structured, with uncensored labels and uncluttered connections; visual assets should match purpose, size, brand tone, and delivery path.
