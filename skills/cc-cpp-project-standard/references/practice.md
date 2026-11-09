# C++ project engineering

## Specialist checks

1. Read the actual C++ standard, standard library, compiler matrix, build presets and exported ABI before choosing features.

2. Represent ownership with an appropriate RAII owner; keep borrowed pointers explicitly borrowed. Do not invent shared ownership around a pointer owned elsewhere.

3. Specify exception guarantees and release resources during partial construction. Catch at explicit boundaries, convert failures accurately and keep destructors safe.

4. Keep allocation/release paired across DLL/FFI boundaries. Prevent exceptions and unstable implementation types from crossing unsupported ABI contracts.

5. Review destruction order, callback lifetime and synchronization with unload. Test competing teardown and error paths rather than only successful construction.

6. Validate the existing build and available diagnostics on declared platforms. Report missing tooling; a successful compile is not evidence of race or lifetime safety.

<a id="scope"></a>
## Scope and examples

Use for:
- Review RAII and exception safety in a C++ library
- Keep a plugin ABI while clarifying ownership
- Reduce header and template dependency boundaries
- Test C++ destruction and partial construction

Do not upgrade the C++ standard or replace the build system without a task need; pure C interfaces retain their own contract.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
