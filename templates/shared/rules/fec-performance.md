# Front-end performance rules

This document will be used whenever new pages, components, resource loading or data requests are added.

## Core Principles

- Lazy loading by default, loading on demand
- Reduce key resources on the first screen
- Avoid unnecessary re-rendering
- Follow Core Web Vitals
- The front-end build must verify the development experience and production products at the same time. You cannot just check whether the dev server is normal.
- Do not initiate large-scale performance refactoring when the context or task boundaries are unclear; locate bottlenecks first and then change the code
- Keep reviewable logs of long-running commands, using terminal sessions, CI artifacts, or test reports when necessary
- Each performance recommendation must be bound with evidence, scope of impact, verification methods and rollback risks

## Code splitting and lazy loading

### Routing level segmentation

```tsx
// React
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Vue
const Dashboard = () => import('./pages/Dashboard.vue');
```

### Component level segmentation

Only use component-level lazy loading in the following scenarios:

- Heavy-duty third-party libraries (charts, editors, maps)
- Large modules for conditional rendering (such as settings panel, advanced filtering)
- Content that is not in the visible area of the first screen

## Rendering performance

### React

- Use `React.memo` wisely to avoid unnecessary re-rendering
- `useMemo` / `useCallback` only makes sense if the dependency is stable and the subcomponent uses memo
- List rendering must use a stable `key`
- Avoid creating new objects, arrays or functions inside render functions

### Vue

- Use `computed` instead of `watch` + manual assignment
- Use virtual scrolling for large lists
- Avoid using `v-if` inside `v-for`
- Use `shallowRef` / `shallowReactive` to optimize large objects

## Resource optimization

- Images use WebP/AVIF format and provide appropriate sizes
- For icons, use SVG sprite or icon font first to avoid a large number of independent image requests
- Fonts are loaded on demand, use `font-display: swap`
- Third-party dependencies are imported on demand (such as `import { Button } from 'antd'` instead of `import antd from 'antd'`)

## Vite build and development performance

Additional compliance when using Vite:

- `vite build` does not do type checking, CI must execute `tsc --noEmit` separately or access `vite-plugin-checker`
- Use `vite --profile` to locate plug-in, parsing or pre-built bottlenecks before slow start
- Large projects can use `server.warmup.clientFiles` to warm up the core entrance
- CJS/UMD dependency interoperability issues are first handled through `optimizeDeps.include`
- For manual sub-packaging, use stable object form first, do not split each `node_modules` package into independent chunks
- Component library mode must externalize peer dependencies and produce type declarations separately
- `vite preview` is only used for local build smoke tests, not production servers

## Data request

- Avoid waterfall requests (serial dependencies), parallelize as much as possible
- Proper use of caching strategies (SWR/React Query/VueQuery)
- Paged loading or virtual scrolling for processing large data sets
- Anti-shake/throttle processing of high-frequency triggered requests (search, scrolling)

## Checklist

- [ ] Whether to record core routing, device, network and current metrics
- [ ] Whether the route is loaded on demand
- [ ] Whether heavy components are lazy loaded
- [ ] Whether to use virtual scrolling or paging for large lists
- [ ] Whether the image uses a modern format and reasonable size
- [ ] Whether third-party libraries are imported on demand
- [ ] Whether there is unnecessary re-rendering
- [ ] Whether the Vite project executes typecheck separately
- [ ] Whether the Vite build product has passed the `vite build` and local preview smoke tests
- [ ] Whether to review loading, error, empty, disabled and mobile status are not destroyed by optimization

## Anti-pattern

- Pack all routes in one chunk
- Load the entire chart library or editor on the first screen
- Create the same API request repeatedly within the component
- Large lists directly render thousands of lines of DOM without virtualization
- No anti-shake/throttling for frequent operations (such as input, scrolling)
- It is considered that passing `vite build` means that TypeScript has no errors
- Set `envPrefix: ""` or inject the server key into the client bundle
- Doing extensive “performance optimization” without first reproducing lag, packet size or Web Vitals indicators
- Remove status feedback, reduce accessibility, or sacrifice main path maintainability in pursuit of lab scores
