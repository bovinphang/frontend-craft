import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { resolvePluginRoot } from "../../src/install/shared/resolve-plugin-root.js";

const root = resolvePluginRoot(import.meta.url);
const scriptsDir = path.join(root, "skills", "fec-drawio-studio", "scripts");

function run(script: string, args: string[] = [], options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}): string {
  return execFileSync(process.execPath, [path.join(scriptsDir, script), ...args], {
    cwd: options.cwd ?? root,
    env: options.env,
    encoding: "utf8",
  });
}

function withTempDir<T>(fn: (dir: string) => T): T {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fec-drawio-studio-"));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("diagram-lint accepts valid drawio and fails dangling edges", () => {
  withTempDir((dir) => {
    const good = path.join(dir, "good.drawio");
    const bad = path.join(dir, "bad.drawio");
    fs.writeFileSync(
      good,
      `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="a" vertex="1" parent="1"><mxGeometry x="0" y="0" width="80" height="40" as="geometry"/></mxCell><mxCell id="b" vertex="1" parent="1"><mxGeometry x="140" y="0" width="80" height="40" as="geometry"/></mxCell><mxCell id="e" edge="1" parent="1" source="a" target="b"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>`,
    );
    fs.writeFileSync(
      bad,
      `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="a" vertex="1" parent="1"><mxGeometry x="0" y="0" width="80" height="40" as="geometry"/></mxCell><mxCell id="e" edge="1" parent="1" source="a" target="missing"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>`,
    );
    const goodResult = JSON.parse(run("diagram-lint.mjs", [good, "--format", "json"])) as { ok: boolean };
    assert.equal(goodResult.ok, true);
    const failed = spawnSync(process.execPath, [path.join(scriptsDir, "diagram-lint.mjs"), bad, "--format", "json"], {
      encoding: "utf8",
    });
    assert.equal(failed.status, 1);
    assert.match(failed.stdout, /missing/);
  });
});

test("diagram-url preserves CJK and percent labels in URL fragment", () => {
  withTempDir((dir) => {
    const file = path.join(dir, "cjk.drawio");
    const xml = `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="a" value="登录 100%"/></root></mxGraphModel></diagram></mxfile>`;
    fs.writeFileSync(file, xml);
    const url = run("diagram-url.mjs", [file]).trim();
    const encoded = url.split("#R")[1];
    const inflated = zlib.inflateRawSync(Buffer.from(encoded, "base64")).toString("utf8");
    assert.equal(decodeURIComponent(inflated), xml);
  });
});

test("diagram-url creates drawio import URLs for xml, mermaid, and csv", () => {
  withTempDir((dir) => {
    const xmlFile = path.join(dir, "diagram.drawio");
    const mermaidFile = path.join(dir, "flow.mmd");
    const csvFile = path.join(dir, "org.csv");
    fs.writeFileSync(xmlFile, `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>`);
    fs.writeFileSync(mermaidFile, "flowchart TD\n  A[登录] --> B[Done 100%]\n");
    fs.writeFileSync(csvFile, "label,parent\nCEO,\nCTO,CEO\n");

    const xml = JSON.parse(run("diagram-url.mjs", [xmlFile, "--create", "--type", "xml", "--json"])) as {
      url: string;
      mode: string;
      type: string;
      windowsShortcut: string;
    };
    assert.equal(xml.mode, "create");
    assert.equal(xml.type, "xml");
    assert.match(xml.url, /^https:\/\/app\.diagrams\.net\/\?/);
    assert.match(xml.url, /#create=/);
    assert.match(xml.windowsShortcut, /^\[InternetShortcut\]\r\nURL=https:\/\/app\.diagrams\.net\//);
    assert.equal(readCreatePayload(xml.url).type, "xml");

    const mermaid = JSON.parse(run("diagram-url.mjs", [mermaidFile, "--create", "--type", "mermaid", "--base-url", "https://drawio.example.com/app", "--json"])) as {
      url: string;
    };
    assert.match(mermaid.url, /^https:\/\/drawio\.example\.com\/app\/\?/);
    assert.equal(readCreatePayload(mermaid.url).type, "mermaid");
    assert.match(inflateCreatePayload(mermaid.url), /登录/);

    const csv = JSON.parse(run("diagram-url.mjs", [csvFile, "--create", "--type", "csv", "--lightbox", "--json"])) as {
      url: string;
    };
    assert.equal(readCreatePayload(csv.url).type, "csv");
    assert.match(csv.url, /lightbox=1/);
  });
});

test("diagram-url rejects non-xml inputs without create mode", () => {
  withTempDir((dir) => {
    const file = path.join(dir, "flow.mmd");
    fs.writeFileSync(file, "flowchart TD\n  A --> B\n");
    const result = spawnSync(process.execPath, [path.join(scriptsDir, "diagram-url.mjs"), file, "--type", "mermaid"], {
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /require --create/);
  });
});

test("diagram-lint reports xml comments, missing roots, unescaped entities, and html label warnings", () => {
  withTempDir((dir) => {
    const file = path.join(dir, "bad.drawio");
    fs.writeFileSync(
      file,
      `<mxfile><diagram><mxGraphModel><root><!-- note --><mxCell id="a" value="Fish & Chips &lt;b&gt;hot&lt;/b&gt;" vertex="1" parent="1" style="rounded=1"><mxGeometry x="0" y="0" width="80" height="40" as="geometry"/></mxCell><mxCell id="e" edge="1" parent="1" source="a" target="missing"/></root></mxGraphModel></diagram></mxfile>`,
    );
    const result = spawnSync(process.execPath, [path.join(scriptsDir, "diagram-lint.mjs"), file, "--format", "json"], {
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    const report = JSON.parse(result.stdout) as { errors: string[]; warnings: string[]; ok: boolean };
    assert.equal(report.ok, false);
    assert.ok(report.errors.some((message) => /comments are not allowed/.test(message)));
    assert.ok(report.errors.some((message) => /missing root cell id 0/.test(message)));
    assert.ok(report.errors.some((message) => /missing default layer cell id 1/.test(message)));
    assert.ok(report.errors.some((message) => /unescaped ampersand/.test(message)));
    assert.ok(report.errors.some((message) => /self-closing/.test(message) || /missing mxGeometry/.test(message)));
    assert.ok(report.warnings.some((message) => /html=1/.test(message)));
  });
});

test("diagram-lint reports layout and label quality warnings", () => {
  withTempDir((dir) => {
    const file = path.join(dir, "quality.drawio");
    fs.writeFileSync(
      file,
      `<mxfile><diagram><mxGraphModel pageWidth="120" pageHeight="80"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="a" value="Line\\nBreak" vertex="1" parent="1" style="rounded=1;fontSize=10;"><mxGeometry x="13" y="20" width="120" height="70" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>`,
    );

    const report = JSON.parse(run("diagram-lint.mjs", [file, "--format", "json"])) as {
      ok: boolean;
      errors: string[];
      warnings: string[];
    };

    assert.equal(report.ok, true);
    assert.deepEqual(report.errors, []);
    assert.ok(report.warnings.some((message) => /literal \\n/.test(message)));
    assert.ok(report.warnings.some((message) => /whiteSpace=wrap/.test(message)));
    assert.ok(report.warnings.some((message) => /html=1/.test(message)));
    assert.ok(report.warnings.some((message) => /fontSize 10/.test(message)));
    assert.ok(report.warnings.some((message) => /10px grid/.test(message)));
    assert.ok(report.warnings.some((message) => /pageWidth 120/.test(message)));
    assert.ok(report.warnings.some((message) => /pageHeight 80/.test(message)));
  });
});

test("diagram-lint reports flowchart readability warnings", () => {
  withTempDir((dir) => {
    const file = path.join(dir, "flowchart-quality.drawio");
    fs.writeFileSync(
      file,
      `<mxfile><diagram><mxGraphModel dx="400" dy="300" pageWidth="1000" pageHeight="1200"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="stage" value="Stage" vertex="1" parent="1" style="swimlane;whiteSpace=wrap;html=1;fontSize=13;rounded=1;"><mxGeometry x="20" y="40" width="920" height="180" as="geometry"/></mxCell><mxCell id="a" value="Start" vertex="1" parent="stage" style="rounded=1;whiteSpace=wrap;html=1;fontSize=12;align=left;"><mxGeometry x="20" y="50" width="160" height="70" as="geometry"/></mxCell><mxCell id="b" value="Done" vertex="1" parent="stage" style="rounded=1;whiteSpace=wrap;html=1;fontSize=12;align=center;"><mxGeometry x="240" y="50" width="160" height="70" as="geometry"/></mxCell><mxCell id="e" edge="1" parent="stage" source="a" target="b" style="strokeWidth=2;"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>`,
    );

    const report = JSON.parse(run("diagram-lint.mjs", [file, "--format", "json"])) as {
      warnings: string[];
    };

    assert.ok(report.warnings.some((message) => /pageWidth 1000/.test(message)));
    assert.ok(report.warnings.some((message) => /dx 400/.test(message)));
    assert.ok(report.warnings.some((message) => /dy 300/.test(message)));
    assert.ok(report.warnings.some((message) => /connectable="0"/.test(message)));
    assert.ok(report.warnings.some((message) => /collapsible=0/.test(message)));
    assert.ok(report.warnings.some((message) => /rounded=0/.test(message)));
    assert.ok(report.warnings.some((message) => /title fontSize 13/.test(message)));
    assert.ok(report.warnings.some((message) => /align=center/.test(message)));
    assert.ok(report.warnings.some((message) => /orthogonalEdgeStyle/.test(message)));
  });
});

test("diagram-lint strict mode fails on overlap warnings", () => {
  withTempDir((dir) => {
    const file = path.join(dir, "overlap.drawio");
    fs.writeFileSync(
      file,
      `<mxfile><diagram><mxGraphModel pageWidth="400" pageHeight="300"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="a" vertex="1" parent="1" style="rounded=1;whiteSpace=wrap;html=1;fontSize=14;"><mxGeometry x="40" y="40" width="120" height="60" as="geometry"/></mxCell><mxCell id="b" vertex="1" parent="1" style="rounded=1;whiteSpace=wrap;html=1;fontSize=14;"><mxGeometry x="100" y="60" width="120" height="60" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>`,
    );

    const result = spawnSync(process.execPath, [path.join(scriptsDir, "diagram-lint.mjs"), file, "--format", "json", "--strict"], {
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    const report = JSON.parse(result.stdout) as { ok: boolean; warnings: string[] };
    assert.equal(report.ok, true);
    assert.ok(report.warnings.some((message) => /overlap/.test(message)));
  });
});

test("drawio-export dry-run returns command with export options", () => {
  withTempDir((dir) => {
    const input = path.join(dir, "diagram.drawio");
    const output = path.join(dir, "diagram.png");
    const fakeDrawio = path.join(dir, process.platform === "win32" ? "drawio.exe" : "drawio");
    fs.writeFileSync(input, `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>`);
    fs.writeFileSync(fakeDrawio, "");

    const report = JSON.parse(
      run("drawio-export.mjs", [
        input,
        "--drawio",
        fakeDrawio,
        "--format",
        "png",
        "--output",
        output,
        "--scale",
        "2",
        "--width",
        "2000",
        "--border",
        "20",
        "--dry-run",
        "--json",
      ]),
    ) as { ok: boolean; command: string[]; output: string; format: string; dryRun: boolean };

    assert.equal(report.ok, true);
    assert.equal(report.command[0], path.resolve(fakeDrawio));
    assert.deepEqual(report.command.slice(1), ["-x", "-f", "png", "-s", "2", "--width", "2000", "--border", "20", "-o", output, input]);
    assert.equal(report.output, output);
    assert.equal(report.format, "png");
    assert.equal(report.dryRun, true);
  });
});

test("drawio-export dry-run can discover drawio from PATH", () => {
  withTempDir((dir) => {
    const input = path.join(dir, "diagram.drawio");
    const fakeDrawio = path.join(dir, process.platform === "win32" ? "drawio.exe" : "drawio");
    fs.writeFileSync(input, `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>`);
    fs.writeFileSync(fakeDrawio, "");

    const report = JSON.parse(
      run("drawio-export.mjs", [input, "--dry-run", "--json"], {
        env: {
          ...process.env,
          PATH: dir,
          Path: dir,
          PATHEXT: ".EXE",
          ProgramFiles: path.join(dir, "missing"),
          LOCALAPPDATA: path.join(dir, "missing"),
        },
      }),
    ) as { ok: boolean; command: string[] };

    assert.equal(report.ok, true);
    assert.equal(normalizeExecutablePath(report.command[0]), normalizeExecutablePath(path.resolve(fakeDrawio)));
  });
});

test("drawio-export reports install guidance when CLI is missing", () => {
  withTempDir((dir) => {
    const input = path.join(dir, "diagram.drawio");
    const missing = path.join(dir, "missing-drawio");
    fs.writeFileSync(input, `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>`);

    const result = spawnSync(process.execPath, [path.join(scriptsDir, "drawio-export.mjs"), input, "--drawio", missing, "--dry-run", "--json"], {
      encoding: "utf8",
    });

    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /draw\.io desktop CLI was not found/);
    assert.match(result.stderr, /winget install JGraph\.Draw/);
  });
});

function readCreatePayload(url: string): { type: string; compressed: boolean; data: string } {
  const encoded = url.split("#create=")[1];
  assert.ok(encoded);
  return JSON.parse(decodeURIComponent(encoded)) as { type: string; compressed: boolean; data: string };
}

function inflateCreatePayload(url: string): string {
  const payload = readCreatePayload(url);
  return decodeURIComponent(zlib.inflateRawSync(Buffer.from(payload.data, "base64")).toString("utf8"));
}

function normalizeExecutablePath(value: string): string {
  return process.platform === "win32" ? value.toLowerCase() : value;
}

test("png-embed-fix appends missing IEND tail and is idempotent", () => {
  withTempDir((dir) => {
    const file = path.join(dir, "diagram.drawio.png");
    fs.writeFileSync(file, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00, 0x00, 0x00]));
    const first = JSON.parse(run("png-embed-fix.mjs", [file, "--json"])) as { changed: boolean };
    const second = JSON.parse(run("png-embed-fix.mjs", [file, "--json"])) as { changed: boolean };
    assert.equal(first.changed, true);
    assert.equal(second.changed, false);
    assert.ok(fs.readFileSync(file).subarray(-12).equals(Buffer.from([0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82])));
  });
});

test("shape and brand tools return stable matches", () => {
  const shapes = JSON.parse(run("shape-query.mjs", ["aws lambda", "--limit", "3", "--format", "json"])) as Array<{ title: string }>;
  assert.ok(shapes.some((shape) => /lambda/i.test(shape.title)));

  const brands = JSON.parse(run("brand-symbols.mjs", ["claude", "--json"])) as Array<{ brand: string; style: string }>;
  assert.equal(brands[0].brand, "claude");
  assert.match(brands[0].style, /shape=image/);

  const unknown = spawnSync(process.execPath, [path.join(scriptsDir, "brand-symbols.mjs"), "zzzzzzzzzz", "--json"], {
    encoding: "utf8",
  });
  assert.equal(unknown.status, 1);
});

test("module scanners produce small dependency graphs", () => {
  withTempDir((dir) => {
    fs.writeFileSync(path.join(dir, "a.js"), "import './b.js';\n");
    fs.writeFileSync(path.join(dir, "b.js"), "export const b = 1;\n");
    const js = JSON.parse(run("scan-js-modules.mjs", [dir])) as { edges: Array<{ source: string; target: string }> };
    assert.deepEqual(js.edges, [{ source: "a", target: "b" }]);
  });

  withTempDir((dir) => {
    fs.writeFileSync(path.join(dir, "a.ts"), "export * from './b';\n");
    fs.writeFileSync(path.join(dir, "b.ts"), "export const b = 1;\n");
    const ts = JSON.parse(run("scan-ts-modules.mjs", [dir])) as { edges: Array<{ source: string; target: string }> };
    assert.deepEqual(ts.edges, [{ source: "a", target: "b" }]);
  });

  withTempDir((dir) => {
    fs.writeFileSync(path.join(dir, "a.py"), "import b\nclass A: pass\nclass B(A): pass\n");
    fs.writeFileSync(path.join(dir, "b.py"), "x = 1\n");
    const py = JSON.parse(run("scan-python-modules.mjs", [dir])) as { edges: Array<{ source: string; target: string }> };
    const classes = JSON.parse(run("scan-python-classes.mjs", [dir])) as { edges: Array<{ source: string; target: string }> };
    assert.deepEqual(py.edges, [{ source: "a", target: "b" }]);
    assert.deepEqual(classes.edges, [{ source: "a.B", target: "a.A" }]);
  });

  withTempDir((dir) => {
    fs.writeFileSync(path.join(dir, "go.mod"), "module example.com/m\n");
    fs.mkdirSync(path.join(dir, "a"));
    fs.mkdirSync(path.join(dir, "b"));
    fs.writeFileSync(path.join(dir, "a", "a.go"), 'package a\nimport _ "example.com/m/b"\n');
    fs.writeFileSync(path.join(dir, "b", "b.go"), "package b\n");
    const go = JSON.parse(run("scan-go-packages.mjs", [dir])) as { edges: Array<{ source: string; target: string }> };
    assert.deepEqual(go.edges, [{ source: "example.com/m/a", target: "example.com/m/b" }]);
  });

  withTempDir((dir) => {
    fs.mkdirSync(path.join(dir, "src"));
    fs.writeFileSync(path.join(dir, "src", "a.rs"), "use crate::b;\n");
    fs.writeFileSync(path.join(dir, "src", "b.rs"), "pub fn b() {}\n");
    const rust = JSON.parse(run("scan-rust-modules.mjs", [dir])) as { edges: Array<{ source: string; target: string }> };
    assert.deepEqual(rust.edges, [{ source: "a", target: "b" }]);
  });
});

test("layout-graph reports missing Graphviz without affecting other tools", () => {
  withTempDir((dir) => {
    const graph = path.join(dir, "graph.json");
    fs.writeFileSync(graph, JSON.stringify({ nodes: [{ id: "a" }], edges: [] }));
    const result = spawnSync(process.execPath, [path.join(scriptsDir, "layout-graph.mjs"), graph], {
      env: { ...process.env, PATH: "" },
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Graphviz `dot` not found/);
  });
});
