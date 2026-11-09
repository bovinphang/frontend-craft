# Pure C size and cleanup contract — EP-C-01

In a writable copy compile `cc -std=c11 -Wall -Wextra -Werror boundary.c boundary_test.c -o boundary-test`. Run the executable with CRAFT_ENGINEERING_DEFECTIVE=1 and then =0 (default). POSIX: `CRAFT_ENGINEERING_DEFECTIVE=1 ./boundary-test`; PowerShell sets `$env:CRAFT_ENGINEERING_DEFECTIVE` and invokes the built executable. A missing compiler is MISSING; use the explicitly prepared Docker verifier if needed.

Two named test bodies perform always-active checks, including when NDEBUG is defined. The allocator uses actual malloc/free and records ownership, rejects huge requests, and cleans remaining test allocations. Overflow is checked before allocation; partial second-allocation failure releases the first header; success transfers only the payload. Valid output slots are initialized even on invalid arguments. The defect intentionally omits overflow/partial-cleanup protection. Its unsigned wrap is defined C behavior; no unstable UB crash is needed to observe the error.

C11 is this isolated sample target, not a project upgrade or a demand to use C++. No SAL, external library, parent source or database is required. The case does not prove sanitizer coverage, arbitrary foreign-buffer validity or every ABI/platform; run those checks explicitly when relevant. Keep executable/log output outside the source directory.
