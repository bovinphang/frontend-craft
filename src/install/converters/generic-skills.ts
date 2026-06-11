import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { copyDir, ensureDir } from "../shared/fs.js";

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installAntigravity(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] antigravity -> ${baseDir}`);
  ensureDir(baseDir);
  copyDir(path.join(contentRoot, "skills"), path.join(baseDir, "skills"));
}

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installAugment(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] augment -> ${baseDir}`);
  ensureDir(baseDir);
  copyDir(path.join(contentRoot, "skills"), path.join(baseDir, "skills"));
}

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installCodebuddy(ctx: InstallContext): Promise<void> {
  const { contentRoot, baseDir, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] codebuddy -> ${baseDir}`);
  ensureDir(baseDir);
  copyDir(path.join(contentRoot, "skills"), path.join(baseDir, "skills"));
}
