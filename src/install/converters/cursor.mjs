import path from "node:path";
import fs from "node:fs";
import { copyDir, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.mjs";

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installCursor(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) {
    console.log(`[dry-run] cursor -> ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  const skillsDest = path.join(baseDir, "skills");
  copyDir(path.join(pluginRoot, "skills"), skillsDest);

  const rulesSrc = path.join(pluginRoot, "templates", "shared", "rules");
  const rulesDest = path.join(baseDir, "rules");
  ensureDir(rulesDest);
  if (fs.existsSync(rulesSrc)) {
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      const body = readUtf8(path.join(rulesSrc, name));
      const base = name.replace(/\.md$/, "");
      const mdc =
        `---\n` +
        `description: Frontend Craft — ${base}\n` +
        `globs: "**/*.{ts,tsx,vue,js,jsx,css,scss,less,html}"\n` +
        `---\n\n` +
        body +
        `\n`;
      writeUtf8(path.join(rulesDest, `${base}.mdc`), mdc);
    }
  }
}
