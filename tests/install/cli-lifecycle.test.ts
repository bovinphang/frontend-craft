import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fixture } from "./lifecycle-fixtures.js";
import {
  createCliLifecycle,
  type CliLifecycleContext,
} from "../../src/install/cli-lifecycle.js";
import type { ProcessRunner } from "../../src/install/package-manager.js";

function setup(
  t: Parameters<typeof fixture>[0],
  runnerOverride?: ProcessRunner,
) {
  const f = fixture(t);
  const logs: string[] = [];
  let failed = false;
  let purged = 0;
  const runner: ProcessRunner =
    runnerOverride ??
    (async (file, args, opts) => {
      const result = await f.runner(file, args, opts);
      if (args[0] === "install") {
        const json = JSON.parse(
          fs.readFileSync(path.join(f.pkg, "package.json"), "utf8"),
        );
        json.version = "3.0.1";
        fs.writeFileSync(
          path.join(f.pkg, "package.json"),
          JSON.stringify(json),
        );
      }
      return result;
    });
  const run = createCliLifecycle({
    runner,
    managers: [{ name: "npm", file: "/fake npm" }],
    log: (x) => logs.push(x),
    fail: () => {
      failed = true;
    },
    isTTY: false,
  });
  const context: CliLifecycleContext = {
    pluginRoot: f.pkg,
    cwd: f.base,
    purgeResources: async () => {
      purged++;
      return true;
    },
    describeResources: () => ["project manifest", "global manifest"],
  };
  return {
    ...f,
    run,
    context,
    logs,
    get failed() {
      return failed;
    },
    get purged() {
      return purged;
    },
  };
}

test("update pins latest then runs the validated absolute new entry through current Node", async (t) => {
  const f = setup(t);
  await f.run("update", [], f.context);
  assert.equal(f.failed, false, f.logs.join("\n"));
  const install = f.calls.find((x) => x.args[0] === "install");
  assert.ok(install);
  assert.ok(install.args.includes("@bovinphang/frontend-craft@3.0.1"));
  assert.ok(install.args.includes(f.prefix));
  assert.ok(
    f.calls.some(
      (x) =>
        x.file === process.execPath &&
        x.args[0] === path.join(f.pkg, "dist/bin/frontend-craft.js") &&
        x.args.slice(1).join(" ") === "runtime update",
    ),
  );
});

test("dry-run only queries and describes resources", async (t) => {
  const f = setup(t);
  await f.run("update", ["--dry-run"], f.context);
  assert.equal(f.failed, false);
  assert.ok(
    !f.calls.some(
      (x) => x.args[0] === "install" || x.file === process.execPath,
    ),
  );
  assert.match(f.logs.join("\n"), /project manifest/);
});

test("legacy arguments fail before detection or purge and provide runtime migration", async (t) => {
  const f = setup(t);
  await f.run(
    "uninstall",
    ["claude", "--global", "--purge", "--yes"],
    f.context,
  );
  assert.equal(f.failed, true);
  assert.equal(f.calls.length, 0);
  assert.equal(f.purged, 0);
  assert.match(f.logs.join("\n"), /fec runtime uninstall claude --global/);
});

test("non-TTY uninstall requires yes and purge failure keeps CLI", async (t) => {
  const f = setup(t);
  await f.run("uninstall", ["--purge"], f.context);
  assert.equal(f.failed, true);
  assert.equal(f.purged, 0);
  f.context.purgeResources = async () => false;
  await f.run("uninstall", ["--purge", "--yes"], f.context);
  assert.ok(!f.calls.some((x) => x.args[0] === "uninstall"));
});

test("already-latest update still refreshes resources; install failure never refreshes", async (t) => {
  const f = setup(t);
  fs.writeFileSync(
    path.join(f.pkg, "package.json"),
    JSON.stringify({
      name: "@bovinphang/frontend-craft",
      version: "3.0.1",
      bin: { fec: "dist/bin/frontend-craft.js" },
    }),
  );
  await f.run("update", [], f.context);
  assert.equal(f.failed, false);
  assert.ok(!f.calls.some((x) => x.args[0] === "install"));
  assert.ok(f.calls.some((x) => x.file === process.execPath));
  const g = setup(t);
  const run = createCliLifecycle({
    runner: async (file, args, opts) =>
      args[0] === "install"
        ? { code: 1, stdout: "" }
        : g.runner(file, args, opts),
    managers: [{ name: "npm", file: "/fake npm" }],
    fail: () => {},
    log: () => {},
  });
  await run("update", [], g.context);
  assert.ok(!g.calls.some((x) => x.file === process.execPath));
});

test("uninstall yes invokes original manager only after successful purge", async (t) => {
  const f = setup(t);
  await f.run("uninstall", ["--yes", "--purge"], f.context);
  assert.equal(f.failed, false);
  assert.equal(f.purged, 1);
  const removal = f.calls.find((x) => x.args[0] === "uninstall");
  assert.ok(removal?.args.includes(f.prefix));
});

test("TTY rejection cancels without resource deletion", async (t) => {
  const f = setup(t);
  const run = createCliLifecycle({
    runner: f.runner,
    managers: [{ name: "npm", file: "/fake npm" }],
    isTTY: true,
    confirm: async () => false,
    fail: () => assert.fail("cancellation is not failure"),
    log: () => {},
  });
  await run("uninstall", ["--purge"], f.context);
  assert.equal(f.purged, 0);
  assert.ok(!f.calls.some((x) => x.args[0] === "uninstall"));
});

test("version mismatch after install stops continuation", async (t) => {
  const f = setup(t);
  const run = createCliLifecycle({
    runner: f.runner,
    managers: [{ name: "npm", file: "/fake npm" }],
    fail: () => {},
    log: (x) => f.logs.push(x),
  });
  await run("update", [], f.context);
  assert.ok(!f.calls.some((x) => x.file === process.execPath));
  assert.match(f.logs.join("\n"), /版本验证失败/);
});

test("pnpm shared groups reject update and purge uninstall before any mutation", async (t) => {
  const { pnpmFixture } = await import("./lifecycle-fixtures.js");
  const f = pnpmFixture(t, true);
  let purges = 0;
  const logs: string[] = [];
  const run = createCliLifecycle({
    runner: f.runner,
    managers: [{ name: "pnpm", file: "/fake pnpm" }],
    fail: () => {},
    log: (x) => logs.push(x),
  });
  const context = {
    pluginRoot: f.pkg,
    cwd: f.base,
    purgeResources: async () => {
      purges++;
      return true;
    },
    describeResources: () => [],
  };
  await run("update", [], context);
  await run("uninstall", ["--yes", "--purge"], context);
  assert.equal(purges, 0);
  assert.ok(!f.calls.some((x) => ["add", "remove"].includes(x.args[0])));
  assert.match(logs.join("\n"), /共享安装组/);
});

test("npm exec cache update requires latest and temporary purge uninstall is always refused", async (t) => {
  const f = setup(t);
  const cache = path.join(f.base, "npm cache");
  const hash = path.join(cache, "_npx", "abc123");
  const pkg = path.join(hash, "node_modules", "@bovinphang/frontend-craft");
  fs.mkdirSync(path.dirname(pkg), { recursive: true });
  fs.cpSync(f.pkg, pkg, { recursive: true });
  fs.writeFileSync(
    path.join(hash, "package-lock.json"),
    JSON.stringify({
      packages: {
        "node_modules/@bovinphang/frontend-craft": {
          resolved:
            "https://registry.example.test/@bovinphang/frontend-craft/-/frontend-craft-3.0.0.tgz",
        },
      },
    }),
  );
  const run = createCliLifecycle({
    runner: f.runner,
    managers: [{ name: "npm", file: "/fake npm" }],
    env: { ...process.env, npm_config_cache: cache },
    log: (x) => f.logs.push(x),
    fail: () => {},
  });
  const context = { ...f.context, pluginRoot: pkg };
  await run("update", [], context);
  assert.match(
    f.logs.join("\n"),
    /npx @bovinphang\/frontend-craft@latest runtime update/,
  );
  await run("uninstall", ["--yes", "--purge"], context);
  assert.equal(f.purged, 0);
  assert.ok(!f.calls.some((x) => ["install", "uninstall"].includes(x.args[0])));
  const meta = JSON.parse(
    fs.readFileSync(path.join(pkg, "package.json"), "utf8"),
  );
  meta.version = "3.0.1";
  fs.writeFileSync(path.join(pkg, "package.json"), JSON.stringify(meta));
  await run("update", [], context);
  assert.ok(
    f.calls.some(
      (x) =>
        x.file === process.execPath &&
        x.args[0] === path.join(pkg, "dist/bin/frontend-craft.js"),
    ),
  );
});

test("pnpm shim version dispatch and changing install groups retain original global directory and validate new entry", async (t) => {
  const { pnpmFixture } = await import("./lifecycle-fixtures.js");
  const { resolveManagerExecutable } =
    await import("../../src/install/package-manager.js");
  const f = pnpmFixture(t);
  const shimEntry = path.join(f.base, ".tools/pnpm/10/bin/pnpm.cjs");
  fs.mkdirSync(path.dirname(shimEntry), { recursive: true });
  fs.writeFileSync(
    shimEntry,
    "// dispatches to effective project packageManager v12",
  );
  const shim = path.join(f.base, "pnpm.CMD");
  fs.writeFileSync(shim, 'node "%~dp0\\.tools\\pnpm\\10\\bin\\pnpm.cjs" %*');
  const manager = resolveManagerExecutable(shim, "pnpm", "win32");
  assert.ok(manager);
  const newGroup = path.join(path.dirname(f.group), "replacement-target");
  const newPkg = path.join(f.base, "global virtual store", "new-package");
  let updated = false;
  let continuation = false;
  const runner: ProcessRunner = async (file, args, opts) => {
    if (args[0] === shimEntry) {
      assert.equal(file, process.execPath);
      const command = args.slice(1);
      if (command[0] === "add") {
        assert.ok(command.includes(path.dirname(path.dirname(f.group))));
        assert.ok(command.includes("@bovinphang/frontend-craft@3.0.1"));
        fs.mkdirSync(path.dirname(newPkg), { recursive: true });
        fs.cpSync(f.pkg, newPkg, { recursive: true });
        const json = JSON.parse(
          fs.readFileSync(path.join(newPkg, "package.json"), "utf8"),
        );
        json.version = "3.0.1";
        fs.writeFileSync(
          path.join(newPkg, "package.json"),
          JSON.stringify(json),
        );
        fs.mkdirSync(path.join(newGroup, "node_modules", "@bovinphang"), {
          recursive: true,
        });
        fs.symlinkSync(
          newPkg,
          path.join(newGroup, "node_modules", "@bovinphang/frontend-craft"),
          "junction",
        );
        fs.copyFileSync(
          path.join(f.group, "package.json"),
          path.join(newGroup, "package.json"),
        );
        fs.copyFileSync(
          path.join(f.group, "pnpm-lock.yaml"),
          path.join(newGroup, "pnpm-lock.yaml"),
        );
        fs.copyFileSync(
          path.join(f.group, "node_modules", ".modules.yaml"),
          path.join(newGroup, "node_modules", ".modules.yaml"),
        );
        updated = true;
        return { code: 0, stdout: "" };
      }
      if (command[0] === "list" && updated)
        return {
          code: 0,
          stdout: JSON.stringify([
            {
              path: newGroup,
              dependencies: {
                "@bovinphang/frontend-craft": { version: "3.0.1" },
              },
            },
          ]),
        };
      return f.runner(file, command, opts);
    }
    assert.deepEqual(args, [
      path.join(newPkg, "dist/bin/frontend-craft.js"),
      "runtime",
      "update",
    ]);
    assert.equal(opts.cwd, f.base);
    assert.equal(opts.env, process.env);
    assert.equal(opts.stdio, "inherit");
    continuation = true;
    return { code: 0, stdout: "" };
  };
  await createCliLifecycle({
    runner,
    managers: [manager],
    fail: () => assert.fail("update should succeed"),
    log: () => {},
  })("update", [], {
    pluginRoot: f.pkg,
    cwd: f.base,
    purgeResources: async () => true,
    describeResources: () => [],
  });
  assert.equal(continuation, true);
});

test("uninstall dry-run neither confirms nor deletes and previews purge only", async (t) => {
  const f = setup(t);
  const previews: boolean[] = [];
  f.context.purgeResources = async (dryRun) => {
    previews.push(dryRun);
    return true;
  };
  await f.run("uninstall", ["--dry-run", "--purge"], f.context);
  assert.equal(f.failed, false);
  assert.deepEqual(previews, [true]);
  assert.ok(!f.calls.some((x) => x.args[0] === "uninstall"));
});

test("resource continuation failure reports retry without rolling back CLI", async (t) => {
  const f = setup(t);
  const run = createCliLifecycle({
    runner: async (file, args, opts) =>
      file === process.execPath
        ? { code: 1, stdout: "" }
        : f.runner(file, args, opts),
    managers: [{ name: "npm", file: "/fake npm" }],
    fail: () => {},
    log: (x) => f.logs.push(x),
  });
  const meta = JSON.parse(
    fs.readFileSync(path.join(f.pkg, "package.json"), "utf8"),
  );
  meta.version = "3.0.1";
  fs.writeFileSync(path.join(f.pkg, "package.json"), JSON.stringify(meta));
  await run("update", [], f.context);
  assert.match(f.logs.join("\n"), /fec runtime update/);
  assert.ok(!f.calls.some((x) => ["install", "uninstall"].includes(x.args[0])));
});

test("registry credentials are omitted from normal and query-failure messages", async (t) => {
  const f = setup(t);
  const runner: ProcessRunner = async (file, args, opts) => {
    if (args[0] === "config")
      return {
        code: 0,
        stdout:
          "https://user:secret-token@registry.example.test/?token=secret-token",
      };
    if (args[0] === "view") return { code: 1, stdout: "" };
    return f.runner(file, args, opts);
  };
  await createCliLifecycle({
    runner,
    managers: [{ name: "npm", file: "/fake npm" }],
    fail: () => {},
    log: (x) => f.logs.push(x),
  })("update", [], f.context);
  assert.doesNotMatch(f.logs.join("\n"), /secret-token/);
});

test("resource discovery errors stop uninstall before purge and package removal", async (t) => {
  const f = setup(t);
  f.context.describeResources = () => {
    throw new Error("损坏 manifest: /project/.fec-install.json");
  };
  await f.run("uninstall", ["--yes", "--purge"], f.context);
  assert.equal(f.failed, true);
  assert.equal(f.purged, 0);
  assert.ok(!f.calls.some((x) => x.args[0] === "uninstall"));
  assert.match(f.logs.join("\n"), /损坏 manifest/);
});

test("default CLI uninstall never discovers or purges runtime resources", async (t) => {
  const f = setup(t);
  f.context.describeResources = () => {
    throw new Error("损坏 manifest 不应影响默认 CLI 卸载");
  };
  await f.run("uninstall", ["--yes"], f.context);
  assert.equal(f.failed, false, f.logs.join("\n"));
  assert.equal(f.purged, 0);
  assert.ok(f.calls.some((x) => x.args[0] === "uninstall"));
});
