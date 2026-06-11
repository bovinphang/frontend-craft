# CI/CD rules

This document stipulates the resident structure and access control of the continuous integration and deployment pipeline. The specific writing method of GitHub Actions, GitLab CI, cloud platform or monorepo pipeline should be implemented according to the existing CI template of the project, and long YAML will not be copied in this rule.

## Pipeline stage

Suggested order:

1. **Install dependencies**: Use lock file installation, such as `npm ci` or `pnpm install --frozen-lockfile`.
2. **Lint / Format check**: ESLint, Stylelint, Prettier check or project equivalent command.
3. **Type check**: `tsc --noEmit` or project typecheck script.
4. **Unit/component testing**: Jest, Vitest, Testing Library, Vue Test Utils, etc.
5. **Build**: Project production build command.
6. **Special quality access control**: package body, lighthouse, dependency security, license, a11y, visual regression, E2E, enabled according to risk.
7. **Deployment**: Only upload products or trigger deployment after the pre-order access control is passed.

Failure at any required stage should abort subsequent steps.

## Environment variables and keys

- Sensitive information uses CI platform Secrets and is not written to the warehouse, logs or build products.
- Only environment variables with public prefixes are allowed to enter the client bundle, such as `VITE_*`, `NEXT_PUBLIC_*`, etc.; server keys must not use public prefixes.
- E2E's baseURL, test account, third-party token, etc. are read from Secrets or controlled test environment.
- CI logs should avoid printing complete environment variables, request headers, tokens or private configurations.

## Products and Evidence

- Upload or save test reports, coverage, E2E traces, screenshots, build artifacts, package reports and performance budget results.
- When CI fails, keep enough logs to locate the root cause and not just return "command failure".
- Confirm version, change description, migration matters, rollback path and impact scope before release.
- Dependency upgrade PR retains lockfile diff, key package version, release notes summary and verification matrix.
- Monorepo affected quick verification can be used for PR feedback, but the full verification entry should be retained before release or trunk merging.

##Strong constraints

- Use and submit lock files to disable lockless installations.
- The build products are not submitted to the source code repository, but are generated and uploaded by CI.
- Project-defined lint, typecheck, test, and build must be passed before deployment.
- Do not skip failed access control and deploy directly unless there are clear risk acceptance, approval records and rollback plans.
- CI configuration should reuse existing commands in the project and do not invent alternative commands in the pipeline that are different from local ones.
