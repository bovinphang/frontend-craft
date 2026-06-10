#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs, skillDir } from "./studio-core.mjs";

const MANIFEST = path.join(skillDir, "data", "brand-icons.json");
const STYLE_PREFIX = "shape=image;html=1;imageAspect=0;aspect=fixed;verticalLabelPosition=bottom;verticalAlign=top;image=";
const SIMPLE = new Map([
  ["qdrant", "qdrant"], ["milvus", "milvus"], ["supabase", "supabase"], ["redis", "redis"],
  ["postgresql", "postgresql"], ["postgres", "postgresql"], ["mongodb", "mongodb"],
  ["elasticsearch", "elasticsearch"], ["neo4j", "neo4j"], ["kafka", "apachekafka"],
  ["clickhouse", "clickhouse"], ["duckdb", "duckdb"], ["mysql", "mysql"], ["sqlite", "sqlite"],
]);

export function loadFamilies() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const families = new Map();
  for (const icon of manifest.icons) {
    const base = icon.replace(/-(color|text)$/, "");
    if (!families.has(base)) families.set(base, new Set());
    families.get(base).add(icon);
  }
  return { cdn: manifest.cdn, families };
}

export async function queryBrand(query, options = {}) {
  const { cdn, families } = loadFamilies();
  const hits = rankBrands(families, query).slice(0, Number(options.limit ?? 8));
  const size = Number(options.size ?? 48);
  const variant = options.variant ?? "color";
  const results = [];
  for (const brand of hits) {
    const file = pickVariant(brand, families.get(brand), variant);
    const url = `${cdn}${file}.svg`;
    results.push({ brand, file, w: size, h: size, style: STYLE_PREFIX + (options.embed ? await dataUri(url) : url) });
  }
  if (results.length === 0) {
    const slug = SIMPLE.get(squish(query));
    if (slug) {
      const url = `https://cdn.simpleicons.org/${slug}`;
      results.push({ brand: squish(query), file: `simpleicons:${slug}`, w: size, h: size, style: STYLE_PREFIX + (options.embed ? await dataUri(url) : url) });
    }
  }
  return results;
}

function rankBrands(families, query) {
  const needle = squish(query);
  const tokens = String(query).toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const scored = [];
  for (const brand of families.keys()) {
    const base = squish(brand);
    let score = 0;
    if (base === needle) score = 100;
    else if (base.startsWith(needle)) score = 70;
    else if (base.includes(needle) || needle.includes(base)) score = 45;
    for (const token of tokens) {
      if (base === token) score = Math.max(score, 90);
      else if (token.length >= 3 && base.includes(token)) score = Math.max(score, 35);
    }
    if (score > 0) scored.push([brand, score]);
  }
  return scored.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([brand]) => brand);
}

function pickVariant(base, variants, preference) {
  const order = preference === "mono" ? ["", "-color", "-text"] : preference === "text" ? ["-text", "-color", ""] : ["-color", "", "-text"];
  for (const suffix of order) if (variants.has(base + suffix)) return base + suffix;
  return [...variants].sort()[0];
}

function squish(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function dataUri(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`failed to fetch ${url}: ${response.status}`);
  const svg = Buffer.from(await response.arrayBuffer()).toString("base64");
  return `data:image/svg+xml;base64,${svg}`;
}

const args = parseArgs(process.argv.slice(2));
const query = args._.join(" ");
if (!query && !args.list) {
  console.error("usage: node brand-symbols.mjs <brand> [--variant color|mono|text] [--embed] [--json]");
  process.exit(2);
}
if (args.list) {
  process.stdout.write([...loadFamilies().families.keys()].sort().join("\n") + "\n");
} else {
  const results = await queryBrand(query, args);
  if (results.length === 0) {
    console.error(`no brand symbol matched ${JSON.stringify(query)}`);
    process.exit(1);
  }
  if (args.json) process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
  else for (const item of results) process.stdout.write(`${item.brand} (${item.file}, ${item.w}x${item.h})\n  ${item.style.slice(0, 180)}${item.style.length > 180 ? "..." : ""}\n`);
}
