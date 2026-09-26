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
  const tom = agentMdToToml(md, "fec-test-agent.md");
  assert.match(tom, /name = "fec-test-agent"/);
  assert.match(tom, /\.codex\/rules/);
  assert.match(tom, /AGENTS\.md/);
  assert.match(tom, /developer_instructions/);
});

test("agent conversion decodes quoted metadata and safely encodes multiline body", () => {
  const description = 'A: "quote" \\ path\nnext\tline';
  const body = 'Check """ delimiter and \\ slash.\nCheck CLAUDE.md.';
  const md = `---\nname: fec-test-agent\ndescription: ${JSON.stringify(description)}\n---\n${body}\n`;
  const tom = agentMdToToml(md, "fec-test-agent.md");
  // These fixtures deliberately require JSON-compatible TOML basic string escapes.
  const fields = Object.fromEntries(
    tom
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [key, value] = line.split(/ = (.*)/s);
        return [key, JSON.parse(value) as unknown];
      }),
  );
  assert.equal(fields.description, description);
  assert.equal(
    fields.developer_instructions,
    'Check """ delimiter and \\ slash.\nCheck AGENTS.md.',
  );
});

test("agent conversion rejects invalid YAML and mismatched names", () => {
  assert.throws(() =>
    agentMdToToml(
      "---\nname: fec-test\ndescription: A: broken\n---\n",
      "fec-test.md",
    ),
  );
  assert.throws(() =>
    agentMdToToml(
      "---\nname: fec-test\ndescription: Test\n---\n",
      "fec-other.md",
    ),
  );
});
