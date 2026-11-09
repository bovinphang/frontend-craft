import type { InstallContext } from "./types.js";
import os from "node:os";
import { resolveRuntimeTargets } from "@bovinphang/craft-common";
import { RUNTIME_CAPABILITIES } from "./runtime-capabilities.js";
export function getRuntimeSkillsTarget(
  ctx: InstallContext,
): string | undefined {
  if (!(ctx.capabilities ?? RUNTIME_CAPABILITIES[ctx.runtime])?.skills) return;
  return resolveRuntimeTargets({
    runtime: ctx.runtime,
    cwd: ctx.cwd,
    home: ctx.home ?? os.homedir(),
    baseDir: ctx.baseDir,
    scope: ctx.isGlobal ? "global" : "local",
    env: {},
    compatibility: "frontend",
  }).skillsDir;
}
