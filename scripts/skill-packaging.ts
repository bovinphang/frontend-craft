import fs from "node:fs";
import path from "node:path";
import { parseSkillDocument } from "../src/install/shared/frontmatter.js";

export type SkillMetadata = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  summary: string;
  version: string;
  license: string;
  homepage: string;
  repository: string;
  keywords: string[];
  platforms: string[];
};

export type RootPackage = {
  version: string;
  license: string;
  homepage: string;
  repository: { type: string; url: string };
  author?: unknown;
};

export type SkillFrontmatter = {
  name: string;
  description: string;
};

export type SkillRelation = {
  relatedSkills?: string[];
  boundaryWorkflows?: string[];
  capabilityTags: string[];
};

export type SkillRelations = Record<string, SkillRelation>;

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function parseSkillFrontmatter(
  body: string,
  skillId: string,
): SkillFrontmatter {
  return parseSkillDocument(body, `${skillId}/SKILL.md`, skillId).metadata;
}

export function resolveSkillOrigin(
  skillId: string,
  productRoot: string,
): { packageName: string; version: string; repository: string } {
  if (skillId.startsWith("cc-")) {
    const lock = readJsonFile<{
      packageName: string;
      packageVersion: string;
      catalogs: { en: { skills: Array<{ id: string; repository: string }> } };
    }>(path.join(productRoot, "common-content.lock.json"));
    const source = lock.catalogs.en.skills.find(
      (skill) => skill.id === skillId,
    );
    if (!source) throw new Error(`公共内容锁没有该技能：${skillId}`);
    return {
      packageName: lock.packageName,
      version: lock.packageVersion,
      repository: source.repository,
    };
  }
  const pkg = readJsonFile<{
    name: string;
    version: string;
    repository: { url: string };
  }>(path.join(productRoot, "package.json"));
  return {
    packageName: pkg.name,
    version: pkg.version,
    repository: pkg.repository.url,
  };
}

export function extractReferencedFiles(
  body: string,
  skillRoot?: string,
): string[] {
  if (skillRoot) {
    const files: string[] = [];
    const visit = (dir: string): void => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isSymbolicLink())
          throw new Error(`独立包不允许符号链接：${file}`);
        if (entry.isDirectory()) visit(file);
        else if (entry.isFile() && file !== path.join(skillRoot, "SKILL.md"))
          files.push(toPosixPath(path.relative(skillRoot, file)));
      }
    };
    visit(skillRoot);
    return files.sort();
  }
  return [
    ...new Set(
      [
        ...body.matchAll(/\]\(((?:references|scripts|data|assets)\/[^)]+)\)/g),
      ].map((match) => match[1]),
    ),
  ].sort();
}

export function listSkillIds(skillsDir: string): string[] {
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

export function assertStandaloneSkillBody(body: string, skillId: string): void {
  const forbiddenPatterns = [
    {
      pattern: /^## Related Skills \/ Boundary$/m,
      label: "Related Skills / Boundary section",
    },
    { pattern: /^## Related Agent$/m, label: "Related Agent section" },
    { pattern: /^## 相关技能$/m, label: "related skills section" },
    { pattern: /^## 与子代理的配合$/m, label: "subagent coordination section" },
    {
      pattern: /`(?:fec|cc)-[a-z0-9-]+`/,
      label: "inline skill or agent id navigation",
    },
    {
      pattern: /[「『“"](?:fec|cc)-[a-z0-9-]+[」』”"]\s*(?:skill|技能)/,
      label: "quoted skill id navigation",
    },
    { pattern: /\]\(\.\.\/\.\.\/agents\//, label: "../../agents link" },
    { pattern: /\]\(\.\.\/agents\//, label: "../agents link" },
    { pattern: /\]\(\.\.\/\.\.\/skills\//, label: "../../skills link" },
    { pattern: /\]\(\.\.\/skills\//, label: "../skills link" },
  ];

  for (const { pattern, label } of forbiddenPatterns) {
    if (pattern.test(body))
      throw new Error(
        `Standalone skill ${skillId} contains forbidden ${label}`,
      );
  }
}

export function assertSkillRelation(
  value: SkillRelation,
  skillId: string,
  skillIds: Set<string>,
): void {
  const allowedKeys = new Set([
    "relatedSkills",
    "boundaryWorkflows",
    "capabilityTags",
  ]);
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key))
      throw new Error(`Unsupported relation field ${skillId}.${key}`);
  }

  assertOptionalStringArray(value.relatedSkills, `${skillId}.relatedSkills`);
  assertOptionalStringArray(
    value.boundaryWorkflows,
    `${skillId}.boundaryWorkflows`,
  );
  assertRequiredStringArray(value.capabilityTags, `${skillId}.capabilityTags`);

  for (const relatedSkill of value.relatedSkills ?? []) {
    if (!skillIds.has(relatedSkill))
      throw new Error(`Unknown related skill ${relatedSkill} in ${skillId}`);
  }
}

function assertOptionalStringArray(value: unknown, label: string): void {
  if (value === undefined) return;
  assertRequiredStringArray(value, label);
}

function assertRequiredStringArray(value: unknown, label: string): void {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((entry) => typeof entry !== "string" || entry.length === 0)
  ) {
    throw new Error(`${label} must be a non-empty string array`);
  }
}
