import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ALL_RUNTIMES } from "./registry.js";
import { getInstallBaseDir, getLegacyGlobalConfigDirs } from "./runtime-homes.js";
import { getManifestPath, hashFile, readInstallManifest } from "./shared/fs.js";
import type { InstallManifest, ManifestRoot } from "./shared/fs.js";
import { asRecord, readSettings } from "./shared/settings.js";

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
      const bases = [getInstallBaseDir({ runtime, isGlobal: scope === "global", cwd }),
        ...(scope === "global" ? getLegacyGlobalConfigDirs(runtime) : [])];
      for (const baseDir of bases) {
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
  }

  return installs;
}

/** Copy a legacy install without deleting originals or losing user-edit hashes. */
export function copyInstallToNewBase(install: DiscoveredInstall, baseDir: string, dryRun: boolean): void {
  if (dryRun) {
    console.log(`[dry-run] migrate ${install.baseDir} -> ${baseDir}`);
    return;
  }
  const manifestPath = getManifestPath(baseDir);
  if (fs.existsSync(manifestPath)) return;
  const files = install.manifest.files.filter(file => !file.root || file.root === "baseDir");
  for (const file of files) {
    const source = resolveManifestFile({ filePath: file.path, root: "baseDir", baseDir: install.baseDir, cwd: install.baseDir });
    const dest = resolveManifestFile({ filePath: file.path, root: "baseDir", baseDir, cwd: baseDir });
    if (!source || !dest || !fs.existsSync(source) || !fs.statSync(source).isFile() || fs.existsSync(dest)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(source, dest, fs.constants.COPYFILE_EXCL);
  }
  fs.mkdirSync(baseDir, { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify({ ...install.manifest, files }, null, 2)}\n`, "utf8");
  console.log(`Migrated install to ${baseDir}; original files remain at ${install.baseDir}.`);
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

  for (const owned of install.manifest.settingsHooks ?? []) {
    const file = resolveManifestFile({ filePath: owned.path, root: owned.root ?? "baseDir", baseDir: install.baseDir, cwd });
    if (!file || !fs.existsSync(file)) continue;
    // Read before deleting scripts: malformed settings must not lose their dependencies.
    const settings = readSettings(file);
    const hooks = { ...asRecord(settings.hooks) };
    for (const [event, entries] of Object.entries(owned.hooks)) {
      if (!Array.isArray(hooks[event])) continue;
      const ownedEntries = new Set(entries.map(entry => JSON.stringify(entry)));
      const kept = (hooks[event] as unknown[]).filter(entry => !ownedEntries.has(JSON.stringify(entry)));
      if (kept.length) hooks[event] = kept;
      else delete hooks[event];
    }
    if (Object.keys(hooks).length) settings.hooks = hooks;
    else delete settings.hooks;
    if (!dryRun) fs.writeFileSync(file, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
  }

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
