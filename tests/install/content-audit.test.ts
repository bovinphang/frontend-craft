import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { auditContent } from "../../src/install/shared/content-audit.js";

function fixture(run: (root: string) => void): void {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "fec-content-"));
  try {
    for (const base of ["", "localized/zh-CN/"]) {
      for (const dir of ["agents", "commands", "skills/fec-test"])
        fs.mkdirSync(path.join(root, base, dir), { recursive: true });
      fs.writeFileSync(
        path.join(root, base, "skills/fec-test/SKILL.md"),
        "---\nname: fec-test\ndescription: Test\n---\nBody\n",
      );
      fs.writeFileSync(
        path.join(root, base, "agents/fec-agent.md"),
        "---\nname: fec-agent\ndescription: Test\nskills: [fec-test]\n---\nBody\n",
      );
    }
    run(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
function edit(root: string, file: string, from: string, to: string): void {
  const target = path.join(root, file);
  fs.writeFileSync(target, fs.readFileSync(target, "utf8").replace(from, to));
}
test("rejects invalid YAML instead of skipping skills", () =>
  fixture((root) => {
    edit(
      root,
      "agents/fec-agent.md",
      "skills: [fec-test]",
      "skills:\n  -fec-test",
    );
    assert.match(auditContent(root).join("\n"), /agents.*fec-agent.md.*skills/);
  }));
test("reports unknown agent skill", () =>
  fixture((root) => {
    edit(
      root,
      "agents/fec-agent.md",
      "skills: [fec-test]",
      "skills: [fec-missing]",
    );
    assert.match(auditContent(root).join("\n"), /fec-agent.md.*fec-missing/);
  }));
test("reports missing localized file", () =>
  fixture((root) => {
    fs.unlinkSync(path.join(root, "localized/zh-CN/agents/fec-agent.md"));
    assert.match(auditContent(root).join("\n"), /localized.*fec-agent.md/);
  }));
test("reports localized agent structure drift", () =>
  fixture((root) => {
    edit(
      root,
      "localized/zh-CN/agents/fec-agent.md",
      "skills: [fec-test]",
      "model: sonnet\nskills: [fec-test]",
    );
    assert.match(auditContent(root).join("\n"), /fec-agent.md.*model/);
  }));
test("allows translated descriptions", () =>
  fixture((root) => {
    edit(
      root,
      "localized/zh-CN/agents/fec-agent.md",
      "description: Test",
      "description: 测试",
    );
    assert.deepEqual(auditContent(root), []);
  }));
test("rejects missing content roots rather than validating an empty tree", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "fec-empty-"));
  try {
    assert.ok(auditContent(root).length > 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
