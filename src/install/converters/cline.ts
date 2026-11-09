import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { createFileTools } from "../shared/fs.js";
/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installCline(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun, isGlobal } = ctx;
  if (dryRun && !ctx.session)
    return console.log(
      `[dry-run] cline -> ${path.join(baseDir, ".clinerules")}`,
    );
  const { readUtf8, forgetManagedFile, writeUtf8 } = createFileTools(ctx);
  const rulesSrc = path.join(contentRoot, "templates", "shared", "rules");
  /** @type {string[]} */
  const parts = ["# Frontend Craft - Cline rules\n"];
  if (fs.existsSync(rulesSrc)) {
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      parts.push(`\n## ${name}\n\n`, readUtf8(path.join(rulesSrc, name)));
    }
  }
  const rulesPath = path.join(baseDir, isGlobal ? "Rules" : ".clinerules");
  if (fs.existsSync(rulesPath) && !fs.statSync(rulesPath).isDirectory()) {
    const backup = `${rulesPath}.frontend-craft-backup`;
    if (fs.existsSync(backup))
      throw new Error(
        `Cline legacy backup already exists: ${backup}. Resolve it before retrying; the original rules were not changed.`,
      );
    const original = ctx.session!.read(rulesPath);
    ctx.session!.stage(backup, original);
    ctx.session!.stage(rulesPath, null);
    ctx.session!.stage(path.join(rulesPath, "legacy.md"), original);
    forgetManagedFile(rulesPath);
    console.log(
      `Cline: migrated legacy rules to ${path.join(rulesPath, "legacy.md")}; original retained at ${backup}.`,
    );
  }
  writeUtf8(path.join(rulesPath, "frontend-craft.md"), parts.join(""));
}
