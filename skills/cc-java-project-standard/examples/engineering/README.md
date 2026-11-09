# Partial initialization and cause — EP-JAVA-01

In a writable copy, prepare with `javac --release 17 ResourceBoundary.java ResourceBoundaryTest.java`. Run `java -ea -cp . ResourceBoundaryTest` with `CRAFT_ENGINEERING_DEFECTIVE=1`, then `=0` (the protected default). PowerShell assigns `$env:CRAFT_ENGINEERING_DEFECTIVE`; POSIX prefixes the command. No third-party library or repository source is required.

The failure test observes the real original IOException and exactly one release callback. The defect omits failure-path close. Both named tests use always-active require checks; disabling Java assertions does not turn them into empty tests. The JSON lines summarize executed test bodies; the verifier checks names, counters, exit code and actual failure marker together.

Java17 is this example's compile target, not a required project upgrade. This is not an executor, GUI, database-driver or suppressed-close-error test. Keep .class/log output in the writable copy; verify those additional boundaries separately.
