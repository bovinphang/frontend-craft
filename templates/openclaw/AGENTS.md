# Project description

This workspace is maintained by the frontend team (initialized by the **frontend-craft** OpenClaw plugin template).

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
- Commit format: Follow Conventional Commits (for details, see `git-conventions.md` under skills in the same directory as this file)

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

## Rules and Extended Skills

OpenClaw will load Markdown skills from `skills/` in this workspace. After initialization the rules file is located at:

`skills/frontend-craft-rules/`

Read as needed and quote relevant passages in the conversation, for example:

- `skills/frontend-craft-rules/fec-vue.md` / `fec-react.md` — Framework specification
- `skills/frontend-craft-rules/fec-typescript.md` — TypeScript/JavaScript (linked with `typescript-reviewer` script)
- `skills/frontend-craft-rules/fec-code-comments.md` — code comments (when to write, what to write)
- `skills/frontend-craft-rules/fec-testing.md`, `fec-performance.md`, `fec-design-system.md`, etc.
- `skills/frontend-craft-rules/fec-agent-workflow.md` — subagent collaboration boundary
- `skills/frontend-craft-rules/fec-working-modes.md` — research, planning, development, review, finishing modes

If the project does not require a certain rule, you can delete the corresponding file or explain it in the dialog to ignore it.
