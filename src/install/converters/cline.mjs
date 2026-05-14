import path from "node:path";
import fs from "node:fs";
import { readUtf8, writeUtf8 } from "../shared/fs.mjs";

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installCline(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] cline -> ${path.join(baseDir, ".clinerules")}`);
  const rulesSrc = path.join(pluginRoot, "templates", "shared", "rules");
  /** @type {string[]} */
  const parts = ["# Frontend Craft — Cline rules\n"];
  if (fs.existsSync(rulesSrc)) {
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      parts.push(`\n## ${name}\n\n`, readUtf8(path.join(rulesSrc, name)));
    }
  }
  writeUtf8(path.join(baseDir, ".clinerules"), parts.join(""));
}
