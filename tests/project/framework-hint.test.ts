import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildFrameworkHint } from "../../src/openclaw/framework-hint.js";
test("OpenClaw framework hint keeps string and package-manager contracts with safe versions", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "fec-hint-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  assert.equal(buildFrameworkHint(root), "");
  fs.writeFileSync(
    path.join(root, "package.json"),
    '{"dependencies":{"react":"^19","@angular/core":"20","vue":"git+https://token@private/repo"}}',
  );
  fs.writeFileSync(path.join(root, "pnpm-lock.yaml"), "");
  const hint = buildFrameworkHint(root);
  assert.match(hint, /Detected framework:.*Angular 20.*React \^19/);
  assert.match(hint, /Package manager: pnpm/);
  assert.doesNotMatch(hint, /token|private/);
  fs.writeFileSync(path.join(root, "package.json"), "{bad");
  assert.equal(buildFrameworkHint(root), "");
});
