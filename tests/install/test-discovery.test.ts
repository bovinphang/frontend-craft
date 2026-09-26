import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { discoverTests } from "../../scripts/run-tests.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const runner = path.join(root, "scripts/run-tests.ts");
function fixture(run: (dir: string) => void): void {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-discovery-"));
  fs.mkdirSync(path.join(dir, "tests/nested space"), { recursive: true });
  try {
    run(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
function write(dir: string, file: string, fail = false): void {
  const target = path.join(dir, "tests", file);
  fs.writeFileSync(
    target,
    `import test from 'node:test'; import assert from 'node:assert/strict'; test('discovered marker', () => assert.equal(${fail}, false));`,
  );
}
function run(dir: string) {
  return spawnSync(
    process.execPath,
    ["--import", "tsx", runner, "--root", dir],
    { cwd: root, encoding: "utf8" },
  );
}
test("discovers nested test files in stable order", () =>
  fixture((dir) => {
    write(dir, "z.test.ts");
    write(dir, "a.test.ts");
    write(dir, "nested space/b.test.ts");
    fs.writeFileSync(path.join(dir, "tests/ignored.ts"), "");
    assert.deepEqual(
      discoverTests(dir).map((f) =>
        path.relative(dir, f).replaceAll(path.sep, "/"),
      ),
      ["tests/a.test.ts", "tests/nested space/b.test.ts", "tests/z.test.ts"],
    );
  }));
test("runs newly added tests and handles spaces in test paths", () =>
  fixture((dir) => {
    write(dir, "nested space/new.test.ts");
    const result = run(dir);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /discovered marker/);
  }));
test("fails when no tests exist", () =>
  fixture((dir) => {
    const result = run(dir);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /No test files/);
  }));
test("propagates child failure", () =>
  fixture((dir) => {
    write(dir, "failure.test.ts", true);
    const result = run(dir);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /discovered marker/);
  }));
