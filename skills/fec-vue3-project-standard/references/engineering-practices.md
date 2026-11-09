---
practiceCards:
  - id: "fec-vue3-project-standard:watcher-cleanup"
    level: "conditional"
    sourceIds: ["vue-watchers"]
    caseIds: ["EP-UI-01"]
    evidence: "review-only"
  - id: "fec-vue3-project-standard:stale-results"
    level: "conditional"
    sourceIds: ["vue-watchers","react-effects"]
    caseIds: ["EP-UI-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="fec-vue3-project-standard:watcher-cleanup"></a>
## Register cleanup under the actual watcher owner

Level: conditional

### Risk
An invalidated watcher may keep old work or an asynchronously created watcher may outlive its component.

### Applies
For watchers that start external work; synchronous setup-owned watchers and externally created watchers have different lifetimes.

### Decision
Register cancellation/cleanup before suspension and retain stop ownership where automatic component ownership does not apply. Match onCleanup/onWatcherCleanup to installed Vue.

### Exceptions
onWatcherCleanup requires Vue3.5+ and synchronous registration. Use a supported callback cleanup on older Vue3 rather than upgrading the project for this rule.

### Examples
Better: invalidation cancels this watcher’s request. Worse: register cleanup only after awaiting old work, or assume every external watcher auto-stops.

### Verification
Run the consuming project’s real Vue watcher/unmount tests with controlled completion. The React case is related evidence, not Vue runtime validation.

### Sources
vue-watchers — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="fec-vue3-project-standard:stale-results"></a>
## Invalidate stale watcher publications

Level: conditional

### Risk
Abort may be ignored and an older async callback can still publish into a newer state.

### Applies
For latest-only reactive views; independent mutation results must not be discarded indiscriminately.

### Decision
Use owner-scoped identity/liveness around success/error/finally and the current reactive inputs. Keep dependencies explicit instead of relying on post-await dependency discovery.

### Exceptions
Shared query work is owned by its query layer. Do not stop all consumers from a single component or transplant React hook syntax into Vue.

### Examples
Better: B survives a late A completion after invalidation. Worse: a generic cancellation flag is assumed to stop every underlying operation.

### Verification
Use actual Vue utilities to control A/B order, error and unmount. Structural cards and React tests do not substitute for Vue execution.

### Sources
vue-watchers, react-effects — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-UI-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
