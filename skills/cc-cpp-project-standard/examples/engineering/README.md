# Borrowing and partial construction — EP-CPP-01

In a writable copy compile `c++ -std=c++17 -Wall -Wextra -Werror boundary.cpp boundary_test.cpp -o boundary-test`. Execute with CRAFT_ENGINEERING_DEFECTIVE=1, then =0 (default). PowerShell assigns `$env:CRAFT_ENGINEERING_DEFECTIVE`; POSIX prefixes the executable command. Missing compiler is MISSING; use explicit Docker preparation/verification if needed.

The caller heap-allocates the borrowed object, so the deliberately incorrect takeover can be detected without freeing a stack object or double-deleting. The faulty branch also leaks one owned lease during partial construction; counts expose the missed destruction. Tests avoid a second delete even when the defect frees the borrowed object. Protected behavior keeps the borrow non-owning and uses RAII for the acquired lease. Both named bodies use always-active checks, independent of NDEBUG.

This sample explicitly chooses C++17 and exceptions inside its own C++ boundary. It does not authorize enabling exceptions, changing standards, converting pure C or letting exceptions cross a C ABI in a consumer project. No FFI ABI, sanitizer, GUI or database guarantee is established. The intentional leak belongs only to the defective test process; it is disabled by default. Keep build/log output outside sources.
