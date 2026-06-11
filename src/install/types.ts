import type { RuntimeCapabilities } from "./runtime-capabilities.js";
import type { InstallLanguage } from "./language.js";

export interface InstallContext {
  pluginRoot: string;
  contentRoot: string;
  cwd: string;
  runtime: string;
  isGlobal: boolean;
  baseDir: string;
  dryRun: boolean;
  mode: "install" | "update";
  language: InstallLanguage;
  force?: boolean;
  capabilities?: RuntimeCapabilities;
  projectFiles?: string[];
}
