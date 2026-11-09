# C project engineering

## Specialist checks

1. Read the existing C standard, compiler flags, build system and exported ABI. Preserve symbol visibility, calling conventions and error codes.

2. State allocator, owner, borrowing lifetime, transfer point and matching release function for every resource-facing interface. Initialize output values on failure.

3. Use explicit cleanup paths for partial initialization; release only acquired resources and prevent double release. Do not import C++ resource mechanisms into C.

4. Check length, integer overflow, alignment and signedness before memory access or allocation. Treat external malformed input as a recoverable error, not an assert.

5. Inject allocation and parsing failures at each stage; test the success transfer and every early return. Review ownership across FFI and runtime boundaries.

6. Use the current build and available compiler diagnostics/sanitizers. State which platforms and failure paths ran; static analysis cannot prove all undefined behavior absent.

<a id="scope"></a>
## Scope and examples

Use for:
- Review a C allocation and release contract
- Keep a C ABI while fixing failure cleanup
- Organize headers and implementation in an existing C library
- Test C allocation failure and invalid input

C++ resource abstractions and exceptions are not a replacement for a pure C contract; cross-language memory incidents have a dedicated specialty.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
