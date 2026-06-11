# Design system rules

This document should be used whenever the task involves UI implementation, design draft conversion to code, style, design token, or component reuse. This article only retains the project's resident design constraints; product design direction, design system generation, page-level override, and UI QA details are handed over to `fec-ui-design`; Tailwind token, variant, dark mode and class management are handed over to `fec-tailwind-design-system`; responsive layout is handed over to `fec-responsive-layout`.

## Core priority

1. Reuse existing components.
2. Expand on existing components.
3. Create a new leaf component.
4. Only create new shared base components if there is good reason, clear boundaries, and if they will be reused.

## Product design direction

- Tool-type pages, SaaS backend, CRM, and operations desk: Prioritize quiet, dense, and scannable, and the core work area is directly displayed on the first screen.
- Brand page, portfolio, release page: It can be more expressive, but H1 should be the brand, product, object or category, and the description copy should be placed in the subtitle.
- Visualization, games, and creative tools: You can use stronger visual assets and animations, but you must keep the interaction controllable and the status clear.
- Every important interface should have a visual anchor that fits the business, such as real media, data form, industry material, font character, spatial organization or interaction rhythm.
- Bold design must serve the scene; high-frequency tools focus on efficiency and stability, and display-type pages focus on subject recognition and memory points.

Avoid:

- Turn daily high-frequency tools into marketing landing pages.
- Use purple gradient, decorative light spots, stacked cards, empty hero or non-contextual default font by default.
- Large areas of the page are card-based, especially card sets.
- Use visible explanatory text to explain the functions that common controls are supposed to express.
- Let the entire interface consist of only one shade of hue.

## Design draft conversion code rules

- When given design context, read the source of truth first through MCP or screenshots/annotations, and don’t rely on guesswork to determine layout, spacing, fonts, colors, or status.
- Colors, spacing, rounded corners, shadows, and fonts in the design should be mapped to existing tokens, CSS variables, theme variables, or component variants.
- Check existing component libraries and business components before creating new components and prioritize reuse.
- Default verification is mobile(375px), tablet(768px), desktop(1440px).
- Pixel restoration requirements are subject to the project agreement; if there is no agreement, the core structure, spacing, fonts, status and interaction will take precedence over mechanical pursuit of screenshot overlap.
- Before implementing complex design tasks, a brief implementation plan is given, describing reused components, new components, possible changed files, responsive strategies and token mapping.

## Design Token and style

- Prefer using existing design tokens, CSS variables, or theme variables; do not hard-code colors, rounded corners, spacing, shadows, and font values.
- When required tokens are missing, clearly point them out and centrally complete or record them, rather than scattering literals in multiple components.
- In the Tailwind project, tokens should be inherited through semantic `theme.extend`, CSS variables or component variants; do not copy specific values such as `blue-600` and `rounded-xl` into de facto standards.
- Component variants should distinguish semantic tone, size, density and state; do not let a string parameter carry multiple business meanings at the same time.
- Dynamic Tailwind classes must be recognized by build scans; use explicit objects, variant tools, or safelist for complex mappings.
- Prioritize the use of local, controlled styles instead of large-scale global coverage; be consistent with the project's existing CSS Modules, Tailwind, component libraries or style systems.

## Interface texture baseline

- Nested fillets maintain an optical relationship: the outer fillet is approximately equal to the inner fillet + spacing.
- Asymmetric graphics such as icon buttons, arrows, and playback triangles are fine-tuned according to the visual center.
- The hit area of the small control should be at least 40x40px, and 44x44px is preferred if space allows.
- `text-wrap: balance` can be used for titles and short texts, and `text-wrap: pretty` can be used for short and medium text.
- Use `font-variant-numeric: tabular-nums` for counters, prices, times, and tabular numbers.
- Animation only declares actual change attributes, prohibits `transition: all` and `will-change: all`, and respects `prefers-reduced-motion`.

## Dark mode

- Project-level dark mode only selects one main strategy: CSS variables, root node class, `data-theme` or component library theme.
- When supporting manual theme switching, user preferences must be initialized before the first screen is drawn to avoid theme flickering; the implementation details are left to Tailwind / design-system skill reference.
- Review disabled, focus, selected, invalid, skeleton, chart, form controls, third-party components and shadow levels for both light and dark colors.
- Don't just reduce the transparency to express disabled, don't just fill in the background color and ignore text, borders, charts and focus states.

## Accessibility Baseline

- Prefer semantic HTML.
- Form controls have labels and pure icon buttons have accessible names.
- Menus, tabs, dialog boxes and custom controls support keyboard operation.
- Focus styles are visible, title levels are correct, and real table data uses table semantics.
- Color contrast, touch targets, reduced-motion and error prompts cannot be destroyed by visual polish.

## UI task output

After the implementation is completed, explain what was reused, what was newly created, deviations from the design draft or project token, and what resources or interaction details are missing. Complex UIs should also account for state overrides, responsive validation, and remaining design risks.
