# Tauri practice

- Read `tauri.conf.json`, `Cargo.toml`, locks, `build.rs`, capabilities, permissions and web build configuration before changing a boundary. Keep related UI/core ownership explicit in a mixed workspace.
- For Tauri 2 custom app commands, inspect `AppManifest::commands` and generated permissions as well as `invoke_handler`. Registered app commands are not automatically restricted merely by having a capability file. Check the capabilities actually selected in configuration, their overlapping grants, window labels and remote access.
- Receive bounded typed inputs, validate paths and business permissions in Rust, return stable public errors, and serialize results deliberately. Never accept a renderer-supplied trusted root. The [example core](../examples/minimal/core/src/lib.rs) uses an application-owned root and canonical containment checks.
- This example assumes an application-owned directory. Canonicalize-then-open is not an adversarial filesystem race defense; use platform handles/open-relative APIs when another local actor can replace ancestors concurrently.
- Keep the smallest state behind `State`, document ownership of pools/tasks/files, and release it on shutdown. Choose async/blocking boundaries from measured work and actual runtime behavior; avoid blocking the UI or holding a guard across await.
- Audit plugins, sidecars, command argument construction, CSP and navigation as separate authority surfaces. New windows must not silently inherit broad grants.
- Preserve build target settings. Linux system libraries, Windows WebView2, macOS signing/entitlements and updater signatures require target-specific evidence.

## Official version references

Checked 2026-11-08 against Tauri **2** documentation; match the project's locked minor/plugins before using version-sensitive APIs:

- [Commands and typed invocation](https://v2.tauri.app/develop/calling-rust/).
- [Capabilities and app-command permission generation](https://v2.tauri.app/security/capabilities/).
- [Permission definitions](https://v2.tauri.app/security/permissions/).
- [Runtime authority](https://v2.tauri.app/security/runtime-authority/).

The example's Rust-only core is a separate crate so its boundary tests can run offline without pretending a Tauri runtime or GUI was exercised.
