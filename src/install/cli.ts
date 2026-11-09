import { runProjectInspect } from "../project/inspect.js";
import {
  runCommonAwareInstall,
  uninstallCommonAwareInstall,
  commonRequest,
} from "./shared/common-install.js";
import {
  createCraftCli,
  type CliCommandResult,
  type CliExitCode,
  type CliIO,
  type CliProductAdapter,
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
import { createCliLifecycle } from "./cli-lifecycle.js";
import {
  promptLanguage,
  promptLocation,
  promptRuntime,
} from "./interactive.js";
import {
  DEFAULT_LANGUAGE,
  resolveContentRoot,
  SUPPORTED_LANGUAGES,
  type InstallLanguage,
} from "./language.js";
import { getInstallBaseDir } from "./runtime-homes.js";
import {
  RUNTIME_CAPABILITIES,
  renderRuntimeCapabilityMatrix,
} from "./runtime-capabilities.js";
import { resolvePluginRoot } from "./shared/resolve-plugin-root.js";
import { getManifestPath, readInstallManifest } from "./shared/fs.js";
import {
  discoverManifestInstalls,
  copyInstallToNewBase,
  type DiscoveredInstall,
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

function frontendHelp(): string {
  return `frontend-craft - universal installer

Usage:
  fec project inspect [path] [--task-path relative] [--task-kind kind] [--json]
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
`;
}

interface ProductOutput {
  log(text: string): void;
  error(text: string): void;
  fail(code?: CliExitCode): void;
}

async function runProductOperation(
  operation: (output: ProductOutput) => Promise<void>,
  io: CliIO,
  captureOutput = false,
  json = false,
): Promise<CliCommandResult> {
  const lines: string[] = [];
  let code: CliExitCode = 0;
  await operation({
    log: (text) => {
      if (captureOutput) lines.push(text);
      else (json ? io.stderr : io.stdout)(text + "\n");
    },
    error: (text) => io.stderr(text + "\n"),
    fail: (next = 1) => {
      code = Math.max(code, next) as CliExitCode;
    },
  });
  return { code, ...(captureOutput ? { text: lines.join("\n") } : {}) };
}

async function runFrontendCommand(
  argv: string[],
  io: CliIO,
): Promise<CliCommandResult | undefined> {
  const resourceCommand = argv[0] === "runtime";
  const cmd = resourceCommand ? argv[1] : argv[0];
  const cmdArgs = argv.slice(resourceCommand ? 2 : 1);
  if (
    !(resourceCommand && cmd === "check-migration") &&
    !(
      !resourceCommand &&
      ["project", "matrix", "doctor", "sync-metadata"].includes(cmd ?? "")
    )
  )
    return undefined;
  const pluginRoot = io.productRoot;
  const cwd = io.cwd;
  if (cmd === "doctor" || cmd === "matrix" || cmd === "sync-metadata") {
    const allowed = new Set(
      cmd === "doctor"
        ? [
            "--json",
            "--global",
            "--local",
            "-g",
            "-l",
            "--fix-cache",
            "--dry-run",
          ]
        : cmd === "sync-metadata"
          ? ["--json", "--check"]
          : ["--json"],
    );
    const unknown = cmdArgs.find(
      (arg) => arg.startsWith("-") && !allowed.has(arg),
    );
    if (unknown) throw new Error(`Unknown option: ${unknown}`);
    const positional = cmdArgs.filter((arg) => !arg.startsWith("-"));
    const maxPositionals = cmd === "doctor" ? 1 : 0;
    if (positional.length > maxPositionals)
      throw new Error(`Unexpected argument: ${positional[maxPositionals]}`);
    if (cmd === "doctor") {
      const global = cmdArgs.includes("--global") || cmdArgs.includes("-g");
      const local = cmdArgs.includes("--local") || cmdArgs.includes("-l");
      if (global && local)
        throw new Error("--global and --local cannot be used together.");
      const runtime = positional[0] ?? "claude";
      if (!RUNTIME_CAPABILITIES[runtime])
        throw new Error(`Unknown runtime: ${runtime}`);
      if (cmdArgs.includes("--fix-cache") && runtime !== "claude")
        throw new Error("--fix-cache is only supported for claude.");
    }
  }
  const result = await runProductOperation(
    async (output) => {
      if (cmd === "project") {
        try {
          if (cmdArgs[0] !== "inspect")
            throw new Error("Unknown project command");
          output.log(
            JSON.stringify(
              runProjectInspect(cmdArgs.slice(1), pluginRoot, cwd),
              null,
              2,
            ),
          );
        } catch (error) {
          output.error(
            error instanceof Error ? error.message : "Inspection failed",
          );
          output.fail(2);
        }
        return;
      }
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
          output.log(JSON.stringify(report, null, 2));
        else {
          for (const finding of report.findings)
            output.log(
              `${finding.file}${finding.line ? `:${finding.line}` : ""} [${finding.kind}] ${finding.id}${finding.replacement ? ` -> ${finding.replacement}` : ""}: ${finding.message}`,
            );
          for (const error of report.errors) output.log(error);
          if (!report.findings.length && !report.errors.length)
            output.log("未发现待迁移的公共 Skill 引用或旧安装");
        }
        output.fail(report.exitCode);
        return;
      }
      if (cmd === "matrix") {
        output.log(renderRuntimeCapabilityMatrix(ALL_RUNTIMES));
        return;
      }
      if (cmd === "doctor") {
        const runtime = cmdArgs.find((arg) => !arg.startsWith("-")) ?? "claude";
        const isGlobal = cmdArgs.includes("--global") || cmdArgs.includes("-g");
        const fixCache = cmdArgs.includes("--fix-cache");
        const dryRun = cmdArgs.includes("--dry-run");
        const baseDir = getInstallBaseDir({ runtime, isGlobal, cwd });
        const cap = RUNTIME_CAPABILITIES[runtime];
        if (!cap) {
          output.error(`Unknown runtime: ${runtime}`);
          output.fail(1);
          return;
        }
        output.log(
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
          for (const issue of result) output.error(issue);
          output.fail(1);
          return;
        }
        output.log(
          checkOnly
            ? "metadata is synchronized"
            : "metadata is synchronized; no changes needed",
        );
        return;
      }
    },
    io,
    true,
  );
  if (
    cmd === "project" ||
    (cmd === "check-migration" && argv.includes("--json"))
  ) {
    if (result.text)
      return { code: result.code, value: JSON.parse(result.text) as unknown };
  }
  if (argv.includes("--json"))
    return { code: result.code, value: { report: result.text ?? "" } };
  return result;
}

export function createFrontendCraftAdapter(json = false): CliProductAdapter {
  return {
    async discover(filter, io) {
      return discoverManifestInstalls({
        cwd: io.cwd,
        ...filter,
        onError: (error) => {
          if (filter.onError) filter.onError(error);
          else throw error;
        },
      }).map((install) => ({
        runtime: install.runtime,
        scope: install.scope,
        language: install.manifest.language ?? DEFAULT_LANGUAGE,
        manifestPath: install.manifestPath,
        data: install,
      }));
    },
    async resource(options, io) {
      const result = await runProductOperation(
        async (output) => {
          if (options.action === "uninstall") {
            const install = options.installation?.data as
              DiscoveredInstall | undefined;
            if (!install)
              throw new Error("Uninstall requires a discovered installation");
            if (
              !(await uninstallResource(
                install,
                io.cwd,
                options.dryRun,
                options.force,
                output,
              ))
            )
              output.fail(1);
          } else {
            await runResourceInstaller(
              {
                rt: options.runtime,
                mode: options.action,
                isGlobal: options.scope === "global",
                baseDir: getInstallBaseDir({
                  runtime: options.runtime,
                  isGlobal: options.scope === "global",
                  cwd: io.cwd,
                }),
                pluginRoot: io.productRoot,
                cwd: io.cwd,
                dryRun: options.dryRun,
                force: options.force,
                canPrompt: options.canPrompt,
                language: options.language,
              },
              output,
            );
          }
        },
        io,
        false,
        json,
      );
      return {
        ...result,
        ...(json
          ? {
              value: {
                action: options.action,
                runtime: options.runtime,
                scope: options.scope,
                language: options.language,
                exitCode: result.code ?? 0,
              },
            }
          : {}),
      };
    },
    command: runFrontendCommand,
    prompts: () => ({ promptRuntime, promptLocation, promptLanguage }),
    async lifecycle(action, argv, io) {
      const result = await runProductOperation(
        (output) =>
          createCliLifecycle({
            log: output.log,
            fail: () => output.fail(),
            isTTY: io.isTTY,
            env: io.env,
          })(action, argv, {
            pluginRoot: io.productRoot,
            cwd: io.cwd,
            purgeResources: (dryRun) =>
              uninstallResources({ cwd: io.cwd, dryRun }, output),
            describeResources: () => describeResourceInstalls(io.cwd),
          }),
        io,
      );
      return result.code ?? 0;
    },
  };
}

export async function main(argv: string[]): Promise<void> {
  const pluginRoot = resolvePluginRoot(import.meta.url);
  const run = createCraftCli(
    {
      packageName: "@bovinphang/frontend-craft",
      commandName: "frontend-craft",
      binName: "fec",
      version: readPkgVersion(pluginRoot),
      runtimes: ALL_RUNTIMES,
      help: frontendHelp(),
    },
    createFrontendCraftAdapter(argv.includes("--json")),
  );
  const code = await run(argv, {
    cwd: process.cwd(),
    home: os.homedir(),
    productRoot: pluginRoot,
    env: process.env,
    stdout: (text) => {
      console.log(text.replace(/\n$/, ""));
    },
    stderr: (text) => {
      console.error(text.replace(/\n$/, ""));
    },
    isTTY:
      Boolean(process.stdin.isTTY) ||
      process.env.FRONTEND_CRAFT_FORCE_INTERACTIVE === "1",
  });
  // Frontend's historic resource errors use 1; project inspection uses 2.
  process.exitCode =
    code === 2 && argv[0] !== "project" && !argv.includes("check-migration")
      ? 1
      : code;
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

async function uninstallResources(
  {
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
  },
  output: ProductOutput,
): Promise<boolean> {
  let succeeded = true;
  const installs = discoverManifestInstalls({
    cwd,
    runtimes,
    scopes,
    onError: (error) => {
      succeeded = false;
      output.error(error.message);
    },
  });
  if (installs.length === 0 && succeeded)
    output.log(
      renderNoInstallsFound(
        "uninstall",
        runtimes?.length === 1 ? runtimes[0] : undefined,
        scopes,
      ),
    );
  for (const install of installs) {
    if (!(await uninstallResource(install, cwd, dryRun, force, output)))
      succeeded = false;
  }
  return succeeded;
}

async function uninstallResource(
  install: DiscoveredInstall,
  cwd: string,
  dryRun: boolean,
  force: boolean,
  output: ProductOutput,
): Promise<boolean> {
  try {
    output.log(
      `Uninstalling frontend-craft for "${install.runtime}" -> ${install.baseDir}${install.scope === "global" ? " (global)" : ""}`,
    );
    const result = await uninstallCommonAwareInstall({
      log: output.log,
      install,
      cwd,
      dryRun,
      force,
    });
    for (const file of result.removed) {
      const action = dryRun ? "[dry-run] would remove" : "Removed";
      output.log(
        `${action}${file.modified ? " modified file" : " file"}: ${file.path}`,
      );
    }
    for (const file of result.skipped)
      output.log(`Skipped modified file: ${file}`);
    for (const file of result.missing) output.log(`Missing file: ${file}`);
    if (result.skipped.length > 0) {
      output.log(
        `Preserved manifest for modified files: ${install.manifestPath}`,
      );
      output.log(
        `Recover with: npx @bovinphang/frontend-craft@latest runtime uninstall ${install.runtime} --${install.scope}`,
      );
    } else if (dryRun)
      output.log(`[dry-run] would remove manifest: ${install.manifestPath}`);
  } catch (error) {
    reportResourceFailure(
      "uninstall",
      install.runtime,
      install.scope === "global",
      error,
      output,
    );
    return false;
  }
  return true;
}

function reportResourceFailure(
  action: "install" | "update" | "uninstall",
  runtime: string,
  isGlobal: boolean,
  error: unknown,
  output: ProductOutput,
): void {
  output.error(
    `Failed ${action} for ${runtime} (${isGlobal ? "global" : "local"}): ${error instanceof Error ? error.message : String(error)}`,
  );
  output.error(
    `Retry: frontend-craft runtime ${action} ${runtime} --${isGlobal ? "global" : "local"}`,
  );
}

async function runResourceInstaller(
  options: Parameters<typeof runInstaller>[0],
  output: ProductOutput,
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
    await runInstaller(options, output);
  } catch (error) {
    reportResourceFailure(
      options.mode,
      options.rt,
      options.isGlobal,
      error,
      output,
    );
    output.fail(1);
  }
}

async function runInstaller(
  {
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
  },
  output: ProductOutput,
): Promise<void> {
  const resolved = await resolveClaudeInstallConflict(
    {
      rt,
      mode,
      isGlobal,
      cwd,
      dryRun,
      force: Boolean(force),
      canPrompt: Boolean(canPrompt),
    },
    output,
  );
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
        copyInstallToNewBase(legacy, baseDir, preview, output.log);
      mode = "update";
    }
  }
  const ctx: InstallContext = {
    log: output.log,
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
    output.log(
      `Installing frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`,
    );
    if (!dryRun && fs.existsSync(getManifestPath(baseDir))) {
      output.log(
        `Existing frontend-craft manifest found; use "frontend-craft runtime update ${rt}" to refresh managed files.`,
      );
    }
  } else {
    output.log(
      `Updating frontend-craft for "${rt}" -> ${baseDir}${isGlobal ? " (global)" : ""}`,
    );
  }
  await runCommonAwareInstall(
    ctx,
    (planning) => INSTALLERS[rt](planning),
    beforeManifest,
  );
}

async function resolveClaudeInstallConflict(
  {
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
  },
  output: ProductOutput,
): Promise<{ redirect?: { isGlobal: boolean; baseDir: string } } | undefined> {
  if (rt !== "claude") return {};

  const sourceReport = getClaudeInstallSourceReport({ cwd });
  if (sourceReport.native.length > 0) {
    output.log("Claude Code Marketplace install detected for frontend-craft.");
    output.log(renderClaudeInstallSourceReport(sourceReport));
    output.log(
      "Update frontend-craft through Claude Code Marketplace. CLI install/update is disabled while Marketplace is active.",
    );
    output.fail(1);
    return undefined;
  }

  const targetSource: ClaudeCliSource = isGlobal ? "cli-global" : "cli-local";
  const conflicts = sourceReport.cli.filter(
    (install) => toClaudeCliSource(install) !== targetSource,
  );
  if (conflicts.length === 0) {
    if (sourceReport.hasMultipleActiveSources)
      output.log(renderClaudeInstallSourceReport(sourceReport));
    return {};
  }

  const existing = conflicts[0];
  const existingSource = toClaudeCliSource(existing);
  output.log(
    `${formatClaudeInstallSource(existingSource)} install detected for frontend-craft.`,
  );
  output.log(renderClaudeInstallSourceReport(sourceReport));

  if (dryRun) {
    output.log(
      `[dry-run] resolve the existing ${formatClaudeInstallSource(existingSource)} source before using ${formatClaudeInstallSource(targetSource)}.`,
    );
    output.fail(1);
    return undefined;
  }

  if (!canPrompt) {
    printClaudeCliConflictGuidance(existingSource, targetSource, output);
    output.fail(1);
    return undefined;
  }

  const choice = await promptClaudeCliConflictChoice(
    existingSource,
    targetSource,
    output,
  );
  if (choice === "switch") {
    const removed = await uninstallConflictingClaudeCliSources(
      {
        installs: conflicts,
        cwd,
        dryRun,
        force,
      },
      output,
    );
    if (!removed) {
      output.fail(1);
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

async function uninstallConflictingClaudeCliSources(
  {
    installs,
    cwd,
    dryRun,
    force,
  }: {
    installs: ClaudeCliInstall[];
    cwd: string;
    dryRun: boolean;
    force: boolean;
  },
  output: ProductOutput,
): Promise<boolean> {
  for (const cliInstall of installs) {
    const install = discoverManifestInstalls({
      cwd,
      runtimes: ["claude"],
      scopes: [cliInstall.scope],
    })[0];
    if (!install) continue;
    output.log(
      `Uninstalling existing ${formatClaudeInstallSource(toClaudeCliSource(cliInstall))} install before switching source.`,
    );
    const result = await uninstallCommonAwareInstall({
      log: output.log,
      install,
      cwd,
      dryRun,
      force,
    });
    for (const file of result.removed) {
      const action = dryRun ? "[dry-run] would remove" : "Removed";
      output.log(
        `${action}${file.modified ? " modified file" : " file"}: ${file.path}`,
      );
    }
    for (const file of result.skipped)
      output.log(`Skipped modified file: ${file}`);
    for (const file of result.missing) output.log(`Missing file: ${file}`);
    if (result.skipped.length > 0) {
      output.log(
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
  output: ProductOutput,
): void {
  const existingFlag = sourceScopeFlag(existingSource);
  const targetFlag = sourceScopeFlag(targetSource);
  output.log(
    `Keep the existing source updated with: frontend-craft runtime update claude ${existingFlag}`,
  );
  output.log(
    `Or switch sources with: frontend-craft runtime uninstall claude ${existingFlag} && frontend-craft runtime install claude ${targetFlag}`,
  );
}

async function promptClaudeCliConflictChoice(
  existingSource: ClaudeCliSource,
  targetSource: ClaudeCliSource,
  output: ProductOutput,
): Promise<"keep" | "switch"> {
  output.log("Choose how to resolve the Claude CLI install source conflict:");
  output.log(
    `  1. Keep ${formatClaudeInstallSource(existingSource)} and update it`,
  );
  output.log(
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
