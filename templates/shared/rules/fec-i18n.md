# Internationalization (i18n) rules

This document applies whenever it involves user-visible copy, tooltips, form labels, error messages, or UI text. Please modify the locales path, library and key prefix according to the actual i18n solution of the project.

## Scope of application

- **Modern stack (React/Vue/Next/Nuxt, etc.)**: New or modified user-visible copy must follow the project i18n solution.
- **Legacy HTML/JS, progressive migration or coexistence of old and new**: The new code path must still meet the core principles; the legacy layer adheres to migration constraints to avoid expanding hard coding and confusing keys.

`src/locales/` is used below to refer to the actual copywriting resource directory of the project. Please replace it according to the warehouse convention.

## Core Principles

- User-visible copy in new application code must use i18n, and hardcoding Chinese or English strings is prohibited.
- i18n keys are organized by modules and named with dots, such as `order.list.empty`.
- Copies with the same semantics reuse the same key to avoid repeated definitions.
- Variables, plurals, dates, numbers and currencies are formatted using i18n capabilities without string concatenation.
- Search existing resources before modifying the copy, and give priority to reusing accurate keys.

## Copywriting and resource specifications

- `common.*` is used for cross-module common copywriting, such as confirm, cancel, submit, and loading.
- `module.component.*` is used for module-level copy.
- `validation.*` is used for form validation prompts.
- `error.*` for error messages.
- Each natural language corresponds to an independent resource file, and multiple languages are prohibited from being mixed in the same file or the same top-level multi-language object.
- Copywriting files must be saved in UTF-8; when the team has an agreement, priority will be given to UTF-8 without BOM to avoid garbled non-ASCII copywriting in Chinese, Japanese and other languages.
- When adding a key, the main language files that should be covered by the current function are updated simultaneously; if a language is temporarily missing, the gap must be explicitly recorded.

## Legacy code and migration scenarios

- No new user-visible hardcoding is added in legacy HTML or JS, unless the segment is purely static and the repository does not yet have access to the i18n path.
- When new code paths such as React/Vue add prompts, errors, buttons, and form labels, i18n must be used.
- When adding new sub-applications or modules, they should be consistent with the existing language file structure, namespace and lazy loading strategy.
- Keys are organized by page, module and semantics to avoid continuing to use historical abbreviations or meaningless segments.
- If the old key is only "usable but inaccurate", priority will be given to renaming the key and rewriting the translation, and parallel compatibility will not be maintained for a long time.
- Only introduce mapping layer or alias transition when the old key has become an external contract (fixed reference in backend, buried points, external documents, third-party integration, etc.).

## Implement constraints

- The specific calling methods of Vue, React, Next, and Nuxt are subject to the existing i18n library of the project, such as `vue-i18n`, `react-intl`, `react-i18next` or the framework's built-in solution.
- Do not directly write user-visible hard coding in components; tests can assert through key or final copywriting, but should avoid over-coupling with translation details.
- When lazily loading language packs, loading, fallback, and missing key behaviors must be predictable.
- Error, form, and empty state copy should express the user’s next step, not just translate technical errors.

## Checklist

- [ ] All newly added user-visible copy uses i18n key.
- [ ] The new key has been added to all language files that should be covered, and each language is maintained in separate files.
- [ ] The language resource file is UTF-8, and there will be no garbled characters when opened.
- [ ] key naming conforms to module, component, and usage conventions, and reuses existing semantics.
- [ ] Interpolation, complex numbers, dates, numbers, currencies are formatted using i18n.
- [ ] User-visible hardcoding not expanded in migration or hybrid stacks.
- [ ] The new code does not break existing namespaces, loading methods, and sub-app boundaries.

## Anti-pattern

- Write user-visible Chinese or English strings directly in templates or JSX.
- Use string concatenation instead of i18n interpolation.
- Hardcode toast, error or confirmation text in JS/TS logic.
- Different modules create different keys for the same meaning.
- Mixing multiple languages makes diffing, reviewing and on-demand loading difficult.
- Save copy files in non-UTF-8 or incorrect encoding.
- Long-term retention of multiple sets of parallel keys to accommodate historical abbreviations or poor naming.
