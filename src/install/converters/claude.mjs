import path from "node:path";
import fs from "node:fs";
import { copyDir, copyFile, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.mjs";

/**
 * @param {string} pluginRoot
 * @param {string} body
 */
export function injectPluginRoot(pluginRoot, body) {
  const abs = path.resolve(pluginRoot);
  return body
    .replaceAll("${CLAUDE_PLUGIN_ROOT}", abs)
    .replaceAll("${FRONTEND_CRAFT_ROOT}", abs);
}

/**
 * @param {string} pluginRoot
 */
export function buildHooksJson(pluginRoot) {
  const src = path.join(pluginRoot, "hooks", "hooks.json");
  const raw = readUtf8(src);
  return injectPluginRoot(pluginRoot, raw);
}

/**
 * @param {{ pluginRoot: string; baseDir: string; cwd: string; dryRun: boolean }} ctx
 */
export async function installClaude(ctx) {
  const { pluginRoot, baseDir, dryRun, cwd } = ctx;
  if (dryRun) {
    console.log(`[dry-run] would install Claude Code files into ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  copyDir(path.join(pluginRoot, "skills"), path.join(baseDir, "skills"));
  copyDir(path.join(pluginRoot, "agents"), path.join(baseDir, "agents"));
  copyDir(path.join(pluginRoot, "commands"), path.join(baseDir, "commands"));
  writeUtf8(path.join(baseDir, "hooks.json"), buildHooksJson(pluginRoot));
  if (fs.existsSync(path.join(pluginRoot, ".mcp.json"))) {
    const destMcp = path.join(cwd, ".mcp.json");
    if (!fs.existsSync(destMcp)) copyFile(path.join(pluginRoot, ".mcp.json"), destMcp);
  }
  const pluginJson = path.join(pluginRoot, ".claude-plugin", "plugin.json");
  if (fs.existsSync(pluginJson)) {
    ensureDir(path.join(cwd, ".claude-plugin"));
    copyFile(pluginJson, path.join(cwd, ".claude-plugin", "plugin.json"));
    const mp = path.join(pluginRoot, ".claude-plugin", "marketplace.json");
    if (fs.existsSync(mp)) copyFile(mp, path.join(cwd, ".claude-plugin", "marketplace.json"));
  }
}
