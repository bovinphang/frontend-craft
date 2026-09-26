import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { choosePackageManager } from "./package-manager.js";

type PackageScripts = Record<string, string>;
type PackageData = { packageManager?: string; scripts?: PackageScripts };

process.stdin.resume();
process.stdin.on("data", () => {});
if (!existsSync("package.json")) process.exit(0);

const blocking = process.env.FRONTEND_CRAFT_VALIDATION_MODE === "blocking";
let failed = false;
try {
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as PackageData;
  const scripts = pkg.scripts ?? {};
  const runner = choosePackageManager(pkg.packageManager);
  const stages = [
    "lint",
    scripts["type-check"] ? "type-check" : "typecheck",
    "test",
    "build",
  ];
  const selected = stages.filter(
    (name) =>
      scripts[name] &&
      !stages.some((other) => other !== name && invokes(scripts, other, name)),
  );

  for (const name of selected) {
    try {
      execSync(`${runner} run ${name}`, {
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 120_000,
      });
    } catch (error) {
      failed = true;
      const result = error as {
        stdout?: Buffer | string;
        stderr?: Buffer | string;
        message?: string;
      };
      const detail = [result.stderr, result.stdout, result.message]
        .map((part) => String(part ?? "").trim())
        .find(Boolean);
      process.stderr.write(
        `[frontend-craft] ${name} failed${detail ? `:\n${detail.slice(-2000)}` : "."}\n`,
      );
    }
  }
  if (failed)
    process.stderr.write(
      `[frontend-craft] Validation failed (${blocking ? "blocking" : "advisory"} mode).\n`,
    );
} catch (error) {
  failed = true;
  process.stderr.write(
    `[frontend-craft] Validation could not run: ${error instanceof Error ? error.message : String(error)}\n`,
  );
}
process.exit(blocking && failed ? 1 : 0);

function invokes(
  scripts: PackageScripts,
  from: string,
  target: string,
  visited = new Set<string>(),
): boolean {
  if (!scripts[from] || visited.has(from)) return false;
  visited.add(from);
  // Only unquoted commands at shell command boundaries prove a nested stage.
  // Unrecognized syntax may repeat a check, but must never silently omit it.
  const unquoted = scripts[from].replace(/"(?:\\.|[^"\\])*"|'[^']*'/g, " ");
  const calls = [
    ...unquoted.matchAll(
      /(?:^|&&|;|\|\|)\s*(?:npm|pnpm|yarn|bun)\s+(?:run\s+)?([a-z][\w:-]*)\b/gi,
    ),
  ].map((match) => match[1]);
  return calls.some(
    (called) => called === target || invokes(scripts, called, target, visited),
  );
}
