# Responsive design rules

This document should be used whenever the task involves mobile adaptation, responsive layout, multi-device compatibility, touch targets or viewport behavior. This article only retains project-resident constraints; layout mode, container query, responsive tables, media and validation details are left to `fec-responsive-layout`.

## Core Principles

- **Mobile First**: Start designing for small screens and work your way up to large screens.
- **Content Priority**: Small screens give priority to core tasks, key operations and feedback, and secondary content is folded, postponed or entered into the detail layer.
- **Touch Friendly**: All interactive elements must adapt to finger operations, and key functions cannot rely solely on hover.
- **Performance first**: The mobile network and device performance are weak, so first-screen resources, charts, animations, and large lists should be restrained.
- **Container Aware**: Reusable components will first adapt to the container in which they are located, instead of assuming full page breakpoints.
- **Stable size**: Toolbars, table columns, checkerboards, card grids and counters need stable constraints to avoid layout jumps caused by state changes.

## Breakpoints and container strategies

- Default validation for 375px, 768px, 1024px, 1440px, and breakpoint intermediate values.
- Use mobile-first `min-width` breakpoint; do not write the desktop style first and then use `max-width` to supplement the mobile version.
- Tailwind prefixes are used from smallest to largest: default → `sm:` → `md:` → `lg:` → `xl:` → `2xl:`.
- Page-level structures can use breakpoints; reusable components that will be placed into sidebars, pop-ups, cards, or main content areas preferentially use container queries.
- `min-width: 0`, `minmax()`, `aspect-ratio` and explicit overflow strategies must be taken into account when grid/flex children contain long text, charts, code, media or tables.

## Touch target to interact with mobile terminal

- When space permits, interaction targets such as buttons, links, and close buttons must be at least 44x44px; compact tool interfaces must be at least operable.
- Avoid input box font size below 16px to prevent iOS Safari from automatically scaling.
- Fixed bottom bar, action bar, drawer and dialog box must consider safe area and virtual keyboard.
- Hover-only messages must have click, focus, or permanent visible alternatives.
- After switching between horizontal and vertical screens, the main operation, focus position, scroll container and error prompts should still be accessible.

## Data intensive area

- Tables, lists, boards, editors and canvases can be partially scrolled horizontally, but the page as a whole should not have unintentional horizontal overflow.
- Data-intensive views on the mobile terminal need to define column priorities first: main identification, status and main operations are retained first; low-priority fields enter details, expand rows or drawers.
- Small screens must still retain the ability to sort, filter, paging, and select.
- Virtual scrolling only solves the problem of DOM quantity and cannot replace information hierarchy design.

## Responsive media

- Images and videos must have stable size, `aspect-ratio` or container constraints to avoid pushing the layout after loading.
- Use `srcset`, `sizes`, `picture` or frame picture components when multi-size resources are needed to avoid downloading large desktop images on mobile devices.
- Media cropping must preserve the main information and do not crop out key areas of products, people, graphics or status to fill the card.

## Checklist

- [ ] 320-375px No horizontal overflow at page level.
- [ ] The reading order is reasonable after breakpoint switching, and the main operation is not hidden.
- [ ] Touch target, input font size, safe area, virtual keyboard and horizontal and vertical screen behaviors have been verified.
- [ ] loading, empty, error, disabled, hover/focus, long translation text and large numbers will not break the fixed format control.
- [ ] Column priority, partial scrolling, or mobile summary strategies for data-intensive areas.
- [ ] The size of first-screen media is stable, and non-first-screen media will not slow down the main path of the mobile terminal.
