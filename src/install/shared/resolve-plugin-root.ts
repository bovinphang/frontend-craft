import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function resolveSourceRoot(fromUrl: string = import.meta.url): string {
  let dir = path.dirname(fileURLToPath(fromUrl));
  while (true) {
    if (
      fs.existsSync(path.join(dir, "package.json")) &&
      fs.existsSync(path.join(dir, "skills"))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir)
      return path.resolve(path.dirname(fileURLToPath(fromUrl)), "../..");
    dir = parent;
  }
}

export function resolvePluginRoot(fromUrl: string = import.meta.url): string {
  const root = resolveSourceRoot(fromUrl);
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  );
  if (!pkg.scripts?.["prepare:content"]) return root;
  const content = path.join(root, "dist/package");
  if (!fs.existsSync(path.join(content, "common-content.lock.json")))
    throw new Error("请先运行 pnpm run build 准备完整产品");
  return content;
}
