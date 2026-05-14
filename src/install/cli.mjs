import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { getInstallBaseDir } from "./runtime-homes.mjs";
import { ALL_RUNTIMES, INSTALLERS } from "./registry.mjs";
import { promptLocation, promptRuntime } from "./interactive.mjs";

function readPkgVersion(pluginRoot) {
  try {
    const p = path.join(pluginRoot, "package.json");
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    return j.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/**
 * @param {string[]} argv
 */
function parseInstallArgs(argv) {
  let installLocation = null;
  let hasGlobal = false;
  let hasLocal = false;
  let dryRun = false;
  let all = false;
  /** @type {string[]} */
  const rest = [];
  for (const a of argv) {
    if (a === "--global" || a === "-g") {
      hasGlobal = true;
      installLocation = "global";
    } else if (a === "--local" || a === "-l") {
      hasLocal = true;
      installLocation = "local";
    } else if (a === "--dry-run") dryRun = true;
    else if (a === "--all") all = true;
    else if (!a.startsWith("-")) rest.push(a);
  }
  return { runtime: rest[0], installLocation, dryRun, all, hasGlobal, hasLocal };
}

function printHelp() {
  console.log(`frontend-craft — universal installer

Usage:
  frontend-craft install <runtime> [options]
  frontend-craft install --all [options]
  frontend-craft install
  frontend-craft list
  frontend-craft version
  frontend-craft uninstall <runtime>   (prints manual cleanup hints)

Options:
  --global, -g     Install to tool global config directory
  --local, -l      Install to this project only
  --dry-run        Show actions without writing files
  --all            Install for every supported runtime

Runtimes:
  ${ALL_RUNTIMES.join(", ")}
`);
}

function isInstallInvocation(argv) {
  const first = argv[0];
  return first == null || ["--dry-run", "--all", "--global", "-g", "--local", "-l"].includes(first);
}

/**
 * @param {string[]} argv
 */
export async function main(argv) {
  const cmd = isInstallInvocation(argv) ? "install" : argv[0];
  const cmdArgs = isInstallInvocation(argv) ? argv : argv.slice(1);
  const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

  if (cmd === "version" || cmd === "-v" || cmd === "--version") {
    console.log(readPkgVersion(pluginRoot));
    return;
  }
  if (cmd === "list") {
    ALL_RUNTIMES.forEach((r) => console.log(r));
    return;
  }
  if (cmd === "help" || cmd === "-h" || cmd === "--help") {
    printHelp();
    return;
  }
  if (cmd === "uninstall") {
    const r = argv[1];
    console.warn(
      "Uninstall is not automated. Remove generated directories for your runtime (e.g. .claude/skills, .codex/agents) or re-run install with a clean backup.",
    );
    if (r) console.warn(`Requested runtime: ${r}`);
    return;
  }
  if (cmd !== "install") {
    console.error(`Unknown command: ${cmd}`);
    printHelp();
    process.exitCode = 1;
    return;
  }
  if (cmdArgs.some((a) => a === "help" || a === "--help" || a === "-h")) {
    printHelp();
    return;
  }

  const { runtime, installLocation, dryRun, all, hasGlobal, hasLocal } = parseInstallArgs(cmdArgs);
  if (hasGlobal && hasLocal) {
    console.error("--global and --local cannot be used together.");
    process.exitCode = 1;
    return;
  }

  const cwd = process.cwd();
  const canPrompt = Boolean(process.stdin.isTTY) || process.env.FRONTEND_CRAFT_FORCE_INTERACTIVE === "1";
  let runtimes = all ? ALL_RUNTIMES : runtime ? [runtime] : [];
  if (!runtimes.length) {
    if (canPrompt) {
      runtimes = await promptRuntime();
    } else {
      console.log("Non-interactive terminal detected, defaulting to claude runtime.");
      runtimes = ["claude"];
    }
  }

  let isGlobal;
  if (installLocation === "global") {
    isGlobal = true;
  } else if (installLocation === "local") {
    isGlobal = false;
  } else if (canPrompt) {
    isGlobal = await promptLocation(runtimes);
  } else {
    console.log("Non-interactive terminal detected, defaulting to global install.");
    isGlobal = true;
  }

  for (const rt of runtimes) {
    if (!INSTALLERS[rt]) {
      console.error(`Unknown runtime: ${rt}`);
      process.exitCode = 1;
      continue;
    }
    const baseDir = getInstallBaseDir({ runtime: rt, isGlobal, cwd });
    /** @type {import('./types.mjs').InstallContext} */
    const ctx = { pluginRoot, cwd, runtime: rt, isGlobal, baseDir, dryRun };
    console.log(`Installing frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`);
    await INSTALLERS[rt](ctx);
  }
}
