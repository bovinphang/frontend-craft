import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { installCommandSkills } from "../../src/install/shared/command-skills.js";
import { parseFrontmatter } from "../../src/install/shared/frontmatter.js";
import { parseSkillFrontmatter } from "../../scripts/skill-packaging.js";

function fixture(
  run: (root: string, commands: string, skills: string) => void,
): void {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "fec-command-"));
  const commands = path.join(root, "commands");
  const skills = path.join(root, "skills");
  fs.mkdirSync(commands);
  fs.mkdirSync(skills);
  try {
    run(root, commands, skills);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}
test("command conversion rejects invalid YAML without writing a skill", () =>
  fixture((_root, commands, skills) => {
    fs.writeFileSync(
      path.join(commands, "fec-test.md"),
      "---\nname: fec-test\ndescription: A: broken\n---\nBody",
    );
    assert.throws(() => installCommandSkills(commands, skills));
    assert.deepEqual(fs.readdirSync(skills), []);
  }));
test("command conversion decodes descriptions and preserves CRLF body", () =>
  fixture((_root, commands, skills) => {
    fs.writeFileSync(
      path.join(commands, "fec-test.md"),
      '---\r\nname: fec-test\r\ndescription: "A: quoted"\r\n---\r\n\r\nFirst\r\nSecond\r\n',
    );
    installCommandSkills(commands, skills);
    const generated = parseFrontmatter(
      fs.readFileSync(path.join(skills, "fec-test/SKILL.md"), "utf8"),
      "generated skill",
    );
    assert.equal(generated.fields.description, "A: quoted");
    assert.equal(generated.fields["user-invocable"], true);
    assert.equal(generated.body, "\nFirst\r\nSecond\n");
  }));
test("command conversion never overwrites an existing same-name source skill", () =>
  fixture((_root, commands, skills) => {
    fs.mkdirSync(path.join(skills, "fec-test"));
    const target = path.join(skills, "fec-test/SKILL.md");
    fs.writeFileSync(target, "original skill");
    fs.writeFileSync(
      path.join(commands, "fec-test.md"),
      "command deliberately not parsed",
    );
    installCommandSkills(commands, skills);
    assert.equal(fs.readFileSync(target, "utf8"), "original skill");
  }));
test("standalone metadata decodes YAML quotes", () => {
  const parsed = parseSkillFrontmatter(
    '---\nname: fec-test\ndescription: "A: \\"quote\\""\n---\n',
    "fec-test",
  );
  assert.equal(parsed.description, 'A: "quote"');
});
