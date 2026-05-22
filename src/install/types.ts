import type { RuntimeCapabilities } from "./runtime-capabilities.js";

export interface InstallContext {
  pluginRoot: string;
  cwd: string;
  runtime: string;
  isGlobal: boolean;
  baseDir: string;
  dryRun: boolean;
  mode: "install" | "update";
  force?: boolean;
  capabilities?: RuntimeCapabilities;
  projectFiles?: string[];
}
