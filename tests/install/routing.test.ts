import { writeLegacyManifest } from "./legacy-manifest-fixture.js";
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { main, describeResourceInstalls } from "../../src/install/cli.js";
import { INSTALLERS } from "../../src/install/registry.js";
import { discoverManifestInstalls } from "../../src/install/manifest-installs.js";
import { getManifestPath } from "../../src/install/shared/fs.js";

test("resource descriptions include damaged manifest diagnostics and valid installs without failing the CLI stage", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-description-"));
  const exitCode = process.exitCode;
  try {
    const validPath = getManifestPath(path.join(dir, ".cursor"));
    fs.mkdirSync(path.dirname(validPath), { recursive: true });
    fs.writeFileSync(
      validPath,
      JSON.stringify({
        packageVersion: "3.0.0",
        runtime: "cursor",
        scope: "local",
        language: "en",
        installedAt: "2026-01-01",
        files: [],
      }),
    );
    const damagedPath = getManifestPath(path.join(dir, ".codex"));
    fs.mkdirSync(path.dirname(damagedPath), { recursive: true });
    fs.writeFileSync(damagedPath, "{broken");
    process.exitCode = 0;
    const descriptions = describeResourceInstalls(dir);
    assert.ok(descriptions.some((line) => line.includes(damagedPath)));
    assert.ok(
      descriptions.some((line) =>
        line.includes(`cursor (local): ${path.join(dir, ".cursor")}`),
      ),
    );
    assert.equal(process.exitCode, 0);
  } finally {
    process.exitCode = exitCode;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("help describes both lifecycles without invoking installers", async (t) => {
  const messages: string[] = [];
  t.mock.method(console, "log", (...args: unknown[]) => {
    messages.push(args.join(" "));
  });
  const installer = t.mock.method(INSTALLERS, "codex", async () => {});
  for (const argv of [
    ["update", "--help"],
    ["update", "help"],
    ["remove", "--help"],
    ["runtime", "--help"],
  ]) {
    messages.length = 0;
    await main(argv);
    assert.match(messages.join("\n"), /Usage:/);
  }
  assert.match(messages.join("\n"), /runtime install/);
  assert.match(messages.join("\n"), /--purge/);
  assert.match(messages.join("\n"), /--yes/);
  assert.equal(installer.mock.callCount(), 0);
});

for (const command of ["update", "uninstall"]) {
  for (const damaged of [
    "{broken",
    JSON.stringify({ files: [] }),
    JSON.stringify({ runtime: "codex", scope: "local", files: "invalid" }),
  ]) {
    test(`runtime ${command} reports damaged manifests and continues independent installs: ${damaged}`, async (t) => {
      const cwd = process.cwd();
      const exitCode = process.exitCode;
      const dir = fs.mkdtempSync(
        path.join(os.tmpdir(), "fec-damaged-routing-"),
      );
      const messages: string[] = [];
      t.mock.method(console, "log", (...args: unknown[]) => {
        messages.push(args.join(" "));
      });
      t.mock.method(console, "error", (...args: unknown[]) => {
        messages.push(args.join(" "));
      });
      const cursor = t.mock.method(INSTALLERS, "cursor", async () => {});
      try {
        process.chdir(dir);
        writeLegacyManifest(
          {
            pluginRoot: "",
            contentRoot: "",
            baseDir: path.join(dir, ".cursor"),
            cwd: dir,
            mode: "install",
            packageVersion: "3.0.0",
            runtime: "cursor",
            isGlobal: false,
            language: "en",
          },
          [],
        );
        const damagedPath = getManifestPath(path.join(dir, ".codex"));
        fs.mkdirSync(path.dirname(damagedPath), { recursive: true });
        fs.writeFileSync(damagedPath, damaged);
        process.exitCode = 0;
        await main(["runtime", command, "--local"]);
        assert.equal(process.exitCode, 1);
        assert.ok(messages.join("\n").includes(damagedPath));
        assert.equal(fs.readFileSync(damagedPath, "utf8"), damaged);
        if (command === "update") assert.equal(cursor.mock.callCount(), 1);
        else
          assert.equal(
            fs.existsSync(getManifestPath(path.join(dir, ".cursor"))),
            false,
          );
      } finally {
        process.chdir(cwd);
        process.exitCode = exitCode;
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
  }
}

test("strict discovery reports unreadable manifest paths while default discovery stays tolerant", (t) => {
  const dir = fs.mkdtempSync(
    path.join(os.tmpdir(), "fec-unreadable-manifest-"),
  );
  const manifestPath = getManifestPath(path.join(dir, ".codex"));
  try {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, "{}");
    const originalRead = fs.readFileSync;
    t.mock.method(
      fs,
      "readFileSync",
      (...args: Parameters<typeof fs.readFileSync>) => {
        if (String(args[0]) === manifestPath)
          throw Object.assign(new Error("permission denied"), {
            code: "EACCES",
          });
        return originalRead(...args);
      },
    );
    const errors: Error[] = [];
    assert.deepEqual(
      discoverManifestInstalls({ cwd: dir, scopes: ["local"] }),
      [],
    );
    discoverManifestInstalls({
      cwd: dir,
      scopes: ["local"],
      onError: (error) => errors.push(error),
    });
    assert.equal(errors.length, 1);
    assert.ok(errors[0].message.includes(manifestPath));
  } finally {
    t.mock.restoreAll();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("runtime update with an explicit runtime refuses invalid ownership metadata before installing", async (t) => {
  const cwd = process.cwd();
  const exitCode = process.exitCode;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-explicit-damaged-"));
  const installer = t.mock.method(INSTALLERS, "codex", async () => {});
  t.mock.method(console, "log", () => {});
  t.mock.method(console, "error", () => {});
  try {
    process.chdir(dir);
    const manifestPath = getManifestPath(path.join(dir, ".codex"));
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, JSON.stringify({ files: [] }));
    process.exitCode = 0;
    await main(["runtime", "update", "codex", "--local"]);
    assert.equal(process.exitCode, 1);
    assert.equal(installer.mock.callCount(), 0);
    assert.deepEqual(JSON.parse(fs.readFileSync(manifestPath, "utf8")), {
      files: [],
    });
  } finally {
    process.chdir(cwd);
    process.exitCode = exitCode;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("legacy resource arguments to top-level lifecycle commands fail before resource mutations", async (t) => {
  const installer = t.mock.method(INSTALLERS, "codex", async () => {});
  const errors: string[] = [];
  t.mock.method(console, "log", (...args: unknown[]) => {
    errors.push(args.join(" "));
  });
  t.mock.method(console, "error", (...args: unknown[]) => {
    errors.push(args.join(" "));
  });
  const previousExitCode = process.exitCode;
  try {
    for (const command of ["update", "upgrade", "uninstall", "remove"]) {
      process.exitCode = 0;
      await main([command, "codex", "--local", "--dry-run"]);
      assert.equal(process.exitCode, 1);
    }
    assert.equal(installer.mock.callCount(), 0);
    assert.match(errors.join("\n"), /runtime/);
  } finally {
    process.exitCode = previousExitCode;
  }
});

test("runtime rejects unknown commands, flags and extra operands before installing", async (t) => {
  const installer = t.mock.method(INSTALLERS, "codex", async () => {});
  t.mock.method(console, "log", () => {});
  t.mock.method(console, "error", () => {});
  const previousExitCode = process.exitCode;
  try {
    for (const argv of [
      ["runtime"],
      ["runtime", "wat"],
      ["runtime", "install", "codex", "--wat"],
      ["runtime", "install", "codex", "cursor"],
    ]) {
      process.exitCode = 0;
      await main(argv);
      assert.equal(process.exitCode, 1, argv.join(" "));
    }
    assert.equal(installer.mock.callCount(), 0);
  } finally {
    process.exitCode = previousExitCode;
  }
});

test("runtime update continues after an installer fails and discards its manifest session", async (t) => {
  const cwd = process.cwd();
  const previousExitCode = process.exitCode;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-routing-"));
  const messages: string[] = [];
  t.mock.method(console, "log", (...args: unknown[]) => {
    messages.push(args.join(" "));
  });
  t.mock.method(console, "error", (...args: unknown[]) => {
    messages.push(args.join(" "));
  });
  t.mock.method(INSTALLERS, "codex", async () => {
    throw new Error("injected failure");
  });
  const cursor = t.mock.method(INSTALLERS, "cursor", async () => {});
  try {
    process.chdir(dir);
    for (const runtime of ["codex", "cursor"]) {
      writeLegacyManifest(
        {
          pluginRoot: "",
          contentRoot: "",
          baseDir: path.join(dir, `.${runtime}`),
          cwd: dir,
          mode: "install",
          packageVersion: "2.9.0",
          runtime,
          isGlobal: false,
          language: "en",
        },
        [],
      );
    }
    const before = fs.readFileSync(
      getManifestPath(path.join(dir, ".codex")),
      "utf8",
    );
    process.exitCode = 0;
    await main(["runtime", "update", "--local"]);
    assert.equal(process.exitCode, 1);
    assert.equal(cursor.mock.callCount(), 1);
    assert.equal(
      fs.readFileSync(getManifestPath(path.join(dir, ".codex")), "utf8"),
      before,
    );
    assert.match(messages.join("\n"), /runtime update codex --local/);
    assert.match(messages.join("\n"), /injected failure/);
  } finally {
    process.chdir(cwd);
    process.exitCode = previousExitCode;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
