import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { checkFormat } from "../../scripts/check-format.js";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
test("lint catches unused TypeScript bindings and allows intentionally unused parameters", async () => {
  const lint = new ESLint({ cwd: root });
  const bad = await lint.lintText("const unused = 1;\nexport {};\n", {
    filePath: "src/lint-fixture.ts",
  });
  assert.ok(bad[0].errorCount > 0);
  const good = await lint.lintText(
    "export function ok(_unused: string): void {}\n",
    { filePath: "src/lint-fixture.ts" },
  );
  assert.equal(good[0].errorCount, 0);
});
test("format checker detects an unformatted TypeScript file without changing it", async () => {
  const target = path.join(root, "reports/content-integrity/format-fixture.ts");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const raw = "export const value={x:1}";
  fs.writeFileSync(target, raw);
  try {
    assert.deepEqual(await checkFormat([target]), [target]);
    assert.equal(fs.readFileSync(target, "utf8"), raw);
  } finally {
    fs.unlinkSync(target);
  }
});
test("maintenance scripts use declared pnpm without competing lockfiles or auto staging", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  ) as { packageManager: string; scripts: Record<string, string> };
  assert.equal(pkg.packageManager, "pnpm@12.4.1");
  assert.equal(fs.existsSync(path.join(root, "package-lock.json")), false);
  assert.ok(
    !Object.values(pkg.scripts).some((script) =>
      /\bnpm run|\bnpm test|\bgit add/.test(script),
    ),
  );
  assert.match(pkg.scripts["test:only"], /scripts\/run-tests.ts/);
});
