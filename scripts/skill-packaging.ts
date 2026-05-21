import fs from "node:fs";
import path from "node:path";

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

export function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function parseSkillFrontmatter(body: string, skillId: string): SkillFrontmatter {
  const frontmatter = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) throw new Error(`Missing frontmatter: ${skillId}`);

  const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name) throw new Error(`Missing frontmatter name: ${skillId}`);
  if (!description) throw new Error(`Missing frontmatter description: ${skillId}`);
  return { name, description };
}

export function extractReferencedFiles(body: string): string[] {
  return [...new Set([...body.matchAll(/\]\((references\/[^)]+)\)/g)].map((match) => match[1]))].sort();
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
