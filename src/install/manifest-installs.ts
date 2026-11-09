import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ALL_RUNTIMES } from "./registry.js";
import {
  getInstallBaseDir,
  getLegacyGlobalConfigDirs,
} from "./runtime-homes.js";
import { getManifestPath, readInstallManifest } from "./shared/fs.js";
import type { InstallManifest, ManifestRoot } from "./shared/fs.js";

import {
  safeProductPath,
  type ProductInstallationSeed,
} from "@bovinphang/craft-common";
import { MANIFEST_CODEC } from "./manifest-codec.js";
import { toProductContext } from "./product-definition.js";
import type { InstallContext } from "./types.js";

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
  onError?: (error: Error) => void;
};

export function discoverManifestInstalls({
  cwd,
  runtimes = ALL_RUNTIMES,
  scopes = ["local", "global"],
  onError,
}: InstallDiscoveryOptions): DiscoveredInstall[] {
  const installs: DiscoveredInstall[] = [];
  const seen = new Set<string>();

  for (const runtime of runtimes) {
    for (const scope of scopes) {
      const bases = [
        getInstallBaseDir({ runtime, isGlobal: scope === "global", cwd }),
        ...(scope === "global" ? getLegacyGlobalConfigDirs(runtime) : []),
      ];
      for (const baseDir of bases) {
        const manifestPath = getManifestPath(baseDir);
        const key = path.resolve(manifestPath);
        if (seen.has(key)) continue;
        seen.add(key);

        if (onError) {
          try {
            fs.lstatSync(manifestPath);
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== "ENOENT")
              onError(
                new Error(
                  `Cannot inspect ownership manifest: ${manifestPath}`,
                  { cause: error },
                ),
              );
            continue;
          }
        }
        const manifest = readInstallManifest(manifestPath);
        if (
          onError &&
          (!manifest ||
            manifest.runtime !== runtime ||
            manifest.scope !== scope ||
            typeof manifest.packageVersion !== "string" ||
            !manifest.packageVersion)
        ) {
          onError(
            new Error(
              `Cannot read ownership manifest: ${manifestPath}. Invalid JSON, structure, ownership, or unreadable file; existing files were preserved.`,
            ),
          );
          continue;
        }
        if (!manifest) continue;
        if (manifest.runtime !== runtime || manifest.scope !== scope) continue;
        installs.push({ runtime, scope, baseDir, manifestPath, manifest });
      }
    }
  }

  return installs;
}

/** Copy a legacy install without deleting originals or losing user-edit hashes. */
export function copyInstallToNewBase(
  install: DiscoveredInstall,
  baseDir: string,
  dryRun: boolean,
): (ProductInstallationSeed & { legacyManifest: InstallManifest }) | undefined {
  if (fs.existsSync(getManifestPath(baseDir))) return;
  const files = install.manifest.files.filter(
    (file) => !file.root || file.root === "baseDir",
  );
  const mutations: ProductInstallationSeed["mutations"] = [];
  for (const file of files) {
    const source = safeProductPath(path.join(install.baseDir, file.path), [
      install.baseDir,
    ]);
    const dest = safeProductPath(path.join(baseDir, file.path), [baseDir]);
    if (!fs.existsSync(source)) continue;
    if (!fs.lstatSync(source).isFile())
      throw new Error("Legacy migration source is not a regular file");
    if (fs.existsSync(dest))
      throw new Error(
        "Legacy migration target already contains unknown files; existing files were preserved",
      );
    mutations.push({
      path: dest,
      beforeHash: null,
      after: fs.readFileSync(source),
    });
  }
  const legacyManifest = { ...install.manifest, files };
  const ctx: InstallContext = {
    pluginRoot: "",
    contentRoot: "",
    cwd: baseDir,
    baseDir,
    runtime: install.runtime,
    isGlobal: install.scope === "global",
    dryRun,
    mode: "update",
    language: install.manifest.language ?? "en",
  };
  console.log(
    `${dryRun ? "[dry-run] " : ""}Planning migration ${install.baseDir} -> ${baseDir}; original files remain unchanged.`,
  );
  return {
    manifest: MANIFEST_CODEC.decode(
      Buffer.from(JSON.stringify(legacyManifest)),
      toProductContext(ctx),
    ),
    mutations,
    legacyManifest,
  };
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

export async function uninstallManagedInstall(
  options: UninstallOptions,
): Promise<UninstallResult> {
  const { uninstallCommonAwareInstall } =
    await import("./shared/common-install.js");
  return uninstallCommonAwareInstall(options);
}

export function resolveManifestFile({
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
  const rootDir =
    root === "baseDir" ? baseDir : root === "cwd" ? cwd : os.homedir();
  const resolvedRoot = path.resolve(rootDir);
  const resolved = path.resolve(resolvedRoot, filePath);
  const relative = path.relative(resolvedRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return undefined;
  return resolved;
}

export function pruneEmptyDirs(dirs: string[], boundaries: string[]): void {
  const resolvedBoundaries = boundaries.map((dir) => path.resolve(dir));
  for (const initialDir of dirs.sort((a, b) => b.length - a.length)) {
    let current = path.resolve(initialDir);
    while (
      isWithinAnyBoundary(current, resolvedBoundaries) &&
      !resolvedBoundaries.includes(current)
    ) {
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
    return (
      relative !== "" &&
      !relative.startsWith("..") &&
      !path.isAbsolute(relative)
    );
  });
}
