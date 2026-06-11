# Skill Template Specification

> All Skills must follow the agentskills structure: directory name, frontmatter `name` and public skill id remain consistent; frontmatter only retains `name` and `description`.

---

## Directory structure

```text
skills/fec-[topic]/
  SKILL.md
references/ # Optional: detailed specifications, examples or manifests loaded on demand
scripts/ # Optional: scripts that require deterministic execution
assets/ # Optional: templates or resources that will be used in the output
```

## Frontmatter

```yaml
---
name: fec-[topic]
description: Use when ...
---
```

- `name` must equal the parent directory name.
- `description` is the main triggering basis, and "what to do" and "when to use" must be written clearly.
- Do not include fields other than `version`, `metadata` or trigger description in frontmatter.
- Start with `Use when ...` and include necessary English/Chinese keywords.

---

## Template structure

```markdown
# Skill: [Skill name]

## Purpose

In one sentence, explain what problem this Skill solves and what scenario it is intended for.

## Procedure

Step-by-step implementation guide with code examples for each step.

### 1. [Step title]

Instructions + Code Examples

### 2. [Step title]

Instructions + Code Examples

...

## Constraints

- Boundary conditions/Notes 1
- Anti-Pattern/Trap 1
- Performance / Security Constraints 1

## Expected Output

Make it clear what the output is and how to verify it.

```

---

## Writing specifications

### Purpose

- One sentence, no more than 30 words
- Describe what problem to solve, not how to solve it
- Example: "Manage form status, validation and submission to avoid performance issues with controlled components"

### Trigger and Boundary

- The trigger conditions are mainly written in frontmatter `description`, and the main text should not repeat the long `When to Use`.
- `description` must contain should-trigger scenarios and adjacent should-not-trigger boundaries.
- Example: `Use when building substantial forms with React Hook Form and Zod. Do not use for trivial 1-3 field forms without validation.`

### Capability Relations

- `SKILL.md` must be self-contained and cannot depend on another skill or agent to understand or execute.
- Do not add `Related Agent` in the skill body.
- Do not link to `../agents`, `../../agents`, `../skills`, or `../../skills` from the skill body.
- Related skills, boundary workflows and capability labels are maintained in `skills/relations.json`.
- Agents can reference skills in their own frontmatter `skills:` field; skills do not back-reference agents.

### Procedure

- Divided into steps according to the order of implementation, each step has a number and title
- Each step contains:
- 1-2 sentence description
- Runnable code examples (TypeScript preferred)
- Comments on key parameters
- For installation steps, the installation command is given first.
- Code examples follow the existing coding standards of the project
- Prioritize showing complete minimum runnable examples rather than fragments
- `SKILL.md` only retains the core processes required for each use; when it is close to **180-220 lines**, it will be split to `references/` first.
- Long codes, framework variants, advanced configurations, and evaluation checklists are placed into one layer of `references/` files and explicitly stated when to load from `SKILL.md`.

### Constraints

- List 3-6 key constraints
- Includes: performance pitfalls, security considerations, anti-patterns, compatibility limitations
- Each item is concise, with a brief explanation if necessary
- Example:
- Items in the virtual list are not in the DOM until scrolled and may not be indexed by search engines

### Expected Output

- Clearly state what the output is
- How to verify that the output is correct
- 1-3 sentences

---

## Code example conventions

- Use TypeScript (.tsx/.ts) unless the scenario explicitly requires JavaScript
- Follow React 18+ / Vue 3+ modern syntax
- Make variable and function names semantic and avoid abbreviations (unless it is an industry convention such as `ctx`, `ref`)
- Add inline comments to key lines to explain "why" rather than "what"
- Use `npm install` for the installation command (unlock the package manager)

---

## Progressive Disclosure

- `SKILL.md`: Sequence of operations, constraints, bounds and minimal examples required every time after triggering.
- `references/`: Detailed examples, framework variants, configuration templates and long checklists loaded on demand.
- Avoid writing the same description in both `SKILL.md` and reference; the main text is only for navigation.
- The reference is only placed one level, and the link must use a relative path.

---

## Trigger evaluation

Each skill maintains positive and negative samples for description optimization:

- `should_trigger`: 8-10 real user questions.
- `should_not_trigger`: 8-10 neighbor false trigger questions.
- High-overlapping skills preferentially cover React/Vue/Next/Nuxt, review/security/a11y, component/E2E/Storybook, and legacy/migration.

---

## File naming

- Directory format: `skills/fec-{topic}/`
- Required files: `skills/fec-{topic}/SKILL.md`
- Use lowercase and hyphens
- Example: `skills/fec-storybook-component-doc/`, `skills/fec-list-virtualization/`
