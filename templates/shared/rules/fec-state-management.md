# Status management specifications

This document stipulates that the front-end status belongs to the bottom line. State manifests, Store shape examples, URL states, persistence adapters, and SSR isolation details are left to `fec-state-management`; request caching details are left to the data fetch workflow; and form fields and validation are left to the form workflow.

## Status classification

| Type | Example | Default Attribution |
| ---- | ---- | -------- |
| Local UI state | modal switch, tab, expand row, hover editing state | In-component state / ref |
| Form status | Input value, dirty field, validation error, submitting | Form library or form component |
| Server status | List, details, paging results, remote errors | Request cache library |
| URL status | Search terms, filter, sort, page number, selected tab | Routing parameters / search params |
| Global client status | Login users, topics, permission snapshots, shopping cart drafts | Global store |
| Browser persistent state | Preferences, non-sensitive drafts, offline queues | Storage layer + state adapter |

## Core Principles

- **Own first, choose library later**: Don’t choose Redux, Zustand, Pinia or Context first; determine the unique owner of each state first.
- **Nearest Management**: The state is placed in the nearest common ancestor that needs it.
- **Single Data Source**: The same data is maintained in only one place.
- **Derivation is better than synchronization**: Values that can be derived from props, server state, URL or existing state, do not save a new copy.
- **Minimum global state**: The global store only saves client state that is truly cross-page, cross-feature, or requires unified action.

## React state boundaries

- Use `useState` / `useReducer` for single components or small subtrees.
- Low-frequency global configuration, theme or dependency injection can use Context; large objects that change frequently should not be placed in Context.
- For moderately complex business states, Zustand, Jotai or existing warehouse solutions can be used; for large and strict action flows, Redux Toolkit can be used.
- Server-side data uses the request cache library and is not copied to the global store.

## Vue state boundary

- Use `ref` / `reactive` / `computed` for local state.
- Use `provide/inject` for local cross-level context.
- Global business status uses Pinia or the existing store of the project.
- Server-side data is first managed using the request library or composable and is not written to Pinia intact.

## URL and persistent state

- When searching, filtering, sorting, paging, selecting tabs, etc., the view state that needs to be shared or refreshed should be given priority to the URL.
- Browser persistence only saves stable preferences or non-sensitive drafts, and clearly identifies field whitelists, version numbers, migration paths, expiration policies, and sensitive field exclusions.
- In SSR scenarios, do not create a single instance store with user data at the top level of the module; each request requires an independent instance.

## Anti-pattern

- Put all state into global store.
- Store UI temporary state or each field of the form in the store.
- Manually synchronize multiple copies of the same data instead of deriving from source state.
- Store the server response intact in the global store without requesting the cache library.
- Use Context / provide to carry large objects that change frequently, resulting in large-scale re-rendering.
- Persistent tokens, permission details, personal sensitive data or unversioned large objects.

## Checklist

- [ ] Each state has a clear ownership: local / form / server cache / URL / global store / browser persistence.
- [ ] Derivable values are not stored as independent state.
- [ ] The global store only contains data that is truly shared across boundaries.
- [ ] Server-side data is managed through the request library, and refreshes, rollbacks, permission changes, and error states can still be recovered.
- [ ] URL state is synchronized with route parameters, and refresh and share behavior is as expected.
- [ ] Persistence status has whitelist, version, migration and sensitive field exclusions.
