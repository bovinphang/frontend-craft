# API 集成实现模式

## Typed Fetch Client

```ts
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`API request failed with ${status}`);
  }
}

export async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
```

## User-Facing Error Mapping

```ts
export function getApiMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "Something went wrong. Please try again.";

  if (error.status === 401) return "Please sign in again.";
  if (error.status === 403) return "You do not have permission for this action.";
  if (error.status === 404) return "The requested item no longer exists.";
  if (error.status === 409) return "This change conflicts with newer data.";
  if (error.status === 422) return "Please check the highlighted fields.";
  if (error.status === 429) return "Too many requests. Please wait a moment.";

  return "The service is unavailable. Please try again later.";
}
```

## Upload Selection

| Need | Prefer |
| --- | --- |
| Small avatar or CSV | Multipart request |
| Large video or archive | Presigned direct upload |
| Unstable network and large files | Resumable chunk upload |
| Compliance scanning before storage | API-mediated upload with size limits |

## Realtime Selection

| Need | Prefer |
| --- | --- |
| Job progress or notifications | SSE |
| Chat, presence, collaboration | WebSocket |
| Status every few seconds | Polling |
| AI token stream from server | SSE or fetch stream |

## Review Checklist

- API URL and credentials are centralized.
- Client has behavior for 204, non-JSON errors, cancellation, and offline state.
- Auth refresh cannot create request storms.
- Components consume hooks/domain functions instead of raw fetch.
- Upload and realtime flows expose progress, cancellation, failure, and retry states.
