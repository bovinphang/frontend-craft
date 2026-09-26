import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import {
  parseAgentDocument,
  parseCommandDocument,
  parseSkillDocument,
  type AgentMetadata,
  type BaseMetadata,
} from "./frontmatter.js";

type ContentKind = "agents" | "commands" | "skills";
type ContentEntry = {
  source: string;
  metadata: BaseMetadata | AgentMetadata;
  body: string;
};

/** Validate both source trees without changing files or translations. */
export function auditContent(root: string): string[] {
  const issues: string[] = [];
  const trees = new Map<string, Map<ContentKind, Map<string, ContentEntry>>>();
  const bases = ["", "localized/zh-CN"];
  for (const base of bases) {
    const tree = new Map<ContentKind, Map<string, ContentEntry>>();
    for (const kind of ["agents", "commands", "skills"] as const) {
      const entries = new Map<string, ContentEntry>();
      const dir = path.join(root, base, kind);
      tree.set(kind, entries);
      if (!fs.existsSync(dir)) {
        issues.push(`${path.join(base, kind)}: missing content directory`);
        continue;
      }
      const files = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((entry) =>
          kind === "skills"
            ? entry.isDirectory()
            : entry.isFile() && entry.name.endsWith(".md"),
        );
      for (const file of files) {
        const name = kind === "skills" ? file.name : file.name.slice(0, -3);
        const source = path.join(
          base,
          kind,
          kind === "skills" ? `${name}/SKILL.md` : file.name,
        );
        try {
          const raw = fs.readFileSync(path.join(root, source), "utf8");
          const parser =
            kind === "agents"
              ? parseAgentDocument
              : kind === "commands"
                ? parseCommandDocument
                : parseSkillDocument;
          entries.set(name, { source, ...parser(raw, source, name) });
        } catch (error) {
          issues.push(
            error instanceof Error
              ? error.message
              : `${source}: ${String(error)}`,
          );
        }
      }
    }
    trees.set(base, tree);
  }
  for (const [base, tree] of trees) {
    const skills = tree.get("skills")!;
    const ids = new Set(
      [...tree.values()].flatMap((entries) => [...entries.keys()]),
    );
    for (const agent of tree.get("agents")!.values()) {
      for (const id of (agent.metadata as AgentMetadata).skills ?? []) {
        if (!skills.has(id))
          issues.push(`${agent.source}: unknown skill ${id}`);
      }
    }
    for (const kind of ["agents", "commands"] as const) {
      for (const entry of tree.get(kind)!.values()) {
        for (const match of entry.body.matchAll(
          /`(fec-[a-z0-9-]+|typescript-reviewer)`/g,
        )) {
          if (!ids.has(match[1]))
            issues.push(`${entry.source}: unknown capability ${match[1]}`);
        }
      }
    }
    if (!base) continue;
    const original = trees.get("")!;
    for (const kind of ["agents", "commands", "skills"] as const) {
      const translated = tree.get(kind)!;
      const english = original.get(kind)!;
      for (const id of new Set([...english.keys(), ...translated.keys()])) {
        const left = english.get(id);
        const right = translated.get(id);
        if (!left || !right) {
          issues.push(
            `${base}/${kind}/${id}${kind === "skills" ? "/SKILL.md" : ".md"}: missing or invalid corresponding localized/source file`,
          );
          continue;
        }
        const keys =
          kind === "agents"
            ? [
                "name",
                "tools",
                "model",
                "permissionMode",
                "maxTurns",
                "skills",
                "mcpServers",
              ]
            : ["name"];
        for (const key of keys) {
          const a = (left.metadata as unknown as Record<string, unknown>)[key];
          const b = (right.metadata as unknown as Record<string, unknown>)[key];
          if (!isDeepStrictEqual(a, b))
            issues.push(
              `${right.source}: localized structure differs for ${key}`,
            );
        }
      }
    }
  }
  return issues;
}
