import test from "node:test";
import assert from "node:assert/strict";
import { agentMdToToml } from "../../src/install/codex-agents.js";

test("agentMdToToml maps paths and wraps body", () => {
  const md = `---
name: fec-test-agent
description: A test
---

Check .claude/rules and CLAUDE.md.
`;
  const tom = agentMdToToml(md, "x.md");
  assert.match(tom, /name = "fec-test-agent"/);
  assert.match(tom, /\.codex\/rules/);
  assert.match(tom, /AGENTS\.md/);
  assert.match(tom, /developer_instructions/);
});
