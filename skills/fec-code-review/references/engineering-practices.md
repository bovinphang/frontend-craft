---
practiceCards:
  - id: "fec-code-review:evidence-severity"
    level: "required"
    sourceIds: ["google-review"]
    caseIds: ["EP-UI-01","EP-TS-01"]
    evidence: "review-only"
  - id: "fec-code-review:review-scope"
    level: "recommended"
    sourceIds: ["google-review","ms-playbook"]
    caseIds: ["EP-TS-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="fec-code-review:evidence-severity"></a>
## Severity follows demonstrated user impact

Level: required

### Risk
Personal preference can become a false blocker, while an untested runtime risk goes unnoticed.

### Applies
For actual code/content review findings; read-only review does not imply permission to edit business code.

### Decision
Name a concrete trigger, affected location, observed/credible effect and smallest useful remedy. Grade impact and likelihood against project contracts, separating facts from hypotheses.

### Exceptions
A justified project convention can override corporate style. No evidence means uncertainty, not an invented reproduction or passing test.

### Examples
Better: explain how staleA replaces B and show the missing guard. Worse: block a change solely because another company formats it differently.

### Verification
Run available focused checks or state what was not run. Related examples illustrate evidence quality and do not constitute a review of arbitrary code.

### Sources
google-review — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01, EP-TS-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="fec-code-review:review-scope"></a>
## Review the actual task baseline and consumers

Level: recommended

### Risk
HEAD-only review can miss pre-existing uncommitted work, untracked source or generated delivery.

### Applies
For multi-repository or partially committed work with an explicit task boundary.

### Decision
Freeze the actual start baseline, identify owned changes and relevant consumers, then review source, generation declarations and real artifacts. Preserve unrelated edits and record coverage gaps.

### Exceptions
Follow the selected review workflow; a shared language rule is not a reason to spawn a reviewer for every entry. Do not mark skipped platform paths as verified.

### Examples
Better: compare against the recorded task baseline including new files. Worse: assume HEAD~1 contains the whole change.

### Verification
Check baseline/diff completeness and run risk-appropriate verification; independent final review remains distinct from author self-review.

### Sources
google-review, ms-playbook — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-TS-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
