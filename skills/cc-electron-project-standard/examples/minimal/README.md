# Minimal Electron IPC application

This directory contains main, preload, renderer, trusted protocol assets, an IPC boundary and tests. It requires no neighboring skill package.

Run `node --test boundary.test.cjs` to test the production handler. With `CRAFT_EXAMPLE_DEFECTIVE=1`, the same assertions select a clearly marked unsafe function and intentionally fail. Use the normal handler for the application.

If a maintained Electron version is already available in the owning environment, run its existing `electron .` command here. The optional peer describes the API baseline; it does not install a runtime or provide a locked release environment. The window uses the secure `app://craft` protocol, exports only `desktop.setTitle`, and refuses arbitrary assets, windows and navigation.

The title handler is tested as plain Node code, not a mocked claim that an Electron process ran. Verify real process isolation, IPC authorization and target packaging with the host project's prepared Electron toolchain before release.
