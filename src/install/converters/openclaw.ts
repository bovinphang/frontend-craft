import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { copyDir, copyFile, ensureDir } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installOpenclaw(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, cwd, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] openclaw -> ${baseDir}`);
  ensureDir(baseDir);
  copyDir(path.join(contentRoot, "skills"), path.join(baseDir, "skills"));
  copyDir(path.join(contentRoot, "commands"), path.join(baseDir, "commands"));
  const tmpl = path.join(contentRoot, "templates", "openclaw");
  if (fs.existsSync(tmpl)) {
    for (const f of fs.readdirSync(tmpl)) {
      if (!f.endsWith(".md")) continue;
      const dest = path.join(cwd, f);
      if (!fs.existsSync(dest)) copyFile(path.join(tmpl, f), dest);
    }
  }
}
