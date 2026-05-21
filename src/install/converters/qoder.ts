import path from "node:path";
import fs from "node:fs";
import { copyDir, copyFile, ensureDir, readUtf8, writeUtf8 } from "../shared/fs.js";

const HOOK_SCRIPTS = ["security-check.js", "format-changed-file.js", "run-tests.js", "notify.js"];

/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installQoder(ctx) {
  const { pluginRoot, baseDir, dryRun } = ctx;
  if (dryRun) {
    console.log(`[dry-run] qoder -> ${baseDir}`);
    return;
  }

  ensureDir(baseDir);
  copyDir(path.join(pluginRoot, "skills"), path.join(baseDir, "skills"));
  copyDir(path.join(pluginRoot, "commands"), path.join(baseDir, "commands"));
  copyDir(path.join(pluginRoot, "agents"), path.join(baseDir, "agents"));
  copyDir(path.join(pluginRoot, "templates", "shared", "rules"), path.join(baseDir, "rules"));
  copyHookScripts(pluginRoot, path.join(baseDir, "hooks"));
  writeUtf8(path.join(baseDir, "settings.json"), JSON.stringify(mergeQoderSettings(baseDir), null, 2) + "\n");
}

function copyHookScripts(pluginRoot: string, hooksDir: string): void {
  ensureDir(hooksDir);
  for (const script of HOOK_SCRIPTS) {
    const src = path.join(pluginRoot, "dist", "scripts", script);
    if (fs.existsSync(src)) {
      copyFile(src, path.join(hooksDir, script));
    }
  }
}

function mergeQoderSettings(baseDir: string): Record<string, unknown> {
  const settingsPath = path.join(baseDir, "settings.json");
  const existing = readExistingSettings(settingsPath);
  return {
    ...existing,
    hooks: {
      ...asRecord(existing.hooks),
      PreToolUse: [
        ...asArray(asRecord(existing.hooks).PreToolUse),
        qoderHook("Bash|Shell", ".qoder/hooks/security-check.js", "Checking command safety..."),
      ],
      PostToolUse: [
        ...asArray(asRecord(existing.hooks).PostToolUse),
        qoderHook("Write|Edit|MultiEdit", ".qoder/hooks/format-changed-file.js", "Running formatter..."),
      ],
      Stop: [
        ...asArray(asRecord(existing.hooks).Stop),
        qoderHook(".*", ".qoder/hooks/run-tests.js", "Running final validation..."),
      ],
      Notification: [
        ...asArray(asRecord(existing.hooks).Notification),
        qoderHook(".*", ".qoder/hooks/notify.js"),
      ],
    },
  };
}

function readExistingSettings(settingsPath: string): Record<string, unknown> {
  if (!fs.existsSync(settingsPath)) return {};
  try {
    const parsed = JSON.parse(readUtf8(settingsPath));
    return asRecord(parsed);
  } catch {
    return {};
  }
}

function qoderHook(matcher: string, scriptPath: string, statusMessage?: string): Record<string, unknown> {
  return {
    matcher,
    hooks: [
      {
        type: "command",
        command: `node "${scriptPath}"`,
        ...(statusMessage ? { statusMessage } : {}),
      },
    ],
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}
