---
name: fec-image-generation
description: Use when generating or editing frontend UI mockups, product images, posters, brand visuals, illustrations, avatars, storyboards, or raster assets, including PNG quality checks. Do not use for structured architecture, sequence, workflow, or data-flow diagrams.
---

# Frontend visual asset generation and editing

For UI, brand and product visuals, read [asset routing](references/artifact-routing.md). Select generate, edit or hybrid according to available source images, purpose, dimensions, transparency and delivery path.

## Implementation and quality checks

Preserve original images and save edits separately by default. Do not present placeholders or concept drafts as final product imagery. Clarify branding, text, accessible alternatives and licensing; prefer targeted edits when suitable source imagery exists.

Inspect actual PNG output before delivery: verify subject rendering, clipping, composition, transparency and branding. Use the [shared-source PNG checker](scripts/png-qa.mjs). Default to at most two repairs; follow [PNG repair guidance](references/png-qa-autofix.md) to modify source, prompt or layout rather than destructively changing output pixels.

Report source and output paths, generation route, QA rounds and unresolved risks. Structured technical diagrams use the dedicated common diagram capability; this entry no longer maintains a technical diagram renderer.
