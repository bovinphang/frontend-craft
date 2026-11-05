import {
  runCommonAwareInstall,
  uninstallCommonAwareInstall,
  commonRequest,
} from "./shared/common-install.js";
import {
  planSharedDeployment,
  resolveSharedIdentity,
} from "@bovinphang/craft-common";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";
import { ALL_RUNTIMES, INSTALLERS } from "./registry.js";
import { readProductCommonCatalog } from "./shared/common-content.js";
import { checkMigration, type MigrationReport } from "./migration.js";
import { runCliLifecycle } from "./cli-lifecycle.js";
import {
  promptLanguage,
  promptLocation,
  promptRuntime,
} from "./interactive.js";
import {
  DEFAULT_LANGUAGE,
  isInstallLanguage,
  resolveContentRoot,
  resolveInstallLanguage,
  SUPPORTED_LANGUAGES,
  type InstallLanguage,
} from "./language.js";
import { getInstallBaseDir } from "./runtime-homes.js";
import {
  RUNTIME_CAPABILITIES,
  renderRuntimeCapabilityMatrix,
} from "./runtime-capabilities.js";
import { resolvePluginRoot } from "./shared/resolve-plugin-root.js";
import {
  discardManifestSession,
  getManifestPath,
  readInstallManifest,
} from "./shared/fs.js";
import {
  discoverManifestInstalls,
  copyInstallToNewBase,
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
  let language: string | undefined;
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--global" || a === "-g") {
      hasGlobal = true;
      installLocation = "global";
    } else if (a === "--local" || a === "-l") {
      hasLocal = true;
      installLocation = "local";
    } else if (a === "--dry-run") dryRun = true;
    else if (a === "--force") force = true;
    else if (a === "--all") all = true;
    else if (a === "--lang") {
      language = argv[++i] ?? "";
    } else if (a.startsWith("--lang=")) {
      language = a.slice("--lang=".length);
    } else if (!a.startsWith("-")) rest.push(a);
    else throw new Error(`Unknown option: ${a}`);
  }
  if (rest.length > 1) throw new Error(`Unexpected argument: ${rest[1]}`);
  return {
    runtime: rest[0],
    installLocation,
    dryRun,
    force,
    all,
    hasGlobal,
    hasLocal,
    language,
  };
}

function printHelp(): void {
  console.log(`frontend-craft - universal installer

Usage:
  frontend-craft update|upgrade [--dry-run]
  frontend-craft uninstall|remove [--purge] [--yes] [--dry-run]
  frontend-craft runtime install <runtime> [options]
  frontend-craft runtime install --all [options]
  frontend-craft runtime install
  frontend-craft install [runtime] [options] (deprecated alias)
  frontend-craft setup [runtime] [options]
  frontend-craft setup all [options]
  fec setup [runtime] [options]
  fec setup all [options]
  frontend-craft runtime update|upgrade [runtime] [options]
  frontend-craft runtime uninstall|remove [runtime] [options]
  frontend-craft runtime check-migration [runtime] [--local|--global] [--json]
  frontend-craft list
  frontend-craft matrix
  frontend-craft doctor <runtime>
  frontend-craft doctor claude --fix-cache [--dry-run]
  frontend-craft sync-metadata --check
  frontend-craft version

Options:
  --purge          CLI uninstall: clean managed resources before removing CLI
  --yes, -y        CLI uninstall: confirm without prompting (required for non-TTY)
  --global, -g     Install to tool global config directory
  --local, -l      Install to this project only
  --lang <lang>    Install content language: ${SUPPORTED_LANGUAGES.join(", ")} (default: ${DEFAULT_LANGUAGE})
  --dry-run        Show actions without writing files
  --force          Uninstall: remove modified managed files (does not override Claude Marketplace)
  --all            Install for every supported runtime

Notes:
  setup connects frontend-craft to the current project. Omit runtime in an interactive terminal to choose runtimes.
  setup <runtime> and setup all install locally by default unless --global is explicitly provided.
  update upgrades the CLI and refreshes current-project and global resources with the new CLI.
  uninstall/remove removes only the CLI unless --purge is provided.
  runtime update uses this package's content without downloading a new CLI.
  runtime update without a runtime refreshes discovered frontend-craft manifests.
  runtime uninstall/remove deletes manifest-managed files and skips modified files unless --force is provided.
  /fec-init is the in-assistant slash command; fec setup is the terminal CLI command.

Runtimes:
  ${ALL_RUNTIMES.join(", ")}
`);
}

function isInstallInvocation(argv: string[]): boolean {
  const first = argv[0];
  return (
    first == null ||
    [
      "--dry-run",
      "--all",
      "--global",
      "-g",
      "--local",
      "-l",
      "--lang",
    ].includes(first) ||
    first.startsWith("--lang=")
  );
}

export async function main(argv: string[]): Promise<void> {
  let cmd = isInstallInvocation(argv) ? "install" : argv[0];
  let cmdArgs = isInstallInvocation(argv) ? argv : argv.slice(1);
  if (argv.some((arg) => arg === "help" || arg === "--help" || arg === "-h")) {
    printHelp();
    return;
  }
  const resourceCommand = cmd === "runtime";
  if (resourceCommand) {
    cmd = cmdArgs[0];
    cmdArgs = cmdArgs.slice(1);
    if (
      ![
        "install",
        "update",
        "upgrade",
        "uninstall",
        "remove",
        "check-migration",
      ].includes(cmd ?? "")
    ) {
      console.error(`Unknown runtime command: ${cmd ?? "(missing)"}`);
      printHelp();
      process.exitCode = 1;
      return;
    }
  }
  const isSetup = cmd === "setup";
  const pluginRoot = resolvePluginRoot(import.meta.url);
  const cwd = process.cwd();
  if (resourceCommand && cmd === "check-migration") {
    const allowed = new Set(["--json", "--global", "--local", "-g", "-l"]);
    const unknown = cmdArgs.filter(
      (arg) => arg.startsWith("-") && !allowed.has(arg),
    );
    const positional = cmdArgs.filter((arg) => !arg.startsWith("-"));
    const global = cmdArgs.includes("--global") || cmdArgs.includes("-g");
    const local = cmdArgs.includes("--local") || cmdArgs.includes("-l");
    const report: MigrationReport =
      unknown.length || positional.length > 1 || (global && local)
        ? {
            findings: [],
            errors: [
              "迁移检查参数无效；使用 [runtime] [--local|--global] [--json]",
            ],
            exitCode: 2,
          }
        : checkMigration({
            cwd,
            runtime: positional[0],
            scope: global ? "global" : "local",
          });
    if (cmdArgs.includes("--json"))
      console.log(JSON.stringify(report, null, 2));
    else {
      for (const finding of report.findings)
        console.log(
          `${finding.file}${finding.line ? `:${finding.line}` : ""} [${finding.kind}] ${finding.id}${finding.replacement ? ` -> ${finding.replacement}` : ""}: ${finding.message}`,
        );
      for (const error of report.errors) console.log(error);
      if (!report.findings.length && !report.errors.length)
        console.log("未发现待迁移的公共 Skill 引用或旧安装");
    }
    process.exitCode = report.exitCode;
    return;
  }
  if (
    !resourceCommand &&
    ["update", "upgrade", "uninstall", "remove"].includes(cmd ?? "")
  ) {
    await runCliLifecycle(
      cmd === "update" || cmd === "upgrade" ? "update" : "uninstall",
      cmdArgs,
      {
        pluginRoot,
        cwd,
        purgeResources: (dryRun) => uninstallResources({ cwd, dryRun }),
        describeResources: () => describeResourceInstalls(cwd),
      },
    );
    return;
  }

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
    cmd !== "setup" &&
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

  if (cmd === "install" && !resourceCommand && argv[0] === "install")
    console.log(
      'Deprecated: use "frontend-craft runtime install" instead of "frontend-craft install".',
    );
  let parsedInstallArgs: ReturnType<typeof parseInstallArgs>;
  try {
    parsedInstallArgs = parseInstallArgs(cmdArgs);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }
  let runtime: string | undefined = parsedInstallArgs.runtime;
  let all = parsedInstallArgs.all;
  const { installLocation, dryRun, force, hasGlobal, hasLocal } =
    parsedInstallArgs;
  const requestedLanguage = parsedInstallArgs.language;
  if (
    requestedLanguage !== undefined &&
    !isInstallLanguage(requestedLanguage)
  ) {
    console.error(
      `Unsupported language: ${requestedLanguage || "(missing)"}. Supported languages: ${SUPPORTED_LANGUAGES.join(", ")}`,
    );
    process.exitCode = 1;
    return;
  }
  const languageArg = requestedLanguage as InstallLanguage | undefined;
  if (isSetup && runtime === "all") {
    runtime = undefined;
    all = true;
  }
  const effectiveInstallLocation =
    installLocation ?? (isSetup ? "local" : null);
  if (hasGlobal && hasLocal) {
    console.error("--global and --local cannot be used together.");
    process.exitCode = 1;
    return;
  }

  if (cmd === "uninstall" || cmd === "remove") {
    const scopes = getScopeFilter(hasLocal, hasGlobal);
    const runtimes = runtime ? [runtime] : all ? ALL_RUNTIMES : undefined;
    if (runtime && !INSTALLERS[runtime]) {
      console.error(`Unknown runtime: ${runtime}`);
      process.exitCode = 1;
      return;
    }
    if (!(await uninstallResources({ cwd, dryRun, force, runtimes, scopes })))
      process.exitCode = 1;
    return;
  }

  const canPrompt =
    Boolean(process.stdin.isTTY) ||
    process.env.FRONTEND_CRAFT_FORCE_INTERACTIVE === "1";

  if (mode === "update" && !runtime) {
    const scopes = getScopeFilter(hasLocal, hasGlobal);
    let discoveryFailed = false;
    const installs = discoverManifestInstalls({
      cwd,
      runtimes: all ? ALL_RUNTIMES : undefined,
      scopes,
      onError: (error) => {
        discoveryFailed = true;
        console.error(error.message);
        process.exitCode = 1;
      },
    });
    if (installs.length === 0) {
      if (!discoveryFailed)
        console.log(renderNoInstallsFound("update", undefined, scopes));
      return;
    }
    const updatedScopes = new Set<string>();
    for (const install of installs) {
      const scopeKey = `${install.runtime}:${install.scope}`;
      if (updatedScopes.has(scopeKey)) continue;
      updatedScopes.add(scopeKey);
      const language =
        languageArg ?? install.manifest.language ?? DEFAULT_LANGUAGE;
      await runResourceInstaller({
        rt: install.runtime,
        mode,
        isGlobal: install.scope === "global",
        baseDir: getInstallBaseDir({
          runtime: install.runtime,
          isGlobal: install.scope === "global",
          cwd,
        }),
        pluginRoot,
        cwd,
        dryRun,
        language,
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

  let language: InstallLanguage | undefined = languageArg;
  if (!language && mode === "install") {
    if (canPrompt) {
      language = await promptLanguage();
    } else {
      language = DEFAULT_LANGUAGE;
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

  if (!language && mode === "update" && runtime) {
    const baseDir = getInstallBaseDir({ runtime, isGlobal, cwd });
    language =
      readInstallManifest(getManifestPath(baseDir))?.language ??
      DEFAULT_LANGUAGE;
  }
  language ??= resolveInstallLanguage(languageArg);

  for (const rt of runtimes) {
    if (!INSTALLERS[rt]) {
      console.error(`Unknown runtime: ${rt}`);
      process.exitCode = 1;
      continue;
    }
    const baseDir = getInstallBaseDir({ runtime: rt, isGlobal, cwd });
    await runResourceInstaller({
      rt,
      mode,
      isGlobal,
      baseDir,
      pluginRoot,
      cwd,
      dryRun,
      force,
      canPrompt,
      language,
    });
  }
}

export function describeResourceInstalls(cwd: string): string[] {
  const diagnostics: string[] = [];
  const installs = discoverManifestInstalls({
    cwd,
    onError: (error) => diagnostics.push(error.message),
  });
  return [
    ...installs.map(
      (install) => `${install.runtime} (${install.scope}): ${install.baseDir}`,
    ),
    ...diagnostics,
  ];
}

async function uninstallResources({
  cwd,
  dryRun,
  force = false,
  runtimes,
  scopes = ["local", "global"],
}: {
  cwd: string;
  dryRun: boolean;
  force?: boolean;
  runtimes?: string[];
  scopes?: Array<"local" | "global">;
}): Promise<boolean> {
  let succeeded = true;
  const installs = discoverManifestInstalls({
    cwd,
    runtimes,
    scopes,
    onError: (error) => {
      succeeded = false;
      console.error(error.message);
    },
  });
  if (installs.length === 0 && succeeded)
    console.log(
      renderNoInstallsFound(
        "uninstall",
        runtimes?.length === 1 ? runtimes[0] : undefined,
        scopes,
      ),
    );
  for (const install of installs) {
    try {
      console.log(
        `Uninstalling frontend-craft for "${install.runtime}" -> ${install.baseDir}${install.scope === "global" ? " (global)" : ""}`,
      );
      const result = await uninstallCommonAwareInstall({
        install,
        cwd,
        dryRun,
        force,
      });
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
          `Preserved manifest for modified files: ${install.manifestPath}`,
        );
        console.log(
          `Recover with: npx @bovinphang/frontend-craft@latest runtime uninstall ${install.runtime} --${install.scope}`,
        );
      } else if (dryRun)
        console.log(`[dry-run] would remove manifest: ${install.manifestPath}`);
    } catch (error) {
      succeeded = false;
      reportResourceFailure(
        "uninstall",
        install.runtime,
        install.scope === "global",
        error,
      );
    }
  }
  return succeeded;
}

function reportResourceFailure(
  action: "install" | "update" | "uninstall",
  runtime: string,
  isGlobal: boolean,
  error: unknown,
): void {
  console.error(
    `Failed ${action} for ${runtime} (${isGlobal ? "global" : "local"}): ${error instanceof Error ? error.message : String(error)}`,
  );
  console.error(
    `Retry: frontend-craft runtime ${action} ${runtime} --${isGlobal ? "global" : "local"}`,
  );
}

async function runResourceInstaller(
  options: Parameters<typeof runInstaller>[0],
): Promise<void> {
  try {
    if (options.mode === "update")
      discoverManifestInstalls({
        cwd: options.cwd,
        runtimes: [options.rt],
        scopes: [options.isGlobal ? "global" : "local"],
        onError: (error) => {
          throw error;
        },
      });
    await runInstaller(options);
  } catch (error) {
    discardManifestSession();
    reportResourceFailure(options.mode, options.rt, options.isGlobal, error);
    process.exitCode = 1;
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
  language,
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
  language: InstallLanguage;
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
  let beforeManifest: ((dryRun?: boolean) => void) | undefined;
  if (isGlobal && !fs.existsSync(getManifestPath(baseDir))) {
    const legacy = discoverManifestInstalls({
      cwd,
      runtimes: [rt],
      scopes: ["global"],
    }).find(
      (install) => path.resolve(install.baseDir) !== path.resolve(baseDir),
    );
    if (legacy) {
      beforeManifest = (preview = dryRun) =>
        copyInstallToNewBase(legacy, baseDir, preview);
      mode = "update";
    }
  }
  const ctx: InstallContext = {
    pluginRoot,
    contentRoot: resolveContentRoot(pluginRoot, language),
    cwd,
    runtime: rt,
    isGlobal,
    baseDir,
    dryRun,
    mode,
    language,
    capabilities: RUNTIME_CAPABILITIES[rt],
  };
  if (mode === "install") {
    console.log(
      `Installing frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`,
    );
    if (!dryRun && fs.existsSync(getManifestPath(baseDir))) {
      console.log(
        `Existing frontend-craft manifest found; use "frontend-craft runtime update ${rt}" to refresh managed files.`,
      );
    }
  } else {
    console.log(
      `Updating frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`,
    );
  }
  await runCommonAwareInstall(ctx, () => INSTALLERS[rt](ctx), beforeManifest);
}

async function resolveClaudeInstallConflict({
  rt,
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
    const removed = await uninstallConflictingClaudeCliSources({
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

async function uninstallConflictingClaudeCliSources({
  installs,
  cwd,
  dryRun,
  force,
}: {
  installs: ClaudeCliInstall[];
  cwd: string;
  dryRun: boolean;
  force: boolean;
}): Promise<boolean> {
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
    const result = await uninstallCommonAwareInstall({
      install,
      cwd,
      dryRun,
      force,
    });
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
    `Keep the existing source updated with: frontend-craft runtime update claude ${existingFlag}`,
  );
  console.log(
    `Or switch sources with: frontend-craft runtime uninstall claude ${existingFlag} && frontend-craft runtime install claude ${targetFlag}`,
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
    `skills: ${status(checkSkills(runtime, baseDir, cwd, isGlobal), cap.skills)}`,
  );
  let commonHealthy = false;
  if (cap.skills) {
    try {
      const manifest = readInstallManifest(getManifestPath(baseDir));
      const request = commonRequest({
        pluginRoot,
        contentRoot: resolveContentRoot(pluginRoot, manifest?.language ?? "en"),
        cwd,
        baseDir,
        runtime,
        isGlobal,
        dryRun: true,
        mode: "install",
        language: manifest?.language ?? "en",
      });
      if (manifest?.common && request) {
        const identity = resolveSharedIdentity(request.skillsDir);
        const plan = planSharedDeployment(request);
        commonHealthy =
          manifest.common.target === identity.target &&
          manifest.common.ledgerDir === identity.ledgerDir &&
          plan.conflicts.length === 0 &&
          plan.mutations.length === 0;
      }
    } catch {
      commonHealthy = false;
    }
  }
  lines.push(`common: ${status(commonHealthy, cap.skills)}`);
  lines.push(
    `agents: ${status(fs.existsSync(path.join(baseDir, "agents")), cap.agents)}`,
  );
  lines.push(
    `commands: ${status(checkCommands(runtime, baseDir, cwd, isGlobal), cap.commands && !(runtime === "copilot" && isGlobal))}`,
  );
  lines.push(`hooks: ${status(checkHooks(runtime, baseDir), cap.hooks)}`);
  lines.push(
    `rules: ${status(checkRules(runtime, baseDir, isGlobal), cap.rules && (!isGlobal || ["copilot", "cline", "trae"].includes(runtime)))}`,
  );
  lines.push(
    `templates: ${status(checkTemplates(runtime, baseDir, cwd, isGlobal), cap.templates && !(runtime === "openclaw" && isGlobal))}`,
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

function checkSkills(
  runtime: string,
  baseDir: string,
  cwd: string,
  isGlobal: boolean,
): boolean {
  if (runtime === "codex")
    return fs.existsSync(
      path.join(
        isGlobal ? os.homedir() : cwd,
        ".agents",
        "skills",
        "fec-react-project-standard",
        "SKILL.md",
      ),
    );
  return fs.existsSync(
    path.join(
      runtime === "openclaw" && !isGlobal ? cwd : baseDir,
      "skills",
      "fec-react-project-standard",
      "SKILL.md",
    ),
  );
}

function checkCommands(
  runtime: string,
  baseDir: string,
  cwd: string,
  isGlobal: boolean,
): boolean {
  if (runtime === "openclaw")
    return fs.existsSync(
      path.join(isGlobal ? baseDir : cwd, "skills", "fec-init", "SKILL.md"),
    );
  const dir =
    runtime === "windsurf"
      ? path.join(baseDir, isGlobal ? "global_workflows" : "workflows")
      : runtime === "opencode" || runtime === "kilo"
        ? path.join(baseDir, "commands")
        : runtime === "copilot"
          ? path.join(baseDir, "prompts")
          : path.join(baseDir, "commands");
  return fs.existsSync(
    path.join(
      dir,
      runtime === "copilot" ? "fec-init.prompt.md" : "fec-init.md",
    ),
  );
}

function checkHooks(runtime: string, baseDir: string): boolean {
  if (runtime === "claude") {
    try {
      const settings = JSON.parse(
        fs.readFileSync(path.join(baseDir, "settings.json"), "utf8"),
      );
      return (
        Array.isArray(settings.hooks?.Stop) &&
        settings.hooks.Stop.some((entry: unknown) =>
          JSON.stringify(entry).includes("fec-run-tests.js"),
        )
      );
    } catch {
      return false;
    }
  }
  if (runtime === "qoder") {
    return (
      fs.existsSync(path.join(baseDir, "settings.json")) &&
      fs.existsSync(path.join(baseDir, "hooks", "fec-security-check.js"))
    );
  }
  return fs.existsSync(path.join(baseDir, "hooks.json"));
}

function checkRules(
  runtime: string,
  baseDir: string,
  isGlobal: boolean,
): boolean {
  if (runtime === "copilot")
    return fs.existsSync(
      isGlobal
        ? path.join(baseDir, "copilot-instructions.md")
        : path.join(baseDir, "instructions", "frontend-craft.instructions.md"),
    );
  if (runtime === "cline")
    return fs.existsSync(
      path.join(
        baseDir,
        isGlobal ? "Rules" : ".clinerules",
        "frontend-craft.md",
      ),
    );
  if (runtime === "trae" && isGlobal)
    return fs.existsSync(path.join(baseDir, "user_rules", "frontend-craft.md"));
  return fs.existsSync(path.join(baseDir, "rules"));
}

function checkTemplates(
  runtime: string,
  baseDir: string,
  cwd: string,
  isGlobal: boolean,
): boolean {
  if (runtime === "claude")
    return isGlobal
      ? fs.existsSync(path.join(baseDir, "CLAUDE.md"))
      : fs.existsSync(path.join(cwd, ".claude-plugin", "plugin.json"));
  if (runtime === "codex")
    return (
      fs.existsSync(path.join(cwd, "AGENTS.md")) ||
      fs.existsSync(path.join(baseDir, "config.toml"))
    );
  if (runtime === "gemini")
    return fs.existsSync(path.join(isGlobal ? baseDir : cwd, "GEMINI.md"));
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
    const expectedVersion = skill.id.startsWith("cc-")
      ? readProductCommonCatalog(pluginRoot, "en").packageVersion
      : pkg.version;
    if (skill.version !== expectedVersion)
      issues.push(
        `skills/metadata.json ${skill.id}.version is ${skill.version}, expected ${expectedVersion}`,
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
