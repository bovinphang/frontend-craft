import path from "node:path";
import fs from "node:fs";
import { ensureDir, readUtf8, writeUtf8 } from "../shared/fs.mjs";

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installCopilot(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) {
    console.log(`[dry-run] copilot -> ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  const instr = path.join(baseDir, "instructions");
  const prompts = path.join(baseDir, "prompts");
  ensureDir(instr);
  ensureDir(prompts);

  const rulesSrc = path.join(pluginRoot, "templates", "shared", "rules");
  /** @type {string[]} */
  const parts = ["# Frontend Craft — Copilot instructions\n"];
  if (fs.existsSync(rulesSrc)) {
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      parts.push(`\n## ${name}\n\n`, readUtf8(path.join(rulesSrc, name)));
    }
  }
  writeUtf8(path.join(instr, "frontend-craft.instructions.md"), parts.join(""));

  const cmdDir = path.join(pluginRoot, "commands");
  for (const f of fs.readdirSync(cmdDir)) {
    if (!f.endsWith(".md")) continue;
    writeUtf8(path.join(prompts, f), readUtf8(path.join(cmdDir, f)));
  }
}
