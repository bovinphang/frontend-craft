#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { formatResult, parseArgs, skillDir } from "./studio-core.mjs";

const INDEX = path.join(skillDir, "data", "shape-index.json");
const ALIASES = new Map([
  ["亚马逊", "aws"],
  ["阿里云", "alibaba cloud"],
  ["微软云", "azure"],
  ["谷歌云", "gcp"],
  ["云", "cloud"],
  ["数据库", "database"],
  ["队列", "queue"],
  ["网关", "gateway"],
  ["服务", "service"],
  ["用户", "user"],
  ["角色", "actor"],
  ["流程", "flowchart"],
  ["容器", "container"],
  ["网络", "network"],
  ["交换机", "switch"],
  ["路由器", "router"],
  ["函数", "lambda"],
  ["对象存储", "storage"],
  ["消息", "message"],
]);

export function loadShapes() {
  return JSON.parse(fs.readFileSync(INDEX).toString("utf8"));
}

export function queryShapes(shapes, query, options = {}) {
  const terms = expandTerms(query);
  const category = options.category
    ? String(options.category).toLowerCase()
    : "";
  const scored = [];
  for (const [index, shape] of shapes.entries()) {
    const haystack =
      `${shape.title ?? ""} ${shape.tags ?? ""} ${shape.style ?? ""}`.toLowerCase();
    if (category && !haystack.includes(category)) continue;
    let score = 0;
    const title = String(shape.title ?? "").toLowerCase();
    const tags = String(shape.tags ?? "").toLowerCase();
    for (const term of terms) {
      if (title === term) score += 80;
      else if (title.includes(term)) score += 45;
      if (tags.split(/\s+/).includes(term)) score += 30;
      else if (tags.includes(term)) score += 12;
      if (fuzzyContains(haystack, term)) score += 4;
    }
    if (score > 0)
      scored.push({
        index,
        score,
        titleHits: terms.filter((term) => title.includes(term)).length,
        shape,
      });
  }
  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.titleHits - a.titleHits ||
        String(a.shape.title).localeCompare(String(b.shape.title)) ||
        a.index - b.index,
    )
    .slice(0, Number(options.limit ?? 10))
    .map(({ shape, score }) => ({
      title: shape.title,
      w: shape.w,
      h: shape.h,
      style: shape.style,
      score,
    }));
}

function expandTerms(query) {
  const normalized = String(query ?? "").toLowerCase();
  const raw = normalized.match(/[\p{L}\p{N}._-]+/gu) ?? [];
  const expanded = [];
  for (const term of raw) {
    expanded.push(ALIASES.get(term) ?? term);
    if (term.includes("-")) expanded.push(...term.split("-"));
  }
  return [
    ...new Set(
      expanded.join(" ").match(/[a-z0-9._-]+|[\u4e00-\u9fff]+/g) ?? [],
    ),
  ].filter((term) => term.length >= 2);
}

function fuzzyContains(text, term) {
  if (term.length < 4) return false;
  let cursor = 0;
  for (const ch of text) {
    if (ch === term[cursor]) cursor += 1;
    if (cursor === term.length) return true;
  }
  return false;
}

const args = parseArgs(process.argv.slice(2));
const query = args._.join(" ");
if (!query) {
  console.error(
    "usage: node shape-query.mjs <keywords> [--limit 10] [--category aws] [--format markdown|json]",
  );
  process.exit(2);
}
const results = queryShapes(loadShapes(), query, args);
if (results.length === 0) {
  console.error(`no shapes matched ${JSON.stringify(query)}`);
  process.exit(1);
}
if ((args.format ?? (args.json ? "json" : "markdown")) === "json") {
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
} else {
  process.stdout.write(formatResult({ title: "Shape Query", query, results }));
}
