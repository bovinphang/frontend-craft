import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { readUtf8, writeUtf8 } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installCline(ctx: InstallContext): Promise<void> {
  const { pluginRoot, baseDir, dryRun, isGlobal } = ctx;
  if (dryRun) return console.log(`[dry-run] cline -> ${path.join(baseDir, ".clinerules")}`);
  if (isGlobal) return;
  const rulesSrc = path.join(pluginRoot, "templates", "shared", "rules");
  /** @type {string[]} */
  const parts = ["# Frontend Craft - Cline rules\n"];
  if (fs.existsSync(rulesSrc)) {
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      parts.push(`\n## ${name}\n\n`, readUtf8(path.join(rulesSrc, name)));
    }
  }
  writeUtf8(path.join(baseDir, ".clinerules"), parts.join(""));
}
