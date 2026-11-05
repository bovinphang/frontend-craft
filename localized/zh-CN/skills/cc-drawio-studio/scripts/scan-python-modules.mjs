#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs, printOrWrite, reduceTransitive, toPosix, walkFiles } from "./studio-core.mjs";

export function scanPythonModules(root) {
  const absRoot = path.resolve(root);
  const files = walkFiles(absRoot, (file) => file.endsWith(".py"));
  const moduleByFile = new Map();
  const nodes = files.map((file) => {
    const rel = toPosix(path.relative(absRoot, file));
    const id = rel.replace(/\/__init__\.py$/, "").replace(/\.py$/, "").replaceAll("/", ".");
    moduleByFile.set(file, id || path.basename(absRoot));
    return { id: id || path.basename(absRoot), label: path.basename(id || absRoot), group: id.includes(".") ? id.split(".").slice(0, -1).join(".") : undefined };
  });
  const ids = new Set(nodes.map((node) => node.id));
  const edges = [];
  for (const file of files) {
    const source = moduleByFile.get(file);
    const text = fs.readFileSync(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const importMatch = line.match(/^\s*import\s+(.+)/);
      if (importMatch) {
        for (const item of importMatch[1].split(",")) addEdge(source, item.trim().split(/\s+as\s+/)[0], ids, edges);
      }
      const fromMatch = line.match(/^\s*from\s+([.\w]+)\s+import\s+(.+)/);
      if (fromMatch) addEdge(source, resolveFromImport(source, fromMatch[1]), ids, edges);
    }
  }
  return { direction: "LR", nodes, edges: reduceTransitive(nodes, edges) };
}

function addEdge(source, target, ids, edges) {
  if (!target) return;
  const parts = target.split(".");
  while (parts.length) {
    const candidate = parts.join(".");
    if (ids.has(candidate)) {
      edges.push({ source, target: candidate });
      return;
    }
    parts.pop();
  }
}

function resolveFromImport(source, spec) {
  if (!spec.startsWith(".")) return spec;
  const dots = spec.match(/^\.+/)?.[0].length ?? 0;
  const suffix = spec.slice(dots);
  const base = source.split(".").slice(0, Math.max(0, source.split(".").length - dots));
  return [...base, suffix].filter(Boolean).join(".");
}

const args = parseArgs(process.argv.slice(2));
printOrWrite(`${JSON.stringify(scanPythonModules(args._[0] ?? "."), null, 2)}\n`, args.output);
