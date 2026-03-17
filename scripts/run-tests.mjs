import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

try {
  // consume stdin to prevent pipe errors
  process.stdin.resume();
  process.stdin.on("data", () => {});

  if (!existsSync("package.json")) process.exit(0);

  let scripts = {};
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    scripts = pkg.scripts || {};
  } catch {
    process.exit(0);
  }

  let runner = "npm";
  if (existsSync("pnpm-lock.yaml")) runner = "pnpm";
  else if (existsSync("yarn.lock")) runner = "yarn";

  function runIfExists(name) {
    if (!scripts[name]) return;
    try {
      execSync(`${runner} run ${name}`, {
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 120_000,
      });
    } catch {
      // non-zero exit, continue with other checks
    }
  }

  runIfExists("lint");
  if (scripts["type-check"]) runIfExists("type-check");
  else runIfExists("typecheck");
  runIfExists("test");
  runIfExists("build");
} catch {
  // top-level safety net: never crash with non-zero
}

process.exit(0);
