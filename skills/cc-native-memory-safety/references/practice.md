# Native memory and FFI safety

## Specialist checks

1. Preserve a reproducible input, allocation/release stacks, platform/runtime identity and concurrent teardown sequence.

2. State owner, aliases, borrow duration and allocator pair at each boundary. The allocating runtime must have a supported matching release path.

3. In C use explicit ownership transfer and partial-cleanup paths; in C++ use suitable RAII/custom deleters while keeping borrowed references borrowed.

4. Keep exceptions and unsupported implementation types inside their ABI boundary. Check buffer lengths, overflow and object lifetime before access.

5. Exercise failure injection, repeated close, callback-after-unload and concurrent destruction. Do not hide a dangling alias by merely setting one pointer to null.

6. Run supported address/undefined/thread diagnostics separately as appropriate, plus regression tests; record unavailable tools and coverage limits.

<a id="scope"></a>
## Scope and examples

Use for:
- Diagnose use-after-free across a C/C++ FFI boundary
- Pair allocation and release across dynamic libraries
- Test partial initialization and repeated cleanup
- Reproduce a teardown race without disabling sanitizers

Apply language-appropriate ownership: C cleanup contracts and C++ RAII are different; sanitizer success is bounded evidence.

## Evidence to deliver

- Repository/contract evidence and the exact affected scope.
- Chosen approach, invariants, resource/error or failure boundaries.
- Commands actually run and results, unrun checks and unproven claims.
- Compatibility, recovery/rollback or follow-up limits; review findings need verified locations.

## Primary reference

[Relevant official/project documentation](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html) (checked 2026-11-06). Match the actual project version before applying version-sensitive details; the page version does not authorize an upgrade.
