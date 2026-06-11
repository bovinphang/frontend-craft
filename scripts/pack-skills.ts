/**
 * Build one standalone publishable package per Frontend Craft skill.
 */
import fs from "node:fs";
import path from "node:path";
import { transform } from "esbuild";
import { resolvePluginRoot } from "../src/install/shared/resolve-plugin-root.js";
import {
  assertStandaloneSkillBody,
  assertSkillRelation,
  extractReferencedFiles,
  listSkillIds,
  parseSkillFrontmatter,
  readJsonFile,
  toPosixPath,
  type RootPackage,
  type SkillMetadata,
  type SkillRelations,
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
const metadata = readJsonFile<SkillMetadata[]>(
  path.join(skillsDir, "metadata.json"),
);
const metadataById = new Map(metadata.map((skill) => [skill.id, skill]));
const skillIds = listSkillIds(skillsDir);
const skillIdSet = new Set(skillIds);
const relations = readJsonFile<SkillRelations>(
  path.join(skillsDir, "relations.json"),
);

fs.rmSync(packageRoot, { recursive: true, force: true });
fs.mkdirSync(packageRoot, { recursive: true });

const index: SkillPackageIndexEntry[] = [];

for (const [skillId, relation] of Object.entries(relations)) {
  if (!skillIdSet.has(skillId))
    throw new Error(`Unknown skill relation entry: ${skillId}`);
  assertSkillRelation(relation, skillId, skillIdSet);
}

for (const skillId of skillIds) {
  const skillMeta = metadataById.get(skillId);
  if (!skillMeta) throw new Error(`Missing metadata for skill: ${skillId}`);

  const sourceDir = path.join(skillsDir, skillId);
  const destDir = path.join(packageRoot, skillId);
  const skillBody = fs.readFileSync(path.join(sourceDir, "SKILL.md"), "utf8");
  assertStandaloneSkillBody(skillBody, skillId);
  const frontmatter = parseSkillFrontmatter(skillBody, skillId);
  const references = extractReferencedFiles(skillBody);
  const relation = relations[skillId];

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(
    path.join(sourceDir, "SKILL.md"),
    path.join(destDir, "SKILL.md"),
  );
  fs.copyFileSync(path.join(root, "LICENSE"), path.join(destDir, "LICENSE"));

  for (const reference of references) {
    const sourceReference = path.join(sourceDir, reference);
    if (!fs.existsSync(sourceReference))
      throw new Error(`Missing referenced file: ${skillId}/${reference}`);
    const destReference = path.join(destDir, reference);
    fs.mkdirSync(path.dirname(destReference), { recursive: true });
    if (shouldMinifyPackagedScript(reference)) {
      fs.writeFileSync(
        destReference,
        await minifyPackagedScript(sourceReference),
        "utf8",
      );
    } else if (shouldMinifyPackagedJson(reference)) {
      fs.writeFileSync(
        destReference,
        minifyPackagedJson(sourceReference),
        "utf8",
      );
    } else {
      fs.copyFileSync(sourceReference, destReference);
    }
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
    ...(relation ? { relations: relation } : {}),
  };

  const standalonePackage = {
    name: `@bovinphang/${skillId}`,
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
    keywords: unique([
      "agent-skill",
      "frontend-craft",
      skillMeta.category,
      ...skillMeta.tags,
      ...skillMeta.keywords,
    ]),
    files: [
      "SKILL.md",
      "references",
      "scripts",
      "data",
      "assets",
      "metadata.json",
      "README.md",
      "LICENSE",
    ],
    publishConfig: { access: "public" },
  };

  fs.writeFileSync(
    path.join(destDir, "metadata.json"),
    `${JSON.stringify(publishMetadata, null, 2)}\n`,
    "utf8",
  );
  fs.writeFileSync(
    path.join(destDir, "package.json"),
    `${JSON.stringify(standalonePackage, null, 2)}\n`,
    "utf8",
  );
  fs.writeFileSync(
    path.join(destDir, "README.md"),
    renderReadme(skillMeta, frontmatter, references, relation),
    "utf8",
  );

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

fs.writeFileSync(
  path.join(packageRoot, "index.json"),
  `${JSON.stringify(index, null, 2)}\n`,
  "utf8",
);

console.log(`[pack-skills] Packed ${index.length} skills to ${packageRoot}`);

function renderReadme(
  metadata: SkillMetadata,
  frontmatter: { name: string; description: string },
  references: string[],
  relation: SkillRelations[string] | undefined,
): string {
  const referenceSection =
    references.length > 0
      ? `\n## Packaged Files\n\n${references.map((reference) => `- [${reference}](${reference})`).join("\n")}\n`
      : "";
  const relatedSection =
    relation?.relatedSkills && relation.relatedSkills.length > 0
      ? `\n## Optional Related Packages\n\n${relation.relatedSkills
          .map((skillId) => `- \`@bovinphang/${skillId}\``)
          .join("\n")}\n`
      : "";

  return `# ${metadata.name}\n\n${metadata.summary}\n\n## Skill\n\n- ID: \`${metadata.id}\`\n- Category: \`${metadata.category}\`\n- Version: \`${pkg.version}\`\n- Source: \`skills/${metadata.id}/SKILL.md\`\n\n## Description\n\n${frontmatter.description}\n\n## Usage\n\nInstall or import this package with any skill runtime that understands the standard \`SKILL.md\` layout. The canonical source remains the Frontend Craft repository.\n${referenceSection}${relatedSection}\n## License\n\nMIT\n`;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function shouldMinifyPackagedScript(reference: string): boolean {
  return (
    reference.startsWith("scripts/") &&
    [".cjs", ".js", ".mjs"].includes(path.extname(reference))
  );
}

function shouldMinifyPackagedJson(reference: string): boolean {
  return reference.startsWith("data/") && path.extname(reference) === ".json";
}

async function minifyPackagedScript(sourcePath: string): Promise<string> {
  const source = fs.readFileSync(sourcePath, "utf8");
  const hashbang = source.match(/^#![^\r\n]*/)?.[0];
  const result = await transform(source, {
    charset: "utf8",
    format: "esm",
    legalComments: "none",
    loader: "js",
    minify: true,
    sourcemap: false,
    sourcesContent: false,
    target: ["node22"],
  });
  const code = result.code.endsWith("\n") ? result.code : `${result.code}\n`;

  if (!hashbang || code.startsWith(hashbang)) return code;
  return `${hashbang}\n${code.replace(/^#![^\r\n]*(?:\r?\n)?/, "")}`;
}

function minifyPackagedJson(sourcePath: string): string {
  try {
    return `${JSON.stringify(JSON.parse(fs.readFileSync(sourcePath, "utf8")))}\n`;
  } catch (error) {
    throw new Error(`Invalid packaged JSON: ${sourcePath}`, { cause: error });
  }
}
