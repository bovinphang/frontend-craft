# External input boundary — EP-TS-01

Use a separate writable copy of this directory. This example targets Node >=22.18 for native type stripping, with explicitly declared TypeScript and Node types; it does not change the parent project's supported versions.

Prepare once: `pnpm install --ignore-scripts --frozen-lockfile`. Then `pnpm typecheck` and `pnpm test`. In PowerShell set `$env:CRAFT_ENGINEERING_DEFECTIVE='1'` and run the same test: the named invalid-input assertion must fail after successful preparation/type checking. Set it to `'0'` (or remove it) and rerun: both tests pass. POSIX: prefix the test command with `CRAFT_ENGINEERING_DEFECTIVE=1` or `=0`.

The callback records real effects before/after validation; the defective branch deliberately replaces validation with a cast. Default behavior is protected. This does not test a payment backend, browser, async state or declaration publishing; those require their own consumer checks. No test imports parent-repository source. Install/build output belongs only to the writable copy.

[Node.js type-stripping history and limitations](https://nodejs.org/api/typescript.html): runtime stripping is separate from the explicit TypeScript type check.
