import test from "node:test";
import assert from "node:assert/strict";
import { agentMdToToml } from "../../src/install/codex-agents.mjs";

test("agentMdToToml maps paths and wraps body", () => {
  const md = `---
name: test-agent
description: A test
---

Check .claude/rules and CLAUDE.md.
`;
  const tom = agentMdToToml(md, "x.md");
  assert.match(tom, /name = "test-agent"/);
  assert.match(tom, /\.codex\/rules/);
  assert.match(tom, /AGENTS\.md/);
  assert.match(tom, /developer_instructions/);
});
