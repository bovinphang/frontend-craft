import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const RULES_DIR = "templates/shared/rules";
const AGENTS_TEMPLATE = "templates/openclaw/AGENTS.md";
const SKILLS_SUBDIR = "skills/frontend-craft-rules";

export type InitResult =
  | { ok: true; copied: string[] }
  | { ok: false; error: string };

export function initFrontendCraftWorkspace(
  pluginRoot: string,
  workspaceDir: string,
  options: { overwriteAgents?: boolean } = {},
): InitResult {
  const copied: string[] = [];
  try {
    const agentsSrc = join(pluginRoot, AGENTS_TEMPLATE);
    if (!existsSync(agentsSrc)) {
      return { ok: false, error: `Missing template: ${AGENTS_TEMPLATE}` };
    }

    const agentsDest = join(workspaceDir, "AGENTS.md");
    if (!existsSync(agentsDest) || options.overwriteAgents) {
      copyFileSync(agentsSrc, agentsDest);
      copied.push(agentsDest);
    } else {
      const existing = readFileSync(agentsDest, "utf-8");
      const marker =
        "\n\n---\n\n## frontend-craft\n\n模板未覆盖已有 AGENTS.md。如需合并，请手动将插件内 `templates/openclaw/AGENTS.md` 内容并入本文件。\n";
      if (!existing.includes("## frontend-craft")) {
        writeFileSync(agentsDest, existing + marker, "utf-8");
        copied.push(`${agentsDest} (appended note)`);
      } else {
        copied.push(`${agentsDest} (unchanged, note already present)`);
      }
    }

    const rulesSrc = join(pluginRoot, RULES_DIR);
    if (existsSync(rulesSrc)) {
      const destDir = join(workspaceDir, SKILLS_SUBDIR);
      mkdirSync(destDir, { recursive: true });
      for (const name of readdirSync(rulesSrc)) {
        const p = join(rulesSrc, name);
        if (!statSync(p).isFile() || !name.endsWith(".md")) continue;
        const out = join(destDir, name);
        copyFileSync(p, out);
        copied.push(out);
      }
      const skillFile = join(destDir, "SKILL.md");
      if (!existsSync(skillFile)) {
        const references = readdirSync(destDir).filter(
          (name) => name.endsWith(".md") && name !== "SKILL.md",
        );
        writeFileSync(
          skillFile,
          "---\nname: frontend-craft-rules\ndescription: Apply the workspace frontend engineering rules when implementing or reviewing frontend code.\n---\n\n" +
            "Read the relevant rules before changing code:\n\n" +
            references.map((name) => `- [${name}](./${name})`).join("\n") +
            "\n",
          "utf8",
        );
        copied.push(skillFile);
      }
    }

    return { ok: true, copied };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
