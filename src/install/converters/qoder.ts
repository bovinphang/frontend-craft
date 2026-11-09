import { createFileTools } from "../shared/fs.js";
import path from "node:path";
import fs from "node:fs";
import type { InstallContext } from "../types.js";
import {
  mergeHooks,
  removeExactHooks,
  createSettingsTools,
} from "../shared/settings.js";
const HOOK_SCRIPTS = [
  "fec-security-check.js",
  "fec-format-changed-file.js",
  "fec-run-tests.js",
  "fec-notify.js",
];
/**
 * @param {import('../types.js').InstallContext} ctx
 */
export async function installQoder(ctx: InstallContext): Promise<void> {
  const { pluginRoot, contentRoot, baseDir, dryRun, isGlobal } = ctx;
  if (dryRun && !ctx.session) {
    (ctx.log ?? console.log)(`[dry-run] qoder -> ${baseDir}`);
    return;
  }
  const { ensureDir, copyProductSkills, copyDir } = createFileTools(ctx);
  const { readSettings, writeSettings } = createSettingsTools(
    ctx,
    isGlobal ? qoderHooks(baseDir, false) : {},
  );
  readSettings(path.join(baseDir, "settings.json"));
  ensureDir(baseDir);
  copyProductSkills(
    path.join(contentRoot, "skills"),
    path.join(baseDir, "skills"),
  );
  copyDir(path.join(contentRoot, "commands"), path.join(baseDir, "commands"));
  copyDir(path.join(contentRoot, "agents"), path.join(baseDir, "agents"));
  if (!isGlobal) {
    copyDir(
      path.join(contentRoot, "templates", "shared", "rules"),
      path.join(baseDir, "rules"),
    );
  }
  copyHookScripts(ctx, pluginRoot, path.join(baseDir, "hooks"));
  const ownedHooks = qoderHooks(baseDir, isGlobal);
  const existing = readSettings(path.join(baseDir, "settings.json"));
  writeSettings(
    path.join(baseDir, "settings.json"),
    mergeHooks(
      isGlobal
        ? removeExactHooks(existing, qoderHooks(baseDir, false))
        : existing,
      ownedHooks,
    ),
    ownedHooks,
  );
}
function copyHookScripts(
  ctx: InstallContext,
  pluginRoot: string,
  hooksDir: string,
): void {
  const { ensureDir, copyFile } = createFileTools(ctx);
  ensureDir(hooksDir);
  for (const script of HOOK_SCRIPTS) {
    const src = path.join(pluginRoot, "dist", "hooks", script);
    if (!fs.existsSync(src)) {
      throw new Error(
        `Missing built hook script: ${src}. Run "npm run build" before installing.`,
      );
    }
    copyFile(src, path.join(hooksDir, script));
  }
}
function qoderHooks(
  baseDir: string,
  isGlobal: boolean,
): Record<string, unknown> {
  const hookPath = (name: string) =>
    isGlobal
      ? path.resolve(baseDir, "hooks", name).split(path.sep).join("/")
      : `.qoder/hooks/${name}`;
  return {
    PreToolUse: [
      qoderHook(
        "Bash|Shell",
        hookPath("fec-security-check.js"),
        "Checking command safety...",
      ),
    ],
    PostToolUse: [
      qoderHook(
        "Write|Edit|MultiEdit",
        hookPath("fec-format-changed-file.js"),
        "Running formatter...",
      ),
    ],
    Stop: [
      qoderHook(
        ".*",
        hookPath("fec-run-tests.js"),
        "Running final validation...",
      ),
    ],
    Notification: [qoderHook(".*", hookPath("fec-notify.js"))],
  };
}
function qoderHook(
  matcher: string,
  scriptPath: string,
  statusMessage?: string,
): Record<string, unknown> {
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
