---
name: fec-review
description: Conduct a standardized review of the specified file or recently changed front-end code, output a graded review report and save it as a Markdown file.
---

Conduct a comprehensive review of the front-end code. Read the project status and diff first, and then output the findings with evidence; do not write guesses as blocking items. If you need to **combine git diff, reduce noise output by severity level (CRITICAL→LOW), and explicitly give Approve/Warning/Block conclusions**, you can entrust the **`fec-code-reviewer`** subagent to execute; if the changes are mainly **`.ts` / `.tsx` / `.js` / `.jsx`** and you need to run **typecheck/eslint**, PR merge readiness check and Special conclusions on TS/JS idioms can be delegated to **`typescript-reviewer`** (reported as `typescript-review-*.md`). Otherwise, continue to press this command and the `fec-code-review` Skill process.

## Execution steps

1. Determine the scope of the review:

   - If the user specifies a file path, review the specified file
   - If the user does not specify a file, run `git diff --name-only HEAD` to get a list of recently changed files
   - If there is no git change record, prompt the user to specify the file or directory that needs to be reviewed

2. Filter to only keep front-end related files (`.ts`, `.tsx`, `.vue`, `.js`, `.jsx`, `.css`, `.scss`, `.less`, `.html`)

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

   **Overall Rating**: Can be merged / merged after modification / needs to be refactored
   ```

5. Use the Write tool to save the report content as a Markdown file:
   - Directory: `reports/` in the project root directory (create it if it does not exist)
   - Filename: `code-review-YYYY-MM-DD-HHmmss.md` (use current timestamp)
   - Inform the user of the report file path after saving

6. If the user agrees to the modification, directly repair the items that can be automatically repaired in "Must Modify".