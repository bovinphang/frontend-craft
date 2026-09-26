---
name: fec-review
description: Conduct a standardized review of the frontend changes, specified files/directories, or the whole project, output a graded review report and save it as a Markdown file.
---

Conduct a comprehensive review of the front-end code. Read the project status and selected scope first (diffs only for change review), and then output the findings with evidence; do not write guesses as blocking items. If you need to **combine git diff, reduce noise output by severity level (CRITICAL→LOW), and explicitly give Approve/Warning/Block conclusions**, you can entrust the **`fec-code-reviewer`** subagent to execute; if the changes are mainly **`.ts` / `.tsx` / `.js` / `.jsx`** and you need to run **typecheck/eslint**, PR merge readiness check and Special conclusions on TS/JS idioms can be delegated to **`fec-typescript-reviewer`** (reported as `typescript-review-*.md`). Otherwise, continue to press this command and the `fec-code-review` Skill process.

## Review modes and coverage

User-specified scope takes precedence over the default. Follow the three modes in `fec-code-review`:

- **Change review**: only when recent changes, current edits, staged changes, a PR or a commit are explicitly requested or clearly established by the active task, review those changes and necessary context. For local changes, inspect staged and unstaged diffs and relevant untracked project files within the requested scope; a staged-only request reviews only staged changes. If there are no changes, report that there is nothing to review; do not switch to recent commits or expand scope automatically.
- **Targeted review**: when files or directories are specified, inventory and review existing code in that scope, including unchanged code; no Git diff is required.
- **Project review (default)**: when no scope or change context is specified, or when the entire project is requested, inventory project-owned frontend code, related tests, configuration and dependency declarations, then review in module batches, including unchanged code; no Git diff is required.

Select scope before collecting diffs. A file/directory alone means full review of that scope; a path combined with an explicit change request restricts incremental review to that path. An unqualified invocation defaults to project review even if Git changes exist. At review start, state the selected mode and target scope. When automatically delegating review after edits, pass the current change scope explicitly; do not trigger project review merely because the reviewer was called.

Exclude dependency directories, build outputs, caches, generated files and third-party code by default, and record exclusions. Keep the frontend responsibility boundary; this is not a backend audit. A nonexistent target or a scope with no relevant files must be reported explicitly, not replaced with another scope.

Merge findings with the same root cause across batches. Report **review mode, target scope, reviewed files/modules, exclusions, unreviewed files/modules, completion status and verification commands/results**. If context or execution limits prevent completion, mark the review partial and list remaining modules; never claim complete project coverage. Reading callers for context or running project-wide lint/typecheck does not count as manual review of those files.

Change reviews retain merge recommendations. Targeted and project reviews use a risk assessment (Low / Medium / High, with blocking findings), not a claim of merge readiness. Preserve severity levels, evidence requirements and report filenames. Output reports only unless repairs are explicitly requested.

## Execution steps

1. Select one of the three modes above and inventory target files. Default to project review when no scope or change context is specified; an incremental request with no changes must not trigger scope expansion.

2. Include frontend source, related tests, configuration and dependency declarations, rather than filtering only by source extensions; record default exclusions.

3. Use the review dimensions of `fec-code-review` Skill to check item by item:

   - Architecture (component boundaries, separation of responsibilities)
   - Type safety (any usage, props type)
   - Rendering and status (repeated rendering, key stability)
   - Style (Token usage, responsiveness)
   - Tailwind / design system (token, variant, dark mode, dynamic class)
   - Accessibility (semantics, ARIA, keyboard operation)
   - Maintainability (file size, naming, repetitive logic)
   - Testing (critical coverage, test patterns)
   - Security (XSS, sensitive information, input validation)
   - Performance (first screen dependencies, repeated requests, long tasks, large lists)
   - Dependency upgrade (lockfile, peer dependency, CVE, major version migration verification)

   Each question must include file location, impact, confidence level, and recommended verification method.

4. Output the review report in the following format:

   ```
   # Code review report

   > Generation time: YYYY-MM-DD HH:mm
   > Review tool: frontend-craft

   > Review mode: change / targeted / project
   > Target scope: paths or PR/commit
   > Reviewed: file or module inventory
   > Exclusions: paths and reasons
   > Unreviewed: remaining files or modules (state none if complete)
   > Completion: complete / partial
   > Verification: commands, results and reasons for skipped checks

   **Review Scope**: N documents

   ## 🔴 Must be modified (N items)
   - **[File:line number]** Problem description → Suggested changes

   ## 🟡 Suggested optimizations (N items)
   - **[File:line number]** Problem description → Suggested modifications

   ## 🔵 Optional optimization items (N items)
   - **[File:line number]** Problem description

   ## 🟢 Things done well
   -...

   ## Risk Level: Low / Medium / High

   **Conclusion**: Change review: merge recommendation; targeted/project review: Low / Medium / High risk and blocking findings
   ```

5. Use the Write tool to save the report content as a Markdown file:
   - Directory: `reports/` in the project root directory (create it if it does not exist)
   - Filename: `code-review-YYYY-MM-DD-HHmmss.md` (use current timestamp)
   - Inform the user of the report file path after saving

6. If the user agrees to the modification, directly repair the items that can be automatically repaired in "Must Modify".

## Usage examples

- `/fec-review`: review the entire project by default.
- `/fec-review review recent changes`: review only current changes.
- `/fec-review review src/components/Button.tsx`: review the specified file, including unchanged code.
- `/fec-review review src/features/`: review the specified directory.
- `/fec-review review the entire project`: inventory and review project-owned frontend code by module.

These are natural-language instructions, not new CLI flags.
