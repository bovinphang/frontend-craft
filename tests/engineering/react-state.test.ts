import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pnpmEntry } from "../../scripts/verify-engineering.js";
const root = path.resolve(import.meta.dirname, "../../dist/package");
test("engineering maintainer exists before paired evidence can be accepted", () => {
  assert.ok(
    fs.existsSync(
      path.resolve(import.meta.dirname, "../../scripts/verify-engineering.ts"),
    ),
    "missing isolated UI maintainer",
  );
});
test("real React state pair uses only explicitly prepared matching dependencies", async (t) => {
  const { verifyEngineeringExamples } =
    await import("../../scripts/verify-engineering.js");
  const result = verifyEngineeringExamples({ root, prepare: false })[0];
  if (result.status === "MISSING") {
    t.skip(result.reason);
    return;
  }
  assert.equal(result.status, "PASS", JSON.stringify(result));
  assert.equal(result.fixed?.tests.total, 2);
  assert.equal(result.broken?.tests.failed, 2);
});
test("UI evidence rejects zero, skipped, loader failures and unsupported arguments", async () => {
  const { assessTap, parseEngineeringArgs, verifyEngineeringExamples } =
    await import("../../scripts/verify-engineering.js");
  assert.throws(() => assessTap({ status: 0, output: "PASS" }, false, "log"));
  assert.throws(() =>
    assessTap(
      {
        status: 0,
        output:
          "ok 1 - newer request survives a late older result # SKIP\n# tests 1\n# pass 0\n# fail 0\n# skipped 1",
      },
      false,
      "log",
    ),
  );
  assert.throws(() =>
    assessTap({ status: 1, output: "ERR_MODULE_NOT_FOUND" }, true, "log"),
  );
  assert.throws(() => parseEngineeringArgs(["--root"]));
  assert.throws(() => parseEngineeringArgs(["--bogus"]));
  assert.equal(parseEngineeringArgs(["--", "--prepare"]).prepare, true);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "craft-ui-missing-"));
  try {
    fs.cpSync(
      path.join(root, "skills/fec-react-project-standard/examples/engineering"),
      path.join(temp, "skills/fec-react-project-standard/examples/engineering"),
      { recursive: true },
    );
    assert.equal(
      verifyEngineeringExamples({ root: temp, prepare: false })[0].status,
      "MISSING",
    );
    assert.equal(fs.existsSync(path.join(temp, "reports")), false);
    const first = verifyEngineeringExamples({ root: temp, prepare: false })[0];
    const cache = path.join(
      temp,
      "reports/engineering/prepared",
      first.sourceHash,
    );
    fs.mkdirSync(cache, { recursive: true });
    fs.writeFileSync(
      path.join(cache, "ready.json"),
      JSON.stringify({ sourceHash: "stale" }),
    );
    assert.equal(
      verifyEngineeringExamples({ root: temp, prepare: false })[0].status,
      "MISSING",
    );
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
test("isolated preparation resolves the actual pnpm12 Linux mjs distribution", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "craft-pnpm-entry-"));
  try {
    const entry = path.join(temp, "lib/node_modules/pnpm/bin/pnpm.mjs");
    fs.mkdirSync(path.dirname(entry), { recursive: true });
    fs.writeFileSync(entry, "// fixture entry");
    assert.equal(
      typeof pnpmEntry,
      "function",
      "portable entry resolver missing",
    );
    assert.equal(pnpmEntry(path.join(temp, "bin/node"), ""), entry);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
