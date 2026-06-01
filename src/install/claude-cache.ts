import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export interface ClaudeCacheEntry {
  version: string;
  path: string;
  isCurrent: boolean;
  hasDist: boolean;
  orphaned: boolean;
  packageVersion?: string;
  reasons: string[];
  shouldDelete: boolean;
}

export interface ClaudeCacheReport {
  claudeConfigDir: string;
  cacheDir: string;
  currentInstallPaths: string[];
  entries: ClaudeCacheEntry[];
  canDelete: boolean;
  warning?: string;
}

export interface ClaudeCacheCleanupResult extends ClaudeCacheReport {
  deleted: ClaudeCacheEntry[];
}

export interface ClaudeNativeInstall {
  key: string;
  scope?: string;
  installPath?: string;
  version?: string;
}

export interface ClaudeCliInstall {
  scope: "local" | "global";
  manifestPath: string;
  packageVersion?: string;
}

export interface ClaudeInstallSourceReport {
  native: ClaudeNativeInstall[];
  cli: ClaudeCliInstall[];
  hasMultipleActiveSources: boolean;
}

export function getClaudeFrontendCraftCacheReport({
  claudeConfigDir = getClaudeConfigDir(),
  currentVersion,
}: {
  claudeConfigDir?: string;
  currentVersion: string;
}): ClaudeCacheReport {
  const cacheDir = path.join(
    claudeConfigDir,
    "plugins",
    "cache",
    "frontend-craft",
    "frontend-craft",
  );
  const installed = readCurrentInstallPaths(claudeConfigDir);
  const entries = listCacheEntries({
    cacheDir,
    currentInstallPaths: installed.paths,
    currentVersion,
  });
  const warning = installed.warning;
  const canDelete = !warning && installed.paths.length > 0;

  return {
    claudeConfigDir,
    cacheDir,
    currentInstallPaths: installed.paths,
    entries: entries.map((entry) => ({
      ...entry,
      shouldDelete: canDelete && entry.shouldDelete,
      reasons: canDelete ? entry.reasons : ["metadata unavailable"],
    })),
    canDelete,
    warning,
  };
}

export function cleanupClaudeFrontendCraftCache({
  claudeConfigDir = getClaudeConfigDir(),
  currentVersion,
  dryRun = false,
}: {
  claudeConfigDir?: string;
  currentVersion: string;
  dryRun?: boolean;
}): ClaudeCacheCleanupResult {
  const report = getClaudeFrontendCraftCacheReport({
    claudeConfigDir,
    currentVersion,
  });
  const deleted: ClaudeCacheEntry[] = [];

  if (report.canDelete) {
    for (const entry of report.entries) {
      if (!entry.shouldDelete) continue;
      if (!dryRun) fs.rmSync(entry.path, { recursive: true, force: true });
      if (!dryRun) deleted.push(entry);
    }
  }

  return { ...report, deleted };
}

export function getClaudeInstallSourceReport({
  claudeConfigDir = getClaudeConfigDir(),
  cwd = process.cwd(),
}: {
  claudeConfigDir?: string;
  cwd?: string;
} = {}): ClaudeInstallSourceReport {
  const native = readNativeInstalls(claudeConfigDir);
  const cli = [
    readCliManifest(
      path.join(cwd, ".claude", "frontend-craft.manifest.json"),
      "local",
    ),
    readCliManifest(
      path.join(claudeConfigDir, "frontend-craft.manifest.json"),
      "global",
    ),
  ].filter((entry): entry is ClaudeCliInstall => entry !== undefined);

  return {
    native,
    cli,
    hasMultipleActiveSources: native.length + cli.length > 1,
  };
}

export function renderClaudeInstallSourceReport(
  report: ClaudeInstallSourceReport,
): string {
  const lines = ["install sources:"];
  if (report.native.length === 0 && report.cli.length === 0) {
    lines.push("  none detected");
    return lines.join("\n");
  }
  for (const install of report.native) {
    const details = [install.version, install.scope].filter(Boolean).join(", ");
    lines.push(
      `  native plugin: ${details || "installed"}${install.installPath ? ` (${install.installPath})` : ""}`,
    );
  }
  for (const install of report.cli) {
    lines.push(
      `  ${install.scope} CLI: ${install.packageVersion ?? "unknown"} (${install.manifestPath})`,
    );
  }
  if (report.hasMultipleActiveSources) {
    lines.push(
      "  warning: multiple active sources detected; keep one Claude loader as the source of truth",
    );
  }
  return lines.join("\n");
}

export function renderClaudeCacheReport(
  report: ClaudeCacheReport,
  action: "report" | "dry-run" | "fix" = "report",
): string {
  const lines = ["native cache:"];
  lines.push(
    `  current installs: ${report.currentInstallPaths.length ? report.currentInstallPaths.join(", ") : "unknown"}`,
  );
  if (report.warning) lines.push(`  warning: ${report.warning}`);
  if (report.entries.length === 0) {
    lines.push("  entries: none");
    return lines.join("\n");
  }

  for (const entry of report.entries) {
    const reasons = entry.isCurrent
      ? "current install"
      : entry.reasons.length
        ? entry.reasons.join(", ")
        : "healthy";
    const verb =
      action === "dry-run" && entry.shouldDelete
        ? "would delete"
        : action === "fix" && entry.shouldDelete
          ? "delete"
          : "keep";
    lines.push(`  ${verb} ${entry.version}: ${reasons}`);
  }

  return lines.join("\n");
}

export function renderClaudeCacheCleanupResult(
  result: ClaudeCacheCleanupResult,
  dryRun: boolean,
): string {
  if (dryRun) return renderClaudeCacheReport(result, "dry-run");
  const lines = [renderClaudeCacheReport(result, "fix")];
  for (const entry of result.deleted)
    lines.push(`  deleted ${entry.version}: ${entry.path}`);
  if (result.deleted.length === 0) lines.push("  deleted: none");
  return lines.join("\n");
}

export function getClaudeConfigDir(): string {
  return expandTilde(
    process.env.CLAUDE_CONFIG_DIR ?? path.join(os.homedir(), ".claude"),
  );
}

function listCacheEntries({
  cacheDir,
  currentInstallPaths,
  currentVersion,
}: {
  cacheDir: string;
  currentInstallPaths: string[];
  currentVersion: string;
}): ClaudeCacheEntry[] {
  if (!fs.existsSync(cacheDir)) return [];
  const currentSet = new Set(currentInstallPaths.map(normalizePath));

  return fs
    .readdirSync(cacheDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const entryPath = path.join(cacheDir, entry.name);
      const packageVersion = readPackageVersion(entryPath);
      const hasDist = fs.existsSync(path.join(entryPath, "dist"));
      const orphaned = fs.existsSync(path.join(entryPath, ".orphaned_at"));
      const isCurrent = currentSet.has(normalizePath(entryPath));
      const reasons: string[] = [];

      if (orphaned) reasons.push("orphaned");
      if (!hasDist) reasons.push("missing dist");
      if (packageVersion && compareSemver(packageVersion, currentVersion) < 0)
        reasons.push(`package ${packageVersion} < ${currentVersion}`);

      return {
        version: entry.name,
        path: entryPath,
        isCurrent,
        hasDist,
        orphaned,
        packageVersion,
        reasons,
        shouldDelete: !isCurrent && reasons.length > 0,
      };
    })
    .sort((a, b) =>
      a.version.localeCompare(b.version, undefined, { numeric: true }),
    );
}

function readCurrentInstallPaths(claudeConfigDir: string): {
  paths: string[];
  warning?: string;
} {
  const installedPath = path.join(
    claudeConfigDir,
    "plugins",
    "installed_plugins.json",
  );
  if (!fs.existsSync(installedPath)) {
    return {
      paths: [],
      warning: `missing ${installedPath}; refusing to delete cache entries`,
    };
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(installedPath, "utf8")) as {
      plugins?: Record<string, Array<{ installPath?: string }>>;
    };
    const paths = (
      parsed.plugins?.["frontend-craft@bovinphang/frontend-craft"] ??
      parsed.plugins?.["frontend-craft@frontend-craft"] ??
      []
    )
      .map((entry) => entry.installPath)
      .filter(
        (value): value is string =>
          typeof value === "string" && value.length > 0,
      )
      .map((value) => path.resolve(value));
    if (paths.length === 0)
      return {
        paths,
        warning: `missing frontend-craft plugin entry in ${installedPath}; refusing to delete cache entries`,
      };
    return { paths };
  } catch {
    return {
      paths: [],
      warning: `invalid ${installedPath}; refusing to delete cache entries`,
    };
  }
}

function readNativeInstalls(claudeConfigDir: string): ClaudeNativeInstall[] {
  const installedPath = path.join(
    claudeConfigDir,
    "plugins",
    "installed_plugins.json",
  );
  if (!fs.existsSync(installedPath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(installedPath, "utf8")) as {
      plugins?: Record<
        string,
        Array<{ installPath?: unknown; scope?: unknown; version?: unknown }>
      >;
    };
    return Object.entries(parsed.plugins ?? {}).flatMap(([key, entries]) => {
      if (!isFrontendCraftPluginKey(key)) return [];
      return entries.map((entry) => ({
        key,
        installPath:
          typeof entry.installPath === "string"
            ? path.resolve(entry.installPath)
            : undefined,
        scope: typeof entry.scope === "string" ? entry.scope : undefined,
        version: typeof entry.version === "string" ? entry.version : undefined,
      }));
    });
  } catch {
    return [];
  }
}

function isFrontendCraftPluginKey(key: string): boolean {
  return (
    key === "frontend-craft@bovinphang/frontend-craft" ||
    key === "frontend-craft@frontend-craft" ||
    key.startsWith("frontend-craft@")
  );
}

function readCliManifest(
  manifestPath: string,
  scope: "local" | "global",
): ClaudeCliInstall | undefined {
  if (!fs.existsSync(manifestPath)) return undefined;
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      packageVersion?: unknown;
      runtime?: unknown;
    };
    if (parsed.runtime !== "claude") return undefined;
    return {
      scope,
      manifestPath,
      packageVersion:
        typeof parsed.packageVersion === "string"
          ? parsed.packageVersion
          : undefined,
    };
  } catch {
    return { scope, manifestPath };
  }
}

function readPackageVersion(entryPath: string): string | undefined {
  const packagePath = path.join(entryPath, "package.json");
  if (!fs.existsSync(packagePath)) return undefined;
  try {
    const parsed = JSON.parse(fs.readFileSync(packagePath, "utf8")) as {
      version?: unknown;
    };
    return typeof parsed.version === "string" ? parsed.version : undefined;
  } catch {
    return undefined;
  }
}

function compareSemver(a: string, b: string): number {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

function parseSemver(value: string): [number, number, number] {
  const match = value.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return [0, 0, 0];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function expandTilde(value: string): string {
  if (value === "~") return os.homedir();
  if (value.startsWith("~/") || value.startsWith("~\\"))
    return path.join(os.homedir(), value.slice(2));
  return value;
}

function normalizePath(value: string): string {
  const resolved = path.resolve(value);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
