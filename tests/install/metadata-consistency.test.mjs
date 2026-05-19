import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("skills metadata matches skill directories and frontmatter names", () => {
  const skillsDir = path.join(root, "skills");
  const metadata = JSON.parse(fs.readFileSync(path.join(skillsDir, "metadata.json"), "utf8"));
  const skillDirs = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const metadataNames = metadata.map((skill) => skill.id.replace(/^fec-/, "")).sort();
  assert.deepEqual(metadataNames, skillDirs);

  for (const dir of skillDirs) {
    const body = fs.readFileSync(path.join(skillsDir, dir, "SKILL.md"), "utf8");
    assert.match(body, new RegExp(`^name:\\s*fec-${escapeRegExp(dir)}$`, "m"));
  }
});

test("marketplace skill count matches skills directory count", () => {
  const skillCount = fs
    .readdirSync(path.join(root, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).length;
  const marketplace = JSON.parse(
    fs.readFileSync(path.join(root, ".claude-plugin", "marketplace.json"), "utf8"),
  );
  const description = marketplace.plugins[0].description;
  assert.match(description, new RegExp(`${skillCount} skills`));
});

test("fec-init mentions every shared rule copied by the command", () => {
  const rules = fs
    .readdirSync(path.join(root, "templates", "shared", "rules"))
    .filter((name) => name.endsWith(".md"))
    .sort();
  const command = fs.readFileSync(path.join(root, "commands", "fec-init.md"), "utf8");

  for (const rule of rules) {
    assert.match(command, new RegExp(`templates/shared/rules/${escapeRegExp(rule)}`));
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
