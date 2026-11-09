# Verification boundaries

From [the minimal application](../examples/minimal/README.md), run:

```sh
cargo test --manifest-path core/Cargo.toml --offline --locked --features defective
cargo test --manifest-path core/Cargo.toml --offline --locked
```

The first command intentionally fails the same traversal/absolute-path assertions; the second must pass them plus allowed-file behavior. Unix additionally checks a symlink escape. A compiler/dependency failure is MISSING, not the expected business failure. Keep build outputs outside the distributable skill directory.

| Layer | Evidence and limits |
| --- | --- |
| Rust command core | Real `cargo test`; invalid paths must fail before returning outside data. No GUI needed. |
| Tauri integration | With the existing prepared Tauri 2 toolchain, build/run the app and test allowed/denied windows and capabilities through actual invoke calls. Rust unit results do not prove permission activation. |
| Desktop release | Run UI journeys and target bundles, installation/update, cleanup and signing on each supported OS. No substitution by text checks. |

Development evidence on 2026-11-08: Windows Rust 1.96.0 core tests observed real RED then GREEN. Tauri dependency build, WebView permission activation, GUI, signing and bundles were **NOT RUN**. Report missing system libraries or dependencies without downloading them implicitly.
