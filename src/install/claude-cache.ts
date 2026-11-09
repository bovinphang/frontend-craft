import { createClaudeCacheManager } from "@bovinphang/craft-common";
export {
  renderClaudeInstallSourceReport,
  renderClaudeCacheReport,
  renderClaudeCacheCleanupResult,
} from "@bovinphang/craft-common";
export type {
  ClaudeCacheEntry,
  ClaudeCacheReport,
  ClaudeCacheCleanupResult,
  ClaudeNativeInstall,
  ClaudeCliInstall,
  ClaudeInstallSourceReport,
} from "@bovinphang/craft-common";
const manager = createClaudeCacheManager({
  pluginName: "frontend-craft",
  manifestFilename: "frontend-craft.manifest.json",
});
export const {
  getClaudeCacheReport: getClaudeFrontendCraftCacheReport,
  cleanupClaudeCache: cleanupClaudeFrontendCraftCache,
  getClaudeInstallSourceReport,
  getClaudeConfigDir,
} = manager;
