import test from "node:test";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_RUNTIMES } from "../../src/install/registry.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const cli = path.join(root, "bin", "frontend-craft.mjs");

for (const rt of ALL_RUNTIMES) {
  test(`dry-run install ${rt}`, () => {
    execFileSync(process.execPath, [cli, "install", rt, "--dry-run"], {
      cwd: root,
      encoding: "utf8",
    });
  });
}
