#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, printOrWrite, reduceTransitive, toPosix, walkFiles } from "./studio-core.mjs";

const JS_EXTS = [".js", ".jsx", ".mjs", ".cjs"];
const IMPORT_RE = /\bimport\s+(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]|\bexport\s+[^'"]*?\s+from\s+['"]([^'"]+)['"]|\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

export function scanJavaScriptModules(root, extensions = JS_EXTS) {
  return scanModules(root, extensions);
}

export function scanModules(root, extensions) {
  const absRoot = path.resolve(root);
  const files = walkFiles(absRoot, (file) => extensions.includes(path.extname(file)));
  const byBase = new Map();
  const nodes = files.map((file) => {
    const id = toPosix(path.relative(absRoot, file)).replace(/\.[^.]+$/, "");
    byBase.set(path.resolve(file), id);
    return { id, label: id.split("/").pop(), group: id.includes("/") ? id.split("/").slice(0, -1).join("/") : undefined };
  });
  const edges = [];
  for (const file of files) {
    const source = byBase.get(path.resolve(file));
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(IMPORT_RE)) {
      const spec = match[1] ?? match[2] ?? match[3] ?? match[4];
      if (!spec?.startsWith(".")) continue;
      const target = resolveRelative(file, spec, extensions, byBase);
      if (target) edges.push({ source, target });
    }
  }
  return { direction: "LR", nodes, edges: reduceTransitive(nodes, edges) };
}

function resolveRelative(fromFile, spec, extensions, byBase) {
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [base, ...extensions.map((ext) => base + ext), ...extensions.map((ext) => path.join(base, `index${ext}`))];
  for (const candidate of candidates) {
    const id = byBase.get(path.resolve(candidate));
    if (id) return id;
  }
  return null;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const root = args._[0] ?? ".";
  const graph = scanJavaScriptModules(root);
  printOrWrite(`${JSON.stringify(graph, null, 2)}\n`, args.output);
}
