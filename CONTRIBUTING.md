# Contributing Guide

Thanks for your interest in `frontend-craft`. Issues, pull requests, documentation fixes, runtime adapters, and better examples are all welcome.

**Simplified Chinese:** [CONTRIBUTING.zh-CN.md](CONTRIBUTING.zh-CN.md)

## Development Setup

- Node.js >= 22 for the universal installer and OpenClaw package build.
- Git.
- Run `npm install` before local development.

Useful checks:

```bash
npm test
npm run pack:skills
npm run check:skills-publish
npm run typecheck:openclaw
```

## Project Structure

```
├── agents/          # Agent definitions (Markdown + YAML frontmatter)
├── bin/             # CLI entry point (frontend-craft.ts)
├── commands/        # Custom commands (fec-init, fec-review, fec-scaffold)
├── docs/            # Runtime installation docs and localized READMEs
├── hooks/           # Hook configuration (hooks.json)
├── scripts/         # Helper scripts (formatting, packaging, notifications, security, testing)
├── skills/          # Skill definitions (SKILL.md, metadata.json)
├── src/             # Source code
│   ├── install/     # Installer core (CLI, interactive wizard, runtime converters)
│   └── openclaw/    # OpenClaw runtime TypeScript source
├── templates/       # Templates (Claude/Codex/OpenClaw configs + shared rules)
├── tests/           # Test suite
│   ├── converters/  # Converter tests
│   └── install/     # Installer tests (CLI, E2E, all-runtimes dry-run)
└── package.json     # Project configuration and scripts
```

## Local Development and Debugging

```bash
# 1. Install dependencies
npm install

# 2. Install to a specific runtime (e.g., claude)
node dist/bin/frontend-craft.js install claude --local --dry-run  # preview first
node dist/bin/frontend-craft.js install claude --local            # actual install

# 3. Install to all runtimes
node dist/bin/frontend-craft.js install --all --dry-run

# 4. List all supported runtimes
node dist/bin/frontend-craft.js list
```

## Testing

Tests use Node.js built-in `node:test` with `assert/strict`.

```bash
# Run all tests
npm test

# Run a single test file
node --test dist/tests/install/cli.test.js

# Run installer tests
node --test dist/tests/install/*.js

# Run converter tests
node --test dist/tests/converters/*.js

# Run all-runtimes dry-run test
node --test dist/tests/install/all-runtimes-dry.test.js
```

For testing the interactive installation wizard, set `FRONTEND_CRAFT_FORCE_INTERACTIVE=1`:

```bash
FRONTEND_CRAFT_FORCE_INTERACTIVE=1 node --test dist/tests/install/cli.test.js
```

## OpenClaw Build

The OpenClaw runtime has its own build pipeline:

```bash
npm run build:openclaw          # Bundle TypeScript to dist/openclaw/ via esbuild
npm run typecheck:openclaw      # TypeScript type checking
npm run check:openclaw-dist     # Verify dist integrity
npm run pack:openclaw           # Full build + verify + package
```

Source: `src/openclaw/` (TypeScript) → `dist/openclaw/index.js` (bundled ESM).
TypeScript config: `tsconfig.openclaw.json`.

## Standalone Skill Packages

The canonical skill sources live under `skills/<skill-id>/`. Do not edit generated files under `skill-packages/` by hand.

```bash
npm run pack:skills            # Build one standalone package per skill
npm run check:skills-publish   # Verify package metadata, index, and copied references
npm run pack:all               # Full test + OpenClaw package + standalone skill packages
```

`npm run pack:skills` writes `skill-packages/<skill-id>/` with `SKILL.md`, only the referenced `references/` files, `metadata.json`, `package.json`, `README.md`, and `LICENSE`. It also writes `skill-packages/index.json` for platform crawlers and release automation.

When changing a skill, keep these source files aligned:

- `skills/<skill-id>/SKILL.md` — canonical runtime instruction.
- `skills/metadata.json` — publish metadata, category, tags, keywords, platform targets, and package version.
- `skills/eval_queries.json` — positive and negative trigger examples used by routing quality checks.
- `README.md` and localized README summaries when the public skill list or user-facing behavior changes.

## Scripts

Hook scripts live under `src/hooks/` and are bundled into `dist/hooks/` for published runtime use. Maintenance scripts live under `scripts/` and run from source with `tsx`; they are not published as `dist/scripts`.

| Script                                      | Purpose                           |
| ------------------------------------------- | --------------------------------- |
| `src/hooks/run-tests.ts`                     | Test runner helper                |
| `src/hooks/format-changed-file.ts`           | Format changed files              |
| `src/hooks/security-check.ts`                | Security scanning                 |
| `src/hooks/notify.ts`                        | Notification script               |
| `src/hooks/session-start.ts`                 | Session initialization            |
| `scripts/sync-codex-agents-toml.ts`        | Sync Codex agents configuration   |
| `scripts/pack-skills.ts`                   | Standalone skill package builder  |
| `scripts/check-skills-publish.ts`          | Standalone skill package verifier |
| `scripts/skill-packaging.ts`               | Shared skill packaging helpers    |
| `scripts/openclaw/build.ts`                | OpenClaw esbuild bundler          |
| `scripts/openclaw/pack-openclaw.ts`        | OpenClaw packaging                |
| `scripts/openclaw/verify-openclaw-dist.ts` | Verify OpenClaw dist completeness |

## Architecture Overview

The universal installer follows this architecture:

```
bin/frontend-craft.ts
  └─ src/install/cli.ts              # CLI entry (parse commands: install/list/version/uninstall)
       ├─ src/install/registry.ts    # Runtime registry (names + installer map)
       ├─ src/install/converters/     # Per-runtime adapters (claude, codex, cursor, copilot, etc.)
       ├─ src/install/interactive.ts # Interactive wizard (runtime/location prompts)
       ├─ src/install/runtime-homes.ts # Global/local directory conventions
       └─ src/install/types.ts       # Shared TypeScript types
```

Each runtime converter under `src/install/converters/` implements the `InstallContext` interface from `types.ts`, writing skills, agents, commands, hooks, and templates to the target runtime's configuration directory.

## Branch Strategy

- `main` - stable release branch.
- `develop` - development branch, if used.
- `feature/<name>` - new features.
- `fix/<name>` - bug fixes.
- `docs/<name>` - documentation updates.

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <description>

[optional body]
[optional footer]
```

Common types:

| Type       | Meaning                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation                  |
| `refactor` | Refactoring                    |
| `test`     | Tests                          |
| `chore`    | Build, tooling, or maintenance |

Examples:

```text
feat(skills): add e2e testing skill
fix(hooks): resolve Windows path handling
docs(readme): update installation steps
```

## Language and Documentation Policy

English is the source language for public project governance, runtime documentation, release notes, and GitHub collaboration templates. Localized README files should stay user-focused and link back to English docs for detailed contributor or maintainer workflows.

When a pull request changes public behavior, installation steps, runtimes, agents, skills, commands, or hooks:

- Update `README.md` and `CHANGELOG.md` first (and [`CHANGELOG.zh-CN.md`](CHANGELOG.zh-CN.md) when the change is release-noteworthy for Chinese readers).
- Sync user-facing summaries in `README.zh-CN.md`, `docs/zh-TW/README.md`, `docs/ja-JP/README.md`, and `docs/ko-KR/README.md` when the change affects users.
- Claude Code Marketplace install and update steps are maintained in [`docs/runtimes/claude.md`](docs/runtimes/claude.md) and [`docs/runtimes/claude.zh-CN.md`](docs/runtimes/claude.zh-CN.md). When that flow changes, update those files (the root README and localized READMEs only link there).
- If translations cannot be completed in the same pull request, open or link a follow-up issue and mention it in the PR description.
- Keep code examples, runtime names, command names, file paths, and package names consistent across languages.

Issues and pull requests are easiest to review in English. If you are more comfortable writing in Chinese, that is also welcome; maintainers can help translate titles and summaries when needed.

## Adding a Skill

1. Create a directory under `skills/`, for example `skills/fec-my-skill/`.
2. Add `SKILL.md` with YAML frontmatter and concise instructions:

```markdown
---
name: fec-my-skill
description: Use when the user needs ...
---

# Skill Title

## When to Use

- ...

## Core Rules

- ...
```

3. Add an entry to `skills/metadata.json` with `id`, display `name`, taxonomy `category`, `tags`, `summary`, publish metadata, `keywords`, and `platforms`. The `version`, `license`, `homepage`, and `repository` fields should match `package.json`.
4. Add positive and negative trigger examples to `skills/eval_queries.json`.
5. Add the skill to the Skills table in `README.md`.
6. Update the repository tree in `README.md` and localized README files if the visible structure changes.
7. Run `npm test`, `npm run pack:skills`, and `npm run check:skills-publish`.

## Adding an Agent

1. Create `agents/my-agent.md`.
2. Define the YAML frontmatter:

```markdown
---
name: my-agent
description: Use this agent when ...
tools: Read, Edit, Write, Glob, Grep, Bash
model: sonnet
skills:
  - relevant-skill
---
```

1. Update the Agents table in `README.md`.
2. Sync `README.zh-CN.md`, `docs/*/README.md`, and `.claude-plugin/marketplace.json` when counts or user-facing descriptions change.

## Adding a Command

1. Create `commands/my-command.md`.
2. Use YAML frontmatter and Markdown steps.
3. Update the Commands table in `README.md` and localized user-facing summaries as needed.

## Adding a Rule Template

1. Create `templates/shared/rules/my-rule.md`.
2. Add it to the copy list in `commands/fec-init.md`.
3. Update `templates/claude/CLAUDE.md` rule import examples when applicable.

## Universal Installer

- Entry point: `bin/frontend-craft.ts` (compiled to `dist/bin/frontend-craft.js`).
- Implementation: `src/install/` (converters, registry, path helpers).
- Interactive prompts and input parsing: `src/install/interactive.ts` (tests may set `FRONTEND_CRAFT_FORCE_INTERACTIVE=1` to exercise stdin-fed prompts).
- Register a new runtime in `src/install/registry.ts`.
- Add the runtime installer under `src/install/converters/`.
- Follow global directory conventions from `src/install/runtime-homes.ts`.
- Add or update tests under `tests/install/`.

## Adding a Hook

1. Update `hooks/hooks.json`.
2. Put hook scripts under `scripts/` and prefer cross-platform Node.js.
3. In `hooks/hooks.json`, use **`${CLAUDE_PLUGIN_ROOT}`** for paths to bundled `scripts/` entrypoints (Claude Code substitutes this at runtime; see the official [Plugins reference](https://code.claude.com/docs/en/plugins-reference)). The Claude installer in this repo also expands **`${CLAUDE_PLUGIN_ROOT}`** and legacy **`${FRONTEND_CRAFT_ROOT}`** to absolute paths when it writes `hooks.json` under `.claude/`.
4. Update the Hooks table in `README.md`.

## Pull Request Checklist

Before opening a pull request:

- [ ] The change is scoped and described clearly.
- [ ] `npm test` passes.
- [ ] Skill changes pass `npm run pack:skills` and `npm run check:skills-publish`.
- [ ] `npm run typecheck:openclaw` passes when OpenClaw code or templates are affected.
- [ ] `README.md` and `CHANGELOG.md` are updated when user-facing behavior changes (and `CHANGELOG.zh-CN.md` when you ship Chinese-facing release notes).
- [ ] Localized README files are synced, or a follow-up translation issue is linked.
- [ ] New runtime, agent, skill, command, hook, or template changes include relevant tests or dry-run coverage.
- [ ] Security-sensitive changes have been reviewed against `SECURITY.md`.

## Code Style

- Prefer clear Markdown with stable headings and tables.
- Keep skill and agent descriptions concise because model routing depends on them.
- Use cross-platform Node.js scripts for automation.
- Avoid shell-specific assumptions unless a runtime explicitly requires them.

## Reporting Issues

Use [GitHub Issues](https://github.com/bovinphang/frontend-craft/issues) for bugs and feature requests. Include the runtime, operating system, Node.js version, exact command, expected behavior, and actual behavior whenever possible.

Do not file security-sensitive vulnerabilities as public issues. Follow [SECURITY.md](SECURITY.md) instead.
