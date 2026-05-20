import { execSync } from "node:child_process";
import { platform } from "node:os";

process.stdin.resume();
process.stdin.on("data", () => {});

const os = platform();

try {
  if (os === "darwin") {
    execSync(
      'osascript -e \'display notification "Claude Code 浠诲姟瀹屾垚" with title "Claude Code"\'',
      { stdio: "ignore" }
    );
  } else if (os === "linux") {
    execSync('notify-send "Claude Code" "Claude Code 浠诲姟瀹屾垚"', {
      stdio: "ignore",
    });
  } else if (os === "win32") {
    execSync(
      `powershell -NoProfile -Command "[console]::beep(600,300); Write-Host 'Claude Code 浠诲姟瀹屾垚'"`,
      { stdio: "ignore" }
    );
  }
} catch {
  // notification failed, not critical
}

process.exit(0);
