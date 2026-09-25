import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { copyDir, ensureDir, readUtf8, writeUtf8, retireManagedFile } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installOpencodeFamily(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun } = ctx;
  const cmdDest = path.join(baseDir, "commands");
  if (dryRun) {
    console.log(`[dry-run] opencode/kilo commands -> ${cmdDest}`);
    return;
  }
  ensureDir(cmdDest);
  const cmdDir = path.join(contentRoot, "commands");
  for (const f of fs.readdirSync(cmdDir)) {
    if (!f.endsWith(".md")) continue;
    const raw = readUtf8(path.join(cmdDir, f));
    writeUtf8(path.join(cmdDest, f), raw);
    retireManagedFile(path.join(baseDir, "command", f));
  }

  const skillsDest = path.join(baseDir, "skills");
  ensureDir(skillsDest);
  const skillsRoot = path.join(contentRoot, "skills");
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
  if (ctx.runtime === "opencode" && (!fs.existsSync(jsoncPath) || isLegacyTemplate(jsoncPath))) {
    writeUtf8(
      jsoncPath,
      `{
  "$schema": "https://opencode.ai/config.json",
  "permission": { "bash": "allow" }
}
`,
    );
  }
}

function isLegacyTemplate(file: string): boolean {
  try {
    const value = JSON.parse(readUtf8(file));
    return value.$schema === "https://opencode.ai/config.json" &&
      Object.keys(value).length === 2 &&
      JSON.stringify(value.permissions) === '{"bash":"allow"}';
  } catch { return false; }
}
