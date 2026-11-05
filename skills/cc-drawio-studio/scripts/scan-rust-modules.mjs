#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs, printOrWrite, reduceTransitive, toPosix, walkFiles } from "./studio-core.mjs";

export function scanRustModules(root) {
  const srcRoot = fs.existsSync(path.join(root, "src")) ? path.join(root, "src") : root;
  const absRoot = path.resolve(srcRoot);
  const files = walkFiles(absRoot, (file) => file.endsWith(".rs"));
  const fileToId = new Map();
  const nodes = files.map((file) => {
    let id = toPosix(path.relative(absRoot, file)).replace(/\.rs$/, "").replace(/\/mod$/, "").replace(/^(lib|main)$/, "crate").replaceAll("/", "::");
    fileToId.set(file, id);
    return { id, label: id.split("::").pop(), group: id.includes("::") ? id.split("::").slice(0, -1).join("::") : undefined };
  });
  const ids = new Set(nodes.map((node) => node.id));
  const edges = [];
  for (const file of files) {
    const source = fileToId.get(file);
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/\buse\s+(crate|self|super)::([^;{]+)[;{]/g)) {
      const target = match[2].split("::").filter(Boolean)[0];
      const candidates = [...ids].filter((id) => id === target || id.endsWith(`::${target}`));
      if (candidates[0]) edges.push({ source, target: candidates[0] });
    }
    for (const match of text.matchAll(/\bmod\s+([A-Za-z_]\w*)\s*;/g)) {
      const candidates = [...ids].filter((id) => id === match[1] || id.endsWith(`::${match[1]}`));
      if (candidates[0]) edges.push({ source, target: candidates[0] });
    }
  }
  return { direction: "LR", nodes, edges: reduceTransitive(nodes, edges) };
}

const args = parseArgs(process.argv.slice(2));
printOrWrite(`${JSON.stringify(scanRustModules(args._[0] ?? "."), null, 2)}\n`, args.output);
