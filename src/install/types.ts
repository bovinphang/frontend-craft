import type { RuntimeCapabilities } from "./runtime-capabilities.js";
import type { InstallLanguage } from "./language.js";
import type { InstallSession } from "@bovinphang/craft-common";

export interface InstallContext {
  log?: (text: string) => void;
  session?: InstallSession;
  home?: string;
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
