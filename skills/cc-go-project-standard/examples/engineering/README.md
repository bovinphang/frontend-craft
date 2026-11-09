# Cancellation and completion — EP-GO-01

Copy this standalone Go module to a writable directory. No downloaded modules are needed. With the declared Go1.20+ toolchain, first `go test -run=^$ ./...` (preparation/compilation, not behavior evidence). Then run `go test -json -count=1 -timeout=15s ./...` with `CRAFT_ENGINEERING_DEFECTIVE=1` and again with `=0` (default). PowerShell: set `$env:CRAFT_ENGINEERING_DEFECTIVE` before the same command; POSIX: prefix the command with the assignment. For offline runs set `GOPROXY=off GOTOOLCHAIN=local GOSUMDB=off`.

An event confirms a worker acquired a value. With no output receiver, the defect blocks both worker paths despite cancellation; its named assertion fails at the five-second watchdog. This timeout bounds failure rather than establishing ordering by sleeping. The protected path observes context at both blocking boundaries and Stop waits for both workers. The intentionally stalled defective test process terminates after reporting failure; it is not production shutdown code.

This does not prove every schedule or race freedom. Run the project's scoped race checks separately where supported. No parent source, database or HTTP stack is involved.
