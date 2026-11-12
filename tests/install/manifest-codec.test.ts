import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { hashBytes, type ProductContext } from "@bovinphang/craft-common";
import { MANIFEST_CODEC } from "../../src/install/manifest-codec.js";

const base = path.join(os.tmpdir(), "fec-codec-root");
const context: ProductContext = {
  packageVersion: "3.0.0",
  runtime: "claude",
  scope: "local",
  language: "en",
  cwd: base,
  home: base,
  baseDir: path.join(base, ".claude"),
  allowedRoots: [base],
  dryRun: true,
};
const legacy = {
  packageVersion: "2.9.0",
  runtime: "claude",
  scope: "local",
  installedAt: "2026-01-01",
  files: [
    { path: "agents/fec-test.md", hash: hashBytes(Buffer.from("agent")) },
  ],
  settingsHooks: [
    {
      path: "settings.json",
      hooks: {
        Stop: [
          {
            matcher: "",
            hooks: [{ type: "command", command: "node fec-hook.js" }],
          },
        ],
      },
    },
  ],
};
test("legacy frontend manifest roundtrip preserves optional roots, hooks and language fallback", () => {
  const canonicalBase = path.join(
    fs.realpathSync.native(os.tmpdir()),
    path.basename(base),
  );
  const state = MANIFEST_CODEC.decode(
    Buffer.from(JSON.stringify(legacy)),
    context,
  );
  assert.equal(state.language, "en");
  assert.equal(
    state.files[0].path,
    path.join(canonicalBase, ".claude/agents/fec-test.md"),
  );
  assert.equal(state.sharedEntries.length, 1);
  const raw = JSON.parse(MANIFEST_CODEC.encode(state, context).toString());
  assert.deepEqual(raw, { ...legacy, language: "en" });
});
for (const [name, change] of Object.entries({
  version: { packageVersion: undefined },
  timestamp: { installedAt: 4 },
  language: { language: "fr" },
  scope: { scope: "global" },
  traversal: { files: [{ ...legacy.files[0], path: "../outside" }] },
  malformedHooks: {
    settingsHooks: [{ path: "settings.json", hooks: { Stop: "invalid" } }],
  },
  common: {
    common: { target: "relative", ledgerDir: "relative", digest: "invalid" },
  },
}))
  test(`frontend codec rejects malformed ${name} before planning`, () => {
    assert.throws(() =>
      MANIFEST_CODEC.decode(
        Buffer.from(JSON.stringify({ ...legacy, ...change })),
        context,
      ),
    );
  });
