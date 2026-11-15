# Configuration and reports

[简体中文](zh-CN/configuration.md) · [Documentation](README.md)

Configure resources for the selected host. Claude and Qoder CLI adapters provide hooks. The native OpenClaw plugin uses separate typed hooks. Configure design-tool connections in the host when using Codex.

## Prerequisites

- **Node.js 22+**
- **npm, pnpm, or yarn**
- **Git Bash or a compatible shell** (Windows only, when your AI runtime invokes shell-based commands)

## MCP design-tool tokens

Set the environment variable for whichever design tool your team uses:

| Variable | Configuration use |
| --- | --- |
| `FIGMA_API_KEY` | Credential placeholder for Figma and Figma Desktop |
| `SKETCH_API_KEY` | Sketch service credential |
| `MG_MCP_TOKEN` | MasterGo service token argument |
| `MODAO_TOKEN` | 墨刀 service credential |

> **Pixso** uses a local MCP server — enable MCP in the Pixso client, no env var needed.
> **摹客** has no MCP integration; works via screenshots and exported CSS.

Add to your shell config for persistence:

```bash
# macOS / Linux — append to ~/.bashrc or ~/.zshrc
export FIGMA_API_KEY="your-figma-api-key"
export SKETCH_API_KEY="your-sketch-api-key"
export MG_MCP_TOKEN="your-mastergo-token"
export MODAO_TOKEN="your-modao-token"
```

```powershell
# Windows — set as system environment variables, or in PowerShell:
$env:FIGMA_API_KEY = "your-figma-api-key"
$env:SKETCH_API_KEY = "your-sketch-api-key"
$env:MG_MCP_TOKEN = "your-mastergo-token"
$env:MODAO_TOKEN = "your-modao-token"
```

Environment mappings follow the source `.mcp.json`. Pixso uses the HTTP endpoint `http://localhost:3667/mcp`. Start the design-tool service and verify the connection in the assistant before running tasks that require design context.

## Hooks (event-driven)

The following table describes Claude events. Qoder uses adapter-generated event mappings. See the [runtime guides](runtimes/) for installed paths and the [native OpenClaw guide](../README.openclaw.md) for its configuration.

Hooks run automatically on AI assistant events — no invocation needed.

| Event                     | Behavior                                                       |
| ------------------------- | -------------------------------------------------------------- |
| `SessionStart`            | Clean Claude cache, then detect project framework and package manager |
| `PreToolUse(Bash)`        | Block dangerous commands (`rm -rf`, force push, etc.)          |
| `PostToolUse(Write/Edit)` | Auto-format modified files with Prettier                       |
| `Stop`                    | Run available validation scripts once, report failures, and block only when configured |
| `Notification`            | Cross-platform desktop notifications (macOS / Linux / Windows) |

Stop validation is advisory by default: failures are reported without blocking the session. Set `FRONTEND_CRAFT_VALIDATION_MODE=blocking` to return a failure status. The hook uses `packageManager` from `package.json` when present, otherwise a single lockfile; conflicting lockfiles default to npm.

## MCP integration

Plug your AI assistant into design tools for design-to-code workflows with richer design context.

| Service           | Capabilities                                         |
| ----------------- | ---------------------------------------------------- |
| **Figma**         | Read design context and variable definitions         |
| **Figma Desktop** | Figma desktop client integration                     |
| **Sketch**        | Read design selection screenshots                    |
| **MasterGo**      | Read DSL structure, component hierarchy, styles      |
| **Pixso**         | Local MCP: frame data, code snippets, image assets   |
| **墨刀**          | Prototype data, design descriptions, HTML import     |
| **摹客**          | Screenshot/annotation/exported-CSS workflow (no MCP) |

## Project templates (`/fec-init`)

In Claude Code, run `/fec-init` to prepare the project templates below. Other hosts use their runtime-specific templates.

<details>
<summary>Click to see all 22 template files</summary>

| File                                     | Purpose                                                               |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `CLAUDE.md`                              | Project description, commands, working principles, security           |
| `settings.json`                          | Permission whitelist/blacklist, environment variables                 |
| `rules/fec-vue.md`                       | Vue 3 component standards and anti-patterns                           |
| `rules/fec-react.md`                     | React component standards and anti-patterns                           |
| `rules/fec-typescript.md` | TypeScript types, contracts and safety conventions |
| `rules/fec-design-system.md`             | Design system, tokens, accessibility                                  |
| `rules/fec-testing.md`                   | Testing and validation rules                                          |
| `rules/fec-git-conventions.md`           | Conventional Commits                                                  |
| `rules/fec-i18n.md`                      | Internationalization copy standards                                   |
| `rules/fec-performance.md`               | Frontend performance rules                                            |
| `rules/fec-rendering-patterns.md`        | Rendering lifecycle, hydration, SSR/CSR, and update patterns          |
| `rules/fec-responsive-design.md`         | Responsive layout, breakpoints, touch targets, and viewport behavior  |
| `rules/fec-source-driven-development.md` | Source-driven decisions, official docs, version-sensitive assumptions |
| `rules/fec-api-layer.md`                 | API layer typing and error handling                                   |
| `rules/fec-state-management.md`          | State classification, strategy, anti-patterns                         |
| `rules/fec-error-handling.md`            | Error layering, Error Boundary, fallback UI, reporting                |
| `rules/fec-naming-conventions.md`        | Unified naming for files, components, variables, routes, API, CSS     |
| `rules/fec-code-comments.md`             | When and how to write frontend comments                               |
| `rules/fec-ci-cd.md`                     | CI/CD pipeline stages, GitHub Actions / GitLab CI, secrets            |
| `rules/fec-refactoring.md`               | Refactoring constraints and feature-parity requirements               |
| `rules/fec-agent-workflow.md`            | Agent collaboration boundaries and delegation                         |
| `rules/fec-working-modes.md`             | Research, planning, development, review, finishing modes              |

</details>

## Reports

Review and analysis workflows write reports under `reports/` according to the conventions below. Reports record findings, scope and verification for later review.

<details>
<summary>Click to see all 19 report types</summary>

| Report type            | Filename pattern                             | Produced by                                                         |
| ---------------------- | -------------------------------------------- | ------------------------------------------------------------------- |
| Code review            | `code-review-YYYY-MM-DD-HHmmss.md`           | `/fec-review`, `fec-code-review`, `fec-code-reviewer`               |
| Debug diagnostics      | `debug-YYYY-MM-DD-HHmmss.md`                 | `/fec-debug`, `fec-debug-framework`, `fec-debugger`                 |
| TypeScript / JS review | `typescript-review-YYYY-MM-DD-HHmmss.md`     | `fec-typescript-reviewer`                                           |
| Security review        | `security-review-YYYY-MM-DD-HHmmss.md`       | `fec-security-review`, `fec-security-reviewer`                      |
| Accessibility          | `accessibility-review-YYYY-MM-DD-HHmmss.md`  | `fec-accessibility-check`                                           |
| Performance            | `performance-review-YYYY-MM-DD-HHmmss.md`    | `fec-performance-optimizer`                                         |
| Architecture           | `architecture-proposal-YYYY-MM-DD-HHmmss.md` | `fec-architect`                                                     |
| Design fidelity        | `ui-fidelity-review-YYYY-MM-DD-HHmmss.md`    | `fec-ui-checker`                                                    |
| Design implementation  | `design-implementation-YYYY-MM-DD-HHmmss.md` | `fec-figma-implementer`                                             |
| Token mapping          | `token-mapping-YYYY-MM-DD-HHmmss.md`         | `fec-design-token-mapper`                                           |
| Design plan            | `design-plan-YYYY-MM-DD-HHmmss.md`           | `fec-implement-from-design`                                         |
| Test plan              | `test-plan-YYYY-MM-DD-HHmmss.md`             | `/fec-plan`, `fec-testing-strategy`, `fec-test-planner`             |
| Validation fix         | `validation-fix-YYYY-MM-DD-HHmmss.md`        | `fec-validation-fix`                                                |
| Refactor clean         | `refactor-clean-YYYY-MM-DD-HHmmss.md`        | `/fec-refactor-clean`, `fec-refactor-clean`, `fec-refactor-cleaner` |
| Smell diagnosis       | `refactoring/smell-YYYY-MM-DD-HHmmss.md`     | `/fec-smell`, `fec-code-smells`                                  |
| Refactoring plan      | `refactoring/plan-YYYY-MM-DD-HHmmss.md`      | `/fec-refactor-plan`, `fec-refactoring`                           |
| Refactoring execution | `refactoring/refactoring-YYYY-MM-DD-HHmmss.md` | `/fec-refactor`, `fec-refactoring`, `fec-refactoring-expert`    |
| E2E run summary        | `e2e-summary-YYYY-MM-DD-HHmmss.md`           | `fec-e2e-runner` (optional)                                         |
| Migration plan         | `migration-plan-YYYY-MM-DD-HHmmss.md`        | `fec-legacy-to-modern-migration`                                    |

</details>

> **Tip:** add `reports/` to `.gitignore` to keep the auto-generated reports out of version control — or commit them to preserve a team review history.
