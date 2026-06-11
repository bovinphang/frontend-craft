# API layer specification

This document applies whenever HTTP requests, interface calls, data retrieval, or error handling are involved.

## Core Principles

- Requests and responses must have type definitions
- Unify error handling without repeating try-catch in each component
-Separation of API layer and UI layer
- Sensitive operations (deletion, payment) must require a second confirmation

## Directory structure

<!-- Please adjust according to the actual situation of the project -->

```
src/
├── api/ # API definition layer
│   ├── modules/
│ │ ├── user.ts # User related interface
│ │ ├── order.ts # Order related interface
│   │   └── ...
│ ├── types/ # Request/response type
│   │   ├── user.types.ts
│   │   └── order.types.ts
│ └── request.ts # Unified request encapsulation
```

## Type specification

```typescript
//Request parameter type
interface GetUserListParams {
    page: number;
    pageSize: number;
    keyword?: string;
    status?: UserStatus;
}

//Response data type
interface GetUserListResponse {
    list: User[];
    total: number;
    page: number;
    pageSize: number;
}

// API function signature
export function getUserList(params: GetUserListParams): Promise<GetUserListResponse>;
```

Requirements:

- Disallow the use of `any` as a request parameter or response type
- Use TypeScript enum or union type for enumeration values
- Pagination parameters and response format remain unified

## Error handling

### Unified Interceptor

Unified processing at the request encapsulation layer:

- 401: Jump to login or refresh token
- 403: Prompt No Permission
- 500: Display general error message
- Network error: Display network exception prompts

### Business error

- Separate business error codes and HTTP status codes
- Business error messages use i18n key (if internationalization is supported)
- Errors that require user action (such as form validation failure) are handled by the caller

## Loading / Error / Empty status

Each data request scenario needs to be considered:

- **Loading**: Load skeleton/spinner for the first time, subsequent refreshes will not block the UI
- **Error**: display error message + retry button
- **Empty**: Display empty status placeholder + boot operation

## Checklist

- [ ] Request parameters and responses have clear types
- [ ] Error handling does not rely on each component's own try-catch
- [ ] Loading / Error / Empty three states have been processed
- [ ] Sensitive operations have secondary confirmation
- [ ] Token/authentication information is not passed in clear text in the request URL
- [ ] Use paging or streaming loading for large amounts of data

## Anti-pattern

- Use `fetch` / `axios` directly in components without unified encapsulation
- Use `any` for request parameters or responses
- Ignore error handling and only handle success scenarios
- Splice token into URL
- Pass sensitive data in GET requests
- The same interface is repeatedly defined in multiple files
