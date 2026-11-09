import fs from "node:fs";
import path from "node:path";
import { readUtf8, writeUtf8 } from "./fs.js";
import { createFileTools } from "./fs.js";
import type { InstallContext } from "../types.js";
import { parseCommandDocument } from "./frontmatter.js";

/** OpenClaw discovers command workflows through Agent Skills, not loose Markdown. */
export function installCommandSkills(
  commandsDir: string,
  skillsDir: string,
  ctx?: InstallContext,
): void {
  const write = ctx ? createFileTools(ctx).writeUtf8 : writeUtf8;
  if (!fs.existsSync(commandsDir)) return;
  for (const file of fs.readdirSync(commandsDir)) {
    if (!file.endsWith(".md")) continue;
    const name = file.slice(0, -3);
    if (fs.existsSync(path.join(commandsDir, "..", "skills", name, "SKILL.md")))
      continue;
    const raw = readUtf8(path.join(commandsDir, file));
    const {
      metadata: { description },
      body,
    } = parseCommandDocument(raw, path.join(commandsDir, file), name);
    write(
      path.join(skillsDir, name, "SKILL.md"),
      `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\nuser-invocable: true\n---\n\n${body.trim()}\n`,
    );
  }
}
