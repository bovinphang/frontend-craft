# Electron practice

- Locate the locked Electron version and main, preload and renderer outputs. The sample uses APIs available in Electron 30+, not a recommendation to deploy an old release; select a maintained version through the actual project's upgrade policy.
- Expose individual operations through `contextBridge`. Do not pass `ipcRenderer`, arbitrary channels, shell commands or unrestricted filesystem access to the renderer.
- In main, validate the expected WebContents identity, main frame and exact trusted document URL as well as the argument schema. Origin alone is insufficient for `file:` content; prefer a constrained secure custom protocol.
- Explicitly enable isolation/sandbox and disable Node integration for the renderer. Restrict navigation, new windows, protocol paths, permissions and CSP; avoid remotely supplied privileged code.
- The [boundary handler](../examples/minimal/boundary.cjs) validates a bounded title before its side effect. The [preload](../examples/minimal/preload.cjs) exports one method; [main](../examples/minimal/main.cjs) serves only exact packaged assets.
- Track window/handler/listener ownership and cleanup. Review workers and blocking main-process work, native-module ABI compatibility, packaged resource paths and update trust before release.

## Official references

Checked 2026-11-08. The official pages track current Electron; verify behavior against the installed version:

- [Process model](https://www.electronjs.org/docs/latest/tutorial/process-model).
- [Context isolation and a method per IPC operation](https://www.electronjs.org/docs/latest/tutorial/context-isolation).
- [contextBridge API](https://www.electronjs.org/docs/latest/api/context-bridge).
- [Security: sender checks, sandbox, protocols and navigation](https://www.electronjs.org/docs/latest/tutorial/security).

The minimal example has no external runtime dependency for its Node boundary tests. Its optional Electron peer is supplied by a prepared host environment; it never downloads Electron while testing.
