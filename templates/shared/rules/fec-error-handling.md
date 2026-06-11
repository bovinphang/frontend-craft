# Error handling specifications

This document agrees on the resident boundaries of front-end error handling. React/Vue component boundary details are handed over to the corresponding framework skill, API error mapping and authentication refresh are handed over to `fec-api-integration`, and security-sensitive errors are handed over to `fec-security-review`.

## Error layering

| Hierarchy | Error type | Default handling |
| ---- | -------- | -------- |
| Global | Uncaught exceptions, Promise rejection | Capture, reporting, global downgrade UI |
| Routing / Page | Page-level rendering exception | Error Boundary / Frame error boundary + Page-level degradation |
| Module | Function module runtime exception | Module-level boundary + local degradation |
| Component/Request | Data request failure, operation failure | User-understandable prompts + recoverable actions |
| Form | Validation failure | Field-level error prompts and correction entry |

## Global and module boundaries

- Uncaught exception and Promise rejection monitoring should be registered at the application entrance and connected to the project error reporting platform.
- React uses the project's unified Error Boundary solution; business components remain functional and no new handwritten class component boundaries are added.
- Vue uses project-unified `app.config.errorHandler`, `onErrorCaptured` or framework-level error boundaries.
- Independent functional modules should have local downgrade capabilities, and module crashes should not cause the entire page to go blank.
- Error Boundary handles rendering exceptions; normal API failures should fall into the loading/error/empty/data state and recoverable operations.

## API error handling

- The request layer uniformly normalizes error shapes, and components do not directly parse backend exceptions, token refresh or retry strategies.
- Each type of error should have a clear next step: retry, log in again, modify input, return to the previous level, refresh conflicting data, contact support, or try again later.
- `401`, `403`, `404`, `409`, `422`, `429`, `5xx` and network errors should have distinguishable user prompts and log semantics.
- The UI can display request id / trace id to facilitate support troubleshooting, but must not expose internal stacks, SQL, service names, keys or sensitive fields.

## User experience

- Each data display area handles four states: Loading, Error, Empty, and Success.
- Global-level error pages provide paths to return to the home page, refresh or retry; module-level downgrades only affect this module; operation-level errors provide the next step.
- The retry strategy must be restrained: users’ manual retries are given priority, and automatic retries must have upper limits, backoff and stop conditions.
- Error prompts should retain what the user has entered to avoid losing the form or context due to failure.

## Error reporting

The reported content should include the error stack, page URL, browser/device information, user or session ID, operation context, request ID, and version information. Clean tokens, passwords, personal sensitive fields and large payloads before reporting.

## Anti-pattern

- Empty `catch` blocks swallow errors.
- All errors are reported with `alert()` or a vague toast.
- When the interface fails, there is no feedback from the UI, or the original exception from the backend is directly displayed to the user.
- Error Boundary has no retry or return path.
- Write repeated `try/catch` everywhere in the component instead of uniformly encapsulating request boundaries.
- Use Error Boundary to handle common API errors, making it impossible for users to understand or recover.

## Checklist

- [ ] Global uncaught exceptions and Promise rejections are listened to.
- [ ] Critical pages or modules have frame error boundaries and partially degraded UI.
- [ ] API requests have unified error normalization, hierarchical processing and recoverable actions.
- [ ] Data area override Loading / Error / Empty / Success.
- [ ] Error reports contain sufficient location information and do not leak sensitive data.
