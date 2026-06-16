import test from "node:test";
import assert from "node:assert/strict";
import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);
const script = path.join(root, "skills", "fec-image-generation", "scripts", "png-qa.mjs");
const renderScript = path.join(root, "skills", "fec-image-generation", "scripts", "tech-diagram-render.mjs");
const interactiveScript = path.join(root, "skills", "fec-image-generation", "scripts", "interactive-diagram-server.mjs");

test("interactive-diagram-server starts, serves HTML, isolates sessions, and exports JSON", async () => {
  const server = await startInteractiveServer();
  try {
    const html = await httpRequest(server.port, "GET", "/?s=server-test");
    assert.equal(html.status, 200);
    assert.match(html.body, /frontend-craft Interactive Diagram/);
    assert.match(html.body, /EventSource\(`\/events\?s=/);

    const sessionA = `a-${Date.now()}`;
    const sessionB = `b-${Date.now()}`;

    assert.equal((await postCommand(server.port, sessionA, { cmd: "init", title: "A", direction: "TB" })).status, 200);
    assert.equal((await postCommand(server.port, sessionA, { cmd: "node", id: "start", label: "Start", type: "terminal" })).status, 200);
    assert.equal((await postCommand(server.port, sessionA, { cmd: "node", id: "done", label: "Done", type: "success" })).status, 200);
    assert.equal((await postCommand(server.port, sessionA, { cmd: "edge", from: "start", to: "done", label: "next" })).status, 200);
    assert.equal((await postCommand(server.port, sessionB, { cmd: "init", title: "B", direction: "LR" })).status, 200);
    assert.equal((await postCommand(server.port, sessionB, { cmd: "node", id: "solo", label: "Solo", type: "process" })).status, 200);

    const stateA = JSON.parse((await httpRequest(server.port, "GET", `/state?s=${sessionA}`)).body) as Array<{ cmd: string }>;
    const stateB = JSON.parse((await httpRequest(server.port, "GET", `/state?s=${sessionB}`)).body) as Array<{ cmd: string }>;
    assert.equal(stateA.length, 4);
    assert.equal(stateB.length, 2);

    const exported = JSON.parse((await httpRequest(server.port, "GET", `/export?s=${sessionA}&format=json`)).body) as {
      ok: boolean;
      graph: { title: string; nodes: Array<{ id: string }>; edges: Array<{ from: string; to: string }> };
    };
    assert.equal(exported.ok, true);
    assert.equal(exported.graph.title, "A");
    assert.deepEqual(exported.graph.nodes.map((node) => node.id).sort(), ["done", "start"]);
    assert.deepEqual(exported.graph.edges.map((edge) => `${edge.from}->${edge.to}`), ["start->done"]);

    const cleared = await httpRequest(server.port, "POST", `/clear?s=${sessionA}`, "");
    assert.equal(cleared.status, 200);
    const emptyA = JSON.parse((await httpRequest(server.port, "GET", `/state?s=${sessionA}`)).body) as unknown[];
    assert.deepEqual(emptyA, []);
  } finally {
    server.child.kill();
  }
});

test("interactive-diagram-server rejects malformed command JSON", async () => {
  const server = await startInteractiveServer();
  try {
    const result = await httpRequest(server.port, "POST", "/cmd?s=bad-json", "{not-json");
    assert.equal(result.status, 400);
    assert.match(result.body, /valid JSON/);
  } finally {
    server.child.kill();
  }
});

test("png-qa reports parseable json for a normal PNG", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-image-generation-"));
  const png = path.join(tmp, "normal.png");
  writePng(png, 120, 80, (x, y) => (x >= 32 && x <= 88 && y >= 24 && y <= 56 ? black : white));

  const result = spawnSync(process.execPath, [script, "--png", png, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout) as { ok: boolean; image: { width: number; height: number }; issues: unknown[] };
  assert.equal(report.ok, true);
  assert.equal(report.image.width, 120);
  assert.equal(report.image.height, 80);
  assert.deepEqual(report.issues, []);
});

test("png-qa detects blank images and edge clipping", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-image-generation-"));
  const blank = path.join(tmp, "blank.png");
  const clipped = path.join(tmp, "clipped.png");
  writePng(blank, 80, 60, () => white);
  writePng(clipped, 80, 60, (x, y) => (x <= 10 && y >= 20 && y <= 40 ? black : white));

  const blankResult = spawnSync(process.execPath, [script, "--png", blank, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  const clippedResult = spawnSync(process.execPath, [script, "--png", clipped, "--format", "markdown"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(blankResult.status, 2, blankResult.stderr);
  const blankReport = JSON.parse(blankResult.stdout) as { issues: Array<{ code: string }> };
  assert.ok(blankReport.issues.some((issue) => issue.code === "blank-image"));
  assert.equal(clippedResult.status, 2, clippedResult.stderr);
  assert.match(clippedResult.stdout, /edge-clipping/);
  assert.match(clippedResult.stdout, /Increase canvas\/viewBox padding/);
});

test("png-qa detects manifest overlap, connector collisions, stacking, and label overflow", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-image-generation-"));
  const png = path.join(tmp, "diagram.png");
  const manifest = path.join(tmp, "layout.json");
  writePng(png, 400, 240, (x, y) => (x >= 40 && x <= 360 && y >= 40 && y <= 200 ? black : white));
  fs.writeFileSync(
    manifest,
    JSON.stringify(
      {
        canvas: { width: 400, height: 240 },
        boxes: [
          { id: "a", x: 40, y: 80, width: 90, height: 50, label: "API" },
          { id: "b", x: 100, y: 96, width: 90, height: 50, label: "Extremely long label that cannot fit" },
          { id: "c", x: 300, y: 80, width: 80, height: 50, label: "DB" },
          { id: "outside", x: 360, y: 210, width: 70, height: 40, label: "Out" },
        ],
        connectors: [
          { id: "a-c", from: "a", to: "c", points: [[130, 105], [300, 105]] },
          { id: "stack-1", from: "a", to: "c", points: [[130, 180], [300, 180]] },
          { id: "stack-2", from: "a", to: "c", points: [[130, 181], [300, 181]] },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );

  const result = spawnSync(process.execPath, [script, "--png", png, "--manifest", manifest, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 2, result.stderr);
  const report = JSON.parse(result.stdout) as { issues: Array<{ code: string }>; nextActions: string[] };
  const issueCodes = new Set(report.issues.map((issue) => issue.code));
  assert.ok(issueCodes.has("box-overlap"));
  assert.ok(issueCodes.has("box-out-of-bounds"));
  assert.ok(issueCodes.has("label-overflow"));
  assert.ok(issueCodes.has("connector-through-label"));
  assert.ok(issueCodes.has("connector-stacking"));
  assert.ok(report.nextActions.some((action) => /node spacing|split dense groups/i.test(action)));
});

test("tech-diagram-render creates workflow HTML and PNG QA manifest", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-tech-diagram-"));
  const input = path.join(tmp, "workflow.json");
  const output = path.join(tmp, "workflow.html");
  const manifest = path.join(tmp, "workflow.layout.json");
  fs.writeFileSync(
    input,
    JSON.stringify({
      schema_version: 1,
      diagram_type: "workflow",
      meta: { title: "Release Workflow", subtitle: "PR to production" },
      lanes: [
        { id: "dev", label: "Developer" },
        { id: "ci", label: "CI" },
      ],
      nodes: [
        { id: "pr", lane: "dev", col: 0, type: "frontend", label: "Open PR" },
        { id: "test", lane: "ci", col: 1, type: "backend", label: "Run Tests" },
      ],
      edges: [{ from: "pr", to: "test", label: "trigger", variant: "emphasis" }],
    }),
    "utf8",
  );

  const result = spawnSync(process.execPath, [renderScript, "--input", input, "--output", output, "--type", "workflow", "--manifest", manifest, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout) as { ok: boolean; nodes: number; connectors: number };
  assert.equal(report.ok, true);
  assert.equal(report.nodes, 2);
  assert.equal(report.connectors, 1);
  const html = fs.readFileSync(output, "utf8");
  assert.match(html, /Release Workflow/);
  assert.match(html, /<svg class="tech-diagram"/);
  assert.match(html, /--frontend:/);
  assert.match(html, /Open PR/);
  assert.match(html, /Toggle theme/);
  const layout = JSON.parse(fs.readFileSync(manifest, "utf8")) as { canvas: { width: number }; boxes: unknown[]; connectors: unknown[] };
  assert.ok(layout.canvas.width >= 780);
  assert.equal(layout.boxes.length, 2);
  assert.equal(layout.connectors.length, 1);
});

test("tech-diagram-render creates architecture HTML, summary cards, legend, and PNG QA manifest", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-tech-diagram-"));
  const input = path.join(tmp, "architecture.json");
  const output = path.join(tmp, "architecture.html");
  const manifest = path.join(tmp, "architecture.layout.json");
  fs.writeFileSync(
    input,
    JSON.stringify({
      schema_version: 1,
      diagram_type: "architecture",
      meta: { title: "Checkout Architecture", subtitle: "Browser-ready system topology" },
      groups: [
        { id: "cloud", label: "Cloud boundary", type: "cloud", x: 160, y: 48, width: 650, height: 310 },
        { id: "trust", label: "Private service zone", type: "security", x: 360, y: 92, width: 400, height: 220 },
      ],
      nodes: [
        { id: "web", label: "Web Client", type: "frontend", x: 42, y: 174, sublabel: "React" },
        { id: "gateway", label: "API Gateway", type: "cloud", x: 210, y: 174, group: "cloud" },
        { id: "auth", label: "Auth Provider", type: "security", x: 210, y: 72, group: "cloud" },
        { id: "service", label: "Checkout Service", type: "backend", x: 420, y: 174, width: 148, group: "trust" },
        { id: "bus", label: "Event Bus", type: "messagebus", x: 430, y: 270, width: 128, height: 44, group: "trust" },
        { id: "db", label: "Orders DB", type: "database", x: 640, y: 174, group: "trust" },
      ],
      connections: [
        { from: "web", to: "gateway", label: "HTTPS", variant: "emphasis" },
        { from: "gateway", to: "service", label: "REST" },
        { from: "service", to: "db", label: "SQL" },
        { from: "service", to: "bus", label: "events", variant: "dashed", waypoints: [[494, 244]] },
        { from: "auth", to: "gateway", label: "JWT", variant: "security" },
      ],
      legend: [
        { label: "Client", type: "frontend" },
        { label: "Service", type: "backend" },
        { label: "Data", type: "database" },
        { label: "Security", type: "security" },
      ],
      summary: [
        { title: "Runtime", type: "backend", items: ["Gateway routes checkout traffic", "Service writes orders and emits events"] },
        { title: "Trust", type: "security", items: ["Auth flow is separate from order data", "Private service zone is grouped"] },
      ],
    }),
    "utf8",
  );

  const result = spawnSync(process.execPath, [renderScript, "--input", input, "--output", output, "--type", "architecture", "--manifest", manifest, "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout) as { ok: boolean; nodes: number; connectors: number };
  assert.equal(report.ok, true);
  assert.equal(report.nodes, 8);
  assert.equal(report.connectors, 5);
  const html = fs.readFileSync(output, "utf8");
  assert.match(html, /Checkout Architecture/);
  assert.match(html, /<svg class="tech-diagram"/);
  assert.match(html, /Cloud boundary/);
  assert.match(html, /Web Client/);
  assert.match(html, /Event Bus/);
  assert.match(html, /Legend/);
  assert.match(html, /summary-grid/);
  assert.match(html, /Gateway routes checkout traffic/);
  const layout = JSON.parse(fs.readFileSync(manifest, "utf8")) as { boxes: unknown[]; connectors: unknown[] };
  assert.equal(layout.boxes.length, 8);
  assert.equal(layout.connectors.length, 5);
});

test("tech-diagram-render supports sequence, dataflow, and lifecycle diagrams", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-tech-diagram-"));
  const cases = [
    {
      type: "sequence",
      model: {
        schema_version: 1,
        diagram_type: "sequence",
        meta: { title: "Cache Request" },
        participants: [
          { id: "web", type: "frontend", label: "Web App" },
          { id: "api", type: "backend", label: "API" },
        ],
        messages: [{ from: "web", to: "api", label: "GET /items" }],
      },
    },
    {
      type: "dataflow",
      model: {
        schema_version: 1,
        diagram_type: "dataflow",
        meta: { title: "Analytics Flow" },
        stages: [{ label: "Source" }, { label: "Store" }],
        nodes: [
          { id: "events", stage: 0, type: "frontend", label: "Events" },
          { id: "warehouse", stage: 1, type: "database", label: "Warehouse" },
        ],
        flows: [{ from: "events", to: "warehouse", label: "facts" }],
      },
    },
    {
      type: "lifecycle",
      model: {
        schema_version: 1,
        diagram_type: "lifecycle",
        meta: { title: "Run Lifecycle" },
        lanes: [{ id: "main", label: "Main" }],
        states: [
          { id: "queued", lane: "main", col: 0, type: "start", label: "Queued" },
          { id: "done", lane: "main", col: 1, type: "success", label: "Done" },
        ],
        transitions: [{ from: "queued", to: "done", label: "finish" }],
      },
    },
  ];

  for (const sample of cases) {
    const input = path.join(tmp, `${sample.type}.json`);
    const output = path.join(tmp, `${sample.type}.html`);
    fs.writeFileSync(input, JSON.stringify(sample.model), "utf8");
    const result = spawnSync(process.execPath, [renderScript, "--input", input, "--output", output, "--type", sample.type, "--format", "json"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, `${sample.type}: ${result.stderr}`);
    const html = fs.readFileSync(output, "utf8");
    assert.match(html, new RegExp(sample.model.meta.title));
    assert.match(html, /Download SVG/);
  }
});

test("tech-diagram-render reports type mismatches, duplicate ids, and unknown endpoints", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-tech-diagram-"));
  const mismatch = path.join(tmp, "mismatch.json");
  const duplicate = path.join(tmp, "duplicate.json");
  const unknown = path.join(tmp, "unknown.json");
  const output = path.join(tmp, "out.html");
  fs.writeFileSync(mismatch, JSON.stringify({ schema_version: 1, diagram_type: "sequence", meta: { title: "Wrong" }, participants: [], messages: [] }), "utf8");
  fs.writeFileSync(
    duplicate,
    JSON.stringify({
      schema_version: 1,
      diagram_type: "workflow",
      meta: { title: "Duplicate" },
      lanes: [{ id: "lane", label: "Lane" }],
      nodes: [
        { id: "same", lane: "lane", col: 0, label: "A" },
        { id: "same", lane: "lane", col: 1, label: "B" },
      ],
      edges: [],
    }),
    "utf8",
  );
  fs.writeFileSync(
    unknown,
    JSON.stringify({
      schema_version: 1,
      diagram_type: "workflow",
      meta: { title: "Unknown" },
      lanes: [{ id: "lane", label: "Lane" }],
      nodes: [{ id: "a", lane: "lane", col: 0, label: "A" }],
      edges: [{ from: "a", to: "missing" }],
    }),
    "utf8",
  );

  const mismatchResult = spawnSync(process.execPath, [renderScript, "--input", mismatch, "--output", output, "--type", "workflow", "--format", "json"], {
    cwd: root,
    encoding: "utf8",
  });
  const duplicateResult = spawnSync(process.execPath, [renderScript, "--input", duplicate, "--output", output, "--type", "workflow"], {
    cwd: root,
    encoding: "utf8",
  });
  const unknownResult = spawnSync(process.execPath, [renderScript, "--input", unknown, "--output", output, "--type", "workflow"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(mismatchResult.status, 1);
  assert.match(mismatchResult.stdout, /diagram_type/);
  assert.equal(duplicateResult.status, 1);
  assert.match(duplicateResult.stderr, /Duplicate id "same"/);
  assert.equal(unknownResult.status, 1);
  assert.match(unknownResult.stderr, /Unknown endpoint "missing"/);
});

test("tech-diagram-render reports architecture validation errors", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fec-tech-diagram-"));
  const output = path.join(tmp, "out.html");
  const cases = [
    {
      name: "mismatch",
      model: { schema_version: 1, diagram_type: "workflow", meta: { title: "Wrong" }, nodes: [], connections: [] },
      args: ["--format", "json"],
      expectedStdout: /diagram_type/,
    },
    {
      name: "unknown-group",
      model: {
        schema_version: 1,
        diagram_type: "architecture",
        meta: { title: "Unknown Group" },
        nodes: [{ id: "web", label: "Web", type: "frontend", x: 40, y: 40, group: "missing" }],
        connections: [],
      },
      expectedStderr: /Unknown group "missing"/,
    },
    {
      name: "unknown-endpoint",
      model: {
        schema_version: 1,
        diagram_type: "architecture",
        meta: { title: "Unknown Endpoint" },
        nodes: [{ id: "web", label: "Web", type: "frontend", x: 40, y: 40 }],
        connections: [{ from: "web", to: "api" }],
      },
      expectedStderr: /Unknown endpoint "api"/,
    },
    {
      name: "duplicate-id",
      model: {
        schema_version: 1,
        diagram_type: "architecture",
        meta: { title: "Duplicate" },
        nodes: [
          { id: "web", label: "Web", type: "frontend", x: 40, y: 40 },
          { id: "web", label: "Again", type: "frontend", x: 200, y: 40 },
        ],
        connections: [],
      },
      expectedStderr: /Duplicate id "web"/,
    },
    {
      name: "bad-type",
      model: {
        schema_version: 1,
        diagram_type: "architecture",
        meta: { title: "Bad Type" },
        nodes: [{ id: "web", label: "Web", type: "mystery", x: 40, y: 40 }],
        connections: [],
      },
      expectedStderr: /Unsupported node type "mystery"/,
    },
  ];

  for (const sample of cases) {
    const input = path.join(tmp, `${sample.name}.json`);
    fs.writeFileSync(input, JSON.stringify(sample.model), "utf8");
    const result = spawnSync(process.execPath, [renderScript, "--input", input, "--output", output, "--type", "architecture", ...(sample.args ?? [])], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 1, sample.name);
    if (sample.expectedStdout) assert.match(result.stdout, sample.expectedStdout);
    if (sample.expectedStderr) assert.match(result.stderr, sample.expectedStderr);
  }
});

async function startInteractiveServer(): Promise<{ child: ChildProcess; port: number }> {
  const child = spawn(process.execPath, [interactiveScript, "--port", "0"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const port = await new Promise<number>((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      reject(new Error(`interactive server did not start. stdout=${stdout} stderr=${stderr}`));
    }, 5000);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
      const line = stdout.split(/\r?\n/).find((candidate) => candidate.trim().startsWith("{"));
      if (!line) return;
      try {
        const status = JSON.parse(line) as { port: number };
        clearTimeout(timeout);
        resolve(status.port);
      } catch {
        // Wait for a complete JSON line.
      }
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("exit", (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timeout);
        reject(new Error(`interactive server exited with ${code}. stdout=${stdout} stderr=${stderr}`));
      }
    });
  });

  return { child, port };
}

function postCommand(port: number, session: string, command: Record<string, unknown>): Promise<{ status: number; body: string }> {
  return httpRequest(port, "POST", `/cmd?s=${encodeURIComponent(session)}`, JSON.stringify(command));
}

function httpRequest(port: number, method: string, requestPath: string, body?: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        host: "127.0.0.1",
        port,
        path: requestPath,
        method,
        headers: body === undefined ? undefined : { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          resolve({ status: response.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8") });
        });
      },
    );
    request.on("error", reject);
    if (body !== undefined) request.write(body);
    request.end();
  });
}

type Rgba = [number, number, number, number];

const white: Rgba = [255, 255, 255, 255];
const black: Rgba = [0, 0, 0, 255];

function writePng(filePath: string, width: number, height: number, pixelAt: (x: number, y: number) => Rgba): void {
  const rows: Buffer[] = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixelAt(x, y);
      const offset = 1 + x * 4;
      row[offset] = r;
      row[offset + 1] = g;
      row[offset + 2] = b;
      row[offset + 3] = a;
    }
    rows.push(row);
  }

  const chunks = [
    pngChunk("IHDR", ihdr(width, height)),
    pngChunk("IDAT", zlib.deflateSync(Buffer.concat(rows))),
    pngChunk("IEND", Buffer.alloc(0)),
  ];
  fs.writeFileSync(filePath, Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), ...chunks]));
}

function ihdr(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(13);
  buffer.writeUInt32BE(width, 0);
  buffer.writeUInt32BE(height, 4);
  buffer[8] = 8;
  buffer[9] = 6;
  buffer[10] = 0;
  buffer[11] = 0;
  buffer[12] = 0;
  return buffer;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
