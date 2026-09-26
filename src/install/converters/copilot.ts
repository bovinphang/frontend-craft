import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import {
  ensureDir,
  readUtf8,
  writeUtf8,
  retireManagedFile,
} from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installCopilot(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun, isGlobal } = ctx;
  if (dryRun) {
    console.log(`[dry-run] copilot -> ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  const instr = path.join(baseDir, "instructions");
  const prompts = path.join(baseDir, "prompts");

  {
    ensureDir(instr);
    const rulesSrc = path.join(contentRoot, "templates", "shared", "rules");
    /** @type {string[]} */
    const parts = [
      isGlobal
        ? "# Frontend Craft - Copilot instructions\n"
        : '---\napplyTo: "**"\n---\n\n# Frontend Craft - Copilot instructions\n',
    ];
    if (fs.existsSync(rulesSrc)) {
      for (const name of fs.readdirSync(rulesSrc)) {
        if (!name.endsWith(".md")) continue;
        parts.push(`\n## ${name}\n\n`, readUtf8(path.join(rulesSrc, name)));
      }
    }
    const dest = isGlobal
      ? path.join(baseDir, "copilot-instructions.md")
      : path.join(instr, "frontend-craft.instructions.md");
    if (!isGlobal || !fs.existsSync(dest)) writeUtf8(dest, parts.join(""));
  }

  if (isGlobal) {
    console.log(
      "Copilot global: installed CLI instructions; IDE prompt files require a local install.",
    );
    return;
  }
  ensureDir(prompts);

  const cmdDir = path.join(contentRoot, "commands");
  for (const f of fs.readdirSync(cmdDir)) {
    if (!f.endsWith(".md")) continue;
    writeUtf8(
      path.join(prompts, f.replace(/\.md$/, ".prompt.md")),
      readUtf8(path.join(cmdDir, f)),
    );
    retireManagedFile(path.join(prompts, f));
  }
}
