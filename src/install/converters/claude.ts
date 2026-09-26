import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import {
  copyDir,
  copyFile,
  ensureDir,
  readUtf8,
  retireManagedFile,
} from "../shared/fs.js";
import {
  asRecord,
  mergeHooks,
  readSettings,
  writeSettings,
} from "../shared/settings.js";

/**
 * @param {string} pluginRoot
 * @param {string} body
 */
export function injectPluginRoot(pluginRoot: string, body: string): string {
  const abs = path.resolve(pluginRoot).split(path.sep).join("/");
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
  // Substitute after parsing so Windows paths remain valid JSON strings.
  return JSON.stringify(
    JSON.parse(raw),
    (_key, value: unknown) =>
      typeof value === "string" ? injectPluginRoot(pluginRoot, value) : value,
    2,
  );
}

/**
 * @param {{ pluginRoot: string; baseDir: string; cwd: string; dryRun: boolean }} ctx
 */
export async function installClaude(ctx: InstallContext): Promise<void> {
  const { pluginRoot, contentRoot, baseDir, dryRun, cwd, isGlobal } = ctx;
  if (dryRun) {
    console.log(`[dry-run] would install Claude Code files into ${baseDir}`);
    return;
  }
  const settingsPath = path.join(baseDir, "settings.json");
  readSettings(settingsPath);
  ensureDir(baseDir);
  copyDir(path.join(contentRoot, "skills"), path.join(baseDir, "skills"));
  copyDir(path.join(contentRoot, "agents"), path.join(baseDir, "agents"));
  copyDir(path.join(contentRoot, "commands"), path.join(baseDir, "commands"));
  if (!isGlobal) {
    copyDir(
      path.join(contentRoot, "templates", "shared", "rules"),
      path.join(baseDir, "rules"),
    );
  }
  const claudeTemplateDir = path.join(contentRoot, "templates", "claude");
  if (fs.existsSync(claudeTemplateDir)) {
    for (const f of fs.readdirSync(claudeTemplateDir)) {
      const dest = path.join(baseDir, f);
      if (!fs.existsSync(dest)) copyFile(path.join(claudeTemplateDir, f), dest);
    }
  }
  const hooks = asRecord(JSON.parse(buildHooksJson(pluginRoot)).hooks);
  writeSettings(
    settingsPath,
    mergeHooks(readSettings(settingsPath), hooks),
    hooks,
  );
  retireManagedFile(path.join(baseDir, "hooks.json"));
  if (!isGlobal && fs.existsSync(path.join(pluginRoot, ".mcp.json"))) {
    const destMcp = path.join(cwd, ".mcp.json");
    if (!fs.existsSync(destMcp))
      copyFile(path.join(pluginRoot, ".mcp.json"), destMcp);
  }
  const pluginJson = path.join(pluginRoot, ".claude-plugin", "plugin.json");
  if (!isGlobal && fs.existsSync(pluginJson)) {
    ensureDir(path.join(cwd, ".claude-plugin"));
    copyFile(pluginJson, path.join(cwd, ".claude-plugin", "plugin.json"));
    const mp = path.join(pluginRoot, ".claude-plugin", "marketplace.json");
    if (fs.existsSync(mp))
      copyFile(mp, path.join(cwd, ".claude-plugin", "marketplace.json"));
  }
}
