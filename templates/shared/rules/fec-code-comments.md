# Code comments

Use this document when writing or reviewing front-end implementations.

## Principles

- Intention is expressed first through **naming, type and structure**; comments are used to explain **why**, **constraints and background**, rather than reiterating what the code is doing.
- Avoid "zero comments in the entire file": Use **short** comments in **non-obvious** places to reduce the cost of accidental modifications, which is not inconsistent with "no nonsense comments".

## Situations that should be commented

- **Business or product rules**: permissions, display conditions, and the basis behind the verification logic (when related to requirements or domain agreements).
- **Non-intuitive implementation or trade-offs**: Why choose the current writing method (performance, compatibility, agreement with backend/third party, etc.).
- **External Contract**: Field meanings and mapping relationships related to interfaces, design drafts, enumerations or units.
- **Interim Solutions and Technical Debt**: `TODO` / `FIXME` should indicate expected closure or associated work orders (if any).
- **Easy pitfalls**: Third-party library version differences, the calling sequence that must be met, and known limitations.

## Situations to avoid

- Line-by-line translation of behavior that can be seen directly from the code.
- Annotations are chronically inconsistent with the implementation; misleading annotations are updated or deleted synchronously when the logic is modified.
- Use large comments to replace functions that should be extracted or types that should be completed.

## Format Suggestions

- The language is consistent with the existing comments in the warehouse (Chinese or English).
- Complex modules or components can use **1~3 lines** at the top of the file to describe responsibilities and key constraints; cross-package or externally exported APIs should use **JSDoc** to describe parameters, return values and side effects.
- Complex conditional branches or `useEffect`: If the dependency or triggering condition is not intuitive, use one line to describe the **triggering condition** or **invariant**.
- Temporary circumvention, compatibility with old systems or performance trade-offs must state reasons and exit conditions.

## Document synchronization

When modifying public commands, skills, agents, templates, report naming or installation paths, synchronize updates to README, runtime docs, project structure documents and multi-language instructions. Comments explain local code, and public documentation explains how the team uses capabilities. The two should not replace each other.
