import test from "node:test";
import assert from "node:assert/strict";
import {
  parseFrontmatter,
  parseAgentDocument,
  parseSkillDocument,
  parseCommandDocument,
} from "../../src/install/shared/frontmatter.js";

function md(extra = "", description = "A test"): string {
  return `---\nname: fec-test\ndescription: ${description}\n${extra}---\n\nBody.\n`;
}

test("command schema accepts a typed optional argument hint", () => {
  const parsed = parseCommandDocument(
    md("argument-hint: project\n"),
    "fec-test.md",
    "fec-test",
  );
  assert.equal(parsed.metadata["argument-hint"], "project");
  assert.throws(
    () => parseCommandDocument(md("argument-hint: []\n"), "fec-test.md"),
    /argument-hint/,
  );
});

test("rejects duplicate YAML keys with source and location", () => {
  assert.throws(
    () => parseFrontmatter(md("name: fec-other\n"), "agent.md"),
    /agent\.md:.*line \d+, column \d+/s,
  );
});
test("rejects nonmapping or missing frontmatter", () => {
  for (const raw of ["---\n- test\n---\n", "Body", "---\nnull\n---\n"]) {
    assert.throws(() => parseFrontmatter(raw, "agent.md"), /agent\.md/);
  }
});
test("rejects malformed agent lists and fields", () => {
  for (const extra of [
    "skills: []\n",
    "skills: fec-test\n",
    "skills: [fec-test, fec-test]\n",
    "mcpServers: [null]\n",
    "maxTurns: 0\n",
    "maxTurns: 1.5\n",
    "permissionMode: bypass\n",
    "model: []\n",
    "unknown: true\n",
    "skills:\n  -fec-test\n",
  ]) {
    assert.throws(() => parseAgentDocument(md(extra), "agent.md"), /agent\.md/);
  }
});
test("allows omitted optional fields and validates matching stable names", () => {
  assert.deepEqual(parseAgentDocument(md(), "agent.md", "fec-test").metadata, {
    name: "fec-test",
    description: "A test",
  });
  assert.throws(
    () => parseSkillDocument(md(), "SKILL.md", "fec-other"),
    /name/,
  );
  assert.throws(
    () =>
      parseCommandDocument(md().replace("fec-test", "bad name"), "command.md"),
    /name/,
  );
});
test("decodes quoted and multiline descriptions while preserving CRLF body", () => {
  assert.equal(
    parseSkillDocument(md("", '"A: \\"quote\\" and \\\\path"'), "skill.md")
      .metadata.description,
    'A: "quote" and \\path',
  );
  const raw = md("", "|-\n  First\n  Second").replaceAll("\n", "\r\n");
  assert.equal(
    parseCommandDocument(raw, "command.md").metadata.description,
    "First\nSecond",
  );
  assert.equal(parseCommandDocument(raw, "command.md").body, "\r\nBody.\r\n");
});
test("rejects empty descriptions and nonstring names", () => {
  assert.throws(
    () => parseSkillDocument(md("", '""'), "skill.md"),
    /description/,
  );
  assert.throws(
    () => parseSkillDocument(md().replace("fec-test", "123"), "skill.md"),
    /name/,
  );
});
