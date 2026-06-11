---
name: fec-debug
description: Front-end problem diagnosis and repair: covering build failures, runtime errors, UI exceptions, and interface problems, using a unified diagnostic framework to classify problems by type.
---

Press `fec-debug-framework` to perform front-end problem diagnosis and repair. First classify the problem type (build/runtime/ui/api), and then enter the corresponding diagnosis module to perform the 5-step method (classification → collection → hypothesis → verification → repair). Complex or cross-type issues can be delegated to the **`fec-debugger`** subagent.

## Question type quick check

| Type | Typical Scenario |
| ------- | ----------------------------------------------- |
| build | lint/type-check/test/build/CI failed |
| runtime | JS exception, white screen, component rendering error, routing exception, state loss |
| ui | style misalignment, abnormal interaction, animation lag, responsiveness issues |
| api | Request failure, timeout, data inconsistency, CORS, cache issues |

## Execution steps

1. Read the problems described by users and classify the problem types according to `fec-debug-framework` Step 1.
2. Enter the corresponding diagnostic module and perform Step 2 to collect evidence.
3. Propose hypotheses based on evidence (Step 3) and verify them one by one (Step 4).
4. After confirming the root cause, perform minimal repair (Step 5) and run the affected verification command.
5. Output the diagnostic report to `reports/debug-YYYY-MM-DD-HHmmss.md`.

##Strong constraints

- Don't "fix" the problem by turning off rules, removing tests, or reducing type safety
- Not easily refactoring irrelevant code
- Don't guess at root cause when evidence is lacking
- It must be verified after repairing, you cannot just change it for accidents