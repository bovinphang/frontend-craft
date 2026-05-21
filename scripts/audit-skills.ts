import fs from "node:fs";
import path from "node:path";
import { resolvePluginRoot } from "../src/install/shared/resolve-plugin-root.js";

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
const skillIds = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const audits = skillIds.map((id): SkillAudit => {
  const body = fs.readFileSync(path.join(skillsDir, id, "SKILL.md"), "utf8");
  const description = body.match(/^description:\s*(.+)$/m)?.[1] ?? "";
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
    tokens: tokenize(body.match(/^description:\s*(.+)$/m)?.[1] ?? ""),
  };
});

const pairs: OverlapPair[] = [];
for (let i = 0; i < descriptions.length; i += 1) {
  for (let j = i + 1; j < descriptions.length; j += 1) {
    const left = descriptions[i];
    const right = descriptions[j];
    const intersection = [...left.tokens].filter((token) => right.tokens.has(token));
    const union = new Set([...left.tokens, ...right.tokens]);
    pairs.push({
      pair: `${left.id} <> ${right.id}`,
      similarity: intersection.length / Math.max(union.size, 1),
      common: intersection.slice(0, 8).join(", "),
    });
  }
}

console.log("\nTop description overlap pairs:");
for (const pair of pairs.sort((a, b) => b.similarity - a.similarity).slice(0, 10)) {
  console.log(`- ${pair.pair}: ${pair.similarity.toFixed(3)} [${pair.common}]`);
}

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
    (value.toLowerCase().match(/[a-z][a-z0-9-]{2,}|[\u4e00-\u9fff]{2,}/g) ?? []).filter(
      (token) => !stopWords.has(token),
    ),
  );
}
