#Rendering mode selection

Reference this document when a project needs to select or evaluate CSR/SSR/SSG/ISR/RSC. This article only retains cross-framework decision constraints; Next.js App Router details are left to `fec-nextjs-project-standard`, Nuxt details are left to `fec-nuxt-project-standard`, and performance evidence is left to `fec-performance-optimization`.

## Rendering mode overview

| Mode | Generation timing | Typical application |
| ---- | -------- | -------- |
| CSR | Browser runtime | Post-login backend, internal tools, high-interaction SPA |
| SSR | Server-side on request | SEO-critical and real-time content public page |
| SSG | Build-time | Documentation, blogs, marketing pages, slow-changing public content |
| ISR | Build time + regenerate on demand | Large number of pages, frequent content updates but allow for delays |
| RSC | Server-side component rendering | Scenarios where client-side JS needs to be reduced in Next.js App Router |

## Selection principles

- SEO is a must and content is live: Prioritize SSR and be clear about caching, timeouts and error degradation.
- SEO is required and the content is stable: Prioritize SSG; consider ISR when the number of pages is huge or updates are frequent.
- Backend after login, strong interaction workspace, internal tools: priority CSR, public login/registration page can be separate SSG/SSR.
- Hybrid product: Public pages and private pages can adopt different models without sacrificing experience or cost for a unified architecture.
- Number of pages, update frequency, server cost, deployment platform, caching strategy and team operation and maintenance capabilities must be evaluated together.
- RSC is only used in supported frameworks and routing architectures; client interactions, browser APIs, and high-frequency states are still placed in client leaf components.

## Implement constraints

- SSR/RSC paths must not directly depend on `window`, `document`, localStorage or browser-specific libraries.
- HTML, time, random numbers, user preferences and media query results before and after hydration should be consistent to avoid hydration mismatch.
- Server-side data retrieval must have timeout, error degradation and caching strategies.
- SSG/ISR needs to clarify the non-prerendered path, revalidate/invalidation strategy and rollback method.
- Client-side large animation libraries, charts, editors, maps, WebGL/Canvas, etc. should be loaded on demand without entering the root layout synchronization bundle.
- No longer assert that a route is "cached" or "must be dynamic" without evidence of response headers, build output, traces, route behavior, or online metrics.

## Checklist

- [ ] Clarify public pages and private pages, SEO requirements and real-time requirements.
- [ ] Clarify the reasons for using CSR / SSR / SSG / ISR / RSC for each type of page.
- [ ] Evaluate page count, build times, server costs, and cache invalidation strategies.
- [ ] Check that SSR/RSC code has no browser API dependencies and non-serializable props.
- [ ] Confirm that loading, error, not-found, offline and permission states are not lost across render modes.
- [ ] Verify the final schema with build output, response headers, traces, or routing behavior.
