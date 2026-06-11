# Dependency upgrade workflow

##Upgrade type

| Type | Example | Validation |
| ---- | ---- | ---- |
| Security patches | Transitive dependencies CVE, patch version | Installation, audit, target testing |
| Minor version upgrade | Compatibility feature version | typecheck, test, build |
| Large version migration | React/Vue/Next/Vite/Storybook large version | Migration guide, complete verification matrix |
| Tool chain switching | ESLint, TypeScript, bundler, test runner | Configuration diff, CI alignment, sample failure |
| Cleanup | Remove unused packages | Reference search, build, test |

## Source Checklist

-Official release notes or migration guide.
- Package manager compatibility and lockfile format.
- Node version and browser support range.
- Peer dependency version range.
- ESM/CJS export changes.
- TypeScript minimum version and type changes.
- SSR, RSC, edge runtime or browser-only constraints.

## Batch strategy

- Major version upgrades of the framework are handled separately from style, test, and lint upgrades.
- When required by the peer version range, the adapter is upgraded in the same batch as the host tool.
- Verify affected packages in Monorepo and at least one application consuming these packages.
- Passed commands are logged for each successful batch and submitted or reported individually if necessary.

## Failed Triage

1. Reproduce the minimum failed command.
2. Determine whether the failure belongs to configuration, type surface, runtime behavior, or peer dependency.
3. Prioritize official migration steps over local temporary hacks.
4. If a packet blocks the current batch, pin it first and record the reason; continue only when the remaining batches are still self-consistent.

## Report template

```markdown
## Dependency upgrade summary

| package | from | to | reason | risk | basis |
| -- | -- | -- | ---- | ---- | ---- |

## Verify

- install:
- typecheck:
- test:
- build:
- e2e/storybook/manual:

## Residual risk

- ...
```
