import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  readContentCatalog,
  readMethodResource,
  type MethodName,
  type InstallLanguage,
} from "@bovinphang/craft-common";
import { hashContent } from "../src/install/shared/fs.js";
import type { CommonContentLock } from "../src/install/shared/common-content.js";

function snapshotPath(root: string, relative: string): string {
  if (
    !relative ||
    path.isAbsolute(relative) ||
    relative.includes("\\") ||
    relative.split("/").some((part) => !part || part === "." || part === "..")
  )
    throw new Error(`公共内容路径越界：${relative}`);
  let file = path.resolve(root);
  for (const part of relative.split("/")) {
    file = path.join(file, part);
    try {
      if (fs.lstatSync(file).isSymbolicLink())
        throw new Error(`公共快照不允许符号链接：${relative}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  return file;
}
const mixedIndex = (relative: string): boolean =>
  /^(?:localized\/zh-CN\/)?skills\/(?:metadata|relations|eval_queries)\.json$/.test(
    relative,
  );
const generatedResource = (relative: string): boolean =>
  /^(?:localized\/zh-CN\/)?skills\/cc-[a-z0-9-]+\/.+/.test(relative) ||
  /^(?:localized\/zh-CN\/)?skills\/(?:fec-doc-sync|fec-debug-framework|fec-refactoring|fec-tdd-workflow)\/references\/common\/(?:doc-sync|debug|refactoring|tdd)\.md$/.test(
    relative,
  ) ||
  /^(?:localized\/zh-CN\/)?templates\/shared\/rules\/references\/common\/source-driven-development\.md$/.test(
    relative,
  ) ||
  /^(?:localized\/zh-CN\/)?skills\/fec-image-generation\/(?:scripts\/(?:png-qa|diagram-layout)\.mjs|references\/png-qa-autofix\.md)$/.test(
    relative,
  );

export function syncCommonContent({
  productRoot,
  commonRoot,
  check,
}: {
  productRoot: string;
  commonRoot: string;
  check: boolean;
}): void {
  if (!fs.existsSync(path.join(commonRoot, "package.json")))
    throw new Error(`公共内容来源不存在：${commonRoot}`);
  const generated = new Map<string, Buffer>();
  const catalogs = {} as CommonContentLock["catalogs"];
  const methods: Array<[string, MethodName]> = [
    ["fec-doc-sync", "doc-sync"],
    ["fec-debug-framework", "debug"],
    ["fec-refactoring", "refactoring"],
    ["fec-tdd-workflow", "tdd"],
  ];
  for (const language of [
    "en",
    "zh-CN",
  ] as const satisfies readonly InstallLanguage[]) {
    const catalog = readContentCatalog(commonRoot, language);
    const { root: sourceRoot, ...locked } = catalog;
    catalogs[language] = locked;
    const prefix = language === "en" ? "" : `localized/${language}/`;
    for (const skill of catalog.skills)
      for (const file of skill.files) {
        const relative = `skills/${skill.id}/${file.relativePath}`;
        generated.set(
          prefix + relative,
          fs.readFileSync(path.join(sourceRoot, relative)),
        );
      }
    for (const [id, method] of methods)
      generated.set(
        `${prefix}skills/${id}/references/common/${method}.md`,
        readMethodResource(commonRoot, method, language),
      );
    generated.set(
      `${prefix}templates/shared/rules/references/common/source-driven-development.md`,
      readMethodResource(commonRoot, "source-driven-development", language),
    );
    for (const file of ["png-qa.mjs", "diagram-layout.mjs"])
      generated.set(
        `${prefix}skills/fec-image-generation/scripts/${file}`,
        fs.readFileSync(
          path.join(sourceRoot, "skills/cc-technical-diagrams/scripts", file),
        ),
      );
    generated.set(
      `${prefix}skills/fec-image-generation/references/png-qa-autofix.md`,
      fs.readFileSync(
        path.join(
          sourceRoot,
          "skills/cc-technical-diagrams/references/png-qa-autofix.md",
        ),
      ),
    );
    for (const name of ["metadata", "relations", "eval_queries"]) {
      const destination = snapshotPath(
        productRoot,
        `${prefix}skills/${name}.json`,
      );
      const original: unknown = fs.existsSync(destination)
        ? JSON.parse(fs.readFileSync(destination, "utf8"))
        : name === "metadata"
          ? []
          : {};
      const common: unknown = JSON.parse(
        fs.readFileSync(
          path.join(sourceRoot, "skills", `${name}.json`),
          "utf8",
        ),
      );
      const retired = new Set([
        "fec-drawio-studio",
        "fec-source-driven-development",
      ]);
      let merged: unknown;
      if (name === "metadata") {
        const frontend = (original as Array<{ id: string }>).filter(
          (item) => !item.id.startsWith("cc-") && !retired.has(item.id),
        );
        merged = [...frontend, ...(common as Array<{ id: string }>)].sort(
          (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
        );
      } else {
        const frontend = Object.fromEntries(
          Object.entries(original as Record<string, unknown>).filter(
            ([id]) => !id.startsWith("cc-") && !retired.has(id),
          ),
        );
        const rewritten = JSON.parse(
          JSON.stringify(frontend)
            .replaceAll("fec-drawio-studio", "cc-drawio-studio")
            .replaceAll(
              "fec-source-driven-development",
              "cc-source-driven-development",
            ),
        ) as Record<string, unknown>;
        merged = Object.fromEntries(
          Object.entries({
            ...rewritten,
            ...(common as Record<string, unknown>),
          }).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
        );
      }
      generated.set(
        `${prefix}skills/${name}.json`,
        Buffer.from(`${JSON.stringify(merged, null, 2)}\n`),
      );
    }
  }
  const files = [...generated]
    .map(([relativePath, content]) => ({
      relativePath,
      hash: hashContent(content),
    }))
    .sort((a, b) =>
      a.relativePath < b.relativePath
        ? -1
        : a.relativePath > b.relativePath
          ? 1
          : 0,
    );
  const lock: CommonContentLock = {
    schemaVersion: 1,
    packageName: "@bovinphang/craft-common",
    packageVersion: catalogs.en.packageVersion,
    catalogs,
    files,
  };
  const lockBody = `${JSON.stringify(lock, null, 2)}\n`;
  const lockPath = snapshotPath(productRoot, "common-content.lock.json");
  const previous = fs.existsSync(lockPath)
    ? (JSON.parse(fs.readFileSync(lockPath, "utf8")) as CommonContentLock)
    : undefined;
  if (
    previous &&
    (previous.schemaVersion !== 1 || !Array.isArray(previous.files))
  )
    throw new Error("公共内容锁无效");
  const owned = new Map<string, string>();
  for (const file of previous?.files ?? []) {
    snapshotPath(productRoot, file.relativePath);
    if (
      (!generatedResource(file.relativePath) &&
        !mixedIndex(file.relativePath)) ||
      !/^[a-f0-9]{64}$/.test(file.hash) ||
      owned.has(file.relativePath)
    )
      throw new Error(`公共内容锁路径或摘要无效：${file.relativePath}`);
    owned.set(file.relativePath, file.hash);
  }
  const actual = new Set<string>();
  const directories: string[] = [];
  const collect = (relative: string): void => {
    const file = snapshotPath(productRoot, relative),
      stat = fs.lstatSync(file);
    if (stat.isDirectory()) {
      directories.push(relative);
      for (const name of fs.readdirSync(file)) collect(`${relative}/${name}`);
    } else if (stat.isFile()) actual.add(relative);
    else throw new Error(`公共快照包含异常节点：${relative}`);
  };
  for (const prefix of ["", "localized/zh-CN/"]) {
    const directory = snapshotPath(productRoot, `${prefix}skills`);
    if (fs.existsSync(directory))
      for (const name of fs.readdirSync(directory)) {
        if (name.startsWith("cc-")) collect(`${prefix}skills/${name}`);
      }
  }
  for (const relative of actual)
    if (!owned.has(relative))
      throw new Error(`公共快照包含未知额外文件：${relative}`);
  const obsolete: string[] = [];
  for (const [relative, expectedHash] of owned) {
    const file = snapshotPath(productRoot, relative);
    if (
      !mixedIndex(relative) &&
      fs.existsSync(file) &&
      hashContent(fs.readFileSync(file)) !== expectedHash
    )
      throw new Error(`公共内容发生修改：${relative}`);
    if (!generated.has(relative) && fs.existsSync(file))
      obsolete.push(relative);
  }
  for (const relative of generated.keys()) snapshotPath(productRoot, relative);
  if (check) {
    if (obsolete.length)
      throw new Error(`公共内容存在过期漂移：${obsolete.join(", ")}`);
    if (
      !fs.existsSync(lockPath) ||
      fs.readFileSync(lockPath, "utf8") !== lockBody
    )
      throw new Error("公共内容锁发生漂移，请运行 sync:common");
    for (const file of files) {
      const dest = path.join(productRoot, file.relativePath);
      if (
        !fs.existsSync(dest) ||
        hashContent(fs.readFileSync(dest)) !== file.hash
      )
        throw new Error(`公共内容发生漂移或修改：${file.relativePath}`);
    }
    return;
  }
  for (const relative of obsolete)
    fs.unlinkSync(snapshotPath(productRoot, relative));
  for (const relative of directories.sort((a, b) => b.length - a.length)) {
    const directory = snapshotPath(productRoot, relative);
    if (!fs.readdirSync(directory).length) fs.rmdirSync(directory);
  }
  for (const [relative, body] of generated) {
    const dest = path.join(productRoot, relative);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, body);
  }
  fs.writeFileSync(lockPath, lockBody);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  const rootIndex = args.indexOf("--common-root");
  const commonRoot =
    rootIndex < 0
      ? path.resolve(
          path.dirname(
            fileURLToPath(import.meta.resolve("@bovinphang/craft-common")),
          ),
          "..",
        )
      : args[rootIndex + 1];
  if (!commonRoot) throw new Error("--common-root 需要包目录");
  syncCommonContent({
    productRoot: path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
    ),
    commonRoot,
    check: args.includes("--check"),
  });
  console.log(
    args.includes("--check") ? "公共内容快照一致" : "已同步公共内容快照",
  );
}
