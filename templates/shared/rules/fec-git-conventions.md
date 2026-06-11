# Git commit specifications

This file should be used whenever creating a commit, writing a commit message, or preparing to submit code.

## Conventional Commits Format

```
<type>(<scope>): <subject>

[body]

[footer]
```

### type value

| type | purpose |
|------|------|
| `feat` | New features |
| `fix` | Fix bug |
| `refactor` | Refactor (does not change behavior) |
| `style` | Code format adjustment (does not affect logic) |
| `docs` | Documentation changes |
| `test` | Test related |
| `chore` | Build, tools, dependencies and other miscellaneous items |
| `perf` | Performance optimization |
| `ci` | CI/CD configuration changes |

### scope

Optional, indicate the scope of influence, such as module name, component name or functional domain:

- `feat(auth): add new mobile phone number to log in`
- `fix(table): Fix sorting column not highlighted`
- `refactor(api): unified request error handling`

### subject specification

- Use imperative sentences ("increased xxx" instead of "increased xxx")
- No more than 72 characters
- does not end with a period
- If the scope of impact is large, describe it in detail in the body

## Branch naming

- `feature/xxx` — new features
- `fix/xxx` — fix
- `refactor/xxx` — Refactor
- `hotfix/xxx` — emergency fix

## Check before submission

Must pass before submission:

1. lint
2. type-check
3. Testing related to changes

Do not execute `git commit` directly without user confirmation.

## Submission granularity

- A commit only has one clear purpose: feature, fix, test, documentation or cleanup.
- Large programs should be broken into verifiable smaller batches, each with instructions and command results.
- Don't mix cleanup, formatting, and behavior changes in the same commit.
- Review the diff before pushing or sending a PR to make sure there are no local configurations, keys, temporary reports or debug output.

## Anti-pattern

- A commit that mixes unrelated changes
- The commit message is too general (such as "update", "fix bug", "wip")
- Include debug code, console.log, or temporary hacks in commits
- Commit high-risk changes without specifying verification commands or knowing the remaining risk
