# Project description

This repository is maintained by the front-end team.

Core requirements:

- Understand the existing code before adjusting the architecture
- Prioritize reuse rather than reinventing the wheel
- Keep changes small, clear, and easy to review
- Follow project standards first, then consider common patterns

##Basic project information

<!-- Please modify the following configuration according to the actual situation of the project -->

- Language: TypeScript
- Package manager: pnpm
- Build tool: Vite
- Testing tools: Vitest + Testing Library
- UI system: Prioritize reusing existing component libraries and design tokens
- Design implementation process: If possible, give priority to using the design tool MCP (Figma / MasterGo / Pixso / Mo Knife / Sketch) context

## Common commands

Prioritize using existing commands in the warehouse instead of inventing replacement commands.

<!-- Please modify according to the actual situation of the project -->

- Installation: `pnpm install`
- Development: `pnpm dev`
- Lint：`pnpm lint`
- Type check: `pnpm type-check`
- Test: `pnpm test`
- Build: `pnpm build`

If the command is missing, check `package.json` first.

## General working principles

Before changing the code:

1. Read the target module and its surrounding modules
2. Search for existing reusable components or tool functions
3. Understand the current style and Token convention
4. If there is already a set of patterns in the warehouse, do not introduce a second set

When implemented:

- Keep component responsibilities focused
- Extract duplicate logic to hooks/composables/utils
- Prefer explicit types
- Prioritize the use of deducible state to avoid repeated maintenance of state
- Maintain backwards compatibility unless the mission explicitly requires breaking changes

After completion:

- execute lint
- If there is a type check, execute type check
- If there is a test, execute the test
- Summarize change documents, key decisions and remaining risks

## Git specification

- Must pass lint and type checking before submission
- Don’t commit directly without my confirmation
- Branch naming: feature/xxx, fix/xxx, refactor/xxx
- Commit format: Follow Conventional Commits (see rules/fec-git-conventions.md for details)

## Design draft implementation workflow

When a design context exists:

1. First read the design context through MCP (Figma / MasterGo / Pixso / Ink Knife / Sketch, Mock uses screenshots / annotations)
2. Check the existing component system of the project
3. First produce a short implementation plan
4. Implement in steps
5. Execute the verification command
6. Summarize biases and risks

## Security requirements

Do not actively expose or print any keys.
Do not read or modify sensitive files unless explicitly required by the task and permitted by permissions.
Do not execute destructive shell commands unless explicitly requested and approved.

## Rule import

<!-- Selectively import by project technology stack and delete unnecessary lines -->

@./rules/fec-vue.md
@./rules/fec-react.md
@./rules/fec-design-system.md
@./rules/fec-testing.md
@./rules/fec-git-conventions.md
@./rules/fec-i18n.md
@./rules/fec-performance.md
@./rules/fec-api-layer.md
@./rules/fec-state-management.md
@./rules/fec-error-handling.md
@./rules/fec-naming-conventions.md
@./rules/fec-typescript.md
@./rules/fec-code-comments.md
@./rules/fec-ci-cd.md
@./rules/fec-refactoring.md
@./rules/fec-agent-workflow.md
@./rules/fec-working-modes.md
