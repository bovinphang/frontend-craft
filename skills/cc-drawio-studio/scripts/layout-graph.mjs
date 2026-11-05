#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { parseArgs, printOrWrite, readText, snap, writeText, xmlEscape } from "./studio-core.mjs";

const DEFAULT_W = 140;
const DEFAULT_H = 64;
const NODE_STYLE = "rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;";
const EDGE_STYLE = "edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;";
const PALETTE = [
  ["#dae8fc", "#6c8ebf"], ["#d5e8d4", "#82b366"], ["#ffe6cc", "#d79b00"],
  ["#e1d5e7", "#9673a6"], ["#fff2cc", "#d6b656"], ["#f8cecc", "#b85450"],
];

export function buildDot(graph) {
  const direction = String(graph.direction ?? "TB").toUpperCase() === "LR" ? "LR" : "TB";
  const lines = [`digraph G { rankdir=${direction}; splines=ortho; node [shape=box fixedsize=true];`];
  for (const node of graph.nodes) {
    lines.push(`"${escapeDot(node.id)}" [width=${Number(node.width ?? DEFAULT_W) / 72} height=${Number(node.height ?? DEFAULT_H) / 72}];`);
  }
  for (const edge of graph.edges ?? []) lines.push(`"${escapeDot(edge.source)}" -> "${escapeDot(edge.target)}";`);
  lines.push("}");
  return lines.join("\n");
}

export function runDot(dot) {
  const proc = spawnSync("dot", ["-Tplain"], { input: dot, encoding: "utf8" });
  if (proc.error?.code === "ENOENT") throw new Error("Graphviz `dot` not found on PATH");
  if (proc.status !== 0) throw new Error(`Graphviz failed: ${proc.stderr.trim()}`);
  const pos = new Map();
  let height = 0;
  for (const line of proc.stdout.split(/\r?\n/)) {
    const parts = splitPlain(line);
    if (parts[0] === "graph") height = Number(parts[3]);
    if (parts[0] === "node") pos.set(parts[1], { x: Number(parts[2]), y: Number(parts[3]) });
  }
  return { height, pos };
}

export function graphToDrawio(graph, layout) {
  const groups = [...new Set((graph.nodes ?? []).map((node) => node.group).filter(Boolean))];
  const groupColor = (group) => PALETTE[Math.max(0, groups.indexOf(group)) % PALETTE.length];
  const cells = [];
  const manifest = { nodes: {}, edges: graph.edges ?? [] };
  for (const node of graph.nodes ?? []) {
    const p = layout.pos.get(node.id);
    if (!p) continue;
    const w = Number(node.width ?? DEFAULT_W);
    const h = Number(node.height ?? DEFAULT_H);
    const x = snap(p.x * 72 - w / 2 + 40);
    const y = snap((layout.height - p.y) * 72 - h / 2 + 40);
    const style = node.style ?? (node.group ? tintStyle(groupColor(node.group)) : NODE_STYLE);
    manifest.nodes[node.id] = { x, y, width: w, height: h, group: node.group ?? null };
    cells.push(`        <mxCell id="${xmlEscape(node.id)}" value="${xmlEscape(node.label ?? node.id)}" style="${xmlEscape(style)}" vertex="1" parent="1">
          <mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/>
        </mxCell>`);
  }
  let edgeIndex = 0;
  for (const edge of graph.edges ?? []) {
    cells.push(`        <mxCell id="edge_${edgeIndex++}" value="${xmlEscape(edge.label ?? "")}" style="${EDGE_STYLE}" edge="1" parent="1" source="${xmlEscape(edge.source)}" target="${xmlEscape(edge.target)}">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>`);
  }
  return {
    manifest,
    xml: `<mxfile host="drawio">
  <diagram name="Page-1">
    <mxGraphModel grid="1" gridSize="10" page="1" pageWidth="1100" pageHeight="850">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
${cells.join("\n")}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
`,
  };
}

function tintStyle([fill, stroke]) {
  return `rounded=1;whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${stroke};`;
}

function escapeDot(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function splitPlain(line) {
  return line.match(/"[^"]*"|\S+/g)?.map((part) => part.replace(/^"|"$/g, "")) ?? [];
}

const args = parseArgs(process.argv.slice(2));
const input = args._[0];
if (!input) {
  console.error("usage: node layout-graph.mjs graph.json --output diagram.drawio [--manifest layout.json]");
  process.exit(2);
}
try {
  const graph = JSON.parse(readText(input));
  const rendered = graphToDrawio(graph, runDot(buildDot(graph)));
  printOrWrite(rendered.xml, args.output);
  if (args.manifest) writeText(args.manifest, `${JSON.stringify(rendered.manifest, null, 2)}\n`);
  if (!args.output) process.stderr.write(`rendered ${graph.nodes.length} nodes\n`);
} catch (error) {
  console.error(`error: ${error.message}`);
  process.exit(1);
}
