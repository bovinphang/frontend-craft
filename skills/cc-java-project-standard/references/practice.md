# Java project engineering

## Specialist checks

1. Read the declared JDK, build descriptor, wrapper and existing package layering. Preserve the current language level and dependency platform.

2. Separate public module contracts from implementation details; preserve dependency direction in Java libraries, CLI tools and Swing/JavaFX desktop modules.

3. Assign owners for files, executors and clients. In an actual Swing/JavaFX module, keep blocking work off its UI thread.

4. Preserve exception causes and repository conventions. Convert domain failures to transport errors at the boundary rather than returning success after catch-all handling.

5. Test public behavior, invalid input, repeated calls, exception causes and resource closure at the existing application boundary.

6. Use available repository checks and offline prepared build tooling; wrapper distribution and dependency preparation are separate actions. Report checks that could not run.

<a id="scope"></a>
## Scope and examples

Use for:
- Review Java CLI or desktop module contracts, exceptions and cleanup
- Respect an existing Maven or Gradle wrapper

JVM profiling and pool/GC incidents belong to the runtime specialty; do not impose a particular web framework.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://docs.oracle.com/en/java/javase/21/troubleshoot/) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
