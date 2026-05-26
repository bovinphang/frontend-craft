import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { copyDir, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installWindsurf(ctx: InstallContext): Promise<void> {
  const { pluginRoot, baseDir, dryRun, isGlobal } = ctx;
  if (dryRun) {
    console.log(`[dry-run] windsurf -> ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  const wf = path.join(baseDir, "workflows");
  const rulesDest = path.join(baseDir, "rules");
  ensureDir(wf);

  const cmdDir = path.join(pluginRoot, "commands");
  for (const f of fs.readdirSync(cmdDir)) {
    if (!f.endsWith(".md")) continue;
    const raw = readUtf8(path.join(cmdDir, f));
    writeUtf8(path.join(wf, f), raw);
  }

  const rulesSrc = path.join(pluginRoot, "templates", "shared", "rules");
  if (!isGlobal && fs.existsSync(rulesSrc)) {
    ensureDir(rulesDest);
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      const body = readUtf8(path.join(rulesSrc, name));
      writeUtf8(path.join(rulesDest, name), body);
    }
  }

  copyDir(path.join(pluginRoot, "skills"), path.join(baseDir, "skills"));
}
