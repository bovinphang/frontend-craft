import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  identifyInstallation,
  type ProcessRunner,
} from "../../src/install/package-manager.js";
import { fixture } from "./lifecycle-fixtures.js";
const name = "@bovinphang/frontend-craft";
test("npm ownership uses the real global package and original prefix/registry", async (t) => {
  const f = fixture(t);
  const source = await identifyInstallation(f.pkg, {
    runner: f.runner,
    managers: [{ name: "npm", file: "/fake npm" }],
  });
  assert.equal(source.kind, "global");
  if (source.kind !== "global") return;
  assert.equal(source.prefix, f.prefix);
  assert.equal(source.registry, "https://registry.example.test/");
});

test("project copies and file/link global dependencies are rejected", async (t) => {
  const f = fixture(t);
  const options = {
    runner: f.runner,
    managers: [{ name: "npm" as const, file: "/fake npm" }],
  };
  await assert.rejects(identifyInstallation(f.base, options), /来源|全局/);
  const runner: ProcessRunner = async (file, args, opts) =>
    args[0] === "ls"
      ? {
          code: 0,
          stdout: JSON.stringify({
            dependencies: {
              [name]: { resolved: "file:../source", version: "3.0.0" },
            },
          }),
        }
      : f.runner(file, args, opts);
  await assert.rejects(
    identifyInstallation(f.pkg, { ...options, runner }),
    /来源|注册表/,
  );
});

test("Windows Node shims with spaces are resolved without cmd shell", async (t) => {
  const f = fixture(t);
  const { resolveManagerExecutable } =
    await import("../../src/install/package-manager.js");
  const entry = path.join(f.base, "node_modules/npm/bin/npm-cli.js");
  fs.mkdirSync(path.dirname(entry), { recursive: true });
  fs.writeFileSync(entry, "// fake npm");
  const shim = path.join(f.base, "npm.cmd");
  fs.writeFileSync(
    shim,
    '@echo off\nnode "%~dp0\\node_modules\\npm\\bin\\npm-cli.js" %*',
  );
  const manager = resolveManagerExecutable(shim, "npm", "win32");
  assert.equal(manager?.file, process.execPath);
  assert.deepEqual(manager?.args, [fs.realpathSync(entry)]);
});

test("pnpm validates a direct global symlink into a virtual store and detects shared groups", async (t) => {
  const { pnpmFixture } = await import("./lifecycle-fixtures.js");
  const f = pnpmFixture(t, true);
  const source = await identifyInstallation(f.pkg, {
    runner: f.runner,
    managers: [{ name: "pnpm", file: "/fake pnpm" }],
  });
  assert.equal(source.kind, "global");
  if (source.kind !== "global") return;
  assert.equal(source.shared, true);
  assert.equal(source.globalDir, path.dirname(path.dirname(f.group)));
});

test("duplicate manager discovery is deduplicated while distinct matching sources are rejected", async (t) => {
  const { pnpmFixture } = await import("./lifecycle-fixtures.js");
  const f = pnpmFixture(t);
  const npm = { name: "npm" as const, file: "/fake npm" };
  assert.equal(
    (
      await identifyInstallation(f.pkg, {
        runner: f.runner,
        managers: [npm, npm],
      })
    ).kind,
    "global",
  );
  await assert.rejects(
    identifyInstallation(f.pkg, {
      runner: f.runner,
      managers: [npm, { name: "pnpm", file: "/fake pnpm" }],
    }),
    /不唯一/,
  );
});

test("pnpm file sources and mismatched global paths are rejected", async (t) => {
  const { pnpmFixture } = await import("./lifecycle-fixtures.js");
  const f = pnpmFixture(t);
  fs.writeFileSync(
    path.join(f.group, "package.json"),
    JSON.stringify({ dependencies: { [name]: "file:../local" } }),
  );
  await assert.rejects(
    identifyInstallation(f.pkg, {
      runner: f.runner,
      managers: [{ name: "pnpm", file: "/fake pnpm" }],
    }),
    /来源/,
  );
});

test("process runner preserves argument boundaries for absolute files containing spaces", async (t) => {
  const f = fixture(t);
  const { runProcess } = await import("../../src/install/package-manager.js");
  const script = path.join(f.base, "fake manager.cjs");
  fs.writeFileSync(
    script,
    "process.stdout.write(JSON.stringify(process.argv.slice(2)))",
  );
  const result = await runProcess(
    process.execPath,
    [script, "space value", "a&b", 'quote"value'],
    { cwd: f.base, env: process.env },
  );
  assert.equal(result.code, 0);
  assert.deepEqual(JSON.parse(result.stdout), [
    "space value",
    "a&b",
    'quote"value',
  ]);
});

test("modern npm variable-assignment shim and pnpm CMD use Node entrypoints", async (t) => {
  const f = fixture(t);
  const { resolveManagerExecutable } =
    await import("../../src/install/package-manager.js");
  for (const name of ["npm", "pnpm"] as const) {
    const relative =
      name === "npm"
        ? "node_modules/npm/bin/npm-cli.js"
        : ".tools/pnpm/10/node_modules/pnpm/bin/pnpm.cjs";
    const entry = path.join(f.base, relative);
    fs.mkdirSync(path.dirname(entry), { recursive: true });
    fs.writeFileSync(entry, "// fake manager");
    const shim = path.join(f.base, name + ".cmd");
    fs.writeFileSync(
      shim,
      name === "npm"
        ? `SET "NPM_CLI_JS=%~dp0\\${relative.replaceAll("/", "\\")}"\n"%NODE_EXE%" "%NPM_CLI_JS%" %*`
        : `node "%~dp0\\${relative.replaceAll("/", "\\")}" %*`,
    );
    assert.deepEqual(resolveManagerExecutable(shim, name, "win32"), {
      name,
      file: process.execPath,
      args: [fs.realpathSync(entry)],
    });
  }
});

test("custom npm prefix is recovered through root/list and the actual global fec shim", async (t) => {
  const f = fixture(t);
  const defaultPrefix = path.join(f.base, "different default prefix");
  fs.mkdirSync(defaultPrefix);
  const shim =
    process.platform === "win32"
      ? path.join(f.prefix, "fec.cmd")
      : path.join(f.prefix, "bin", "fec");
  fs.mkdirSync(path.dirname(shim), { recursive: true });
  const entry = path.join(f.pkg, "dist/bin/frontend-craft.js");
  if (process.platform === "win32")
    fs.writeFileSync(
      shim,
      'node "%~dp0\\node_modules\\@bovinphang\\frontend-craft\\dist\\bin\\frontend-craft.js" %*',
    );
  else fs.symlinkSync(entry, shim);
  const runner: ProcessRunner = async (file, args, opts) => {
    if (args[0] === "prefix") return { code: 0, stdout: defaultPrefix };
    if (args[0] === "root")
      return {
        code: 0,
        stdout:
          args.at(-1) === f.prefix
            ? f.root
            : path.join(defaultPrefix, "node_modules"),
      };
    return f.runner(file, args, opts);
  };
  const source = await identifyInstallation(f.pkg, {
    runner,
    managers: [{ name: "npm", file: "/fake npm" }],
  });
  assert.equal(source.kind, "global");
  if (source.kind === "global") assert.equal(source.prefix, f.prefix);
  fs.unlinkSync(shim);
  await assert.rejects(
    identifyInstallation(f.pkg, {
      runner,
      managers: [{ name: "npm", file: "/fake npm" }],
    }),
    /来源/,
  );
});

test("npm refuses registry drift and honors a matching scoped registry", async (t) => {
  const f = fixture(t);
  let scoped = "undefined";
  const runner: ProcessRunner = async (file, args, opts) =>
    args[0] === "config" && args[2] !== "cache"
      ? {
          code: 0,
          stdout:
            args[2] === "@bovinphang:registry"
              ? scoped
              : "https://different-registry.example.test/",
        }
      : f.runner(file, args, opts);
  const options = {
    runner,
    managers: [{ name: "npm" as const, file: "/fake npm" }],
  };
  await assert.rejects(identifyInstallation(f.pkg, options), /registry|注册表/);
  scoped = "https://registry.example.test/";
  const source = await identifyInstallation(f.pkg, options);
  assert.equal(source.registry, scoped);
});

test("pnpm installation registry metadata must match effective scoped/default config", async (t) => {
  const { pnpmFixture } = await import("./lifecycle-fixtures.js");
  const f = pnpmFixture(t);
  const runner: ProcessRunner = async (file, args, opts) =>
    args[0] === "config"
      ? { code: 0, stdout: "https://different-registry.example.test/" }
      : f.runner(file, args, opts);
  await assert.rejects(
    identifyInstallation(f.pkg, {
      runner,
      managers: [{ name: "pnpm", file: "/fake pnpm" }],
    }),
    /registry|注册表/,
  );
});
