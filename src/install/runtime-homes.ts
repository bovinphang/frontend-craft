import os from "node:os";
import path from "node:path";
import {
  resolveRuntimeTargets,
  RUNTIME_DESCRIPTORS,
} from "@bovinphang/craft-common";
export function getGlobalConfigDir(runtime: string): string {
  return resolveRuntimeTargets({
    runtime,
    cwd: process.cwd(),
    home: os.homedir(),
    scope: "global",
    env: process.env,
    compatibility: "frontend",
  }).baseDir;
}
export const LOCAL_DIR: Record<string, string> = Object.fromEntries(
  Object.entries(RUNTIME_DESCRIPTORS).map(([id, descriptor]) => [
    id,
    descriptor.localDirectory,
  ]),
);
export function getInstallBaseDir({
  runtime,
  isGlobal,
  cwd,
}: {
  runtime: string;
  isGlobal: boolean;
  cwd: string;
}): string {
  return resolveRuntimeTargets({
    runtime,
    cwd,
    home: os.homedir(),
    scope: isGlobal ? "global" : "local",
    env: process.env,
    compatibility: "frontend",
  }).baseDir;
}
export function getLegacyGlobalConfigDirs(runtime: string): string[] {
  if (runtime === "antigravity" && !process.env.ANTIGRAVITY_CONFIG_DIR)
    return [path.join(os.homedir(), ".gemini", "antigravity")];
  if (runtime === "cline" && !process.env.CLINE_CONFIG_DIR)
    return [path.join(os.homedir(), ".cline")];
  return [];
}
