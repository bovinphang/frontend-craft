import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";
import {
  assertStandaloneSkillBody,
  extractReferencedFiles,
  listSkillIds,
  parseSkillFrontmatter,
  readJsonFile,
  toPosixPath,
  type SkillRelation,
  type SkillRelations,
} from "../../scripts/skill-packaging.js";

const root = resolvePluginRoot(import.meta.url);
const skillsDir = path.join(root, "skills");
const packageRoot = path.join(root, "skill-packages");
const distPackageRoot = path.join(root, "dist", "skill-packages");
const tsxCli = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");

test("pack:skills creates one standalone publish package per skill", () => {
  execFileSync(process.execPath, [tsxCli, path.join(root, "scripts", "pack-skills.ts")], {
    cwd: root,
    encoding: "utf8",
  });
  assert.ok(!fs.existsSync(path.join(distPackageRoot, "index.json")), "pack:skills should not write dist/skill-packages");

  const pkg = readJsonFile<{ version: string }>(path.join(root, "package.json"));
  const skillIds = listSkillIds(skillsDir);
  const relations = readJsonFile<SkillRelations>(path.join(skillsDir, "relations.json"));
  const index = readJsonFile<Array<{ id: string; version: string; packagePath: string; sourcePath: string }>>(
    path.join(packageRoot, "index.json"),
  );

    assert.equal(skillIds.length, 30);
  assert.deepEqual(index.map((entry) => entry.id).sort(), skillIds);

  for (const skillId of skillIds) {
    const sourceDir = path.join(skillsDir, skillId);
    const destDir = path.join(packageRoot, skillId);
    const skillBody = fs.readFileSync(path.join(sourceDir, "SKILL.md"), "utf8");
    const packageSkillBody = fs.readFileSync(path.join(destDir, "SKILL.md"), "utf8");
    const frontmatter = parseSkillFrontmatter(skillBody, skillId);
    const references = extractReferencedFiles(skillBody);
    const relation = relations[skillId];

    assertStandaloneSkillBody(packageSkillBody, skillId);

    for (const requiredFile of ["SKILL.md", "README.md", "metadata.json", "package.json", "LICENSE"]) {
      assert.ok(fs.existsSync(path.join(destDir, requiredFile)), `missing ${requiredFile}: ${skillId}`);
    }

    const standalonePkg = readJsonFile<{ version: string; description: string; keywords: string[]; files: string[] }>(
      path.join(destDir, "package.json"),
    );
    const publishMetadata = readJsonFile<{ version: string; description: string; references: string[]; relations?: SkillRelation }>(
      path.join(destDir, "metadata.json"),
    );
    const entry = index.find((candidate) => candidate.id === skillId);

    assert.ok(entry, `missing index entry: ${skillId}`);
    assert.equal(standalonePkg.version, pkg.version);
    assert.equal(standalonePkg.description, frontmatter.description);
    assert.ok(standalonePkg.keywords.includes("agent-skill"));
    assert.ok(standalonePkg.keywords.includes("frontend-craft"));
    assert.ok(standalonePkg.files.includes("references"));
    assert.ok(standalonePkg.files.includes("scripts"));
    assert.ok(standalonePkg.files.includes("data"));
    assert.equal(publishMetadata.version, pkg.version);
    assert.equal(publishMetadata.description, frontmatter.description);
    assert.deepEqual(publishMetadata.references, references);
    assert.deepEqual(publishMetadata.relations ?? null, relation ?? null);
    assert.ok(!("relatedAgents" in (publishMetadata.relations ?? {})), `package metadata includes relatedAgents: ${skillId}`);
    assert.equal(entry?.version, pkg.version);
    assert.equal(entry?.packagePath, toPosixPath(path.relative(root, destDir)));
    assert.equal(entry?.sourcePath, `skills/${skillId}`);

    const copiedReferences = listPackagedFiles(destDir, references);
    assert.deepEqual(copiedReferences, references);
  }
});

test("check:skills-publish validates generated standalone packages", () => {
  execFileSync(process.execPath, [tsxCli, path.join(root, "scripts", "check-skills-publish.ts")], {
    cwd: root,
    encoding: "utf8",
  });
});

function listPackagedFiles(destDir: string, expectedFiles: string[]): string[] {
  return expectedFiles
    .filter((reference) => fs.existsSync(path.join(destDir, reference)))
    .map((reference) => toPosixPath(reference))
    .sort();
}
