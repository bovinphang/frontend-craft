import path from "node:path";
import fs from "node:fs";
import { copyDir, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.mjs";

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installGemini(ctx) {
  const { pluginRoot, baseDir, cwd, dryRun, isGlobal } = ctx;
  if (dryRun) {
    console.log(`[dry-run] gemini -> ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  const extDir = path.join(baseDir, "extensions", "frontend-craft");
  ensureDir(extDir);
  copyDir(path.join(pluginRoot, "skills"), path.join(extDir, "skills"));

  const claudeTmpl = path.join(pluginRoot, "templates", "claude", "CLAUDE.md");
  const geminiMd = path.join(cwd, "GEMINI.md");
  if (!isGlobal && !fs.existsSync(geminiMd) && fs.existsSync(claudeTmpl)) {
    let g = readUtf8(claudeTmpl).replaceAll(".claude/", ".gemini/").replaceAll("CLAUDE.md", "GEMINI.md");
    writeUtf8(geminiMd, g);
  }
}
