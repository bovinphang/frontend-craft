import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { ALL_RUNTIMES, INSTALLERS } from "./registry.js";
import { promptLocation, promptRuntime } from "./interactive.js";
import { getInstallBaseDir } from "./runtime-homes.js";
import {
  RUNTIME_CAPABILITIES,
  renderRuntimeCapabilityMatrix,
} from "./runtime-capabilities.js";
import { resolvePluginRoot } from "./shared/resolve-plugin-root.js";
import {
  beginManifestSession,
  discardManifestSession,
  endManifestSession,
  getManifestPath,
} from "./shared/fs.js";
import {
  discoverManifestInstalls,
  uninstallManagedInstall,
} from "./manifest-installs.js";
import {
  cleanupClaudeFrontendCraftCache,
  getClaudeFrontendCraftCacheReport,
  getClaudeInstallSourceReport,
  renderClaudeCacheCleanupResult,
  renderClaudeCacheReport,
  renderClaudeInstallSourceReport,
} from "./claude-cache.js";
import type { InstallContext } from "./types.js";
import type { ClaudeCliInstall } from "./claude-cache.js";

type ClaudeCliSource = "cli-global" | "cli-local";
type ClaudeInstallSource = "marketplace" | ClaudeCliSource;

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
  let force = false;
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
    else if (a === "--force") force = true;
    else if (a === "--all") all = true;
    else if (!a.startsWith("-")) rest.push(a);
  }
  return {
    runtime: rest[0],
    installLocation,
    dryRun,
    force,
    all,
    hasGlobal,
    hasLocal,
  };
}

function printHelp(): void {
  console.log(`frontend-craft - universal installer

Usage:
  frontend-craft install <runtime> [options]
  frontend-craft install --all [options]
  frontend-craft install
  frontend-craft init [runtime] [options]
  fec init [runtime] [options]
  frontend-craft update [runtime] [options]
  frontend-craft upgrade [runtime] [options]
  frontend-craft uninstall|remove [runtime] [options]
  frontend-craft list
  frontend-craft matrix
  frontend-craft doctor <runtime>
  frontend-craft doctor claude --fix-cache [--dry-run]
  frontend-craft sync-metadata --check
  frontend-craft version

Options:
  --global, -g     Install to tool global config directory
  --local, -l      Install to this project only
  --dry-run        Show actions without writing files
  --force          Uninstall: remove modified managed files (does not override Claude Marketplace)
  --all            Install for every supported runtime

Notes:
  init is an alias for install --local unless --global is explicitly provided.
  update without a runtime refreshes discovered frontend-craft manifests.
  uninstall/remove deletes manifest-managed files and skips modified files unless --force is provided.
  /fec-init is the in-assistant slash command; fec init is the terminal CLI command.

Runtimes:
  ${ALL_RUNTIMES.join(", ")}
`);
}

function isInstallInvocation(argv: string[]): boolean {
  const first = argv[0];
  return (
    first == null ||
    ["--dry-run", "--all", "--global", "-g", "--local", "-l"].includes(first)
  );
}

export async function main(argv: string[]): Promise<void> {
  const cmd = isInstallInvocation(argv) ? "install" : argv[0];
  const cmdArgs = isInstallInvocation(argv) ? argv : argv.slice(1);
  const isInit = cmd === "init";
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
    const fixCache = cmdArgs.includes("--fix-cache");
    const dryRun = cmdArgs.includes("--dry-run");
    const cwd = process.cwd();
    const baseDir = getInstallBaseDir({ runtime, isGlobal, cwd });
    const cap = RUNTIME_CAPABILITIES[runtime];
    if (!cap) {
      console.error(`Unknown runtime: ${runtime}`);
      process.exitCode = 1;
      return;
    }
    console.log(
      renderDoctorReport({
        runtime,
        baseDir,
        cwd,
        cap,
        pluginRoot,
        fixCache,
        dryRun,
        isGlobal,
      }),
    );
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
    console.log(
      checkOnly
        ? "metadata is synchronized"
        : "metadata is synchronized; no changes needed",
    );
    return;
  }
  if (cmd === "help" || cmd === "-h" || cmd === "--help") {
    printHelp();
    return;
  }
  const mode = cmd === "update" || cmd === "upgrade" ? "update" : "install";
  if (
    cmd !== "install" &&
    cmd !== "init" &&
    cmd !== "update" &&
    cmd !== "upgrade" &&
    cmd !== "uninstall" &&
    cmd !== "remove"
  ) {
    console.error(`Unknown command: ${cmd}`);
    printHelp();
    process.exitCode = 1;
    return;
  }
  if (cmdArgs.some((a) => a === "help" || a === "--help" || a === "-h")) {
    printHelp();
    return;
  }

  const { runtime, installLocation, dryRun, force, all, hasGlobal, hasLocal } =
    parseInstallArgs(cmdArgs);
  const effectiveInstallLocation = installLocation ?? (isInit ? "local" : null);
  if (hasGlobal && hasLocal) {
    console.error("--global and --local cannot be used together.");
    process.exitCode = 1;
    return;
  }

  const cwd = process.cwd();
  if (cmd === "uninstall" || cmd === "remove") {
    const scopes = getScopeFilter(hasLocal, hasGlobal);
    const runtimes = runtime ? [runtime] : all ? ALL_RUNTIMES : undefined;
    const installs = discoverManifestInstalls({ cwd, runtimes, scopes });
    if (runtime && !INSTALLERS[runtime]) {
      console.error(`Unknown runtime: ${runtime}`);
      process.exitCode = 1;
      return;
    }
    if (installs.length === 0) {
      console.log(renderNoInstallsFound("uninstall", runtime, scopes));
      return;
    }
    for (const install of installs) {
      console.log(
        `Uninstalling frontend-craft for "${install.runtime}" -> ${install.baseDir}${install.scope === "global" ? " (global)" : ""}`,
      );
      const result = uninstallManagedInstall({ install, cwd, dryRun, force });
      for (const file of result.removed) {
        const action = dryRun ? "[dry-run] would remove" : "Removed";
        console.log(
          `${action}${file.modified ? " modified file" : " file"}: ${file.path}`,
        );
      }
      for (const file of result.skipped)
        console.log(`Skipped modified file: ${file}`);
      for (const file of result.missing) console.log(`Missing file: ${file}`);
      if (dryRun && result.skipped.length === 0)
        console.log(`[dry-run] would remove manifest: ${install.manifestPath}`);
    }
    return;
  }

  const canPrompt =
    Boolean(process.stdin.isTTY) ||
    process.env.FRONTEND_CRAFT_FORCE_INTERACTIVE === "1";

  if (mode === "update" && !runtime) {
    const scopes = getScopeFilter(hasLocal, hasGlobal);
    const installs = discoverManifestInstalls({
      cwd,
      runtimes: all ? ALL_RUNTIMES : undefined,
      scopes,
    });
    if (installs.length === 0) {
      console.log(renderNoInstallsFound("update", undefined, scopes));
      return;
    }
    for (const install of installs) {
      await runInstaller({
        rt: install.runtime,
        mode,
        isGlobal: install.scope === "global",
        baseDir: install.baseDir,
        pluginRoot,
        cwd,
        dryRun,
      });
    }
    return;
  }

  let runtimes = all ? ALL_RUNTIMES : runtime ? [runtime] : [];
  if (!runtimes.length) {
    if (canPrompt) {
      runtimes = await promptRuntime();
    } else {
      console.log(
        "Non-interactive terminal detected, defaulting to claude runtime.",
      );
      runtimes = ["claude"];
    }
  }

  let isGlobal: boolean;
  if (effectiveInstallLocation === "global") {
    isGlobal = true;
  } else if (effectiveInstallLocation === "local") {
    isGlobal = false;
  } else if (canPrompt) {
    isGlobal = await promptLocation(runtimes);
  } else {
    console.log(
      "Non-interactive terminal detected, defaulting to global install.",
    );
    isGlobal = true;
  }

  for (const rt of runtimes) {
    if (!INSTALLERS[rt]) {
      console.error(`Unknown runtime: ${rt}`);
      process.exitCode = 1;
      continue;
    }
    const baseDir = getInstallBaseDir({ runtime: rt, isGlobal, cwd });
    await runInstaller({
      rt,
      mode,
      isGlobal,
      baseDir,
      pluginRoot,
      cwd,
      dryRun,
      force,
      canPrompt,
    });
  }
}

async function runInstaller({
  rt,
  mode,
  isGlobal,
  baseDir,
  pluginRoot,
  cwd,
  dryRun,
  force,
  canPrompt,
}: {
  rt: string;
  mode: "install" | "update";
  isGlobal: boolean;
  baseDir: string;
  pluginRoot: string;
  cwd: string;
  dryRun: boolean;
  force?: boolean;
  canPrompt?: boolean;
}): Promise<void> {
  const resolved = await resolveClaudeInstallConflict({
    rt,
    mode,
    isGlobal,
    cwd,
    dryRun,
    force: Boolean(force),
    canPrompt: Boolean(canPrompt),
  });
  if (!resolved) return;
  if (resolved.redirect) {
    isGlobal = resolved.redirect.isGlobal;
    baseDir = resolved.redirect.baseDir;
    mode = "update";
  }
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
    console.log(
      `Installing frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`,
    );
    if (!dryRun && fs.existsSync(getManifestPath(baseDir))) {
      console.log(
        `Existing frontend-craft manifest found; use "frontend-craft update ${rt}" to refresh managed files.`,
      );
    }
  } else {
    console.log(
      `Updating frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`,
    );
  }
  if (!dryRun)
    beginManifestSession({
      baseDir,
      cwd,
      mode,
      packageVersion: readPkgVersion(pluginRoot),
      runtime: rt,
      isGlobal,
    });
  try {
    await INSTALLERS[rt](ctx);
    if (!dryRun) endManifestSession();
  } catch (err) {
    if (!dryRun) discardManifestSession();
    throw err;
  }
}

async function resolveClaudeInstallConflict({
  rt,
  mode,
  isGlobal,
  cwd,
  dryRun,
  force,
  canPrompt,
}: {
  rt: string;
  mode: "install" | "update";
  isGlobal: boolean;
  cwd: string;
  dryRun: boolean;
  force: boolean;
  canPrompt: boolean;
}): Promise<{ redirect?: { isGlobal: boolean; baseDir: string } } | undefined> {
  if (rt !== "claude") return {};

  const sourceReport = getClaudeInstallSourceReport({ cwd });
  if (sourceReport.native.length > 0) {
    console.log("Claude Code Marketplace install detected for frontend-craft.");
    console.log(renderClaudeInstallSourceReport(sourceReport));
    console.log(
      "Update frontend-craft through Claude Code Marketplace. CLI install/update is disabled while Marketplace is active.",
    );
    process.exitCode = 1;
    return undefined;
  }

  const targetSource: ClaudeCliSource = isGlobal ? "cli-global" : "cli-local";
  const conflicts = sourceReport.cli.filter(
    (install) => toClaudeCliSource(install) !== targetSource,
  );
  if (conflicts.length === 0) {
    if (sourceReport.hasMultipleActiveSources)
      console.log(renderClaudeInstallSourceReport(sourceReport));
    return {};
  }

  const existing = conflicts[0];
  const existingSource = toClaudeCliSource(existing);
  console.log(
    `${formatClaudeInstallSource(existingSource)} install detected for frontend-craft.`,
  );
  console.log(renderClaudeInstallSourceReport(sourceReport));

  if (dryRun) {
    console.log(
      `[dry-run] resolve the existing ${formatClaudeInstallSource(existingSource)} source before using ${formatClaudeInstallSource(targetSource)}.`,
    );
    process.exitCode = 1;
    return undefined;
  }

  if (!canPrompt) {
    printClaudeCliConflictGuidance(existingSource, targetSource);
    process.exitCode = 1;
    return undefined;
  }

  const choice = await promptClaudeCliConflictChoice(
    existingSource,
    targetSource,
  );
  if (choice === "switch") {
    const removed = uninstallConflictingClaudeCliSources({
      installs: conflicts,
      cwd,
      dryRun,
      force,
    });
    if (!removed) {
      process.exitCode = 1;
      return undefined;
    }
    return {};
  }

  const redirectedIsGlobal = existingSource === "cli-global";
  return {
    redirect: {
      isGlobal: redirectedIsGlobal,
      baseDir: getInstallBaseDir({
        runtime: "claude",
        isGlobal: redirectedIsGlobal,
        cwd,
      }),
    },
  };
}

function uninstallConflictingClaudeCliSources({
  installs,
  cwd,
  dryRun,
  force,
}: {
  installs: ClaudeCliInstall[];
  cwd: string;
  dryRun: boolean;
  force: boolean;
}): boolean {
  for (const cliInstall of installs) {
    const install = discoverManifestInstalls({
      cwd,
      runtimes: ["claude"],
      scopes: [cliInstall.scope],
    })[0];
    if (!install) continue;
    console.log(
      `Uninstalling existing ${formatClaudeInstallSource(toClaudeCliSource(cliInstall))} install before switching source.`,
    );
    const result = uninstallManagedInstall({ install, cwd, dryRun, force });
    for (const file of result.removed) {
      const action = dryRun ? "[dry-run] would remove" : "Removed";
      console.log(
        `${action}${file.modified ? " modified file" : " file"}: ${file.path}`,
      );
    }
    for (const file of result.skipped)
      console.log(`Skipped modified file: ${file}`);
    for (const file of result.missing) console.log(`Missing file: ${file}`);
    if (result.skipped.length > 0) {
      console.log(
        "Resolve skipped modified files or rerun with --force before switching Claude CLI install source.",
      );
      return false;
    }
  }
  return true;
}

function printClaudeCliConflictGuidance(
  existingSource: ClaudeCliSource,
  targetSource: ClaudeCliSource,
): void {
  const existingFlag = sourceScopeFlag(existingSource);
  const targetFlag = sourceScopeFlag(targetSource);
  console.log(
    `Keep the existing source updated with: frontend-craft update claude ${existingFlag}`,
  );
  console.log(
    `Or switch sources with: frontend-craft uninstall claude ${existingFlag} && frontend-craft install claude ${targetFlag}`,
  );
}

async function promptClaudeCliConflictChoice(
  existingSource: ClaudeCliSource,
  targetSource: ClaudeCliSource,
): Promise<"keep" | "switch"> {
  console.log("Choose how to resolve the Claude CLI install source conflict:");
  console.log(
    `  1. Keep ${formatClaudeInstallSource(existingSource)} and update it`,
  );
  console.log(
    `  2. Uninstall ${formatClaudeInstallSource(existingSource)} and install ${formatClaudeInstallSource(targetSource)}`,
  );
  const answer = (await ask("Choice [1]: ")).trim();
  return answer === "2" ? "switch" : "keep";
}

function ask(question: string): Promise<string> {
  if (
    process.env.FRONTEND_CRAFT_FORCE_INTERACTIVE === "1" &&
    !process.stdin.isTTY
  ) {
    process.stdout.write(question);
    return Promise.resolve(fs.readFileSync(0, "utf8").split(/\r?\n/)[0] ?? "");
  }

  return new Promise<string>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
    rl.on("close", () => resolve(""));
  });
}

function toClaudeCliSource(install: ClaudeCliInstall): ClaudeCliSource {
  return install.scope === "global" ? "cli-global" : "cli-local";
}

function formatClaudeInstallSource(source: ClaudeInstallSource): string {
  if (source === "marketplace") return "Claude Code Marketplace";
  return source === "cli-global" ? "Claude CLI global" : "Claude CLI local";
}

function sourceScopeFlag(source: ClaudeCliSource): "--global" | "--local" {
  return source === "cli-global" ? "--global" : "--local";
}

function getScopeFilter(
  hasLocal: boolean,
  hasGlobal: boolean,
): Array<"local" | "global"> {
  if (hasLocal) return ["local"];
  if (hasGlobal) return ["global"];
  return ["local", "global"];
}

function renderNoInstallsFound(
  action: "update" | "uninstall",
  runtime: string | undefined,
  scopes: Array<"local" | "global">,
): string {
  const runtimeLabel = runtime ? ` for "${runtime}"` : "";
  return `No frontend-craft installs found${runtimeLabel} to ${action} (${scopes.join(", ")}).`;
}

function renderDoctorReport({
  runtime,
  baseDir,
  cwd,
  cap,
  pluginRoot,
  fixCache,
  dryRun,
  isGlobal,
}: {
  runtime: string;
  baseDir: string;
  cwd: string;
  cap: NonNullable<(typeof RUNTIME_CAPABILITIES)[string]>;
  pluginRoot: string;
  fixCache: boolean;
  dryRun: boolean;
  isGlobal: boolean;
}): string {
  const lines = [
    `frontend-craft doctor: ${runtime}`,
    `baseDir: ${baseDir}`,
    `tier: ${cap.tier}`,
  ];
  lines.push(
    `skills: ${status(checkSkills(runtime, baseDir, cwd), cap.skills)}`,
  );
  lines.push(
    `agents: ${status(fs.existsSync(path.join(baseDir, "agents")), cap.agents)}`,
  );
  lines.push(
    `commands: ${status(checkCommands(runtime, baseDir), cap.commands)}`,
  );
  lines.push(`hooks: ${status(checkHooks(runtime, baseDir), cap.hooks)}`);
  lines.push(
    `rules: ${status(checkRules(runtime, baseDir), cap.rules && !isGlobal)}`,
  );
  lines.push(
    `templates: ${status(checkTemplates(runtime, baseDir, cwd), cap.templates)}`,
  );
  if (runtime === "claude") {
    const currentVersion = readPkgVersion(pluginRoot);
    lines.push(
      renderClaudeInstallSourceReport(getClaudeInstallSourceReport({ cwd })),
    );
    if (fixCache) {
      lines.push(
        renderClaudeCacheCleanupResult(
          cleanupClaudeFrontendCraftCache({ currentVersion, dryRun }),
          dryRun,
        ),
      );
    } else {
      lines.push(
        renderClaudeCacheReport(
          getClaudeFrontendCraftCacheReport({ currentVersion }),
        ),
      );
    }
  }
  return lines.join("\n");
}

function status(found: boolean, expected: boolean): string {
  if (!expected) return "not expected";
  return found ? "ok" : "missing";
}

function checkSkills(runtime: string, baseDir: string, cwd: string): boolean {
  if (runtime === "codex")
    return fs.existsSync(
      path.join(cwd, ".agents", "skills", "fec-react-project-standard"),
    );
  if (runtime === "gemini") {
    return fs.existsSync(
      path.join(
        baseDir,
        "extensions",
        "frontend-craft",
        "skills",
        "fec-react-project-standard",
      ),
    );
  }
  return fs.existsSync(
    path.join(baseDir, "skills", "fec-react-project-standard"),
  );
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
    return (
      fs.existsSync(path.join(baseDir, "settings.json")) &&
      fs.existsSync(path.join(baseDir, "hooks", "fec-security-check.js"))
    );
  }
  return fs.existsSync(path.join(baseDir, "hooks.json"));
}

function checkRules(runtime: string, baseDir: string): boolean {
  if (runtime === "copilot")
    return fs.existsSync(
      path.join(baseDir, "instructions", "frontend-craft.instructions.md"),
    );
  if (runtime === "cline")
    return fs.existsSync(path.join(baseDir, ".clinerules"));
  return fs.existsSync(path.join(baseDir, "rules"));
}

function checkTemplates(
  runtime: string,
  baseDir: string,
  cwd: string,
): boolean {
  if (runtime === "claude")
    return fs.existsSync(path.join(cwd, ".claude-plugin", "plugin.json"));
  if (runtime === "codex")
    return (
      fs.existsSync(path.join(cwd, "AGENTS.md")) ||
      fs.existsSync(path.join(baseDir, "config.toml"))
    );
  if (runtime === "gemini") return fs.existsSync(path.join(cwd, "GEMINI.md"));
  if (runtime === "openclaw") return fs.existsSync(path.join(cwd, "AGENTS.md"));
  if (runtime === "qoder")
    return fs.existsSync(path.join(baseDir, "settings.json"));
  if (runtime === "opencode")
    return fs.existsSync(path.join(baseDir, "opencode.jsonc"));
  return false;
}

function checkPublicMetadata(pluginRoot: string): string[] {
  const issues: string[] = [];
  const pkg = JSON.parse(
    fs.readFileSync(path.join(pluginRoot, "package.json"), "utf8"),
  ) as { version: string };
  const files = [
    [".claude-plugin/plugin.json", "version"],
    [".claude-plugin/marketplace.json", "plugins.0.version"],
    ["openclaw.plugin.json", "version"],
  ] as const;

  for (const [file, selector] of files) {
    const fullPath = path.join(pluginRoot, file);
    const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    const actual = selector
      .split(".")
      .reduce(
        (value, key) => value?.[Number.isNaN(Number(key)) ? key : Number(key)],
        json,
      );
    if (actual !== pkg.version)
      issues.push(`${file} ${selector} is ${actual}, expected ${pkg.version}`);
  }

  const skillsMetadata = JSON.parse(
    fs.readFileSync(path.join(pluginRoot, "skills", "metadata.json"), "utf8"),
  ) as Array<{
    id: string;
    version?: string;
    license?: string;
    homepage?: string;
    repository?: string;
  }>;
  for (const skill of skillsMetadata) {
    if (skill.version !== pkg.version)
      issues.push(
        `skills/metadata.json ${skill.id}.version is ${skill.version}, expected ${pkg.version}`,
      );
  }

  const commandCount = fs
    .readdirSync(path.join(pluginRoot, "commands"))
    .filter((name) => name.endsWith(".md")).length;
  const skillCount = fs
    .readdirSync(path.join(pluginRoot, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).length;
  const agentCount = fs
    .readdirSync(path.join(pluginRoot, "agents"))
    .filter((name) => name.endsWith(".md")).length;
  const marketplace = fs.readFileSync(
    path.join(pluginRoot, ".claude-plugin", "marketplace.json"),
    "utf8",
  );
  if (!marketplace.includes(`${agentCount} agents`))
    issues.push(`marketplace description must mention ${agentCount} agents`);
  if (!marketplace.includes(`${skillCount} skills`))
    issues.push(`marketplace description must mention ${skillCount} skills`);
  if (!marketplace.includes(`${commandCount} commands`))
    issues.push(
      `marketplace description must mention ${commandCount} commands`,
    );
  return issues;
}
