# Evidence-driven diagnosis

Use five steps to establish a root cause before applying a fix.

1. **Classify:** describe the observable failure, impact, version, environment and minimal reproduction. Identify the relevant subsystem using project evidence. Cross-layer failures start from the visible symptom and trace across boundaries.
2. **Collect:** reproduce with the smallest failing command or operation; collect necessary logs, traces, state, configuration and recent changes. Redact credentials and sensitive payloads. A domain adapter supplies stack-specific probes.
3. **Hypothesize:** keep at most three hypotheses ranked by evidence. Each states "X causes Y; Z can confirm or falsify it." Do not substitute a symptom or speculative repair for a cause.
4. **Verify:** vary one factor at a time, start with the strongest hypothesis and record confirmed/falsified/pending. If all are falsified, collect more evidence. Three consecutive failed verifications of the same hypothesis require reporting the block rather than repeating it.
5. **Fix and validate:** apply the smallest confirmed repair, preserve a regression reproduction and run affected then broader existing checks. Report baseline failures separately; do not disable tests or weaken validation to claim success.

For dependency or environment failures, compare exact toolchain/dependency versions, lockfile and CI/local differences before upgrading packages. Keep migrations separate from ordinary defect repairs. Avoid adding retries, changing timeouts or suppressing errors without proving the cause and the intended semantics.

Deliver `reports/debug-YYYY-MM-DD-HHmmss.md` with symptom and reproduction, evidence, hypothesis/result table, root cause, modified files/behavior, executed verification, residual risk and the next useful action. Do not claim a fix or a green suite without observed results.
