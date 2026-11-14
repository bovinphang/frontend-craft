import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SNAPSHOT_DECLARATIONS } from "../src/install/shared/snapshot-declarations.js";
import { syncCommonContent } from "./sync-common.js";

export function installedCommonRoot(): string {
  return path.resolve(
    path.dirname(
      fileURLToPath(import.meta.resolve("@bovinphang/craft-common")),
    ),
    "..",
  );
}

export function checkSourceContent(sourceRoot: string): void {
  if (fs.existsSync(path.join(sourceRoot, "common-content.lock.json")))
    throw new Error("来源锁只能存在于组合目录");
  for (const prefix of ["", "localized/zh-CN/"]) {
    const skills = path.join(sourceRoot, prefix, "skills");
    if (
      fs.existsSync(skills) &&
      fs.readdirSync(skills).some((name) => name.startsWith("cc-"))
    )
      throw new Error("源码不允许包含公共生成目录");
    for (const item of [
      ...SNAPSHOT_DECLARATIONS.domainMethods,
      ...SNAPSHOT_DECLARATIONS.extraResources,
    ])
      if (fs.existsSync(path.join(sourceRoot, prefix, item.target)))
        throw new Error(`源码包含公共生成资源：${prefix}${item.target}`);
    for (const name of ["metadata", "relations", "eval_queries"]) {
      const file = path.join(skills, name + ".json");
      if (!fs.existsSync(file)) continue;
      const value = JSON.parse(fs.readFileSync(file, "utf8"));
      const ids: string[] = Array.isArray(value)
        ? value.map((item) => item.id)
        : Object.keys(value);
      if (ids.some((id) => id.startsWith("cc-")))
        throw new Error(`源码索引包含公共条目：${file}`);
    }
  }
}

export function prepareContent(input: {
  sourceRoot: string;
  commonRoot?: string;
}): string {
  const sourceRoot = path.resolve(input.sourceRoot);
  checkSourceContent(sourceRoot);
  const commonRoot = input.commonRoot ?? installedCommonRoot();
  const pkg = JSON.parse(
    fs.readFileSync(path.join(sourceRoot, "package.json"), "utf8"),
  );
  const common = JSON.parse(
    fs.readFileSync(path.join(commonRoot, "package.json"), "utf8"),
  );
  if (
    common.name !== "@bovinphang/craft-common" ||
    pkg.dependencies?.[common.name] !== common.version
  )
    throw new Error("公共来源包名或精确版本不匹配");
  const dist = path.join(sourceRoot, "dist");
  fs.mkdirSync(dist, { recursive: true });
  if (fs.lstatSync(dist).isSymbolicLink())
    throw new Error("生成目录不允许符号链接");
  const output = path.join(dist, "package");
  if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink())
    throw new Error("生成目录不允许符号链接");
  const backup = path.join(dist, ".package-previous");
  if (fs.existsSync(backup))
    throw new Error("存在上次组合备份，请检查 dist/.package-previous");
  const lockPath = path.join(dist, ".content.lock");
  const lock = fs.openSync(lockPath, "wx");
  let temporary: string | undefined;
  try {
    temporary = fs.mkdtempSync(path.join(dist, ".content-"));
    for (const name of pkg.files as string[]) {
      if (
        name === "dist" ||
        name.startsWith("dist/") ||
        name === "common-content.lock.json"
      )
        continue;
      if (path.isAbsolute(name) || name.split(/[\\/]/).includes(".."))
        throw new Error("分发路径越界");
      const from = path.join(sourceRoot, name);
      if (fs.existsSync(from))
        fs.cpSync(from, path.join(temporary, name), {
          recursive: true,
          filter: (file) => {
            if (fs.lstatSync(file).isSymbolicLink())
              throw new Error("源码资源不允许符号链接");
            return true;
          },
        });
    }
    if (fs.existsSync(path.join(output, "dist")))
      fs.cpSync(path.join(output, "dist"), path.join(temporary, "dist"), {
        recursive: true,
      });
    const {
      scripts: _scripts,
      devDependencies: _devDependencies,
      ...distribution
    } = pkg;
    fs.writeFileSync(
      path.join(temporary, "package.json"),
      JSON.stringify(distribution, null, 2) + "\n",
    );
    syncCommonContent({ productRoot: temporary, commonRoot, check: false });
    syncCommonContent({ productRoot: temporary, commonRoot, check: true });
    if (fs.existsSync(output)) fs.renameSync(output, backup);
    try {
      fs.renameSync(temporary, output);
    } catch (error) {
      if (fs.existsSync(backup)) fs.renameSync(backup, output);
      throw error;
    }
    fs.rmSync(backup, { recursive: true, force: true });
    return output;
  } finally {
    try {
      if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
    } finally {
      fs.closeSync(lock);
      fs.unlinkSync(lockPath);
    }
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const index = process.argv.indexOf("--common-root");
  if (index >= 0 && !process.argv[index + 1])
    throw new Error("--common-root 需要包目录");
  prepareContent({
    sourceRoot: path.resolve(import.meta.dirname, ".."),
    commonRoot: index >= 0 ? path.resolve(process.argv[index + 1]) : undefined,
  });
}
