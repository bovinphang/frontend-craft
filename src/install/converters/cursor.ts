import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { copyDir, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installCursor(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun, isGlobal } = ctx;
  if (dryRun) {
    console.log(`[dry-run] cursor -> ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  const skillsDest = path.join(baseDir, "skills");
  copyDir(path.join(contentRoot, "skills"), skillsDest);

  const rulesSrc = path.join(contentRoot, "templates", "shared", "rules");
  const rulesDest = path.join(baseDir, "rules");
  if (!isGlobal && fs.existsSync(rulesSrc)) {
    ensureDir(rulesDest);
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      const body = readUtf8(path.join(rulesSrc, name));
      const base = name.replace(/\.md$/, "");
      const mdc =
        `---\n` +
        `description: Frontend Craft - ${base}\n` +
        `globs: "**/*.{ts,tsx,vue,js,jsx,css,scss,less,html}"\n` +
        `---\n\n` +
        body +
        `\n`;
      writeUtf8(path.join(rulesDest, `${base}.mdc`), mdc);
    }
  }
}
