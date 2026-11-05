#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const scriptDir = path.dirname(fileURLToPath(import.meta.url));
export const skillDir = path.resolve(scriptDir, "..");

export function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export function writeText(filePath, body) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
  fs.writeFileSync(filePath, body, "utf8");
}

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }
    const [rawKey, inline] = token.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    if (inline !== undefined) {
      args[key] = inline;
    } else if (argv[i + 1] && !argv[i + 1].startsWith("--")) {
      args[key] = argv[i + 1];
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

export function formatResult(result, format = "markdown") {
  if (format === "json") return `${JSON.stringify(result, null, 2)}\n`;
  const lines = [`# ${result.title ?? "Drawio Studio Result"}`, ""];
  for (const [key, value] of Object.entries(result)) {
    if (key === "title") continue;
    if (Array.isArray(value)) {
      lines.push(`## ${label(key)}`, "");
      if (value.length === 0) lines.push("- None");
      else for (const item of value) lines.push(`- ${typeof item === "string" ? item : JSON.stringify(item)}`);
      lines.push("");
    } else if (value && typeof value === "object") {
      lines.push(`## ${label(key)}`, "", "```json", JSON.stringify(value, null, 2), "```", "");
    } else {
      lines.push(`- ${label(key)}: ${String(value)}`);
    }
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

export function label(value) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (ch) => ch.toUpperCase());
}

export function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function snap(value, grid = 10) {
  return Math.round(value / grid) * grid;
}

export function walkFiles(root, predicate) {
  const out = [];
  const skip = new Set([".git", "node_modules", "dist", "target", "vendor", ".next", ".nuxt", "coverage"]);
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (!predicate || predicate(full)) out.push(full);
    }
  }
  visit(path.resolve(root));
  return out.sort();
}

export function toPosix(value) {
  return value.split(path.sep).join("/");
}

export function commonPrefix(values) {
  if (values.length === 0) return "";
  let prefix = values[0];
  for (const value of values.slice(1)) {
    while (prefix && !value.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix.replace(/[^/]*$/, "");
}

export function reduceTransitive(nodes, edges) {
  const ids = new Set(nodes.map((node) => node.id));
  const unique = [];
  const seen = new Set();
  for (const edge of edges) {
    if (!ids.has(edge.source) || !ids.has(edge.target) || edge.source === edge.target) continue;
    const key = `${edge.source}\0${edge.target}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push({ source: edge.source, target: edge.target });
    }
  }
  const adjacency = new Map();
  for (const edge of unique) {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
    adjacency.get(edge.source).add(edge.target);
  }
  return unique.filter((edge) => !hasAlternatePath(edge.source, edge.target, adjacency, edge));
}

function hasAlternatePath(source, target, adjacency, skipped) {
  const stack = [...(adjacency.get(source) ?? [])].filter((next) => !(source === skipped.source && next === skipped.target));
  const seen = new Set();
  while (stack.length) {
    const next = stack.pop();
    if (next === target) return true;
    if (!next || seen.has(next)) continue;
    seen.add(next);
    for (const child of adjacency.get(next) ?? []) stack.push(child);
  }
  return false;
}

export function printOrWrite(body, output) {
  if (output) writeText(output, body);
  else process.stdout.write(body);
}
