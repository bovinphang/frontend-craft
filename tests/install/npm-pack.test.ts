import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);

test("npm pack publishes compiled runtime files without TypeScript sources", () => {
  const output = execSync("npm pack --dry-run --json --ignore-scripts", {
    cwd: root,
    encoding: "utf8",
  });
  const pack = JSON.parse(output) as Array<{ files: Array<{ path: string }> }>;
  const files = pack[0]?.files.map((file) => file.path).sort() ?? [];

  assert.ok(files.includes("dist/bin/frontend-craft.js"));
  assert.ok(!files.some((file) => file.startsWith("dist/src/")), "npm package should not publish dist/src");
  assert.ok(!files.some((file) => file.startsWith("dist/scripts/")), "npm package should not publish dist/scripts");
  assert.ok(files.includes("skills/metadata.json"));

  const leakedSources = files.filter((file) => /^(bin|src|scripts)\/.*\.ts$/.test(file));
  assert.deepEqual(leakedSources, []);

  const hookRuntimes = [
    "fec-format-changed-file.js",
    "fec-notify.js",
    "fec-run-tests.js",
    "fec-security-check.js",
    "fec-session-start.js",
  ];
  for (const hookRuntime of hookRuntimes) {
    assert.ok(files.includes(`dist/hooks/${hookRuntime}`), `npm package should publish dist/hooks/${hookRuntime}`);
    assert.ok(!files.includes(`dist/scripts/${hookRuntime}`), `runtime hook should not be published in dist/scripts`);
  }
  for (const unprefixedHookRuntime of hookRuntimes.map((hookRuntime) => hookRuntime.replace(/^fec-/, ""))) {
    assert.ok(
      !files.includes(`dist/hooks/${unprefixedHookRuntime}`),
      `npm package should not publish unprefixed dist/hooks/${unprefixedHookRuntime}`,
    );
  }

  const staleCompiledFiles = files
    .filter((file) => /^dist\/(bin|src|scripts|hooks)\/.*\.js$/.test(file))
    .filter((file) => {
      const sourcePath = file.startsWith("dist/hooks/")
        ? file.replace(/^dist\/hooks\/fec-/, "src/hooks/").replace(/\.js$/, ".ts")
        : file.replace(/^dist\//, "").replace(/\.js$/, ".ts");
      return !fs.existsSync(path.join(root, sourcePath));
    });
  assert.deepEqual(staleCompiledFiles, []);
});

test("build output only contains bundled publish runtime directories", () => {
  assert.ok(!fs.existsSync(path.join(root, "dist", "src")), "build should not emit dist/src");
  assert.ok(!fs.existsSync(path.join(root, "dist", "tests")), "build should not emit dist/tests");
  assert.ok(fs.existsSync(path.join(root, "dist", "bin", "frontend-craft.js")), "build should emit bundled CLI");
  assert.ok(fs.existsSync(path.join(root, "dist", "hooks", "fec-security-check.js")), "build should emit bundled hooks");
  assert.ok(!fs.existsSync(path.join(root, "dist", "scripts")), "build should not emit maintenance scripts");
});

test("OpenClaw dist check does not clean the bundle it verifies", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(
    pkg.scripts["check:openclaw-dist"],
    "tsx scripts/openclaw/verify-openclaw-dist.ts",
  );
});

test("build minifies compiled JavaScript while preserving CLI shebang", () => {
  const cliRuntime = fs.readFileSync(path.join(root, "dist", "bin", "frontend-craft.js"), "utf8");

  assert.ok(!cliRuntime.includes("function printHelp"), "dist/bin/frontend-craft.js should minify local names");
  assert.ok(!cliRuntime.includes("../src/install/cli.js"), "CLI should be bundled instead of importing dist/src");
  assert.ok(cliRuntime.startsWith("#!/usr/bin/env node\n"), "bin shebang should stay intact");
  assert.equal(cliRuntime.match(/^#!\/usr\/bin\/env node$/gm)?.length, 1, "bin should include one shebang");
});
