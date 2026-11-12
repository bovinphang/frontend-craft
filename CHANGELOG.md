# Changelog

[简体中文](CHANGELOG.zh-CN.md)

## Unreleased

### Changed

- `fec list --json` returns the list of supported runtimes as JSON. `fec setup --json` writes installer diagnostics to stderr.
- `fec doctor` defaults to Claude even when called with options and rejects invalid arguments before cleaning the cache.
- Shared resources now use `@bovinphang/craft-common@2.1.0`. Before switching from 2.0.0, release the old shared-resource references from each installed product. See the [coordinated upgrade guide](docs/cli-management.md).

## [3.0.0] - 2026-11-09

### Shared capabilities

- Added layered engineering guidance and a standalone React state example.
- The pinned `@bovinphang/craft-common@2.0.0` dependency delivers 21 shared entries alongside 53 frontend entries. The shared entries include C/C++ foundations and Tauri/Electron specializations.
- Add shared ownership, exact version/language conflict checks, transactional recovery and read-only migration checks.
- See the [migration guide](docs/common-migration.md) for legacy entries and independent uninstall behavior.

### Breaking changes and migration

- Top-level `fec update` / `upgrade` now upgrades the npm/pnpm global CLI from its original registry, then refreshes managed resources with the new CLI in the current project and user-global scope. It does not scan other projects or manage Marketplace installations.
- Top-level `fec uninstall` / `remove` now removes only the CLI. `--purge` cleans discovered managed resources first while preserving user modifications; cleanup errors keep the CLI installed. Interactive removal requires confirmation; non-interactive removal requires `--yes`.
- Move resource commands to `fec runtime install/update/uninstall [runtime]`, with `runtime upgrade/remove` aliases and existing resource options. `setup` remains available; top-level `install` is a deprecated compatibility alias. Old runtime arguments and resource options on top-level update/uninstall are rejected before changes with migration guidance.
- Replace `fec update codex --global` with `fec runtime update codex --global`, and `fec uninstall --local` with `fec runtime uninstall --local`. For temporary execution, use `npx @bovinphang/frontend-craft@latest runtime update`; `runtime update` uses the running package contents without fetching a new CLI package.

### Added

- Self-update verifies npm/pnpm installation ownership, reuses the original package manager, and supports a read-only `--dry-run`. The CLI refreshes resources even when already current. A CLI upgrade failure stops resource updates. If some resource updates fail, the upgraded CLI stays installed and `fec runtime update` can retry them.
- Temporary npx update checks registry `latest` and never creates a global installation; if the running version differs, it prints the latest-package runtime command. npx self-uninstall is unsupported. Source links, project dependencies, unknown sources and pnpm groups shared with other packages are refused for automatic self-management before changes.

## [2.9.0] - 2026-09-26

### Added

- **Technical diagram tools:** added an optional local Mermaid adapter and reproducible sequence, workflow, and architecture fixtures.
- **Behavior-preserving refactoring subsystem:** added `fec-refactoring-expert`, `/fec-smell`, `/fec-refactor-plan`, `/fec-refactor`, and 11 refactoring skills that separate diagnosis, planning, execution, validation, catalog selection, and seven technique families.
- **Complete refactoring knowledge coverage:** normalized the supplied 24 code smells and 61 refactoring techniques from Chapters 6–12 into stable `SMELL-*` / `RF-*` identifiers, selection guidance, composition relationships, and progressive references.
- **Frontend-specific refactoring adaptation:** added TypeScript, React, Vue, hooks/composables, state, routing, async/lifecycle, public API, SSR/hydration, and dynamic-reference guidance without forcing class-based patterns into modern frontend code.
- **Simplified Chinese refactoring mirror:** added natural Chinese Agent, Command, Skill, catalog, smell matrix, and refactoring navigation content under `localized/zh-CN` and `docs/refactoring`.

### Changed

- **Technical diagram quality:** preserve complete Unicode labels with content-driven layout, obstacle routing, visible self calls, and extended QA.
- Code, TypeScript, and security reviews support the full project by default, specific files or directories, and incremental review for explicit changes, PRs, or commits. Reports record coverage, exclusions, unreviewed scope, and partial completion. Project and targeted reviews work without a Git diff.
- **Refactoring safety model:** pure refactoring now uses `GREEN → REFACTOR → GREEN`, one primary transformation at a time, step-level verification, rollback-before-repair, `SAFE/CAUTION/DANGER` risk classification, diff budgets, and `PASS/PARTIAL/NOT PROVEN` proof verdicts.
- **Workflow boundaries:** clarified that new behavior and behavior-changing defects remain in TDD, unexplained failures remain in debugging, proven dead code remains in `fec-refactor-clean`, and general merge-readiness remains in code review.
- The release includes 14 agents, 56 skills, and 11 commands.
- **Validation hooks:** select npm, pnpm, yarn, or bun from project declarations and lockfiles, and avoid running duplicate validation stages.

### Fixed

- **Technical diagram exports:** repaired self-contained SVG styles, browser-measured PNG geometry, and manifests scaled to the exported image.
- **Content parsing and conversion:** repaired malformed agent/command YAML and stale reviewer references; converters now preserve decoded descriptions and safely escape Codex TOML instructions. Same-name source skills retain priority over converted commands.
- **Published CLI startup:** bundled the YAML parser and its Node module bridge so isolated npm packages can install Codex and OpenClaw content without repository development dependencies.
- Fixed broken links in the refactoring catalog and clarified localized skill summaries.
- **Managed file ownership:** strengthened manifest path validation to prevent install/update operations from claiming paths outside managed content.

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
- The OpenClaw distribution package changes from `@bovinphang/frontend-craft` to `frontend-craft`.

### Fixed

- **OpenClaw README language links:** fixed OpenClaw documentation links so English and Simplified Chinese variants reference `README.openclaw.md` and `README.openclaw.zh-CN.md` instead of the root README pair.
- **Localized update behavior:** updates preserve the previously installed content language from `frontend-craft.manifest.json` when the user does not pass a new `--lang` option.

## [2.7.0] - 2026-06-10

### Added

- **`fec-drawio-studio` skill:** editable draw.io / diagrams.net workflow for technical diagrams, including official shape lookup, brand symbols, Graphviz auto-layout, code structure maps (TS / JS / Go / Python / Rust), validation, export fallback, and an `XML / Mermaid / CSV` URL handoff (`diagram-url --create`) with self-hosted `baseUrl`, lightbox, dark and Windows `.url` shortcut support.
- **`fec-image-generation` skill:** diagrams, charts, posters, UI mockups, infographics, and image-edit workflows, plus `scripts/png-qa.mjs` for PNG visual QA with bounded self-repair (registered in `typecheck:skill-scripts`).
- **`fec-backend-requirements-handoff` skill:** frontend-to-backend handoff for UI data needs, user actions, states, permissions, business rules, uncertainties, and backend discussion points — without dictating implementation.
- **`fec-web-video-presentation` skill:** recordable 16:9 step-driven web presentations from articles, scripts, lessons, and demos, with compact references, starter theme data, and a cross-platform Vite/React scaffold helper.
- **Modular reference docs:** split several monolithic reference files into focused modules — `fec-e2e-testing` (e2e-ci-reporting / e2e-special-scenarios / e2e-visual-regression), `fec-legacy-to-modern-migration` (migration-execution-checklist / migration-strategy-and-mapping), `fec-performance-optimization` (framework-performance-patterns), `fec-react-project-standard` (react-project-structure / react-runtime-patterns / react-quality-patterns / react-performance-patterns), and `fec-vue3-project-standard` (vue3-project-structure / vue3-composables-routing / vue3-state-api-quality / vue3-performance-patterns). Each `SKILL.md` now points at the new focused references.

### Changed

- **Breaking change.** `fec-typescript-type-safety` became `fec-typescript-project-standard`, which covers TypeScript configuration, public API types, declarations, DTOs, and generics. Update custom references to the new skill ID. The original type-safety guidance is available in `references/type-safety.md` within the new skill.
- The renamed TypeScript skill moves into the `project-standard` category.
- The skill catalog grows from 41 to 45 skills.
- `fec-ui-design` now reads product context and provides visual direction, design dials, anti-generic UI guidance, and a visual reference strategy. Design dials include `visualTension`, `motionIntensity`, `informationDensity`, `mediaAuthenticity`, and `contentPersuasion`.
- **`fec-motion-interaction` enhancements:** added context-aware motion-intensity guidance, aligning with `fec-ui-design` design dials.
- **`fec-implement-from-design` enhancements:** added screenshot / section-level visual references alongside the existing Figma / Sketch / MasterGo / Pixso / 墨刀 / 摹客 sources.
- `diagram-lint` rejects XML comments, unescaped ampersands and angle brackets, self-closing edge cells, and missing root or layer cells. It warns when vertex labels lack `html=1`.
- **`fec-legacy-to-modern-migration`, `fec-tailwind-design-system`, `fec-responsive-layout`:** added Playwright-equivalent validation guidance so migration and visual-sensitive tasks build a before/after behavior checklist and pick the validation layer (Playwright / visual diff / typecheck / unit) matched to the change risk.
- **Shared rules slim-down:** `templates/shared/rules/fec-*.md` were condensed to standing project-resident hard constraints. Productized guidance for UI design, Tailwind design systems, responsive layout, TypeScript modeling, error-handling framework internals, and rendering patterns now lives in their dedicated skills instead of being inlined into rules; `fec-i18n.md`, `fec-responsive-design.md`, `fec-typescript.md`, `fec-state-management.md`, `fec-design-system.md`, `fec-rendering-patterns.md`, `fec-error-handling.md`, `fec-ci-cd.md`, and `fec-refactoring.md` were all trimmed.

### Removed

- **`fec-typescript-type-safety` skill directory:** the legacy directory was removed; its content lives in `fec-typescript-project-standard` (`references/type-safety.md`). Update any custom rules, agents, or skills that referenced the old id.

## [2.6.0] - 2026-06-07

### Added

- **`fec-alchemy` skill:** new project absorption workflow that extracts useful ideas from reference systems and redesigns them into original, project-native improvements; ships with `SKILL.md`, intake / absorption-plan templates, and reference docs covering methodology, originality, and licensing.
- **`fec setup all` subcommand:** installs frontend-craft for every supported runtime in one shot, defaulting to the current project unless `--global` is passed; help text now distinguishes the terminal `fec setup` command from the in-assistant `/fec-init` slash command.
- **Skill-pack script minification:** `pack-skills.ts` and `skill-packaging.ts` are now minified with esbuild during build, producing smaller standalone skill packages in `skill-packages/`.
- **Reference docs for key skills:** added dedicated reference documents for `fec-debug-framework`, `fec-performance-optimization`, `fec-refactor-clean`, and `fec-validation-fix`, linked from the localized "详细参考" section of each `SKILL.md`.

### Changed

- `fec-doc-sync` now also covers environment notes, scripts, API and route notes, and deployment documentation.
- The skill taxonomy adds the `project-evolution` category, which includes `fec-alchemy`.
- The skill catalog grows from 40 to 41 skills.
- The terminal project setup command changes from `fec init` / `frontend-craft init` to `fec setup` / `frontend-craft setup`. The in-assistant `/fec-init` command remains available.
- Use `install --all` for scripted installs across all runtimes. Pass `--global` to write to the runtimes’ global configuration.

### Fixed

- The npm package now uses the `@bovinphang/frontend-craft` name. Update installation commands that use the previous scope.

### Removed

- **CLI `init` command:** `init` is no longer accepted as a terminal CLI command and exits with "Unknown command: init"; use `setup` for local project setup.

## [2.5.0] - 2026-06-01

### Added

- **`init` alias and `fec` shortcut:** added `init` as an alias for `install --local` with local-default behavior; exposed `fec` as an additional bin command alongside `frontend-craft` in `package.json`.
- **Uninstall/remove commands:** added `frontend-craft uninstall` and `frontend-craft remove` that remove manifest-managed files; support `--force` to include user-modified files; discover existing manifest installs across runtimes and scopes.
- **Update without runtime:** `frontend-craft update` now supports running without specifying a runtime, refreshing all discovered installs automatically.
- **Manifest root hints:** manifest file tracking now supports root hints (baseDir/cwd/home) for multi-location file management.

### Fixed

- **Runtime install source conflicts:** added detection and interactive resolution when the same runtime is installed from different sources (e.g. marketplace vs CLI); prevents accidental overwrites and guides users through conflict resolution.

## [2.4.0] - 2026-05-29

### Added

- New skills include `fec-performance-optimization` (Core Web Vitals, memory leaks, performance budgets), `fec-source-driven-development` (evidence-based decisions), `fec-state-management`, `fec-typescript-project-standard`, `fec-dependency-upgrade`, `fec-responsive-layout`, and `fec-tailwind-design-system`.
- **6 new skills:** `fec-performance-optimization` (Core Web Vitals, memory leaks, performance budgets), `fec-source-driven-development` (evidence-based decisions with official-docs verification), `fec-state-management` (state architecture patterns), `fec-typescript-project-standard` (TypeScript project standards and type safety), `fec-dependency-upgrade` (upgrade planning), `fec-responsive-layout` (responsive layout strategy), and `fec-tailwind-design-system` (Tailwind-based design system implementation).
- **2 new integration skills:** `fec-api-integration` and `fec-motion-interaction`.
- **UI design system generator:** added `design-system.mjs` generator with product rules, style archetypes, UX quality and Stack UI rules data packages; supports `--persist` and `--page` flags to write `MASTER.md` and page overrides.

### Changed

- **Agent renaming:** renamed 8 agents from `fec-frontend-*` to shorter `fec-*` prefix; replaced `fec-frontend-code-review` skill with `fec-code-review`.
- **Skill consolidation:** merged `fec-interface-polish` and `fec-ui-design-direction` into a unified `fec-ui-design` skill covering both product-level visual direction and detail-level polish.
- **UI design enhancement:** enhanced `fec-ui-design` with design-system generation, Master/Page overrides, chart UX, color rhythm, visual texture, anti-generic polish, and visual identity checks.
- The skill taxonomy grows from four to seven categories.
- `/fec-plan` now handles both implementation planning and test strategy, replacing `/fec-test-plan` for test planning.
- Shared rule templates now use the `fec-` prefix.
- `fec-storybook-component-doc` covers component documentation, design-system presentation, and isolated state previews.

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

### Changed

- **Doctor command:** extended `doctor` report to include Claude cache status when runtime is `claude`.
- CLI install and update reject Marketplace-managed Claude installs, including with `--force`. To switch between local and global CLI installs, update the existing scope or uninstall it before switching.

## [2.3.0] - 2026-05-22

### Added

- Added new workflow capabilities: `fec-tdd-workflow`, `fec-refactor-clean`, `fec-doc-sync`, `/fec-plan`, `/fec-tdd`, `/fec-build-fix`, `/fec-refactor-clean`, `/fec-doc-sync`, plus `fec-build-fixer`, `fec-refactor-cleaner`, and `fec-doc-updater`.
- Added shared rules for agent workflow and working modes, and expanded testing, performance, refactoring, git, and comment rules with TDD, incremental validation, cleanup, and documentation-sync guidance.
- **Update/upgrade commands:** added `frontend-craft update` and `frontend-craft upgrade` with manifest-based file protection, allowing safe in-place updates without overwriting user-modified files.
- The npm package includes smaller compiled JavaScript output.

### Changed

- Enhanced `fec-validation-fix` with incremental build-fix behavior and added cross-platform long-running command guidance in the Node security hook.
- The npm package now ships a bundled CLI and compiled hooks from `dist/`. It no longer includes `dist/src/`.

### Fixed

- **Install mkdir:** skipped `mkdir` when the target directory already exists, preventing unnecessary errors during repeated installs.

## [2.2.1] - 2026-05-21

### Added

- Added Qoder support, bringing the installer to 15 AI coding runtimes.
- **Testing strategy workflow:** added `fec-test-planner`, `/fec-test-plan`, and `fec-testing-strategy` for risk-based frontend test planning across static checks, unit, component, integration, E2E, visual, accessibility, security, and performance layers.
- **New frontend workflow skills:** added `fec-ui-design-direction`, `fec-interface-polish`, and `fec-vite-project-standard`; replaced the former validation workflow with `fec-validation-fix`.
- **Standalone skill publishing pipeline:** added `scripts/pack-skills.ts`, `scripts/check-skills-publish.ts`, shared skill packaging helpers, `npm run pack:skills`, `npm run check:skills-publish`, and `npm run pack:all` for generating and validating one publishable package per skill.
- **CLI diagnostics and metadata checks:** added `frontend-craft matrix`, `frontend-craft doctor <runtime>`, and `frontend-craft sync-metadata --check` to inspect runtime capabilities, installation health, and public metadata consistency.

### Changed

- Skill directories now follow the Agent Skills layout and use the `fec-*` prefix. The release includes 28 skills.
- **Runtime capability model:** introduced explicit per-runtime capability tiers for skills, agents, commands, hooks, rules, templates, MCP, reports, and init behavior so installer output and docs reflect each runtime accurately.
- **Publish artifact layout:** `pack:skills` now writes standalone skill packages to root `skill-packages/` instead of `dist/skill-packages/`, keeping publishable skill packages separate from TypeScript build output.
- `npm run build` clears `dist/` before compilation so stale JavaScript stays out of new packages.

### Fixed

- **Root npm package contents:** tightened the npm `files` manifest so `npm pack` publishes compiled `dist/` runtime JavaScript and plugin assets without leaking TypeScript source directories (`bin/`, `src/`, or `scripts/`).

### Removed

- Removed legacy unprefixed skill directories after migrating them to the `fec-*` layout.

## [2.1.2] - 2026-05-20

### Changed

- The OpenClaw package is renamed from `frontend-craft-openclaw` to `frontend-craft`. The tarball is now written to `npm-packages/openclaw/`.
- The interactive installer replaces numeric choices with arrow-key navigation, Space to toggle, Backspace to remove, search filtering, and pagination.

## [2.1.1] - 2026-05-19

### Added

- **11 new skills**: `fec-data-fetching` (TanStack Query), `fec-form-handling` (React Hook Form + Zod), `fec-browser-storage` (client persistence), `fec-route-protection` (auth/permission routes), `fec-component-testing` (RTL / Vue Test Utils), `fec-storybook-component-doc` (Storybook docs), `fec-list-virtualization` (react-window / TanStack Virtual), `fec-pwa-implementation` (PWA), `fec-web-workers` (Web Worker), `fec-canvas-threejs` (Canvas/Three.js/R3F), `fec-svg-animation` (SVG motion).
- **Shared rules**: `responsive-design.md`, `rendering-patterns.md` — deployed via `/fec-init`.

### Changed

- **Agent behavior (`fec-code-reviewer`):** report-only by default — no longer modifies business files unless explicitly requested.
- **Skill structure**: React, Vue, Next.js, Nuxt, Monorepo, legacy-web, legacy-migration, and implement-from-design skills aligned to a five-section template: Purpose / When to Use / Procedure / Constraints / Expected Output.
- **Scaffold templates**: fixed React CSS import (`import './<Name>.styles.css'` instead of `import styles from ...`); Vue scaffold uses `<slot />` instead of bare component tag.
- The catalog grows from 13 to 24 skills.

## [2.0.1] - 2026-05-14

### Fixed

- **Claude Code plugin hooks:** `hooks/hooks.json` now references bundled scripts with **`${CLAUDE_PLUGIN_ROOT}`**, which Claude Code substitutes for marketplace and `--plugin-dir` loads. **`${FRONTEND_CRAFT_ROOT}`** is not substituted by the runtime and could break hooks on **Windows + Git Bash** (an empty prefix made `/scripts/...` resolve under the Git for Windows installation directory).

## [2.0.0] - 2026-05-14

### Added

- **Universal CLI** `frontend-craft`: `install`, `list`, `version`, `uninstall` (hints); supports runtimes: Claude Code, Codex, Cursor, Windsurf, OpenCode, Kilo, Gemini CLI, Copilot, Antigravity, Augment, Trae, CodeBuddy, Cline, OpenClaw (`src/install/`, `bin/frontend-craft.ts`). Interactive wizard when you run `npx frontend-craft` / `install` with no runtime (TTY), plus `--local` / `-l` for project installs.
- The root npm package requires Node.js 22 or later.
- **`templates/shared/rules`** + **`templates/claude/`** layout; Codex templates under **`templates/codex/`**; OpenClaw templates under **`templates/openclaw/`**.
- The OpenClaw plugin moves into `frontend-craft`. Run `npm run build:openclaw` to build it and `npm run pack:openclaw` to generate `frontend-craft-<version>.tgz` under `npm-packages/openclaw/`.
- **`LICENSE`** (MIT).

### Changed

- In non-interactive mode, missing runtime and scope default to Claude and global installation respectively. In a TTY, the installer prompts for scope when neither `--global` nor `--local` is provided. `install --help`, `-h`, and `help` display usage without installing.
- Hooks use `${FRONTEND_CRAFT_ROOT}` for script paths. The installer still expands `${CLAUDE_PLUGIN_ROOT}` in older configurations.
- **Slash commands** now use the collision-resistant **`/fec-*`** prefix: `/fec-init`, `/fec-review`, `/fec-scaffold`. Legacy root commands (`/init`, `/review`, `/scaffold`) and `/frontend-craft:*` command names are no longer published.
- `/fec-init` uses the new template paths.
- **`scripts/sync-codex-agents-toml.ts`** requires **`CODEX_AGENTS_DIR`** (no longer writes into this repo by default).

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
- 报告自动保存为 Markdown 至 `reports/` 目录
