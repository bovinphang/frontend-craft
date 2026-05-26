import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { ensureDir, readUtf8, writeUtf8 } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installTrae(ctx: InstallContext): Promise<void> {
  const { pluginRoot, baseDir, dryRun, isGlobal } = ctx;
  if (dryRun) return console.log(`[dry-run] trae -> ${baseDir}`);
  if (isGlobal) return;
  const rulesDir = path.join(baseDir, "rules");
  ensureDir(rulesDir);
  const rulesSrc = path.join(pluginRoot, "templates", "shared", "rules");
  /** @type {string[]} */
  const parts = ["# Frontend Craft - Trae rules bundle\n"];
  if (fs.existsSync(rulesSrc)) {
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      parts.push(`\n## ${name}\n\n`, readUtf8(path.join(rulesSrc, name)));
    }
  }
  writeUtf8(path.join(rulesDir, "frontend-craft.md"), parts.join(""));
}
