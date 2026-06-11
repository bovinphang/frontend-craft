---
name: fec-doc-sync
description: Sync README, docs, environment variables, scripts, API/routing/component descriptions and deployment instructions from code and project sources of truth.
---

Press `fec-doc-sync` to synchronize front-end project documents. Complex multi-language updates can be delegated to **`fec-doc-updater`**.

## Execution steps

1. Read sources of truth: `package.json`, lockfile, config, `.env.example`, routes, API clients/server routes, types/schemas, components, tests, CI, build/deploy config.
2. Compare README, docs, ADR, changelog, example prompts, setup/deploy/env docs.
3. Update stable commands, environment variables, routing/API behavior, component descriptions, deployment steps, version constraints, and migration instructions.
4. Keep key information consistent across multi-language documents.
5. When the target warehouse itself is a skill/agent/command distribution warehouse, the capability table, metadata, runtime docs and marketplace description are also synchronized.
6. Run document consistency, typecheck, test, build or related packaging checks.

## Output requirements

Summarize update scope, sources of fact, verification orders and translation risks that still require manual proofreading.