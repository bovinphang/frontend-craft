import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  checkMigration,
  inspectLegacyCommonInstall,
} from "../../src/install/migration.js";
import { hashContent } from "../../src/install/shared/fs.js";
import { main } from "../../src/install/cli.js";

function fixture(t: { after: (fn: () => void) => void }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "fec-migration-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}
test("只读检查完整改名和按任务拆分，不机械改动前端保留入口", (t) => {
  const cwd = fixture(t);
  const file = path.join(cwd, "README.md");
  const original =
    "fec-drawio-studio\nfec-source-driven-development\nUse fec-image-generation for architecture diagrams\nUse fec-doc-sync for frontend README\nfec-refactoring-api\n";
  fs.writeFileSync(file, original);
  const report = checkMigration({ cwd, scope: "local", runtime: "codex" });
  assert.equal(report.exitCode, 1);
  assert.deepEqual(
    report.findings.map((item) => [item.kind, item.line]),
    [
      ["rename", 1],
      ["rename", 2],
      ["split", 3],
    ],
  );
  assert.equal(fs.readFileSync(file, "utf8"), original);
});
test("敏感文件、符号链接、依赖和构建产物不进入输出", (t) => {
  const cwd = fixture(t);
  for (const dir of ["node_modules", "dist", ".git"]) {
    fs.mkdirSync(path.join(cwd, dir));
    fs.writeFileSync(path.join(cwd, dir, "old.md"), "fec-drawio-studio");
  }
  fs.writeFileSync(path.join(cwd, ".env"), "SECRET=fec-drawio-studio");
  fs.writeFileSync(path.join(cwd, "private-key.txt"), "fec-drawio-studio");
  fs.symlinkSync(
    path.join(cwd, "node_modules"),
    path.join(cwd, "alias"),
    "junction",
  );
  const report = checkMigration({ cwd, scope: "local", runtime: "codex" });
  assert.equal(report.exitCode, 0);
  assert.deepEqual(report.findings, []);
  assert.doesNotMatch(JSON.stringify(report), /SECRET/);
});
test("错误 Runtime 返回可解析的诊断和退出码 2", (t) => {
  const report = checkMigration({
    cwd: fixture(t),
    scope: "local",
    runtime: "unknown",
  });
  assert.equal(report.exitCode, 2);
  assert.ok(report.errors.length > 0);
});
test("只退役旧清单中未修改的完整迁出入口", (t) => {
  const cwd = fixture(t);
  const baseDir = path.join(cwd, ".claude"),
    skillsDir = path.join(baseDir, "skills");
  const file = path.join(skillsDir, "fec-drawio-studio/SKILL.md");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const content = "legacy owned";
  fs.writeFileSync(file, content);
  fs.writeFileSync(
    path.join(baseDir, "frontend-craft.manifest.json"),
    JSON.stringify({
      files: [
        {
          path: "skills/fec-drawio-studio/SKILL.md",
          hash: hashContent(content),
        },
      ],
    }),
  );
  const clean = inspectLegacyCommonInstall({ cwd, baseDir, skillsDir });
  assert.deepEqual(clean.retiredFiles, [file]);
  assert.equal(clean.findings[0].kind, "legacy-install");
  fs.appendFileSync(file, "user edit");
  const changed = inspectLegacyCommonInstall({ cwd, baseDir, skillsDir });
  assert.equal(changed.findings[0].kind, "conflict");
  assert.deepEqual(changed.retiredFiles, []);
  assert.match(fs.readFileSync(file, "utf8"), /user edit/);
});
test("未知旧 Skill 与损坏清单阻止自动迁移", (t) => {
  const cwd = fixture(t);
  const baseDir = path.join(cwd, ".codex"),
    skillsDir = path.join(cwd, ".agents/skills");
  fs.mkdirSync(path.join(skillsDir, "fec-drawio-studio"), { recursive: true });
  fs.writeFileSync(
    path.join(skillsDir, "fec-drawio-studio/SKILL.md"),
    "unknown",
  );
  assert.equal(
    inspectLegacyCommonInstall({ cwd, baseDir, skillsDir }).findings[0].kind,
    "conflict",
  );
  fs.mkdirSync(baseDir);
  fs.writeFileSync(path.join(baseDir, "frontend-craft.manifest.json"), "{bad");
  assert.throws(
    () => inspectLegacyCommonInstall({ cwd, baseDir, skillsDir }),
    /清单|manifest/,
  );
});

test("迁移 CLI 的 JSON 输出可解析，错误参数返回 2", async (t) => {
  const dir = fixture(t),
    previousCwd = process.cwd(),
    previousCode = process.exitCode;
  const messages: string[] = [];
  t.mock.method(console, "log", (...args: unknown[]) =>
    messages.push(args.join(" ")),
  );
  t.mock.method(console, "error", (...args: unknown[]) =>
    messages.push(args.join(" ")),
  );
  try {
    process.chdir(dir);
    await main(["runtime", "check-migration", "codex", "--json"]);
    assert.equal(JSON.parse(messages.join("\n")).exitCode, 0);
    messages.length = 0;
    await main([
      "runtime",
      "check-migration",
      "codex",
      "--json",
      "--global",
      "--local",
    ]);
    assert.equal(JSON.parse(messages.join("\n")).exitCode, 2);
    assert.equal(process.exitCode, 2);
  } finally {
    process.chdir(previousCwd);
    process.exitCode = previousCode;
  }
});
