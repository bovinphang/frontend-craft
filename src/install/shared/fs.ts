import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type InstallMode = "install" | "update";

type ManifestFile = {
  path: string;
  hash: string;
};

type InstallManifest = {
  packageVersion: string;
  runtime: string;
  scope: "global" | "local";
  installedAt: string;
  files: ManifestFile[];
};

type ManifestSession = {
  baseDir: string;
  mode: InstallMode;
  packageVersion: string;
  runtime: string;
  scope: "global" | "local";
  manifestPath: string;
  previousFiles: Map<string, string>;
  writtenFiles: Map<string, string>;
  skippedFiles: Set<string>;
};

let manifestSession: ManifestSession | undefined;

export function beginManifestSession({
  baseDir,
  mode,
  packageVersion,
  runtime,
  isGlobal,
}: {
  baseDir: string;
  mode: InstallMode;
  packageVersion: string;
  runtime: string;
  isGlobal: boolean;
}): void {
  const manifestPath = path.join(baseDir, "frontend-craft.manifest.json");
  manifestSession = {
    baseDir: path.resolve(baseDir),
    mode,
    packageVersion,
    runtime,
    scope: isGlobal ? "global" : "local",
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
    .map(([filePath, hash]) => ({ path: filePath, hash }))
    .sort((a, b) => a.path.localeCompare(b.path));
  const manifest: InstallManifest = {
    packageVersion: session.packageVersion,
    runtime: session.runtime,
    scope: session.scope,
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

function readManifestFiles(manifestPath: string): Map<string, string> {
  if (!fs.existsSync(manifestPath)) return new Map();
  try {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as { files?: ManifestFile[] };
    return new Map((parsed.files ?? []).map((file) => [normalizeManifestPath(file.path), file.hash]));
  } catch {
    return new Map();
  }
}

function hashContent(content: string | Buffer): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function hashFile(filePath: string): string {
  return hashContent(fs.readFileSync(filePath));
}

function getSessionRelativePath(filePath: string): string | undefined {
  const session = manifestSession;
  if (!session) return undefined;
  const relative = path.relative(session.baseDir, path.resolve(filePath));
  if (relative.startsWith("..") || path.isAbsolute(relative)) return undefined;
  return normalizeManifestPath(relative);
}

function normalizeManifestPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

function shouldSkipManagedWrite(dest: string): boolean {
  const session = manifestSession;
  const relative = getSessionRelativePath(dest);
  if (!session || !relative || session.mode !== "update" || !fs.existsSync(dest)) return false;
  const previousHash = session.previousFiles.get(relative);
  if (!previousHash) return false;
  if (hashFile(dest) === previousHash) return false;
  session.skippedFiles.add(relative);
  console.log(`Skipped modified file: ${relative}`);
  return true;
}

function recordManagedWrite(dest: string, content: string | Buffer): void {
  const session = manifestSession;
  const relative = getSessionRelativePath(dest);
  if (!session || !relative) return;
  session.writtenFiles.set(relative, hashContent(content));
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
