import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);
const scripts = path.join(root, "skills/fec-image-generation/scripts");
const layout = () =>
  import(pathToFileURL(path.join(scripts, "diagram-layout.mjs")).href);

test("labels preserve Chinese, emoji, explicit breaks and long tokens", async () => {
  const { layoutText } = await layout();
  const source =
    "检查订单信息是否完整且符合审核条件👩‍💻\nLongUnbrokenIdentifier0123456789";
  const result = layoutText(source, 92);
  assert.equal(result.lines.join(""), source.replaceAll("\n", ""));
  assert.ok(result.lines.length > 2);
  assert.ok(result.lines.some((line: string) => line.includes("👩‍💻")));
  assert.ok(result.width <= 92);
});

test("small explicit boxes report overflow without changing dimensions", async () => {
  const { fitNodeText } = await layout();
  const box = {
    id: "n",
    x: 0,
    y: 0,
    width: 70,
    height: 24,
    label: "需要保留的完整中文标签",
    sublabel: "",
    type: "neutral",
  };
  const result = fitNodeText(box, { width: true, height: true });
  assert.equal(result.box.width, 70);
  assert.equal(result.box.height, 24);
  assert.ok(
    result.issues.some(
      (issue: { code: string; id: string }) =>
        issue.code === "node-text-overflow" && issue.id === "n",
    ),
  );
});

function render(model: object, kind: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-quality-"));
  // Callers only receive `dir` when this returns, so a failure here still has to clean it up itself.
  try {
    const input = path.join(dir, "模型 with spaces.json");
    const output = path.join(dir, "diagram.html");
    const manifest = path.join(dir, "layout.json");
    fs.writeFileSync(input, JSON.stringify(model));
    const result = spawnSync(
      process.execPath,
      [
        path.join(scripts, "tech-diagram-render.mjs"),
        "--input",
        input,
        "--output",
        output,
        "--type",
        kind,
        "--manifest",
        manifest,
        "--format",
        "json",
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return {
      dir,
      output,
      manifest,
      html: fs.readFileSync(output, "utf8"),
      geometry: JSON.parse(fs.readFileSync(manifest, "utf8")),
    };
  } catch (error) {
    fs.rmSync(dir, { recursive: true, force: true });
    throw error;
  }
}

test("workflow expands columns and lanes for tall Chinese nodes", () => {
  const nodes = ["a", "b", "c"].map((id, index) => ({
    id,
    lane: "main",
    col: index === 2 ? 1 : 0,
    label: "检查订单信息是否完整且符合审核条件，确认所有材料都已提交",
  }));
  const result = render(
    {
      schema_version: 1,
      diagram_type: "workflow",
      meta: { title: "Tall" },
      lanes: [{ id: "main", label: "Main" }],
      nodes,
      edges: [],
    },
    "workflow",
  );
  try {
    const boxes = result.geometry.boxes;
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i],
          b = boxes[j];
        assert.ok(
          a.x + a.width <= b.x ||
            b.x + b.width <= a.x ||
            a.y + a.height <= b.y ||
            b.y + b.height <= a.y,
        );
      }
  } finally {
    fs.rmSync(result.dir, { recursive: true, force: true });
  }
});

test("automatic routes avoid intervening nodes and separate reverse edges", async () => {
  const { routeConnector } = await layout();
  const a = { id: "a", x: 40, y: 100, width: 160, height: 80 };
  const b = { id: "b", x: 600, y: 100, width: 160, height: 80 };
  const obstacle = { x: 300, y: 70, width: 180, height: 140 };
  const route = routeConnector(a, b, [obstacle], []);
  assert.equal(route.issues.length, 0);
  assert.ok(route.points.length >= 4);
  for (let i = 1; i < route.points.length; i++) {
    const p = route.points[i - 1],
      q = route.points[i];
    assert.ok(
      !(
        p[1] === q[1] &&
        p[1] > obstacle.y &&
        p[1] < obstacle.y + obstacle.height &&
        Math.min(p[0], q[0]) < obstacle.x + obstacle.width &&
        Math.max(p[0], q[0]) > obstacle.x
      ),
    );
  }
  const reverse = routeConnector(b, a, [obstacle], [route.points]);
  assert.notDeepEqual(reverse.points, [...route.points].reverse());
});

test("diamond ports use polygon boundary and explicit routes remain intact", async () => {
  const { boundaryPort, routeConnector } = await layout();
  const box = {
    id: "a",
    x: 20,
    y: 30,
    width: 200,
    height: 100,
    shape: "diamond",
  };
  assert.deepEqual(boundaryPort(box, "right"), [220, 80]);
  const points = [
    [240, 80],
    [240, 300],
  ];
  const result = routeConnector(
    box,
    { id: "b", x: 300, y: 300, width: 100, height: 80 },
    [{ x: 230, y: 100, width: 30, height: 100 }],
    [],
    points,
  );
  assert.deepEqual(result.points.slice(1, -1), points);
  assert.ok(
    result.issues.some(
      (issue: { code: string }) => issue.code === "route-obstructed",
    ),
  );
});

test("rendered labels are escaped and do not truncate after two lines", () => {
  const label =
    "One two three four five six seven eight nine ten eleven twelve <value>&";
  const result = render(
    {
      schema_version: 1,
      diagram_type: "workflow",
      meta: { title: "Test" },
      lanes: [{ id: "main", label: "Main" }],
      nodes: [{ id: "a", lane: "main", col: 0, label }],
      edges: [],
    },
    "workflow",
  );
  try {
    assert.match(result.html, /&lt;/);
    assert.match(result.html, /&gt;/);
    assert.match(result.html, /&amp;/);
    assert.ok(!result.html.includes("<value>"));
    const texts = result.geometry.labels.filter(
      (entry: { owner: string }) => entry.owner === "a",
    );
    assert.equal(texts[0].lines.join(""), label);
  } finally {
    fs.rmSync(result.dir, { recursive: true, force: true });
  }
});

test("sequence self call has visible loop and long labels fit its canvas", () => {
  const result = render(
    {
      schema_version: 1,
      diagram_type: "sequence",
      meta: { title: "Self call" },
      participants: [{ id: "api", label: "订单服务与权限检查" }],
      messages: [
        {
          from: "api",
          to: "api",
          label: "验证当前用户是否有权查看订单并读取缓存记录",
        },
        { from: "api", to: "api", label: "记录访问日志", variant: "return" },
      ],
    },
    "sequence",
  );
  try {
    const first = result.geometry.connectors[0].points;
    assert.equal(first.length, 4);
    assert.notEqual(first[0][1], first[3][1]);
    for (const label of result.geometry.labels) {
      assert.ok(label.x >= 0 && label.y >= 0);
      assert.ok(label.x + label.width <= result.geometry.canvas.width);
      assert.ok(label.y + label.height <= result.geometry.canvas.height);
    }
    assert.ok(result.geometry.connectors[1].points[0][1] > first[3][1]);
  } finally {
    fs.rmSync(result.dir, { recursive: true, force: true });
  }
});

test("standalone SVG retains its theme and complete text", () => {
  const result = render(
    {
      schema_version: 1,
      diagram_type: "workflow",
      meta: { title: "Export" },
      lanes: [{ id: "main", label: "Main" }],
      nodes: [{ id: "a", lane: "main", col: 0, label: "检查身份和访问权限" }],
      edges: [],
    },
    "workflow",
  );
  try {
    const output = path.join(result.dir, "独立 diagram.svg");
    const exported = spawnSync(
      process.execPath,
      [
        path.join(scripts, "export-diagram.mjs"),
        "--input",
        result.output,
        "--output",
        output,
        "--format",
        "svg",
      ],
      { encoding: "utf8" },
    );
    assert.equal(exported.status, 0, exported.stderr);
    const svg = fs.readFileSync(output, "utf8");
    assert.match(svg, /<style/);
    assert.match(svg, /--text:/);
    assert.match(svg, /\.surface\s*\{/);
    assert.match(svg, /marker path/);
    assert.doesNotMatch(svg, /body\s*\{/);
    assert.match(svg, /检查身份和访问权限/);
  } finally {
    fs.rmSync(result.dir, { recursive: true, force: true });
  }
});

test("browser export measures text and scales every manifest coordinate", async (t) => {
  const { findBrowser } = await import(
    pathToFileURL(path.join(scripts, "diagram-browser.mjs")).href
  );
  if (!findBrowser()) {
    t.skip("No local Chromium; raster measurement unverified.");
    return;
  }
  const result = render(
    {
      schema_version: 1,
      diagram_type: "workflow",
      meta: { title: "PNG" },
      lanes: [{ id: "main", label: "Main" }],
      nodes: [{ id: "a", lane: "main", col: 0, label: "订单信息完整性检查" }],
      edges: [],
    },
    "workflow",
  );
  try {
    const output = path.join(result.dir, "image with 中文.png");
    const manifest = path.join(result.dir, "actual.json");
    const exported = spawnSync(
      process.execPath,
      [
        path.join(scripts, "export-diagram.mjs"),
        "--input",
        result.output,
        "--format",
        "png",
        "--output",
        output,
        "--scale",
        "2",
        "--manifest",
        result.manifest,
        "--output-manifest",
        manifest,
      ],
      { encoding: "utf8", timeout: 40000 },
    );
    assert.equal(exported.status, 0, exported.stderr);
    const png = fs.readFileSync(output);
    const actual = JSON.parse(fs.readFileSync(manifest, "utf8"));
    assert.equal(png.readUInt32BE(16), actual.canvas.width);
    assert.equal(png.readUInt32BE(20), actual.canvas.height);
    assert.equal(actual.measurement, "browser");
    assert.equal(actual.boxes[0].x, result.geometry.boxes[0].x * 2);
    assert.ok(actual.labels[0].width > 0);
  } finally {
    fs.rmSync(result.dir, { recursive: true, force: true });
  }
});

test("QA checks actual labels and self calls without treating groups as nodes", async () => {
  const { analyzeManifest } = await import(
    pathToFileURL(path.join(scripts, "png-qa.mjs")).href
  );
  const issues: Array<{ code: string }> = [],
    actions: string[] = [];
  analyzeManifest(
    { width: 800, height: 500 },
    {
      canvas: { width: 800, height: 500 },
      boxes: [
        { id: "group", kind: "group", x: 20, y: 20, width: 500, height: 400 },
        { id: "a", x: 80, y: 80, width: 160, height: 80, label: "完整文字" },
      ],
      labels: [
        {
          id: "label",
          owner: "a",
          kind: "node",
          text: "完整文字",
          lines: ["完整文字"],
          x: 220,
          y: 90,
          width: 100,
          height: 20,
        },
      ],
      connectors: [
        {
          id: "self",
          from: "a",
          to: "a",
          points: [
            [160, 240],
            [160, 240],
          ],
        },
      ],
      issues: [],
      measurement: "browser",
    },
    issues,
    actions,
    false,
  );
  assert.ok(issues.some((issue) => issue.code === "node-text-overflow"));
  assert.ok(issues.some((issue) => issue.code === "degenerate-connector"));
  assert.ok(!issues.some((issue) => issue.code === "box-overlap"));
});

test("Mermaid route reports missing tools without claiming an export", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-mermaid-"));
  try {
    const input = path.join(dir, "flow.mmd"),
      output = path.join(dir, "flow.svg");
    fs.writeFileSync(input, "flowchart TD\n A-->B");
    const result = spawnSync(
      process.execPath,
      [
        path.join(scripts, "mermaid-render.mjs"),
        "--input",
        input,
        "--output",
        output,
        "--cli",
        path.join(dir, "missing.mjs"),
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Mermaid CLI unavailable/);
    assert.ok(!fs.existsSync(output));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("Mermaid invocation handles spaces and rejects stale output", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec mermaid 中文 "));
  try {
    const cli = path.join(dir, "cli.mjs"),
      input = path.join(dir, "flow.mmd"),
      output = path.join(dir, "output.svg");
    fs.writeFileSync(input, "flowchart TD\n A-->B");
    fs.writeFileSync(
      cli,
      `import fs from 'node:fs';if(process.argv.includes('--version')) console.log('test-cli');else fs.writeFileSync(process.argv[process.argv.indexOf('-o')+1],'<svg xmlns="http://www.w3.org/2000/svg"><text>stub</text></svg>');`,
    );
    const invoke = () =>
      spawnSync(
        process.execPath,
        [
          path.join(scripts, "mermaid-render.mjs"),
          "--input",
          input,
          "--output",
          output,
          "--cli",
          cli,
        ],
        { encoding: "utf8" },
      );
    assert.equal(invoke().status, 0);
    fs.writeFileSync(
      cli,
      `if(process.argv.includes('--version')) console.log('test-cli');`,
    );
    assert.equal(invoke().status, 1);
    assert.match(fs.readFileSync(output, "utf8"), /stub/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("explicit architecture geometry stays stable and reports invalid containment", () => {
  const result = render(
    {
      schema_version: 1,
      diagram_type: "architecture",
      meta: { title: "Geometry" },
      groups: [
        { id: "g", label: "Group", x: 100, y: 100, width: 200, height: 200 },
      ],
      nodes: [
        {
          id: "a",
          label: "A",
          x: 110,
          y: 105,
          width: 160,
          height: 80,
          group: "g",
        },
        { id: "b", label: "B", x: 120, y: 110, width: 160, height: 80 },
      ],
      connections: [],
    },
    "architecture",
  );
  try {
    assert.equal(
      result.geometry.boxes.find((b: { id: string }) => b.id === "a").x,
      110,
    );
    const codes = result.geometry.issues.map((i: { code: string }) => i.code);
    assert.ok(codes.includes("group-containment"));
    assert.ok(codes.includes("box-overlap"));
  } finally {
    fs.rmSync(result.dir, { recursive: true, force: true });
  }
});

test("QA rejects text crossing and unknown owners but allows endpoint contact", async () => {
  const { analyzeManifest } = await import(
    pathToFileURL(path.join(scripts, "png-qa.mjs")).href
  );
  const issues: Array<{ code: string }> = [];
  analyzeManifest(
    { width: 500, height: 300 },
    {
      canvas: { width: 500, height: 300 },
      boxes: [
        { id: "a", x: 10, y: 10, width: 80, height: 60 },
        { id: "b", x: 200, y: 10, width: 80, height: 60 },
      ],
      labels: [
        {
          id: "unknown",
          owner: "missing",
          kind: "node",
          text: "x",
          lines: ["x"],
          x: 120,
          y: 30,
          width: 30,
          height: 20,
        },
      ],
      connectors: [
        {
          id: "a-b",
          from: "a",
          to: "b",
          points: [
            [90, 40],
            [200, 40],
          ],
        },
      ],
    },
    issues,
    new Set(),
    false,
  );
  assert.ok(issues.some((i) => i.code === "connector-through-text"));
  assert.ok(issues.some((i) => i.code === "label-owner-missing"));
  assert.ok(!issues.some((i) => i.code === "connector-through-label"));
});
test("source and localized script modules are byte identical", () => {
  for (const name of [
    "tech-diagram-render.mjs",
    "export-diagram.mjs",
    "png-qa.mjs",
    "diagram-layout.mjs",
    "diagram-browser.mjs",
    "mermaid-render.mjs",
  ])
    assert.deepEqual(
      fs.readFileSync(path.join(scripts, name)),
      fs.readFileSync(
        path.join(
          root,
          "localized/zh-CN/skills/fec-image-generation/scripts",
          name,
        ),
      ),
    );
});

test("QA diagnoses negative waypoint clipping", async () => {
  const { analyzeManifest } = await import(
    pathToFileURL(path.join(scripts, "png-qa.mjs")).href
  );
  const issues: Array<{ code: string }> = [];
  analyzeManifest(
    { width: 500, height: 300 },
    {
      boxes: [
        { id: "a", x: 10, y: 10, width: 80, height: 60 },
        { id: "b", x: 200, y: 10, width: 80, height: 60 },
      ],
      connectors: [
        {
          id: "edge",
          from: "a",
          to: "b",
          points: [
            [90, 40],
            [-40, 40],
            [200, 40],
          ],
        },
      ],
    },
    issues,
    new Set(),
    false,
  );
  assert.ok(issues.some((i) => i.code === "connector-out-of-bounds"));
});
test("actor and step annotations preserve text in measurement manifest", () => {
  const result = render(
    {
      schema_version: 1,
      diagram_type: "workflow",
      meta: { title: "Annotations" },
      lanes: [{ id: "main", label: "Main" }],
      nodes: [
        {
          id: "a",
          lane: "main",
          col: 0,
          label: "Approve",
          actor: "A long actor description with full ownership",
          step: "123",
        },
      ],
      edges: [],
    },
    "workflow",
  );
  try {
    assert.ok(
      result.geometry.labels.some(
        (l: { id: string; text: string }) =>
          l.id === "a-actor" && l.text.includes("full ownership"),
      ),
    );
    assert.ok(
      result.geometry.labels.some(
        (l: { id: string; text: string }) =>
          l.id === "a-step" && l.text === "123",
      ),
    );
  } finally {
    fs.rmSync(result.dir, { recursive: true, force: true });
  }
});

test("Mermaid failure and timeout do not replace previous output", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-mermaid-failure-")),
    cli = path.join(dir, "cli.mjs"),
    input = path.join(dir, "source.mmd"),
    output = path.join(dir, "diagram.svg");
  try {
    fs.writeFileSync(input, "unsupported syntax preserved");
    fs.writeFileSync(output, "previous output");
    for (const behavior of ["process.exit(2)", "setTimeout(()=>{},5000)"]) {
      fs.writeFileSync(
        cli,
        `if(process.argv.includes('--version'))console.log('stub');else {${behavior}}`,
      );
      const result = spawnSync(
        process.execPath,
        [
          path.join(scripts, "mermaid-render.mjs"),
          "--input",
          input,
          "--output",
          output,
          "--cli",
          cli,
          "--timeout",
          "1000",
        ],
        { encoding: "utf8", timeout: 10000 },
      );
      assert.equal(result.status, 1);
      assert.match(result.stderr, /Mermaid render failed/);
      assert.equal(fs.readFileSync(output, "utf8"), "previous output");
      assert.equal(
        fs.readFileSync(input, "utf8"),
        "unsupported syntax preserved",
      );
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("long sequence messages retain lifelines through the final message", () => {
  const result = render(
    {
      schema_version: 1,
      diagram_type: "sequence",
      meta: { title: "Long sequence" },
      participants: [
        { id: "a", label: "Client" },
        { id: "b", label: "Service" },
      ],
      messages: [
        {
          from: "a",
          to: "b",
          label: "A long message with complete content ".repeat(40),
        },
        { from: "b", to: "a", label: "Return", variant: "return" },
      ],
    },
    "sequence",
  );
  try {
    const last = result.geometry.connectors.at(-1).points[0][1];
    const lifelines = [
      ...result.html.matchAll(/<line[^>]*y2="([\d.]+)"[^>]*class="lifeline"/g),
    ];
    assert.equal(lifelines.length, 2);
    assert.ok(lifelines.every((line) => Number(line[1]) > last));
  } finally {
    fs.rmSync(result.dir, { recursive: true, force: true });
  }
});
