import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import {
  copyDir,
  ensureDir,
  retireManagedTree,
  readUtf8,
  writeUtf8,
} from "../shared/fs.js";

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
  retireManagedTree(
    path.join(baseDir, "extensions", "frontend-craft", "skills"),
  );
  copyDir(path.join(contentRoot, "skills"), path.join(baseDir, "skills"));
  copyDir(
    path.join(contentRoot, "templates", "shared", "rules"),
    path.join(baseDir, "rules"),
  );

  const claudeTmpl = path.join(contentRoot, "templates", "claude", "CLAUDE.md");
  const geminiMd = path.join(isGlobal ? baseDir : cwd, "GEMINI.md");
  if (!fs.existsSync(geminiMd) && fs.existsSync(claudeTmpl)) {
    const rulePath = isGlobal ? "./rules/" : "./.gemini/rules/";
    const g = readUtf8(claudeTmpl)
      .replaceAll(".claude/", ".gemini/")
      .replaceAll("CLAUDE.md", "GEMINI.md")
      .replaceAll("@./rules/", `@${rulePath}`);
    writeUtf8(geminiMd, g);
  }
}
