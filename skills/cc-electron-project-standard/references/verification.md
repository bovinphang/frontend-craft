# Verification boundaries

From [the example directory](../examples/minimal/README.md):

```sh
node --test boundary.test.cjs
```

The same file selects the deliberately unguarded handler when `CRAFT_EXAMPLE_DEFECTIVE=1`; set that variable with the host shell, run the command and require actual sender/schema assertion failures. Reset it to `0` and rerun. Missing Electron or a process startup error is not a business RED.

| Layer | Evidence and limits |
| --- | --- |
| IPC handler | Real Node tests reject another WebContents, an untrusted frame and malformed data; the side-effect counter stays empty. |
| Electron process | Launch with the already installed Electron, call the preload API, attempt untrusted navigation/frame IPC, and inspect actual isolation/sandbox behavior. |
| Release | Check packaged resource/native-module paths, install/update/uninstall and signatures on each target OS. |

Development evidence on 2026-11-08: Node 24.14.1 handler tests observed RED then GREEN. Electron binary/GUI, actual process sandbox, native-module rebuild, signatures and distributable bundles were **NOT RUN**. Record tools/versions and missing environments separately rather than reporting a complete desktop validation.
