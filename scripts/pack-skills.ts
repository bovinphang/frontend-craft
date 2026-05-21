/**
 * Build one standalone publishable package per Frontend Craft skill.
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

type SkillPackageIndexEntry = {
  id: string;
  name: string;
  description: string;
  summary: string;
  category: string;
  tags: string[];
  version: string;
  packagePath: string;
  sourcePath: string;
};

const root = resolvePluginRoot(import.meta.url);
const skillsDir = path.join(root, "skills");
const packageRoot = path.join(root, "skill-packages");
const pkg = readJsonFile<RootPackage>(path.join(root, "package.json"));
const metadata = readJsonFile<SkillMetadata[]>(path.join(skillsDir, "metadata.json"));
const metadataById = new Map(metadata.map((skill) => [skill.id, skill]));

fs.rmSync(packageRoot, { recursive: true, force: true });
fs.mkdirSync(packageRoot, { recursive: true });

const index: SkillPackageIndexEntry[] = [];

for (const skillId of listSkillIds(skillsDir)) {
  const skillMeta = metadataById.get(skillId);
  if (!skillMeta) throw new Error(`Missing metadata for skill: ${skillId}`);

  const sourceDir = path.join(skillsDir, skillId);
  const destDir = path.join(packageRoot, skillId);
  const skillBody = fs.readFileSync(path.join(sourceDir, "SKILL.md"), "utf8");
  const frontmatter = parseSkillFrontmatter(skillBody, skillId);
  const references = extractReferencedFiles(skillBody);

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(path.join(sourceDir, "SKILL.md"), path.join(destDir, "SKILL.md"));
  fs.copyFileSync(path.join(root, "LICENSE"), path.join(destDir, "LICENSE"));

  for (const reference of references) {
    const sourceReference = path.join(sourceDir, reference);
    if (!fs.existsSync(sourceReference)) throw new Error(`Missing referenced file: ${skillId}/${reference}`);
    const destReference = path.join(destDir, reference);
    fs.mkdirSync(path.dirname(destReference), { recursive: true });
    fs.copyFileSync(sourceReference, destReference);
  }

  const publishMetadata = {
    ...skillMeta,
    version: pkg.version,
    license: pkg.license,
    homepage: pkg.homepage,
    repository: pkg.repository.url,
    description: frontmatter.description,
    source: `skills/${skillId}`,
    references,
  };

  const standalonePackage = {
    name: `@frontend-craft/${skillId}`,
    version: pkg.version,
    description: frontmatter.description,
    type: "module",
    license: pkg.license,
    author: pkg.author,
    repository: {
      ...pkg.repository,
      directory: `skills/${skillId}`,
    },
    homepage: pkg.homepage,
    keywords: unique(["agent-skill", "frontend-craft", skillMeta.category, ...skillMeta.tags, ...skillMeta.keywords]),
    files: ["SKILL.md", "references", "metadata.json", "README.md", "LICENSE"],
    publishConfig: { access: "public" },
  };

  fs.writeFileSync(path.join(destDir, "metadata.json"), `${JSON.stringify(publishMetadata, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(destDir, "package.json"), `${JSON.stringify(standalonePackage, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(destDir, "README.md"), renderReadme(skillMeta, frontmatter, references), "utf8");

  index.push({
    id: skillId,
    name: skillMeta.name,
    description: frontmatter.description,
    summary: skillMeta.summary,
    category: skillMeta.category,
    tags: skillMeta.tags,
    version: pkg.version,
    packagePath: toPosixPath(path.relative(root, destDir)),
    sourcePath: `skills/${skillId}`,
  });
}

fs.writeFileSync(path.join(packageRoot, "index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");

console.log(`[pack-skills] Packed ${index.length} skills to ${packageRoot}`);

function renderReadme(metadata: SkillMetadata, frontmatter: { name: string; description: string }, references: string[]): string {
  const referenceSection =
    references.length > 0
      ? `\n## References\n\n${references.map((reference) => `- [${reference}](${reference})`).join("\n")}\n`
      : "";

  return `# ${metadata.name}\n\n${metadata.summary}\n\n## Skill\n\n- ID: \`${metadata.id}\`\n- Category: \`${metadata.category}\`\n- Version: \`${pkg.version}\`\n- Source: \`skills/${metadata.id}/SKILL.md\`\n\n## Description\n\n${frontmatter.description}\n\n## Usage\n\nInstall or import this package with any skill runtime that understands the standard \`SKILL.md\` layout. The canonical source remains the Frontend Craft repository.\n${referenceSection}\n## License\n\nMIT\n`;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
