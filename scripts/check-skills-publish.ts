/**
 * Verify standalone skill package outputs created by scripts/pack-skills.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../src/install/shared/resolve-plugin-root.js";
import {
  extractReferencedFiles,
  listSkillIds,
  parseSkillFrontmatter,
  readJsonFile,
  toPosixPath,
  type RootPackage,
  type SkillMetadata,
} from "./skill-packaging.js";

const root = resolvePluginRoot(import.meta.url);
const skillsDir = path.join(root, "skills");
const packageRoot = path.join(root, "dist", "skill-packages");
const pkg = readJsonFile<RootPackage>(path.join(root, "package.json"));
const metadata = readJsonFile<SkillMetadata[]>(path.join(skillsDir, "metadata.json"));
const metadataById = new Map(metadata.map((skill) => [skill.id, skill]));

if (!fs.existsSync(packageRoot)) fail(`Missing skill package directory: ${packageRoot}`);

const skillIds = listSkillIds(skillsDir);
const index = readJsonFile<Array<{ id: string; version: string; packagePath: string; sourcePath: string }>>(
  path.join(packageRoot, "index.json"),
);

assertEqual(JSON.stringify(index.map((entry) => entry.id).sort()), JSON.stringify(skillIds), "index skill ids mismatch");

for (const skillId of skillIds) {
  const skillMeta = metadataById.get(skillId);
  if (!skillMeta) fail(`Missing metadata for skill: ${skillId}`);

  const sourceDir = path.join(skillsDir, skillId);
  const destDir = path.join(packageRoot, skillId);
  const skillBody = fs.readFileSync(path.join(sourceDir, "SKILL.md"), "utf8");
  const frontmatter = parseSkillFrontmatter(skillBody, skillId);
  const references = extractReferencedFiles(skillBody);

  for (const requiredFile of ["SKILL.md", "README.md", "metadata.json", "package.json", "LICENSE"]) {
    assertExists(path.join(destDir, requiredFile));
  }

  const packageJson = readJsonFile<{ name: string; version: string; keywords: string[] }>(path.join(destDir, "package.json"));
  const publishMetadata = readJsonFile<SkillMetadata & { description: string; references: string[] }>(
    path.join(destDir, "metadata.json"),
  );
  const entry = index.find((candidate) => candidate.id === skillId);
  if (!entry) fail(`Missing index entry for skill: ${skillId}`);

  assertEqual(packageJson.name, `@frontend-craft/${skillId}`, `package name mismatch: ${skillId}`);
  assertEqual(packageJson.version, pkg.version, `package version mismatch: ${skillId}`);
  assertEqual(publishMetadata.version, pkg.version, `metadata version mismatch: ${skillId}`);
  assertEqual(publishMetadata.description, frontmatter.description, `description mismatch: ${skillId}`);
  assertEqual(JSON.stringify(publishMetadata.references), JSON.stringify(references), `references mismatch: ${skillId}`);
  assertEqual(entry.version, pkg.version, `index version mismatch: ${skillId}`);
  assertEqual(entry.packagePath, toPosixPath(path.relative(root, destDir)), `index package path mismatch: ${skillId}`);
  assertEqual(entry.sourcePath, `skills/${skillId}`, `index source path mismatch: ${skillId}`);

  const copiedReferenceFiles = listPackageReferenceFiles(path.join(destDir, "references"));
  assertEqual(JSON.stringify(copiedReferenceFiles), JSON.stringify(references), `copied references mismatch: ${skillId}`);
}

console.log(`[check-skills-publish] OK: ${skillIds.length} standalone skill packages`);

function listPackageReferenceFiles(referencesDir: string): string[] {
  if (!fs.existsSync(referencesDir)) return [];
  const out: string[] = [];
  collect(referencesDir, out);
  return out.map((file) => toPosixPath(path.relative(path.dirname(referencesDir), file))).sort();
}

function collect(dir: string, out: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(file, out);
    else out.push(file);
  }
}

function assertExists(filePath: string): void {
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${filePath}`);
}

function assertEqual(actual: string, expected: string, message: string): void {
  if (actual !== expected) fail(`${message}\nActual: ${actual}\nExpected: ${expected}`);
}

function fail(message: string): never {
  console.error(`[check-skills-publish] ${message}`);
  process.exit(1);
}

