---
name: fec-debug-framework
description: Use when diagnosing frontend build failures, runtime errors, UI anomalies, API/data problems, white screens, request failures, or unexplained production exceptions; Chinese triggers include debugging, debug, troubleshooting, positioning, error reporting, exceptions, white screens, request failures.
---

# Frontend diagnosis

Follow the [common five-step diagnostic method](references/common/debug.md), then collect evidence using these frontend modules.

## Diagnostic module

### Build module

**Collect**: Run minimal failing commands, capture full stderr/stdout
**Assumptions**: Grouped by error type (type error, import failure, configuration resolution, missing dependency), match known patterns
**Verification**: Fix a type of root cause → rerun the command → confirm that errors are reduced
**Special handling**:

- Collect evidence for dependency version, peer dependency, ESM/CJS, and lockfile related failures first as build compatibility issues
- Log package manager, Node version, lockfile diff, related package version and full error log
- No longer upgrade dependencies, manually edit lockfiles when evidence is lacking, or mix dependency migrations with normal debug fixes in the same batch of changes
- If the task goal itself is version upgrade, CVE repair or lockfile risk review, it should be transferred to the dependency upgrade workflow
- CI exclusive failure check Node version, package manager, environment variable differences

### Runtime module

**Collect**:

- Recurrence path (sequence of user operations)
- Console errors and stack
- Component rendering tree status (check whether key components are mounted correctly)
- Relevant store/state snapshot

**Assumptions**:

- Stack reverse tracing: trace back from the exception location to the trigger source
- State flow analysis: Check whether state changes are as expected
- Life cycle analysis: whether uninitialized data is accessed at the wrong time

**Verification**:

- Add temporary log confirmation status value
- Add assertions on suspicious paths
- Recurrence path verification fix

### UI module

**Collect**:

- Current screenshot vs desired effect
- DOM structure check (whether the element exists and whether the level is correct)
- Computed style checks (actual applied CSS values)
- Responsive breakpoint testing

**Assumptions**:

- CSS specificity conflict (selector weight is not enough to be overridden)
- Component state mismatch (props/state not passed correctly)
- Layout model problem (flex/grid configuration error)
- Missing responsive breakpoints

**Verification**:

- Browser DevTools real-time adjustment verification
- Isolated component testing (excluding external style interference)
- Multiple breakpoints to verify one by one

### API module

**Collect**:

- Request URL, method, headers, body
- Respond to status, headers, body
- Network waterfall timing
- Cache data in related store/state

**Assumptions**:

- Request link hop-by-hop inspection (URL → Middleware → Interceptor → Server)
- Data conversion checks (response parsing, type mapping)
- Cache policy check (expiration, invalidation, race condition)
- Concurrent request race condition (race condition)

**Verification**:

- curl independent reproduction (excluding front-end interference)
- Mock layer by layer to locate the problem level
- End-to-end request validation fixes

---

## Detailed reference

When writing a diagnostic report, load [references/report-template.md](references/report-template.md).

## Constraints

- Don't guess at root cause when evidence is lacking
- Not "fixed" by turning off rules, removing tests, or reducing type safety
- Change only one variable at a time to test your hypothesis
- Do not expand the scope of changes before verification
- The same hypothesis fails verification 3 times in a row, stops and reports blocking

## Expected Output

- The diagnostic report is saved as `reports/debug-YYYY-MM-DD-HHmmss.md`
- The report includes issue type, key evidence, hypothesis verification records, root cause, fix content, verification results and remaining risk
- Build/runtime/ui/api problems can explain the reproduction path, verification command or next blocking point
