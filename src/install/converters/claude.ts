import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import { copyDir, copyFile, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.js";

/**
 * @param {string} pluginRoot
 * @param {string} body
 */
export function injectPluginRoot(pluginRoot: string, body: string): string {
  const abs = path.resolve(pluginRoot);
  return body
    .replaceAll("${CLAUDE_PLUGIN_ROOT}", abs)
    .replaceAll("${FRONTEND_CRAFT_ROOT}", abs);
}

/**
 * @param {string} pluginRoot
 */
export function buildHooksJson(pluginRoot: string): string {
  const src = path.join(pluginRoot, "hooks", "hooks.json");
  const raw = readUtf8(src);
  return injectPluginRoot(pluginRoot, raw);
}

/**
 * @param {{ pluginRoot: string; baseDir: string; cwd: string; dryRun: boolean }} ctx
 */
export async function installClaude(ctx: InstallContext): Promise<void> {
  const { pluginRoot, baseDir, dryRun, cwd } = ctx;
  if (dryRun) {
    console.log(`[dry-run] would install Claude Code files into ${baseDir}`);
    return;
  }
  ensureDir(baseDir);
  copyDir(path.join(pluginRoot, "skills"), path.join(baseDir, "skills"));
  copyDir(path.join(pluginRoot, "agents"), path.join(baseDir, "agents"));
  copyDir(path.join(pluginRoot, "commands"), path.join(baseDir, "commands"));
  copyDir(path.join(pluginRoot, "templates", "shared", "rules"), path.join(baseDir, "rules"));
  const claudeTemplateDir = path.join(pluginRoot, "templates", "claude");
  if (fs.existsSync(claudeTemplateDir)) {
    for (const f of fs.readdirSync(claudeTemplateDir)) {
      const dest = path.join(baseDir, f);
      if (!fs.existsSync(dest)) copyFile(path.join(claudeTemplateDir, f), dest);
    }
  }
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
