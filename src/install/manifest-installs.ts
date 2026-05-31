import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ALL_RUNTIMES } from "./registry.js";
import { getInstallBaseDir } from "./runtime-homes.js";
import { getManifestPath, hashFile, readInstallManifest } from "./shared/fs.js";
import type { InstallManifest, ManifestRoot } from "./shared/fs.js";

export type InstallScope = "global" | "local";

export type DiscoveredInstall = {
  runtime: string;
  scope: InstallScope;
  baseDir: string;
  manifestPath: string;
  manifest: InstallManifest;
};

export type InstallDiscoveryOptions = {
  cwd: string;
  runtimes?: string[];
  scopes?: InstallScope[];
};

export function discoverManifestInstalls({
  cwd,
  runtimes = ALL_RUNTIMES,
  scopes = ["local", "global"],
}: InstallDiscoveryOptions): DiscoveredInstall[] {
  const installs: DiscoveredInstall[] = [];
  const seen = new Set<string>();

  for (const runtime of runtimes) {
    for (const scope of scopes) {
      const baseDir = getInstallBaseDir({ runtime, isGlobal: scope === "global", cwd });
      const manifestPath = getManifestPath(baseDir);
      const key = path.resolve(manifestPath);
      if (seen.has(key)) continue;
      seen.add(key);

      const manifest = readInstallManifest(manifestPath);
      if (!manifest) continue;
      if (manifest.runtime !== runtime || manifest.scope !== scope) continue;
      installs.push({ runtime, scope, baseDir, manifestPath, manifest });
    }
  }

  return installs;
}

export type UninstallOptions = {
  install: DiscoveredInstall;
  cwd: string;
  dryRun: boolean;
  force: boolean;
};

export type UninstallResult = {
  removed: Array<{ path: string; modified: boolean }>;
  skipped: string[];
  missing: string[];
};

export function uninstallManagedInstall({ install, cwd, dryRun, force }: UninstallOptions): UninstallResult {
  const result: UninstallResult = { removed: [], skipped: [], missing: [] };
  const touchedDirs = new Set<string>();

  for (const file of install.manifest.files) {
    const absolutePath = resolveManifestFile({
      filePath: file.path,
      root: file.root ?? "baseDir",
      baseDir: install.baseDir,
      cwd,
    });
    if (!absolutePath) continue;

    if (!fs.existsSync(absolutePath)) {
      result.missing.push(file.path);
      continue;
    }

    const isModified = hashFile(absolutePath) !== file.hash;
    if (isModified && !force) {
      result.skipped.push(file.path);
      continue;
    }

    result.removed.push({ path: file.path, modified: isModified });
    touchedDirs.add(path.dirname(absolutePath));
    if (!dryRun) fs.rmSync(absolutePath, { force: true });
  }

  if (!dryRun && result.skipped.length === 0) {
    fs.rmSync(install.manifestPath, { force: true });
    pruneEmptyDirs([...touchedDirs], [install.baseDir, cwd, os.homedir()]);
  }

  return result;
}

function resolveManifestFile({
  filePath,
  root,
  baseDir,
  cwd,
}: {
  filePath: string;
  root: ManifestRoot;
  baseDir: string;
  cwd: string;
}): string | undefined {
  const rootDir = root === "baseDir" ? baseDir : root === "cwd" ? cwd : os.homedir();
  const resolvedRoot = path.resolve(rootDir);
  const resolved = path.resolve(resolvedRoot, filePath);
  const relative = path.relative(resolvedRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return undefined;
  return resolved;
}

function pruneEmptyDirs(dirs: string[], boundaries: string[]): void {
  const resolvedBoundaries = boundaries.map((dir) => path.resolve(dir));
  for (const initialDir of dirs.sort((a, b) => b.length - a.length)) {
    let current = path.resolve(initialDir);
    while (isWithinAnyBoundary(current, resolvedBoundaries) && !resolvedBoundaries.includes(current)) {
      if (!fs.existsSync(current)) break;
      if (fs.readdirSync(current).length > 0) break;
      fs.rmdirSync(current);
      current = path.dirname(current);
    }
  }
}

function isWithinAnyBoundary(dir: string, boundaries: string[]): boolean {
  return boundaries.some((boundary) => {
    const relative = path.relative(boundary, dir);
    return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
  });
}
