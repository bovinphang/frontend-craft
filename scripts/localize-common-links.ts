import fs from "node:fs";
import path from "node:path";
import type {
  CommonContentLock,
  SnapshotDeclarations,
} from "@bovinphang/craft-common";

const repository = "https://github.com/bovinphang/craft-common/blob/";
const zh = "localized/zh-CN/";
const commonLink =
  /(\x60+).*?\1(?!\x60)|(?<!\\)\]\((https:\/\/github\.com\/bovinphang\/craft-common\/blob\/([^/\s)]+)\/((?:localized\/zh-CN\/)?(?:methods\/|skills\/cc-)[^#?\s)]+))(?=[#?\s)])/g;

export function localizeCommonLinks(
  root: string,
  declarations: SnapshotDeclarations,
): void {
  const lock = JSON.parse(
    fs.readFileSync(path.join(root, "common-content.lock.json"), "utf8"),
  ) as CommonContentLock;
  const generated = new Set(lock.files.map(({ relativePath }) => relativePath));
  const targetsBySkill = new Map<string, Map<string, string>>();
  for (const { source, target } of [
    ...declarations.domainMethods.map(({ method, target }) => ({
      source: "methods/" + method + ".md",
      target,
    })),
    ...declarations.extraResources,
  ]) {
    if (!target.startsWith("skills/")) continue;
    const skill = target.split("/").slice(0, 2).join("/");
    const targets = targetsBySkill.get(skill) ?? new Map<string, string>();
    targets.set(source, target);
    targetsBySkill.set(skill, targets);
  }

  function visit(
    directory: string,
    resolveTarget: (source: string) => string | undefined,
  ): void {
    const folder = path.join(root, directory);
    if (!fs.existsSync(folder)) return;
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
      const relative = directory + "/" + entry.name;
      if (entry.isDirectory()) {
        visit(relative, resolveTarget);
        continue;
      }
      if (
        !entry.isFile() ||
        !entry.name.endsWith(".md") ||
        generated.has(relative)
      )
        continue;
      const file = path.join(root, relative);
      const body = fs.readFileSync(file, "utf8");
      if (!body.includes(repository)) continue;

      let fence = "";
      const updated = body
        .split("\n")
        .map((line) => {
          const marker = /^ {0,3}([~\x60]{3,})([^\r\n]*)/.exec(line);
          if (fence) {
            if (
              marker &&
              marker[1][0] === fence[0] &&
              marker[1].length >= fence.length &&
              !marker[2].trim()
            )
              fence = "";
            return line;
          }
          if (marker) {
            fence = marker[1];
            return line;
          }
          return line.replace(
            commonLink,
            (match, code, url: string, tag: string, source: string) => {
              if (code) return match;
              const target = resolveTarget(source);
              if (
                tag !== "v" + lock.packageVersion ||
                !target ||
                !generated.has(target) ||
                !fs
                  .statSync(path.join(root, target), { throwIfNoEntry: false })
                  ?.isFile()
              ) {
                throw new Error(
                  "无法解析公共资源链接：" + relative + " -> " + url,
                );
              }
              return (
                "](" + path.posix.relative(path.posix.dirname(relative), target)
              );
            },
          );
        })
        .join("\n");
      if (updated !== body) fs.writeFileSync(file, updated);
    }
  }

  for (const [skill, targets] of targetsBySkill) {
    visit(skill, (source) => targets.get(source));
    visit(zh + skill, (source) => {
      if (!source.startsWith(zh)) return undefined;
      const target = targets.get(source.slice(zh.length));
      return target && zh + target;
    });
  }
  visit("docs", (source) =>
    /^(?:localized\/zh-CN\/)?skills\/cc-/.test(source) ? source : undefined,
  );
}
