import { createFileTools } from "../shared/fs.js";
import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { installCommandSkills } from "../shared/command-skills.js";
/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installOpenclaw(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, cwd, dryRun, isGlobal } = ctx;
  if (dryRun && !ctx.session)
    return console.log(`[dry-run] openclaw -> ${baseDir}`);
  const { ensureDir, copyProductSkills, retireManagedTree, copyFile } =
    createFileTools(ctx);
  ensureDir(baseDir);
  const skillsDir = path.join(isGlobal ? baseDir : cwd, "skills");
  copyProductSkills(path.join(contentRoot, "skills"), skillsDir);
  installCommandSkills(path.join(contentRoot, "commands"), skillsDir, ctx);
  retireManagedTree(path.join(baseDir, "commands"));
  if (isGlobal) return;
  retireManagedTree(path.join(baseDir, "skills"));
  const tmpl = path.join(contentRoot, "templates", "openclaw");
  if (fs.existsSync(tmpl)) {
    for (const f of fs.readdirSync(tmpl)) {
      if (!f.endsWith(".md")) continue;
      const dest = path.join(cwd, f);
      if (!fs.existsSync(dest)) copyFile(path.join(tmpl, f), dest);
    }
  }
}
