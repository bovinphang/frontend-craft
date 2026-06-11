import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { copyDir, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installGemini(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, cwd, dryRun, isGlobal } = ctx;
  if (dryRun) {
    console.log(`[dry-run] gemini -> ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  const extDir = path.join(baseDir, "extensions", "frontend-craft");
  ensureDir(extDir);
  copyDir(path.join(contentRoot, "skills"), path.join(extDir, "skills"));

  const claudeTmpl = path.join(contentRoot, "templates", "claude", "CLAUDE.md");
  const geminiMd = path.join(cwd, "GEMINI.md");
  if (!isGlobal && !fs.existsSync(geminiMd) && fs.existsSync(claudeTmpl)) {
    let g = readUtf8(claudeTmpl).replaceAll(".claude/", ".gemini/").replaceAll("CLAUDE.md", "GEMINI.md");
    writeUtf8(geminiMd, g);
  }
}
