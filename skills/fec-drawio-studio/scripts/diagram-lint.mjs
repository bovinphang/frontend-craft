#!/usr/bin/env node
import { formatResult, parseArgs, readText } from "./studio-core.mjs";

export function lintDrawio(xml) {
  const errors = [];
  const warnings = [];
  if (/<!--[\s\S]*?--[\s\S]*?-->/.test(xml.replace(/<!--[\s\S]*?-->/g, ""))) errors.push("XML comment contains illegal double hyphen");
  if (!/<mx(Cell|file|GraphModel)\b/.test(xml)) warnings.push("No draw.io graph markers found");

  const cellRe = /<mxCell\b([^>]*?)(?:\/>|>([\s\S]*?)<\/mxCell>)/g;
  const cells = [];
  const ids = new Map();
  for (const match of xml.matchAll(cellRe)) {
    const attrs = attrsOf(match[1]);
    const body = match[2] ?? "";
    const id = attrs.id;
    if (!id) {
      errors.push("mxCell without id");
      continue;
    }
    if (ids.has(id)) errors.push(`duplicate id ${id}`);
    ids.set(id, attrs);
    const geom = body.match(/<mxGeometry\b([^>]*?)(?:\/>|>)/)?.[1];
    cells.push({ id, attrs, body, geom: geom ? attrsOf(geom) : null });
  }

  for (const cell of cells) {
    const { attrs, id, geom } = cell;
    if ((attrs.vertex === "1" || attrs.edge === "1") && (id === "0" || id === "1")) {
      errors.push(`reserved id used by graph cell ${id}`);
    }
    if (attrs.parent && !ids.has(attrs.parent)) errors.push(`cell ${id} parent ${attrs.parent} does not exist`);
    for (const end of ["source", "target"]) {
      if (attrs[end] && !ids.has(attrs[end])) errors.push(`edge ${id} ${end} ${attrs[end]} does not exist`);
    }
    if (attrs.edge === "1" && !geom) errors.push(`edge ${id} is missing mxGeometry`);
    if (attrs.edge === "1" && (!attrs.source || !attrs.target)) warnings.push(`edge ${id} has no source or target`);
    if (attrs.vertex === "1") {
      if (!geom) errors.push(`vertex ${id} is missing mxGeometry`);
      else {
        const rect = rectOf(geom);
        if (!Number.isFinite(rect.w) || !Number.isFinite(rect.h)) errors.push(`vertex ${id} has invalid size`);
        else if (rect.w <= 0 || rect.h <= 0) warnings.push(`vertex ${id} has non-positive size`);
        if (rect.x < 0 || rect.y < 0) warnings.push(`vertex ${id} has negative position`);
      }
    }
  }

  const leafVertices = cells
    .filter((cell) => cell.attrs.vertex === "1" && cell.geom)
    .filter((cell) => !cells.some((candidate) => candidate.attrs.parent === cell.id))
    .map((cell) => ({ id: cell.id, parent: cell.attrs.parent ?? "1", rect: rectOf(cell.geom) }))
    .filter((item) => Number.isFinite(item.rect.w) && Number.isFinite(item.rect.h));
  for (let i = 0; i < leafVertices.length; i += 1) {
    for (let j = i + 1; j < leafVertices.length; j += 1) {
      if (leafVertices[i].parent === leafVertices[j].parent && overlaps(leafVertices[i].rect, leafVertices[j].rect)) {
        warnings.push(`vertices ${leafVertices[i].id} and ${leafVertices[j].id} overlap`);
      }
    }
  }
  if (cells.filter((cell) => cell.attrs.vertex === "1").length === 0) warnings.push("diagram has no vertex cells");
  return { title: "Diagram Lint", errors, warnings, ok: errors.length === 0 };
}

function attrsOf(raw) {
  const attrs = {};
  for (const match of raw.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)="([^"]*)"/g)) attrs[match[1]] = decode(match[2]);
  return attrs;
}

function decode(value) {
  return value.replaceAll("&quot;", '"').replaceAll("&gt;", ">").replaceAll("&lt;", "<").replaceAll("&amp;", "&");
}

function rectOf(geom) {
  return {
    x: Number(geom.x ?? 0),
    y: Number(geom.y ?? 0),
    w: Number(geom.width),
    h: Number(geom.height),
  };
}

function overlaps(a, b) {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

const args = parseArgs(process.argv.slice(2));
const input = args._[0];
if (!input) {
  console.error("usage: node diagram-lint.mjs <file.drawio> [--format markdown|json] [--strict]");
  process.exit(2);
}
const result = lintDrawio(readText(input));
process.stdout.write(formatResult(result, args.format ?? (args.json ? "json" : "markdown")));
if (!result.ok || (args.strict && result.warnings.length > 0)) process.exit(1);
