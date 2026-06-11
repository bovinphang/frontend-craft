---
name: fec-security-review
description: Use when reviewing frontend security risks such as XSS, CSRF, sensitive data exposure, unsafe DOM APIs, untrusted user input, authentication/token handling, payment flows, file upload, CSP, dependency risk, or third-party scripts; Chinese triggers include security review, security check.
---

# Front-end security review

## Purpose

Identify client-side security risks in front-end code and recommend actionable fixes.

## Procedure

1. First confirm the review areas: user input, dynamic HTML, URL jump, authentication status, RBAC, file upload, payment/deletion and other sensitive operations, third-party scripts and dependencies.
2. Search for high-risk patterns: `dangerouslySetInnerHTML`, `v-html`, `innerHTML`, `document.write`, dynamic script, unverified redirect, and plain text token.
3. Review by risk type: XSS, CSP, sensitive data, CSRF, dependencies, input validation, file upload, open redirection, authentication authorization and third-party scripts.
4. Use the boundary model to determine responsibility: The client can only improve the experience and reduce misuse. Authentication, authorization, upload trust and sensitive operations must be finalized by the server.
5. High-risk issues are marked as blocking merges; front-end verification can only improve the experience and cannot be used as the only security boundary.
6. Output a hierarchical security report; see [references/report-template.md](references/report-template.md) for the report format.

## Detailed reference

- Load [references/security-checklist.md](references/security-checklist.md) when XSS, CSP, sensitive data, CSRF, dependencies and input validation details are required.
- When writing a security review report, load [references/report-template.md](references/report-template.md).

## Constraints

- Don't bypass security mechanisms to facilitate development.
- Don't rely on front-end validation as your only line of security.
- Do not trust any data coming from the client.
- High-risk issues must be marked as blocking merges when found.
- Separated from general code quality review: This skill focuses on threats, attack surfaces, and data breaches.
- Do not mechanically equate dependence on audit results with exploitable vulnerabilities; judgments need to be made based on the running path, exposure surface and repair cost.
- Do not treat hidden buttons, front-end route guards, or local role fields as authorization boundaries; APIs, SSR loaders, server actions, and sensitive operations must have server-side arbitration.

## Expected Output

Output a CRITICAL/HIGH/MEDIUM/LOW graded security review report. Each issue is associated with a specific file and line number, and repair suggestions are given; the report is saved as `reports/security-review-YYYY-MM-DD-HHmmss.md`.
