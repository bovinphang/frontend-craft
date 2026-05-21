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
