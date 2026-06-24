#!/usr/bin/env node
// @ts-check

import fs from "node:fs";
import path from "node:path";

const ALLOWED_TYPES = new Set(["workflow", "sequence", "dataflow", "lifecycle", "architecture"]);
const NODE_TYPES = new Set(["frontend", "backend", "database", "cloud", "security", "messagebus", "external", "active", "waiting", "decision", "success", "failure", "neutral", "start"]);
const EDGE_VARIANTS = new Set(["default", "emphasis", "security", "dashed", "return"]);

const args = parseArgs(process.argv.slice(2));

try {
  const inputPath = requireArg(args, "input");
  const outputPath = requireArg(args, "output");
  const type = requireArg(args, "type");
  const format = args.format ?? "markdown";

  if (!ALLOWED_TYPES.has(type)) {
    throw usageError("type", `Unsupported diagram type "${type}". Expected workflow, sequence, dataflow, lifecycle, or architecture.`);
  }
  if (format !== "json" && format !== "markdown") {
    throw usageError("format", `Unsupported report format "${format}". Expected json or markdown.`);
  }

  const diagram = readJson(inputPath);
  validateCommon(diagram, type);
  const renderResult = renderDiagram(diagram, type);
  /** @type {SummaryCard[]} */
  const summary = "summary" in renderResult ? /** @type {SummaryCard[]} */ (renderResult.summary) : [];
  const html = renderHtml(diagram.meta.title, diagram.meta.subtitle ?? "", renderResult.svg, type, summary);

  fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
  fs.writeFileSync(outputPath, html, "utf8");

  if (args.manifest) {
    fs.mkdirSync(path.dirname(path.resolve(args.manifest)), { recursive: true });
    fs.writeFileSync(args.manifest, `${JSON.stringify(renderResult.manifest, null, 2)}\n`, "utf8");
  }

  const report = {
    ok: true,
    type,
    input: inputPath,
    output: outputPath,
    manifest: args.manifest ?? null,
    nodes: renderResult.manifest.boxes.length,
    connectors: renderResult.manifest.connectors.length,
  };
  printReport(report, format);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  if (args.format === "json") {
    console.log(JSON.stringify({ ok: false, error: message }, null, 2));
  } else {
    console.error(message);
  }
  process.exitCode = 1;
}

/**
 * @param {string[]} argv
 * @returns {Record<string, string | undefined>}
 */
function parseArgs(argv) {
  /** @type {Record<string, string | undefined>} */
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      throw usageError("argv", `Unexpected positional argument "${token}".`);
    }
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw usageError(key, `Missing value for --${key}.`);
    }
    parsed[key] = value;
    index += 1;
  }
  return parsed;
}

/**
 * @param {Record<string, string | undefined>} parsed
 * @param {string} key
 */
function requireArg(parsed, key) {
  const value = parsed[key];
  if (!value) throw usageError(key, `Missing required --${key}.`);
  return value;
}

/**
 * @param {string} filePath
 */
function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw usageError("input", `Invalid JSON at /: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * @param {unknown} diagram
 * @param {string} type
 */
function validateCommon(diagram, type) {
  assertObject(diagram, "/");
  const model = /** @type {Record<string, unknown>} */ (diagram);
  if (model.schema_version !== 1) {
    throw usageError("/schema_version", "Expected schema_version to equal 1.");
  }
  if (model.diagram_type !== type) {
    throw usageError("/diagram_type", `Expected diagram_type to equal "${type}".`);
  }
  assertObject(model.meta, "/meta");
  requireString(/** @type {Record<string, unknown>} */ (model.meta), "title", "/meta/title");
}

/**
 * @param {unknown} diagram
 * @param {string} type
 */
function renderDiagram(diagram, type) {
  if (type === "workflow") return renderLaneDiagram(/** @type {LaneDiagram} */ (diagram), "nodes", "edges");
  if (type === "lifecycle") return renderLaneDiagram(/** @type {LaneDiagram} */ (diagram), "states", "transitions");
  if (type === "sequence") return renderSequence(/** @type {SequenceDiagram} */ (diagram));
  if (type === "architecture") return renderArchitecture(/** @type {ArchitectureDiagram} */ (diagram));
  return renderDataflow(/** @type {DataflowDiagram} */ (diagram));
}

/**
 * @param {ArchitectureDiagram} diagram
 */
function renderArchitecture(diagram) {
  const nodes = requireObjectArray(diagram.nodes, "/nodes");
  const connections = requireObjectArray(diagram.connections, "/connections");
  const groups = diagram.groups === undefined ? [] : requireObjectArray(diagram.groups, "/groups");
  const groupIds = new Set();
  /** @type {Map<string, Box>} */
  const boxes = new Map();
  /** @type {Box[]} */
  const groupBoxes = [];

  for (const [index, group] of groups.entries()) {
    const id = requireId(group, "id", `/groups/${index}/id`);
    ensureUnique(groupIds, id, `/groups/${index}/id`);
    const label = requireString(group, "label", `/groups/${index}/label`);
    const type = normalizeType(group.type, `/groups/${index}/type`);
    const box = {
      id,
      x: requireNumber(group, "x", `/groups/${index}/x`),
      y: requireNumber(group, "y", `/groups/${index}/y`),
      width: requireNumber(group, "width", `/groups/${index}/width`),
      height: requireNumber(group, "height", `/groups/${index}/height`),
      label,
      sublabel: "",
      type,
    };
    groupBoxes.push(box);
  }

  for (const [index, node] of nodes.entries()) {
    const id = requireId(node, "id", `/nodes/${index}/id`);
    ensureUnique(boxes, id, `/nodes/${index}/id`);
    if (typeof node.group === "string" && !groupIds.has(node.group)) {
      throw usageError(`/nodes/${index}/group`, `Unknown group "${node.group}".`);
    }
    boxes.set(id, {
      id,
      x: requireNumber(node, "x", `/nodes/${index}/x`),
      y: requireNumber(node, "y", `/nodes/${index}/y`),
      width: typeof node.width === "number" ? node.width : 132,
      height: typeof node.height === "number" ? node.height : 62,
      label: requireString(node, "label", `/nodes/${index}/label`),
      sublabel: typeof node.sublabel === "string" ? node.sublabel : "",
      type: normalizeType(node.type, `/nodes/${index}/type`),
    });
  }

  /** @type {Connector[]} */
  const connectors = [];
  const connectionSvg = connections.map((connection, index) => {
    const from = requireId(connection, "from", `/connections/${index}/from`);
    const to = requireId(connection, "to", `/connections/${index}/to`);
    const fromBox = boxes.get(from);
    const toBox = boxes.get(to);
    if (!fromBox) throw usageError(`/connections/${index}/from`, `Unknown endpoint "${from}".`);
    if (!toBox) throw usageError(`/connections/${index}/to`, `Unknown endpoint "${to}".`);
    const variant = normalizeVariant(connection.variant, `/connections/${index}/variant`);
    const points = architectureRoute(fromBox, toBox, connection.waypoints, `/connections/${index}/waypoints`);
    connectors.push({ id: `${from}-${to}-${index}`, from, to, points });
    return renderConnector(points, variant, typeof connection.label === "string" ? connection.label : "");
  }).join("\n");

  const allBoxes = [...groupBoxes, ...boxes.values()];
  const contentBottom = Math.max(360, maxBoxExtent(allBoxes, "y") + 64);
  const legend = normalizeLegend(diagram.legend, [...boxes.values()]);
  const width = Math.max(860, maxBoxExtent(allBoxes, "x") + 64, 88 + legend.length * 118);
  const legendSvg = renderArchitectureLegend(legend, 44, contentBottom - 4);
  const height = contentBottom + (legend.length > 0 ? 54 : 0);
  const groupSvg = groupBoxes.map(renderGroup).join("\n");
  const boxSvg = [...boxes.values()].map(renderBox).join("\n");
  const svg = wrapSvg(width, height, `${groupSvg}\n${connectionSvg}\n${boxSvg}\n${legendSvg}`);

  return {
    svg,
    manifest: manifestFrom(width, height, allBoxes, connectors),
    summary: normalizeSummary(diagram.summary),
  };
}

/**
 * @param {LaneDiagram} diagram
 * @param {"nodes" | "states"} itemKey
 * @param {"edges" | "transitions"} edgeKey
 */
function renderLaneDiagram(diagram, itemKey, edgeKey) {
  const lanes = requireObjectArray(diagram.lanes, "/lanes");
  const items = requireObjectArray(diagram[itemKey], `/${itemKey}`);
  const edges = requireObjectArray(diagram[edgeKey], `/${edgeKey}`);
  const isWorkflow = itemKey === "nodes";
  const laneIds = new Set();
  for (const [index, lane] of lanes.entries()) {
    assertObject(lane, `/lanes/${index}`);
    const id = requireId(lane, "id", `/lanes/${index}/id`);
    requireString(lane, "label", `/lanes/${index}/label`);
    ensureUnique(laneIds, id, `/lanes/${index}/id`);
  }

  /** @type {Map<string, Box>} */
  const boxes = new Map();
  const maxCol = Math.max(0, ...items.map((item, index) => {
    assertObject(item, `/${itemKey}/${index}`);
    return requireNumber(item, "col", `/${itemKey}/${index}/col`);
  }));
  const width = Math.max(780, 190 + (maxCol + 1) * 180);
  const height = Math.max(420, 140 + lanes.length * 145);
  const laneHeight = 118;
  const top = 72;
  const left = 142;
  const colGap = 172;

  const laneIndex = new Map(lanes.map((lane, index) => [String(lane.id), index]));
  for (const [index, item] of items.entries()) {
    const id = requireId(item, "id", `/${itemKey}/${index}/id`);
    ensureUnique(boxes, id, `/${itemKey}/${index}/id`);
    const lane = requireId(item, "lane", `/${itemKey}/${index}/lane`);
    if (!laneIds.has(lane)) throw usageError(`/${itemKey}/${index}/lane`, `Unknown lane "${lane}".`);
    const type = normalizeType(item.type, `/${itemKey}/${index}/type`);
    const label = requireString(item, "label", `/${itemKey}/${index}/label`);
    const sublabel = typeof item.sublabel === "string" ? item.sublabel : "";
    const col = requireNumber(item, "col", `/${itemKey}/${index}/col`);
    const yOffset = typeof item.yOffset === "number" ? item.yOffset : 0;
    const width = typeof item.width === "number" ? item.width : defaultWorkflowWidth(type, isWorkflow);
    const height = typeof item.height === "number" ? item.height : defaultWorkflowHeight(type, isWorkflow);
    const box = {
      id,
      x: left + col * colGap,
      y: top + Number(laneIndex.get(lane)) * laneHeight + 38 + yOffset,
      width,
      height,
      label,
      sublabel,
      type,
      actor: isWorkflow && typeof item.actor === "string" ? item.actor : "",
      step: isWorkflow ? normalizeStep(item.step, index + 1, `/${itemKey}/${index}/step`) : "",
      shape: isWorkflow ? shapeForWorkflowType(type) : "box",
    };
    boxes.set(id, box);
  }

  /** @type {Connector[]} */
  const connectors = [];
  const edgeSvg = edges.map((edge, index) => {
    assertObject(edge, `/${edgeKey}/${index}`);
    const from = requireId(edge, "from", `/${edgeKey}/${index}/from`);
    const to = requireId(edge, "to", `/${edgeKey}/${index}/to`);
    const fromBox = boxes.get(from);
    const toBox = boxes.get(to);
    if (!fromBox) throw usageError(`/${edgeKey}/${index}/from`, `Unknown endpoint "${from}".`);
    if (!toBox) throw usageError(`/${edgeKey}/${index}/to`, `Unknown endpoint "${to}".`);
    const variant = normalizeVariant(edge.variant, `/${edgeKey}/${index}/variant`);
    const points = edge.waypoints === undefined ? routeBoxes(fromBox, toBox) : routeWithWaypoints(fromBox, toBox, edge.waypoints, `/${edgeKey}/${index}/waypoints`);
    const connectorId = `${from}-${to}-${index}`;
    connectors.push({ id: connectorId, from, to, points });
    return renderConnector(points, variant, typeof edge.label === "string" ? edge.label : "");
  }).join("\n");

  const laneSvg = lanes.map((lane, index) => {
    const y = top + index * laneHeight;
    return `<g class="lane"><rect x="34" y="${y}" width="${width - 68}" height="${laneHeight - 16}" rx="10"/><text x="52" y="${y + 28}" class="label muted">${escapeHtml(String(lane.label))}</text></g>`;
  }).join("\n");
  const boxSvg = [...boxes.values()].map(renderBox).join("\n");
  const svg = wrapSvg(width, height, `${laneSvg}\n${edgeSvg}\n${boxSvg}`);

  return {
    svg,
    manifest: manifestFrom(width, height, [...boxes.values()], connectors),
    summary: isWorkflow ? normalizeSummary(diagram.summary) : [],
  };
}

/**
 * @param {SequenceDiagram} diagram
 */
function renderSequence(diagram) {
  const participants = requireObjectArray(diagram.participants, "/participants");
  const messages = requireObjectArray(diagram.messages, "/messages");
  const ids = new Set();
  const width = Math.max(760, 160 + participants.length * 170);
  const height = Math.max(420, 170 + messages.length * 82);
  const top = 74;
  const laneGap = (width - 160) / Math.max(1, participants.length - 1);
  /** @type {Map<string, Box>} */
  const boxes = new Map();

  for (const [index, participant] of participants.entries()) {
    assertObject(participant, `/participants/${index}`);
    const id = requireId(participant, "id", `/participants/${index}/id`);
    ensureUnique(ids, id, `/participants/${index}/id`);
    const type = normalizeType(participant.type, `/participants/${index}/type`);
    const label = requireString(participant, "label", `/participants/${index}/label`);
    const x = participants.length === 1 ? width / 2 - 64 : 80 + index * laneGap - 64;
    boxes.set(id, {
      id,
      x,
      y: top,
      width: 128,
      height: 56,
      label,
      sublabel: typeof participant.sublabel === "string" ? participant.sublabel : "",
      type,
    });
  }

  /** @type {Connector[]} */
  const connectors = [];
  const lifelines = [...boxes.values()].map((box) => `<line x1="${centerX(box)}" y1="${box.y + box.height}" x2="${centerX(box)}" y2="${height - 56}" class="lifeline"/>`).join("\n");
  const messageSvg = messages.map((message, index) => {
    assertObject(message, `/messages/${index}`);
    const from = requireId(message, "from", `/messages/${index}/from`);
    const to = requireId(message, "to", `/messages/${index}/to`);
    const fromBox = boxes.get(from);
    const toBox = boxes.get(to);
    if (!fromBox) throw usageError(`/messages/${index}/from`, `Unknown endpoint "${from}".`);
    if (!toBox) throw usageError(`/messages/${index}/to`, `Unknown endpoint "${to}".`);
    const y = top + 104 + index * 72;
    /** @type {Array<[number, number]>} */
    const points = [[centerX(fromBox), y], [centerX(toBox), y]];
    const variant = normalizeVariant(message.variant, `/messages/${index}/variant`);
    connectors.push({ id: `${from}-${to}-${index}`, from, to, points });
    return renderConnector(points, variant, typeof message.label === "string" ? message.label : "");
  }).join("\n");
  const boxSvg = [...boxes.values()].map(renderBox).join("\n");
  const svg = wrapSvg(width, height, `${lifelines}\n${messageSvg}\n${boxSvg}`);

  return { svg, manifest: manifestFrom(width, height, [...boxes.values()], connectors) };
}

/**
 * @param {DataflowDiagram} diagram
 */
function renderDataflow(diagram) {
  const stages = requireObjectArray(diagram.stages, "/stages");
  const nodes = requireObjectArray(diagram.nodes, "/nodes");
  const flows = requireObjectArray(diagram.flows, "/flows");
  const width = Math.max(860, 150 + stages.length * 180);
  const height = Math.max(460, 180 + maxRowsByStage(nodes) * 110);
  const stageWidth = (width - 84) / Math.max(1, stages.length);
  /** @type {Map<string, Box>} */
  const boxes = new Map();

  for (const [index, stage] of stages.entries()) {
    assertObject(stage, `/stages/${index}`);
    requireString(stage, "label", `/stages/${index}/label`);
  }
  for (const [index, node] of nodes.entries()) {
    assertObject(node, `/nodes/${index}`);
    const id = requireId(node, "id", `/nodes/${index}/id`);
    ensureUnique(boxes, id, `/nodes/${index}/id`);
    const stage = requireNumber(node, "stage", `/nodes/${index}/stage`);
    if (stage < 0 || stage >= stages.length) throw usageError(`/nodes/${index}/stage`, `Stage index ${stage} is outside /stages.`);
    const row = typeof node.row === "number" ? node.row : countStageBefore(nodes, index, stage);
    const type = normalizeType(node.type, `/nodes/${index}/type`);
    boxes.set(id, {
      id,
      x: 54 + stage * stageWidth + Math.max(8, stageWidth / 2 - 64),
      y: 118 + row * 96,
      width: 128,
      height: 58,
      label: requireString(node, "label", `/nodes/${index}/label`),
      sublabel: typeof node.sublabel === "string" ? node.sublabel : "",
      type,
    });
  }

  /** @type {Connector[]} */
  const connectors = [];
  const stageSvg = stages.map((stage, index) => {
    const x = 42 + index * stageWidth;
    return `<g class="stage"><rect x="${x}" y="64" width="${stageWidth - 10}" height="${height - 118}" rx="12"/><text x="${x + 18}" y="92" class="label muted">${escapeHtml(String(stage.label))}</text></g>`;
  }).join("\n");
  const flowSvg = flows.map((flow, index) => {
    assertObject(flow, `/flows/${index}`);
    const from = requireId(flow, "from", `/flows/${index}/from`);
    const to = requireId(flow, "to", `/flows/${index}/to`);
    const fromBox = boxes.get(from);
    const toBox = boxes.get(to);
    if (!fromBox) throw usageError(`/flows/${index}/from`, `Unknown endpoint "${from}".`);
    if (!toBox) throw usageError(`/flows/${index}/to`, `Unknown endpoint "${to}".`);
    const variant = normalizeVariant(flow.variant, `/flows/${index}/variant`);
    const points = routeBoxes(fromBox, toBox);
    connectors.push({ id: `${from}-${to}-${index}`, from, to, points });
    return renderConnector(points, variant, typeof flow.label === "string" ? flow.label : "");
  }).join("\n");
  const boxSvg = [...boxes.values()].map(renderBox).join("\n");
  const svg = wrapSvg(width, height, `${stageSvg}\n${flowSvg}\n${boxSvg}`);

  return { svg, manifest: manifestFrom(width, height, [...boxes.values()], connectors) };
}

/**
 * @param {Array<Record<string, unknown>>} nodes
 */
function maxRowsByStage(nodes) {
  /** @type {Map<number, number>} */
  const rows = new Map();
  for (const node of nodes) {
    if (typeof node.stage === "number") {
      rows.set(node.stage, (rows.get(node.stage) ?? 0) + 1);
    }
  }
  return Math.max(1, ...rows.values());
}

/**
 * @param {Array<Record<string, unknown>>} nodes
 * @param {number} endIndex
 * @param {number} stage
 */
function countStageBefore(nodes, endIndex, stage) {
  let count = 0;
  for (let index = 0; index < endIndex; index += 1) {
    const node = nodes[index];
    if (node.stage === stage) count += 1;
  }
  return count;
}

/**
 * @param {Box} box
 */
function renderBox(box) {
  const labelLines = wrapLabel(box.label, 18).slice(0, 2);
  const shape = box.shape ?? "box";
  const labelStartY = shape === "diamond" ? centerY(box) - (labelLines.length > 1 ? 5 : -3) : box.y + 23;
  const labelSvg = labelLines.map((line, index) => `<text x="${centerX(box)}" y="${labelStartY + index * 13}" class="label" text-anchor="middle">${escapeHtml(line)}</text>`).join("\n");
  const sublabel = box.sublabel ? `<text x="${centerX(box)}" y="${box.y + box.height - 13}" class="sublabel" text-anchor="middle">${escapeHtml(box.sublabel)}</text>` : "";
  const actor = box.actor ? `<text x="${centerX(box)}" y="${box.y - 8}" class="actor" text-anchor="middle">${escapeHtml(box.actor)}</text>` : "";
  const step = box.step ? `<g class="step-badge"><circle cx="${box.x + 13}" cy="${box.y + 13}" r="10"/><text x="${box.x + 13}" y="${box.y + 17}" text-anchor="middle">${escapeHtml(box.step)}</text></g>` : "";
  const shapeSvg = shape === "diamond"
    ? `<polygon points="${centerX(box)},${box.y} ${box.x + box.width},${centerY(box)} ${centerX(box)},${box.y + box.height} ${box.x},${centerY(box)}"/>`
    : `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="${shape === "terminal" ? Math.round(box.height / 2) : 10}"/>`;
  return `<g class="node node-${box.type}">${actor}\n${shapeSvg}\n${step}\n${labelSvg}\n${sublabel}</g>`;
}

/**
 * @param {Box} box
 */
function renderGroup(box) {
  return `<g class="group group-${box.type}"><rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="14"/><text x="${box.x + 16}" y="${box.y + 26}" class="label muted">${escapeHtml(box.label)}</text></g>`;
}

/**
 * @param {Array<[number, number]>} points
 * @param {string} variant
 * @param {string} label
 */
function renderConnector(points, variant, label) {
  const pathData = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const midpoint = points[Math.floor((points.length - 1) / 2)];
  const labelSvg = label ? `<text x="${midpoint[0]}" y="${midpoint[1] - 8}" class="edge-label" text-anchor="middle">${escapeHtml(label)}</text>` : "";
  return `<g class="edge edge-${variant}"><path d="${pathData}" marker-end="url(#arrow-${variant === "return" ? "default" : variant})"/>\n${labelSvg}</g>`;
}

/**
 * @param {number} width
 * @param {number} height
 * @param {string} body
 */
function wrapSvg(width, height, body) {
  return `<svg class="tech-diagram" data-export-root="1" role="img" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker>
    <marker id="arrow-emphasis" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker>
    <marker id="arrow-security" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker>
    <marker id="arrow-dashed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker>
  </defs>
  <rect x="16" y="18" width="${width - 32}" height="${height - 36}" rx="18" class="surface"/>
  ${body}
</svg>`;
}

/**
 * @param {string} title
 * @param {string} subtitle
 * @param {string} svg
 * @param {string} type
 * @param {SummaryCard[]} [summary]
 */
function renderHtml(title, subtitle, svg, type, summary = []) {
  const summaryHtml = renderSummaryCards(summary);
  return `<!doctype html>
<html lang="en" data-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
:root {
  color-scheme: dark light;
  --bg: #0f172a;
  --panel: #111827;
  --surface: #172033;
  --text: #f8fafc;
  --muted: #94a3b8;
  --line: #64748b;
  --frontend: #38bdf8;
  --backend: #34d399;
  --database: #a78bfa;
  --cloud: #fbbf24;
  --security: #fb7185;
  --messagebus: #fb923c;
  --external: #cbd5e1;
}
[data-theme="light"] {
  --bg: #f8fafc;
  --panel: #ffffff;
  --surface: #eef2f7;
  --text: #0f172a;
  --muted: #64748b;
  --line: #475569;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font: 14px/1.5 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
main { width: min(1180px, calc(100vw - 32px)); margin: 0 auto; padding: 28px 0; }
header { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
h1 { font-size: 24px; margin: 0; letter-spacing: 0; }
p { margin: 6px 0 0; color: var(--muted); }
.toolbar { display: flex; gap: 8px; flex-wrap: wrap; }
button {
  border: 1px solid color-mix(in srgb, var(--muted), transparent 55%);
  background: var(--panel);
  color: var(--text);
  border-radius: 8px;
  padding: 8px 11px;
  cursor: pointer;
}
.diagram-frame { background: var(--panel); border: 1px solid color-mix(in srgb, var(--muted), transparent 70%); border-radius: 12px; overflow: auto; }
.tech-diagram { display: block; min-width: 720px; width: 100%; height: auto; }
.group rect { fill: color-mix(in srgb, currentColor, transparent 94%); stroke: currentColor; stroke-width: 1.2; stroke-dasharray: 8 5; }
.group-frontend { color: var(--frontend); }
.group-backend, .group-active, .group-start { color: var(--backend); }
.group-database { color: var(--database); }
.group-cloud, .group-decision { color: var(--cloud); }
.group-security, .group-failure, .group-waiting { color: var(--security); }
.group-messagebus { color: var(--messagebus); }
.group-external, .group-neutral, .group-success { color: var(--external); }
.surface { fill: var(--surface); stroke: color-mix(in srgb, var(--muted), transparent 70%); }
.lane rect, .stage rect { fill: color-mix(in srgb, var(--surface), transparent 25%); stroke: color-mix(in srgb, var(--muted), transparent 72%); }
.node rect, .node polygon { fill: color-mix(in srgb, currentColor, transparent 86%); stroke: currentColor; stroke-width: 1.6; }
.node-frontend { color: var(--frontend); }
.node-backend, .node-active, .node-start, .node-success { color: var(--backend); }
.node-database { color: var(--database); }
.node-cloud, .node-decision { color: var(--cloud); }
.node-security, .node-failure, .node-waiting { color: var(--security); }
.node-messagebus { color: var(--messagebus); }
.node-external, .node-neutral { color: var(--external); }
.label { fill: var(--text); font-weight: 650; font-size: 12px; }
.sublabel, .muted, .actor { fill: var(--muted); font-size: 10px; }
.actor { font-weight: 650; }
.step-badge circle { fill: var(--panel); stroke: currentColor; stroke-width: 1.3; }
.step-badge text { fill: var(--text); font-size: 9px; font-weight: 750; }
.edge path { fill: none; stroke: var(--line); stroke-width: 1.6; }
.edge-emphasis path { stroke: var(--frontend); stroke-width: 2; }
.edge-security path { stroke: var(--security); stroke-dasharray: 5 4; }
.edge-dashed path, .edge-return path { stroke-dasharray: 5 4; }
.edge-label { fill: var(--muted); font-size: 10px; paint-order: stroke; stroke: var(--surface); stroke-width: 5px; stroke-linejoin: round; }
.lifeline { stroke: color-mix(in srgb, var(--muted), transparent 48%); stroke-dasharray: 4 5; }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 12px; }
.summary-card { background: var(--panel); border: 1px solid color-mix(in srgb, var(--muted), transparent 74%); border-radius: 8px; padding: 12px; }
.summary-card h2 { margin: 0 0 7px; font-size: 13px; letter-spacing: 0; }
.summary-card ul { margin: 0; padding-left: 18px; color: var(--muted); font-size: 12px; }
.summary-card li + li { margin-top: 4px; }
marker path { fill: var(--line); }
#arrow-emphasis path { fill: var(--frontend); }
#arrow-security path { fill: var(--security); }
#arrow-dashed path { fill: var(--line); }
footer { margin-top: 12px; color: var(--muted); font-size: 12px; }
@media print {
  body { background: #fff; }
  main { width: 100%; padding: 0; }
  .toolbar, footer { display: none; }
  .diagram-frame { border: 0; }
}
</style>
</head>
<body>
<main>
  <header>
    <div>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(subtitle || `${type} technical diagram`)}</p>
    </div>
    <div class="toolbar" aria-label="Diagram actions">
      <button type="button" data-action="theme">Toggle theme</button>
      <button type="button" data-action="svg">Download SVG</button>
      <button type="button" data-action="print">Print / Save PDF</button>
    </div>
  </header>
  <section class="diagram-frame" aria-label="${escapeHtml(title)}">
${svg}
  </section>
${summaryHtml}
  <footer>Generated as a self-contained Frontend Craft HTML technical diagram. Export raster images from the browser after visual QA.</footer>
</main>
<script>
const root = document.documentElement;
const stored = localStorage.getItem("fec-tech-diagram-theme");
if (stored === "dark" || stored === "light") root.dataset.theme = stored;
document.querySelector('[data-action="theme"]').addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("fec-tech-diagram-theme", next);
});
document.querySelector('[data-action="print"]').addEventListener("click", () => window.print());
document.querySelector('[data-action="svg"]').addEventListener("click", () => {
  const svg = document.querySelector("[data-export-root]");
  const source = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = document.title.replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() + ".svg";
  link.click();
  URL.revokeObjectURL(link.href);
});
</script>
</body>
</html>
`;
}

/**
 * @param {SummaryCard[]} summary
 */
function renderSummaryCards(summary) {
  if (summary.length === 0) return "";
  return `  <section class="summary-grid" aria-label="Diagram summary">
${summary.map((card) => `    <article class="summary-card summary-${card.type}">
      <h2>${escapeHtml(card.title)}</h2>
      <ul>${card.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>`).join("\n")}
  </section>`;
}

/**
 * @param {number} width
 * @param {number} height
 * @param {Box[]} boxes
 * @param {Connector[]} connectors
 */
function manifestFrom(width, height, boxes, connectors) {
  return {
    canvas: { width, height },
    boxes: boxes.map(({ id, x, y, width: boxWidth, height: boxHeight, label }) => ({ id, x, y, width: boxWidth, height: boxHeight, label })),
    connectors,
  };
}

/**
 * @param {Box[]} boxes
 * @param {"x" | "y"} axis
 */
function maxBoxExtent(boxes, axis) {
  const sizeKey = axis === "x" ? "width" : "height";
  return Math.max(0, ...boxes.map((box) => box[axis] + box[sizeKey]));
}

/**
 * @param {Box} from
 * @param {Box} to
 * @param {unknown} waypoints
 * @param {string} pointer
 * @returns {Array<[number, number]>}
 */
function architectureRoute(from, to, waypoints, pointer) {
  return routeWithWaypoints(from, to, waypoints, pointer);
}

/**
 * @param {Box} from
 * @param {Box} to
 * @param {unknown} waypoints
 * @param {string} pointer
 * @returns {Array<[number, number]>}
 */
function routeWithWaypoints(from, to, waypoints, pointer) {
  if (waypoints === undefined) return routeBoxes(from, to);
  if (!Array.isArray(waypoints)) throw usageError(pointer, "Expected array of [x, y] waypoints.");
  /** @type {Array<[number, number]>} */
  const parsed = waypoints.map((point, index) => {
    if (!Array.isArray(point) || point.length !== 2 || typeof point[0] !== "number" || typeof point[1] !== "number") {
      throw usageError(`${pointer}/${index}`, "Expected [x, y] number tuple.");
    }
    return [point[0], point[1]];
  });
  const firstTarget = parsed[0] ?? [centerX(to), centerY(to)];
  const lastTarget = parsed[parsed.length - 1] ?? [centerX(from), centerY(from)];
  return [edgePointToward(from, firstTarget), ...parsed, edgePointToward(to, lastTarget)];
}

/**
 * @param {string} type
 * @param {boolean} isWorkflow
 */
function defaultWorkflowWidth(type, isWorkflow) {
  if (!isWorkflow) return 132;
  if (type === "decision") return 92;
  if (type === "start" || type === "success" || type === "failure") return 128;
  return 132;
}

/**
 * @param {string} type
 * @param {boolean} isWorkflow
 */
function defaultWorkflowHeight(type, isWorkflow) {
  if (!isWorkflow) return 58;
  if (type === "decision") return 92;
  if (type === "start" || type === "success" || type === "failure") return 46;
  return 58;
}

/**
 * @param {string} type
 * @returns {"box" | "diamond" | "terminal"}
 */
function shapeForWorkflowType(type) {
  if (type === "decision") return "diamond";
  if (type === "start" || type === "success" || type === "failure") return "terminal";
  return "box";
}

/**
 * @param {unknown} value
 * @param {number} fallback
 * @param {string} pointer
 */
function normalizeStep(value, fallback, pointer) {
  if (value === undefined) return String(fallback);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.length > 0) return value;
  throw usageError(pointer, "Expected non-empty string or finite number.");
}

/**
 * @param {Box} box
 * @param {[number, number]} target
 * @returns {[number, number]}
 */
function edgePointToward(box, target) {
  const cx = centerX(box);
  const cy = centerY(box);
  const dx = target[0] - cx;
  const dy = target[1] - cy;
  if (Math.abs(dx) / Math.max(1, box.width) > Math.abs(dy) / Math.max(1, box.height)) {
    return [dx >= 0 ? box.x + box.width : box.x, cy];
  }
  return [cx, dy >= 0 ? box.y + box.height : box.y];
}

/**
 * @param {unknown} legend
 * @param {Box[]} boxes
 * @returns {LegendItem[]}
 */
function normalizeLegend(legend, boxes) {
  if (legend === false) return [];
  if (legend !== undefined) {
    const items = requireObjectArray(legend, "/legend");
    return items.map((item, index) => ({
      label: requireString(item, "label", `/legend/${index}/label`),
      type: normalizeType(item.type, `/legend/${index}/type`),
    }));
  }
  const seen = new Set();
  /** @type {LegendItem[]} */
  const items = [];
  for (const box of boxes) {
    if (!seen.has(box.type)) {
      seen.add(box.type);
      items.push({ label: labelForType(box.type), type: box.type });
    }
  }
  return items;
}

/**
 * @param {LegendItem[]} items
 * @param {number} x
 * @param {number} y
 */
function renderArchitectureLegend(items, x, y) {
  if (items.length === 0) return "";
  const itemSvg = items.map((item, index) => {
    const itemX = x + index * 118;
    return `<g class="node node-${item.type}"><rect x="${itemX}" y="${y + 16}" width="16" height="10" rx="2"/><text x="${itemX + 24}" y="${y + 25}" class="sublabel">${escapeHtml(item.label)}</text></g>`;
  }).join("\n");
  return `<g class="legend"><text x="${x}" y="${y}" class="label">Legend</text>\n${itemSvg}</g>`;
}

/**
 * @param {string} type
 */
function labelForType(type) {
  return ({
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    cloud: "Cloud",
    security: "Security",
    messagebus: "Message bus",
    external: "External",
  })[type] ?? type;
}

/**
 * @param {unknown} summary
 * @returns {SummaryCard[]}
 */
function normalizeSummary(summary) {
  if (summary === undefined) return [];
  const cards = requireObjectArray(summary, "/summary").slice(0, 3);
  return cards.map((card, index) => {
    const items = requireArray(card.items, `/summary/${index}/items`);
    return {
      title: requireString(card, "title", `/summary/${index}/title`),
      type: normalizeType(card.type, `/summary/${index}/type`),
      items: items.map((item, itemIndex) => {
        if (typeof item !== "string" || item.length === 0) {
          throw usageError(`/summary/${index}/items/${itemIndex}`, "Expected non-empty string.");
        }
        return item;
      }),
    };
  });
}

/**
 * @param {Box} from
 * @param {Box} to
 * @returns {Array<[number, number]>}
 */
function routeBoxes(from, to) {
  const start = [centerX(from), centerY(from)];
  const end = [centerX(to), centerY(to)];
  if (Math.abs(start[1] - end[1]) < 18) {
    return [[from.x + from.width, start[1]], [to.x, end[1]]];
  }
  const midX = Math.round((start[0] + end[0]) / 2);
  return [[start[0], start[1]], [midX, start[1]], [midX, end[1]], [end[0], end[1]]];
}

/**
 * @param {Box} box
 */
function centerX(box) {
  return box.x + box.width / 2;
}

/**
 * @param {Box} box
 */
function centerY(box) {
  return box.y + box.height / 2;
}

/**
 * @param {string} value
 * @param {number} size
 */
function wrapLabel(value, size) {
  const words = value.split(/\s+/).filter(Boolean);
  /** @type {string[]} */
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line ? `${line} ${word}` : word).length > size) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.length > 0 ? lines : [value];
}

/**
 * @param {unknown} value
 * @param {string} pointer
 */
function normalizeType(value, pointer) {
  if (typeof value !== "string") return "external";
  if (!NODE_TYPES.has(value)) throw usageError(pointer, `Unsupported node type "${value}".`);
  return value;
}

/**
 * @param {unknown} value
 * @param {string} pointer
 */
function normalizeVariant(value, pointer) {
  if (value === undefined) return "default";
  if (typeof value !== "string" || !EDGE_VARIANTS.has(value)) {
    throw usageError(pointer, `Unsupported edge variant "${String(value)}".`);
  }
  return value;
}

/**
 * @param {unknown} value
 * @param {string} pointer
 */
function assertObject(value, pointer) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw usageError(pointer, "Expected object.");
  }
}

/**
 * @param {unknown} value
 * @param {string} pointer
 * @returns {unknown[]}
 */
function requireArray(value, pointer) {
  if (!Array.isArray(value)) throw usageError(pointer, "Expected array.");
  return value;
}

/**
 * @param {unknown} value
 * @param {string} pointer
 * @returns {Array<Record<string, unknown>>}
 */
function requireObjectArray(value, pointer) {
  const items = requireArray(value, pointer);
  for (const [index, item] of items.entries()) {
    assertObject(item, `${pointer}/${index}`);
  }
  return /** @type {Array<Record<string, unknown>>} */ (items);
}

/**
 * @param {Record<string, unknown>} object
 * @param {string} key
 * @param {string} pointer
 */
function requireString(object, key, pointer) {
  const value = object[key];
  if (typeof value !== "string" || value.length === 0) {
    throw usageError(pointer, "Expected non-empty string.");
  }
  return value;
}

/**
 * @param {Record<string, unknown>} object
 * @param {string} key
 * @param {string} pointer
 */
function requireId(object, key, pointer) {
  const value = requireString(object, key, pointer);
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value)) {
    throw usageError(pointer, "Expected id to match ^[a-zA-Z][a-zA-Z0-9_-]*$.");
  }
  return value;
}

/**
 * @param {Record<string, unknown>} object
 * @param {string} key
 * @param {string} pointer
 */
function requireNumber(object, key, pointer) {
  const value = object[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw usageError(pointer, "Expected finite number.");
  }
  return value;
}

/**
 * @param {Set<string> | Map<string, unknown>} seen
 * @param {string} id
 * @param {string} pointer
 */
function ensureUnique(seen, id, pointer) {
  if (seen.has(id)) throw usageError(pointer, `Duplicate id "${id}".`);
  if (seen instanceof Set) seen.add(id);
  else seen.set(id, undefined);
}

/**
 * @param {string} pointer
 * @param {string} message
 */
function usageError(pointer, message) {
  return new Error(`${pointer}: ${message}`);
}

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char] ?? char));
}

/**
 * @param {{ ok: boolean; type: string; input: string; output: string; manifest: string | null; nodes: number; connectors: number }} report
 * @param {string} format
 */
function printReport(report, format) {
  if (format === "json") {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(`Rendered ${report.type} technical diagram`);
  console.log(`- Output: ${report.output}`);
  if (report.manifest) console.log(`- Manifest: ${report.manifest}`);
  console.log(`- Nodes: ${report.nodes}`);
  console.log(`- Connectors: ${report.connectors}`);
}

/**
 * @typedef {{
 *   id: string;
 *   x: number;
 *   y: number;
 *   width: number;
 *   height: number;
 *   label: string;
 *   sublabel: string;
 *   type: string;
 *   actor?: string;
 *   step?: string;
 *   shape?: "box" | "diamond" | "terminal";
 * }} Box
 *
 * @typedef {{
 *   id: string;
 *   from: string;
 *   to: string;
 *   points: Array<[number, number]>;
 * }} Connector
 *
 * @typedef {{
 *   meta: { title: string; subtitle?: string };
 *   lanes: Array<Record<string, unknown>>;
 *   nodes?: Array<Record<string, unknown>>;
 *   edges?: Array<Record<string, unknown>>;
 *   states?: Array<Record<string, unknown>>;
 *   transitions?: Array<Record<string, unknown>>;
 *   summary?: Array<Record<string, unknown>>;
 * }} LaneDiagram
 *
 * @typedef {{
 *   meta: { title: string; subtitle?: string };
 *   participants: Array<Record<string, unknown>>;
 *   messages: Array<Record<string, unknown>>;
 * }} SequenceDiagram
 *
 * @typedef {{
 *   meta: { title: string; subtitle?: string };
 *   stages: Array<Record<string, unknown>>;
 *   nodes: Array<Record<string, unknown>>;
 *   flows: Array<Record<string, unknown>>;
 * }} DataflowDiagram
 *
 * @typedef {{
 *   meta: { title: string; subtitle?: string };
 *   groups?: Array<Record<string, unknown>>;
 *   nodes: Array<Record<string, unknown>>;
 *   connections: Array<Record<string, unknown>>;
 *   legend?: Array<Record<string, unknown>> | false;
 *   summary?: Array<Record<string, unknown>>;
 * }} ArchitectureDiagram
 *
 * @typedef {{
 *   label: string;
 *   type: string;
 * }} LegendItem
 *
 * @typedef {{
 *   title: string;
 *   type: string;
 *   items: string[];
 * }} SummaryCard
 */
