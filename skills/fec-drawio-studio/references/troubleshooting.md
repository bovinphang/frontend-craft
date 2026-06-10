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

## Browser URL Opens Blank On Windows

Use `diagram-url.mjs --json` and open the emitted `windowsShortcut` content as a `.url` file, or run `diagram-url.mjs --shortcut`. This preserves the `#R` or `#create=` fragment that carries the compressed diagram.

## Mermaid Or CSV URL Fails

Mermaid and CSV must use `diagram-url.mjs --create --type mermaid|csv`. The older viewer/editor `#R` mode is XML-only.
