import type { InstallContext } from "./types.js";
import path from "node:path";
import os from "node:os";
import { RUNTIME_CAPABILITIES } from "./runtime-capabilities.js";
export function getRuntimeSkillsTarget(
  ctx: InstallContext,
): string | undefined {
  if (!(ctx.capabilities ?? RUNTIME_CAPABILITIES[ctx.runtime])?.skills)
    return undefined;
  if (ctx.runtime === "codex")
    return path.join(
      ctx.isGlobal ? os.homedir() : ctx.cwd,
      ".agents",
      "skills",
    );
  if (ctx.runtime === "openclaw")
    return path.join(ctx.isGlobal ? ctx.baseDir : ctx.cwd, "skills");
  return path.join(ctx.baseDir, "skills");
}
