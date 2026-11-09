# Minimal Tauri document application

`core/` is a dependency-free Rust crate with one bounded read operation and real boundary tests. `src-tauri/` wires it to a Tauri 2 command, generated app-command permission and the `main` capability. `ui/` invokes that exact command. All example sources are inside this package.

Run the core tests from this directory using the commands in [verification](../../references/verification.md). `--features defective` selects the explicitly unsafe teaching function; it must fail the same assertions. Never enable that feature for the application.

When the project's existing Tauri 2 dependencies and platform prerequisites are already prepared, run `cargo run --manifest-path src-tauri/Cargo.toml --offline` here. The app creates its own documents directory and an initial `hello.txt`, and the button reads it through the protected core. The UI never chooses a trusted root. Resolve and lock the application's framework dependencies through the owning project's normal workflow before claiming a reproducible framework build; the independent core lock does not lock the GUI dependency graph.

Core tests prove the read boundary, not command permission activation or a distributable GUI. Exercise denied windows/origins through actual Tauri invocation before release.
