import fs from "node:fs";
import path from "node:path";
import { hashBytes } from "@bovinphang/craft-common";
import type { InstallLanguage } from "../language.js";
import type { InstallContext } from "../types.js";
export type InstallMode = "install" | "update";
export type ManifestRoot = "baseDir" | "cwd" | "home";

type ManifestFile = {
  path: string;
  hash: string;
  root?: ManifestRoot;
};

export type InstallManifest = {
  common?: {
    target: string;
    ledgerDir: string;
    packageVersion: string;
    language: InstallLanguage;
    digest: string;
  };
  packageVersion: string;
  runtime: string;
  scope: "global" | "local";
  language?: InstallLanguage;
  installedAt: string;
  files: ManifestFile[];
  settingsHooks?: Array<{
    path: string;
    root?: ManifestRoot;
    hooks: Record<string, unknown[]>;
  }>;
};

export function getManifestPath(baseDir: string): string {
  return path.join(baseDir, "frontend-craft.manifest.json");
}
export function parseInstallManifest(
  bytes: Buffer,
): InstallManifest | undefined {
  try {
    const parsed = JSON.parse(bytes.toString("utf8")) as InstallManifest;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed) ||
      typeof parsed.packageVersion !== "string" ||
      !parsed.packageVersion ||
      typeof parsed.runtime !== "string" ||
      !["local", "global"].includes(parsed.scope) ||
      typeof parsed.installedAt !== "string" ||
      (parsed.language !== undefined &&
        !["en", "zh-CN"].includes(parsed.language)) ||
      !Array.isArray(parsed.files) ||
      parsed.files.some(
        (file) =>
          !file ||
          typeof file.path !== "string" ||
          !file.path ||
          typeof file.hash !== "string" ||
          !/^[a-f0-9]{64}$/.test(file.hash) ||
          (file.root !== undefined &&
            !["baseDir", "cwd", "home"].includes(file.root)),
      )
    )
      return;
    if (
      parsed.settingsHooks !== undefined &&
      (!Array.isArray(parsed.settingsHooks) ||
        parsed.settingsHooks.some(
          (record) =>
            !record ||
            typeof record.path !== "string" ||
            !record.path ||
            (record.root !== undefined &&
              !["baseDir", "cwd", "home"].includes(record.root)) ||
            !record.hooks ||
            typeof record.hooks !== "object" ||
            Array.isArray(record.hooks) ||
            Object.values(record.hooks).some(
              (entries) => !Array.isArray(entries),
            ),
        ))
    )
      return;
    if (
      parsed.common &&
      (!path.isAbsolute(parsed.common.target) ||
        !path.isAbsolute(parsed.common.ledgerDir) ||
        typeof parsed.common.packageVersion !== "string" ||
        !["en", "zh-CN"].includes(parsed.common.language) ||
        !/^[a-f0-9]{64}$/.test(parsed.common.digest))
    )
      return;
    return {
      ...parsed,
      files: parsed.files.map((file) => ({
        ...file,
        path: file.path.split(path.sep).join("/"),
      })),
    };
  } catch {
    return;
  }
}
export function readInstallManifest(file: string): InstallManifest | undefined {
  try {
    const stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink()) return;
    return parseInstallManifest(fs.readFileSync(file));
  } catch {
    return;
  }
}
export function hashContent(content: string | Buffer): string {
  return hashBytes(Buffer.from(content));
}
export function hashFile(file: string): string {
  return hashContent(fs.readFileSync(file));
}
export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  else if (!fs.statSync(dir).isDirectory())
    throw new Error(`Expected directory: ${dir}`);
}
export function readUtf8(file: string): string {
  return fs.readFileSync(file, "utf8");
}
export function writeUtf8(file: string, body: string): void {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, body);
}
export function copyFile(source: string, target: string): void {
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}
export function copyDir(
  source: string,
  target: string,
  options: { filter?: (relative: string) => boolean } = {},
): void {
  if (!fs.existsSync(source)) return;
  ensureDir(target);
  for (const item of fs.readdirSync(source, { withFileTypes: true })) {
    if (options.filter && !options.filter(item.name)) continue;
    if (item.isSymbolicLink())
      throw new Error("Source resources cannot contain links");
    const from = path.join(source, item.name),
      to = path.join(target, item.name);
    if (item.isDirectory()) copyDir(from, to, options);
    else copyFile(from, to);
  }
}
export function listFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const file = path.join(dir, item.name);
    if (item.isSymbolicLink())
      throw new Error("Resource tree cannot contain links");
    return item.isDirectory() ? listFilesRecursive(file) : [file];
  });
}
export function copyProductSkills(source: string, target: string): void {
  for (const item of fs.readdirSync(source, { withFileTypes: true }))
    if (item.isDirectory() && item.name.startsWith("fec-"))
      copyDir(path.join(source, item.name), path.join(target, item.name));
}

export function createFileTools(ctx: InstallContext) {
  const session = ctx.session;
  if (!session)
    throw new Error("Installer requires an explicit planning session");
  const write = (file: string, bytes: Buffer): void => {
    if (
      ctx.runtime === "claude" &&
      path.resolve(file) === path.resolve(ctx.baseDir, "settings.json")
    )
      session.stage(file, bytes);
    else session.writeManaged(file, bytes);
  };
  const tools = {
    ensureDir(_dir: string): void {},
    readUtf8,
    writeUtf8(file: string, body: string): void {
      write(file, Buffer.from(body));
    },
    writeSharedUtf8(file: string, body: string): void {
      session.stage(file, Buffer.from(body));
    },
    copyFile(source: string, target: string): void {
      if (fs.lstatSync(source).isSymbolicLink())
        throw new Error("Source resources cannot contain links");
      write(target, fs.readFileSync(source));
    },
    copyDir(
      source: string,
      target: string,
      options: { filter?: (relative: string) => boolean } = {},
    ): void {
      if (!fs.existsSync(source)) return;
      for (const item of fs.readdirSync(source, { withFileTypes: true })) {
        if (options.filter && !options.filter(item.name)) continue;
        if (item.isSymbolicLink())
          throw new Error("Source resources cannot contain links");
        const from = path.join(source, item.name),
          to = path.join(target, item.name);
        if (item.isDirectory()) tools.copyDir(from, to, options);
        else tools.copyFile(from, to);
      }
    },
    copyProductSkills(source: string, target: string): void {
      for (const item of fs.readdirSync(source, { withFileTypes: true }))
        if (item.isDirectory() && item.name.startsWith("fec-"))
          tools.copyDir(
            path.join(source, item.name),
            path.join(target, item.name),
          );
    },
    retireManagedFile(file: string): void {
      session.retireTree(file);
    },
    retireManagedTree(dir: string): void {
      session.retireTree(dir);
    },
    forgetManagedFile(file: string): void {
      session.retireTree(file);
    },
  };
  return tools;
}
