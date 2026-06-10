#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs, printOrWrite, reduceTransitive, toPosix, walkFiles } from "./studio-core.mjs";

export function scanPythonClasses(root) {
  const absRoot = path.resolve(root);
  const files = walkFiles(absRoot, (file) => file.endsWith(".py"));
  const classes = [];
  for (const file of files) {
    const moduleId = toPosix(path.relative(absRoot, file)).replace(/\/__init__\.py$/, "").replace(/\.py$/, "").replaceAll("/", ".");
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/^\s*class\s+([A-Za-z_]\w*)\s*(?:\(([^)]*)\))?:/gm)) {
      const id = `${moduleId}.${match[1]}`.replace(/^\./, "");
      classes.push({ id, name: match[1], bases: (match[2] ?? "").split(",").map((item) => item.trim().split(".").pop()).filter(Boolean), moduleId });
    }
  }
  const byName = new Map(classes.map((cls) => [cls.name, cls.id]));
  const nodes = classes.map((cls) => ({ id: cls.id, label: cls.name, group: cls.moduleId }));
  const edges = [];
  for (const cls of classes) {
    for (const base of cls.bases) {
      if (byName.has(base)) edges.push({ source: cls.id, target: byName.get(base) });
    }
  }
  return { direction: "TB", nodes, edges: reduceTransitive(nodes, edges) };
}

const args = parseArgs(process.argv.slice(2));
printOrWrite(`${JSON.stringify(scanPythonClasses(args._[0] ?? "."), null, 2)}\n`, args.output);
