import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";
import { parse } from "yaml";

export const CLI_PACKAGE = "@bovinphang/frontend-craft";
export interface ProcessOptions {
  cwd: string;
  env: NodeJS.ProcessEnv;
  stdio?: "inherit" | "pipe";
}
export type ProcessRunner = (
  file: string,
  args: string[],
  options: ProcessOptions,
) => Promise<{ code: number; stdout: string }>;
export interface PackageManager {
  name: "npm" | "pnpm";
  file: string;
  args?: string[];
}
export interface GlobalInstallation {
  kind: "global";
  manager: PackageManager;
  prefix: string;
  registry: string;
  packageRoot: string;
  shared: boolean;
  globalDir?: string;
}
export interface TemporaryInstallation {
  kind: "temporary";
  manager: PackageManager;
  registry: string;
  packageRoot: string;
}
export type Installation = GlobalInstallation | TemporaryInstallation;
export interface DetectionOptions {
  runner: ProcessRunner;
  managers: PackageManager[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export const runProcess: ProcessRunner = (file, args, options) =>
  new Promise((resolve, reject) => {
    const child = spawn(file, args, {
      ...options,
      shell: false,
      windowsHide: true,
      stdio:
        options.stdio === "inherit" ? "inherit" : ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    child.stdout?.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr?.resume();
    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout });
    });
  });

// Only recognized Node shims are interpreted; batch files never pass through a shell.
export function resolveManagerExecutable(
  file: string,
  name: PackageManager["name"],
  platform = process.platform,
): PackageManager | null {
  if (platform !== "win32" || !/\.(?:cmd|bat)$/i.test(file))
    return { name, file };
  const directory = path.dirname(file);
  const content = fs.readFileSync(file, "utf8");
  const candidates = [
    ...content.matchAll(/"([^"\r\n]+\.(?:cjs|mjs|js))"/gi),
  ].map((match) =>
    match[1]
      .replace(/^[A-Z_][A-Z_0-9]*=/i, "")
      .replace(/%~dp0%?/gi, directory + path.sep)
      .replace(/%dp0%/gi, directory + path.sep)
      .replace(/[\\/]/g, path.sep),
  );
  for (const candidate of candidates) {
    if (candidate.includes("%") || !fs.existsSync(candidate)) continue;
    if (name === "npm" && !/[\\/]npm-cli\.js$/i.test(candidate)) continue;
    if (name === "pnpm" && !/[\\/]pnpm\.(?:cjs|mjs|js)$/i.test(candidate))
      continue;
    return { name, file: process.execPath, args: [fs.realpathSync(candidate)] };
  }
  return null;
}

export function findPackageManagers(env = process.env): PackageManager[] {
  const managers: PackageManager[] = [];
  const seen = new Set<string>();
  for (const directory of (env.PATH ?? env.Path ?? "").split(path.delimiter)) {
    for (const name of ["npm", "pnpm"] as const) {
      for (const ext of process.platform === "win32"
        ? [".cmd", ".exe"]
        : [""]) {
        const candidate = path.resolve(
          directory.replace(/^"|"$/g, ""),
          name + ext,
        );
        if (!fs.existsSync(candidate) || seen.has(candidate)) continue;
        seen.add(candidate);
        try {
          const manager = resolveManagerExecutable(candidate, name);
          if (manager) managers.push(manager);
        } catch {
          /* An unreadable shim cannot prove ownership. */
        }
      }
    }
  }
  return managers;
}

export async function managerQuery(
  manager: PackageManager,
  args: string[],
  options: DetectionOptions,
): Promise<string> {
  const result = await options.runner(
    manager.file,
    [...(manager.args ?? []), ...args],
    {
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
      stdio: "pipe",
    },
  );
  if (result.code !== 0)
    throw new Error(`${manager.name} 查询失败：${args[0] ?? "未知命令"}`);
  return result.stdout.trim();
}
function sameRealPath(a: string, b: string): boolean {
  try {
    return fs.realpathSync(a) === fs.realpathSync(b);
  } catch {
    return false;
  }
}
function readJson(file: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
}
function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}
function registryUrl(value: unknown): boolean {
  return typeof value === "string" && /^https?:\/\//.test(value);
}
function registrySpec(value: unknown): boolean {
  return (
    typeof value === "string" &&
    /^(?:[~^]?\d|\*|latest$)/.test(value) &&
    !/(?:file:|link:|workspace:|git|https?:)/.test(value)
  );
}
function tarballRegistry(resolved: unknown): string | null {
  if (!registryUrl(resolved)) return null;
  try {
    const url = new URL(resolved as string);
    const pathname = decodeURIComponent(url.pathname);
    const marker = `/${CLI_PACKAGE}/-/frontend-craft-`;
    const index = pathname.lastIndexOf(marker);
    if (index < 0 || !pathname.endsWith(".tgz")) return null;
    return url.origin + pathname.slice(0, index + 1);
  } catch {
    return null;
  }
}
function normalizeRegistry(value: string): string {
  const url = new URL(value);
  return url.origin + url.pathname.replace(/\/?$/, "/");
}
async function effectiveRegistry(
  manager: PackageManager,
  options: DetectionOptions,
): Promise<string> {
  try {
    const scoped = await managerQuery(
      manager,
      ["config", "get", "@bovinphang:registry"],
      options,
    );
    if (registryUrl(scoped)) return scoped;
  } catch {
    /* Unconfigured scopes use the default registry. */
  }
  return managerQuery(manager, ["config", "get", "registry"], options);
}
function npmRegistryEvidence(
  root: string,
  dependency: Record<string, unknown>,
): string | null {
  if (
    dependency.link ||
    (dependency.resolved && !registryUrl(dependency.resolved))
  )
    return null;
  if (dependency.resolved) return tarballRegistry(dependency.resolved);
  try {
    const lock = readJson(path.join(root, ".package-lock.json"));
    const entry = record(record(lock.packages)[`node_modules/${CLI_PACKAGE}`]);
    return entry.link ? null : tarballRegistry(entry.resolved);
  } catch {
    return null;
  }
}

function customNpmPrefix(packageRoot: string): string | null {
  const modules = path.dirname(path.dirname(packageRoot));
  if (path.basename(modules) !== "node_modules") return null;
  const parent = path.dirname(modules);
  const prefix =
    path.basename(parent) === "lib" ? path.dirname(parent) : parent;
  try {
    const manifest = readJson(path.join(packageRoot, "package.json"));
    const relative =
      typeof manifest.bin === "string"
        ? manifest.bin
        : record(manifest.bin).fec;
    if (typeof relative !== "string") return null;
    const entry = path.resolve(packageRoot, relative);
    if (sameRealPath(path.join(prefix, "bin", "fec"), entry)) return prefix;
    const shim = fs.readFileSync(path.join(prefix, "fec.cmd"), "utf8");
    for (const match of shim.matchAll(/"([^"\r\n]+\.(?:cjs|mjs|js))"/gi)) {
      const candidate = match[1]
        .replace(/^[A-Z_][A-Z_0-9]*=/i, "")
        .replace(/%~dp0%?/gi, prefix + path.sep)
        .replace(/%dp0%/gi, prefix + path.sep)
        .replace(/[\\/]/g, path.sep);
      if (sameRealPath(candidate, entry)) return prefix;
    }
  } catch {
    /* Missing global shims prevent confusing a local dependency with a custom prefix. */
  }
  return null;
}

export async function identifyInstallation(
  pluginRoot: string,
  options: DetectionOptions,
): Promise<Installation> {
  const realRoot = fs.realpathSync(pluginRoot);
  const matches = new Map<string, GlobalInstallation>();
  let registryConflict = false;
  for (const manager of options.managers) {
    try {
      const registry = await effectiveRegistry(manager, options);
      if (!registryUrl(registry)) continue;
      if (manager.name === "npm") {
        const defaultPrefix = await managerQuery(
          manager,
          ["prefix", "--global"],
          options,
        );
        const inferredPrefix = customNpmPrefix(pluginRoot);
        const prefixes = new Set([
          defaultPrefix,
          ...(inferredPrefix ? [inferredPrefix] : []),
        ]);
        for (const prefix of prefixes) {
          const root = await managerQuery(
            manager,
            ["root", "--global", "--prefix", prefix],
            options,
          );
          if (!sameRealPath(path.join(root, CLI_PACKAGE), realRoot)) continue;
          const listing = JSON.parse(
            await managerQuery(
              manager,
              [
                "ls",
                "--global",
                "--depth=0",
                "--json",
                "--long",
                "--prefix",
                prefix,
              ],
              options,
            ),
          ) as Record<string, unknown>;
          const dependency = record(record(listing.dependencies)[CLI_PACKAGE]);
          const installedRegistry = npmRegistryEvidence(root, dependency);
          if (!installedRegistry) continue;
          if (
            normalizeRegistry(installedRegistry) !== normalizeRegistry(registry)
          ) {
            registryConflict = true;
            continue;
          }
          matches.set(`npm:${fs.realpathSync(prefix)}`, {
            kind: "global",
            manager,
            prefix,
            registry,
            packageRoot: realRoot,
            shared: false,
          });
        }
        continue;
      }
      const raw: unknown = JSON.parse(
        await managerQuery(
          manager,
          ["list", "--global", "--depth=0", "--json"],
          options,
        ),
      );
      for (const value of Array.isArray(raw) ? raw : [raw]) {
        const group = record(value);
        if (typeof group.path !== "string") continue;
        const dependency = record(record(group.dependencies)[CLI_PACKAGE]);
        const direct = path.join(group.path, "node_modules", CLI_PACKAGE);
        if (!sameRealPath(direct, realRoot)) continue;
        const manifest = readJson(path.join(group.path, "package.json"));
        const dependencies = record(manifest.dependencies);
        if (!registrySpec(dependencies[CLI_PACKAGE])) continue;
        const lock = fs.readFileSync(
          path.join(group.path, "pnpm-lock.yaml"),
          "utf8",
        );
        if (
          /(?:file:|link:|workspace:)/.test(lock) ||
          !lock.includes(`${CLI_PACKAGE}@`) ||
          !lock.includes("integrity:")
        )
          continue;
        if (dependency.resolved && !registryUrl(dependency.resolved)) continue;
        const metadata = record(
          parse(
            fs.readFileSync(
              path.join(group.path, "node_modules", ".modules.yaml"),
              "utf8",
            ),
          ),
        );
        const registries = record(metadata.registries);
        const installedRegistry =
          registries["@bovinphang"] ?? registries.default;
        if (!registryUrl(installedRegistry)) continue;
        if (
          normalizeRegistry(installedRegistry as string) !==
          normalizeRegistry(registry)
        ) {
          registryConflict = true;
          continue;
        }
        const parent = path.dirname(group.path);
        const globalDir = /^v\d+$/.test(path.basename(parent))
          ? path.dirname(parent)
          : path.dirname(group.path);
        matches.set(`pnpm:${fs.realpathSync(group.path)}`, {
          kind: "global",
          manager,
          prefix: group.path,
          globalDir,
          registry,
          packageRoot: realRoot,
          shared: Object.keys(dependencies).some((key) => key !== CLI_PACKAGE),
        });
      }
    } catch {
      /* Try another manager only during read-only ownership discovery. */
    }
  }
  if (matches.size > 1)
    throw new Error("CLI 安装来源归属不唯一，已拒绝自动操作。");
  if (matches.size === 1) return [...matches.values()][0];
  if (registryConflict)
    throw new Error(
      "当前有效 registry 与安装记录的注册表来源不一致，请恢复原 registry（含 @bovinphang:registry）配置后重试。",
    );
  const env = options.env ?? process.env;
  const caches = [
    env.npm_config_cache,
    path.join(os.homedir(), ".npm"),
    env.LOCALAPPDATA && path.join(env.LOCALAPPDATA, "npm-cache"),
  ].filter((x): x is string => Boolean(x));
  for (const manager of options.managers.filter(
    (item) => item.name === "npm",
  )) {
    try {
      const configuredCache = await managerQuery(
        manager,
        ["config", "get", "cache"],
        options,
      );
      if (path.isAbsolute(configuredCache)) caches.push(configuredCache);
    } catch {
      /* A missing npm configuration cannot establish cache ownership. */
    }
  }
  for (const cache of caches) {
    const relative = path.relative(path.resolve(cache, "_npx"), realRoot);
    if (relative.startsWith("..") || path.isAbsolute(relative)) continue;
    const parts = relative.split(path.sep);
    if (
      parts.length !== 4 ||
      parts[1] !== "node_modules" ||
      parts.slice(2).join("/") !== CLI_PACKAGE
    )
      continue;
    try {
      const lock = readJson(
        path.join(cache, "_npx", parts[0], "package-lock.json"),
      );
      const entry = record(
        record(lock.packages)[`node_modules/${CLI_PACKAGE}`],
      );
      if (!registryUrl(entry.resolved) || entry.link) continue;
      const manager = options.managers.find((item) => item.name === "npm");
      if (!manager) continue;
      const registry = await effectiveRegistry(manager, options);
      const installedRegistry = tarballRegistry(entry.resolved);
      if (
        installedRegistry &&
        registryUrl(registry) &&
        normalizeRegistry(installedRegistry) === normalizeRegistry(registry)
      )
        return { kind: "temporary", manager, registry, packageRoot: realRoot };
    } catch {
      /* Unknown cache layouts remain unsupported. */
    }
  }
  throw new Error(
    "无法验证 CLI 的注册表全局安装来源；源码链接、项目依赖和未知来源不支持自身管理。请使用原安装方式管理 CLI。",
  );
}

export async function relocatePackage(
  source: GlobalInstallation,
  options: DetectionOptions,
): Promise<string> {
  if (source.manager.name === "npm") {
    const root = await managerQuery(
      source.manager,
      ["root", "--global", "--prefix", source.prefix],
      options,
    );
    return fs.realpathSync(path.join(root, CLI_PACKAGE));
  }
  const raw: unknown = JSON.parse(
    await managerQuery(
      source.manager,
      [
        "list",
        "--global",
        "--depth=0",
        "--json",
        ...(source.globalDir ? ["--global-dir", source.globalDir] : []),
      ],
      options,
    ),
  );
  const found: string[] = [];
  for (const item of Array.isArray(raw) ? raw : [raw]) {
    const group = record(item);
    if (
      typeof group.path === "string" &&
      record(group.dependencies)[CLI_PACKAGE]
    )
      found.push(
        fs.realpathSync(path.join(group.path, "node_modules", CLI_PACKAGE)),
      );
  }
  if (found.length !== 1) throw new Error("无法唯一定位更新后的 pnpm CLI 包。");
  return found[0];
}
