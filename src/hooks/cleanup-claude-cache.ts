import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  cleanupClaudeFrontendCraftCache,
  renderClaudeCacheCleanupResult,
} from "../install/claude-cache.js";

try {
  const currentVersion = readCurrentVersion();
  const result = cleanupClaudeFrontendCraftCache({ currentVersion });
  if (result.deleted.length > 0 || result.warning) {
    console.error(renderClaudeCacheCleanupResult(result, false));
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[frontend-craft] Claude cache cleanup warning: ${message}`);
}

function readCurrentVersion(): string {
  const hookPath = fileURLToPath(import.meta.url);
  const pluginRoot = path.resolve(path.dirname(hookPath), "..", "..");
  const packagePath = path.join(pluginRoot, "package.json");
  const parsed = JSON.parse(fs.readFileSync(packagePath, "utf8")) as { version?: unknown };
  return typeof parsed.version === "string" ? parsed.version : "0.0.0";
}
