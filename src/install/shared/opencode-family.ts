import path from "node:path";
import fs from "node:fs";
import { copyDir, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installOpencodeFamily(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  const cmdDest = path.join(baseDir, "command");
  if (dryRun) {
    console.log(`[dry-run] opencode/kilo commands -> ${cmdDest}`);
    return;
  }
  ensureDir(cmdDest);
  const cmdDir = path.join(pluginRoot, "commands");
  for (const f of fs.readdirSync(cmdDir)) {
    if (!f.endsWith(".md")) continue;
    const raw = readUtf8(path.join(cmdDir, f));
    writeUtf8(path.join(cmdDest, f), raw);
  }

  const skillsDest = path.join(baseDir, "skills");
  ensureDir(skillsDest);
  const skillsRoot = path.join(pluginRoot, "skills");
  for (const name of fs.readdirSync(skillsRoot)) {
    const p = path.join(skillsRoot, name);
    if (!fs.statSync(p).isDirectory()) continue;
    const skillMd = path.join(p, "SKILL.md");
    if (fs.existsSync(skillMd)) {
      const destDir = path.join(skillsDest, name);
      copyDir(p, destDir);
    }
  }

  const jsoncPath = path.join(baseDir, "opencode.jsonc");
  if (ctx.runtime === "opencode" && !fs.existsSync(jsoncPath)) {
    writeUtf8(
      jsoncPath,
      `{
  "$schema": "https://opencode.ai/config.json",
  "permissions": { "bash": "allow" }
}
`,
    );
  }
}
