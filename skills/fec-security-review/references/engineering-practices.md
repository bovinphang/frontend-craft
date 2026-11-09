---
practiceCards:
  - id: "fec-security-review:input-trust"
    level: "required"
    sourceIds: ["electron-security","tauri-permissions"]
    caseIds: ["EP-IPC-01","EP-TS-01"]
    evidence: "review-only"
  - id: "fec-security-review:secret-boundary"
    level: "required"
    sourceIds: ["electron-security","google-review"]
    caseIds: ["EP-IPC-01"]
    evidence: "review-only"
---

# Local engineering decisions

Locate the actual role, toolchain and existing conventions, then read relevant [shared principles](common/engineering-practices.md). These conditions apply to this entry, not every project. Structure checks do not prove all semantics or execution.

<a id="fec-security-review:input-trust"></a>
## The UI is not the authority for privileged operations

Level: required

### Risk
A hidden control or renderer-provided role can conceal a missing trusted authorization boundary.

### Applies
For API/IPC/external data affecting privileged behavior, with the actual application role and platform.

### Decision
Locate the authoritative identity/permission owner, validate operation-specific data before effects and expose only the needed capability. Keep UI visibility and trusted enforcement distinct.

### Exceptions
Do not invent a network auth stack for a constrained local tool. Electron and Tauri have different concrete grant mechanisms; follow the relevant platform entry.

### Examples
Better: trusted main/server validates caller and scope before the effect. Worse: renderer supplies admin=true and the handler trusts it.

### Verification
Exercise allowed/denied and malformed calls with zero effects after rejection. Related handler/input samples do not prove every project’s authentication.

### Sources
electron-security, tauri-permissions — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-IPC-01, EP-TS-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.

<a id="fec-security-review:secret-boundary"></a>
## Only authorized public data crosses into the client

Level: required

### Risk
An overbroad bridge, bundle or error can reveal server/main-only data.

### Applies
For client/renderer-facing configuration, diagnostics and payloads; retain the project’s existing sensitive-data policy.

### Decision
Review permitted configuration names, build artifacts and boundary DTOs without printing credentials. Keep privileged keys/raw environment and internal exception details outside public payloads and logs.

### Exceptions
A variable prefix or hidden UI is not a secrecy boundary. Read sensitive values only when the authorized task truly needs them, and never paste them into review output.

### Examples
Better: main returns a restricted public result. Worse: expose process.env or an unrestricted error stack through a bridge.

### Verification
Inspect the actual authorized artifact/boundary and redaction paths using synthetic data. This is project policy informed by boundary guidance, not a claim that every corporate guide defines the same secret rules.

### Sources
electron-security, google-review — [registry and limits](common/engineering-practices.sources.json).

Evidence IDs: EP-IPC-01; review-only.  Execution status and scope require actual records; a related ID does not prove every decision on this card.
