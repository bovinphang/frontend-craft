import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

type PackageScripts = Record<string, string>;

try {
  // consume stdin to prevent pipe errors
  process.stdin.resume();
  process.stdin.on("data", () => {});

  if (!existsSync("package.json")) process.exit(0);
  const blocking = process.env.FRONTEND_CRAFT_VALIDATION_MODE === "blocking";
  let failed = false;

  let scripts: PackageScripts = {};
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8")) as { scripts?: PackageScripts };
    scripts = pkg.scripts ?? {};
  } catch {
    process.exit(0);
  }

  let runner = "npm";
  if (existsSync("pnpm-lock.yaml")) runner = "pnpm";
  else if (existsSync("yarn.lock")) runner = "yarn";

  function runIfExists(name: string): void {
    if (!scripts[name]) return;
    try {
      execSync(`${runner} run ${name}`, {
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 120_000,
      });
    } catch {
      // non-zero exit, continue with other checks
      failed = true;
    }
  }

  runIfExists("lint");
  if (scripts["type-check"]) runIfExists("type-check");
  else runIfExists("typecheck");
  runIfExists("test");
  runIfExists("build");
  if (blocking && failed) process.exit(1);
} catch {
  // top-level safety net: never crash with non-zero
  if (process.env.FRONTEND_CRAFT_VALIDATION_MODE === "blocking") process.exit(1);
}

process.exit(0);
