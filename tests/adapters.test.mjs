import test from "node:test";
import assert from "node:assert/strict";
import { buildTarget } from "../adapters/index.mjs";

const markdown = `---
name: demo-agent
description: demo description
---
Use .claude/rules and read CLAUDE.md first.
`;

const bundle = {
  fileName: "demo.md",
  outputDir: "out",
  raw: markdown,
};

test("codex adapter snapshot", () => {
  const result = buildTarget("codex", bundle);
  assert.equal(
    result.content,
    `name = "demo-agent"\n` +
      `description = "demo description"\n\n` +
      `model = "gpt-5.4"\n` +
      `model_reasoning_effort = "high"\n\n` +
      `developer_instructions = """\n` +
      `Use .codex/rules and read AGENTS.md first.\n` +
      `"""\n`,
  );
  assert.equal(result.outputPath, "out/demo.toml");
});

test("claude adapter snapshot", () => {
  const result = buildTarget("claude", bundle);
  assert.equal(
    result.content,
    `---\n` +
      `name: demo-agent\n` +
      `description: demo description\n` +
      `---\n\n` +
      `/agent demo-agent\n\n` +
      `Use .claude/rules and read CLAUDE.md first.\n`,
  );
  assert.equal(result.outputPath, "out/demo.md");
});

test("openclaw adapter snapshot", () => {
  const result = buildTarget("openclaw", bundle);
  assert.equal(
    result.content,
    `{
  "metadata": {
    "title": "demo-agent",
    "summary": "demo description",
    "platform": "openclaw"
  },
  "commandPrefix": "openclaw",
  "instruction": "Use .claude/rules and read CLAUDE.md first."
}\n`,
  );
  assert.equal(result.outputPath, "out/demo.openclaw.json");
});
