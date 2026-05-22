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
  assert.ok(files.includes("dist/src/install/cli.js"));
  assert.ok(files.includes("skills/metadata.json"));

  const leakedSources = files.filter((file) => /^(bin|src|scripts)\/.*\.ts$/.test(file));
  assert.deepEqual(leakedSources, []);

  const staleCompiledFiles = files
    .filter((file) => /^dist\/(bin|src|scripts)\/.*\.js$/.test(file))
    .filter((file) => {
      const sourcePath = file.replace(/^dist\//, "").replace(/\.js$/, ".ts");
      return !fs.existsSync(path.join(root, sourcePath));
    });
  assert.deepEqual(staleCompiledFiles, []);
});

test("OpenClaw dist check does not clean the bundle it verifies", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(
    pkg.scripts["check:openclaw-dist"],
    "node dist/scripts/openclaw/verify-openclaw-dist.js",
  );
});

test("build minifies compiled JavaScript while preserving CLI shebang", () => {
  const cliRuntime = fs.readFileSync(path.join(root, "dist", "src", "install", "cli.js"), "utf8");
  const cliSource = fs.readFileSync(path.join(root, "src", "install", "cli.ts"), "utf8");
  const binRuntime = fs.readFileSync(path.join(root, "dist", "bin", "frontend-craft.js"), "utf8");

  assert.ok(cliRuntime.length < cliSource.length * 0.8, "dist/src/install/cli.js should be minified");
  assert.ok(!cliRuntime.includes("function printHelp"), "dist/src/install/cli.js should minify local names");
  assert.ok(binRuntime.startsWith("#!/usr/bin/env node\n"), "bin shebang should stay intact");
});
