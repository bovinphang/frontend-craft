import path from "node:path";
import fs from "node:fs";
import { ensureDir, readUtf8, writeUtf8 } from "../shared/fs.mjs";

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installTrae(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] trae -> ${baseDir}`);
  const rulesDir = path.join(baseDir, "rules");
  ensureDir(rulesDir);
  const rulesSrc = path.join(pluginRoot, "templates", "shared", "rules");
  /** @type {string[]} */
  const parts = ["# Frontend Craft — Trae rules bundle\n"];
  if (fs.existsSync(rulesSrc)) {
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      parts.push(`\n## ${name}\n\n`, readUtf8(path.join(rulesSrc, name)));
    }
  }
  writeUtf8(path.join(rulesDir, "frontend-craft.md"), parts.join(""));
}
