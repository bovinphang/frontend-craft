import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import type { InstallLanguage } from "../language.js";

export type InstallMode = "install" | "update";
export type ManifestRoot = "baseDir" | "cwd" | "home";

type ManifestFile = {
  path: string;
  hash: string;
  root?: ManifestRoot;
};

export type InstallManifest = {
  packageVersion: string;
  runtime: string;
  scope: "global" | "local";
  language?: InstallLanguage;
  installedAt: string;
  files: ManifestFile[];
};

type ManifestSession = {
  baseDir: string;
  cwd: string;
  homeDir: string;
  mode: InstallMode;
  packageVersion: string;
  runtime: string;
  scope: "global" | "local";
  language: InstallLanguage;
  manifestPath: string;
  previousFiles: Map<string, string>;
  writtenFiles: Map<string, string>;
  skippedFiles: Set<string>;
};

let manifestSession: ManifestSession | undefined;

export function beginManifestSession({
  baseDir,
  cwd = process.cwd(),
  mode,
  packageVersion,
  runtime,
  isGlobal,
  language,
}: {
  baseDir: string;
  cwd?: string;
  mode: InstallMode;
  packageVersion: string;
  runtime: string;
  isGlobal: boolean;
  language: InstallLanguage;
}): void {
  const manifestPath = path.join(baseDir, "frontend-craft.manifest.json");
  manifestSession = {
    baseDir: path.resolve(baseDir),
    cwd: path.resolve(cwd),
    homeDir: path.resolve(os.homedir()),
    mode,
    packageVersion,
    runtime,
    scope: isGlobal ? "global" : "local",
    language,
    manifestPath,
    previousFiles: readManifestFiles(manifestPath),
    writtenFiles: new Map(),
    skippedFiles: new Set(),
  };
}

export function endManifestSession(): void {
  const session = manifestSession;
  manifestSession = undefined;
  if (!session) return;

  for (const [filePath, hash] of session.previousFiles) {
    if (session.skippedFiles.has(filePath) && !session.writtenFiles.has(filePath)) {
      session.writtenFiles.set(filePath, hash);
    }
  }

  const files = [...session.writtenFiles.entries()]
    .map(([fileKey, hash]) => parseManifestFileKey(fileKey, hash))
    .sort((a, b) => a.path.localeCompare(b.path));
  const manifest: InstallManifest = {
    packageVersion: session.packageVersion,
    runtime: session.runtime,
    scope: session.scope,
    language: session.language,
    installedAt: new Date().toISOString(),
    files,
  };
  ensureDir(path.dirname(session.manifestPath));
  fs.writeFileSync(session.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

export function discardManifestSession(): void {
  manifestSession = undefined;
}

export function getManifestPath(baseDir: string): string {
  return path.join(baseDir, "frontend-craft.manifest.json");
}

export function readInstallManifest(manifestPath: string): InstallManifest | undefined {
  if (!fs.existsSync(manifestPath)) return undefined;
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as InstallManifest;
    return {
      ...parsed,
      files: (parsed.files ?? []).map((file) => ({ ...file, path: normalizeManifestPath(file.path) })),
    };
  } catch {
    return undefined;
  }
}

function readManifestFiles(manifestPath: string): Map<string, string> {
  const manifest = readInstallManifest(manifestPath);
  return new Map(
    (manifest?.files ?? []).map((file) => [getManifestFileKey(file.root ?? "baseDir", normalizeManifestPath(file.path)), file.hash]),
  );
}

export function hashContent(content: string | Buffer): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export function hashFile(filePath: string): string {
  return hashContent(fs.readFileSync(filePath));
}

function getSessionFileKey(filePath: string): string | undefined {
  const session = manifestSession;
  if (!session) return undefined;
  const resolved = path.resolve(filePath);
  const roots: Array<[ManifestRoot, string]> = [
    ["baseDir", session.baseDir],
    ["cwd", session.cwd],
    ["home", session.homeDir],
  ];
  for (const [root, rootDir] of roots) {
    const relative = path.relative(rootDir, resolved);
    if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
      return getManifestFileKey(root, normalizeManifestPath(relative));
    }
  }
  return undefined;
}

function normalizeManifestPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function getManifestFileKey(root: ManifestRoot, filePath: string): string {
  return `${root}:${filePath}`;
}

function parseManifestFileKey(fileKey: string, hash: string): ManifestFile {
  const match = /^(baseDir|cwd|home):(.*)$/.exec(fileKey);
  if (!match) return { path: fileKey, hash };
  const root = match[1] as ManifestRoot;
  return {
    ...(root === "baseDir" ? {} : { root }),
    path: match[2],
    hash,
  };
}

function shouldSkipManagedWrite(dest: string): boolean {
  const session = manifestSession;
  const fileKey = getSessionFileKey(dest);
  if (!session || !fileKey || session.mode !== "update" || !fs.existsSync(dest)) return false;
  const previousHash = session.previousFiles.get(fileKey);
  if (!previousHash) return false;
  if (hashFile(dest) === previousHash) return false;
  session.skippedFiles.add(fileKey);
  console.log(`Skipped modified file: ${parseManifestFileKey(fileKey, previousHash).path}`);
  return true;
}

function recordManagedWrite(dest: string, content: string | Buffer): void {
  const session = manifestSession;
  const fileKey = getSessionFileKey(dest);
  if (!session || !fileKey) return;
  session.writtenFiles.set(fileKey, hashContent(content));
}

/**
 * @param {string} dir
 */
export function ensureDir(dir: string): void {
  if (fs.existsSync(dir)) return;
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * @param {string} src
 * @param {string} dest
 */
export function copyFile(src: string, dest: string): void {
  if (shouldSkipManagedWrite(dest)) return;
  ensureDir(path.dirname(dest));
  const content = fs.readFileSync(src);
  fs.copyFileSync(src, dest);
  recordManagedWrite(dest, content);
}

/**
 * @param {string} srcDir
 * @param {string} destDir
 * @param {{ filter?: (rel: string) => boolean }} [opts]
 */
export function copyDir(srcDir: string, destDir: string, opts: { filter?: (rel: string) => boolean } = {}): void {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(destDir);
  for (const name of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, name);
    const rel = name;
    if (opts.filter && !opts.filter(rel)) continue;
    const d = path.join(destDir, name);
    const st = fs.statSync(s);
    if (st.isDirectory()) copyDir(s, d, opts);
    else copyFile(s, d);
  }
}

/**
 * @param {string} filePath
 * @returns {string}
 */
export function readUtf8(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

/**
 * @param {string} filePath
 * @param {string} content
 */
export function writeUtf8(filePath: string, content: string): void {
  if (shouldSkipManagedWrite(filePath)) return;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
  recordManagedWrite(filePath, content);
}

/**
 * @param {string} dir
 * @returns {string[]}
 */
export function listFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...listFilesRecursive(p));
    else out.push(p);
  }
  return out;
}
