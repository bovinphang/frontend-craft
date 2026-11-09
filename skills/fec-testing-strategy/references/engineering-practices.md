---
practiceCards:
  - id: "fec-testing-strategy:risk-layer"
    level: "recommended"
    sourceIds: ["ms-playbook","ms-faults"]
    caseIds: ["EP-UI-01"]
    evidence: "review-only"
  - id: "fec-testing-strategy:real-boundary"
    level: "required"
    sourceIds: ["ms-faults","react-act"]
    caseIds: ["EP-UI-01","EP-IPC-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="fec-testing-strategy:risk-layer"></a>
## Choose the smallest layer that observes the risk

Level: recommended

### Risk
Broad expensive suites can miss the actual failure while trivial change-detectors create noise.

### Applies
For new behavior, meaningful regressions and release risk; reversible copy/spacing edits do not automatically need new tests.

### Decision
Map risk to static, unit, component, integration or E2E evidence using existing tools. Keep assertions on user-visible state or real boundary effects, not helper internals or mocked existence.

### Exceptions
A controller unit test is useful but not a React-rendering test. Do not replace the repository framework just to imitate a playbook.

### Examples
Better: control A/B Promise order and assert actual DOM state. Worse: assert source contains a guard or only count a mock callback without its boundary effect.

### Verification
Verify the test can fail for the intended bug, then passes after repair; broaden only for changed risk, failures or remaining concerns.

### Sources
ms-playbook, ms-faults — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="fec-testing-strategy:real-boundary"></a>
## Report exactly the execution that occurred

Level: required

### Risk
Missing tools, zero tests or a static manifest can be mislabeled as a runtime success.

### Applies
For verification and delivery claims across component, native desktop and service boundaries.

### Decision
Separate preparation from behavior, use fixed assertions for defective/protected runs, record names/counts/commands and maintain explicit MISSING/NOT RUN scopes. Use actual act/DOM updates when claiming React behavior.

### Exceptions
JSDOM is not browser E2E, Node handlers are not Electron GUI, and a real HTTP process is not a live database/distributed guarantee.

### Examples
Better: a named behavioral assertion fails, then the same group passes. Worse: grep a PASS string after a loader failure or all-skipped run.

### Verification
Inspect raw logs and artifact/source hashes, confirm nonzero real tests and separate platform evidence. Do not manufacture a failing old model answer to claim improvement.

### Sources
ms-faults, react-act — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01, EP-IPC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
