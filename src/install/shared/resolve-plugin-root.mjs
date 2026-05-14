import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve repository / package root (parent of `bin/`).
 * @param {string} [fromUrl] import.meta.url of caller (e.g. cli.mjs)
 */
export function resolvePluginRoot(fromUrl) {
  const here = path.dirname(fileURLToPath(fromUrl));
  // src/install/cli.mjs -> repo root is ../..
  if (path.basename(here) === "install" && path.basename(path.dirname(here)) === "src") {
    return path.resolve(here, "../..");
  }
  // bin/ -> parent
  if (path.basename(here) === "bin") {
    return path.resolve(here, "..");
  }
  return path.resolve(here, "../..");
}
