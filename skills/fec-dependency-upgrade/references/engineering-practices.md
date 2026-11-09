---
practiceCards:
  - id: "fec-dependency-upgrade:compatibility"
    level: "recommended"
    sourceIds: ["google-review","typescript-publishing"]
    caseIds: ["EP-TS-01"]
    evidence: "review-only"
  - id: "fec-dependency-upgrade:artifact-consumer"
    level: "required"
    sourceIds: ["typescript-publishing","ms-playbook"]
    caseIds: ["EP-TS-01","EP-UI-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="fec-dependency-upgrade:compatibility"></a>
## Upgrade against evidenced compatibility needs

Level: recommended

### Risk
An isolated guide’s preferred version can expand a small task into a breaking toolchain migration.

### Applies
For dependency/framework upgrades and security fixes with an actual project need.

### Decision
Read manifest/lock, peer requirements, supported engines and migration notes. Choose a scoped compatible change, preserve rollback and document behavior/type/build impacts.

### Exceptions
A docs page showing a newer release is not authorization to upgrade. An example-only dependency stays isolated from CLI/product runtime dependencies.

### Examples
Better: pin a compatible DOM test environment in its own example. Worse: upgrade project Node/React/build tools only to run the example.

### Verification
Use current lint/type/build tests plus affected consumers and actual artifact checks; record unsupported environments rather than hiding them.

### Sources
google-review, typescript-publishing — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-TS-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="fec-dependency-upgrade:artifact-consumer"></a>
## The packed dependency is the delivery contract

Level: required

### Risk
Workspace success can conceal missing declarations, examples, locks or runtime files.

### Applies
For shipped packages and upgrades that change their consumed surface.

### Decision
Inspect actual tarball contents and exact version/integrity, install away from sibling sources, and validate supported consumers. Keep generated common content authoritative and coordinated across products.

### Exceptions
Do not overwrite a consumed/published version with different bytes or relax ownership checks to force an upgrade. Unpublished local candidates require explicit local evidence, not public-download claims.

### Examples
Better: both products consume the same immutable common archive/SRI. Worse: a file/link path to a neighbor silently supplies missing content.

### Verification
Run real packaging/consumer checks, compare source bytes and preserve user edits through migration. A passing React sample alone does not prove all distribution formats.

### Sources
typescript-publishing, ms-playbook — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-TS-01, EP-UI-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
