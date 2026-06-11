# TypeScript / JavaScript rules

Use this file when writing, modifying or reviewing `.ts`, `.tsx`, `.js`, `.jsx`. This article only retains the permanent hard constraints of the project; complex type modeling, `tsconfig` layering, declared products, DTO / view model boundaries, type testing and release entry design are left to the `fec-typescript-project-standard` skill or special review. See also `fec-code-comments.md` for comment style; see `fec-testing.md` for E2E and verification process.

## Types and interfaces

Use types to make external APIs, shared models, and component props explicit, readable, and reusable.

### Externally exported API

- For **export** functions, shared tool functions, and public class methods, indicate the parameter and return value types.
- **Local** variables are handed over to TypeScript for inference when the type is obvious, and obvious intermediate variables are not repeatedly annotated.
- Recurring inline object shapes are extracted into named `interface` or `type` to avoid the same contract being scattered in multiple signatures.
- The boundaries of external data, API DTOs, routing parameters, form values and component props must be explicitly named; complex modeling is offloaded to `fec-typescript-project-standard`.

### `interface` and `type`

- Object shapes that may be extended or `implements` take precedence over `interface`.
- **Union, intersection, tuple, map type, tool type combination** use `type`.
- Limited business values such as status, type, role, etc. are first combined with string literals; `enum` is only used when interoperability or team unified requirements are met.

### Function parameters: complex types should be named

- **Complex unions**, **inline object types**, **more complex callback signatures**, etc. on parameters should be extracted as named `type` / `interface` first, and then referenced in the function signature.
- Inlining in parameter positions is only allowed if the type is simple, short, readable at a glance, and has obvious no reuse value.
- Callback parameters and return values must be expressed clearly; do not use `Function`, wide objects or implicit `any` to undertake business contracts.

### Avoid `any`

- Avoid `any` in business code; existing `any` should not be spread casually.
- Use `unknown` for external or untrusted data, safely narrowed through `typeof`, `in`, `instanceof`, schema parse or custom predicate.
- Use generics when the type changes from caller to caller, but don’t introduce an incomprehensible layer of generics for simple scenarios.
- `as` type assertions are only used for explicit boundary interoperation or supplementary expressions after verified narrowing, and are not used to suppress type errors.

### React Component Props

- Define props with named `interface` or `type`, and offload complex public props to type modules.
- Write clear parameters and return values in callback props; event payload does not require long-term inlining of bare objects.
- Don't use `React.FC` without special reason, avoid differences such as implicit `children`.
- TSX generics, complex component props or external DTO mapping issues are left to React rules and `fec-typescript-project-standard` to converge together.

## Single file size and module splitting

- `.ts` / `.tsx` / `.js` / `.jsx` It is recommended that a single file be controlled within **about 300 lines**. This threshold is an empirical upper limit for maintainability and review efficiency, not a mechanical hard limit.
- When the file obviously exceeds this size and bears multiple responsibilities, priority should be given to splitting it by responsibility: data access, business rules, view rendering, adaptation layer, constants and mapping, and type definition.
- Prioritize extraction of pure functions, subcomponents, custom Hooks, `*.types.ts` type modules, and constant tables above the threshold; do not make meaningless segmentation just for the number of pressed lines.
- Acceptable exceptions: generated code, very thin re-export aggregation files, high cohesion modules confirmed by team review; exceptions are recommended to briefly indicate the reasons in the file header.

### Still a JavaScript file

- In `.js` / `.jsx`, if TS cannot be migrated in the short term, JSDoc can be used to complement the type, and the behavior will be consistent with the runtime.
- Do not introduce new implicit globals, loose objects, or unvalidated external inputs for migration convenience.

## Disable Magic Number / Magic String

- **It is prohibited** in business code to use **semantic** hard-coded numbers or strings to directly represent status, type, identity or business meaning, including `if` / `switch` / assignment / API field mapping.
- The fixed and limited value range must be defined at a single true source, and the name must be referenced in the entire warehouse to avoid the scattering of bare values.
- The front-end main path preferentially uses `as const` constant objects with literal unions; `enum` can be used when strongly bound to the back-end protocol or team agreement.
- Typical exceptions that do not fall under this article should still remain readable: pure algorithm subscripts, obvious `0` / `1` length judgments, UI scales that have nothing to do with business; if the visual value already has a design token, it should be changed to `fec-design-system.md`.

## Immutable updates

- Prioritize returning new objects or new arrays and avoid directly modifying parameters, props, store snapshots or cache objects.
- Data that should not be modified is first modeled as `readonly` / `Readonly<T>`.
- Large nested updates should use the project's existing state scheme or a clear reducer/helper, without stacking temporary mutable logic in components.

## Asynchronous and error handling

- Use `async` / `await` with clear error boundaries; don't swallow promise rejections.
- In `catch`, errors are treated as `unknown` and then narrowed down, and uniformly mapped to user-visible errors, log errors or domain errors that can be handled by the caller.
- Cross-border errors such as API, authentication, upload, and payment follow `fec-api-layer.md`, `fec-error-handling.md` and security rules, and are not handled nakedly in business components.

## Input verification

- External input (forms, APIs, URL parameters, localStorage, postMessage, third-party SDK callbacks, etc.) must be validated or narrowed at boundaries.
- You can use Zod, Valibot, Yup or similar schema tools selected by the project; do not introduce specific libraries as unconditional new dependencies.
- Schema derived types serve as a single source of truth for input types; layering of complex DTOs, domain models and UI view models is left to `fec-typescript-project-standard`.

## Type asset layering and naming

- Module or feature-specific types use `*.types.ts` and are placed in the same directory as the implementation file or in the same feature directory.
- Global and environment-related declarations are placed in `global.d.ts`, `env.d.ts` or `types/*.d.ts`, only for true global or ambient declarations, and do not put modular types into globals.
- For import and export of types only, use `import type` and `export type` first to reduce value space ambiguity and improve compilation semantic clarity.
- Types that have the same origin as the API DTO are placed in the corresponding feature or API subdirectory to avoid scattering large anonymous types within the page or component implementation.
- `index.ts` aggregate exports should be kept shallow and organized according to feature boundaries to avoid deep barrels causing circular dependencies and unnecessary coupling.

## Engineering and idiom additions

- When both literal preservation and structure verification need to be met, use `satisfies` first, and then consider type assertions.
- Use discriminant unions to express clear states; use `never` checks when exhaustiveness is required for critical branches.
- New business code uses ES Module by default; `namespace` and triple slash directives are only used to declare merge or legacy interop scenarios.
- When extending third-party types, use independent declaration files and extend them through local `declare module` to avoid polluting the global implementation file.
- `tsconfig`, package exports, declaration files, path aliases and public API types belong to the deep water area of TypeScript project specifications and are not expanded within this rule.

## Logs and `console.log`

- Avoid legacy `console.log` in the production path; use the project's unified logging scheme.
- Debug logs should be deleted before submission, or prompted by the team toolchain via lint/hook/CI.

## Keys and sensitive configurations

- **Prohibited** Hardcoding keys, tokens, private keys, or real credential examples in source code.
- Configuration must be read via environment variables or build-time injection, and fail explicitly if missing or provide a clear downgrade strategy.
- When authentication, payment, uploading, third-party scripts or sensitive data processing are involved, special reviews will be conducted in conjunction with project security specifications.

## Relationship with test rules

When type changes affect public APIs, DTOs, external input narrowing, or business-critical branches, typechecks, type tests, component tests, or consumer fixtures should be supplemented. The end-to-end coverage method of key user paths (Playwright, Cypress, Page Object, etc.) is subject to `fec-testing.md`; this document does not repeat the E2E details.

## With the `typescript-reviewer` subagent

When conducting a special review of **`.ts` / `.tsx` / `.js` / `.jsx`** (run typecheck / eslint first, PR merge readiness check, graded conclusion), you can entrust the plug-in's built-in **`typescript-reviewer`** subagent; its report is written by default `reports/typescript-review-YYYY-MM-DD-HHmmss.md`, the bottom line of the rules is still based on this file and the project `CLAUDE.md`.
