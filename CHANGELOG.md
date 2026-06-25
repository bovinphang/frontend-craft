# Changelog

**简体中文:** [CHANGELOG.zh-CN.md](CHANGELOG.zh-CN.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Project-facing release notes are maintained in English from 2.0.0 onward. Historical entries may preserve their original language.

## [2.8.0] - 2026-06-25

### Added

- **Localized Simplified Chinese content pack:** added `localized/zh-CN` coverage for agents, commands, skills, templates, metadata, relations, evaluation examples, and bundled helper scripts so installs can choose localized AI-facing content without changing the canonical English root content.
- **Installer language selection:** `fec install` / `fec setup` now accepts `--lang en|zh-CN`; interactive installs can choose the language, unsupported language values fail clearly, install manifests record `language`, and `update` reuses the previous manifest language when `--lang` is omitted.
- **`fec-image-generation` HTML technical diagrams:** added browser-ready single-file diagram workflows for architecture, process workflows, sequence, data-flow, lifecycle, state-machine, runbook, PII / data-lineage, agent runtime, and memory diagrams, with semantic node types, flow-aware arrows, theme styles, summaries, and PNG QA handoff.
- **Image-generation diagram scripts:** added `tech-diagram-render.mjs`, `interactive-diagram-server.mjs`, `export-diagram.mjs`, and `assets/interactive-diagram.html` for rendering HTML/SVG technical diagrams, running local live diagram sessions, and exporting SVG/PNG/JPG artifacts from HTML or SVG sources.
- **Interactive live diagrams:** `fec-image-generation` now includes a local browser sketch route with session-scoped incremental node / edge commands, drag, relabel, remove, zoom, layout updates, and JSON / SVG / draw.io export handoff.
- **`drawio-export.mjs`:** new cross-platform draw.io desktop export helper with PATH/default-location detection, PNG/SVG/PDF options, dry-run JSON output, and install guidance when draw.io is missing.

### Changed

- **`localized` package contents:** `package.json` now includes `localized` in the published file set so language packs ship with the npm package.
- **Root content language policy:** root `agents`, `commands`, `skills`, and `templates` are now validated as English-only distributable content; Simplified Chinese AI-facing content lives under the localized pack.
- **`fec-image-generation` routing:** diagram guidance now distinguishes Mermaid / SVG / HTML, draw.io, raster-first image generation, live sketches, process workflows, and themed semantic system diagrams so users can choose the right source-of-truth format.
- **`fec-drawio-studio` quality workflow:** strengthened manual draw.io XML guidance for grid alignment, wrapping labels, `&#xa;` line breaks, readable font sizes, balanced containers, and named diagram patterns such as flowcharts, architecture, sequence, class, ERD, mindmap, and network topology.
- **`diagram-lint` draw.io warnings:** now reports literal `\n` labels, missing wrapping/html styles, tiny fonts, off-grid vertices, page overflow, and overlap warnings so final delivery can use `--strict` as a stronger quality gate.
- **draw.io shape index packaging:** the source shape index is now stored as pretty-printed `shape-index.json` instead of a gzipped JSON file, while standalone skill packages minify data JSON during packaging to keep publish artifacts compact.
- **OpenClaw package and docs:** OpenClaw README files now list all 45 bundled skills and every command doc by use case, language links point to the OpenClaw-specific README pair, and the packed OpenClaw package is named `frontend-craft`.
- **`typecheck:skill-scripts`:** now covers the new `fec-image-generation` diagram render, interactive server, and export scripts.

### Fixed

- **OpenClaw README language links:** fixed OpenClaw documentation links so English and Simplified Chinese variants reference `README.openclaw.md` and `README.openclaw.zh-CN.md` instead of the root README pair.
- **Localized update behavior:** updates preserve the previously installed content language from `frontend-craft.manifest.json` when the user does not pass a new `--lang` option.

### Chore

- **Localization regression coverage:** added metadata consistency checks that keep root content English-only, require natural Simplified Chinese localized content, and verify localized metadata / relations / evaluation prompts contain translated prose.
- **Installer language tests:** expanded CLI and update tests for `--lang`, unsupported language errors, manifest language recording, Simplified Chinese content installation, and update language reuse.
- **Diagram workflow tests:** expanded image-generation and draw.io install tests for HTML technical diagram rendering, semantic diagram validation, live diagram server commands, export paths, draw.io export dry-runs, stricter lint warnings, and strict-mode overlap failures.
- **Skill packaging tests:** added coverage that standalone skill packages minify packaged data JSON while preserving source JSON semantics.

## [2.7.0] - 2026-06-10

### Added

- **`fec-drawio-studio` skill:** editable draw.io / diagrams.net workflow for technical diagrams, including official shape lookup, brand symbols, Graphviz auto-layout, code structure maps (TS / JS / Go / Python / Rust), validation, export fallback, and an `XML / Mermaid / CSV` URL handoff (`diagram-url --create`) with self-hosted `baseUrl`, lightbox, dark and Windows `.url` shortcut support.
- **`fec-image-generation` skill:** diagrams, charts, posters, UI mockups, infographics, and image-edit workflows, plus `scripts/png-qa.mjs` for PNG visual QA with bounded self-repair (registered in `typecheck:skill-scripts`).
- **`fec-backend-requirements-handoff` skill:** frontend-to-backend handoff for UI data needs, user actions, states, permissions, business rules, uncertainties, and backend discussion points — without dictating implementation.
- **`fec-web-video-presentation` skill:** recordable 16:9 step-driven web presentations from articles, scripts, lessons, and demos, with compact references, starter theme data, and a cross-platform Vite/React scaffold helper.
- **Modular reference docs:** split several monolithic reference files into focused modules — `fec-e2e-testing` (e2e-ci-reporting / e2e-special-scenarios / e2e-visual-regression), `fec-legacy-to-modern-migration` (migration-execution-checklist / migration-strategy-and-mapping), `fec-performance-optimization` (framework-performance-patterns), `fec-react-project-standard` (react-project-structure / react-runtime-patterns / react-quality-patterns / react-performance-patterns), and `fec-vue3-project-standard` (vue3-project-structure / vue3-composables-routing / vue3-state-api-quality / vue3-performance-patterns). Each `SKILL.md` now points at the new focused references.
- **Install coverage for the new skills:** `tests/install/image-generation-skill.test.ts`, `tests/install/drawio-studio-skill.test.ts`, expanded `tests/install/ui-design-intelligence.test.ts` (designRead, designDials, page-intent dial behavior) and `tests/install/end-to-end.test.ts` (new skill ids, taxonomy, relations).

### Changed

- **BREAKING — `fec-typescript-type-safety` renamed to `fec-typescript-project-standard`:** the skill directory, id, and metadata entry are renamed; type-safety content is preserved as `references/type-safety.md` inside the new skill, and a top-level `SKILL.md` covers TypeScript project standards (config, public API types, declarations, DTOs, generics). `agents/fec-typescript-reviewer.md` and all `skills/metadata.json` / `skills/relations.json` references were updated. **Migration:** replace every `fec-typescript-type-safety` reference (in agent / skill frontmatter, `relations.json`, eval queries, custom docs) with `fec-typescript-project-standard`.
- **Skill taxonomy — new `project-standard` category:** the `project-standard` taxonomy was already declared in 2.6.0 metadata; this release populates it with the renamed TypeScript skill and aligns README skill tables across all 5 locales. `fec-monorepo-project-standard` remains in `project-evolution`/standard mix; the existing 7 categories are unchanged.
- **Skill count:** 41 → 45 across README locales (en / zh-CN / zh-TW / ja-JP / ko-KR), `skills/metadata.json`, `.claude-plugin/marketplace.json` description, and `skills/eval_queries.json` trigger queries. README wording, project-structure docs, and example-prompts tables were re-tagged to label every capability entry by type (skill / agent / cmd).
- **`fec-ui-design` enhancements:** added product-context reading, design dials (`visualTension`, `motionIntensity`, `informationDensity`, `mediaAuthenticity`, `contentPersuasion`), anti-generic UI guidance, and a visual-references strategy. `design-system.mjs` script, `style-archetypes.json`, `ux-quality-rules.json`, `design-intelligence.md`, and `pre-delivery-checklist.md` data were extended; multi-locale READMEs and project-structure docs were updated.
- **`fec-motion-interaction` enhancements:** added context-aware motion-intensity guidance, aligning with `fec-ui-design` design dials.
- **`fec-implement-from-design` enhancements:** added screenshot / section-level visual references alongside the existing Figma / Sketch / MasterGo / Pixso / 墨刀 / 摹客 sources.
- **`fec-drawio-studio` lint hardening:** `diagram-lint` now forbids XML comments, unescaped ampersands and angle brackets, self-closing edge cells, missing root / layer cells, and warns when vertex labels contain HTML without the `html=1` style. New install tests cover `diagram-url` and `diagram-lint`.
- **`fec-legacy-to-modern-migration`, `fec-tailwind-design-system`, `fec-responsive-layout`:** added Playwright-equivalent validation guidance so migration and visual-sensitive tasks build a before/after behavior checklist and pick the validation layer (Playwright / visual diff / typecheck / unit) matched to the change risk.
- **Shared rules slim-down:** `templates/shared/rules/fec-*.md` were condensed to standing project-resident hard constraints. Productized guidance for UI design, Tailwind design systems, responsive layout, TypeScript modeling, error-handling framework internals, and rendering patterns now lives in their dedicated skills instead of being inlined into rules; `fec-i18n.md`, `fec-responsive-design.md`, `fec-typescript.md`, `fec-state-management.md`, `fec-design-system.md`, `fec-rendering-patterns.md`, `fec-error-handling.md`, `fec-ci-cd.md`, and `fec-refactoring.md` were all trimmed.
- **Multilingual README sync:** the new "XML/Mermaid/CSV URL handoff" description for `fec-drawio-studio` and the new design-dial framing for `fec-ui-design` are reflected in all 5 locales. Old references to the removed `/fec-build-fix` slash command and `fec-build-fixer` agent were replaced with the real `/fec-debug` command and `fec-debugger` agent. `docs/example-prompts.md` (and its zh-CN mirror) now covers all 45 skills.
- **Marketplace metadata:** `marketplace.json` description and `package.json` keywords updated to reflect the 45-skill surface; re-indented to the repository's prettier configuration.
- **`fec-doc-sync` scope:** the doc-sync workflow continues to cover env notes, scripts, API / route notes, and deploy facts in addition to user-facing docs; example prompts, the `/fec-doc-sync` command doc, and `skills/metadata.json` align.

### Removed

- **`fec-typescript-type-safety` skill directory:** the legacy directory was removed; its content lives in `fec-typescript-project-standard` (`references/type-safety.md`). Update any custom rules, agents, or skills that referenced the old id.

### Chore

- **JSON metadata reformat:** `marketplace.json` and `skills/metadata.json` indentation / trailing-newline conventions normalized.
- **Project-structure docs:** `docs/project-structure.md` and its `zh-CN` mirror updated to enumerate the new skills and reorganized reference modules.
- **Install test coverage:** added `tests/install/image-generation-skill.test.ts` and `tests/install/drawio-studio-skill.test.ts`; existing end-to-end and metadata-consistency tests updated to assert the new skill ids, taxonomy, and relations.
- **Skill-script typecheck:** `typecheck:skill-scripts` now also covers `skills/fec-image-generation/scripts/png-qa.mjs`.


## [2.6.0] - 2026-06-07

### Added

- **`fec-alchemy` skill:** new project absorption workflow that extracts useful ideas from reference systems and redesigns them into original, project-native improvements; ships with `SKILL.md`, intake / absorption-plan templates, and reference docs covering methodology, originality, and licensing.
- **`fec setup all` subcommand:** installs frontend-craft for every supported runtime in one shot, defaulting to the current project unless `--global` is passed; help text now distinguishes the terminal `fec setup` command from the in-assistant `/fec-init` slash command.
- **`fec-debug-framework` in README skill tables:** the skill was already shipped in `skills/` but is now surfaced in every README locale and marketplace metadata.
- **`scripts/sync-version.ts`:** propagates `package.json` version to `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` (including the npm source pin), `openclaw.plugin.json`, and per-skill entries in `skills/metadata.json`. Run via `npm run sync:version`; wired into the `version` lifecycle script.
- **Skill-pack script minification:** `pack-skills.ts` and `skill-packaging.ts` are now minified with esbuild during build, producing smaller standalone skill packages in `skill-packages/`.
- **Reference docs for key skills:** added dedicated reference documents for `fec-debug-framework`, `fec-performance-optimization`, `fec-refactor-clean`, and `fec-validation-fix`, linked from the localized "详细参考" section of each `SKILL.md`.

### Changed

- **`fec-doc-sync` scope expansion:** the doc-sync workflow and skill descriptions now cover env notes, scripts, API/route notes, and deploy facts in addition to user-facing docs; example prompts, the `/fec-doc-sync` command doc, and `skills/metadata.json` were updated to match.
- **Skill taxonomy — new `project-evolution` category:** added to the taxonomy allowlist (in addition to the existing `implementation-capability`, `testing`, `review-quality`, `design-ui`, `legacy-migration`, `maintenance-docs`); `fec-alchemy` lives here, and the README skill tables, marketplace keywords, and `tests/install/metadata-consistency.test.ts` allowlist were updated across all 5 locales.
- **Skill count:** 40 → 41 across all README locales and `skills/metadata.json`.
- **README install sections restructured:** the en / zh-CN / zh-TW / ja-JP / ko-KR READMEs were reorganized into 3 install options (down from 4), with numbered steps (1–6), `install --all` examples for both `--local` and `--global`, and a final "Preview / query" step that surfaces `dry-run` and `fec list`. Option 1 is now explicitly "Install the fec CLI globally" so the `npm install -g` step is unambiguous; `Claude Code Marketplace` moved to Option 3 to reflect its position among the paths.
- **CLI setup help text:** clarified that `npm install -g` only installs the `fec` terminal command and that `--global` is required to write to the AI tool's global config; scripted all-runtime installs must use `install --all`, not `install all`.
- **`SKILL.md` References localization:** the "References" section header is now rendered as `详细参考` (Detailed References) in every `SKILL.md` to match the existing Chinese-first documentation convention.
- **`pnpm-lock.yaml`:** now tracked in version control — pnpm is the canonical package manager for the repo.
- **Marketplace plugin source pin:** `marketplace.json` source entry now follows `package.json` version consistently via `sync-version.ts` instead of being edited by hand.
- **CLI project setup command:** renamed the terminal project initialization shortcut from `fec init` / `frontend-craft init` to `fec setup` / `frontend-craft setup`; the in-assistant `/fec-init` slash command is unchanged. `src/install/cli.ts` help text, command dispatcher, and default install location updated; `tests/install/cli.test.ts` asserts the new `setup` command and that legacy `init` is rejected.

### Fixed

- **Plugin install command scope:** README, runtime docs, and marketplace descriptions now reference the `@bovinphang/frontend-craft` npm scope consistently; the previous `@frontend-craft` references (no scope) were misleading.

### Removed

- **CLI `init` command:** `init` is no longer accepted as a terminal CLI command and exits with "Unknown command: init"; use `setup` for local project setup.

### Chore

- **`SKILL.md` BOM cleanup:** removed the UTF-8 byte order mark (BOM, U+FEFF) from the first line of 23 `SKILL.md` files; the BOM was rendering as an unknown glyph in some editors and tooling.
- **JSON metadata formatting:** normalized indentation and trailing-newline conventions in `marketplace.json` and `skills/metadata.json` after the `sync-version.ts` migration.
- **`CONTRIBUTING` guide:** added scenario-specific check instructions (skill authoring, installer changes, runtime template changes, OpenClaw packaging) so contributors know which commands to run before opening a PR.
- **Runtime docs:** added build and Marketplace troubleshooting notes to per-runtime install docs under `docs/runtimes/`.
- **npm package scope migration:** published package is now `@bovinphang/frontend-craft`; install commands, `pack:skills` output paths, README badges, and OpenClaw staging paths were updated in lockstep.


## [2.5.0] - 2026-06-01

### Added

- **`init` alias and `fec` shortcut:** added `init` as an alias for `install --local` with local-default behavior; exposed `fec` as an additional bin command alongside `frontend-craft` in `package.json`.
- **Uninstall/remove commands:** added `frontend-craft uninstall` and `frontend-craft remove` that remove manifest-managed files; support `--force` to include user-modified files; discover existing manifest installs across runtimes and scopes.
- **Update without runtime:** `frontend-craft update` now supports running without specifying a runtime, refreshing all discovered installs automatically.
- **Manifest root hints:** manifest file tracking now supports root hints (baseDir/cwd/home) for multi-location file management.

### Fixed

- **Runtime install source conflicts:** added detection and interactive resolution when the same runtime is installed from different sources (e.g. marketplace vs CLI); prevents accidental overwrites and guides users through conflict resolution.

### Changed

- **Installation documentation:** updated README installation sections across all 5 locales with runtime selection options, uninstall/remove command documentation, and source conflict guidance.
- **README sync:** synchronized agent names, design tools, rule file counts, badges, and wording across all README translations.

### Chore

- **Type safety:** added JSDoc type annotations to `design-system.mjs` and enhanced the `typecheck` script to cover skill scripts.
- **Metadata formatting:** normalized JSON formatting in marketplace and skills metadata files.

## [2.4.0] - 2026-05-29

### Added

- **Debug workflow:** added `fec-debug` slash command with type-based routing, `fec-debugger` agent for complex diagnostic scenarios, and `fec-debug-framework` skill with a 5-step diagnostic methodology.
- **6 new skills:** `fec-performance-optimization` (Core Web Vitals, memory leaks, performance budgets), `fec-source-driven-development` (evidence-based decisions with official-docs verification), `fec-state-management` (state architecture patterns), `fec-typescript-project-standard` (TypeScript project standards and type safety), `fec-dependency-upgrade` (upgrade planning), `fec-responsive-layout` (responsive layout strategy), and `fec-tailwind-design-system` (Tailwind-based design system implementation).
- **2 new integration skills:** `fec-api-integration` and `fec-motion-interaction`.
- **Example prompts library:** added `docs/example-prompts.md` and `docs/zh-CN/example-prompts.md` with scenario-based prompt catalogs covering skills, agents, commands, design workflows, testing, maintenance, and runtime setup; linked from all README variants.
- **UI design system generator:** added `design-system.mjs` generator with product rules, style archetypes, UX quality and Stack UI rules data packages; supports `--persist` and `--page` flags to write `MASTER.md` and page overrides.

### Changed

- **Agent renaming:** renamed 8 agents from `fec-frontend-*` to shorter `fec-*` prefix; replaced `fec-frontend-code-review` skill with `fec-code-review`.
- **Skill consolidation:** merged `fec-interface-polish` and `fec-ui-design-direction` into a unified `fec-ui-design` skill covering both product-level visual direction and detail-level polish.
- **UI design enhancement:** enhanced `fec-ui-design` with design-system generation, Master/Page overrides, chart UX, color rhythm, visual texture, anti-generic polish, and visual identity checks.
- **Skill taxonomy:** refined from 4 to 7 categories — `implementation-capability`, `testing`, `review-quality`, `design-ui`, `legacy-migration`, `maintenance-docs`; updated README tables across all 5 locales.
- **Unified planning entry:** merged `/fec-test-plan` into `/fec-plan`, which now auto-routes to implementation or test strategy based on user intent; updated all README variants, openclaw docs, example prompts, project structure, and marketplace metadata (9 → 8 commands).
- **Rules naming:** renamed all template shared rules with `fec-` prefix for consistent naming convention; updated README, CHANGELOG, agents, commands, skills, installers, and tests.
- **Skill descriptions:** refined skill descriptions, prompt examples, and README formatting; clarified `fec-storybook-component-doc` scope to component documentation, design-system presentation, and isolated state previews.

### Fixed

- **Skill relations:** decoupled skill relations from agent navigation to prevent incorrect cross-references.

### Removed

- `/fec-build-fix` slash command and `fec-build-fixer` agent — superseded by the new debug workflow.
- `/fec-test-plan` slash command — test-planning intent is now handled by `/fec-plan`.
- `fec-interface-polish` and `fec-ui-design-direction` skills — merged into `fec-ui-design`.

## [2.3.1] - 2026-05-25

### Added

- **Claude cache cleanup hook:** added `fec-cleanup-claude-cache` hook for automatic Claude cache management during session start.
- **Cache diagnostics:** added `--fix-cache` and `--dry-run` flags to `frontend-craft doctor claude` for inspecting and cleaning stale cache entries.
- **New module:** `src/install/claude-cache.ts` with cache report generation, cleanup logic, and result rendering.
- **Hook registration:** registered `fec-cleanup-claude-cache` in `hooks/hooks.json` and `scripts/build-dist.ts`.

### Changed

- **Doctor command:** extended `doctor` report to include Claude cache status when runtime is `claude`.
- **Install documentation:** clarified Claude Code Marketplace as the preferred single-source install for Claude Code users; documented that CLI install/update refuses Marketplace-managed Claude installs even with `--force`, and that CLI local/global conflicts must be resolved by updating the existing source or uninstalling before switching.
- **Test coverage:** added `tests/install/claude-cache.test.ts`; expanded end-to-end, metadata consistency, and update test coverage.

## [2.3.0] - 2026-05-22

### Added

- Added new workflow capabilities: `fec-tdd-workflow`, `fec-refactor-clean`, `fec-doc-sync`, `/fec-plan`, `/fec-tdd`, `/fec-build-fix`, `/fec-refactor-clean`, `/fec-doc-sync`, plus `fec-build-fixer`, `fec-refactor-cleaner`, and `fec-doc-updater`.
- Added shared rules for agent workflow and working modes, and expanded testing, performance, refactoring, git, and comment rules with TDD, incremental validation, cleanup, and documentation-sync guidance.
- **Update/upgrade commands:** added `frontend-craft update` and `frontend-craft upgrade` with manifest-based file protection, allowing safe in-place updates without overwriting user-modified files.
- **esbuild minification:** added an esbuild minification step to the build pipeline, producing smaller compiled output for `dist/`.
- **Version sync script:** added `scripts/sync-version.ts` to propagate the package version across plugin metadata files, keeping `package.json`, `openclaw.json`, and skill manifests in lockstep.

### Changed

- Enhanced `fec-validation-fix` with incremental build-fix behavior and added cross-platform long-running command guidance in the Node security hook.
- **Build pipeline restructure:** moved hook scripts from `hooks/` to `src/hooks/`, switched the build pipeline to tsx-based compilation, bundled the CLI entry point into `dist/bin/`, and stopped publishing `dist/src/` in the npm package.
- **Install module type annotations:** added comprehensive TypeScript type annotations to the install module for improved type safety and editor support.
- **README layout:** replaced the detailed directory tree with a concise summary and a link to the full project structure documentation.
- **CONTRIBUTING guides:** updated `CONTRIBUTING.md` and `CONTRIBUTING.zh-CN.md` to reflect the tsx-based build pipeline and the hook script relocation to `src/hooks/`.

### Fixed

- **Install mkdir:** skipped `mkdir` when the target directory already exists, preventing unnecessary errors during repeated installs.

## [2.2.1] - 2026-05-21

### Added

- **Qoder runtime support:** added the `qoder` installer, runtime documentation, capability metadata, README coverage, and marketplace keywords. The universal installer now documents and supports 15 AI coding runtimes.
- **Testing strategy workflow:** added `fec-test-planner`, `/fec-test-plan`, and `fec-testing-strategy` for risk-based frontend test planning across static checks, unit, component, integration, E2E, visual, accessibility, security, and performance layers.
- **New frontend workflow skills:** added `fec-ui-design-direction`, `fec-interface-polish`, and `fec-vite-project-standard`; replaced the former validation workflow with `fec-validation-fix`.
- **Standalone skill publishing pipeline:** added `scripts/pack-skills.ts`, `scripts/check-skills-publish.ts`, shared skill packaging helpers, `npm run pack:skills`, `npm run check:skills-publish`, and `npm run pack:all` for generating and validating one publishable package per skill.
- **CLI diagnostics and metadata checks:** added `frontend-craft matrix`, `frontend-craft doctor <runtime>`, and `frontend-craft sync-metadata --check` to inspect runtime capabilities, installation health, and public metadata consistency.
- **Skill evaluation dataset:** added `skills/eval_queries.json` for validating skill discovery and routing quality.

### Changed

- **TypeScript migration:** migrated the universal CLI, installers, runtime converters, hook scripts, OpenClaw packaging scripts, and tests from `.mjs` to TypeScript, with compiled runtime entry points under `dist/`.
- **Agentskills-compatible skill layout:** normalized all skill directories to the `fec-*` naming scheme, added frontmatter and reference-file structure, expanded `skills/metadata.json` to 28 skills, and synchronized README skill trees across English, Simplified Chinese, Traditional Chinese, Japanese, and Korean docs.
- **Runtime capability model:** introduced explicit per-runtime capability tiers for skills, agents, commands, hooks, rules, templates, MCP, reports, and init behavior so installer output and docs reflect each runtime accurately.
- **Claude/OpenClaw packaging metadata:** refreshed plugin descriptions, supported runtime keywords, and hook command examples to match the TypeScript build output and the current 10-agent / 28-skill / 4-command surface.
- **Publish artifact layout:** `pack:skills` now writes standalone skill packages to root `skill-packages/` instead of `dist/skill-packages/`, keeping publishable skill packages separate from TypeScript build output.
- **Clean TypeScript builds:** `npm run build` now removes `dist/` before compiling so stale generated JavaScript cannot survive into later package outputs.

### Fixed

- **Root npm package contents:** tightened the npm `files` manifest so `npm pack` publishes compiled `dist/` runtime JavaScript and plugin assets without leaking TypeScript source directories (`bin/`, `src/`, or `scripts/`).
- **Packaging regression coverage:** added npm pack validation that rejects leaked TypeScript sources, stale compiled files without matching source files, and accidental inclusion of standalone `skill-packages/` in the root npm package.

### Removed

- Removed legacy unprefixed skill directories after migrating them to the `fec-*` layout.
- Removed stale migration and skills-fusion assessment documents that no longer matched the current package structure.

## [2.1.2] - 2026-05-20

### Changed

- **CONTRIBUTING docs:** expanded `CONTRIBUTING.md` and `CONTRIBUTING.zh-CN.md` with project structure overview, local development and debugging guide, testing instructions (Node.js `node:test`, single-file runs, interactive mode via `FRONTEND_CRAFT_FORCE_INTERACTIVE=1`), OpenClaw build pipeline (`build`/`typecheck`/`pack`), `scripts/` directory reference table, and installer architecture diagram.

- **OpenClaw package renamed:** `frontend-craft-openclaw` → `frontend-craft`. The npm package name, tarball filename, and README references are all updated. The packed tarball is now written to `npm-packages/openclaw/` instead of the repository root. Affects `scripts/openclaw/pack-openclaw.ts`, `README.md`, `README.zh-CN.md`, `README.openclaw.md`, `README.openclaw.zh-CN.md`, and `docs/MIGRATION-FROM-LEGACY-REPOS.md`. Historical CHANGELOG entries for 2.0.0/2.0.1 also corrected.

- **Interactive installer:** replaced numeric-choice prompts with a TTY-interactive selectable prompt system featuring ↑↓ navigation, Space toggle, Backspace to remove, search filtering, and pagination. Affects `src/install/interactive.ts` and adds new test coverage in `tests/install/cli.test.ts`.

## [2.1.1] - 2026-05-19

### Added

- **11 new skills**: `fec-data-fetching` (TanStack Query), `fec-form-handling` (React Hook Form + Zod), `fec-browser-storage` (client persistence), `fec-route-protection` (auth/permission routes), `fec-component-testing` (RTL / Vue Test Utils), `fec-storybook-component-doc` (Storybook docs), `fec-list-virtualization` (react-window / TanStack Virtual), `fec-pwa-implementation` (PWA), `fec-web-workers` (Web Worker), `fec-canvas-threejs` (Canvas/Three.js/R3F), `fec-svg-animation` (SVG motion).
- **Shared rules**: `responsive-design.md`, `rendering-patterns.md` — deployed via `/fec-init`.
- **metadata consistency test**: `tests/install/metadata-consistency.test.ts` validates that `skills/metadata.json`, README tables, and marketplace description stay in sync.

### Changed

- **Agent behavior (`fec-code-reviewer`):** report-only by default — no longer modifies business files unless explicitly requested.
- **Skill structure**: React, Vue, Next.js, Nuxt, Monorepo, legacy-web, legacy-migration, and implement-from-design skills aligned to a five-section template: Purpose / When to Use / Procedure / Constraints / Expected Output.
- **Scaffold templates**: fixed React CSS import (`import './<Name>.styles.css'` instead of `import styles from ...`); Vue scaffold uses `<slot />` instead of bare component tag.
- **Marketplace description**: skills count updated from 13 → 24, with new capabilities (component testing, route protection, PWA, Web Workers, Canvas/Three.js, SVG animation).
- **Skills fusion assessment** (`docs/skills-fusion-assessment.md`): condensed from 399 lines to a 64-line reference with coverage matrix.

## [2.0.1] - 2026-05-14

### Fixed

- **Claude Code plugin hooks:** `hooks/hooks.json` now references bundled scripts with **`${CLAUDE_PLUGIN_ROOT}`**, which Claude Code substitutes for marketplace and `--plugin-dir` loads. **`${FRONTEND_CRAFT_ROOT}`** is not substituted by the runtime and could break hooks on **Windows + Git Bash** (an empty prefix made `/scripts/...` resolve under the Git for Windows installation directory).

### Changed

- **Version:** 2.0.1 across the root npm package, `.claude-plugin` manifests, `openclaw.plugin.json`, and the **`frontend-craft`** staging package under `npm-packages/openclaw/`.

## [2.0.0] - 2026-05-14

### Added

- **Universal CLI** `frontend-craft`: `install`, `list`, `version`, `uninstall` (hints); supports runtimes: Claude Code, Codex, Cursor, Windsurf, OpenCode, Kilo, Gemini CLI, Copilot, Antigravity, Augment, Trae, CodeBuddy, Cline, OpenClaw (`src/install/`, `bin/frontend-craft.ts`). Interactive wizard when you run `npx frontend-craft` / `install` with no runtime (TTY), plus `--local` / `-l` for project installs.
- **Root `package.json`** with Node 22+ engines, npm `files` manifest, tests via `node --test`.
- **`templates/shared/rules`** + **`templates/claude/`** layout; Codex templates under **`templates/codex/`**; OpenClaw templates under **`templates/openclaw/`**.
- **`openclaw.plugin.json`** and **`src/openclaw/`** TypeScript plugin (from former `frontend-craft-openclaw`); build via `npm run build:openclaw`, pack via `npm run pack:openclaw` → **`frontend-craft-<version>.tgz`** under **`npm-packages/openclaw/`** (staging uses `npm-packages/openclaw/` during the pack).
- **`docs/runtimes/*.md`** per-runtime install stubs (with non-interactive `--local` / `--global` reminders).
- **`LICENSE`** (MIT).
- **Open source governance**: English `CONTRIBUTING.md`, **Simplified Chinese** `CONTRIBUTING.zh-CN.md`, `SECURITY.md` / `SECURITY.zh-CN.md`, `CODE_OF_CONDUCT.md` / `CODE_OF_CONDUCT.zh-CN.md`, `CHANGELOG.zh-CN.md`, GitHub issue templates, pull request template, and CI workflow.

### Changed

- **CLI install UX:** non-interactive terminals default missing runtime / missing install scope to **global `claude`** with console notices; TTY installs can prompt for Global vs Local unless `--global` / `--local` is passed; `install --help` / `--help` on the install argv prints help without installing.
- **Hooks** and docs now use **`${FRONTEND_CRAFT_ROOT}`** for script paths (installer still expands legacy `${CLAUDE_PLUGIN_ROOT}` for compatibility).
- **Slash commands** now use the collision-resistant **`/fec-*`** prefix: `/fec-init`, `/fec-review`, `/fec-scaffold`. Legacy root commands (`/init`, `/review`, `/scaffold`) and `/frontend-craft:*` command names are no longer published.
- **`commands/fec-init.md`** updated for new template paths.
- **`scripts/sync-codex-agents-toml.ts`** requires **`CODEX_AGENTS_DIR`** (no longer writes into this repo by default).
- **README files** now link to contributing, security, code of conduct, and CI status for international contributors.

### Removed

- Top-level **`templates/rules/`** (moved to `templates/shared/rules/`); **`templates/CLAUDE.md`** / **`templates/settings.json`** moved to **`templates/claude/`**.

## [1.1.0] - 2026-03-18

### Added

- `fec-legacy-to-modern-migration` skill — jQuery/MPA 迁移至 React/Vue 3 + TS 的策略与流程
- `fec-e2e-testing` skill — Playwright/Cypress E2E 测试规范
- `fec-nextjs-project-standard` skill — Next.js 项目规范（App Router、SSR/SSG）
- `fec-nuxt-project-standard` skill — Nuxt 3 项目规范（SSR/SSG）
- `fec-monorepo-project-standard` skill — Monorepo 项目规范
- `rules/fec-ci-cd.md` 模板 — CI/CD 流水线规范
- `rules/fec-refactoring.md` 模板 — 重构项目约束（图片、样式、功能等价）
- CONTRIBUTING.md — 贡献指南
- CHANGELOG.md — 版本变更记录

### Changed

- `testing.md` — 补充 E2E 测试规则
- `fec-architect` agent — 增加 `fec-legacy-to-modern-migration` skill 引用
- `fec-legacy-to-modern-migration` skill — 新增重构实施要求：图片（使用原项目资源、禁止内联 SVG）、样式（参考效果不照搬 CSS、优先 flex、禁止内联样式）、目标（视觉交互一致、功能等价、代码更简洁易维护）

---

## [1.0.0] - 2026-03-18

### Added

- 初始发布
- 5 个 Agents：fec-architect、performance-optimizer、ui-checker、figma-implementer、design-token-mapper
- 9 个 Skills：fec-code-review、fec-security-review、fec-accessibility-check、fec-react-project-standard、fec-vue3-project-standard、fec-implement-from-design、fec-test-and-fix、fec-legacy-web-standard、fec-legacy-to-modern-migration
- 3 个 Commands：init、review、scaffold
- Hooks：SessionStart、PreToolUse、PostToolUse、Stop、Notification
- 11 个规则模板：CLAUDE.md、settings.json、vue、react、design-system、testing、git-conventions、i18n、performance、api-layer、state-management、error-handling、naming-conventions
- MCP 集成：Figma、Sketch、MasterGo、Pixso、墨刀
- 多语言 README：English、简体中文、繁體中文、日本語、한국어
- 报告自动保存为 Markdown 至 `reports/` 目录
