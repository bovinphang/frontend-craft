import { createFileTools } from "../shared/fs.js";
import path from "node:path";
import type { InstallContext } from "../types.js";
/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installAntigravity(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun } = ctx;
  if (dryRun && !ctx.session)
    return (ctx.log ?? console.log)(`[dry-run] antigravity -> ${baseDir}`);
  const { ensureDir, copyProductSkills } = createFileTools(ctx);
  ensureDir(baseDir);
  copyProductSkills(
    path.join(contentRoot, "skills"),
    path.join(baseDir, "skills"),
  );
}
/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installAugment(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun } = ctx;
  if (dryRun && !ctx.session)
    return (ctx.log ?? console.log)(`[dry-run] augment -> ${baseDir}`);
  const { ensureDir, copyProductSkills } = createFileTools(ctx);
  ensureDir(baseDir);
  copyProductSkills(
    path.join(contentRoot, "skills"),
    path.join(baseDir, "skills"),
  );
}
/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installCodebuddy(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun } = ctx;
  if (dryRun && !ctx.session)
    return (ctx.log ?? console.log)(`[dry-run] codebuddy -> ${baseDir}`);
  const { ensureDir, copyProductSkills } = createFileTools(ctx);
  ensureDir(baseDir);
  copyProductSkills(
    path.join(contentRoot, "skills"),
    path.join(baseDir, "skills"),
  );
}
