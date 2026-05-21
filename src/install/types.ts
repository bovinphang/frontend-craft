import type { RuntimeCapabilities } from "./runtime-capabilities.js";

export interface InstallContext {
  pluginRoot: string;
  cwd: string;
  runtime: string;
  isGlobal: boolean;
  baseDir: string;
  dryRun: boolean;
  force?: boolean;
  capabilities?: RuntimeCapabilities;
  projectFiles?: string[];
}
