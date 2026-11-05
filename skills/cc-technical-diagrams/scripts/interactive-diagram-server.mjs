#!/usr/bin/env node
// @ts-check

import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 6100;
const PORT_TRIES = 20;
const MAX_BODY_BYTES = 1024 * 1024;
const SESSION_DIR = path.join(os.tmpdir(), "frontend-craft-interactive-diagrams");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rendererPath = path.join(root, "assets", "interactive-diagram.html");

/**
 * @typedef {{ cmd: string, [key: string]: unknown }} DiagramCommand
 * @typedef {{ commands: DiagramCommand[], clients: Set<http.ServerResponse> }} DiagramSession
 * @typedef {{ id: string, label: string, type: string, x?: number, y?: number, width?: number, height?: number, children?: string[], [key: string]: unknown }} GraphNode
 * @typedef {{ id: string, from: string, to: string, label?: string, [key: string]: unknown }} GraphEdge
 * @typedef {{ title: string, direction: string, nodes: GraphNode[], edges: GraphEdge[] }} GraphModel
 */

/** @type {Map<string, DiagramSession>} */
const sessions = new Map();

const options = parseArgs(process.argv.slice(2));
fs.mkdirSync(SESSION_DIR, { recursive: true });

if (options.help) {
  printHelp();
  process.exit(0);
}

const server = http.createServer((req, res) => {
  void route(req, res);
});

server.on("clientError", (_err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

listenWithFallback(server, options.port, options.host)
  .then((port) => {
    const status = { ok: true, host: options.host, port, url: `http://${options.host}:${port}/` };
    console.log(JSON.stringify(status));
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });

/**
 * @param {string[]} args
 * @returns {{ host: string, port: number, help: boolean }}
 */
function parseArgs(args) {
  let host = DEFAULT_HOST;
  let port = DEFAULT_PORT;
  let help = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") help = true;
    else if (arg === "--host") host = args[++index] ?? host;
    else if (arg === "--port") port = Number(args[++index] ?? port);
  }

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid --port value: ${port}`);
  }

  return { host, port, help };
}

function printHelp() {
  console.log(`Usage: node interactive-diagram-server.mjs [--host 127.0.0.1] [--port 6100]

Starts a local interactive diagram server with session-scoped SSE updates.
Open http://127.0.0.1:6100/?s=my-session and POST commands to /cmd?s=my-session.`);
}

/**
 * @param {http.Server} target
 * @param {number} startPort
 * @param {string} host
 * @returns {Promise<number>}
 */
function listenWithFallback(target, startPort, host) {
  if (startPort === 0) {
    return listenOnce(target, 0, host);
  }

  let nextPort = startPort;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const tryListen = () => {
      attempts += 1;
      target.once("error", onError);
      target.listen(nextPort, host, () => {
        target.off("error", onError);
        resolve(nextPort);
      });
    };

    /** @param {NodeJS.ErrnoException} error */
    const onError = (error) => {
      target.off("error", onError);
      if (error.code === "EADDRINUSE" && attempts < PORT_TRIES) {
        nextPort += 1;
        tryListen();
        return;
      }
      reject(error);
    };

    tryListen();
  });
}

/**
 * @param {http.Server} target
 * @param {number} port
 * @param {string} host
 * @returns {Promise<number>}
 */
function listenOnce(target, port, host) {
  return new Promise((resolve, reject) => {
    target.once("error", reject);
    target.listen(port, host, () => {
      target.off("error", reject);
      const address = target.address();
      if (!address || typeof address === "string") {
        reject(new Error("Unable to resolve listening port"));
        return;
      }
      resolve(address.port);
    });
  });
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function route(req, res) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`);
  const sessionId = sanitizeSessionId(url.searchParams.get("s") ?? "default");

  try {
    if (req.method === "GET" && url.pathname === "/") {
      serveRenderer(res);
    } else if (req.method === "GET" && url.pathname === "/events") {
      serveEvents(sessionId, res);
    } else if (req.method === "GET" && url.pathname === "/state") {
      sendJson(res, 200, getSession(sessionId).commands);
    } else if (req.method === "GET" && url.pathname === "/status") {
      sendJson(res, 200, getStatus());
    } else if (req.method === "GET" && url.pathname === "/sessions") {
      sendJson(res, 200, listSessions());
    } else if (req.method === "POST" && url.pathname === "/cmd") {
      await handleCommand(req, res, sessionId);
    } else if (req.method === "POST" && url.pathname === "/clear") {
      clearSession(sessionId);
      sendJson(res, 200, { ok: true, session: sessionId, commands: 0 });
    } else if (req.method === "GET" && url.pathname === "/export") {
      handleExport(res, sessionId, url.searchParams.get("format") ?? "json");
    } else if (req.method === "POST" && url.pathname === "/export") {
      const payload = await readJsonBody(req);
      const format = typeof payload.format === "string" ? payload.format : "json";
      handleExport(res, sessionId, format);
    } else {
      sendJson(res, 404, { ok: false, error: `Unknown route ${req.method ?? "GET"} ${url.pathname}` });
    }
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

/** @param {http.ServerResponse} res */
function serveRenderer(res) {
  const html = fs.readFileSync(rendererPath, "utf8");
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(html);
}

/**
 * @param {string} sessionId
 * @param {http.ServerResponse} res
 */
function serveEvents(sessionId, res) {
  const session = getSession(sessionId);
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.write(`event: ready\ndata: ${JSON.stringify({ session: sessionId })}\n\n`);
  session.clients.add(res);
  res.on("close", () => {
    session.clients.delete(res);
  });
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string} sessionId
 */
async function handleCommand(req, res, sessionId) {
  let command;
  try {
    command = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
    return;
  }

  if (!isCommand(command)) {
    sendJson(res, 400, { ok: false, error: "Body must be a JSON object with a string cmd field" });
    return;
  }

  const session = getSession(sessionId);
  if (command.cmd === "clear") {
    session.commands = [];
  } else if (command.cmd === "init") {
    session.commands = [command];
  } else {
    session.commands.push(command);
  }

  saveSession(sessionId, session.commands);
  broadcast(session, command);
  sendJson(res, 200, { ok: true, session: sessionId, commands: session.commands.length });
}

/**
 * @param {http.ServerResponse} res
 * @param {string} sessionId
 * @param {string} format
 */
function handleExport(res, sessionId, format) {
  const session = getSession(sessionId);
  const model = buildGraphModel(session.commands);
  if (format === "json") {
    sendJson(res, 200, { ok: true, session: sessionId, commands: session.commands, graph: model });
    return;
  }
  if (format === "svg") {
    const svg = renderStaticSvg(model);
    res.writeHead(200, {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(svg);
    return;
  }
  if (format === "drawio") {
    res.writeHead(200, {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(renderDrawioXml(model));
    return;
  }
  sendJson(res, 422, { ok: false, error: `Unsupported export format: ${format}` });
}

/**
 * @param {http.IncomingMessage} req
 * @returns {Promise<Record<string, unknown>>}
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    /** @type {Buffer[]} */
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large"));
        req.destroy();
        return;
      }
      chunks.push(buffer);
    });
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf8").trim();
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Request body must be valid JSON"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * @param {unknown} value
 * @returns {value is DiagramCommand}
 */
function isCommand(value) {
  return Boolean(value && typeof value === "object" && typeof /** @type {{ cmd?: unknown }} */ (value).cmd === "string");
}

/**
 * @param {string} sessionId
 * @returns {DiagramSession}
 */
function getSession(sessionId) {
  const existing = sessions.get(sessionId);
  if (existing) return existing;
  const loaded = loadSession(sessionId);
  const session = { commands: loaded, clients: new Set() };
  sessions.set(sessionId, session);
  return session;
}

/** @param {string} value */
function sanitizeSessionId(value) {
  const clean = value.trim().replace(/[^A-Za-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return clean.slice(0, 80) || "default";
}

/** @param {string} sessionId */
function sessionFile(sessionId) {
  return path.join(SESSION_DIR, `${sessionId}.json`);
}

/** @param {string} sessionId */
function loadSession(sessionId) {
  try {
    const parsed = JSON.parse(fs.readFileSync(sessionFile(sessionId), "utf8"));
    return Array.isArray(parsed) ? parsed.filter(isCommand) : [];
  } catch {
    return [];
  }
}

/**
 * @param {string} sessionId
 * @param {DiagramCommand[]} commands
 */
function saveSession(sessionId, commands) {
  fs.writeFileSync(sessionFile(sessionId), `${JSON.stringify(commands, null, 2)}\n`, "utf8");
}

/** @param {string} sessionId */
function clearSession(sessionId) {
  const session = getSession(sessionId);
  session.commands = [];
  saveSession(sessionId, []);
  broadcast(session, { cmd: "clear" });
}

/**
 * @param {DiagramSession} session
 * @param {DiagramCommand} command
 */
function broadcast(session, command) {
  const payload = `data: ${JSON.stringify(command)}\n\n`;
  for (const client of session.clients) {
    client.write(payload);
  }
}

function getStatus() {
  let clientCount = 0;
  let commandCount = 0;
  for (const session of sessions.values()) {
    clientCount += session.clients.size;
    commandCount += session.commands.length;
  }
  return { ok: true, sessions: sessions.size, clients: clientCount, commands: commandCount };
}

function listSessions() {
  return [...sessions.entries()]
    .map(([id, session]) => ({ id, commands: session.commands.length, clients: session.clients.size }))
    .sort((left, right) => left.id.localeCompare(right.id));
}

/** @param {DiagramCommand[]} commands */
function buildGraphModel(commands) {
  /** @type {GraphModel} */
  const model = { title: "Interactive Diagram", direction: "TB", nodes: [], edges: [] };
  /** @type {Map<string, GraphNode>} */
  const nodes = new Map();
  /** @type {GraphEdge[]} */
  const edges = [];

  for (const command of commands) {
    if (command.cmd === "init") {
      model.title = stringField(command.title, model.title);
      model.direction = stringField(command.direction, model.direction);
      nodes.clear();
      edges.length = 0;
    } else if (command.cmd === "title") {
      model.title = stringField(command.text, model.title);
    } else if (command.cmd === "node" || command.cmd === "container") {
      const id = stringField(command.id, "");
      if (!id) continue;
      const type = command.cmd === "container" ? "container" : stringField(command.type, "process");
      const node = {
        id,
        label: stringField(command.label, id),
        type,
        width: numberField(command.width),
        height: numberField(command.height),
        x: numberField(command.x),
        y: numberField(command.y),
        children: arrayStringField(command.children),
        ...command,
      };
      nodes.set(id, node);
    } else if (command.cmd === "edge") {
      const from = stringField(command.from, "");
      const to = stringField(command.to, "");
      if (!from || !to) continue;
      edges.push({
        id: stringField(command.id, `${from}-${to}-${edges.length + 1}`),
        from,
        to,
        label: stringField(command.label, ""),
        ...command,
      });
    } else if (command.cmd === "remove") {
      const id = stringField(command.id, "");
      nodes.delete(id);
      for (let index = edges.length - 1; index >= 0; index -= 1) {
        if (edges[index]?.from === id || edges[index]?.to === id) edges.splice(index, 1);
      }
    }
  }

  model.nodes = [...nodes.values()];
  model.edges = edges;
  return applyLayeredLayout(model);
}

/** @param {GraphModel} model */
function applyLayeredLayout(model) {
  const placed = new Set(model.nodes.filter((node) => Number.isFinite(node.x) && Number.isFinite(node.y)).map((node) => node.id));
  const byId = new Map(model.nodes.map((node) => [node.id, node]));
  const incoming = new Map(model.nodes.map((node) => [node.id, 0]));
  const outgoing = new Map(model.nodes.map((node) => [node.id, /** @type {string[]} */ ([])]));

  for (const edge of model.edges) {
    if (!byId.has(edge.from) || !byId.has(edge.to)) continue;
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    outgoing.get(edge.from)?.push(edge.to);
  }

  const queue = model.nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0);
  /** @type {Map<string, number>} */
  const layer = new Map();
  for (const node of queue) layer.set(node.id, 0);

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;
    const nextLayer = (layer.get(node.id) ?? 0) + 1;
    for (const target of outgoing.get(node.id) ?? []) {
      layer.set(target, Math.max(layer.get(target) ?? 0, nextLayer));
      const targetNode = byId.get(target);
      if (targetNode) queue.push(targetNode);
    }
  }

  for (const node of model.nodes) {
    if (!layer.has(node.id)) layer.set(node.id, 0);
  }

  const horizontal = model.direction === "LR" || model.direction === "RL";
  /** @type {Map<number, GraphNode[]>} */
  const groups = new Map();
  for (const node of model.nodes.filter((candidate) => candidate.type !== "container")) {
    const rank = layer.get(node.id) ?? 0;
    const group = groups.get(rank) ?? [];
    group.push(node);
    groups.set(rank, group);
  }

  for (const [rank, nodes] of groups) {
    nodes.forEach((node, index) => {
      if (placed.has(node.id)) return;
      const main = 80 + rank * 190;
      const cross = 80 + index * 120;
      node.x = horizontal ? main : cross;
      node.y = horizontal ? cross : main;
      node.width = node.width ?? defaultNodeWidth(node);
      node.height = node.height ?? defaultNodeHeight(node);
    });
  }

  for (const node of model.nodes.filter((candidate) => candidate.type === "container")) {
    /** @type {GraphNode[]} */
    const children = [];
    for (const childId of node.children ?? []) {
      const child = byId.get(childId);
      if (child && child.type !== "container") children.push(child);
    }
    if (children.length === 0) {
      node.x = node.x ?? 40;
      node.y = node.y ?? 40;
      node.width = node.width ?? 240;
      node.height = node.height ?? 160;
      continue;
    }
    const left = Math.min(...children.map((child) => child.x ?? 0));
    const top = Math.min(...children.map((child) => child.y ?? 0));
    const right = Math.max(...children.map((child) => (child.x ?? 0) + (child.width ?? defaultNodeWidth(child))));
    const bottom = Math.max(...children.map((child) => (child.y ?? 0) + (child.height ?? defaultNodeHeight(child))));
    node.x = left - 36;
    node.y = top - 54;
    node.width = right - left + 72;
    node.height = bottom - top + 90;
  }

  return model;
}

/** @param {GraphNode} node */
function defaultNodeWidth(node) {
  return node.type === "decision" ? 132 : node.type === "database" ? 136 : 150;
}

/** @param {GraphNode} node */
function defaultNodeHeight(node) {
  return node.type === "decision" ? 88 : node.type === "container" ? 160 : 62;
}

/** @param {unknown} value @param {string} fallback */
function stringField(value, fallback) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

/** @param {unknown} value */
function numberField(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** @param {unknown} value */
function arrayStringField(value) {
  return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : undefined;
}

/**
 * @param {http.ServerResponse} res
 * @param {number} status
 * @param {unknown} value
 */
function sendJson(res, status, value) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(`${JSON.stringify(value, null, 2)}\n`);
}

/** @param {GraphModel} model */
function renderStaticSvg(model) {
  const width = Math.max(720, ...model.nodes.map((node) => (node.x ?? 0) + (node.width ?? defaultNodeWidth(node)) + 80));
  const height = Math.max(420, ...model.nodes.map((node) => (node.y ?? 0) + (node.height ?? defaultNodeHeight(node)) + 80));
  const nodes = model.nodes.map(renderSvgNode).join("\n");
  const byId = new Map(model.nodes.map((node) => [node.id, node]));
  const edges = model.edges.map((edge) => renderSvgEdge(edge, byId)).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<style>text{font-family:Arial,sans-serif;font-size:13px;fill:#172033}.node{fill:#f8fafc;stroke:#4064d7;stroke-width:2}.container{fill:#f8fbff;stroke:#7a8aa0;stroke-dasharray:7 5}.edge{stroke:#718096;stroke-width:2;fill:none}.label-bg{fill:#fff;stroke:#d7dde8}</style>
<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#718096"/></marker></defs>
<text x="32" y="36" font-size="20" font-weight="700">${escapeXml(model.title)}</text>
${edges}
${nodes}
</svg>`;
}

/** @param {GraphNode} node */
function renderSvgNode(node) {
  const x = node.x ?? 0;
  const y = node.y ?? 0;
  const width = node.width ?? defaultNodeWidth(node);
  const height = node.height ?? defaultNodeHeight(node);
  const label = escapeXml(node.label);
  if (node.type === "container") {
    return `<g><rect class="container" x="${x}" y="${y}" width="${width}" height="${height}" rx="8"/><text x="${x + 14}" y="${y + 24}" font-weight="700">${label}</text></g>`;
  }
  if (node.type === "decision") {
    const points = `${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`;
    return `<g><polygon class="node" points="${points}" fill="#fff8dc" stroke="#d69e2e"/><text x="${x + width / 2}" y="${y + height / 2 + 5}" text-anchor="middle">${label}</text></g>`;
  }
  if (node.type === "terminal" || node.type === "terminal-end") {
    const stroke = node.type === "terminal" ? "#2f9e44" : "#d9480f";
    return `<g><ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="#f8fafc" stroke="${stroke}" stroke-width="2"/><text x="${x + width / 2}" y="${y + height / 2 + 5}" text-anchor="middle">${label}</text></g>`;
  }
  return `<g><rect class="node" x="${x}" y="${y}" width="${width}" height="${height}" rx="8"/><text x="${x + width / 2}" y="${y + height / 2 + 5}" text-anchor="middle">${label}</text></g>`;
}

/**
 * @param {GraphEdge} edge
 * @param {Map<string, GraphNode>} byId
 */
function renderSvgEdge(edge, byId) {
  const from = byId.get(edge.from);
  const to = byId.get(edge.to);
  if (!from || !to) return "";
  const x1 = (from.x ?? 0) + (from.width ?? defaultNodeWidth(from)) / 2;
  const y1 = (from.y ?? 0) + (from.height ?? defaultNodeHeight(from));
  const x2 = (to.x ?? 0) + (to.width ?? defaultNodeWidth(to)) / 2;
  const y2 = to.y ?? 0;
  const label = edge.label ? `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 6}" text-anchor="middle">${escapeXml(edge.label)}</text>` : "";
  return `<g><path class="edge" marker-end="url(#arrow)" d="M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}"/>${label}</g>`;
}

/** @param {GraphModel} model */
function renderDrawioXml(model) {
  let id = 2;
  /** @type {Map<string, number>} */
  const ids = new Map();
  const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>'];
  for (const node of model.nodes) {
    const mxId = id++;
    ids.set(node.id, mxId);
    const style = node.type === "decision" ? "rhombus;whiteSpace=wrap;html=1;" : "rounded=1;whiteSpace=wrap;html=1;";
    cells.push(`<mxCell id="${mxId}" value="${escapeXml(node.label)}" style="${style}" vertex="1" parent="1"><mxGeometry x="${node.x ?? 0}" y="${node.y ?? 0}" width="${node.width ?? defaultNodeWidth(node)}" height="${node.height ?? defaultNodeHeight(node)}" as="geometry"/></mxCell>`);
  }
  for (const edge of model.edges) {
    const source = ids.get(edge.from);
    const target = ids.get(edge.to);
    if (!source || !target) continue;
    cells.push(`<mxCell id="${id++}" value="${escapeXml(edge.label ?? "")}" edge="1" parent="1" source="${source}" target="${target}" style="edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;"><mxGeometry relative="1" as="geometry"/></mxCell>`);
  }
  return `<mxfile><diagram name="${escapeXml(model.title)}"><mxGraphModel><root>${cells.join("")}</root></mxGraphModel></diagram></mxfile>`;
}

/** @param {unknown} value */
function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
