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
npm run typecheck:openclaw
```

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

1. Create a directory under `skills/`, for example `skills/my-skill/`.
2. Add `SKILL.md` with YAML frontmatter and concise instructions:

```markdown
---
name: my-skill
description: Use when the user needs ...
version: 1.0.0
---

# Skill Title

## When to Use

- ...

## Core Rules

- ...
```

1. Add the skill to the Skills table in `README.md`.
2. Update the repository tree in `README.md` and localized README files if the visible structure changes.

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

- Entry point: `bin/frontend-craft.mjs`.
- Implementation: `src/install/` (converters, registry, path helpers).
- Interactive prompts and input parsing: `src/install/interactive.mjs` (tests may set `FRONTEND_CRAFT_FORCE_INTERACTIVE=1` to exercise stdin-fed prompts).
- Register a new runtime in `src/install/registry.mjs`.
- Add the runtime installer under `src/install/converters/`.
- Follow global directory conventions from `src/install/runtime-homes.mjs`.
- Add or update tests under `tests/install/`.

## Adding a Hook

1. Update `hooks/hooks.json`.
2. Put hook scripts under `scripts/` and prefer cross-platform Node.js.
3. Use `${FRONTEND_CRAFT_ROOT}` for package-root paths; the `claude` installer expands it to an absolute path.
4. Update the Hooks table in `README.md`.

## Pull Request Checklist

Before opening a pull request:

- [ ] The change is scoped and described clearly.
- [ ] `npm test` passes.
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
