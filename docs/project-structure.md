# Project Structure

Detailed directory layout for `frontend-craft`.

## Repository Layout

```text
frontend-craft/
|-- .claude-plugin/   # Claude Code plugin + marketplace manifests
|   |-- plugin.json         # Plugin metadata
|   |-- marketplace.json    # Marketplace directory metadata
|
|-- agents/           # Specialized sub-agents for delegation
|   |-- fec-architect.md    # Page splitting, component architecture, state flow
|   |-- fec-code-reviewer.md # Frontend-focused code review (quality, security, a11y)
|   |-- fec-security-reviewer.md # Frontend attack surface: XSS, secrets, CSP, deps
|   |-- fec-test-planner.md # Testing strategy, risk matrix, coverage planning
|   |-- fec-debugger.md # Complex build/runtime/UI/API diagnostics
|   |-- fec-refactor-cleaner.md # Dead-code and unused dependency cleanup
|   |-- fec-doc-updater.md # README/runtime docs/capability table synchronization
|   |-- fec-e2e-runner.md     # E2E authoring, execution, flaky handling, artifacts, CI
|   |-- fec-typescript-reviewer.md    # TS/JS type safety, async, security, report-only review
|   |-- fec-performance-optimizer.md # Performance bottleneck analysis and optimization
|   |-- fec-ui-checker.md            # UI visual issues, design fidelity evaluation
|   |-- fec-figma-implementer.md     # Precise UI implementation from design
|   |-- fec-design-token-mapper.md   # Map design variables to Design Tokens
|
|-- skills/           # Workflow definitions and domain knowledge
|   |-- fec-code-review/    # Architecture, types, rendering, styles, a11y
|   |-- fec-security-review/     # XSS, CSRF, sensitive data, input validation
|   |-- fec-accessibility-check/     # WCAG 2.2 accessibility, keyboard, focus, screen readers
|   |-- fec-react-project-standard/  # React + TypeScript project standards
|   |-- fec-vue3-project-standard/   # Vue 3 + TypeScript project standards
|   |-- fec-implement-from-design/   # Implement UI from design tools, screenshots, and visual references
|   |-- fec-validation-fix/            # lint, type-check, test, build and fix
|   |-- fec-performance-optimization/  # Core Web Vitals, bundle, rendering, network, memory
|   |-- fec-source-driven-development/ # Official sources, project facts, version-sensitive decisions
|   |-- fec-typescript-project-standard/   # TypeScript config, public API types, declarations, DTOs, generics
|   |-- fec-state-management/         # State ownership, store selection, URL/server/form/local boundaries
|   |-- fec-tailwind-design-system/   # Tailwind tokens, variants, dark mode, class governance
|   |-- fec-responsive-layout/        # Mobile-first layouts, container queries, touch-safe responsive UI
|   |-- fec-dependency-upgrade/       # Dependency upgrades, lockfile risk, CVE remediation
|   |-- fec-tdd-workflow/              # Test-first frontend implementation workflow
|   |-- fec-refactor-clean/            # Safe dead-code and unused dependency cleanup
|   |-- fec-doc-sync/                  # Public docs and metadata synchronization
|   |-- fec-legacy-web-standard/     # JS + jQuery + HTML legacy project standards
|   |-- fec-legacy-to-modern-migration/ # jQuery/MPA migration to React/Vue strategy and workflow
|   |-- fec-testing-strategy/          # Testing layer selection and coverage matrix
|   |-- fec-e2e-testing/                # Playwright/Cypress E2E testing standards
|   |-- fec-nextjs-project-standard/    # Next.js 14+ App Router, SSR/SSG standards
|   |-- fec-nuxt-project-standard/      # Nuxt 3 SSR/SSG, composables standards
|   |-- fec-monorepo-project-standard/  # pnpm workspace, Turborepo, Nx standards
|   |-- fec-data-fetching/              # TanStack Query and server-state workflows
|   |-- fec-api-integration/            # Typed API clients, auth refresh, uploads, realtime integration
|   |-- fec-backend-requirements-handoff/ # Frontend-to-backend UI data and state needs
|   |-- fec-form-handling/              # React Hook Form + Zod form workflows
|   |-- fec-route-protection/           # Authenticated and permissioned routes
|   |-- fec-component-testing/          # RTL / Vue Test Utils component tests
|   |-- fec-pwa-implementation/         # PWA manifest, service worker, offline
|   |-- fec-web-workers/                # Worker integration and background compute
|   |-- fec-canvas-threejs/             # Canvas, Three.js, React Three Fiber
|   |-- fec-svg-animation/              # SVG motion and reduced-motion fallbacks
|   |-- fec-browser-storage/            # localStorage/sessionStorage/IndexedDB/Cookies selection and safe client persistence
|   |-- fec-list-virtualization/        # Large-list windowing with react-window / TanStack Virtual and measurement strategies
|   |-- fec-storybook-component-doc/    # Storybook component docs, addons, MDX, interaction and visual test integration
|   |-- fec-ui-design/                  # Product-context UI direction, design dials, media strategy, visual QA
|   |-- fec-image-generation/           # Diagram/image generation, editing workflows, PNG QA and repair loops
|   |-- fec-drawio-studio/             # Editable draw.io diagrams, shape lookup, auto-layout, code structure maps
|   |-- fec-web-video-presentation/    # Recordable 16:9 step-driven web video presentations
|   |-- fec-motion-interaction/         # Context-aware motion intensity, transitions, scroll animation, reduced motion
|   |-- fec-vite-project-standard/      # Vite config, env safety, HMR, proxy, build and library mode
|
|-- commands/         # Slash commands for quick execution
|   |-- fec-init.md     # /fec-init - Initialize project templates
|   |-- fec-review.md   # /fec-review - Code review
|   |-- fec-scaffold.md # /fec-scaffold - Create page/feature/component
|   |-- fec-plan.md     # /fec-plan - Implementation planning before frontend changes
|   |-- fec-tdd.md      # /fec-tdd - Test-driven frontend implementation
|   |-- fec-debug.md    # /fec-debug - Diagnose and fix frontend failures
|   |-- fec-refactor-clean.md # /fec-refactor-clean - Safe dead-code cleanup
|   |-- fec-doc-sync.md # /fec-doc-sync - Public docs and metadata sync
|
|-- hooks/            # Event-driven automation
|   |-- hooks.json     # PreToolUse, PostToolUse, Stop, Notification, etc.
|
|-- src/              # TypeScript source for published runtime code
|   |-- hooks/         # Runtime hook scripts bundled to dist/hooks
|   |-- security-check.ts      # Block dangerous commands
|   |-- format-changed-file.ts # Auto Prettier formatting
|   |-- run-tests.ts           # Run checks on session end
|   |-- session-start.ts       # Detect framework on session start
|   |-- notify.ts              # Cross-platform desktop notifications
|   |-- install/       # Installer core (CLI, interactive wizard, runtime converters)
|   |-- openclaw/      # OpenClaw runtime TypeScript source
|
|-- scripts/          # Source-run repository maintenance scripts, not published to npm
|
|-- templates/        # Runtime-specific project templates
|   |-- claude/        # CLAUDE.md and settings.json
|   |-- codex/         # AGENTS.md and config.toml
|   |-- openclaw/      # AGENTS.md and OPENCLAW-CONFIG.md
|   |-- shared/rules/  # 20 rule files: vue, react, rendering patterns, responsive design, testing, source-driven development, etc.
|
|-- .mcp.json         # MCP server config (Figma, Figma Desktop, Sketch, MasterGo, Pixso, 墨刀)
└-- README.md
```

## Directory Responsibilities

| Directory       | Purpose                                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| `agents/`       | Specialized sub-agent definitions (Markdown + YAML frontmatter)                                                       |
| `bin/`          | CLI entry point (`frontend-craft.ts`)                                                                                 |
| `commands/`     | Custom slash commands (`fec-init`, `fec-review`, `fec-scaffold`, workflow commands)                                   |
| `docs/`         | Runtime installation docs and localized READMEs                                                                       |
| `hooks/`        | Hook configuration (`hooks.json`)                                                                                     |
| `scripts/`      | Source-run maintenance scripts (build, packaging, publishing checks, metadata sync), excluded from npm runtime output |
| `skills/`       | Skill definitions (`SKILL.md`, `metadata.json`)                                                                       |
| `src/hooks/`    | Runtime hook source bundled into `dist/hooks/` for Claude/Qoder execution                                             |
| `src/install/`  | Installer core (CLI, interactive wizard, runtime converters)                                                          |
| `src/openclaw/` | OpenClaw runtime TypeScript source                                                                                    |
| `templates/`    | Runtime-specific project templates (Claude/Codex/OpenClaw configs + shared rules)                                     |
| `tests/`        | Test suite (converter tests, installer tests)                                                                         |
