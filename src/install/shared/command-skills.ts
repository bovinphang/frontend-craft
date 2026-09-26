import fs from "node:fs";
import path from "node:path";
import { readUtf8, writeUtf8 } from "./fs.js";
import { parseCommandDocument } from "./frontmatter.js";

/** OpenClaw discovers command workflows through Agent Skills, not loose Markdown. */
export function installCommandSkills(
  commandsDir: string,
  skillsDir: string,
): void {
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
    writeUtf8(
      path.join(skillsDir, name, "SKILL.md"),
      `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\nuser-invocable: true\n---\n\n${body.trim()}\n`,
    );
  }
}
