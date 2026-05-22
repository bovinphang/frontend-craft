import fs from "node:fs";
import path from "node:path";
import { ALL_RUNTIMES, INSTALLERS } from "./registry.js";
import { promptLocation, promptRuntime } from "./interactive.js";
import { getInstallBaseDir } from "./runtime-homes.js";
import { RUNTIME_CAPABILITIES, renderRuntimeCapabilityMatrix } from "./runtime-capabilities.js";
import { resolvePluginRoot } from "./shared/resolve-plugin-root.js";
import { beginManifestSession, discardManifestSession, endManifestSession, getManifestPath } from "./shared/fs.js";
import type { InstallContext } from "./types.js";

function readPkgVersion(pluginRoot: string): string {
  try {
    const p = path.join(pluginRoot, "package.json");
    const j = JSON.parse(fs.readFileSync(p, "utf8")) as { version?: string };
    return j.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function parseInstallArgs(argv: string[]) {
  let installLocation: "global" | "local" | null = null;
  let hasGlobal = false;
  let hasLocal = false;
  let dryRun = false;
  let all = false;
  const rest: string[] = [];
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

function printHelp(): void {
  console.log(`frontend-craft - universal installer

Usage:
  frontend-craft install <runtime> [options]
  frontend-craft install --all [options]
  frontend-craft install
  frontend-craft update <runtime> [options]
  frontend-craft upgrade <runtime> [options]
  frontend-craft list
  frontend-craft matrix
  frontend-craft doctor <runtime>
  frontend-craft sync-metadata --check
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

function isInstallInvocation(argv: string[]): boolean {
  const first = argv[0];
  return first == null || ["--dry-run", "--all", "--global", "-g", "--local", "-l"].includes(first);
}

export async function main(argv: string[]): Promise<void> {
  const cmd = isInstallInvocation(argv) ? "install" : argv[0];
  const cmdArgs = isInstallInvocation(argv) ? argv : argv.slice(1);
  const pluginRoot = resolvePluginRoot(import.meta.url);

  if (cmd === "version" || cmd === "-v" || cmd === "--version") {
    console.log(readPkgVersion(pluginRoot));
    return;
  }
  if (cmd === "list") {
    ALL_RUNTIMES.forEach((r) => console.log(r));
    return;
  }
  if (cmd === "matrix") {
    console.log(renderRuntimeCapabilityMatrix(ALL_RUNTIMES));
    return;
  }
  if (cmd === "doctor") {
    const runtime = cmdArgs[0] ?? "claude";
    const isGlobal = cmdArgs.includes("--global") || cmdArgs.includes("-g");
    const cwd = process.cwd();
    const baseDir = getInstallBaseDir({ runtime, isGlobal, cwd });
    const cap = RUNTIME_CAPABILITIES[runtime];
    if (!cap) {
      console.error(`Unknown runtime: ${runtime}`);
      process.exitCode = 1;
      return;
    }
    console.log(renderDoctorReport({ runtime, baseDir, cwd, cap }));
    return;
  }
  if (cmd === "sync-metadata") {
    const checkOnly = cmdArgs.includes("--check");
    const result = checkPublicMetadata(pluginRoot);
    if (result.length > 0) {
      for (const issue of result) console.error(issue);
      process.exitCode = 1;
      return;
    }
    console.log(checkOnly ? "metadata is synchronized" : "metadata is synchronized; no changes needed");
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
  const mode = cmd === "update" || cmd === "upgrade" ? "update" : "install";
  if (cmd !== "install" && cmd !== "update" && cmd !== "upgrade") {
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

  let isGlobal: boolean;
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
    const ctx: InstallContext = {
      pluginRoot,
      cwd,
      runtime: rt,
      isGlobal,
      baseDir,
      dryRun,
      mode,
      capabilities: RUNTIME_CAPABILITIES[rt],
    };
    if (mode === "install") {
      console.log(`Installing frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`);
      if (!dryRun && fs.existsSync(getManifestPath(baseDir))) {
        console.log(`Existing frontend-craft manifest found; use "frontend-craft update ${rt}" to refresh managed files.`);
      }
    } else {
      console.log(`Updating frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`);
    }
    if (!dryRun) beginManifestSession({ baseDir, mode, packageVersion: readPkgVersion(pluginRoot), runtime: rt, isGlobal });
    try {
      await INSTALLERS[rt](ctx);
      if (!dryRun) endManifestSession();
    } catch (err) {
      if (!dryRun) discardManifestSession();
      throw err;
    }
  }
}

function renderDoctorReport({
  runtime,
  baseDir,
  cwd,
  cap,
}: {
  runtime: string;
  baseDir: string;
  cwd: string;
  cap: NonNullable<(typeof RUNTIME_CAPABILITIES)[string]>;
}): string {
  const lines = [`frontend-craft doctor: ${runtime}`, `baseDir: ${baseDir}`, `tier: ${cap.tier}`];
  lines.push(`skills: ${status(checkSkills(runtime, baseDir, cwd), cap.skills)}`);
  lines.push(`agents: ${status(fs.existsSync(path.join(baseDir, "agents")), cap.agents)}`);
  lines.push(`commands: ${status(checkCommands(runtime, baseDir), cap.commands)}`);
  lines.push(`hooks: ${status(checkHooks(runtime, baseDir), cap.hooks)}`);
  lines.push(`rules: ${status(checkRules(runtime, baseDir), cap.rules)}`);
  lines.push(`templates: ${status(checkTemplates(runtime, baseDir, cwd), cap.templates)}`);
  return lines.join("\n");
}

function status(found: boolean, expected: boolean): string {
  if (!expected) return "not expected";
  return found ? "ok" : "missing";
}

function checkSkills(runtime: string, baseDir: string, cwd: string): boolean {
  if (runtime === "codex") return fs.existsSync(path.join(cwd, ".agents", "skills", "fec-react-project-standard"));
  if (runtime === "gemini") {
    return fs.existsSync(path.join(baseDir, "extensions", "frontend-craft", "skills", "fec-react-project-standard"));
  }
  return fs.existsSync(path.join(baseDir, "skills", "fec-react-project-standard"));
}

function checkCommands(runtime: string, baseDir: string): boolean {
  const dir =
    runtime === "windsurf"
      ? path.join(baseDir, "workflows")
      : runtime === "opencode" || runtime === "kilo"
        ? path.join(baseDir, "command")
        : runtime === "copilot"
          ? path.join(baseDir, "prompts")
          : path.join(baseDir, "commands");
  return fs.existsSync(path.join(dir, "fec-init.md"));
}

function checkHooks(runtime: string, baseDir: string): boolean {
  if (runtime === "qoder") {
    return fs.existsSync(path.join(baseDir, "settings.json")) && fs.existsSync(path.join(baseDir, "hooks", "security-check.js"));
  }
  return fs.existsSync(path.join(baseDir, "hooks.json"));
}

function checkRules(runtime: string, baseDir: string): boolean {
  if (runtime === "copilot") return fs.existsSync(path.join(baseDir, "instructions", "frontend-craft.instructions.md"));
  if (runtime === "cline") return fs.existsSync(path.join(baseDir, ".clinerules"));
  return fs.existsSync(path.join(baseDir, "rules"));
}

function checkTemplates(runtime: string, baseDir: string, cwd: string): boolean {
  if (runtime === "claude") return fs.existsSync(path.join(cwd, ".claude-plugin", "plugin.json"));
  if (runtime === "codex") return fs.existsSync(path.join(cwd, "AGENTS.md")) || fs.existsSync(path.join(baseDir, "config.toml"));
  if (runtime === "gemini") return fs.existsSync(path.join(cwd, "GEMINI.md"));
  if (runtime === "openclaw") return fs.existsSync(path.join(cwd, "AGENTS.md"));
  if (runtime === "qoder") return fs.existsSync(path.join(baseDir, "settings.json"));
  if (runtime === "opencode") return fs.existsSync(path.join(baseDir, "opencode.jsonc"));
  return false;
}

function checkPublicMetadata(pluginRoot: string): string[] {
  const issues: string[] = [];
  const pkg = JSON.parse(fs.readFileSync(path.join(pluginRoot, "package.json"), "utf8")) as { version: string };
  const files = [
    [".claude-plugin/plugin.json", "version"],
    [".claude-plugin/marketplace.json", "plugins.0.version"],
    ["openclaw.plugin.json", "version"],
  ] as const;

  for (const [file, selector] of files) {
    const fullPath = path.join(pluginRoot, file);
    const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    const actual = selector.split(".").reduce((value, key) => value?.[Number.isNaN(Number(key)) ? key : Number(key)], json);
    if (actual !== pkg.version) issues.push(`${file} ${selector} is ${actual}, expected ${pkg.version}`);
  }

  const skillsMetadata = JSON.parse(fs.readFileSync(path.join(pluginRoot, "skills", "metadata.json"), "utf8")) as Array<{
    id: string;
    version?: string;
    license?: string;
    homepage?: string;
    repository?: string;
  }>;
  for (const skill of skillsMetadata) {
    if (skill.version !== pkg.version) issues.push(`skills/metadata.json ${skill.id}.version is ${skill.version}, expected ${pkg.version}`);
  }

  const commandCount = fs.readdirSync(path.join(pluginRoot, "commands")).filter((name) => name.endsWith(".md")).length;
  const skillCount = fs
    .readdirSync(path.join(pluginRoot, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).length;
  const agentCount = fs.readdirSync(path.join(pluginRoot, "agents")).filter((name) => name.endsWith(".md")).length;
  const marketplace = fs.readFileSync(path.join(pluginRoot, ".claude-plugin", "marketplace.json"), "utf8");
  if (!marketplace.includes(`${agentCount} agents`)) issues.push(`marketplace description must mention ${agentCount} agents`);
  if (!marketplace.includes(`${skillCount} skills`)) issues.push(`marketplace description must mention ${skillCount} skills`);
  if (!marketplace.includes(`${commandCount} commands`)) issues.push(`marketplace description must mention ${commandCount} commands`);
  return issues;
}
