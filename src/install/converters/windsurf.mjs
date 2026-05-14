import path from "node:path";
import fs from "node:fs";
import { copyDir, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.mjs";

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installWindsurf(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) {
    console.log(`[dry-run] windsurf -> ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  const wf = path.join(baseDir, "workflows");
  const rulesDest = path.join(baseDir, "rules");
  ensureDir(wf);
  ensureDir(rulesDest);

  const cmdDir = path.join(pluginRoot, "commands");
  for (const f of fs.readdirSync(cmdDir)) {
    if (!f.endsWith(".md")) continue;
    const raw = readUtf8(path.join(cmdDir, f));
    writeUtf8(path.join(wf, f), raw);
  }

  const rulesSrc = path.join(pluginRoot, "templates", "shared", "rules");
  if (fs.existsSync(rulesSrc)) {
    for (const name of fs.readdirSync(rulesSrc)) {
      if (!name.endsWith(".md")) continue;
      const body = readUtf8(path.join(rulesSrc, name));
      writeUtf8(path.join(rulesDest, name), body);
    }
  }

  copyDir(path.join(pluginRoot, "skills"), path.join(baseDir, "skills"));
}
