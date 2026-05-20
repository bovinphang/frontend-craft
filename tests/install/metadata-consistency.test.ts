import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);

test("skills metadata matches skill directories and frontmatter names", () => {
  const skillsDir = path.join(root, "skills");
  const metadata = JSON.parse(fs.readFileSync(path.join(skillsDir, "metadata.json"), "utf8"));
  const skillDirs = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const metadataNames = metadata.map((skill) => skill.id).sort();
  assert.deepEqual(metadataNames, skillDirs);

  for (const dir of skillDirs) {
    const body = fs.readFileSync(path.join(skillsDir, dir, "SKILL.md"), "utf8");
    assert.notEqual(body.charCodeAt(0), 0xfeff, `skill must be UTF-8 without BOM: ${dir}`);
    const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(frontmatter, `missing frontmatter: ${dir}`);
    assert.match(frontmatter[1], new RegExp(`^name:\\s*${escapeRegExp(dir)}$`, "m"));
    assert.match(frontmatter[1], /^description:\s*Use when\b/m);
    const frontmatterKeys = [...frontmatter[1].matchAll(/^([A-Za-z0-9_-]+):/gm)].map((match) => match[1]).sort();
    assert.deepEqual(frontmatterKeys, ["description", "name"]);
    assert.ok(body.split(/\r?\n/).length <= 500, `skill body should stay under 500 lines: ${dir}`);
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
