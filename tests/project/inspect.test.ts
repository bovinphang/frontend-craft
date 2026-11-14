import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
test("frontend inspect CLI returns delivered task candidates, stays read-only and rejects invalid task flags", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "fec-inspect-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(
    path.join(root, "package.json"),
    '{"dependencies":{"react":"^19","@angular/core":"^20"},"devDependencies":{"typescript":"^5"}}',
  );
  fs.writeFileSync(path.join(root, "view.tsx"), "");
  const cli = path.resolve("dist/package/dist/bin/frontend-craft.js");
  const call = (...args: string[]) =>
    execFileSync(process.execPath, [cli, "project", "inspect", root, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  const before = fs.readdirSync(root).sort();
  const report = JSON.parse(
    call("--task-path", "view.tsx", "--task-kind", "ui", "--json"),
  );
  assert.ok(
    report.units[0].frameworks.some((f: { id: string }) => f.id === "angular"),
  );
  assert.ok(
    report.recommendations.some(
      (r: { id: string }) => r.id === "fec-react-project-standard",
    ),
  );
  assert.ok(
    report.recommendations.every(
      (r: { id: string }) => !r.id.startsWith("bec-"),
    ),
  );
  for (const args of [
    ["--task-kind", "invalid"],
    ["--task-path", "../outside"],
    ["--task-kind"],
    ["--unknown"],
  ])
    assert.throws(() => call(...args));
  assert.deepEqual(fs.readdirSync(root).sort(), before);
  fs.unlinkSync(path.join(root, "package.json"));
  const empty = JSON.parse(call("--json"));
  assert.equal(empty.truncated, false);
  assert.ok(empty.units[0].ambiguous);
});
