# Example Prompts

Use these prompts after installing `frontend-craft` in any supported runtime. You do not need to memorize internal skill, command, or agent names; describe the outcome you want and include useful context such as file paths, framework, failing commands, design links, or acceptance criteria.

Each example follows the same shape:

- **Scenario**: when to use it.
- **Prompt**: text you can paste or adapt.
- **Best for**: the `frontend-craft` capability most likely to help.
- **Expected output**: what the assistant should produce.
- **Notes**: extra context that improves the result.

## Getting Started

| Scenario | Prompt | Best for | Expected output | Notes |
| --- | --- | --- | --- | --- |
| Initialize project rules | "Initialize this repository with the frontend-craft project templates for my current runtime. Ask before overwriting existing files." | `/fec-init` | Runtime config, rules, and project guidance installed or a clear overwrite plan. | Works best from the target project root. |
| Pick a runtime install path | "I want to use frontend-craft with Codex and Claude Code on this machine. Explain whether I should install locally or globally, then show the exact commands." | runtime docs | A short recommendation and install commands. | Mention team/shared vs personal use. |
| Learn how to ask | "Show me five frontend-craft prompts for reviewing, building, testing, debugging, and design-to-code work in this repo." | docs guidance | A short prompt set tailored to the detected project. | Good first prompt after install. |
| Confirm available capabilities | "Inspect this repo and summarize which frontend-craft commands, skills, agents, hooks, and MCP templates are available." | `fec-doc-sync`, runtime docs | Capability summary grounded in installed files. | Useful after upgrades. |

## Review And Quality

| Scenario | Prompt | Best for | Expected output | Notes |
| --- | --- | --- | --- | --- |
| Review recent changes | "Review my recent changes before merge. Focus on architecture, type safety, rendering behavior, styles, accessibility, and missing tests. Put findings first." | `fec-code-review`, `fec-code-reviewer`, `/fec-review` | Severity-ordered review with file references and test gaps. | Add branch or diff range if needed. |
| PR readiness review | "Review `src/features/checkout/` as if this is a PR. Call out blockers, risky assumptions, and what must be tested before merge." | `fec-code-reviewer` | Merge readiness assessment and structured report. | Include PR link if the runtime can access it. |
| TypeScript专项 review | "Audit the changed `.ts` and `.tsx` files for unsafe types, async bugs, over-wide interfaces, stale derived state, and non-idiomatic React/TypeScript." | `fec-typescript-reviewer` | TypeScript-focused findings, usually report-only. | Best when JS/TS changes dominate. |
| Security review | "Audit `src/lib/auth.ts`, API clients, and any user HTML rendering for XSS, token leakage, unsafe storage, CSRF assumptions, and dangerous DOM APIs." | `fec-security-review`, `fec-security-reviewer` | Security findings ranked by severity with concrete fixes. | Include auth model and storage constraints. |
| Accessibility review | "Check `src/components/ConfirmDialog.tsx` for focus trapping, keyboard flow, labels, ARIA usage, screen-reader behavior, and WCAG 2.1 AA issues." | `fec-accessibility-check` | A11y findings and implementation guidance. | Provide screenshots for visual focus issues. |
| Performance review | "Analyze dashboard performance: bundle size, render hotspots, unnecessary re-renders, data waterfalls, and expensive client work." | `fec-performance-optimizer` | Bottleneck list and targeted optimization plan. | Include profiles or slow user flow if available. |
| UI fidelity review | "Compare the implemented settings page against the supplied screenshot/design link and list layout, spacing, typography, state, and responsive mismatches." | `fec-ui-checker` | UI fidelity report with actionable fixes. | Attach screenshot or design source. |

## Planning And Architecture

| Scenario | Prompt | Best for | Expected output | Notes |
| --- | --- | --- | --- | --- |
| Plan a feature | "Before coding, plan the account billing feature: route structure, component boundaries, data flow, states, validation, tests, and rollout risks." | `/fec-plan`, `fec-architect` | Architecture proposal and implementation plan. | Give acceptance criteria and constraints. |
| Split a complex page | "Refactor `src/pages/Dashboard.tsx` on paper first. Propose component boundaries, hooks, state ownership, and a safe step-by-step migration." | `fec-architect`, `fec-refactor-clean` | Refactor plan with risk controls. | Ask for no code changes if you only want planning. |
| Test strategy | "For the checkout rewrite, map risks to static checks, unit tests, component tests, E2E, visual checks, accessibility, and security coverage." | `/fec-test-plan`, `fec-testing-strategy`, `fec-test-planner` | Testing matrix and priority order. | Useful before a large implementation. |
| Legacy migration | "We have a jQuery multi-page app in `public/js/legacy/`. Create a phased plan to migrate to React + TypeScript without stopping feature work." | `fec-legacy-to-modern-migration` | Migration plan, risks, milestones, compatibility strategy. | Include release cadence and legacy constraints. |

## Implementation

| Scenario | Prompt | Best for | Expected output | Notes |
| --- | --- | --- | --- | --- |
| React feature | "Build a React + TypeScript user detail page that follows this repo's component, hook, route, state, and API patterns." | `fec-react-project-standard` | Code aligned with local React conventions. | Include target route and API shape. |
| Vue 3 feature | "Implement `Settings.vue` using Vue 3 + TypeScript conventions, Composition API, Pinia where appropriate, and existing composables." | `fec-vue3-project-standard` | Vue code matching project patterns. | Mention SSR/client-only constraints if relevant. |
| Next.js App Router | "Review and improve `app/(dashboard)/reports/page.tsx` for App Router data fetching, metadata, loading/error states, server/client boundaries, and actions." | `fec-nextjs-project-standard` | Next.js-specific findings or code changes. | Include route segment behavior. |
| Nuxt 3 page | "Build the admin reports page in Nuxt 3 with correct SSR behavior, `useFetch`/composables, middleware, and typed server routes." | `fec-nuxt-project-standard` | Nuxt implementation following conventions. | State whether route is SSR, SSG, or SPA. |
| Vite config | "Audit `vite.config.ts` for HMR, env variable exposure, dev proxy, build output, dependency pre-bundling, and plugin ordering." | `fec-vite-project-standard` | Vite config findings and safe edits. | Include build or dev-server symptoms. |
| Monorepo boundaries | "Check `apps/web` and `packages/ui` for package boundaries, workspace dependencies, build scripts, and Turborepo/Nx task graph issues." | `fec-monorepo-project-standard` | Boundary and task orchestration review. | Include package manager and workspace files. |
| Server-state data | "Review `src/queries/useReports.ts`: query keys, cache lifetime, invalidation, optimistic updates, error states, and suspense/loading behavior." | `fec-data-fetching` | TanStack Query/server-state guidance or implementation. | Include API volatility and UX expectations. |
| API integration | "Design a typed API integration layer for checkout: client boundaries, error mapping, auth refresh, upload strategy, and whether order updates should use polling, SSE, or WebSocket." | `fec-api-integration` | API client strategy or implementation with failure states and integration checks. | Include backend ownership, auth model, and endpoint contracts. |
| Complex form | "Build a multi-step registration form with React Hook Form + Zod, file upload, conditional fields, async validation, and accessible errors." | `fec-form-handling` | Typed form implementation and tests if requested. | Include final payload contract. |
| Route protection | "Add role-based protection for `/admin`: redirect anonymous users, deny unauthorized roles, preserve return URL, and avoid flashing protected content." | `fec-route-protection` | Auth guard/middleware implementation. | Explain auth source and roles. |
| Browser storage | "Choose and implement safe client persistence for draft checkout data. Compare localStorage, sessionStorage, IndexedDB, and cookies for this use case." | `fec-browser-storage` | Storage recommendation and implementation. | Mention sensitive fields and retention rules. |
| Large list | "`ProductList` renders 20,000 rows and scrolls poorly. Add virtualization and keep keyboard navigation and dynamic row heights working." | `fec-list-virtualization` | Virtualized list implementation and performance notes. | Provide UI library constraints. |
| PWA | "Turn this app into an installable PWA with manifest, icons, service worker, offline fallback, cache strategy, and update prompt." | `fec-pwa-implementation` | PWA implementation and validation steps. | State whether auth/payment routes must be network-only. |
| Web Worker | "Move image processing off the main thread using a Web Worker and Comlink, with progress updates and cancellation." | `fec-web-workers` | Worker integration and typed messaging. | Mention browser support and file size limits. |
| Canvas/Three.js | "Add a WebGL shader background or Three.js product viewer with responsive sizing, WebGL2/shader error checks, accessible fallback, performance safeguards, and verification that the canvas renders." | `fec-canvas-threejs` | 3D/canvas/shader implementation and visual verification. | Include assets, shader requirements, and interaction constraints. |
| SVG animation | "Add reduced-motion-aware SVG micro-interactions to the hero illustration using the animation library already used in the app." | `fec-svg-animation` | SVG animation with fallback behavior. | Include motion constraints and target browsers. |

## UI And Design

| Scenario | Prompt | Best for | Expected output | Notes |
| --- | --- | --- | --- | --- |
| Design-to-code | "Implement the UI from Figma node `123:456`. Use existing design tokens and components, match spacing and responsive states, and document assumptions." | `fec-implement-from-design`, `fec-figma-implementer` | UI code plus design implementation notes/report. | Works best with MCP credentials configured. |
| Screenshot-to-polish | "Polish this dashboard UI so it feels like a production SaaS tool: density, hierarchy, empty/loading/error states, responsive layout, and interaction states." | `fec-ui-design` | UI improvements and visual QA notes. | Provide screenshot or local URL if possible. |
| Product-specific direction | "Create a product-specific design direction for a healthcare analytics dashboard: primary user tasks, visual anchor, information density, chart language, color roles, typography mood, and anti-patterns to avoid." | `fec-ui-design`, `fec-performance-optimizer` | Design direction, dashboard structure, chart UX guidance, and QA focus. | Include audience, data types, and whether data is real-time. |
| Design system generation | "Generate a design system direction for a premium booking app. Define semantic color roles, type scale, spacing/radius rules, component tone, motion principles, and what should be intentionally avoided." | `fec-ui-design`, `fec-design-token-mapper` | Product-aware design system proposal and token guidance. | Mention product category, brand tone, and target stack. |
| Master/Page overrides | "Before polishing checkout, read `design-system/Acme/MASTER.md` and check for `design-system/Acme/pages/checkout.md`. Apply page overrides only where they differ from the master system." | `fec-ui-design` | Page-level polish aligned to persistent design-system rules. | Use when a project keeps design decisions in repo docs. |
| Landing page direction | "Design a landing page direction for a B2B developer tool: first-screen hierarchy, proof points, product evidence, CTA placement, responsive sections, and a distinctive visual anchor that is not a generic gradient hero." | `fec-ui-design` | Landing structure, visual hierarchy, conversion flow, and anti-generic guidance. | Include offer, audience, and conversion goal. |
| Analytics dashboard UX | "Improve this operations dashboard for scanning under pressure: table/chart balance, real-time status, alert priority, drill-down paths, empty/error states, and responsive density." | `fec-ui-design`, `fec-accessibility-check` | Dashboard UX recommendations or UI changes with state coverage. | Include screenshots, sample data, or the local route. |
| Mobile commerce UI | "Design a mobile e-commerce product browsing flow with touch-safe controls, bottom navigation, filter/sort ergonomics, product media, loading/empty states, and checkout entry points." | `fec-ui-design`, `fec-accessibility-check` | Mobile UI direction, interaction states, and responsive constraints. | State whether this is mobile web or native-like web UI. |
| Fintech interface polish | "Polish this banking interface so it feels trustworthy and calm: balance visibility, transaction hierarchy, risk states, contrast, focus behavior, and restrained motion." | `fec-ui-design`, `fec-security-review` | Fintech-appropriate UI polish and risk-state guidance. | Include compliance or masking requirements if any. |
| Portfolio visual identity | "Create a distinctive portfolio direction for a designer/developer: project storytelling, navigation rhythm, case-study layout, media treatment, typography personality, and reduced-motion fallback." | `fec-ui-design`, `fec-svg-animation` | Portfolio UI direction and interaction guidance. | Provide personal brand tone and example projects. |
| Interaction motion | "Plan the motion system for this product page: Framer Motion vs GSAP choices, page transitions, scroll animation, reduced-motion fallback, lazy loading, and performance budgets." | `fec-motion-interaction`, `fec-ui-design` | Motion direction, tool choices, accessibility fallback, and verification checklist. | Include brand tone, device constraints, and whether motion is decorative or functional. |
| Anti-generic UI review | "Review this page for generic AI-app patterns: overused purple gradients, stacked cards, vague hero copy, weak product evidence, one-note color, and missing interaction states." | `fec-ui-design` | Anti-pattern findings and concrete replacement direction. | Works well with a screenshot or local URL. |
| Pre-delivery UI QA | "Run a pre-delivery UI QA pass across 375px, 768px, and 1440px: text overflow, focus rings, hover/active/disabled states, reduced motion, loading/empty/error states, and visual consistency." | `fec-ui-design`, `fec-accessibility-check` | UI QA checklist, findings, and fix recommendations. | Best near the end of implementation. |
| Design token mapping | "Map Figma variables for color, type, spacing, radius, and shadow into this repo's design token structure without breaking existing components." | `fec-design-token-mapper` | Token mapping proposal or code changes. | Include token naming rules. |
| Storybook docs | "Set up Storybook docs for `packages/ui/Button` and `Dialog`: MDX, states, accessibility addon, interaction tests, and visual baselines." | `fec-storybook-component-doc` | Storybook stories/docs and test guidance. | Include current Storybook status. |

## Testing

| Scenario | Prompt | Best for | Expected output | Notes |
| --- | --- | --- | --- | --- |
| TDD implementation | "Use TDD to add coupon validation to checkout: write failing tests first, implement the minimum code, refactor, and keep the test list visible." | `/fec-tdd`, `fec-tdd-workflow` | Red-green-refactor loop with tests and code. | Best for contained behavior changes. |
| Component tests | "Write React Testing Library tests for `UserCard`: rendering, loading/error states, user-event interactions, accessibility assertions, and regression cases." | `fec-component-testing` | Component tests following local conventions. | Vue projects should ask for Vue Test Utils instead. |
| E2E smoke test | "Add Playwright smoke tests for login and checkout. Use Page Objects, stable selectors, CI-friendly retries, and trace artifacts on failure." | `fec-e2e-testing`, `fec-e2e-runner` | E2E tests, runner guidance, and summary report. | Include test account or mock strategy. |
| Flaky E2E diagnosis | "The checkout E2E test is flaky in CI. Analyze likely timing, network, storage, and selector issues, then stabilize it without hiding failures." | `fec-e2e-testing`, `fec-e2e-runner` | Root-cause analysis and targeted fix. | Include CI logs or traces. |

## Maintenance

| Scenario | Prompt | Best for | Expected output | Notes |
| --- | --- | --- | --- | --- |
| Build failure repair | "`pnpm lint`, `pnpm typecheck`, and `pnpm test` are failing. Fix them incrementally without weakening rules or skipping tests." | `/fec-build-fix`, `fec-validation-fix`, `fec-build-fixer` | Minimal fixes and validation report. | Paste exact failing commands. |
| Dead-code cleanup | "Find and safely remove unused exports, dead routes, stale styles, and unused dependencies. Preserve public API and write a report." | `/fec-refactor-clean`, `fec-refactor-clean`, `fec-refactor-cleaner` | Cleanup plan/changes and report. | Good before releases. |
| Documentation sync | "Update public docs so README, runtime docs, capability tables, and metadata match the current commands, skills, agents, hooks, and package files." | `/fec-doc-sync`, `fec-doc-sync`, `fec-doc-updater` | Synchronized docs and verification notes. | Avoid copying temporary reports into docs. |
| Legacy maintenance | "Improve `public/js/legacy/cart.js` while keeping the current jQuery/MPA stack. Reduce risk, improve structure, and do not rewrite it to React yet." | `fec-legacy-web-standard` | Safe legacy maintenance changes or recommendations. | Mention browser support constraints. |

## Power-User Prompts

Use these when you know the internal entry point you want.

| Scenario | Prompt | Best for | Expected output | Notes |
| --- | --- | --- | --- | --- |
| Slash command review | "`/fec-review` Review the last commit and write `reports/code-review-*.md` with severity, evidence, and merge recommendation." | `/fec-review` | Structured code-review report. | Claude-style runtimes expose slash commands directly. |
| Slash command plan | "`/fec-plan` Plan the dashboard analytics feature before implementation. Include component boundaries, data flow, states, tests, and risks." | `/fec-plan` | Architecture proposal. | Use before complex work. |
| Slash command scaffold | "`/fec-scaffold page UserDetail` Create the standard page structure for a user detail view following this repo's conventions." | `/fec-scaffold` | Page/feature/component scaffold. | Confirm overwrite behavior if files exist. |
| Slash command test plan | "`/fec-test-plan` Build a risk-based test plan for the billing refactor." | `/fec-test-plan` | Test matrix and priority order. | Can be report-only. |
| Slash command TDD | "`/fec-tdd` Add password strength validation with failing tests first, then implementation." | `/fec-tdd` | TDD loop and validated change. | Keep scope small. |
| Slash command build fix | "`/fec-build-fix` Fix the failing validation commands from this log: <paste log>." | `/fec-build-fix` | Incremental validation fixes. | Paste exact logs. |
| Slash command cleanup | "`/fec-refactor-clean` Safely remove unused exports and dependencies from this package." | `/fec-refactor-clean` | Cleanup report and safe edits. | Run tests after. |
| Slash command docs | "`/fec-doc-sync` Sync README, runtime docs, and metadata with the current package contents." | `/fec-doc-sync` | Docs updates and verification. | Use before releases. |
| Explicit agent | "Delegate to `fec-code-reviewer` for a PR-style review of `src/features/payments/`, then summarize blockers first." | agent dispatch | Specialized agent report and summary. | Best for focused expert review. |
