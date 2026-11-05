#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs, printOrWrite, reduceTransitive, toPosix, walkFiles } from "./studio-core.mjs";

export function scanGoPackages(root) {
  const absRoot = path.resolve(root);
  const mod = fs.existsSync(path.join(absRoot, "go.mod")) ? fs.readFileSync(path.join(absRoot, "go.mod"), "utf8").match(/^module\s+(.+)$/m)?.[1] : "";
  const files = walkFiles(absRoot, (file) => file.endsWith(".go") && !file.endsWith("_test.go"));
  const packageDirs = [...new Set(files.map((file) => path.dirname(file)))].sort();
  const dirToId = new Map(packageDirs.map((dir) => [dir, mod ? `${mod}/${toPosix(path.relative(absRoot, dir))}`.replace(/\/$/, "") : toPosix(path.relative(absRoot, dir) || ".")]));
  const nodes = [...dirToId.entries()].map(([dir, id]) => ({ id, label: path.basename(dir), group: toPosix(path.dirname(path.relative(absRoot, dir))).replace(".", "") || undefined }));
  const ids = new Set(nodes.map((node) => node.id));
  const edges = [];
  for (const file of files) {
    const source = dirToId.get(path.dirname(file));
    const text = fs.readFileSync(file, "utf8");
    for (const spec of extractGoImports(text)) if (ids.has(spec)) edges.push({ source, target: spec });
  }
  return { direction: "LR", nodes, edges: reduceTransitive(nodes, edges) };
}

function extractGoImports(text) {
  const out = [];
  for (const match of text.matchAll(/import\s+(?:[._A-Za-z]\w*\s+)?(?:"([^"]+)"|\(([\s\S]*?)\))/g)) {
    if (match[1]) out.push(match[1]);
    if (match[2]) for (const line of match[2].split(/\r?\n/)) {
      const item = line.match(/"([^"]+)"/)?.[1];
      if (item) out.push(item);
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
printOrWrite(`${JSON.stringify(scanGoPackages(args._[0] ?? "."), null, 2)}\n`, args.output);
