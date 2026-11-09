---
practiceCards:
  - id: "cc-python-project-standard:import-safety"
    level: "required"
    sourceIds: ["google-python"]
    caseIds: ["EP-PY-01"]
    evidence: "case"
  - id: "cc-python-project-standard:external-data"
    level: "required"
    sourceIds: ["google-python"]
    caseIds: ["EP-PY-01"]
    evidence: "review-only"
  - id: "cc-python-project-standard:context-cleanup"
    level: "required"
    sourceIds: ["google-python","oracle-resources"]
    caseIds: ["EP-PY-01"]
    evidence: "case"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="cc-python-project-standard:import-safety"></a>
## Import describes a library; startup acquires resources

Level: required

### Risk
Import-time connections make metadata, tests and CLI help depend on external systems.

### Applies
For reusable packages and their CLI/desktop callers; module constants and definitions are not forbidden.

### Decision
Move external acquisition to an explicit factory/lifespan owned by the caller. Inject collaborators into pure computations; importing or reading a version should work offline.

### Exceptions
A documented executable entry may initialize application state after argument/permission checks. Do not impose controller/service/repository on a library.

### Examples
Better: connect during explicit startup. Worse: open a remote client while importing the package.

### Verification
The local test launches a new interpreter and checks a temporary external marker; real service connectivity is deliberately untested.

### Sources
google-python — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-PY-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-python-project-standard:external-data"></a>
## Annotations do not validate external values

Level: required

### Risk
Type hints can hide a bad external shape or unit at runtime.

### Applies
For files, deserialization, IPC and plugin inputs; trusted internal values need not gain a second validation library.

### Decision
Use current parsing/validation tools to establish shape, ranges, units and failure behavior before domain effects. Keep protocol values separate from domain calculations.

### Exceptions
Do not replace Ruff/mypy/pytest or add a Web schema package just to follow a guide. Use current supported Python syntax.

### Examples
Better: reject an invalid amount with an explicit error before state changes. Worse: assume a dict annotation makes untrusted JSON safe.

### Verification
Add invalid/boundary/success tests at the actual external-data consumer. The local import/resource test does not establish every validation rule.

### Sources
google-python — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-PY-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="cc-python-project-standard:context-cleanup"></a>
## Context managers cover partial acquisition

Level: required

### Risk
A later failure can skip earlier close or replace the original cause.

### Applies
When this unit acquires files/clients/contexts; borrowed collaborators retain their own lifecycle owner.

### Decision
Use the existing context-manager pattern or ExitStack for a variable acquisition sequence. Preserve exception chaining and close only resources successfully acquired by this operation.

### Exceptions
Async cancellation needs async-specific cleanup/propagation; do not swallow it in a broad fallback or introduce new Python features unsupported by the project.

### Examples
Better: second-stage failure unwinds the first acquired lease. Worse: close only after both acquisitions succeed.

### Verification
Run partial-failure, import and reverse-order success tests. Add actual close-failure/driver tests when those are relevant.

### Sources
google-python, oracle-resources — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-PY-01; case. [Local runnable example](../examples/engineering/README.md). Execution status and scope require actual records; a related ID does not prove every decision on this card.
