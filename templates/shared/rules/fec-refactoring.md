# Refactor project rules

This document applies when the task involves refactoring, migrating, or rewriting front-end code from an existing project.

## Target

- **Visual and interactive**: consistent with the original project, no perceived difference by users
- **Code Quality**: more concise, easier to maintain, and in line with the target framework specifications
- **Business functions**: consistent with the original project, **no missing functions**; behaviors before and after reconstruction are equivalent

## Pictures and Icons

- Directly use the image resource path of the original project without rehosting or replacing it.
- SVG images (`<img src="*.svg" />` or CSS `background-image`) can be used, **inline SVG is prohibited** (`<svg>...</svg>` written directly in the component)
- **If the original project uses iconfont or IcoMoon icons, continue to use them** during reconstruction to keep the icon system consistent; do not replace it with other icon schemes
- For icons, priority is given to using existing icon files in the original project (iconfont / IcoMoon / existing SVG). If necessary, SVG files can be introduced as independent resources

## Style

- The layout style aligns with the visual effects of the original project, but **only refers to the original project effects and does not copy its CSS**
- Prioritize the use of **flex elastic layout** to avoid `float`, complex `position`, and redundant nesting
- Avoid unreasonable writing methods: `!important` abuse, excessively deep selectors, and repeated definitions
- **Inline styles are prohibited in components** (`style={{ ... }}` / `style="..."`). Styles are unified in CSS Modules, Tailwind classes or style files for easy maintenance.

##Strong constraints

- The business functions are completely equivalent to the original project and must not be missing.
- Images use original project resources, no inline SVG; if the original project uses iconfont/IcoMoon, continue to use it
- The style refers to the original project effect but does not copy CSS, giving priority to flex layout, no inline style
- Establish a behavior list for public APIs, routing, events, hidden points, permissions, caches and error status, and check them one by one before and after reconstruction
- For migrations involving pages, components, routes, forms, pop-ups, navigation or key user processes, Playwright or equivalent real browser verification methods must be used to compare and verify the critical paths.
- For visually sensitive pages, screenshot comparison or manual screenshot acceptance should be supplemented; dynamic content, animation, fonts and environmental differences need to be clearly blocked, stabilized or explained
- For pure logic, type, build or no UI migrations, Playwright is not mandatory and a validation layer closer to the risk should be chosen: type-check, unit test, component test, build or lint
- The verification goal is not to be completely consistent at the pixel level, but to confirm that there are no missing business functions, key interactions are equivalent, there are no unexpected deviations in the main visual layout, and the code is clearer and maintainable than the old implementation.

## Dead code cleanup

When cleaning unused code, exports, styles or dependencies:

- Establish a verification baseline first, then clean it up.
- Use tools or search for evidence that candidates have no citations.
- Classify candidates into SAFE, CAUTION, and DANGER.
- Only SAFE items are automatically sanitized; routing, configuration, runtime templates, dynamic imports, and public APIs are considered high risk by default.
- Run affected verification command after each batch cleanup.
- If the verification fails, return to the most recent batch of candidates and do not continue to expand the scope of cleaning.

Don’t mix dead code cleanup with feature rewrites, visual tweaks, or dependency upgrades in the same change.
