import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function resolvePluginRoot(fromUrl: string = import.meta.url): string {
  let dir = path.dirname(fileURLToPath(fromUrl));
  while (true) {
    if (fs.existsSync(path.join(dir, "package.json")) && fs.existsSync(path.join(dir, "skills"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(path.dirname(fileURLToPath(fromUrl)), "../..");
    dir = parent;
  }
}
