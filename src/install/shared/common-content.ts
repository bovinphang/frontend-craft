import type { ContentCatalog } from "@bovinphang/craft-common";
import fs from "node:fs";
import path from "node:path";
import { hashContent } from "./fs.js";
import type { InstallLanguage } from "../language.js";

export type CommonContentLock = {
  schemaVersion: 1;
  packageName: "@bovinphang/craft-common";
  packageVersion: string;
  catalogs: Record<InstallLanguage, Omit<ContentCatalog, "root">>;
  files: Array<{ relativePath: string; hash: string }>;
};
export function readProductCommonCatalog(
  productRoot: string,
  language: InstallLanguage,
): ContentCatalog {
  const lock = JSON.parse(
    fs.readFileSync(path.join(productRoot, "common-content.lock.json"), "utf8"),
  ) as CommonContentLock;
  if (
    lock.schemaVersion !== 1 ||
    lock.packageName !== "@bovinphang/craft-common" ||
    !Array.isArray(lock.files) ||
    !lock.catalogs?.[language]
  )
    throw new Error("公共内容锁结构无效");
  for (const file of lock.files) {
    const target = path.resolve(productRoot, file.relativePath);
    const relative = path.relative(path.resolve(productRoot), target);
    if (
      !relative ||
      relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    )
      throw new Error("公共内容路径越界");
    let current = target;
    while (current !== path.resolve(productRoot)) {
      if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink())
        throw new Error(`公共快照不能使用符号链接：${current}`);
      current = path.dirname(current);
    }
    if (
      !fs.existsSync(target) ||
      hashContent(fs.readFileSync(target)) !== file.hash
    )
      throw new Error(`公共内容哈希不一致或被修改：${file.relativePath}`);
  }
  return {
    ...lock.catalogs[language],
    root:
      language === "en"
        ? productRoot
        : path.join(productRoot, "localized", language),
  };
}
