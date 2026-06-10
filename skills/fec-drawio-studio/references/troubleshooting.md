# Troubleshooting

## draw.io CLI Missing

Generate the `.drawio` file and use `diagram-url.mjs --edit` to open diagrams.net in the browser.

## Graphviz Missing

`layout-graph.mjs` exits with a clear Graphviz message. Keep the graph JSON and either install Graphviz or hand-place a smaller diagram.

## Blank Vendor Shape

Run `shape-query.mjs` and use the returned style string. A guessed `shape=mxgraph.*` often renders as a generic box.

## Brand Icon Does Not Render

CDN-referenced symbols require network access during render. Use `brand-symbols.mjs --embed` for a self-contained data URI when portability matters.

## Embedded PNG Looks Corrupt

Run `png-embed-fix.mjs` after final `drawio -e` PNG export. The command is idempotent.
