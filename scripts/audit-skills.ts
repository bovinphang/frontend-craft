import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../src/install/shared/resolve-plugin-root.js";
import { parseSkillFrontmatter } from "./skill-packaging.js";

type SkillAudit = {
  id: string;
  descriptionLength: number;
  lines: number;
  references: number;
};

type OverlapPair = {
  pair: string;
  similarity: number;
  common: string;
};

const root = resolvePluginRoot(import.meta.url);
const skillsDir = path.join(root, "skills");
const evalQueries = JSON.parse(
  fs.readFileSync(path.join(skillsDir, "eval_queries.json"), "utf8"),
) as Record<string, { should_trigger: string[]; should_not_trigger: string[] }>;
const skillIds = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const audits = skillIds.map((id): SkillAudit => {
  const body = fs.readFileSync(path.join(skillsDir, id, "SKILL.md"), "utf8");
  const { description } = parseSkillFrontmatter(body, id);
  return {
    id,
    descriptionLength: description.length,
    lines: body.split(/\r?\n/).length,
    references: [...body.matchAll(/\]\((references\/[^)]+)\)/g)].length,
  };
});

console.table(audits);

const needsSplitReview = audits.filter((skill) => skill.lines > 220);
if (needsSplitReview.length > 0) {
  console.log("\nSkills above the 220-line review threshold:");
  for (const skill of needsSplitReview) {
    console.log(`- ${skill.id}: ${skill.lines} lines`);
  }
}

const descriptions = skillIds.map((id) => {
  const body = fs.readFileSync(path.join(skillsDir, id, "SKILL.md"), "utf8");
  return {
    id,
    tokens: tokenize(parseSkillFrontmatter(body, id).description),
  };
});

const pairs: OverlapPair[] = [];
for (let i = 0; i < descriptions.length; i += 1) {
  for (let j = i + 1; j < descriptions.length; j += 1) {
    const left = descriptions[i];
    const right = descriptions[j];
    const intersection = [...left.tokens].filter((token) =>
      right.tokens.has(token),
    );
    const union = new Set([...left.tokens, ...right.tokens]);
    pairs.push({
      pair: `${left.id} <> ${right.id}`,
      similarity: intersection.length / Math.max(union.size, 1),
      common: intersection.slice(0, 8).join(", "),
    });
  }
}

console.log("\nTop description overlap pairs:");
for (const pair of pairs
  .sort((a, b) => b.similarity - a.similarity)
  .slice(0, 10)) {
  console.log(`- ${pair.pair}: ${pair.similarity.toFixed(3)} [${pair.common}]`);
}

const catalogPath = path.join(
  skillsDir,
  "fec-refactoring-catalog",
  "references",
  "catalog-index.md",
);
const catalog = fs.readFileSync(catalogPath, "utf8");
const detailPaths = [
  ...catalog.matchAll(/\]\((\.\.\/\.\.\/fec-refactoring-[^)]+\.md)\)/g),
].map((match) => match[1]);
const missingDetails = detailPaths.filter(
  (detail) => !fs.existsSync(path.resolve(path.dirname(catalogPath), detail)),
);
console.log(
  `\nRefactoring catalog links: ${detailPaths.length} checked, ${missingDetails.length} missing`,
);
if (missingDetails.length) process.exitCode = 1;

const normalizeQuery = (query: string): string =>
  query.trim().toLocaleLowerCase();
const positiveOwners = new Map<string, string[]>();
for (const [id, queries] of Object.entries(evalQueries)) {
  for (const query of queries.should_trigger) {
    const key = normalizeQuery(query);
    positiveOwners.set(key, [...(positiveOwners.get(key) ?? []), id]);
  }
}
const collisions = [...positiveOwners].filter(
  ([, owners]) => owners.length > 1,
);
console.log(
  `Positive eval queries shared by multiple skills: ${collisions.length}`,
);
for (const [query, owners] of collisions.slice(0, 10))
  console.log(`- ${owners.join(" <> ")}: ${query}`);
const contradictions = Object.entries(evalQueries).flatMap(([id, queries]) =>
  queries.should_not_trigger
    .filter((query) =>
      queries.should_trigger.some(
        (positive) => normalizeQuery(positive) === normalizeQuery(query),
      ),
    )
    .map((query) => `${id}: ${query}`),
);
console.log(
  `Positive/negative contradictions within a skill: ${contradictions.length}`,
);
for (const contradiction of contradictions.slice(0, 10))
  console.log(`- ${contradiction}`);
if (contradictions.length) process.exitCode = 1;

function tokenize(value: string): Set<string> {
  const stopWords = new Set([
    "and",
    "for",
    "the",
    "use",
    "when",
    "with",
    "or",
    "such",
    "include",
    "includes",
    "chinese",
    "triggers",
    "prefer",
    "do",
    "not",
    "use",
  ]);
  return new Set(
    (
      value.toLowerCase().match(/[a-z][a-z0-9-]{2,}|[\u4e00-\u9fff]{2,}/g) ?? []
    ).filter((token) => !stopWords.has(token)),
  );
}
