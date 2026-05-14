/**
 * Desktop notifications usually require invoking external programs; OpenClaw avoids that in plugin sources.
 * Best-effort: terminal bell + stderr line (visible in gateway logs).
 */
export function notifyTaskComplete(title = "OpenClaw", body = "任务完成"): void {
  try {
    process.stdout.write("\x07");
  } catch {
    /* optional */
  }
  try {
    process.stderr.write(`[${title}] ${body}\n`);
  } catch {
    /* optional */
  }
}
