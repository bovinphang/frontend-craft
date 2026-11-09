# Handler lifecycle — EP-IPC-01

In a separate writable directory run `node --test --test-reporter=tap ipc-lifecycle.test.cjs` with CRAFT_ENGINEERING_DEFECTIVE=1 then =0/unset (protected default). PowerShell assigns `$env:CRAFT_ENGINEERING_DEFECTIVE`; POSIX prefixes the command. Node22+ is the only tool; no Electron download, parent source or sibling example is needed.

The actual async handler validates sender/frame/exact document and bounded input, owns its AbortController, and rechecks liveness/cancellation/trust after preparation before synchronous commit. Deferred promises deliberately ignore cancellation so the second check has observable value. Tests inspect real commit effects after close/cancel, a valid call, and rejected sender/input. Preparation must be non-privileged; commit is a synchronous main-owned operation. An asynchronous or already committed external write needs its own lifecycle/transaction contract. Cancellation does not roll it back, and this example establishes no ordering between concurrent live calls.

Wire this core to the actual narrow ipcMain operation and window lifecycle in a real application; existing minimal process files demonstrate separate wiring. Node unit tests do not activate Electron GUI, sandbox, context isolation, permissions, signing or packages. Those remain NOT RUN and require target-specific evidence. Keep logs outside source.
