import path from "node:path";
import fs from "node:fs";
import { copyDir, ensureDir } from "../shared/fs.mjs";

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installAntigravity(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] antigravity -> ${baseDir}`);
  ensureDir(baseDir);
  copyDir(path.join(pluginRoot, "skills"), path.join(baseDir, "skills"));
}

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installAugment(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] augment -> ${baseDir}`);
  ensureDir(baseDir);
  copyDir(path.join(pluginRoot, "skills"), path.join(baseDir, "skills"));
}

/**
 * @param {import('../types.mjs').InstallContext} ctx
 */
export async function installCodebuddy(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) return console.log(`[dry-run] codebuddy -> ${baseDir}`);
  ensureDir(baseDir);
  copyDir(path.join(pluginRoot, "skills"), path.join(baseDir, "skills"));
}
