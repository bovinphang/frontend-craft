import { execSync } from "node:child_process";
import { platform } from "node:os";

process.stdin.resume();
process.stdin.on("data", () => {});

const os = platform();

try {
  if (os === "darwin") {
    execSync(
      'osascript -e \'display notification "Claude Code 任务完成" with title "Claude Code"\'',
      { stdio: "ignore" }
    );
  } else if (os === "linux") {
    execSync('notify-send "Claude Code" "Claude Code 任务完成"', {
      stdio: "ignore",
    });
  } else if (os === "win32") {
    execSync(
      `powershell -NoProfile -Command "[console]::beep(600,300); Write-Host 'Claude Code 任务完成'"`,
      { stdio: "ignore" }
    );
  }
} catch {
  // notification failed, not critical
}

process.exit(0);
